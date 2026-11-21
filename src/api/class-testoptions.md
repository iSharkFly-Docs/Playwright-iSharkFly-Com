---
title: TestOptions
outline: 2
---

# TestOptions

<Badge type="info" text="Added in: v1.10" />

Playwright Test provides many options to configure test environment, [Browser](/api/class-browser), [BrowserContext](/api/class-browsercontext) and more.

These options are usually provided in the [configuration file](../test-configuration.md) through [`testConfig.use`](/api/class-testconfig#test-config-use) and [`testProject.use`](/api/class-testproject#test-project-use).

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
});
```

:::

Alternatively, with [`test.use()`](/api/class-test#test-use) you can override some options for a file.

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

// Run tests in this file with portrait-like viewport.
test.use({ viewport: { width: 600, height: 900 } });

test('my portrait test', async ({ page }) => {
  // ...
});
```

:::

## Properties

### testOptions.acceptDownloads {#test-options-accept-downloads}

<Badge type="info" text="Added in: v1.10" />

Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    acceptDownloads: false,
  },
});
```

:::

**Type**

- `boolean`


### testOptions.actionTimeout {#test-options-action-timeout}

<Badge type="info" text="Added in: v1.10" />

Default timeout for each Playwright action in milliseconds, defaults to 0 (no timeout).

This is a default timeout for all Playwright actions, same as configured via [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout).

**Usage**

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
  },
});
```

Learn more about [various timeouts](../test-timeouts.md).

**Type**

- `int`


### testOptions.baseURL {#test-options-base-url}

<Badge type="info" text="Added in: v1.10" />

When using [`page.goto()`](/api/class-page#page-goto), [`page.route()`](/api/class-page#page-route), [`page.waitForURL()`](/api/class-page#page-wait-for-url), [`page.waitForRequest()`](/api/class-page#page-wait-for-request), or [`page.waitForResponse()`](/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
* baseURL: `http://localhost:3000` and navigating to `/bar.html` results in `http://localhost:3000/bar.html`
* baseURL: `http://localhost:3000/foo/` and navigating to `./bar.html` results in `http://localhost:3000/foo/bar.html`
* baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in `http://localhost:3000/bar.html`

**Usage**

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
  },
});
```

**Type**

- `string`


### testOptions.browserName {#test-options-browser-name}

<Badge type="info" text="Added in: v1.10" />

Name of the browser that runs tests. Defaults to `'chromium'`. Most of the time you should set `browserName` in your [TestConfig](/api/class-testconfig):

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'firefox',
  },
});
```

:::

**Type**

- `"chromium" | "firefox" | "webkit"`


### testOptions.bypassCSP {#test-options-bypass-csp}

<Badge type="info" text="Added in: v1.10" />

Toggles bypassing page's Content-Security-Policy. Defaults to `false`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    bypassCSP: true,
  }
});
```

:::

**Type**

- `boolean`


### testOptions.channel {#test-options-channel}

<Badge type="info" text="Added in: v1.10" />

Browser distribution channel.

Use "chromium" to [opt in to new headless mode](../browsers.md#chromium-new-headless-mode).

Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded [Google Chrome and Microsoft Edge](../browsers.md#google-chrome--microsoft-edge).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
    },
  ]
});
```

:::

**Type**

- `string`


### testOptions.clientCertificates {#test-options-client-certificates}

<Badge type="info" text="Added in: v1.46" />

TLS Client Authentication allows the server to request a client certificate and verify it.

**Details**

An array of client certificates to be used. Each certificate object must have either both `certPath` and `keyPath`, a single `pfxPath`, or their corresponding direct value equivalents (`cert` and `key`, or `pfx`). Optionally, `passphrase` property should be provided if the certificate is encrypted. The `origin` property should be provided with an exact match to the request origin that the certificate is valid for.

Client certificate authentication is only active when at least one client certificate is provided. If you want to reject all client certificates sent by the server, you need to provide a client certificate with an `origin` that does not match any of the domains you plan to visit.

::: info
When using WebKit on macOS, accessing `localhost` will not pick up client certificates. You can make it work by replacing `localhost` with `local.playwright`.
:::

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    clientCertificates: [{
      origin: 'https://example.com',
      certPath: './cert.pem',
      keyPath: './key.pem',
      passphrase: 'mysecretpassword',
    }],
  },
});
```

:::

**Type**

- `Array<Object>`


### testOptions.colorScheme {#test-options-color-scheme}

<Badge type="info" text="Added in: v1.10" />

Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. See
[`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.

