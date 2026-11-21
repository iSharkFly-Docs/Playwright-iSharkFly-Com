import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Tabs from './components/Tabs.vue';
import TabItem from './components/TabItem.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Tabs', Tabs);
    app.component('TabItem', TabItem);
  },
} satisfies Theme;
