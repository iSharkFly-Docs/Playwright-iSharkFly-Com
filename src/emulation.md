---
title: "Emulation"
---

# Emulation

## Introduction

With Playwright you can test your app on any browser as well as emulate a real device such as a mobile phone or tablet. Simply configure the devices you would like to emulate and Playwright will simulate the browser behavior such as `"userAgent"`, `"screenSize"`, `"viewport"` and if it `"hasTouch"` enabled. You can also emulate the `"geolocation"`, `"locale"` and `"timezone"` for all tests or for a specific test as well as set the `"permissions"` to show notifications or change the `"colorScheme"`.

## Devices

Playwright comes with a [registry of device parameters](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json) using [`playwright.devices`](/api/class-playwright#playwright-devices) for selected desktop, tablet and mobile devices. It can be used to simulate browser behavior for a specific device such as user agent, screen size, viewport and if it has touch enabled. All tests will run with the specified device parameters.

::: code-group

```js [Test]
import { defineConfig, devices } from '@playwright/test'; // import devices

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
});
```

```js [Library]
const { chromium, devices } = require('playwright');
const browser = await chromium.launch();

const iphone13 = devices['iPhone 13'];
const context = await browser.newContext({
  ...iphone13,
});
```

:::

<img height="1582" width="916" alt="playwright.dev website emulated for iPhone 13" src="https://user-images.githubusercontent.com/13063165/220411073-76fe59f9-9a2d-463d-8e30-c19a7deca133.png" />

**Note**: Pre-configured devices assume a specific platform. For example, "Desktop Chrome" will provide a Windows-specific user agent string.

If you would like to use the user agent specific to the platform that is running the tests, we recommend unsetting the user agent property.

```js
const context = await browser.newContext({
  ...devices['Desktop Chrome'],
  userAgent: undefined,
});
```

## Viewport

The viewport is included in the device but you can override it for some tests with [`page.setViewportSize()`](/api/class-page#page-set-viewport-size).

::: code-group

```js [Test]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // It is important to define the `viewport` property after destructuring `devices`,
        // since devices also define the `viewport` for that device.
        viewport: { width: 1280, height: 720 },
      },
    },
  ]
});
```

```js [Library]
// Create context with given viewport
const context = await browser.newContext({
  viewport: { width: 1280, height: 1024 }
});
```

:::

Test file:

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 1600, height: 1200 },
});

test('my test', async ({ page }) => {
  // ...
});
```

```js [Library]
// Create context with given viewport
const context = await browser.newContext({
  viewport: { width: 1280, height: 1024 }
});

// Resize viewport for individual page
await page.setViewportSize({ width: 1600, height: 1200 });

// Emulate high-DPI
const context = await browser.newContext({
  viewport: { width: 2560, height: 1440 },
  deviceScaleFactor: 2,
});
```

:::

The same works inside a test file.

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.describe('specific viewport block', () => {
  test.use({ viewport: { width: 1600, height: 1200 } });

  test('my test', async ({ page }) => {
    // ...
  });
});
```

```js [Library]
// Create context with given viewport
const context = await browser.newContext({
  viewport: { width: 1600, height: 1200 }
});
const page = await context.newPage();
```

:::

## isMobile

Whether the meta viewport tag is taken into account and touch events are enabled.

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // It is important to define the `isMobile` property after destructuring `devices`,
        // since devices also define the `isMobile` for that device.
        isMobile: false,
      },
    },
  ]
});
```

:::

## Locale & Timezone

Emulate the browser Locale and Timezone which can be set globally for all tests in the config and then overridden for particular tests.

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Emulates the browser locale.
    locale: 'en-GB',

    // Emulates the browser timezone.
    timezoneId: 'Europe/Paris',
  },
});
```

:::

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});

test('my test for de lang in Berlin timezone', async ({ page }) => {
  await page.goto('https://www.bing.com');
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});
```

:::

<img height="1824" width="2788" alt="Bing in german lang and timezone" src="https://user-images.githubusercontent.com/13063165/220416571-ccc96ab1-44bb-4579-8430-64502fc24a15.png" />

###### 
Note that this only affects the browser timezone and locale, not the test runner timezone.
To set the test runner timezone, you can use the [`TZ` environment variable](https://nodejs.org/api/cli.html#tz).

## Permissions

Allow app to show system notifications.

::: code-group

```js [Test]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Grants specified permissions to the browser context.
    permissions: ['notifications'],
  },
});
```

```js [Library]
const context = await browser.newContext({
  permissions: ['notifications'],
});
```

:::

Allow notifications for a specific domain.

::: code-group

```js [Test]
import { test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // Runs before each test and signs in each page.
  await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });
});

