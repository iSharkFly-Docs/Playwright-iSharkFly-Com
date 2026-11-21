---
title: Fixtures
outline: 2
---

# Fixtures

<Badge type="info" text="Added in: v1.10" />

Playwright Test 基于[测试夹具](../test-fixtures.md)的概念。测试夹具用于为每个测试建立环境，为测试提供所需的一切，仅此而已。

Playwright Test 查看每个测试声明，分析测试所需的夹具集，并专门为测试准备这些夹具。由夹具准备的值被合并到一个单一对象中，该对象作为第一个参数可用于 `test`、钩子、注解和其他夹具。

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // ...
});
```

给定上面的测试，Playwright Test 将在运行测试之前设置 `page` 夹具，并在测试完成后拆除它。`page` 夹具提供一个可用于测试的 [Page](/api/class-page) 对象。

Playwright Test 提供了下面列出的内置夹具，你也可以添加自己的夹具。Playwright Test 还[提供选项][TestOptions](/api/class-testoptions) 来配置 [`fixtures.browser`](/api/class-fixtures#fixtures-browser)、[`fixtures.context`](/api/class-fixtures#fixtures-context) 和 [`fixtures.page`](/api/class-fixtures#fixtures-page)。

## 方法

### fixtures.mount() {#fixtures-mount}

<Badge type="info" text="Added in: v1.62" />

挂载组件 story 并返回指向 story 渲染到的根元素的 [Locator](/api/class-locator)。从返回的定位器范围内查询：`component.getByRole('button')`，而不是 `page.getByRole('button')`。

**story** 是一个小型包装组件，它在一个特定场景中嵌入被测组件：硬编码的 props、模拟数据、providers、记录的回调。Stories 由你实现并在 [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) 提供服务的 **gallery** 页面渲染。gallery 公开 `window.mount(params)` 和 `window.unmount()` 函数，将 story 渲染到其根元素中。每次调用 [`fixtures.mount()`](/api/class-fixtures#fixtures-mount) 都会导航到 [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) 并使用 story id 和 props 调用 `window.mount()`，因此测试彼此完全隔离。

**用法**

```js
test('click should expand', async ({ mount }) => {
  const component = await mount('components/Expandable/Stateful');
  await component.getByRole('button').click();
  await expect(component.getByTestId('expanded')).toHaveValue('true');
});
```

将 story 类型作为模板参数传递以对 props 进行类型检查：

```js
import type { WithTitle } from './Button.story';

test('renders the title', async ({ mount }) => {
  const component = await mount<typeof WithTitle>('Button/WithTitle', { title: 'Hello' });
  await expect(component).toContainText('Hello');
});
```

返回的定位器增加了两个方法：
* `update(props)` - 使用新的 props 重新渲染相同的 story 而不重新挂载，保留组件状态；
* `unmount()` - 卸载 story。

**参数**

- <a id="fixtures-mount-option-story-id"></a>`storyId` `string`

  要挂载的 story 的标识符，由 gallery 页面解析。按照惯例，为 story 文件路径加上导出的 story 名称，例如 `'components/Button/Primary'`。
- <a id="fixtures-mount-option-props"></a>`props` `Object` *(可选)*

  传递给 story 的可选普通可序列化 props。

**返回值**

- `Locator`


## 属性

### fixtures.browser {#fixtures-browser}

<Badge type="info" text="Added in: v1.10" />

[Browser](/api/class-browser) 实例在[同一个 worker](../test-parallel.md) 中的所有测试之间共享 - 这使得测试更高效。但是，每个测试都在隔离的 [BrowserContext](/api/class-browsercontext) 中运行，并获得一个全新的环境。

了解如何[配置浏览器](../test-configuration.md)并查看[可用选项][TestOptions](/api/class-testoptions)。

**用法**

```js
test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  // ...
});
```

**类型**

- `Browser`


### fixtures.browserName {#fixtures-browser-name}

<Badge type="info" text="Added in: v1.10" />

运行测试的浏览器名称。默认为 `'chromium'`。对于基于浏览器[注解测试](../test-annotations.md)很有用。

**用法**

```js
test('skip this test in Firefox', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Still working on it');
  // ...
});
```

**类型**

- `"chromium" | "firefox" | "webkit"`


### fixtures.context {#fixtures-context}

<Badge type="info" text="Added in: v1.10" />

为每个测试创建的隔离 [BrowserContext](/api/class-browsercontext) 实例。由于上下文之间相互隔离，即使多个测试在单个 [Browser](/api/class-browser) 中运行以获得最大效率，每个测试也会获得一个全新的环境。

了解如何[配置上下文](../test-configuration.md)并查看[可用选项][TestOptions](/api/class-testoptions)。

默认的 [`fixtures.page`](/api/class-fixtures#fixtures-page) 属于这个上下文。

**用法**

```js
test('example test', async ({ page, context }) => {
  await context.route('*external.com/*', route => route.abort());
  // ...
});
```

**类型**

- `BrowserContext`


### fixtures.page {#fixtures-page}

<Badge type="info" text="Added in: v1.10" />

为每个测试创建的隔离 [Page](/api/class-page) 实例。由于 [`fixtures.context`](/api/class-fixtures#fixtures-context) 隔离，页面在测试之间是隔离的。

这是测试中最常用的夹具。

**用法**

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel('User Name').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByText('Sign in').click();
  // ...
});
```

**类型**

- `Page`


### fixtures.request {#fixtures-request}

<Badge type="info" text="Added in: v1.10" />

为每个测试创建的隔离 [APIRequestContext](/api/class-apirequestcontext) 实例。

**用法**

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ request }) => {
  await request.post('/signin', {
    data: {
      username: 'user',
      password: 'password'
    }
  });
  // ...
});
```

**类型**

- `APIRequestContext`