**Usage**

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

**Type**

- `null | "light" | "dark" | "no-preference"`


### testOptions.connectOptions {#test-options-connect-options}

<Badge type="info" text="Added in: v1.10" />

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    connectOptions: {
      wsEndpoint: 'ws://localhost:5678',
    },
  },
});
```

:::

When connect options are specified, default [`fixtures.browser`](/api/class-fixtures#fixtures-browser), [`fixtures.context`](/api/class-fixtures#fixtures-context) and [`fixtures.page`](/api/class-fixtures#fixtures-page) use the remote browser instead of launching a browser locally.

**Type**

- `void | Object`


### testOptions.contextOptions {#test-options-context-options}

<Badge type="info" text="Added in: v1.10" />

Options used to create the context, as passed to [`browser.newContext()`](/api/class-browser#browser-new-context). Specific options like [`testOptions.viewport`](/api/class-testoptions#test-options-viewport) take priority over this.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
});
```

:::

**Type**

- `Object`


### testOptions.contrast {#test-options-contrast}

<Badge type="info" text="Added in: v1.50" />

Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    contrast: 'more',
  },
});
```

:::

**Type**

- `null | "no-preference" | "more"`


### testOptions.deviceScaleFactor {#test-options-device-scale-factor}

<Badge type="info" text="Added in: v1.10" />

Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 2,
  },
});
```

:::

**Type**

- `float`


### testOptions.extraHTTPHeaders {#test-options-extra-http-headers}

<Badge type="info" text="Added in: v1.10" />

An object containing additional HTTP headers to be sent with every request. Defaults to none.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    extraHTTPHeaders: {
      'X-My-Header': 'value',
    },
  },
});
```

:::

**Type**

- `Object<string, string>`


### testOptions.forcedColors {#test-options-forced-colors}

<Badge type="info" text="Added in: v1.50" />

Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'none'`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    forcedColors: 'active',
  },
});
```

:::

**Type**

- `null | "active" | "none"`


### testOptions.geolocation {#test-options-geolocation}

<Badge type="info" text="Added in: v1.10" />

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
  },
});
```

:::

Learn more about [geolocation](../emulation.md#color-scheme-and-media).

**Type**

- `Object`


### testOptions.hasTouch {#test-options-has-touch}

<Badge type="info" text="Added in: v1.10" />

Specifies if viewport supports touch events. Defaults to false. Learn more about [mobile emulation](../emulation.md#devices).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    hasTouch: true
  },
});
```

:::

**Type**

- `boolean`


### testOptions.headless {#test-options-headless}

<Badge type="info" text="Added in: v1.10" />

Whether to run browser in headless mode. More details for
[Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
[Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/). Defaults to `true`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false
  },
});
```

:::

**Type**

- `boolean`


### testOptions.httpCredentials {#test-options-http-credentials}

<Badge type="info" text="Added in: v1.10" />

Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    httpCredentials: {
      username: 'user',
      password: 'pass',
    },
  },
});
```

:::

When passing an array of credentials to [`test.use()`](/api/class-test#test-use), wrap it into an extra array, see [fixture options](../test-fixtures.md#fixtures-options).

::: code-group

```js [example.spec.ts]
test.use({
  httpCredentials: [[
    { username: 'alice', password: 'alice-pass', origin: 'https://a.example.com' },
    { username: 'bob', password: 'bob-pass', origin: 'https://b.example.com' },
  ], { scope: 'test' }],
});
```

:::

**Type**

- `Object | Array<Object>`


### testOptions.ignoreHTTPSErrors {#test-options-ignore-https-errors}

<Badge type="info" text="Added in: v1.10" />

Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    ignoreHTTPSErrors: true,
  },
});
```

:::

**Type**

- `boolean`


### testOptions.isMobile {#test-options-is-mobile}

<Badge type="info" text="Added in: v1.10" />

Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    isMobile: false,
  },
});
```

:::

**Type**

- `boolean`


### testOptions.javaScriptEnabled {#test-options-java-script-enabled}

<Badge type="info" text="Added in: v1.10" />

Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    javaScriptEnabled: false,
  },
});
```

