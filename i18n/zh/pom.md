---
title: "页面对象模型"
---

# 页面对象模型

## 简介

大型测试套件可以通过结构化来优化编写和维护的便利性。页面对象模型是一种用于构建测试套件结构的方法。

页面对象代表你的 Web 应用程序的一部分。一个电子商务 Web 应用程序可能有首页、列表页和结账页。每个页面都可以用页面对象模型来表示。

页面对象通过创建适合你应用程序的更高级 API 来**简化编写**，并通过在一个地方捕获元素选择器和创建可重用代码来避免重复，从而**简化维护**。

## 实现

我们将创建一个 `PlaywrightDevPage` 辅助类来封装 `playwright.dev` 页面上的常见操作。在内部，它将使用 `page` 对象。

::: code-group

```js [Test]
import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly gettingStartedHeader: Locator;
  readonly pomLink: Locator;
  readonly tocList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page.locator('li', {
      hasText: 'Guides',
    }).locator('a', {
      hasText: 'Page Object Model',
    });
    this.tocList = page.locator('article div.markdown ul > li > a');
  }

  async goto() {
    await this.page.goto('https://playwright.dev');
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
}
```

```js [Library]
class PlaywrightDevPage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page.locator('li', {
      hasText: 'Playwright Test',
    }).locator('a', {
      hasText: 'Page Object Model',
    });
    this.tocList = page.locator('article div.markdown ul > li > a');
  }
  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
}
module.exports = { PlaywrightDevPage };
```

:::

现在我们可以在测试中使用 `PlaywrightDevPage` 类。

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from './playwright-dev-page';

test('getting started should contain table of contents', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.getStarted();
  await expect(playwrightDev.tocList).toHaveText([
    `How to install Playwright`,
    `What's installed`,
    `How to run the example test`,
    `How to open the HTML test report`,
    `Write tests using web-first assertions, fixtures and locators`,
    `Run single or multiple tests; headed mode`,
    `Generate tests with Codegen`,
    `View a trace of your tests`,
  ]);
});

test('should show Page Object Model article', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.pageObjectModel();
  await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');
});
```

```js [Library]
const { PlaywrightDevPage } = require('./playwright-dev-page');

// 在测试中
const page = await browser.newPage();
await playwrightDev.goto();
await playwrightDev.getStarted();
await expect(playwrightDev.tocList).toHaveText([
  `How to install Playwright`,
  `What's installed`,
  `How to run the example test`,
  `How to open the HTML test report`,
  `Write tests using web-first assertions, fixtures and locators`,
  `Run single or multiple tests; headed mode`,
  `Generate tests with Codegen`,
  `View a trace of your tests`,
]);
```

:::
