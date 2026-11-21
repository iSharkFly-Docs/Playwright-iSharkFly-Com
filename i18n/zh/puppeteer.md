---
title: "从 Puppeteer 迁移"
---

# 从 Puppeteer 迁移

## 迁移原则

本指南描述了从 Puppeteer 迁移到 [Playwright Library](./library) 和 [Playwright Test](./intro.md)。这些 API 有相似之处，但 Playwright 为 Web 测试和跨浏览器自动化提供了更多可能性。
- 大多数 Puppeteer API 可以直接使用
- 不建议使用 [ElementHandle](/api/class-elementhandle)，请改用 [Locator](/api/class-locator) 对象和 Web 优先断言
- Playwright 支持跨浏览器
- 你可能不需要显式等待

## 速查表

| Puppeteer                                          | Playwright Library                          |
|----------------------------------------------------|---------------------------------------------|
| `await puppeteer.launch()`                         | `await playwright.chromium.launch()`        |
| `puppeteer.launch({product: 'firefox'})`           | `await playwright.firefox.launch()`         |
|  Puppeteer 不支持 WebKit                           | `await playwright.webkit.launch()`          |
| `await browser.createIncognitoBrowserContext(...)` | `await browser.newContext(...)`             |
| `await page.setViewport(...)`                      | `await page.setViewportSize(...)`           |
| `await page.waitForXPath(XPathSelector)`           | `await page.waitForSelector(XPathSelector)` |
| `await page.waitForNetworkIdle(...)`               | `await page.waitForLoadState('networkidle')` |
| `await page.$eval(...)`                            | [断言](./test-assertions)通常可用于验证文本、属性、类... |
| `await page.$(...)`                                | 不建议使用，请改用[定位器](./api/class-locator) |
| `await page.$x(xpath_selector)`                    | 不建议使用，请改用[定位器](./api/class-locator) |
| 没有专门用于复选框或单选输入的方法                   | `await page.locator(selector).check()`<br/>`await page.locator(selector).uncheck()` |
| `await page.click(selector)`                       | `await page.locator(selector).click()`      |
| `await page.focus(selector)`                       | `await page.locator(selector).focus()`      |
| `await page.hover(selector)`                       | `await page.locator(selector).hover()`      |
| `await page.select(selector, values)`              | `await page.locator(selector).selectOption(values)` |
| `await page.tap(selector)`                         | `await page.locator(selector).tap()`        |
| `await page.type(selector, ...)`                   | `await page.locator(selector).fill(...)` |
| `await page.waitForFileChooser(...)`<br/>`await elementHandle.uploadFile(...)` | `await page.locator(selector).setInputFiles(...)` |
| `await page.cookies([...urls])`                    | `await browserContext.cookies([urls])`      |
| `await page.deleteCookie(...cookies)`              | `await browserContext.clearCookies()`       |
| `await page.setCookie(...cookies)`                 | `await browserContext.addCookies(cookies)`  |
| `page.on(...)`                                     | `page.on(...)`<br/>要拦截和修改请求，请参阅 [`page.route()`](/api/class-page#page-route) |

`page.waitForNavigation` 和 `page.waitForSelector` 仍然存在，但由于[自动等待](./actionability)，在很多情况下不再需要。

不建议使用 [ElementHandle](/api/class-elementhandle)，请改用 [Locator](/api/class-locator) 对象和 Web 优先断言。

定位器是 Playwright 自动等待和重试能力的核心。定位器是严格的。这意味着如果给定选择器匹配多个元素，所有隐含某个目标 DOM 元素的定位器操作都将抛出异常。

## 示例

### 自动化示例

Puppeteer:

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://playwright.dev/', {
    waitUntil: 'networkidle2',
  });
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

逐行迁移到 Playwright：