:::

**Type**

- `boolean`


### testOptions.launchOptions {#test-options-launch-options}

<Badge type="info" text="Added in: v1.10" />

Options used to launch the browser, as passed to [`browserType.launch()`](/api/class-browsertype#browser-type-launch). Specific options [`testOptions.headless`](/api/class-testoptions#test-options-headless) and [`testOptions.channel`](/api/class-testoptions#test-options-channel) take priority over this.

::: warning
Use custom browser args at your own risk, as some of them may break Playwright functionality.
:::

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    }
  ]
});
```

:::

**Type**

- `Object`


### testOptions.locale {#test-options-locale}

<Badge type="info" text="Added in: v1.10" />

Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to `en-US`. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    locale: 'it-IT',
  },
});
```

:::

**Type**

- `string`


### testOptions.locateOnlyVisible {#test-options-locate-only-visible}

<Badge type="info" text="Added in: v1.66" />

Whether locators in this context find only [visible](../actionability.md#visible) elements.
Defaults to `false`.

When enabled, Playwright applies two rules:
1. The element that a locator finds must be visible. Actions, assertions and queries behave as if
   [`locator.visible()`](/api/class-locator#locator-visible) was called at the end of the locator chain.
1. [`locator.first()`](/api/class-locator#locator-first), [`locator.last()`](/api/class-locator#locator-last) and [`locator.nth()`](/api/class-locator#locator-nth) select among visible
   elements. They behave as if [`locator.visible()`](/api/class-locator#locator-visible) was called immediately before them.

```js
// <div hidden>One</div> <div>Two</div> <div>Three</div>
await expect(page.locator('div')).toHaveCount(2);
await expect(page.locator('div').first()).toHaveText('Two');
await expect(page.locator('div').last()).toHaveText('Three');
```

An explicit visibility filter always has priority. Playwright does not add its own filter in a position
that already has one. For example, `page.locator('div').filter({ visible: false }).first()` finds the first
hidden element.

All other parts of the locator chain are not filtered. In `page.locator('section').getByRole('button')`,
the button must be visible, but the section can be hidden by the [visibility](../actionability.md#visible) rules,
for example because it has zero size. The same applies to the inner locators of [`locator.filter()`](/api/class-locator#locator-filter),

[`locator.and()`](/api/class-locator#locator-and) and [`locator.or()`](/api/class-locator#locator-or): only the second rule applies to them.

This option does not change the accessibility rules of [`page.getByRole()`](/api/class-page#page-get-by-role)
or the behavior of selector-based methods such as [`page.$()`](/api/class-page#page-query-selector).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    locateOnlyVisible: true,
  },
});
```

:::

**Type**

- `boolean`


### testOptions.navigationTimeout {#test-options-navigation-timeout}

<Badge type="info" text="Added in: v1.10" />

Timeout for each navigation action in milliseconds. Defaults to 0 (no timeout).

This is a default navigation timeout, same as configured via [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    navigationTimeout: 3000,
  },
});
```

:::

Learn more about [various timeouts](../test-timeouts.md).

**Type**

- `int`


### testOptions.offline {#test-options-offline}

<Badge type="info" text="Added in: v1.10" />

Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).

**Usage**

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

**Type**

- `boolean`


### testOptions.permissions {#test-options-permissions}

<Badge type="info" text="Added in: v1.10" />

A list of permissions to grant to all pages in this context. See
[`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    permissions: ['notifications'],
  },
});
```

:::

**Type**

- `Array<string>`


### testOptions.proxy {#test-options-proxy}

<Badge type="info" text="Added in: v1.10" />

Network proxy settings.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    proxy: {
      server: 'http://myproxy.com:3128',
      bypass: 'localhost',
    },
  },
});
```

:::

**Type**

- `Object`


### testOptions.reducedMotion {#test-options-reduced-motion}

<Badge type="info" text="Added in: v1.50" />

Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    reducedMotion: 'reduce',
  },
});
```

:::

**Type**

- `null | "reduce" | "no-preference"`


### testOptions.reuseContext {#test-options-reuse-context}

<Badge type="info" text="Added in: v1.62" />

::: warning Discouraged
This option trades test isolation for speed and is intended for component tests that drive a story gallery. Leave it unset for end-to-end tests - a fresh browser context per test is one of the core guarantees of Playwright Test.
:::

**Experimental.** When set to `true`, all tests in a worker process run in a single browser context that is reused between tests, instead of getting a brand new context per test. Defaults to `false`.

Between tests, Playwright resets the state that component tests typically touch: it clears cookies, cache, local storage and IndexedDB of visited origins, unregisters service workers, closes extra pages, removes routes, bindings and init scripts, and re-applies the configured storage state, viewport and emulation options.

This reset is best-effort, not a guarantee of isolation. State that is **not** reset includes:
* Permissions granted with [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) during a test.
* Runtime changes made through [`browserContext.setGeolocation()`](/api/class-browsercontext#browser-context-set-geolocation), [`browserContext.setOffline()`](/api/class-browsercontext#browser-context-set-offline) and [`browserContext.setExtraHTTPHeaders()`](/api/class-browsercontext#browser-context-set-extra-http-headers).
* Browsing history, `window.name` and any browser-process-wide state.

Additional restrictions:
* The option is ignored when [`testOptions.video`](/api/class-testoptions#test-options-video) recording is enabled.
* Only a few context options may differ between consecutive tests: `colorScheme`, `forcedColors`, `reducedMotion`, `contrast`, `screen`, `userAgent`, `viewport` and `testIdAttribute`. Changing any other option in [`test.use()`](/api/class-test#test-use), for example `locale` or `storageState`, silently forces a fresh context and negates the speedup.
* Do not combine with [`testOptions.connectOptions`](/api/class-testoptions#test-options-connect-options) pointing multiple workers at a shared browser - workers would compete for the single reusable context.
* `recordHar` in [`testOptions.contextOptions`](/api/class-testoptions#test-options-context-options) is not supported and produces no HAR file.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'components',
      testDir: './tests/components',
      use: { reuseContext: true },
    },
  ],
});
```

:::

**Type**

- `boolean`


### testOptions.screen {#test-options-screen}

<Badge type="info" text="Added in: v1.64" />

Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the [`testOptions.viewport`](/api/class-testoptions#test-options-viewport) is set.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 390, height: 664 },
    screen: { width: 390, height: 844 },
  },
});
```

:::

**Type**

- `Object`


### testOptions.screenshot {#test-options-screenshot}

<Badge type="info" text="Added in: v1.10" />

Whether to automatically capture a screenshot after each test. Defaults to `'off'`.
* `'off'`: Do not capture screenshots.
* `'on'`: Capture screenshot after each test.
* `'only-on-failure'`: Capture screenshot after each test failure.
* `'on-first-failure'`: Capture screenshot after each test's first failure.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  },
});
```

:::

Learn more about [automatic screenshots](../test-use-options.md#recording-options).

**Type**

- `Object | "off" | "on" | "only-on-failure" | "on-first-failure"`


### testOptions.serviceWorkers {#test-options-service-workers}

<Badge type="info" text="Added in: v1.10" />

Whether to allow sites to register Service workers. Defaults to `'allow'`.
* `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
* `'block'`: Playwright will block all registration of Service Workers.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    serviceWorkers: 'allow'
  },
});
```

:::

**Type**

- `"allow" | "block"`


### testOptions.storageState {#test-options-storage-state}

<Badge type="info" text="Added in: v1.10" />

Learn more about [storage state and auth](../auth.md).

Populates context with given storage state. This option can be used to initialize context with logged-in information obtained via [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    storageState: 'storage-state.json',
  },
});
```

