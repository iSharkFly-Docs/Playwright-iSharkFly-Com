import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Tabs from './components/Tabs.vue';
import TabItem from './components/TabItem.vue';
import UntranslatedNotice from './components/UntranslatedNotice.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(UntranslatedNotice),
  }),
  enhanceApp({ app }) {
    app.component('Tabs', Tabs);
    app.component('TabItem', TabItem);
  },
} satisfies Theme;
