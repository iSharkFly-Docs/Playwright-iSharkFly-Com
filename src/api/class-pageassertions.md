---
title: PageAssertions
outline: 2
---

# PageAssertions

<Badge type="info" text="Added in: v1.17" />

The [PageAssertions](/api/class-pageassertions) class provides assertion methods that can be used to make assertions about the [Page](/api/class-page) state in the tests.

```js
import { test, expect } from '@playwright/test';

test('navigates to login', async ({ page }) => {
  // ...
  await page.getByText('Sign in').click();
  await expect(page).toHaveURL(/.*\/login/);
});
```

## Methods

### pageAssertions.toHaveScreenshot() {#page-assertions-to-have-screenshot-1}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

This function will wait until two consecutive page screenshots
yield the same result, and then compare the last screenshot with the expectation.

**Usage**

```js
await expect(page).toHaveScreenshot('image.png');

// Store the snapshot in the WebP format.
await expect(page).toHaveScreenshot('image.webp');
```

Note that screenshot assertions only work with Playwright test runner.

**Arguments**

- <a id="page-assertions-to-have-screenshot-1-option-name"></a>`name` `string | Array<string>`

  Snapshot name. Must have a `.png` or `.webp` extension, the screenshot is captured in the corresponding format. Both formats are lossless.
