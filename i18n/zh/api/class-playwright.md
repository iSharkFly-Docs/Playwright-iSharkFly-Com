---
title: Playwright
outline: 2
---

# Playwright

<Badge type="info" text="Added in: v1.8" />

Playwright 模块提供了一个启动浏览器实例的方法。以下是使用 Playwright 驱动自动化的典型示例：

```js
const { chromium, firefox, webkit } = require('playwright');

(async () => {
  const browser = await chromium.launch();  // 或 'firefox' 或 'webkit'。
  const page = await browser.newPage();
  await page.goto('http://example.com');
  // 其他操作...
  await browser.close();
})();
```

## 属性

### playwright.chromium {#playwright-chromium}

<Badge type="info" text="Added in: v1.8" />

此对象可用于启动或连接 Chromium，返回 [Browser](/api/class-browser) 实例。

**类型**

- `BrowserType`


### playwright.devices {#playwright-devices}

<Badge type="info" text="Added in: v1.8" />

返回一个设备字典，可与 [`browser.newContext()`](/api/class-browser#browser-new-context) 或 [`browser.newPage()`](/api/class-browser#browser-new-page) 一起使用。

```js
const { webkit, devices } = require('playwright');
const iPhone = devices['iPhone 6'];

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext({
    ...iPhone
  });
  const page = await context.newPage();
  await page.goto('http://example.com');
  // 其他操作...
  await browser.close();
})();
```

**类型**

- `Object`


### playwright.errors {#playwright-errors}

<Badge type="info" text="Added in: v1.8" />

如果 Playwright 方法无法完成请求，可能会抛出错误。例如，如果选择器在给定的时间范围内没有匹配任何节点，[`locator.waitFor()`](/api/class-locator#locator-wait-for) 可能会失败。

对于某些类型的错误，Playwright 使用特定的错误类。这些类可通过 [`playwright.errors`](#playwright-errors) 获取。

处理超时错误的示例：

```js
try {
  await page.locator('.foo').waitFor();
} catch (e) {
  if (e instanceof playwright.errors.TimeoutError) {
    // 如果这是超时错误，执行某些操作。
  }
}
```

**类型**

- `Object`


### playwright.firefox {#playwright-firefox}

<Badge type="info" text="Added in: v1.8" />

此对象可用于启动或连接 Firefox，返回 [Browser](/api/class-browser) 实例。

**类型**

- `BrowserType`


### playwright.request {#playwright-request}

<Badge type="info" text="Added in: v1.16" />

暴露可用于 Web API 测试的 API。

**类型**

- `APIRequest`


### playwright.selectors {#playwright-selectors}

<Badge type="info" text="Added in: v1.8" />

选择器可用于安装自定义选择器引擎。有关更多信息，请参阅[可扩展性](../extensibility.md)。

**类型**

- `Selectors`


### playwright.webkit {#playwright-webkit}

<Badge type="info" text="Added in: v1.8" />

此对象可用于启动或连接 WebKit，返回 [Browser](/api/class-browser) 实例。

**类型**

- `BrowserType`
