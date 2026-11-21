---
title: Fixtures
outline: 2
---

# Fixtures

<Badge type="info" text="Added in: v1.10" />

Playwright Test is based on the concept of the [test fixtures](../test-fixtures.md). Test fixtures are used to establish environment for each test, giving the test everything it needs and nothing else.

Playwright Test looks at each test declaration, analyses the set of fixtures the test needs and prepares those fixtures specifically for the test. Values prepared by the fixtures are merged into a single object that is available to the `test`, hooks, annotations and other fixtures as a first parameter.

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // ...
});
```

Given the test above, Playwright Test will set up the `page` fixture before running the test, and tear it down after the test has finished. `page` fixture provides a [Page](/api/class-page) object that is available to the test.

Playwright Test comes with builtin fixtures listed below, and you can add your own fixtures as well. Playwright Test also [provides options][TestOptions](/api/class-testoptions) to  configure [`fixtures.browser`](/api/class-fixtures#fixtures-browser), [`fixtures.context`](/api/class-fixtures#fixtures-context) and [`fixtures.page`](/api/class-fixtures#fixtures-page).

## Methods

### fixtures.mount() {#fixtures-mount}

<Badge type="info" text="Added in: v1.62" />

Mounts a component story and returns a [Locator](/api/class-locator) pointing to the root element the story was rendered into. Scope your queries from the returned locator: `component.getByRole('button')`, not `page.getByRole('button')`.

A **story** is a small wrapper component that embeds the component under test in one specific scenario: hard-coded props, mock data, providers, recorded callbacks. Stories are rendered by a **gallery** page that you implement and serve at [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url). The gallery exposes `window.mount(params)` and `window.unmount()` functions that render a story into its root element. Each call to [`fixtures.mount()`](/api/class-fixtures#fixtures-mount) navigates to [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) and calls `window.mount()` with the story id and props, so tests are fully isolated from each other.

**Usage**

```js
test('click should expand', async ({ mount }) => {
  const component = await mount('components/Expandable/Stateful');
  await component.getByRole('button').click();
  await expect(component.getByTestId('expanded')).toHaveValue('true');
});
```

Pass the story type as a template argument to type-check the props:

```js
import type { WithTitle } from './Button.story';

test('renders the title', async ({ mount }) => {
  const component = await mount<typeof WithTitle>('Button/WithTitle', { title: 'Hello' });
  await expect(component).toContainText('Hello');
});
```

The returned locator is augmented with two methods:
* `update(props)` - re-renders the same story with new props without remounting, preserving component state;
* `unmount()` - unmounts the story.

**Arguments**

- <a id="fixtures-mount-option-story-id"></a>`storyId` `string`

  Identifier of the story to mount, as resolved by the gallery page. Conventionally, the story file path plus the exported story name, for example `'components/Button/Primary'`.
- <a id="fixtures-mount-option-props"></a>`props` `Object` *(optional)*

  Optional plain, serializable props passed to the story.

**Returns**

- `Locator`


## Properties

### fixtures.browser {#fixtures-browser}

<Badge type="info" text="Added in: v1.10" />

[Browser](/api/class-browser) instance is shared between all tests in the [same worker](../test-parallel.md) - this makes testing efficient. However, each test runs in an isolated [BrowserContext](/api/class-browsercontext)  and gets a fresh environment.

Learn how to [configure browser](../test-configuration.md) and see [available options][TestOptions](/api/class-testoptions).

**Usage**

```js
test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  // ...
});
```

**Type**

- `Browser`


### fixtures.browserName {#fixtures-browser-name}

<Badge type="info" text="Added in: v1.10" />

Name of the browser that runs tests. Defaults to `'chromium'`. Useful to [annotate tests](../test-annotations.md) based on the browser.

**Usage**

```js
test('skip this test in Firefox', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Still working on it');
  // ...
});
```

**Type**

- `"chromium" | "firefox" | "webkit"`


### fixtures.context {#fixtures-context}

<Badge type="info" text="Added in: v1.10" />

Isolated [BrowserContext](/api/class-browsercontext) instance, created for each test. Since contexts are isolated between each other, every test gets a fresh environment, even when multiple tests run in a single [Browser](/api/class-browser) for maximum efficiency.

Learn how to [configure context](../test-configuration.md) and see [available options][TestOptions](/api/class-testoptions).

Default [`fixtures.page`](/api/class-fixtures#fixtures-page) belongs to this context.

**Usage**

```js
test('example test', async ({ page, context }) => {
  await context.route('*external.com/*', route => route.abort());
  // ...
});
```

**Type**

- `BrowserContext`


### fixtures.page {#fixtures-page}

<Badge type="info" text="Added in: v1.10" />

Isolated [Page](/api/class-page) instance, created for each test. Pages are isolated between tests due to [`fixtures.context`](/api/class-fixtures#fixtures-context) isolation.

This is the most common fixture used in a test.

**Usage**

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

**Type**

- `Page`


### fixtures.request {#fixtures-request}

<Badge type="info" text="Added in: v1.10" />

Isolated [APIRequestContext](/api/class-apirequestcontext) instance for each test.

**Usage**

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

**Type**

- `APIRequestContext`

