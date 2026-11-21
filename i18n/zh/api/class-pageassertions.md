---
title: PageAssertions
outline: 2
---

# PageAssertions

<Badge type="info" text="Added in: v1.17" />

[PageAssertions](/api/class-pageassertions) 类提供了可用于在测试中对 [Page](/api/class-page) 状态进行断言的断言方法。

```js
import { test, expect } from '@playwright/test';

test('navigates to login', async ({ page }) => {
  // ...
  await page.getByText('Sign in').click();
  await expect(page).toHaveURL(/.*\/login/);
});
```

## 方法

### pageAssertions.toHaveScreenshot() {#page-assertions-to-have-screenshot-1}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

此函数将等待直到两个连续的页面截图产生相同的结果，然后将最后一个截图与期望进行比较。

**用法**

```js
await expect(page).toHaveScreenshot('image.png');

// 以 WebP 格式存储快照。
await expect(page).toHaveScreenshot('image.webp');
```

注意截图断言仅适用于 Playwright 测试运行器。

**参数**

- <a id="page-assertions-to-have-screenshot-1-option-name"></a>`name` `string | Array<string>`

  快照名称。必须具有 `.png` 或 `.webp` 扩展名，截图以相应格式捕获。两种格式都是无损的。
- <a id="page-assertions-to-have-screenshot-1-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-assertions-to-have-screenshot-1-option-animations"></a>`animations` `"disabled" | "allow"` *(可选)*

    当设置为 `"disabled"` 时，停止 CSS 动画、CSS 过渡和 Web 动画。动画根据其持续时间有不同的处理方式：
    * 有限动画被快进到完成，因此它们将触发 `transitionend` 事件。
    * 无限动画被取消到初始状态，然后在截图后重新播放。

    默认为 `"disabled"` 以禁用动画。
  - <a id="page-assertions-to-have-screenshot-1-option-caret"></a>`caret` `"hide" | "initial"` *(可选)*

    当设置为 `"hide"` 时，截图将隐藏文本光标。当设置为 `"initial"` 时，文本光标行为不会改变。默认为 `"hide"`。
  - <a id="page-assertions-to-have-screenshot-1-option-clip"></a>`clip` `Object` *(可选)*

    指定结果图像裁剪的对象。

    - `x` `float`

      裁剪区域左上角的 x 坐标
    - `y` `float`

      裁剪区域左上角的 y 坐标
    - `width` `float`

      裁剪区域的宽度
    - `height` `float`

      裁剪区域的高度
  - <a id="page-assertions-to-have-screenshot-1-option-full-page"></a>`fullPage` `boolean` *(可选)*

    当为 true 时，截取完整可滚动页面的截图，而不是当前可见的视口。默认为 `false`。
  - <a id="page-assertions-to-have-screenshot-1-option-mask"></a>`mask` `Array<Locator>` *(可选)*

    指定截图时应被遮罩的定位器。遮罩元素将被覆盖一个粉色方框 `#FF00FF`（由 [`maskColor`](/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-mask-color) 自定义），完全覆盖其边界框。
    遮罩也适用于不可见元素，参见[仅匹配可见元素](../locators.md#matching-only-visible-elements)以禁用此行为。
  - <a id="page-assertions-to-have-screenshot-1-option-mask-color"></a>`maskColor` `string` *(可选)* <Badge type="info" text="Added in: v1.35" />

    指定遮罩元素覆盖框的颜色，使用 [CSS 颜色格式](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)。默认颜色为粉色 `#FF00FF`。
  - <a id="page-assertions-to-have-screenshot-1-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(可选)*

    不同像素与总像素数量的可接受比率，介于 `0` 和 `1` 之间。默认可通过 `TestConfig.expect` 配置。注意 [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-threshold) 定义哪些像素被视为不同。
  - <a id="page-assertions-to-have-screenshot-1-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(可选)*

    可接受的不同像素数量。默认可通过 `TestConfig.expect` 配置。注意 [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-threshold) 定义哪些像素被视为不同。
  - <a id="page-assertions-to-have-screenshot-1-option-omit-background"></a>`omitBackground` `boolean` *(可选)*

    隐藏默认白色背景并允许使用透明度捕获截图。不适用于 `jpeg` 图像。
    默认为 `false`。
  - <a id="page-assertions-to-have-screenshot-1-option-scale"></a>`scale` `"css" | "device"` *(可选)*

    当设置为 `"css"` 时，截图将每个 CSS 像素对应页面上的一个像素。对于高 DPI 设备，这将保持截图较小。使用 `"device"` 选项将产生每个设备像素对应一个像素，因此高 DPI 设备的截图将是两倍大或更大。

    默认为 `"css"`。
  - <a id="page-assertions-to-have-screenshot-1-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号会像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="page-assertions-to-have-screenshot-1-option-style-path"></a>`stylePath` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.41" />

    包含截图时应用的样式表的文件名。在这里你可以隐藏动态元素、使元素不可见或更改其属性以帮助创建可重复的截图。此样式表穿透 Shadow DOM 并应用于内部框架。
  - <a id="page-assertions-to-have-screenshot-1-option-threshold"></a>`threshold` `float` *(可选)*

    在 [YIQ 色彩空间](https://en.wikipedia.org/wiki/YIQ)中比较图像中同一像素的可接受感知颜色差异，介于零（严格）和一（宽松）之间，默认可通过 `TestConfig.expect` 配置。默认为 `0.2`。
  - <a id="page-assertions-to-have-screenshot-1-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### pageAssertions.toHaveScreenshot() {#page-assertions-to-have-screenshot-2}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

此函数将等待直到两个连续的页面截图产生相同的结果，然后将最后一个截图与期望进行比较。

快照以 PNG 格式存储。要改为以 WebP 格式存储，请传递带有 `.webp` 扩展名的快照名称。

**用法**

```js
await expect(page).toHaveScreenshot();
```

注意截图断言仅适用于 Playwright 测试运行器。

**参数**

- <a id="page-assertions-to-have-screenshot-2-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-assertions-to-have-screenshot-2-option-animations"></a>`animations` `"disabled" | "allow"` *(可选)*

    当设置为 `"disabled"` 时，停止 CSS 动画、CSS 过渡和 Web 动画。动画根据其持续时间有不同的处理方式：
    * 有限动画被快进到完成，因此它们将触发 `transitionend` 事件。
    * 无限动画被取消到初始状态，然后在截图后重新播放。

    默认为 `"disabled"` 以禁用动画。
  - <a id="page-assertions-to-have-screenshot-2-option-caret"></a>`caret` `"hide" | "initial"` *(可选)*

    当设置为 `"hide"` 时，截图将隐藏文本光标。当设置为 `"initial"` 时，文本光标行为不会改变。默认为 `"hide"`。
  - <a id="page-assertions-to-have-screenshot-2-option-clip"></a>`clip` `Object` *(可选)*

    指定结果图像裁剪的对象。

    - `x` `float`

      裁剪区域左上角的 x 坐标
    - `y` `float`

      裁剪区域左上角的 y 坐标
    - `width` `float`

      裁剪区域的宽度
    - `height` `float`

      裁剪区域的高度
  - <a id="page-assertions-to-have-screenshot-2-option-full-page"></a>`fullPage` `boolean` *(可选)*

    当为 true 时，截取完整可滚动页面的截图，而不是当前可见的视口。默认为 `false`。
  - <a id="page-assertions-to-have-screenshot-2-option-mask"></a>`mask` `Array<Locator>` *(可选)*

    指定截图时应被遮罩的定位器。遮罩元素将被覆盖一个粉色方框 `#FF00FF`（由 [`maskColor`](/api/class-pageassertions#page-assertions-to-have-screenshot-2-option-mask-color) 自定义），完全覆盖其边界框。
    遮罩也适用于不可见元素，参见[仅匹配可见元素](../locators.md#matching-only-visible-elements)以禁用此行为。
  - <a id="page-assertions-to-have-screenshot-2-option-mask-color"></a>`maskColor` `string` *(可选)* <Badge type="info" text="Added in: v1.35" />

    指定遮罩元素覆盖框的颜色，使用 [CSS 颜色格式](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)。默认颜色为粉色 `#FF00FF`。
  - <a id="page-assertions-to-have-screenshot-2-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(可选)*

    不同像素与总像素数量的可接受比率，介于 `0` 和 `1` 之间。默认可通过 `TestConfig.expect` 配置。注意 [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-2-option-threshold) 定义哪些像素被视为不同。
  - <a id="page-assertions-to-have-screenshot-2-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(可选)*

    可接受的不同像素数量。默认可通过 `TestConfig.expect` 配置。注意 [`threshold`](/api/class-pageassertions#page-assertions-to-have-screenshot-2-option-threshold) 定义哪些像素被视为不同。
  - <a id="page-assertions-to-have-screenshot-2-option-omit-background"></a>`omitBackground` `boolean` *(可选)*

    隐藏默认白色背景并允许使用透明度捕获截图。不适用于 `jpeg` 图像。
    默认为 `false`。
  - <a id="page-assertions-to-have-screenshot-2-option-scale"></a>`scale` `"css" | "device"` *(可选)*

    当设置为 `"css"` 时，截图将每个 CSS 像素对应页面上的一个像素。对于高 DPI 设备，这将保持截图较小。使用 `"device"` 选项将产生每个设备像素对应一个像素，因此高 DPI 设备的截图将是两倍大或更大。

    默认为 `"css"`。
  - <a id="page-assertions-to-have-screenshot-2-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号会像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="page-assertions-to-have-screenshot-2-option-style-path"></a>`stylePath` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.41" />

    包含截图时应用的样式表的文件名。在这里你可以隐藏动态元素、使元素不可见或更改其属性以帮助创建可重复的截图。此样式表穿透 Shadow DOM 并应用于内部框架。
  - <a id="page-assertions-to-have-screenshot-2-option-threshold"></a>`threshold` `float` *(可选)*

    在 [YIQ 色彩空间](https://en.wikipedia.org/wiki/YIQ)中比较图像中同一像素的可接受感知颜色差异，介于零（严格）和一（宽松）之间，默认可通过 `TestConfig.expect` 配置。默认为 `0.2`。
  - <a id="page-assertions-to-have-screenshot-2-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### pageAssertions.toHaveTitle() {#page-assertions-to-have-title}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保页面具有给定的标题。

**用法**

```js
await expect(page).toHaveTitle(/.*checkout/);
```

**参数**

- <a id="page-assertions-to-have-title-option-title-or-reg-exp"></a>`titleOrRegExp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  预期的标题或正则表达式。
- <a id="page-assertions-to-have-title-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-assertions-to-have-title-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号会像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="page-assertions-to-have-title-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### pageAssertions.toHaveURL() {#page-assertions-to-have-url}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保页面已导航到给定的 URL。

**用法**

```js
// 检查页面 URL 是否为 'https://playwright.dev/docs/intro'（包括查询字符串）
await expect(page).toHaveURL('https://playwright.dev/docs/intro');

// 检查页面 URL 是否包含 'doc'，后跟可选的 's'，后跟 '/'
await expect(page).toHaveURL(/docs?\//);

// 检查页面 URL 是否匹配 URL 模式
await expect(page).toHaveURL(new URLPattern({ pathname: '/docs/*' }));

// 检查谓词是否满足
// 例如：验证查询字符串
await expect(page).toHaveURL(url => {
  const params = url.searchParams;
  return params.has('search') && params.has('options') && params.get('id') === '5';
});
```

**参数**

- <a id="page-assertions-to-have-url-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean` <Badge type="info" text="Added in: v1.18" />

  预期的 URL 字符串、正则表达式或接收 [URL] 进行匹配的谓词。
  当通过上下文选项提供 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 且 `url` 参数是字符串时，两个值通过 [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数合并并用于与当前浏览器 URL 进行比较。
- <a id="page-assertions-to-have-url-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-assertions-to-have-url-option-ignore-case"></a>`ignoreCase` `boolean` *(可选)* <Badge type="info" text="Added in: v1.44" />

    是否执行不区分大小写的匹配。如果指定，[`ignoreCase`](/api/class-pageassertions#page-assertions-to-have-url-option-ignore-case) 选项优先于相应的正则表达式参数。提供的谓词会忽略此标志。
  - <a id="page-assertions-to-have-url-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号会像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="page-assertions-to-have-url-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### pageAssertions.toMatchAriaSnapshot() {#page-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.60" /> <Badge type="tip" text="async" />

断言页面 body 匹配给定的[无障碍快照](../aria-snapshots.md)。

**用法**

```js
await page.goto('https://demo.playwright.dev/todomvc/');
await expect(page).toMatchAriaSnapshot(`
  - heading "todos"
  - textbox "What needs to be done?"
`);
```

**参数**

- <a id="page-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="page-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-assertions-to-match-aria-snapshot-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号会像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="page-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### pageAssertions.toMatchAriaSnapshot() {#page-assertions-to-match-aria-snapshot-2}

<Badge type="info" text="Added in: v1.60" /> <Badge type="tip" text="async" />

断言页面 body 匹配给定的[无障碍快照](../aria-snapshots.md)。

快照存储在由配置文件中的 `expect.toMatchAriaSnapshot.pathTemplate` 和/或 `snapshotPathTemplate` 属性配置的位置的单独 `.aria.yml` 文件中。

**用法**

```js
await expect(page).toMatchAriaSnapshot();
await expect(page).toMatchAriaSnapshot({ name: 'home.aria.yml' });
```

**参数**

- <a id="page-assertions-to-match-aria-snapshot-2-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-assertions-to-match-aria-snapshot-2-option-name"></a>`name` `string` *(可选)*

    要存储在此测试对应的快照文件夹中的快照名称。
    如果未指定，则生成顺序名称。
  - <a id="page-assertions-to-match-aria-snapshot-2-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号会像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="page-assertions-to-match-aria-snapshot-2-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


## 属性

### pageAssertions.not {#page-assertions-not}

<Badge type="info" text="Added in: v1.20" />

使断言检查相反的条件。

**用法**

例如，此代码测试页面 URL 不包含 `"error"`：

```js
await expect(page).not.toHaveURL('error');
```

**类型**

- `PageAssertions`
