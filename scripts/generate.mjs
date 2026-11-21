// Converts the Playwright documentation in ../docs/src (Playwright's own
// markdown dialect) into plain markdown pages that VitePress can build.
//
// Output:
//   src/                 Node.js pages (site root)
//   src/<locale>/        Python, Java and .NET pages
//   src/public/images/   Shared images
//   .vitepress/generated/site.json   Sidebars and locale data for the config
//
// Set DOCS_LANGS (for example "js" or "js,python") to limit the languages.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_DIR = path.resolve(SITE_DIR, '..');
const DOCS_DIR = path.join(REPO_DIR, 'docs', 'src');
const OUT_DIR = path.join(SITE_DIR, 'src');
const GENERATED_DIR = path.join(SITE_DIR, '.vitepress', 'generated');

const md = require(path.join(REPO_DIR, 'utils', 'markdown.js'));
const { parseApi } = require(path.join(REPO_DIR, 'utils', 'doclint', 'api_parser.js'));
const { processCodeGroups, parseCodeLang } = require(path.join(REPO_DIR, 'utils', 'doclint', 'documentation.js'));

/** @type {Record<string, { label: string, locale: string, base: string }>} */
const LANGUAGES = {
  js: { label: 'Node.js', locale: 'root', base: '/' },
  python: { label: 'Python', locale: 'python', base: '/python/' },
  java: { label: 'Java', locale: 'java', base: '/java/' },
  csharp: { label: '.NET', locale: 'dotnet', base: '/dotnet/' },
};
const ALL_LANGS = Object.keys(LANGUAGES);
const selectedLangs = (process.env.DOCS_LANGS || ALL_LANGS.join(','))
    .split(',').map(s => s.trim()).filter(Boolean);
for (const lang of selectedLangs) {
  if (!LANGUAGES[lang])
    throw new Error(`Unknown language "${lang}" in DOCS_LANGS. Use one of: ${ALL_LANGS.join(', ')}`);
}

// ---------------------------------------------------------------------------
// Name helpers

function kebab(s) {
  return s
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map(w => w.toLowerCase())
      .join('-');
}

function snake(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').toLowerCase();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function varName(className) {
  const m = className.match(/^([A-Z]+)([A-Z][a-z].*)$/);
  if (m)
    return m[1].toLowerCase() + m[2];
  return className.charAt(0).toLowerCase() + className.slice(1);
}

function memberAnchor(clazz, member) {
  // Events can have the same name as a method, for example "close".
  const kind = member.kind === 'event' ? 'event-' : '';
  return `${kebab(clazz.name)}-${kind}${kebab(member.name)}`;
}

function classPage(className) {
  return `class-${className.toLowerCase()}`;
}

function memberDisplayName(lang, member) {
  const clazz = member.clazz;
  const v = varName(clazz.name);
  const alias = member.alias;
  switch (lang) {
    case 'python': {
      const name = snake(alias);
      if (member.kind === 'event')
        return `${v}.on("${alias}")`;
      return member.kind === 'method' ? `${snake(v)}.${name}()` : `${snake(v)}.${name}`;
    }
    case 'java':
      if (member.kind === 'event')
        return `${v}.on${capitalize(alias)}()`;
      return `${v}.${alias}()`;
    case 'csharp': {
      const name = capitalize(alias);
      if (member.kind === 'method')
        return `${capitalize(v)}.${name}${member.async ? 'Async' : ''}()`;
      return `${capitalize(v)}.${name}`;
    }
    default:
      if (member.kind === 'event')
        return `${v}.on('${alias}')`;
      return member.kind === 'method' ? `${v}.${alias}()` : `${v}.${alias}`;
  }
}

function argName(lang, arg) {
  return lang === 'python' ? snake(arg.alias) : arg.alias;
}

// ---------------------------------------------------------------------------
// Markdown transforms

const TAB_LABELS = {
  js: 'JavaScript', ts: 'TypeScript', library: 'Library', test: 'Test',
  bash: 'Bash', powershell: 'PowerShell', batch: 'Batch',
  async: 'Async', sync: 'Sync', npm: 'npm', yarn: 'yarn', pnpm: 'pnpm',
};

const HIGHLIGHTER_ALIASES = { batch: 'bat', py: 'python' };

