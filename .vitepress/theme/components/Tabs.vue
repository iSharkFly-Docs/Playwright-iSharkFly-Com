<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue';
import { loadSelectedTabs, selectTab, selectedTabs } from './tabsState';

const props = defineProps<{
  tabs: { label: string; value: string }[];
  groupId?: string;
  defaultValue?: string;
}>();

const local = ref(props.defaultValue || props.tabs[0]?.value);

const active = computed(() => {
  const fromGroup = props.groupId ? selectedTabs[props.groupId] : undefined;
  if (fromGroup && props.tabs.some(t => t.value === fromGroup))
    return fromGroup;
  return local.value;
});

function select(value: string) {
  local.value = value;
  if (props.groupId)
    selectTab(props.groupId, value);
}

onMounted(loadSelectedTabs);
provide('docs-tabs-active', active);
</script>

<template>
  <div class="docs-tabs">
    <div class="docs-tabs-bar" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        role="tab"
        :aria-selected="active === tab.value"
        :class="{ active: active === tab.value }"
        @click="select(tab.value)"
      >{{ tab.label }}</button>
    </div>
    <div class="docs-tabs-panels">
      <slot />
    </div>
  </div>
</template>
