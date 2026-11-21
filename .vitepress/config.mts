import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type DefaultTheme, type LocaleConfig } from 'vitepress';

type GeneratedLocale = {
  label: string;
  base: string;
  sidebar: DefaultTheme.SidebarMulti;
};

const siteFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'generated', 'site.json');
if (!fs.existsSync(siteFile))
  throw new Error('Run "npm run generate" first. The file .vitepress/generated/site.json is missing.');
const site: { locales: Record<string, GeneratedLocale> } = JSON.parse(fs.readFileSync(siteFile, 'utf8'));
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// English source pages, used to know which pages exist for each programming language.
const englishSrcDir = path.join(rootDir, 'src');

// ---------------------------------------------------------------------------
// Two switchable dimensions:
//   - reading language: Simplified Chinese (default, site root) or English (/en/).
//     scripts/sync-zh.mjs assembles both into site/, which VitePress builds.
//   - programming language: Node.js (no prefix), Python, Java, .NET
// Every combination is one VitePress locale. The nav bar switcher
// (theme/components/NavBarLanguageSwitcher.vue) shows the two dimensions separately.

const EN_PREFIX = '/en';

// Chinese names for the sidebar group headings. Page titles stay as they are
// until the pages are translated.
const zhSidebarText: Record<string, string> = {
  'Getting Started': '入门',
  'Playwright Test': 'Playwright Test',
  'Guides': '指南',
  'Migration': '迁移',
  'Integrations': '集成',
  'Supported Languages': '支持的语言',
  'Classes': '类',
  'Test Runner': '测试运行器',
  'Test Reporter': '测试报告器',
  'Electron': 'Electron',
  'Android': 'Android',
};

function enLink(link: string) {
  return link.startsWith('/') ? EN_PREFIX + link : link;
}

function mapSidebar(
  sidebar: DefaultTheme.SidebarMulti,
  mapLink: (link: string) => string,
  mapGroupText: (text: string) => string,
): DefaultTheme.SidebarMulti {
  const mapItems = (items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] => items.map(item => ({
    ...item,
    ...(item.items ? { text: mapGroupText(item.text ?? ''), items: mapItems(item.items) } : {}),
    ...(item.link ? { link: mapLink(item.link) } : {}),
  }));
  return Object.fromEntries(Object.entries(sidebar).map(([key, value]) => [
    mapLink(key),
    Array.isArray(value) ? mapItems(value) : { ...value, base: mapLink(value.base), items: mapItems(value.items) },
  ]));
}

const zhThemeText: DefaultTheme.Config = {
  outline: { level: [2, 3], label: '本页目录' },
  docFooter: { prev: '上一页', next: '下一页' },
  darkModeSwitchLabel: '外观',
  lightModeSwitchTitle: '切换到浅色模式',
  darkModeSwitchTitle: '切换到深色模式',
  sidebarMenuLabel: '菜单',
  returnToTopLabel: '回到顶部',
  langMenuLabel: '切换语言',
  skipToContentLabel: '跳到正文',
  notFound: {
    title: '页面未找到',
    quote: '你要找的页面不存在，或者已经被移动。',
    linkLabel: '返回首页',
    linkText: '返回首页',
  },
  footer: {
    message: '基于 Apache 2.0 许可证发布。',
    copyright: 'Copyright © Microsoft',
  },
};

const zhSearchText = {
  button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
  modal: {
    displayDetails: '显示详细列表',
    resetButtonTitle: '清除查询',
    backButtonTitle: '关闭搜索',
    noResultsText: '没有找到结果',
    footer: {
      selectText: '选择',
      selectKeyAriaLabel: '回车',
      navigateText: '切换',
      navigateUpKeyAriaLabel: '向上',
      navigateDownKeyAriaLabel: '向下',
      closeText: '关闭',
      closeKeyAriaLabel: 'Esc',
    },
  },
};