- <a id="page-assertions-to-have-screenshot-1-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-screenshot-1-option-animations"></a>`animations` `"disabled" | "allow"` *(optional)*

    When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
    * finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
    * infinite animations are canceled to initial state, and then played over after the screenshot.

    Defaults to `"disabled"` that disables animations.
  - <a id="page-assertions-to-have-screenshot-1-option-caret"></a>`caret` `"hide" | "initial"` *(optional)*

    When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be changed.  Defaults to `"hide"`.
  - <a id="page-assertions-to-have-screenshot-1-option-clip"></a>`clip` `Object` *(optional)*

    An object which specifies clipping of the resulting image.

    - `x` `float`

      x-coordinate of top-left corner of clip area
    - `y` `float`

      y-coordinate of top-left corner of clip area
    - `width` `float`

      width of clipping area
    - `height` `float`

      height of clipping area
  - <a id="page-assertions-to-have-screenshot-1-option-full-page"></a>`fullPage` `boolean` *(optional)*

    When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to
    `false`.
  - <a id="page-assertions-to-have-screenshot-1-option-mask"></a>`mask` `Array<Locator>` *(optional)*

    Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with
    a pink box `#FF00FF` (customized by [`maskColor`](/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="page-assertions-to-have-screenshot-1-option-mask-color"></a>`maskColor` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="page-assertions-to-have-screenshot-1-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(optional)*

    An acceptable ratio of pixels that are different to the total amount of pixels, between `0` and `1`. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-threshold) defines which pixels are considered different.
  - <a id="page-assertions-to-have-screenshot-1-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(optional)*

    An acceptable amount of pixels that could be different. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-threshold) defines which pixels are considered different.
  - <a id="page-assertions-to-have-screenshot-1-option-omit-background"></a>`omitBackground` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="page-assertions-to-have-screenshot-1-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"css"`.
  - <a id="page-assertions-to-have-screenshot-1-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="page-assertions-to-have-screenshot-1-option-style-path"></a>`stylePath` `string | Array<string>` *(optional)* <Badge type="info" text="Added in: v1.41" />

    File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
  - <a id="page-assertions-to-have-screenshot-1-option-threshold"></a>`threshold` `float` *(optional)*

    An acceptable perceived color difference in the [YIQ color space](https://en.wikipedia.org/wiki/YIQ)
    between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with
    `TestConfig.expect`. Defaults to `0.2`.
  - <a id="page-assertions-to-have-screenshot-1-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### pageAssertions.toHaveScreenshot() {#page-assertions-to-have-screenshot-2}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

This function will wait until two consecutive page screenshots
yield the same result, and then compare the last screenshot with the expectation.

The snapshot is stored in the PNG format. To store it in the WebP format instead, pass a snapshot name with the `.webp` extension.

**Usage**

```js
await expect(page).toHaveScreenshot();
```

Note that screenshot assertions only work with Playwright test runner.

**Arguments**

- <a id="page-assertions-to-have-screenshot-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-screenshot-2-option-animations"></a>`animations` `"disabled" | "allow"` *(optional)*

    When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
    * finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
    * infinite animations are canceled to initial state, and then played over after the screenshot.

    Defaults to `"disabled"` that disables animations.
  - <a id="page-assertions-to-have-screenshot-2-option-caret"></a>`caret` `"hide" | "initial"` *(optional)*

    When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be changed.  Defaults to `"hide"`.
  - <a id="page-assertions-to-have-screenshot-2-option-clip"></a>`clip` `Object` *(optional)*

    An object which specifies clipping of the resulting image.

    - `x` `float`

      x-coordinate of top-left corner of clip area
    - `y` `float`

      y-coordinate of top-left corner of clip area
    - `width` `float`

      width of clipping area
    - `height` `float`

      height of clipping area
  - <a id="page-assertions-to-have-screenshot-2-option-full-page"></a>`fullPage` `boolean` *(optional)*

    When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to
    `false`.
  - <a id="page-assertions-to-have-screenshot-2-option-mask"></a>`mask` `Array<Locator>` *(optional)*

    Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with
    a pink box `#FF00FF` (customized by [`maskColor`](/api/class-pageassertions#page-assertions-to-have-screenshot-2-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="page-assertions-to-have-screenshot-2-option-mask-color"></a>`maskColor` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="page-assertions-to-have-screenshot-2-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(optional)*

    An acceptable ratio of pixels that are different to the total amount of pixels, between `0` and `1`. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-2-option-threshold) defines which pixels are considered different.
  - <a id="page-assertions-to-have-screenshot-2-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(optional)*

    An acceptable amount of pixels that could be different. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-2-option-threshold) defines which pixels are considered different.
  - <a id="page-assertions-to-have-screenshot-2-option-omit-background"></a>`omitBackground` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="page-assertions-to-have-screenshot-2-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"css"`.
  - <a id="page-assertions-to-have-screenshot-2-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="page-assertions-to-have-screenshot-2-option-style-path"></a>`stylePath` `string | Array<string>` *(optional)* <Badge type="info" text="Added in: v1.41" />

    File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
  - <a id="page-assertions-to-have-screenshot-2-option-threshold"></a>`threshold` `float` *(optional)*

    An acceptable perceived color difference in the [YIQ color space](https://en.wikipedia.org/wiki/YIQ)
    between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with
    `TestConfig.expect`. Defaults to `0.2`.
  - <a id="page-assertions-to-have-screenshot-2-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### pageAssertions.toHaveTitle() {#page-assertions-to-have-title}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the page has the given title.

**Usage**

```js
await expect(page).toHaveTitle(/.*checkout/);
```

**Arguments**

- <a id="page-assertions-to-have-title-option-title-or-reg-exp"></a>`titleOrRegExp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected title or RegExp.
- <a id="page-assertions-to-have-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-title-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="page-assertions-to-have-title-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### pageAssertions.toHaveURL() {#page-assertions-to-have-url}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the page is navigated to the given URL.

**Usage**

```js
// Check for the page URL to be 'https://playwright.dev/docs/intro' (including query string)
await expect(page).toHaveURL('https://playwright.dev/docs/intro');

// Check for the page URL to contain 'doc', followed by an optional 's', followed by '/'
await expect(page).toHaveURL(/docs?\//);

// Check for the page URL to match the URL pattern
await expect(page).toHaveURL(new URLPattern({ pathname: '/docs/*' }));

// Check for the predicate to be satisfied
// For example: verify query strings
await expect(page).toHaveURL(url => {
  const params = url.searchParams;
  return params.has('search') && params.has('options') && params.get('id') === '5';
});
```

**Arguments**

- <a id="page-assertions-to-have-url-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean` <Badge type="info" text="Added in: v1.18" />

  Expected URL string, RegExp, or predicate receiving [URL] to match.
  When [`baseURL`](/api/class-browser#browser-new-context-option-base-url) is provided via the context options and the `url` argument is a string, the two values are merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor and used for the comparison against the current browser URL.
- <a id="page-assertions-to-have-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-url-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.44" />

    Whether to perform case-insensitive match. [`ignoreCase`](/api/class-pageassertions#page-assertions-to-have-url-option-ignore-case) option takes precedence over the corresponding regular expression parameter if specified. A provided predicate ignores this flag.
  - <a id="page-assertions-to-have-url-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="page-assertions-to-have-url-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### pageAssertions.toMatchAriaSnapshot() {#page-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.60" /> <Badge type="tip" text="async" />

Asserts that the page body matches the given [accessibility snapshot](../aria-snapshots.md).

**Usage**

```js
await page.goto('https://demo.playwright.dev/todomvc/');
await expect(page).toMatchAriaSnapshot(`
  - heading "todos"
  - textbox "What needs to be done?"
`);
```

**Arguments**

- <a id="page-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="page-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-match-aria-snapshot-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="page-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### pageAssertions.toMatchAriaSnapshot() {#page-assertions-to-match-aria-snapshot-2}

<Badge type="info" text="Added in: v1.60" /> <Badge type="tip" text="async" />

Asserts that the page body matches the given [accessibility snapshot](../aria-snapshots.md).

Snapshot is stored in a separate `.aria.yml` file in a location configured by `expect.toMatchAriaSnapshot.pathTemplate` and/or `snapshotPathTemplate` properties in the configuration file.

**Usage**

```js
await expect(page).toMatchAriaSnapshot();
await expect(page).toMatchAriaSnapshot({ name: 'home.aria.yml' });
```

**Arguments**

- <a id="page-assertions-to-match-aria-snapshot-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-match-aria-snapshot-2-option-name"></a>`name` `string` *(optional)*

    Name of the snapshot to store in the snapshot folder corresponding to this test.
    Generates sequential names if not specified.
  - <a id="page-assertions-to-match-aria-snapshot-2-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="page-assertions-to-match-aria-snapshot-2-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


## Properties

### pageAssertions.not {#page-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the page URL doesn't contain `"error"`:

```js
await expect(page).not.toHaveURL('error');
```

**Type**

- `PageAssertions`

