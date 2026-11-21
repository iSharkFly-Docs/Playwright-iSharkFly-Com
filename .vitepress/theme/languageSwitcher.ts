import { computed } from 'vue';
import { useData } from 'vitepress';

type ProgrammingLanguage = { key: string; label: string; base: string };
type SwitcherConfig = {
  zhPrefix: string;
  programmingLanguages: ProgrammingLanguage[];
  pages: Record<string, string[]>;
};

export type SwitcherLink = { text: string; link: string; lang?: string; active: boolean };

const READING_LANGUAGES = [
  { key: 'en', text: 'English', lang: 'en-US' },
  { key: 'zh', text: '简体中文', lang: 'zh-CN' },
] as const;

// Page path ("intro.md", "api/class-page.md", "index.md") to a clean URL.
function pageUrl(base: string, page: string) {
  return base + page.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
}

export function useLanguageSwitcher() {
  const { page, theme, hash } = useData();
  const config = computed(() => theme.value.languageSwitcher as SwitcherConfig);

  // Split "zh/python/api/class-page.md" into reading language, programming language and page.
  const current = computed(() => {
    let rest = page.value.relativePath;
    const zhDir = config.value.zhPrefix.replace(/^\//, '') + '/';
    const reading = rest.startsWith(zhDir) ? 'zh' : 'en';
    if (reading === 'zh')
      rest = rest.slice(zhDir.length);
    const programming = config.value.programmingLanguages.find(
      language => language.key !== 'root' && rest.startsWith(`${language.key}/`)) ?? config.value.programmingLanguages.find(language => language.key === 'root')!;
    if (programming.key !== 'root')
      rest = rest.slice(programming.key.length + 1);
    return { reading, programming, page: rest };
  });

  function linkFor(reading: string, programming: ProgrammingLanguage, keepHash: boolean) {
    const base = (reading === 'zh' ? config.value.zhPrefix : '') + programming.base;
    const pages = config.value.pages[programming.key] ?? [];
    if (!pages.includes(current.value.page))
      return base;
    return pageUrl(base, current.value.page) + (keepHash ? hash.value : '');
  }

  const isZh = computed(() => current.value.reading === 'zh');

  const readingLanguages = computed<SwitcherLink[]>(() => READING_LANGUAGES.map(reading => ({
    text: reading.text,
    lang: reading.lang,
    // Both reading languages have the same pages, so the anchor can be kept.
    link: linkFor(reading.key, current.value.programming, true),
    active: reading.key === current.value.reading,
  })));

  const programmingLanguages = computed<SwitcherLink[]>(() => config.value.programmingLanguages.map(programming => ({
    text: programming.label,
    link: linkFor(current.value.reading, programming, false),
    active: programming.key === current.value.programming.key,
  })));

  const labels = computed(() => isZh.value
    ? { menu: '切换语言', reading: '阅读语言', programming: '编程语言' }
    : { menu: 'Change language', reading: 'Language', programming: 'Programming language' });

  const currentLabel = computed(() =>
    `${READING_LANGUAGES.find(reading => reading.key === current.value.reading)!.text} · ${current.value.programming.label}`);

  return { readingLanguages, programmingLanguages, labels, currentLabel, isZh };
}
