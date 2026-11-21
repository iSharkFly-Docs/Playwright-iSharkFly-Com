// Assembles the bilingual site that VitePress builds, in site/ (generated, git-ignored).
//
// Simplified Chinese is the default language and is served from the site root;
// English is served from /en/.
//
// Input:
//   src/            English pages (Node.js at the root, plus python/, java/, dotnet/),
//                   created by scripts/generate.mjs, and src/public/ (images).
//   i18n/zh/        Chinese translations, using the same relative paths as src/.
//
// Output:
//   site/           Chinese pages. A page from i18n/zh/ is used when it exists; otherwise
//                   the English page is copied and marked `untranslated: true`, so the
//                   theme shows a "not translated yet" notice.
//   site/en/        English pages, with site-absolute links moved under /en/.
//   site/public/    Copy of src/public/.
//
// Write translations with the same links as the English pages (for example "/intro.md").

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(SITE_DIR, 'src');
const OUT_DIR = path.join(SITE_DIR, 'site');
const EN_DIR = 'en';
const ZH_TRANSLATIONS_DIR = path.join(SITE_DIR, 'i18n', 'zh');

// Top-level folders in src/ that are not English pages.
const SKIP_DIRS = new Set(['public', 'zh', EN_DIR]);
// Site-absolute paths that point to static files and must not get a language prefix.
const STATIC_PREFIXES = ['images/', 'img/', `${EN_DIR}/`];

function listMarkdown(dir, rel = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!rel && SKIP_DIRS.has(entry.name))
        continue;
      files.push(...listMarkdown(path.join(dir, entry.name), entryRel));
    } else if (entry.name.endsWith('.md')) {
      files.push(entryRel);
    }
  }
  return files;
}

function toEnglishPath(target) {
  return STATIC_PREFIXES.some(prefix => target.startsWith(prefix)) ? `/${target}` : `/${EN_DIR}/${target}`;
}

function moveLinksUnderEnglish(text) {
  return text
    // Markdown links and images: [text](/path)
    .replace(/\]\(\/(?!\/)([^)\s]*)/g, (_, target) => `](${toEnglishPath(target)}`)
    // HTML attributes: href="/path"
    .replace(/\bhref="\/(?!\/)([^"]*)"/g, (_, target) => `href="${toEnglishPath(target)}"`)
    // Front matter links, for example on the home pages: "link: /intro"
    .replace(/^(\s*link:\s*)\/(?!\/)(\S*)/gm, (_, prefix, target) => `${prefix}${toEnglishPath(target)}`);
}

function markUntranslated(text) {
  if (text.startsWith('---\n') || text.startsWith('---\r\n'))
    return text.replace(/^---\r?\n/, '---\nuntranslated: true\n');
  return `---\nuntranslated: true\n---\n\n${text}`;
}

function write(rel, text) {
  const file = path.join(OUT_DIR, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (fs.existsSync(path.join(SRC_DIR, 'public')))
    fs.cpSync(path.join(SRC_DIR, 'public'), path.join(OUT_DIR, 'public'), { recursive: true });

  let translated = 0;
  const pages = listMarkdown(SRC_DIR);
  for (const rel of pages) {
    const english = fs.readFileSync(path.join(SRC_DIR, rel), 'utf8');
    write(`${EN_DIR}/${rel}`, moveLinksUnderEnglish(english));

    const translationFile = path.join(ZH_TRANSLATIONS_DIR, rel);
    if (fs.existsSync(translationFile)) {
      write(rel, fs.readFileSync(translationFile, 'utf8'));
      translated++;
    } else {
      write(rel, markUntranslated(english));
    }
  }

  // Translations without a matching English page are probably stale.
  if (fs.existsSync(ZH_TRANSLATIONS_DIR)) {
    const known = new Set(pages);
    for (const rel of listMarkdown(ZH_TRANSLATIONS_DIR)) {
      if (!known.has(rel))
        console.warn(`[sync-zh] i18n/zh/${rel} has no English page in src/ and was skipped.`);
    }
  }

  console.log(`[sync-zh] ${pages.length} pages: Chinese in site/ (${translated} translated), English in site/${EN_DIR}/.`);
}

main();