/** Returns the highlighter and target language of a code block. */
function codeInfo(codeLang) {
  const m = codeLang.match(/^(\w+) (js|python|java|csharp)$/);
  if (m)
    return { highlighter: m[1], language: m[2] };
  const parsed = parseCodeLang(codeLang);
  return { highlighter: parsed.highlighter, language: parsed.language };
}

function highlighterFor(codeLang) {
  const { highlighter } = codeInfo(codeLang);
  return HIGHLIGHTER_ALIASES[highlighter] || highlighter;
}

function renderCodeBlock(node, label) {
  const fence = node.lines.some(l => l.trim().startsWith('```')) ? '````' : '```';
  const highlight = node.highlight || '';
  const title = label ? ` [${label}]` : '';
  return [`${fence}${highlighterFor(node.codeLang)}${highlight}${title}`, ...node.lines, fence].join('\n');
}

function codeGroup(blocks) {
  return ['::: code-group', '', ...blocks.map(b => b + '\n'), ':::'].join('\n');
}

/**
 * Applies language filtering and code groups to a list of nodes, recursively.
 * Code blocks become text nodes with ready VitePress markup.
 */
function transformNodes(nodes, lang) {
  let result;
  try {
    result = processCodeGroups(nodes, lang, tabs => [{
      type: 'text',
      text: codeGroup(tabs.map(tab => renderCodeBlock(tab.spec, TAB_LABELS[tab.value] || capitalize(tab.value)))),
    }]);
  } catch {
    result = nodes;
  }
  const out = [];
  for (const node of result) {
    if (node.type === 'code') {
      const { language } = codeInfo(node.codeLang);
      if (language && language !== lang)
        continue;
      const block = renderCodeBlock(node, node.title);
      out.push({ type: 'text', text: node.title ? codeGroup([block]) : block });
      continue;
    }
    // Paragraphs marked with **langs: x**.
    if (node.codeLang && node.type !== 'code') {
      const only = node.codeLang.split(',').map(s => s.trim());
      if (!only.includes(lang))
        continue;
    }
    if (node.children)
      node.children = transformNodes(node.children, lang);
    out.push(node);
  }
  return out;
}

const NOTE_TYPES = { note: 'info', info: 'info', tip: 'tip', warning: 'warning', caution: 'warning', danger: 'danger' };

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/'/g, '&#39;');
}

/** Fixes constructs that VitePress does not understand, after rendering. */
function postProcess(text) {
  // Admonitions.
  text = text.replace(/^(\s*):::(\w+)\s*$/gm, (m, indent, type) => `${indent}::: ${NOTE_TYPES[type] || 'info'}`);
  // Docusaurus <Tabs values={[...]}> -> <Tabs :tabs='[...]'>.
  text = text.replace(/<Tabs\b([\s\S]*?)values=\{\[([\s\S]*?)\]\s*\}>/g, (m, attrs, values) => {
    const tabs = [...values.matchAll(/\{\s*label:\s*['"]([^'"]*)['"],\s*value:\s*['"]([^'"]*)['"]\s*\}/g)]
        .map(v => ({ label: v[1], value: v[2] }));
    const groupId = attrs.match(/groupId="([^"]*)"/)?.[1] ?? '';
    const defaultValue = attrs.match(/defaultValue="([^"]*)"/)?.[1] ?? tabs[0]?.value ?? '';
    return `<Tabs group-id="${groupId}" default-value="${defaultValue}" :tabs='${escapeAttr(JSON.stringify(tabs))}'>`;
  });
  // JSX style objects: style={{fontSize:'smaller'}} -> style="font-size: smaller".
  text = text.replace(/style=\{\{([^}]*)\}\}/g, (m, body) => {
    const rules = [...body.matchAll(/(\w+)\s*:\s*['"]([^'"]*)['"]/g)]
        .map(([, key, value]) => `${key.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}: ${value}`);
    return `style="${rules.join('; ')}"`;
  });
  // JSX expressions in code: <code>{`text`}</code> -> <code v-pre>text</code>.
  text = text.replace(/<code>\{`([^`]*)`\}<\/code>/g, '<code v-pre>$1</code>');
  // Images live in the public folder.
  text = text.replace(/\]\(\.\.?\/images\//g, '](/images/');
  text = text.replace(/src="\.\.?\/images\//g, 'src="/images/');
  return text;
}

// ---------------------------------------------------------------------------
// Documentation model with link rendering

function loadDocumentation(lang) {
  const params = path.join(DOCS_DIR, 'api', 'params.md');
  let documentation = parseApi(path.join(DOCS_DIR, 'api'));
  /** @type {Map<string, string>} */
  const groups = new Map();
  for (const cls of documentation.classesArray)
    groups.set(cls.name, 'Library');
  if (lang === 'js') {
    const extra = [
      ['Test Runner', parseApi(path.join(DOCS_DIR, 'test-api'), params)],
      ['Test Reporter', parseApi(path.join(DOCS_DIR, 'test-reporter-api'))],
      ['Electron', parseApi(path.join(DOCS_DIR, 'electron-api'), params)],
      ['Android', parseApi(path.join(DOCS_DIR, 'mobile-api'), params)],
    ];
    for (const [group, doc] of extra) {
      for (const cls of doc.classesArray)
        groups.set(cls.name, group);
      documentation = documentation.mergeWith(doc);
    }
  }
  documentation.filterForLanguage(lang);
  documentation.copyDocsFromSuperclasses([]);

  const base = LANGUAGES[lang].base;
  const memberUrl = member => `${base}api/${classPage(member.clazz.name)}#${memberAnchor(member.clazz, member)}`;
  documentation.setLinkRenderer(({ clazz, member, param, option, href }) => {
    if (clazz)
      return href ? undefined : `[${clazz.name}](${base}api/${classPage(clazz.name)})`;
    if (member && (param || option)) {
      const item = param || option;
      const name = lang === 'python' ? snake(item.alias) : item.alias;
      return `[\`${name}\`](${href || memberUrl(member) + '-option-' + kebab(item.name)})`;
    }
    if (member)
      return `[\`${memberDisplayName(lang, member)}\`](${href || memberUrl(member)})`;
    return undefined;
  });
  return { documentation, groups };
}

