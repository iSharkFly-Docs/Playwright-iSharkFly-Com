<script setup lang="ts">
// Shown on Chinese pages that sync-zh.mjs copied from English (front matter `untranslated: true`).
import { computed } from 'vue';
import { useData } from 'vitepress';

const { frontmatter, page } = useData();
// Chinese pages are at the site root; the English version of the same page is under /en/.
const englishLink = computed(() =>
  '/en/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, ''));
</script>

<template>
  <div v-if="frontmatter.untranslated" class="untranslated-notice" lang="zh-CN">
    本页尚未翻译成中文，以下为英文原文。
    <a :href="englishLink">查看英文版</a>
  </div>
</template>

<style scoped>
.untranslated-notice {
  margin: 0 0 24px;
  border: 1px solid var(--vp-custom-block-info-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 24px;
  color: var(--vp-custom-block-info-text);
  background-color: var(--vp-custom-block-info-bg);
}

.untranslated-notice a {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
