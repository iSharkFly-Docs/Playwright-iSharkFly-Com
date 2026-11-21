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

const locales: LocaleConfig<DefaultTheme.Config> = {};
for (const [key, locale] of Object.entries(site.locales)) {
  locales[key] = {
    label: locale.label,
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
}

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
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/microsoft/playwright' },
    ],
    editLink: undefined,
    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: 'Copyright © Microsoft',
    },
  },
  vite: {
    build: { chunkSizeWarningLimit: 4096 },
  },
});