function renderLinksSafe(documentation, nodes) {
  md.visitAll(nodes, node => {
    if (!node.text)
      return;
    try {
      node.text = documentation.renderLinksInText(node.text, undefined);
    } catch {
      // A reference to a member that does not exist in this language.
      node.text = node.text.replace(/\[`\w+: ([^\]]+)`\](?:\([^)]*\))?/g, (m, name) => `\`${name}\``);
      try {
        node.text = documentation.renderLinksInText(node.text, undefined);
      } catch {
      }
    }
  });
}

function renderSpec(spec, lang) {
  if (!spec || !spec.length)
    return '';
  const nodes = transformNodes(spec.map(n => md.clone(n)), lang);
  return postProcess(md.render(nodes, { omitLastCR: true })).trim();
}

function indentText(text, indent) {
  return text.split('\n').map(l => (l ? indent + l : l)).join('\n');
}

// ---------------------------------------------------------------------------
// API pages

function typeToString(type) {
  if (!type)
    return 'void';
  if (type.union)
    return type.union.map(typeToString).join(' | ');
  if (type.args || type.returnType || type.name === 'function')
    return `function(${(type.args || []).map(typeToString).join(', ')})${type.returnType ? ': ' + typeToString(type.returnType) : ''}`;
  if (type.templates)
    return `${type.name}<${type.templates.map(typeToString).join(', ')}>`;
  return type.name;
}

function badge(text, type = 'info') {
  return `<Badge type="${type}" text="${text}" />`;
}

function renderArg(lang, arg, anchorBase, memberSince, indent, depth = 0) {
  const lines = [];
  const since = arg.since && arg.since !== memberSince ? ' ' + badge(`Added in: ${arg.since}`) : '';
  const optional = arg.required ? '' : ' *(optional)*';
  const anchor = depth === 0 ? `<a id="${anchorBase}-option-${kebab(arg.name)}"></a>` : '';
  lines.push(`${indent}- ${anchor}\`${argName(lang, arg)}\` \`${typeToString(arg.type)}\`${optional}${since}`);
  const spec = renderSpec(arg.spec, lang);
  if (spec)
    lines.push('', indentText(spec, indent + '  '));
  const props = arg.type ? arg.type.deepProperties() : [];
  if (props.length && depth < 4) {
    lines.push('');
    for (const prop of props) {
      const nested = arg.name === 'options' && depth === 0;
      lines.push(renderArg(lang, prop, anchorBase, memberSince, indent + '  ', nested ? 0 : depth + 1));
    }
  }
  return lines.join('\n');
}

