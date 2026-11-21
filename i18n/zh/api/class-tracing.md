---
title: Tracing
outline: 2
---

# Tracing

<Badge type="info" text="新增于: v1.12" />

用于收集和保存 Playwright 追踪记录的 API。Playwright 追踪记录可以在 Playwright 脚本运行后在[追踪查看器](../trace-viewer.md)中打开。

::: info
您可能更想在[配置文件中启用追踪](https://playwright.dev/docs/api/class-testoptions#test-options-trace)，而不是使用 `context.tracing`。

`context.tracing` API 捕获浏览器操作和网络活动，但不记录测试断言（如 `expect` 调用）。我们建议[通过 Playwright Test 配置启用追踪](https://playwright.dev/docs/api/class-testoptions#test-options-trace)，这样会包含这些断言，并为调试测试失败提供更完整的追踪记录。
:::

在执行操作之前开始录制追踪。最后，停止追踪并将其保存到文件中。

```js
const browser = await chromium.launch();
const context = await browser.newContext();
await context.tracing.start({ screenshots: true, snapshots: true });
const page = await context.newPage();
await page.goto('https://playwright.dev');
expect(page.url()).toBe('https://playwright.dev');
await context.tracing.stop({ path: 'trace.zip' });
```

## 方法

### tracing.group() {#tracing-group}

<Badge type="info" text="新增于: v1.49" /> <Badge type="tip" text="async" />

::: warning
可用时请使用 `test.step` 代替。
:::

在追踪中创建一个新组，将任何后续 API 调用分配给该组，直到调用 [`tracing.groupEnd()`](/api/class-tracing#tracing-group-end)。组可以嵌套，并且在追踪查看器中可见。

**用法**

```js
// 使用 test.step 代替
await test.step('Log in', async () => {
  // ...
});
```

**参数**

- <a id="tracing-group-option-name"></a>`name` `string`

  在追踪查看器中显示的组名称。
- <a id="tracing-group-option-options"></a>`options` `Object` *(可选)*

  - <a id="tracing-group-option-location"></a>`location` `Object` *(可选)*

    指定在追踪查看器中显示组的自定义位置。默认为 [`tracing.group()`](/api/class-tracing#tracing-group) 调用的位置。

    - `file` `string`
    - `line` `int` *(可选)*
    - `column` `int` *(可选)*

**返回值**

- `Promise<Disposable>`


### tracing.groupEnd() {#tracing-group-end}

<Badge type="info" text="新增于: v1.49" /> <Badge type="tip" text="async" />

关闭由 [`tracing.group()`](/api/class-tracing#tracing-group) 创建的最后一个组。


### tracing.start() {#tracing-start}

<Badge type="info" text="新增于: v1.12" /> <Badge type="tip" text="async" />

开始追踪。释放返回的 [Disposable](/api/class-disposable) 将停止追踪而不保存追踪记录，类似于调用没有 path 参数的 [`tracing.stop()`](/api/class-tracing#tracing-stop)。

::: info
您可能更想在[配置文件中启用追踪](https://playwright.dev/docs/api/class-testoptions#test-options-trace)，而不是使用 `Tracing.start`。

`context.tracing` API 捕获浏览器操作和网络活动，但不记录测试断言（如 `expect` 调用）。我们建议[通过 Playwright Test 配置启用追踪](https://playwright.dev/docs/api/class-testoptions#test-options-trace)，这样会包含这些断言，并为调试测试失败提供更完整的追踪记录。
:::

**用法**

```js
await context.tracing.start({ screenshots: true, snapshots: true });
const page = await context.newPage();
await page.goto('https://playwright.dev');
expect(page.url()).toBe('https://playwright.dev');
await context.tracing.stop({ path: 'trace.zip' });
```

**参数**

- <a id="tracing-start-option-options"></a>`options` `Object` *(可选)*

  - <a id="tracing-start-option-live"></a>`live` `boolean` *(可选)* <Badge type="info" text="新增于: v1.59" />

    启用后，追踪将写入一个未归档的文件，该文件会随着操作的发生实时更新，而不是在最后缓存更改并归档到 zip 文件中。这对于在测试执行期间实时查看追踪很有用。
  - <a id="tracing-start-option-name"></a>`name` `string` *(可选)*

    如果指定，中间追踪文件将保存到 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 中指定的 [`tracesDir`](/api/class-browsertype#browser-type-launch-option-traces-dir) 目录内具有给定名称前缀的文件中。要指定最终追踪 zip 文件名，您需要将 `path` 选项传递给 [`tracing.stop()`](/api/class-tracing#tracing-stop)。
  - <a id="tracing-start-option-screenshots"></a>`screenshots` `boolean` *(可选)*

    是否在追踪期间捕获截图。截图用于构建时间线预览。
  - <a id="tracing-start-option-snapshots"></a>`snapshots` `boolean | Object` *(可选)*

    在每个操作上捕获哪些快照。传递 `true` 是 `{ dom: true }` 的快捷方式。

    - `dom` `boolean` *(可选)*

      在每个操作上捕获 DOM 快照并记录网络活动。可选。
    - `aria` `boolean` *(可选)*

      在每个操作上捕获页面的 aria 快照。可选。
    - `screen` `boolean` *(可选)*

      在每个操作上捕获页面截图。可选。
  - <a id="tracing-start-option-sources"></a>`sources` `boolean` *(可选)* <Badge type="info" text="新增于: v1.17" />

    是否为追踪操作包含源文件。
  - <a id="tracing-start-option-title"></a>`title` `string` *(可选)* <Badge type="info" text="新增于: v1.17" />

    要在追踪查看器中显示的追踪名称。

**返回值**

- `Promise<Disposable>`


### tracing.startChunk() {#tracing-start-chunk}

<Badge type="info" text="新增于: v1.15" /> <Badge type="tip" text="async" />

开始一个新的追踪块。释放返回的 [Disposable](/api/class-disposable) 将停止该块而不保存，类似于调用没有 path 参数的 [`tracing.stopChunk()`](/api/class-tracing#tracing-stop-chunk)。如果您想在同一个 [BrowserContext](/api/class-browsercontext) 上录制多个追踪，请使用 [`tracing.start()`](/api/class-tracing#tracing-start) 一次，然后使用 [`tracing.startChunk()`](/api/class-tracing#tracing-start-chunk) 和 [`tracing.stopChunk()`](/api/class-tracing#tracing-stop-chunk) 创建多个追踪块。

**用法**

```js
await context.tracing.start({ screenshots: true, snapshots: true });
const page = await context.newPage();
await page.goto('https://playwright.dev');

await context.tracing.startChunk();
await page.getByText('Get Started').click();
// startChunk 和 stopChunk 之间的所有内容都将记录在追踪中。
await context.tracing.stopChunk({ path: 'trace1.zip' });

await context.tracing.startChunk();
await page.goto('http://example.com');
// 使用不同的操作保存第二个追踪文件。
await context.tracing.stopChunk({ path: 'trace2.zip' });
```

**参数**

- <a id="tracing-start-chunk-option-options"></a>`options` `Object` *(可选)*

  - <a id="tracing-start-chunk-option-name"></a>`name` `string` *(可选)* <Badge type="info" text="新增于: v1.32" />

    如果指定，中间追踪文件将保存到 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 中指定的 [`tracesDir`](/api/class-browsertype#browser-type-launch-option-traces-dir) 目录内具有给定名称前缀的文件中。要指定最终追踪 zip 文件名，您需要将 `path` 选项传递给 [`tracing.stopChunk()`](/api/class-tracing#tracing-stop-chunk)。
  - <a id="tracing-start-chunk-option-title"></a>`title` `string` *(可选)* <Badge type="info" text="新增于: v1.17" />

    要在追踪查看器中显示的追踪名称。

**返回值**

- `Promise<Disposable>`


### tracing.startHar() {#tracing-start-har}

<Badge type="info" text="新增于: v1.60" /> <Badge type="tip" text="async" />

开始在此上下文中录制网络活动的 HAR（HTTP Archive）。当调用 [`tracing.stopHar()`](/api/class-tracing#tracing-stop-har) 或释放返回的 [Disposable](/api/class-disposable) 时，HAR 文件将写入磁盘。

每个 [Tracing](/api/class-tracing) 实例一次只能激活一个 HAR 录制。

**用法**

```js
await context.tracing.startHar('trace.har');
const page = await context.newPage();
await page.goto('https://playwright.dev');
await context.tracing.stopHar();
```

**参数**

- <a id="tracing-start-har-option-path"></a>`path` `path`

  要将 HAR 文件写入的文件系统路径。如果文件名以 `.zip` 结尾，HAR 将作为 zip 归档保存，响应正文作为单独的文件附加。
- <a id="tracing-start-har-option-options"></a>`options` `Object` *(可选)*

  - <a id="tracing-start-har-option-content"></a>`content` `"omit" | "embed" | "attach"` *(可选)*

    控制资源内容管理的可选设置。如果指定 `omit`，则不保留内容。如果指定 `attach`，则资源作为单独的文件或 ZIP 归档中的条目保留。如果指定 `embed`，则根据 HAR 规范将内容内联存储在 HAR 文件中。对于 `.zip` 输出文件默认为 `attach`，对于所有其他文件扩展名默认为 `embed`。
  - <a id="tracing-start-har-option-mode"></a>`mode` `"full" | "minimal"` *(可选)*

    设置为 `minimal` 时，仅记录从 HAR 路由所需的信息。这省略了从 HAR 重放时不使用的大小、时间、页面、cookie、安全性和其他类型的 HAR 信息。默认为 `full`。
  - <a id="tracing-start-har-option-resources-dir"></a>`resourcesDir` `path` *(可选)*

    仅与 `content: 'attach'` 一起使用。设置后，响应正文放置在此目录中而不是 HAR 文件旁边。与 `.zip` HAR 文件不兼容。
  - <a id="tracing-start-har-option-url-filter"></a>`urlFilter` `string | RegExp` *(可选)*

    用于过滤存储在 HAR 中的请求的 glob 或正则表达式模式。默认为无。

**返回值**

- `Promise<Disposable>`


### tracing.stop() {#tracing-stop}

<Badge type="info" text="新增于: v1.12" /> <Badge type="tip" text="async" />

停止追踪。

**参数**

- <a id="tracing-stop-option-options"></a>`options` `Object` *(可选)*

  - <a id="tracing-stop-option-path"></a>`path` `path` *(可选)*

    将追踪导出到具有给定路径的文件中。


### tracing.stopChunk() {#tracing-stop-chunk}

<Badge type="info" text="新增于: v1.15" /> <Badge type="tip" text="async" />

停止追踪块。有关多个追踪块的更多详细信息，请参阅 [`tracing.startChunk()`](/api/class-tracing#tracing-start-chunk)。

**参数**

- <a id="tracing-stop-chunk-option-options"></a>`options` `Object` *(可选)*

  - <a id="tracing-stop-chunk-option-path"></a>`path` `path` *(可选)*

    将自上次 [`tracing.startChunk()`](/api/class-tracing#tracing-start-chunk) 调用以来收集的追踪导出到具有给定路径的文件中。


### tracing.stopHar() {#tracing-stop-har}

<Badge type="info" text="新增于: v1.60" /> <Badge type="tip" text="async" />

停止 HAR 录制并将 HAR 文件保存到 [`tracing.startHar()`](/api/class-tracing#tracing-start-har) 中指定的路径。
