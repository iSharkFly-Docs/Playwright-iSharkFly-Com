---
title: "视频"
---

# 视频

## 简介

使用 Playwright，您可以为测试录制视频。

## 录制视频

Playwright Test 可以为您的测试录制视频，通过 Playwright 配置中的 `video` 选项进行控制。默认情况下视频是关闭的。
- `'off'` - 不录制视频。
- `'on'` - 为每个测试录制视频。
- `'retain-on-failure'` - 为每个测试录制视频，但从成功的测试运行中删除所有视频。
- `'on-first-retry'` - 仅在首次重试测试时录制视频。

视频文件将出现在测试输出目录中，通常是 `test-results`。有关高级视频配置，请参阅 [`testOptions.video`](/api/class-testoptions#test-options-video)。

视频在测试结束时 [浏览器上下文](./browser-contexts.md) 关闭时保存。如果您手动创建浏览器上下文，请确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close)。

::: code-group

```js [Test]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    video: 'on-first-retry',
  },
});
```

```js [Library]
const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
// 确保等待 close，以便保存视频。
await context.close();
```

:::

您还可以指定视频大小和注解。视频大小默认为视口大小，缩小以适应 800x800。视口的视频放置在输出视频的左上角，必要时会缩小以适应。您可能需要设置视口大小以匹配所需的视频大小。

当指定 `show: { actions }` 时，每个操作都会在视频中以元素轮廓和操作标题字幕进行视觉高亮显示。可选的 `duration` 属性控制每个注解的显示时长（默认为 `500` 毫秒）。

当指定 `show: { test }` 时，视频将使用可配置 `level` 的当前测试信息进行注解。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    video: {
      mode: 'on-first-retry',
      size: { width: 640, height: 480 },
      show: {
        actions: {
          duration: 500,
          position: 'top-right',
          fontSize: 14,
        },
        test: {
          level: 'step',
          position: 'top-left',
          fontSize: 12,
        }
      },
    },
  },
});
```

:::

对于多页面场景，您可以通过 [`page.video()`](/api/class-page#page-video) 访问与页面关联的视频文件。

```js
const path = await page.video().path();
```

::: info
请注意，视频仅在页面或浏览器上下文关闭后才可用。
:::