test('first', async ({ page }) => {
  // page has notifications permission for https://skype.com.
});
```

```js [Library]
await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });
```

:::

Revoke all permissions with [`browserContext.clearPermissions()`](/api/class-browsercontext#browser-context-clear-permissions).

```js
// Library
await context.clearPermissions();
```

## Geolocation

Grant `"geolocation"` permissions and set geolocation to a specific area.

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Context geolocation
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    permissions: ['geolocation'],
  },
});
```

:::

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
});

test('my test with geolocation', async ({ page }) => {
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation']
});

```

:::

<img height="1824" width="2788" alt="geolocation for italy on bing maps" src="https://user-images.githubusercontent.com/13063165/220417670-bb22d815-f5cd-47c4-8562-0b88165eac27.png" />

Change the location later:

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
});

test('my test with geolocation', async ({ page, context }) => {
  // overwrite the location for this test
  await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });
});
```

```js [Library]
await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });
```

:::

**Note** you can only change geolocation for all pages in the context.

## Color Scheme and Media

Emulate the users `"colorScheme"`. Supported values are 'light', 'dark', and 'no-preference'. You can also emulate the media type with [`page.emulateMedia()`](/api/class-page#page-emulate-media).

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    colorScheme: 'dark',
  },
});
```

:::

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  colorScheme: 'dark' // or 'light'
});

test('my test with dark mode', async ({ page }) => {
  // ...
});
```

```js [Library]
// Create context with dark mode
const context = await browser.newContext({
  colorScheme: 'dark' // or 'light'
});

// Create page with dark mode
const page = await browser.newPage({
  colorScheme: 'dark' // or 'light'
});

// Change color scheme for the page
await page.emulateMedia({ colorScheme: 'dark' });

// Change media for page
await page.emulateMedia({ media: 'print' });
```

:::

<img height="1824" width="2788" alt="playwright web in dark mode" src="https://user-images.githubusercontent.com/13063165/220411638-55d2b051-4678-4da7-9f0b-ed22f5a3c47c.png" />

The `"reducedMotion"`, `"forcedColors"` and `"contrast"` options emulate the `prefers-reduced-motion`, `forced-colors` and `prefers-contrast` media features the same way. Supported values are `'reduce'` and `'no-preference'` for reduced motion, `'active'` and `'none'` for forced colors, and `'more'` and `'no-preference'` for contrast. [`page.emulateMedia()`](/api/class-page#page-emulate-media) changes them for a single page.

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    reducedMotion: 'reduce',
    forcedColors: 'active',
    contrast: 'more',
  },
});
```

:::

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  reducedMotion: 'reduce', // or 'no-preference'
  forcedColors: 'active', // or 'none'
  contrast: 'more', // or 'no-preference'
});

test('my test with reduced motion, forced colors and more contrast', async ({ page }) => {
  // ...
});
```

```js [Library]
// Create context with reduced motion, forced colors and more contrast
const context = await browser.newContext({
  reducedMotion: 'reduce', // or 'no-preference'
  forcedColors: 'active', // or 'none'
  contrast: 'more', // or 'no-preference'
});

// Change the media features for the page
await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active', contrast: 'more' });
```

:::

## User Agent

The User Agent is included in the device and therefore you  will rarely need to change it however if you do need to test a different user agent you can override it with the `userAgent` property.

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({ userAgent: 'My user agent' });

test('my user agent test', async ({ page }) => {
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  userAgent: 'My user agent'
});
```

:::

## Offline

Emulate the network being offline.

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    offline: true
  },
});
```

:::

::: info
Offline emulation affects HTTP requests, such as page navigations, `fetch()` and `XMLHttpRequest`.

WebSocket behavior depends on the browser and whether the connection is already established. Chromium and Firefox fail new WebSocket connections while offline, but do not close already-open connections. Chromium can defer incoming messages until the context goes back online, rather than lose them; Firefox can continue delivering messages while offline. WebKit can allow both new WebSocket connections and traffic on established connections while offline. Do not rely on offline emulation to test WebSocket message loss or connection closure.

Offline emulation does not affect WebRTC traffic: established `RTCPeerConnection`s keep sending and receiving media over UDP. To test WebRTC connection loss, interrupt the connection outside the browser, for example by stopping the TURN server or using an OS-level firewall.
:::

## JavaScript Enabled

Emulate a user scenario where JavaScript is disabled.

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('test with no JavaScript', async ({ page }) => {
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  javaScriptEnabled: false
});
```

:::
