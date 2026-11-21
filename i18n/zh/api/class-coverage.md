---
title: Coverage
outline: 2
---

# Coverage

<Badge type="info" text="新增于: v1.11" />

Coverage 收集页面使用的 JavaScript 和 CSS 部分的信息。

一个使用 JavaScript 覆盖率为页面加载生成 Istanbul 报告的示例：

::: info
Coverage API 仅在基于 Chromium 的浏览器上受支持。
:::

```js
const { chromium } = require('playwright');
const v8toIstanbul = require('v8-to-istanbul');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.coverage.startJSCoverage();
  await page.goto('https://chromium.org');
  const coverage = await page.coverage.stopJSCoverage();
  for (const entry of coverage) {
    const converter = v8toIstanbul('', 0, { source: entry.source });
    await converter.load();
    converter.applyCoverage(entry.functions);
    console.log(JSON.stringify(converter.toIstanbul()));
  }
  await browser.close();
})();
```

## 方法

### coverage.startCSSCoverage() {#coverage-start-css-coverage}

<Badge type="info" text="新增于: v1.11" /> <Badge type="tip" text="async" />

返回覆盖率是否已启动

**参数**

- <a id="coverage-start-css-coverage-option-options"></a>`options` `Object` *(可选)*

  - <a id="coverage-start-css-coverage-option-reset-on-navigation"></a>`resetOnNavigation` `boolean` *(可选)*

    是否在每次导航时重置覆盖率。默认为 `true`。


### coverage.startJSCoverage() {#coverage-start-js-coverage}

<Badge type="info" text="新增于: v1.11" /> <Badge type="tip" text="async" />

返回覆盖率是否已启动

::: info
匿名脚本是指没有关联 URL 的脚本。这些是使用 `eval` 或 `new Function` 在页面上动态创建的脚本。如果 [`reportAnonymousScripts`](/api/class-coverage#coverage-start-js-coverage-option-report-anonymous-scripts) 设置为 `true`，匿名脚本将以空字符串作为其 URL。
:::

**参数**

- <a id="coverage-start-js-coverage-option-options"></a>`options` `Object` *(可选)*

  - <a id="coverage-start-js-coverage-option-report-anonymous-scripts"></a>`reportAnonymousScripts` `boolean` *(可选)*

    是否应报告页面生成的匿名脚本。默认为 `false`。
  - <a id="coverage-start-js-coverage-option-reset-on-navigation"></a>`resetOnNavigation` `boolean` *(可选)*

    是否在每次导航时重置覆盖率。默认为 `true`。请注意，由于浏览器架构限制，传递 `false` 并不能保证覆盖率在导航后持续存在。


### coverage.stopCSSCoverage() {#coverage-stop-css-coverage}

<Badge type="info" text="新增于: v1.11" /> <Badge type="tip" text="async" />

返回所有样式表的覆盖率报告数组

::: info
CSS 覆盖率不包括没有 sourceURL 的动态注入的 style 标签。
:::

**返回值**

- `Promise<Array<Object>>`


### coverage.stopJSCoverage() {#coverage-stop-js-coverage}

<Badge type="info" text="新增于: v1.11" /> <Badge type="tip" text="async" />

返回所有脚本的覆盖率报告数组

::: info
JavaScript 覆盖率默认不包括匿名脚本。但是，带有 sourceURL 的脚本会被报告。
:::

**返回值**

- `Promise<Array<Object>>`
