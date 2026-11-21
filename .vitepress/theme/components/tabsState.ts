import { reactive } from 'vue';

const STORAGE_KEY = 'docs-tabs';

// Selected tab per group id. Tabs with the same group id stay in sync.
export const selectedTabs = reactive<Record<string, string>>({});

let loaded = false;

export function loadSelectedTabs() {
  if (loaded || typeof window === 'undefined')
    return;
  loaded = true;
  try {
    Object.assign(selectedTabs, JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
  }
}

export function selectTab(groupId: string, value: string) {
  selectedTabs[groupId] = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTabs));
  } catch {
  }
}