function renderMember(lang, clazz, member) {
  const out = [];
  const anchor = memberAnchor(clazz, member);
  out.push(`### ${memberDisplayName(lang, member)} {#${anchor}}`, '');
  const badges = [];
  if (member.since)
    badges.push(badge(`Added in: ${member.since}`));
  if (member.async && lang === 'js')
    badges.push(badge('async', 'tip'));
  if (badges.length)
    out.push(badges.join(' '), '');
  if (member.deprecated)
    out.push('::: danger Deprecated', member.deprecated, ':::', '');
  if (member.discouraged)
    out.push('::: warning Discouraged', member.discouraged, ':::', '');
  const spec = renderSpec(member.spec, lang);
  if (spec)
    out.push(spec, '');
  if (member.argsArray.length) {
    out.push('**Arguments**', '');
    for (const arg of member.argsArray)
      out.push(renderArg(lang, arg, anchor, member.since, ''));
    out.push('');
  }
  if (member.kind === 'method' && member.type && member.type.name !== 'void') {
    const t = typeToString(member.type);
    out.push('**Returns**', '', `- \`${member.async && lang === 'js' ? `Promise<${t}>` : t}\``, '');
  }
  if (member.kind === 'property' && member.type)
    out.push('**Type**', '', `- \`${typeToString(member.type)}\``, '');
  if (member.kind === 'event' && member.type)
    out.push('**Event data**', '', `- \`${typeToString(member.type)}\``, '');
  return out.join('\n');
}

