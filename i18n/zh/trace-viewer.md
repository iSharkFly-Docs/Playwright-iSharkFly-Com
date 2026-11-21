---
title: "跟踪查看器"
---

# 跟踪查看器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 介绍

Playwright 跟踪查看器是一个 GUI 工具，可帮助您在脚本运行后浏览录制的 Playwright 跟踪。跟踪是调试在 CI 上失败的测试的绝佳方式。您可以[在本地](#opening-trace-viewer)打开跟踪，或在浏览器中访问 [trace.playwright.dev](https://trace.playwright.dev) 打开。

###### 
<LiteYouTube
id="yP6AnTxC34s"
title="Viewing Playwright Traces"
/>

## 打开跟踪查看器

您可以使用 Playwright CLI 或在浏览器中访问 [trace.playwright.dev](https://trace.playwright.dev) 来打开保存的跟踪。确保添加 `trace.zip` 文件所在位置的完整路径。

```bash
npx playwright show-trace path/to/trace.zip
```

### 使用 [trace.playwright.dev](https://trace.playwright.dev)

[trace.playwright.dev](https://trace.playwright.dev) 是跟踪查看器的静态托管版本。您可以使用拖放或通过 `Select file` 按钮上传跟踪文件。

跟踪查看器完全在您的浏览器中加载跟踪，不会向外部传输任何数据。

<img height="1684" width="2238" alt="Drop Playwright Trace to load" src="https://user-images.githubusercontent.com/13063165/194577918-b4d45726-2692-4093-8a28-9e73552617ef.png" />

### 查看远程跟踪

您可以直接使用 URL 打开远程跟踪。这使得无需手动从 CI 运行下载文件即可轻松查看远程跟踪。

```bash
npx playwright show-trace https://example.com/trace.zip
```

使用 [trace.playwright.dev](https://trace.playwright.dev) 时，您还可以将上传到某个可访问存储（例如 CI 内部）的跟踪 URL 作为查询参数传递。可能会应用 CORS（跨源资源共享）规则。

```txt
https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/e6099cadf79aa753d5500aa9508f9d1dbd87b5ee.zip
```

## 录制跟踪

### 本地跟踪

要在开发模式下录制跟踪，请在运行测试时将 `--trace` 标志设置为 `on`。您也可以使用 [UI 模式](./test-ui-mode.md)获得更好的开发体验，因为它会自动跟踪每个测试。

```bash
npx playwright test --trace on
```

然后您可以打开 HTML 报告并点击跟踪图标来打开跟踪。

```bash
npx playwright show-report
```

### 在 CI 上跟踪

应该在持续集成中通过在测试配置文件中设置 `trace: 'on-first-retry'` 选项，在失败测试的第一次重试时运行跟踪。这将为每个重试的测试生成一个 `trace.zip` 文件。

::: code-group

```js [Test]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  retries: 1,
  use: {
    trace: 'on-first-retry',
  },
});
```

```js [Library]
const browser = await chromium.launch();
const context = await browser.newContext();

// 在创建/导航页面之前开始跟踪。
await context.tracing.start({ screenshots: true, snapshots: true });

const page = await context.newPage();
await page.goto('https://playwright.dev');

// 停止跟踪并将其导出到 zip 存档。
await context.tracing.stop({ path: 'trace.zip' });
```

:::

录制跟踪的可用选项：
- `'on-first-retry'` - 仅在第一次重试测试时录制跟踪。
- `'on-all-retries'` - 为所有测试重试录制跟踪。
- `'off'` - 不录制跟踪。
- `'on'` - 为每个测试录制跟踪。（不推荐，因为性能开销较大）
- `'retain-on-failure'` - 为每个测试录制跟踪，但从成功的测试运行中删除。

如果您不启用重试但仍想为失败的测试获取跟踪，也可以使用 `trace: 'retain-on-failure'`。

还有更细粒度的选项可用，请参阅 [`testOptions.trace`](/api/class-testoptions#test-options-trace)。

如果您没有将 Playwright 用作测试运行器，请改用 [`browserContext.tracing`](/api/class-browsercontext#browser-context-tracing) API。

## 跟踪查看器功能

### 操作

在操作标签页中，您可以查看每个操作使用的定位器以及每个操作的运行时间。将鼠标悬停在测试的每个操作上，可以直观地看到 DOM 快照的变化。在时间上前后移动并点击操作进行检查和调试。使用"之前"和"之后"标签页可以直观地查看操作前后发生的情况。

<img src="https://github.com/microsoft/playwright/assets/13063165/948b65cd-f0fd-4c7f-8e53-2c632b5a07f1" alt="actions tab in trace viewer" width="3598" height="2218" />

**选择每个操作会显示：**
- 操作快照
- 操作日志
- 源代码位置

### 截图

当启用 [`screenshots`](/api/class-tracing#tracing-start-option-screenshots) 选项进行跟踪时（默认启用），每个跟踪都会录制屏幕录像并将其渲染为胶片带。您可以将鼠标悬停在胶片带上查看每个操作和状态的放大图像，这有助于您轻松找到要检查的操作。

双击某个操作可查看该操作的时间范围。您可以使用时间轴中的滑块增加选中的操作，这些操作将显示在操作标签页中，所有控制台日志和网络日志将被筛选为仅显示所选操作的日志。

<img src="https://github.com/microsoft/playwright/assets/13063165/b04a7d75-54bb-4ab2-9e30-e76f6f74a2c8" alt="timeline view in trace viewer" width="3598" height="2218" />

### 快照

当启用 [`snapshots`](/api/class-tracing#tracing-start-option-snapshots) 选项进行跟踪时（默认启用），Playwright 会为每个操作捕获一组完整的 DOM 快照。根据操作类型，它将捕获：

| 类型 | 描述 |
|------|-------------|
|之前|调用操作时的快照。|
|操作|执行输入时刻的快照。这种类型的快照在探索 Playwright 确切点击位置时特别有用。|
|之后|操作后的快照。|

以下是典型的操作快照示例：

<img src="https://github.com/microsoft/playwright/assets/13063165/7168d549-eb0a-4964-9c93-483f03711fa9" alt="action tab in trace viewer" width="3598" height="2218" />

请注意它如何同时高亮显示 DOM 节点和确切的点击位置。

### 源代码

当您点击侧边栏中的某个操作时，该操作的代码行会在源代码面板中高亮显示。

<img src="https://github.com/microsoft/playwright/assets/13063165/daa8845d-c250-4923-aa7a-5d040da9adc5" alt="showing source code tab in trace viewer" width="3598" height="2218" />

### 调用

调用标签页显示有关操作的信息，例如耗时、使用的定位器、是否处于严格模式以及使用的键。

<img src="https://github.com/microsoft/playwright/assets/13063165/95498580-f9dd-4932-a123-c37fe7cfc3c2" alt="showing call tab in trace viewer" width="3598" height="2218" />

### 日志

查看测试的完整日志，以更好地了解 Playwright 在幕后的操作，例如滚动到视图中、等待元素可见、启用和稳定，以及执行点击、填充、按键等操作。

<img src="https://github.com/microsoft/playwright/assets/13063165/de621461-3bab-4140-b39d-9f02d6672dbf" alt="showing log of tests in trace viewer" width="3598" height="2218" />

### 错误

如果您的测试失败，您将在错误标签页中看到每个测试的错误消息。时间轴还将显示一条红线，高亮显示错误发生的位置。您还可以点击源代码标签页查看错误发生在源代码的哪一行。

<img src="https://github.com/microsoft/playwright/assets/13063165/e9ef77b3-05d1-4df2-852c-981023723d34" alt="showing errors in trace viewer" width="3598" height="2218" />

### 控制台

查看来自浏览器以及测试的控制台日志。会显示不同的图标来指示控制台日志是来自浏览器还是测试文件。

<img src="https://github.com/microsoft/playwright/assets/13063165/4107c08d-1eaf-421c-bdd4-9dd2aa641d4a" alt="showing log of tests in trace viewer" width="3598" height="2218" />

双击操作侧边栏中测试的某个操作。这将筛选控制台，仅显示该操作期间产生的日志。点击 *Show all* 按钮再次查看所有控制台日志。

使用时间轴筛选操作，通过点击起点并拖动到终点。控制台标签页也将被筛选为仅显示所选操作期间产生的日志。

### 网络

网络标签页显示测试期间发出的所有网络请求。您可以按不同类型的请求、状态码、方法、请求、内容类型、持续时间和大小进行排序。点击请求可查看更多信息，例如请求头、响应头、请求体和响应体。

<img src="https://github.com/microsoft/playwright/assets/13063165/0a3d1671-8ccd-4f7a-a844-35f5eb37f236" alt="network requests tab in trace viewer" width="3598" height="2218" />

双击操作侧边栏中测试的某个操作。这将筛选网络请求，仅显示该操作期间发出的请求。点击 *Show all* 按钮再次查看所有网络请求。

使用时间轴筛选操作，通过点击起点并拖动到终点。网络标签页也将被筛选为仅显示所选操作期间发出的网络请求。

### 元数据

在操作标签页旁边，您会找到元数据标签页，它将显示有关测试的更多信息，例如浏览器、视口大小、测试持续时间等。

<img src="https://github.com/microsoft/playwright/assets/13063165/82ab3d33-1ec9-4b8a-9cf2-30a6e2d59091" alt="meta data in trace viewer" width="3598" height="2218" />

### 附件

"附件"标签页允许您浏览附件。如果您正在进行[视觉回归测试](./test-snapshots.md)，您将能够通过检查图像差异、实际图像和预期图像来比较截图。当您点击预期图像时，可以使用滑块将一张图像滑动到另一张图像上，以便轻松查看截图中的差异。

<img src="https://github.com/microsoft/playwright/assets/13063165/4386178a-5808-4fa8-9436-315350a23b04" alt="attachments tab in trace viewer" width="3598" height="2218" />
