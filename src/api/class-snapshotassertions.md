---
title: SnapshotAssertions
outline: 2
---

# SnapshotAssertions

<Badge type="info" text="Added in: v1.20" />

Playwright provides methods for comparing page and element screenshots with
expected values stored in files.

```js
expect(screenshot).toMatchSnapshot('landing-page.png');
```

## Methods

### snapshotAssertions.toMatchSnapshot() {#snapshot-assertions-to-match-snapshot-1}

<Badge type="info" text="Added in: v1.22" />

::: warning
To compare screenshots, use [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1) instead.
:::

Ensures that passed value, either a [string] or a [Buffer], matches the expected snapshot stored in the test snapshots directory.

**Usage**

```js
// Basic usage.
expect(await page.screenshot()).toMatchSnapshot('landing-page.png');

// Pass options to customize the snapshot comparison and have a generated name.
expect(await page.screenshot()).toMatchSnapshot('landing-page.png', {
  maxDiffPixels: 27, // allow no more than 27 different pixels.
});

// Configure image matching threshold.
expect(await page.screenshot()).toMatchSnapshot('landing-page.png', { threshold: 0.3 });

// Bring some structure to your snapshot files by passing file path segments.
expect(await page.screenshot()).toMatchSnapshot(['landing', 'step2.png']);
expect(await page.screenshot()).toMatchSnapshot(['landing', 'step3.png']);
```

Learn more about [visual comparisons](../test-snapshots.md).

Note that matching snapshots only work with Playwright test runner.

**Arguments**

- <a id="snapshot-assertions-to-match-snapshot-1-option-name"></a>`name` `string | Array<string>`

  Snapshot name.
- <a id="snapshot-assertions-to-match-snapshot-1-option-options"></a>`options` `Object` *(optional)*

  - <a id="snapshot-assertions-to-match-snapshot-1-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(optional)*

    An acceptable ratio of pixels that are different to the total amount of pixels, between `0` and `1`. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1-option-threshold) defines which pixels are considered different.
  - <a id="snapshot-assertions-to-match-snapshot-1-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(optional)*

    An acceptable amount of pixels that could be different. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1-option-threshold) defines which pixels are considered different.
  - <a id="snapshot-assertions-to-match-snapshot-1-option-threshold"></a>`threshold` `float` *(optional)*

    An acceptable perceived color difference in the [YIQ color space](https://en.wikipedia.org/wiki/YIQ)
    between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with
    `TestConfig.expect`. Defaults to `0.2`.


### snapshotAssertions.toMatchSnapshot() {#snapshot-assertions-to-match-snapshot-2}

<Badge type="info" text="Added in: v1.22" />

::: warning
To compare screenshots, use [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-2) instead.
:::

Ensures that passed value, either a [string] or a [Buffer], matches the expected snapshot stored in the test snapshots directory.

**Usage**

```js
// Basic usage and the file name is derived from the test name.
expect(await page.screenshot()).toMatchSnapshot();

// Pass options to customize the snapshot comparison and have a generated name.
expect(await page.screenshot()).toMatchSnapshot({
  maxDiffPixels: 27, // allow no more than 27 different pixels.
});

// Configure image matching threshold and snapshot name.
expect(await page.screenshot()).toMatchSnapshot({
  name: 'landing-page.png',
  threshold: 0.3,
});
```

Learn more about [visual comparisons](../test-snapshots.md).

Note that matching snapshots only work with Playwright test runner.

**Arguments**

- <a id="snapshot-assertions-to-match-snapshot-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="snapshot-assertions-to-match-snapshot-2-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(optional)*

    An acceptable ratio of pixels that are different to the total amount of pixels, between `0` and `1`. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-2-option-threshold) defines which pixels are considered different.
  - <a id="snapshot-assertions-to-match-snapshot-2-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(optional)*

    An acceptable amount of pixels that could be different. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-2-option-threshold) defines which pixels are considered different.
  - <a id="snapshot-assertions-to-match-snapshot-2-option-name"></a>`name` `string | Array<string>` *(optional)*

    Snapshot name. If not passed, the test name and ordinals are used when called multiple times.
  - <a id="snapshot-assertions-to-match-snapshot-2-option-threshold"></a>`threshold` `float` *(optional)*

    An acceptable perceived color difference in the [YIQ color space](https://en.wikipedia.org/wiki/YIQ)
    between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with
    `TestConfig.expect`. Defaults to `0.2`.