:::

**Details**

When storage state is set up in the config, it is possible to reset storage state for a file:

::: code-group

```js [not-signed-in.spec.ts]
import { test } from '@playwright/test';

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test('not signed in test', async ({ page }) => {
  // ...
});
```

:::

**Type**

- `path | Object`


### testOptions.testIdAttribute {#test-options-test-id-attribute}

<Badge type="info" text="Added in: v1.27" />

Custom attribute to be used in [`page.getByTestId()`](/api/class-page#page-get-by-test-id). `data-testid` is used by default. To match
elements with any of several attributes, pass them as a comma-separated list.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'pw-test-id',
  },
});
```

:::

Multiple attributes:

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-pw,data-ti',
  },
});
```

:::

**Type**

- `void`


### testOptions.timezoneId {#test-options-timezone-id}

<Badge type="info" text="Added in: v1.10" />

Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
for a list of supported timezone IDs. Defaults to the system timezone.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    timezoneId: 'Europe/Rome',
  },
});
```

:::

**Type**

- `string`


### testOptions.trace {#test-options-trace}

<Badge type="info" text="Added in: v1.10" />

Whether to record trace for each test. Defaults to `'off'`. The initial run of a test is the "first run"; subsequent runs caused by [retries](../test-retries.md) are "retries".
* `'off'`: Do not record trace.
* `'on'`: Record and keep a trace for every run.
* `'on-first-retry'`: Record and keep a trace only for the first retry of a test.
* `'on-all-retries'`: Record and keep a trace for every retry.
* `'retain-on-failure'`: Record a trace for every run, but keep it only for runs that failed. A failed run's trace is kept even when a later retry passes.
* `'retain-on-first-failure'`: Record a trace only for the first run of a test (not for retries), and keep it only if that run failed.
* `'retain-on-failure-and-retries'`: Record a trace for every run, and keep it for any run that failed or that is a retry.

See [trace modes](../test-use-options.md#trace-modes) for a side-by-side comparison of what each mode records and keeps.

For more control, pass an object that specifies `mode` and trace features to enable.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'on-first-retry'
  },
});
```

