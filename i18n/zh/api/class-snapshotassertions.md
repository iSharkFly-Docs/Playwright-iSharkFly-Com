---
title: SnapshotAssertions
outline: 2
---

# SnapshotAssertions

<Badge type="info" text="Added in: v1.20" />

Playwright 提供了用于将页面和元素截图与存储在文件中的预期值进行比较的方法。

```js
expect(screenshot).toMatchSnapshot('landing-page.png');
```

## 方法

### snapshotAssertions.toMatchSnapshot() {#snapshot-assertions-to-match-snapshot-1}

<Badge type="info" text="Added in: v1.22" />

::: warning
要比较截图，请改用 [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1)。
:::

确保传入的值（[string] 或 [Buffer]）与存储在测试快照目录中的预期快照匹配。

**用法**

```js
// 基本用法。
expect(await page.screenshot()).toMatchSnapshot('landing-page.png');

// 传递选项以自定义快照比较并使用生成的名称。
expect(await page.screenshot()).toMatchSnapshot('landing-page.png', {
  maxDiffPixels: 27, // 允许最多 27 个不同的像素。
});

// 配置图像匹配阈值。
expect(await page.screenshot()).toMatchSnapshot('landing-page.png', { threshold: 0.3 });

// 通过传递文件路径段为快照文件提供一些结构。
expect(await page.screenshot()).toMatchSnapshot(['landing', 'step2.png']);
expect(await page.screenshot()).toMatchSnapshot(['landing', 'step3.png']);
```

了解更多关于[视觉比较](../test-snapshots.md)的信息。

注意，快照匹配仅适用于 Playwright 测试运行器。

**参数**

- <a id="snapshot-assertions-to-match-snapshot-1-option-name"></a>`name` `string | Array<string>`

  快照名称。
- <a id="snapshot-assertions-to-match-snapshot-1-option-options"></a>`options` `Object` *(可选)*

  - <a id="snapshot-assertions-to-match-snapshot-1-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(可选)*

    可接受的不同像素与总像素数的比率，介于 `0` 和 `1` 之间。默认值可通过 `TestConfig.expect` 配置。注意，[`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1-option-threshold) 定义了哪些像素被认为是不同的。
  - <a id="snapshot-assertions-to-match-snapshot-1-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(可选)*

    可接受的不同像素数量。默认值可通过 `TestConfig.expect` 配置。注意，[`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1-option-threshold) 定义了哪些像素被认为是不同的。
  - <a id="snapshot-assertions-to-match-snapshot-1-option-threshold"></a>`threshold` `float` *(可选)*

    在 [YIQ 颜色空间](https://en.wikipedia.org/wiki/YIQ)中，比较图像中相同像素之间可接受的感知颜色差异，介于零（严格）和一（宽松）之间，默认值可通过 `TestConfig.expect` 配置。默认为 `0.2`。


### snapshotAssertions.toMatchSnapshot() {#snapshot-assertions-to-match-snapshot-2}

<Badge type="info" text="Added in: v1.22" />

::: warning
要比较截图，请改用 [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-2)。
:::

确保传入的值（[string] 或 [Buffer]）与存储在测试快照目录中的预期快照匹配。

**用法**

```js
// 基本用法，文件名从测试名称派生。
expect(await page.screenshot()).toMatchSnapshot();

// 传递选项以自定义快照比较并使用生成的名称。
expect(await page.screenshot()).toMatchSnapshot({
  maxDiffPixels: 27, // 允许最多 27 个不同的像素。
});

// 配置图像匹配阈值和快照名称。
expect(await page.screenshot()).toMatchSnapshot({
  name: 'landing-page.png',
  threshold: 0.3,
});
```

了解更多关于[视觉比较](../test-snapshots.md)的信息。

注意，快照匹配仅适用于 Playwright 测试运行器。

**参数**

- <a id="snapshot-assertions-to-match-snapshot-2-option-options"></a>`options` `Object` *(可选)*

  - <a id="snapshot-assertions-to-match-snapshot-2-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(可选)*

    可接受的不同像素与总像素数的比率，介于 `0` 和 `1` 之间。默认值可通过 `TestConfig.expect` 配置。注意，[`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-2-option-threshold) 定义了哪些像素被认为是不同的。
  - <a id="snapshot-assertions-to-match-snapshot-2-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(可选)*

    可接受的不同像素数量。默认值可通过 `TestConfig.expect` 配置。注意，[`threshold`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-2-option-threshold) 定义了哪些像素被认为是不同的。
  - <a id="snapshot-assertions-to-match-snapshot-2-option-name"></a>`name` `string | Array<string>` *(可选)*

    快照名称。如果未传递，则在多次调用时使用测试名称和序号。
  - <a id="snapshot-assertions-to-match-snapshot-2-option-threshold"></a>`threshold` `float` *(可选)*

    在 [YIQ 颜色空间](https://en.wikipedia.org/wiki/YIQ)中，比较图像中相同像素之间可接受的感知颜色差异，介于零（严格）和一（宽松）之间，默认值可通过 `TestConfig.expect` 配置。默认为 `0.2`。
