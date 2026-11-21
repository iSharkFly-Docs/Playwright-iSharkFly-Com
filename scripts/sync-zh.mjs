// Builds the Simplified Chinese mirror of the site in src/zh/.
//
// For every English page in src/ (Node.js at the root, plus python/, java/, dotnet/):
//   - if i18n/zh/<same path> exists, that translated page is used;
//   - otherwise the English page is copied and marked `untranslated: true`,
//     so the theme can show a "not translated yet" notice.
// Site-absolute links ("/intro", "/python/api/...") are moved under /zh/ so readers
// stay in the Chinese site. Images and other static files are not changed.
//
// src/zh/ is generated: do not edit it. Put translations in i18n/zh/ instead,
// using the same relative path and English-style links (for example "/intro.md").

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(SITE_DIR, 'src');
const ZH_OUT_DIR = path.join(SRC_DIR, 'zh');
const ZH_TRANSLATIONS_DIR = path.join(SITE_DIR, 'i18n', 'zh');

// Top-level folders in src/ that are not English pages.
const SKIP_DIRS = new Set(['zh', 'public']);
// Site-absolute paths that point to static files and must not get the /zh prefix.
const STATIC_PREFIXES = ['images/', 'img/', 'zh/'];

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

function toZhPath(target) {
  return STATIC_PREFIXES.some(prefix => target.startsWith(prefix)) ? `/${target}` : `/zh/${target}`;
}

function localizeLinks(text) {
  return text
    // Markdown links and images: [text](/path)
    .replace(/\]\(\/(?!\/)([^)\s]*)/g, (_, target) => `](${toZhPath(target)}`)
    // HTML attributes: href="/path"
    .replace(/\bhref="\/(?!\/)([^"]*)"/g, (_, target) => `href="${toZhPath(target)}"`)
    // Front matter links, for example on the home pages: "link: /intro"
    .replace(/^(\s*link:\s*)\/(?!\/)(\S*)/gm, (_, prefix, target) => `${prefix}${toZhPath(target)}`);
}

function markUntranslated(text) {
  if (text.startsWith('---\n') || text.startsWith('---\r\n'))
    return text.replace(/^---\r?\n/, '---\nuntranslated: true\n');
  return `---\nuntranslated: true\n---\n\n${text}`;
}

function main() {
  fs.rmSync(ZH_OUT_DIR, { recursive: true, force: true });

  let translated = 0;
  const pages = listMarkdown(SRC_DIR);
  for (const rel of pages) {
    const translationFile = path.join(ZH_TRANSLATIONS_DIR, rel);
    let text;
    if (fs.existsSync(translationFile)) {
      text = fs.readFileSync(translationFile, 'utf8');
      translated++;
    } else {
      text = markUntranslated(fs.readFileSync(path.join(SRC_DIR, rel), 'utf8'));
    }
    const outFile = path.join(ZH_OUT_DIR, rel);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, localizeLinks(text));
  }

  // Translations without a matching English page are probably stale.
  if (fs.existsSync(ZH_TRANSLATIONS_DIR)) {
    const known = new Set(pages);
    for (const rel of listMarkdown(ZH_TRANSLATIONS_DIR)) {
      if (!known.has(rel))
        console.warn(`[sync-zh] i18n/zh/${rel} has no English page in src/ and was skipped.`);
    }
  }

  console.log(`[sync-zh] ${pages.length} pages written to src/zh/ (${translated} translated).`);
}

main();