:::

Learn more about [recording trace](../test-use-options.md#recording-options).

**Type**

- `Object | "off" | "on" | "on-first-retry" | "on-all-retries" | "retain-on-failure" | "retain-on-first-failure" | "retain-on-failure-and-retries"`


### testOptions.userAgent {#test-options-user-agent}

<Badge type="info" text="Added in: v1.10" />

Specific user agent to use in this context.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    userAgent: 'some custom ua',
  },
});
```

:::

**Type**

- `string`


### testOptions.video {#test-options-video}

<Badge type="info" text="Added in: v1.10" />

Whether to record video for each test. Defaults to `'off'`. The initial run of a test is the "first run"; subsequent runs caused by [retries](../test-retries.md) are "retries".
* `'off'`: Do not record video.
* `'on'`: Record and keep a video for every run.
* `'on-first-retry'`: Record and keep a video only for the first retry of a test.
* `'on-all-retries'`: Record and keep a video for every retry.
* `'retain-on-failure'`: Record a video for every run, but keep it only for runs that failed. A failed run's video is kept even when a later retry passes.
* `'retain-on-first-failure'`: Record a video only for the first run of a test (not for retries), and keep it only if that run failed.
* `'retain-on-failure-and-retries'`: Record a video for every run, and keep it for any run that failed or that is a retry.

See [video modes](../test-use-options.md#video-modes) for a side-by-side comparison of what each mode records and keeps.

To control video size, pass an object with `mode` and `size` properties. If video size is not specified, it will be equal to [`testOptions.viewport`](/api/class-testoptions#test-options-viewport) scaled down to fit into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450. Actual picture of each page will be scaled down if necessary to fit the specified size.

To record smoother video of animations and scrolling, pass `fps`, for example `{ mode: 'on', size: { width: 1920, height: 1080 }, fps: 60 }`. Higher frame rates and sizes use more CPU for encoding. Firefox and WebKit currently capture up to 25 frames per second.

To annotate actions in the video, pass `show` with `actions` and/or `test` sub-options. The `actions` option controls visual highlights on interacted elements, each shown for an optional `duration` in milliseconds (defaults to `500`). The `test` option controls which test information is displayed as a status overlay.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: 'on-first-retry',
  },
});
```

:::

Learn more about [recording video](../test-use-options.md#recording-options).

**Type**

- `Object | "off" | "on" | "retain-on-failure" | "on-first-retry" | "on-all-retries" | "retain-on-first-failure" | "retain-on-failure-and-retries"`


### testOptions.viewport {#test-options-viewport}

<Badge type="info" text="Added in: v1.10" />

Emulates consistent viewport for each page. Defaults to an 1280x720 viewport.
Use `null` to disable the consistent viewport emulation. Learn more about [viewport emulation](../emulation#viewport).

::: info
The `null` value opts out from the default presets, makes viewport depend on the
host window size defined by the operating system. It makes the execution of the
tests non-deterministic.
:::

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 100, height: 100 },
  },
});
```

:::

**Type**

- `null | Object`

