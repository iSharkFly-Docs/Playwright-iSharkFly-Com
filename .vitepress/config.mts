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
const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

// ---------------------------------------------------------------------------
// Two switchable dimensions:
//   - reading language: English (site root) or Simplified Chinese (/zh/, built by scripts/sync-zh.mjs)
//   - programming language: Node.js (locale "root"), Python, Java, .NET
// Every combination is one VitePress locale. The nav bar switcher
// (theme/components/LanguageSwitcher.vue) shows the two dimensions separately.

const ZH_PREFIX = '/zh';

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

function zhLink(link: string) {
  return link.startsWith('/') ? ZH_PREFIX + link : link;
}

function zhSidebarItems(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return items.map(item => ({
    ...item,
    ...(item.items ? { text: zhSidebarText[item.text ?? ''] ?? item.text } : {}),
    ...(item.link ? { link: zhLink(item.link) } : {}),
    ...(item.items ? { items: zhSidebarItems(item.items) } : {}),
  }));
}

function zhSidebar(sidebar: DefaultTheme.SidebarMulti): DefaultTheme.SidebarMulti {
  return Object.fromEntries(Object.entries(sidebar).map(([key, value]) => [
    zhLink(key),
    Array.isArray(value) ? zhSidebarItems(value) : { ...value, base: zhLink(value.base), items: zhSidebarItems(value.items) },
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

const locales: LocaleConfig<DefaultTheme.Config> = {};
// Chinese locales are added first, and "zh/python" before "zh": VitePress picks the
// first locale key whose path prefix matches the page.
const zhLocales: LocaleConfig<DefaultTheme.Config> = {};
const enLocales: LocaleConfig<DefaultTheme.Config> = {};
for (const [key, locale] of Object.entries(site.locales)) {
  enLocales[key] = {
    label: `English · ${locale.label}`,
    lang: 'en-US',
    link: locale.base,
    title: 'Playwright',
    description: `Playwright documentation for ${locale.label}`,
    themeConfig: {
      nav: [
        { text: 'Docs', link: `${locale.base}intro`, activeMatch: `^${locale.base}(?!api/)[^/]+$` },
        { text: 'API', link: `${locale.base}api/class-playwright`, activeMatch: `^${locale.base}api/` },
      ],
      sidebar: locale.sidebar,
    },
  };

  const zhBase = zhLink(locale.base);
  const zhKey = key === 'root' ? 'zh' : `zh/${key}`;
  zhLocales[zhKey] = {
    label: `简体中文 · ${locale.label}`,
    lang: 'zh-CN',
    link: zhBase,
    title: 'Playwright',
    description: `Playwright ${locale.label} 中文文档`,
    themeConfig: {
      ...zhThemeText,
      nav: [
        { text: '文档', link: `${zhBase}intro`, activeMatch: `^${zhBase}(?!api/)[^/]+$` },
        { text: 'API', link: `${zhBase}api/class-playwright`, activeMatch: `^${zhBase}api/` },
      ],
      sidebar: zhSidebar(locale.sidebar),
    },
  };
}
const zhKeys = Object.keys(zhLocales).sort((a, b) => b.length - a.length);
for (const key of zhKeys)
  locales[key] = zhLocales[key];
Object.assign(locales, enLocales);

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
      if (!rel && (['zh', 'public'].includes(entry.name) || site.locales[entry.name]))
        return [];
      return listPages(path.join(dir, entry.name), `${entryRel}/`);
    }
    return entry.name.endsWith('.md') ? [entryRel] : [];
  });
}
const pagesByProgrammingLanguage = Object.fromEntries(programmingLanguages.map(({ key }) => [
  key,
  listPages(key === 'root' ? srcDir : path.join(srcDir, key)),
]));

export default defineConfig({
  srcDir: 'src',
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
        locales: Object.fromEntries(zhKeys.map(key => [key, { translations: zhSearchText }])),
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
      zhPrefix: ZH_PREFIX,
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
