---
title: Playwright
outline: 2
---

# Playwright

<Badge type="info" text="Added in: v1.8" />

Playwright module provides a method to launch a browser instance. The following is a typical example of using Playwright
to drive automation:

```js
const { chromium, firefox, webkit } = require('playwright');

(async () => {
  const browser = await chromium.launch();  // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();
  await page.goto('http://example.com');
  // other actions...
  await browser.close();
})();
```

## Properties

### playwright.chromium {#playwright-chromium}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Chromium, returning instances of [Browser](/api/class-browser).

**Type**

- `BrowserType`


### playwright.devices {#playwright-devices}

<Badge type="info" text="Added in: v1.8" />

Returns a dictionary of devices to be used with [`browser.newContext()`](/api/class-browser#browser-new-context) or [`browser.newPage()`](/api/class-browser#browser-new-page).

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
  // other actions...
  await browser.close();
})();
```

**Type**

- `Object`


### playwright.errors {#playwright-errors}

<Badge type="info" text="Added in: v1.8" />

Playwright methods might throw errors if they are unable to fulfill a request. For example,
[`locator.waitFor()`](/api/class-locator#locator-wait-for) might fail if the selector doesn't match any nodes during the given timeframe.

For certain types of errors Playwright uses specific error classes. These classes are available via
[`playwright.errors`](#playwright-errors).

An example of handling a timeout error:

```js
try {
  await page.locator('.foo').waitFor();
} catch (e) {
  if (e instanceof playwright.errors.TimeoutError) {
    // Do something if this is a timeout.
  }
}
```

**Type**

- `Object`


### playwright.firefox {#playwright-firefox}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Firefox, returning instances of [Browser](/api/class-browser).

**Type**

- `BrowserType`


### playwright.request {#playwright-request}

<Badge type="info" text="Added in: v1.16" />

Exposes API that can be used for the Web API testing.

**Type**

- `APIRequest`


### playwright.selectors {#playwright-selectors}

<Badge type="info" text="Added in: v1.8" />

Selectors can be used to install custom selector engines. See
[extensibility](../extensibility.md) for more information.

**Type**

- `Selectors`


### playwright.webkit {#playwright-webkit}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to WebKit, returning instances of [Browser](/api/class-browser).

**Type**

- `BrowserType`