const zhLocales: LocaleConfig<DefaultTheme.Config> = {};
const enLocales: LocaleConfig<DefaultTheme.Config> = {};
for (const [key, locale] of Object.entries(site.locales)) {
  // Chinese: same keys and paths as the generated English site had (root, python, java, dotnet).
  zhLocales[key] = {
    label: `简体中文 · ${locale.label}`,
    lang: 'zh-CN',
    link: locale.base,
    title: 'Playwright',
    description: `Playwright ${locale.label} 中文文档`,
    themeConfig: {
      ...zhThemeText,
      nav: [
        { text: '文档', link: `${locale.base}intro`, activeMatch: `^${locale.base}(?!api/)[^/]+$` },
        { text: 'API', link: `${locale.base}api/class-playwright`, activeMatch: `^${locale.base}api/` },
      ],
      sidebar: mapSidebar(locale.sidebar, link => link, text => zhSidebarText[text] ?? text),
    },
  };

  const enBase = enLink(locale.base);
  enLocales[key === 'root' ? 'en' : `en/${key}`] = {
    label: `English · ${locale.label}`,
    lang: 'en-US',
    link: enBase,
    title: 'Playwright',
    description: `Playwright documentation for ${locale.label}`,
    themeConfig: {
      nav: [
        { text: 'Docs', link: `${enBase}intro`, activeMatch: `^${enBase}(?!api/)[^/]+$` },
        { text: 'API', link: `${enBase}api/class-playwright`, activeMatch: `^${enBase}api/` },
      ],
      sidebar: mapSidebar(locale.sidebar, enLink, text => text),
    },
  };
}
// VitePress picks the first locale key whose path prefix matches the page,
// so "en/python" must come before "en".
const locales: LocaleConfig<DefaultTheme.Config> = { ...zhLocales };
for (const key of Object.keys(enLocales).sort((a, b) => b.length - a.length))
  locales[key] = enLocales[key];

// Pages that exist for each programming language, so the switcher can fall back
// to that language's home page when the current page has no counterpart.
const programmingLanguages = Object.entries(site.locales).map(([key, locale]) => ({
  key,
  label: locale.label,
  base: locale.base,
}));
function listPages(dir: string, rel = ''): string[] {
  if (!fs.existsSync(dir))
    return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const entryRel = rel + entry.name;
    if (entry.isDirectory()) {
      if (!rel && (['zh', 'en', 'public'].includes(entry.name) || site.locales[entry.name]))
        return [];
      return listPages(path.join(dir, entry.name), `${entryRel}/`);
    }
    return entry.name.endsWith('.md') ? [entryRel] : [];
  });
}
const pagesByProgrammingLanguage = Object.fromEntries(programmingLanguages.map(({ key }) => [
  key,
  listPages(key === 'root' ? englishSrcDir : path.join(englishSrcDir, key)),
]));

export default defineConfig({
  // Built by scripts/sync-zh.mjs from src/ (English) and i18n/zh/ (Chinese).
  srcDir: 'site',
  lang: 'zh-CN',
  title: 'Playwright',
  description: 'Playwright documentation',
  cleanUrls: true,
  lastUpdated: false,
  // Some guides link to pages that exist only for other languages.
  ignoreDeadLinks: true,
  locales,
  head: [
    ['link', { rel: 'icon', href: 'https://playwright.dev/img/playwright-logo.svg' }],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    config: md => {
      // The docs contain "{{" in text and inline code. Vue must not read it as a template expression.
      const defaultCodeInline = md.renderer.rules.code_inline!;
      md.renderer.rules.code_inline = (tokens, idx, options, env, self) =>
        defaultCodeInline(tokens, idx, options, env, self).replace(/^<code/, '<code v-pre');
      const defaultText = md.renderer.rules.text!;
      md.renderer.rules.text = (tokens, idx, options, env, self) =>
        defaultText(tokens, idx, options, env, self).replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;');
    },
  },
  themeConfig: {
    logo: 'https://playwright.dev/img/playwright-logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: Object.fromEntries(Object.keys(zhLocales).map(key => [key, { translations: zhSearchText }])),
      },
    },
    outline: { level: [2, 3] },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/microsoft/playwright' },
    ],
    editLink: undefined,
    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: 'Copyright © Microsoft',
    },
    // Read by theme/components/LanguageSwitcher.vue.
    languageSwitcher: {
      enPrefix: EN_PREFIX,
      programmingLanguages,
      pages: pagesByProgrammingLanguage,
    },
  } as DefaultTheme.Config,
  vite: {
    build: { chunkSizeWarningLimit: 4096 },
    resolve: {
      // Replace the default locale menus with one that switches reading language
      // and programming language separately.
      alias: [
        {
          find: /^.*\/VPNavBarTranslations\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/NavBarLanguageSwitcher.vue', import.meta.url)),
        },
        {
          find: /^.*\/VPNavScreenTranslations\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/NavScreenLanguageSwitcher.vue', import.meta.url)),
        },
      ],
    },
  },
});
