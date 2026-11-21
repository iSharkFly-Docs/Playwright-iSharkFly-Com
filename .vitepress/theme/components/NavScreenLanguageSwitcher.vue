<script setup lang="ts">
// Replaces VitePress' VPNavScreenTranslations, the menu shown on small screens
// (see the vite alias in config.mts).
import { ref } from 'vue';
import { VPLink } from 'vitepress/theme';
import { useLanguageSwitcher } from '../languageSwitcher';

const { readingLanguages, programmingLanguages, labels, currentLabel } = useLanguageSwitcher();
const isOpen = ref(false);
</script>

<template>
  <div class="NavScreenLanguageSwitcher" :class="{ open: isOpen }">
    <button class="toggle" :aria-expanded="isOpen" @click="isOpen = !isOpen">
      <span class="vpi-languages icon lang" />
      {{ currentLabel }}
      <span class="vpi-chevron-down icon chevron" />
    </button>

    <div class="groups">
      <p class="title">{{ labels.reading }}</p>
      <ul class="list">
        <li v-for="item in readingLanguages" :key="item.text">
          <VPLink class="link" :class="{ active: item.active }" :href="item.link" :lang="item.lang">
            {{ item.text }}
          </VPLink>
        </li>
      </ul>
      <p class="title">{{ labels.programming }}</p>
      <ul class="list">
        <li v-for="item in programmingLanguages" :key="item.text">
          <VPLink class="link" :class="{ active: item.active }" :href="item.link">{{ item.text }}</VPLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.NavScreenLanguageSwitcher {
  height: 24px;
  overflow: hidden;
}

.NavScreenLanguageSwitcher.open {
  height: auto;
}

.toggle {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.icon {
  font-size: 16px;
}

.icon.lang {
  margin-right: 8px;
}

.icon.chevron {
  margin-left: 4px;
}

.groups {
  padding: 4px 0 0 24px;
}

.title {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.list {
  padding-left: 8px;
}

.link {
  line-height: 32px;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.link.active {
  color: var(--vp-c-brand-1);
}
</style>