function renderClass(lang, clazz) {
  const out = ['---', `title: ${clazz.name}`, 'outline: 2', '---', '', `# ${clazz.name}`, ''];
  if (clazz.since)
    out.push(badge(`Added in: ${clazz.since}`), '');
  if (clazz.extends)
    out.push(`Extends: [${clazz.extends}](./${classPage(clazz.extends)})`, '');
  const spec = renderSpec(clazz.spec, lang);
  if (spec)
    out.push(spec, '');
  const sections = [
    ['Methods', m => m.kind === 'method' && !m.deprecated],
    ['Properties', m => m.kind === 'property' && !m.deprecated],
    ['Events', m => m.kind === 'event' && !m.deprecated],
    ['Deprecated', m => !!m.deprecated],
  ];
  const sortKey = m => m.alias.toLowerCase();
  for (const [title, filter] of sections) {
    const members = clazz.membersArray.filter(filter).sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
    if (!members.length)
      continue;
    out.push(`## ${title}`, '');
    for (const member of members)
      out.push(renderMember(lang, clazz, member), '');
  }
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// Guides

const LANG_SUFFIX = /-((?:js|python|java|csharp)(?:-(?:js|python|java|csharp))*)$/;

const CATEGORIES = [
  { text: 'Getting Started', ids: ['intro', 'writing-tests', 'codegen-intro', 'running-tests', 'trace-viewer-intro', 'ci-intro', 'getting-started-vscode', 'library', 'release-notes'] },
  { text: 'Playwright Test', ids: ['test-agents', 'test-annotations', 'test-cli', 'test-configuration', 'test-use-options', 'test-fixtures', 'test-global-setup-teardown', 'test-parallel', 'test-parameterize', 'test-projects', 'test-reporters', 'test-retries', 'test-sharding', 'test-timeouts', 'test-typescript', 'test-ui-mode', 'test-webserver', 'test-runners', 'junit'] },
  { text: 'Migration', ids: ['protractor', 'puppeteer', 'testing-library'] },
  { text: 'Integrations', ids: ['docker', 'ci', 'selenium-grid', 'test-components', 'webview2'] },
  { text: 'Supported Languages', ids: ['languages'] },
];

function parseFrontMatter(nodes) {
  const props = nodes.find(n => n.type === 'properties');
  const result = {};
  if (props) {
    for (const line of props.lines) {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m)
        result[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
    }
  }
  return { meta: result, nodes: nodes.filter(n => n !== props) };
}

function generateGuides(lang, documentation, outDir) {
  const pages = [];
  for (const file of fs.readdirSync(DOCS_DIR)) {
    if (!file.endsWith('.md'))
      continue;
    const base = file.slice(0, -3);
    const suffix = base.match(LANG_SUFFIX);
    const langs = suffix ? suffix[1].split('-') : ALL_LANGS;
    if (!langs.includes(lang))
      continue;
    const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
    const parsed = parseFrontMatter(md.parse(content));
    const id = parsed.meta.id || base.replace(LANG_SUFFIX, '');
    const title = parsed.meta.title || id;
    let nodes = md.filterNodesForLanguage(parsed.nodes, lang);
    renderLinksSafe(documentation, nodes);
    nodes = transformNodes(nodes, lang);
    const body = postProcess(md.render(nodes));
    const page = ['---', `title: ${JSON.stringify(title)}`, '---', '', `# ${title}`, '', body].join('\n');
    fs.writeFileSync(path.join(outDir, `${id}.md`), page);
    pages.push({ id, title });
  }
  return pages;
}

function guideSidebar(lang, pages) {
  const base = LANGUAGES[lang].base;
  const byId = new Map(pages.map(p => [p.id, p]));
  const used = new Set();
  const groups = [];
  for (const category of CATEGORIES) {
    const items = category.ids.filter(id => byId.has(id)).map(id => {
      used.add(id);
      return { text: byId.get(id).title, link: `${base}${id}` };
    });
    if (items.length)
      groups.push({ text: category.text, collapsed: false, items });
  }
  const rest = pages.filter(p => !used.has(p.id)).sort((a, b) => a.title.localeCompare(b.title));
  groups.splice(2, 0, { text: 'Guides', collapsed: false, items: rest.map(p => ({ text: p.title, link: `${base}${p.id}` })) });
  return groups;
}

function apiSidebar(lang, classes, groups) {
  const base = LANGUAGES[lang].base;
  const order = ['Library', 'Test Runner', 'Test Reporter', 'Electron', 'Android'];
  return order.map(group => ({
    text: group === 'Library' ? 'Classes' : group,
    collapsed: group !== 'Library' && group !== 'Test Runner',
    items: classes.filter(c => groups.get(c.name) === group)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(c => ({ text: c.name, link: `${base}api/${classPage(c.name)}` })),
  })).filter(g => g.items.length);
}

function homePage(lang) {
  const { label, base } = LANGUAGES[lang];
  return `---
layout: home
title: Playwright for ${label}

hero:
  name: Playwright
  text: Reliable end-to-end testing for modern web apps
  tagline: Documentation for Playwright ${label}
  actions:
    - theme: brand
      text: Get started
      link: ${base}intro
    - theme: alt
      text: API reference
      link: ${base}api/class-playwright

features:
  - title: Any browser, any platform
    details: Test on Chromium, Firefox and WebKit, on Windows, Linux and macOS, locally or on CI.
  - title: Resilient, no flaky tests
    details: Auto-wait, web-first assertions and tracing remove the main causes of flaky tests.
  - title: Full isolation, fast execution
    details: Browser contexts give each test a new browser profile in milliseconds.
---
`;
}

// ---------------------------------------------------------------------------
// Main

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT_DIR, 'public'), { recursive: true });
  fs.cpSync(path.join(DOCS_DIR, 'images'), path.join(OUT_DIR, 'public', 'images'), { recursive: true });

  const site = { locales: {} };
  for (const lang of selectedLangs) {
    const info = LANGUAGES[lang];
    const outDir = info.locale === 'root' ? OUT_DIR : path.join(OUT_DIR, info.locale);
    fs.mkdirSync(path.join(outDir, 'api'), { recursive: true });

    const { documentation, groups } = loadDocumentation(lang);
    for (const clazz of documentation.classesArray)
      fs.writeFileSync(path.join(outDir, 'api', `${classPage(clazz.name)}.md`), renderClass(lang, clazz));
    const pages = generateGuides(lang, documentation, outDir);
    fs.writeFileSync(path.join(outDir, 'index.md'), homePage(lang));

    site.locales[info.locale] = {
      label: info.label,
      base: info.base,
      sidebar: {
        [`${info.base}api/`]: apiSidebar(lang, documentation.classesArray, groups),
        [info.base]: guideSidebar(lang, pages),
      },
    };
    console.log(`${info.label}: ${pages.length} guides, ${documentation.classesArray.length} API classes`);
  }
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.writeFileSync(path.join(GENERATED_DIR, 'site.json'), JSON.stringify(site, null, 2));
}

main();
