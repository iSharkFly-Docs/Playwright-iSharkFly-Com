---
title: Screencast
outline: 2
---

# Screencast

<Badge type="info" text="Added in: v1.59" />

用于从页面捕获屏幕录制帧的接口。

## 方法

### screencast.hideActions() {#screencast-hide-actions}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

移除操作装饰。


### screencast.hideOverlays() {#screencast-hide-overlays}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

隐藏覆盖层但不移除它们。


### screencast.showActions() {#screencast-show-actions}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

在交互元素上启用可视化注释。返回一个 disposable，在 dispose 时停止显示操作。

**参数**

- <a id="screencast-show-actions-option-options"></a>`options` `Object` *(可选)*

  - <a id="screencast-show-actions-option-cursor"></a>`cursor` `"none" | "pointer"` *(可选)* <Badge type="info" text="Added in: v1.61" />

    为指针操作显示的光标装饰。`"pointer"`（默认）渲染一个鼠标指针，从前一个操作点动画移动到下一个操作点。`"none"` 禁用光标装饰。
  - <a id="screencast-show-actions-option-duration"></a>`duration` `float` *(可选)*

    每个注释显示的时长（毫秒）。默认为 `500`。
  - <a id="screencast-show-actions-option-font-size"></a>`fontSize` `int` *(可选)*

    操作标题的字体大小（像素）。默认为 `24`。
  - <a id="screencast-show-actions-option-position"></a>`position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(可选)*

    操作标题覆盖层的位置。默认为 `"top-right"`。
  - <a id="screencast-show-actions-option-style"></a>`style` `Object` *(可选)* <Badge type="info" text="Added in: v1.64" />

    操作装饰的样式。所有装饰在 [`duration`](/api/class-screencast#screencast-show-actions-option-duration) 期间逐渐淡出。

    **用法**

    ```js
    await page.screencast.showActions({
      style: {
        point: 'width: 20px; height: 20px; border-radius: 50%; background: red',
        highlight: 'outline: 2px solid #333; background: rgba(0, 128, 255, .15)',
        title: 'font-size: 16px',
      },
    });
    ```

    - `point` `string` *(可选)* <Badge type="info" text="Added in: v1.64" />

      操作点标记的 CSS 声明。标记定位在操作点，大小为零并以该点为中心，因此其大小和外观来自此样式。省略时不显示。
    - `highlight` `string` *(可选)* <Badge type="info" text="Added in: v1.64" />

      覆盖目标元素的框的 CSS 声明。框的位置和大小与元素边界相匹配。省略时不显示。
    - `title` `string` *(可选)* <Badge type="info" text="Added in: v1.64" />

      操作标题的 CSS 声明，例如 `'font-size: 32px; background: #333'`。标题根据 [`position`](/api/class-screencast#screencast-show-actions-option-position) 放置。

**返回值**

- `Promise<Disposable>`


### screencast.showChapter() {#screencast-show-chapter}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

显示带有标题和可选描述的章节覆盖层，居中显示在页面上并带有模糊背景。用于为视频录制添加旁白。覆盖层在指定时长后移除，默认为 2000 毫秒。

**参数**

- <a id="screencast-show-chapter-option-title"></a>`title` `string`

  在覆盖层中突出显示的标题文本。
- <a id="screencast-show-chapter-option-options"></a>`options` `Object` *(可选)*

  - <a id="screencast-show-chapter-option-description"></a>`description` `string` *(可选)*

    显示在标题下方的可选描述文本。
  - <a id="screencast-show-chapter-option-duration"></a>`duration` `float` *(可选)*

    覆盖层自动移除前的持续时间（毫秒）。默认为 `2000`。


### screencast.showOverlay() {#screencast-show-overlay}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

添加具有给定 HTML 内容的覆盖层。覆盖层显示在页面顶部直到被移除。返回一个 disposable，在 dispose 时移除覆盖层。

**参数**

- <a id="screencast-show-overlay-option-html"></a>`html` `string`

  覆盖层的 HTML 内容。
- <a id="screencast-show-overlay-option-options"></a>`options` `Object` *(可选)*

  - <a id="screencast-show-overlay-option-duration"></a>`duration` `float` *(可选)*

    覆盖层自动移除前的持续时间（毫秒）。如果未提供，覆盖层将保持直到被关闭。

**返回值**

- `Promise<Disposable>`


### screencast.showOverlays() {#screencast-show-overlays}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

显示覆盖层。


### screencast.start() {#screencast-start}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

启动屏幕录制。当提供 [`path`](/api/class-screencast#screencast-start-option-path) 时，将视频录制保存到指定文件。当提供 [`onFrame`](/api/class-screencast#screencast-start-option-on-frame) 时，将 JPEG 编码的帧传递给回调。两者可以同时使用。

**用法**

```js
// 录制视频
await page.screencast.start({ path: 'video.webm', size: { width: 1280, height: 800 } });
// ... 执行操作 ...
await page.screencast.stop();
```

```js
// 捕获帧
await page.screencast.start({
  onFrame: ({ data, timestamp, viewportWidth, viewportHeight }) => {
    console.log(`帧大小: ${data.length} (${viewportWidth}x${viewportHeight}) 时间戳 ${timestamp}`);
  },
  size: { width: 800, height: 600 },
});
// ... 执行操作 ...
await page.screencast.stop();
```

**参数**

- <a id="screencast-start-option-options"></a>`options` `Object` *(可选)*

  - <a id="screencast-start-option-fps"></a>`fps` `int` *(可选)* <Badge type="info" text="Added in: v1.64" />

    视频录制的帧率（每秒帧数）。仅与 [`path`](/api/class-screencast#screencast-start-option-path) 一起使用。默认为 `25`。

    较高的帧率使动画和滚动更流畅，但会消耗更多 CPU 用于编码。结合 [`size`](/api/class-screencast#screencast-start-option-size) 录制高分辨率视频。视频只能包含浏览器产生的帧数；Firefox 和 WebKit 目前最多捕获每秒 25 帧。
  - <a id="screencast-start-option-on-frame"></a>`onFrame` `function(Object): Promise` *(可选)*

    接收 JPEG 编码帧数据以及捕获时页面视口大小的回调。

    - `data` `Buffer`

      JPEG 编码的帧数据。
    - `timestamp` `float`

      浏览器呈现帧的时间戳，自 Unix 纪元以来的毫秒数。
    - `viewportWidth` `int`

      捕获帧时页面视口的宽度。
    - `viewportHeight` `int`

      捕获帧时页面视口的高度。
  - <a id="screencast-start-option-path"></a>`path` `path` *(可选)*

    屏幕录制停止时视频应保存的路径。提供时，视频录制开始。
  - <a id="screencast-start-option-quality"></a>`quality` `int` *(可选)*

    图像质量，介于 0-100 之间。
  - <a id="screencast-start-option-size"></a>`size` `Object` *(可选)*

    指定屏幕录制帧的尺寸。实际帧会按比例缩放以保持页面的宽高比，可能小于这些边界。
    如果屏幕录制已激活（例如由追踪或视频录制启动），现有配置优先，帧大小可能超过这些边界或此选项可能被忽略。
    如果未指定，大小将等于页面视口缩放后适应 800×800。

    - `width` `int`

      最大帧宽度（像素）。
    - `height` `int`

      最大帧高度（像素）。

**返回值**

- `Promise<Disposable>`


### screencast.stop() {#screencast-stop}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

停止屏幕录制和视频录制（如果处于活动状态）。如果正在录制视频，将其保存到 [`screencast.start()`](/api/class-screencast#screencast-start) 中指定的路径。