```js
const { chromium } = require('playwright'); // 1

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage(); // 2
  await page.setViewportSize({ width: 1280, height: 800 }); // 3
  await page.goto('https://playwright.dev/', {
    waitUntil: 'networkidle', // 4
  });
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

迁移要点（请参阅 Playwright 代码片段中的内联注释）：
1. 每个 Playwright Library 文件都显式导入 `chromium`。也可以使用其他浏览器 `webkit` 或 `firefox`。
1. 对于浏览器状态隔离，请考虑[浏览器上下文](./browser-contexts.md)
1. `setViewport` 变为 `setViewportSize`
1. `networkidle2` 变为 `networkidle`。请注意，由于自动等待，在大多数情况下这是不必要的。

### 测试示例

Puppeteer 配合 Jest：

```js
import puppeteer from 'puppeteer';

describe('Playwright homepage', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it('contains hero title', async () => {
    await page.goto('https://playwright.dev/');
    await page.waitForSelector('.hero__title');
    const text = await page.$eval('.hero__title', e => e.textContent);
    expect(text).toContain('Playwright enables reliable end-to-end testing'); // 5
  });

  afterAll(() => browser.close());
});
```

逐行迁移到 Playwright Test：

```js
import { test, expect } from '@playwright/test'; // 1

test.describe('Playwright homepage', () => {
  test('contains hero title', async ({ page }) => { // 2, 3
    await page.goto('https://playwright.dev/');
    const titleLocator = page.locator('.hero__title'); // 4
    await expect(titleLocator).toContainText( // 5
        'Playwright enables reliable end-to-end testing'
    );
  });
});
```
1. 每个 Playwright Test 文件都显式导入 `test` 和 `expect` 函数
1. 测试函数标记为 `async`
1. Playwright Test 会将 `page` 作为参数之一提供。这是 Playwright Test 中众多[有用的 fixtures](./api/class-fixtures) 之一。
   Playwright Test 为每个测试创建一个隔离的 [Page](/api/class-page) 对象。但是，如果你想在多个测试之间重用单个 [Page](/api/class-page) 对象，你可以在 [`test.beforeAll()`](/api/class-test#test-before-all) 中创建自己的对象，并在 [`test.afterAll()`](/api/class-test#test-after-all) 中关闭它。
1. 使用 [`page.locator()`](/api/class-page#page-locator) 创建定位器是少数同步方法之一。
1. 使用[断言](./test-assertions)来验证状态，而不是 `page.$eval()`。

## 测试

为了改进测试，建议使用[定位器](./api/class-locator)和 Web 优先[断言](./test-assertions)。请参阅[编写测试](./writing-tests)

在 Puppeteer 中，通常使用 `page.evaluate()` 或 `page.$eval()` 来检查 [ElementHandle](/api/class-elementhandle) 并提取文本内容、属性、类的值... Web 优先[断言](./test-assertions)为此目的提供了多个匹配器，它更可靠且更易读。

[Playwright Test](./intro.md) 是我们推荐与 Playwright 一起使用的第一方测试运行器。它提供了页面对象模型、并行化、fixtures 或报告器等多种功能。

## Playwright Test 的超强能力

一旦使用 Playwright Test，你将获得很多功能！
- 完全零配置的 TypeScript 支持
- 在**任何流行操作系统**（Windows、macOS、Ubuntu）上的**所有 Web 引擎**（Chrome、Firefox、Safari）上运行测试
- 完全支持多源、[(i)frames](./api/class-frame)、[标签页和上下文](./pages)
- 在多个浏览器上并行隔离运行测试
- 内置测试[产物收集](./test-use-options.md#recording-options)

你还将获得与 Playwright Test 捆绑在一起的所有这些精彩工具：
- [Playwright Inspector](./debug.md)
- [Playwright Test 代码生成](./codegen-intro.md)
- [Playwright Tracing](./trace-viewer.md) 用于事后调试

## 延伸阅读

了解更多关于 Playwright Test 运行器的信息：
- [入门指南](./intro)
- [Fixtures](./test-fixtures)
- [定位器](./locators.md)
- [断言](./test-assertions)
- [自动等待](./actionability)
