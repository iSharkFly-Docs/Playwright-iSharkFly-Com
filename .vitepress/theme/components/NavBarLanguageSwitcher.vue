<script setup lang="ts">
// Replaces VitePress' VPNavBarTranslations (see the vite alias in config.mts).
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue';
import { VPLink } from 'vitepress/theme';
import { useLanguageSwitcher } from '../languageSwitcher';

const { readingLanguages, programmingLanguages, labels } = useLanguageSwitcher();
</script>

<template>
  <VPFlyout class="NavBarLanguageSwitcher" icon="vpi-languages" :label="labels.menu">
    <div class="items">
      <p class="title">{{ labels.reading }}</p>
      <VPLink
        v-for="item in readingLanguages"
        :key="item.text"
        class="link"
        :class="{ active: item.active }"
        :href="item.link"
        :lang="item.lang"
        :hreflang="item.lang"
        rel="alternate"
      >{{ item.text }}</VPLink>

      <div class="divider" />

      <p class="title">{{ labels.programming }}</p>
      <VPLink
        v-for="item in programmingLanguages"
        :key="item.text"
        class="link"
        :class="{ active: item.active }"
        :href="item.link"
      >{{ item.text }}</VPLink>
    </div>
  </VPFlyout>
</template>

<style scoped>
.NavBarLanguageSwitcher {
  display: none;
}

@media (min-width: 1280px) {
  .NavBarLanguageSwitcher {
    display: flex;
    align-items: center;
  }
}

.items {
  min-width: 180px;
}

.title {
  padding: 0 12px;
  line-height: 32px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.link {
  display: block;
  border-radius: 6px;
  padding: 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  transition: background-color 0.25s, color 0.25s;
}

.link:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.link.active {
  color: var(--vp-c-brand-1);
}

.divider {
  margin: 8px 12px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
