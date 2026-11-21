---
title: Tracing
outline: 2
---

# Tracing

<Badge type="info" text="Added in: v1.12" />

API for collecting and saving Playwright traces. Playwright traces can be opened in [Trace Viewer](../trace-viewer.md) after Playwright script runs.

::: info
You probably want to [enable tracing in your config file](https://playwright.dev/docs/api/class-testoptions#test-options-trace) instead of using `context.tracing`.

The `context.tracing` API captures browser operations and network activity, but it doesn't record test assertions (like `expect` calls). We recommend [enabling tracing through Playwright Test configuration](https://playwright.dev/docs/api/class-testoptions#test-options-trace), which includes those assertions and provides a more complete trace for debugging test failures.
:::

Start recording a trace before performing actions. At the end, stop tracing and save it to a file.

```csharp
using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.LaunchAsync();
await using var context = await browser.NewContextAsync();
await context.Tracing.StartAsync(new()
{
  Screenshots = true,
  Snapshots = true
});
var page = await context.NewPageAsync();
await page.GotoAsync("https://playwright.dev");
await context.Tracing.StopAsync(new()
{
  Path = "trace.zip"
});
```

## Methods

### Tracing.GroupAsync() {#tracing-group}

<Badge type="info" text="Added in: v1.49" />

::: warning
Use `test.step` instead when available.
:::

Creates a new group within the trace, assigning any subsequent API calls to this group, until [`Tracing.GroupEndAsync()`](/dotnet/api/class-tracing#tracing-group-end) is called. Groups can be nested and will be visible in the trace viewer.

**Usage**

```csharp
// All actions between GroupAsync and GroupEndAsync
// will be shown in the trace viewer as a group.
await Page.Context.Tracing.GroupAsync("Open Playwright.dev > API");
await Page.GotoAsync("https://playwright.dev/");
await Page.GetByRole(AriaRole.Link, new() { Name = "API" }).ClickAsync();
await Page.Context.Tracing.GroupEndAsync();
```

**Arguments**

- <a id="tracing-group-option-name"></a>`name` `string`

  Group name shown in the trace viewer.
- <a id="tracing-group-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-group-option-location"></a>`location` `Object` *(optional)*

    Specifies a custom location for the group to be shown in the trace viewer. Defaults to the location of the [`Tracing.GroupAsync()`](/dotnet/api/class-tracing#tracing-group) call.

    - `file` `string`
    - `line` `int` *(optional)*
    - `column` `int` *(optional)*

**Returns**

- `Disposable`


### Tracing.GroupEndAsync() {#tracing-group-end}

<Badge type="info" text="Added in: v1.49" />

Closes the last group created by [`Tracing.GroupAsync()`](/dotnet/api/class-tracing#tracing-group).


### Tracing.StartAsync() {#tracing-start}

<Badge type="info" text="Added in: v1.12" />

Start tracing. Disposing the returned [Disposable] stops tracing without saving the trace, similarly to calling [`Tracing.StopAsync()`](/dotnet/api/class-tracing#tracing-stop) without a path.

::: info
You probably want to [enable tracing in your config file](https://playwright.dev/docs/api/class-testoptions#test-options-trace) instead of using `Tracing.start`.

The `context.tracing` API captures browser operations and network activity, but it doesn't record test assertions (like `expect` calls). We recommend [enabling tracing through Playwright Test configuration](https://playwright.dev/docs/api/class-testoptions#test-options-trace), which includes those assertions and provides a more complete trace for debugging test failures.
:::

**Usage**

```csharp
using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.LaunchAsync();
await using var context = await browser.NewContextAsync();
await context.Tracing.StartAsync(new()
{
  Screenshots = true,
  Snapshots = true
});
var page = await context.NewPageAsync();
await page.GotoAsync("https://playwright.dev");
await context.Tracing.StopAsync(new()
{
  Path = "trace.zip"
});
```

**Arguments**

- <a id="tracing-start-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-start-option-aria-snapshots"></a>`ariaSnapshots` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Whether to capture aria snapshot of the page on every action.
  - <a id="tracing-start-option-live"></a>`live` `boolean` *(optional)* <Badge type="info" text="Added in: v1.59" />

    When enabled, the trace is written to an unarchived file that is updated in real time as actions occur,
    instead of caching changes and archiving them into a zip file at the end. This is useful for live trace
    viewing during test execution.
  - <a id="tracing-start-option-name"></a>`name` `string` *(optional)*

    If specified, intermediate trace files are going to be saved into the files with the
    given name prefix inside the [`tracesDir`](/dotnet/api/class-browsertype#browser-type-launch-option-traces-dir) directory specified in [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch).
    To specify the final trace zip file name, you need to pass `path` option to
    [`Tracing.StopAsync()`](/dotnet/api/class-tracing#tracing-stop) instead.
  - <a id="tracing-start-option-screenshots"></a>`screenshots` `boolean` *(optional)*

    Whether to capture screenshots during tracing. Screenshots are used to build
    a timeline preview.
  - <a id="tracing-start-option-screen-snapshots"></a>`screenSnapshots` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Whether to capture a screenshot of the page on every action.
  - <a id="tracing-start-option-snapshots"></a>`snapshots` `boolean` *(optional)*

    Whether to capture DOM snapshot and record network activity on every action.
  - <a id="tracing-start-option-sources"></a>`sources` `boolean` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Whether to include source files for trace actions.
  - <a id="tracing-start-option-title"></a>`title` `string` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Trace name to be shown in the Trace Viewer.

**Returns**

- `Disposable`


### Tracing.StartChunkAsync() {#tracing-start-chunk}

<Badge type="info" text="Added in: v1.15" />

Start a new trace chunk. Disposing the returned [Disposable] stops the chunk without saving it, similarly to calling [`Tracing.StopChunkAsync()`](/dotnet/api/class-tracing#tracing-stop-chunk) without a path. If you'd like to record multiple traces on the same [BrowserContext](/dotnet/api/class-browsercontext), use [`Tracing.StartAsync()`](/dotnet/api/class-tracing#tracing-start) once, and then create multiple trace chunks with [`Tracing.StartChunkAsync()`](/dotnet/api/class-tracing#tracing-start-chunk) and [`Tracing.StopChunkAsync()`](/dotnet/api/class-tracing#tracing-stop-chunk).

**Usage**

```csharp
using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.LaunchAsync();
await using var context = await browser.NewContextAsync();
await context.Tracing.StartAsync(new()
{
  Screenshots = true,
  Snapshots = true
});
var page = await context.NewPageAsync();
await page.GotoAsync("https://playwright.dev");

await context.Tracing.StartChunkAsync();
await page.GetByText("Get Started").ClickAsync();
// Everything between StartChunkAsync and StopChunkAsync will be recorded in the trace.
await context.Tracing.StopChunkAsync(new()
{
  Path = "trace1.zip"
});

await context.Tracing.StartChunkAsync();
await page.GotoAsync("http://example.com");
// Save a second trace file with different actions.
await context.Tracing.StopChunkAsync(new()
{
  Path = "trace2.zip"
});
```

**Arguments**

- <a id="tracing-start-chunk-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-start-chunk-option-name"></a>`name` `string` *(optional)* <Badge type="info" text="Added in: v1.32" />

    If specified, intermediate trace files are going to be saved into the files with the
    given name prefix inside the [`tracesDir`](/dotnet/api/class-browsertype#browser-type-launch-option-traces-dir) directory specified in [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch).
    To specify the final trace zip file name, you need to pass `path` option to
    [`Tracing.StopChunkAsync()`](/dotnet/api/class-tracing#tracing-stop-chunk) instead.
  - <a id="tracing-start-chunk-option-title"></a>`title` `string` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Trace name to be shown in the Trace Viewer.

**Returns**

- `Disposable`


### Tracing.StartHarAsync() {#tracing-start-har}

<Badge type="info" text="Added in: v1.60" />

Start recording a HAR (HTTP Archive) of network activity in this context. The HAR file is written to disk when [`Tracing.StopHarAsync()`](/dotnet/api/class-tracing#tracing-stop-har) is called, or when the returned [Disposable] is disposed.

Only one HAR recording can be active at a time per [Tracing](/dotnet/api/class-tracing) instance.

**Usage**

```csharp
await context.Tracing.StartHarAsync("trace.har");
var page = await context.NewPageAsync();
await page.GotoAsync("https://playwright.dev");
await context.Tracing.StopHarAsync();
```

**Arguments**

- <a id="tracing-start-har-option-path"></a>`path` `path`

  Path on the filesystem to write the HAR file to. If the file name ends with `.zip`, the HAR is saved as a zip archive with response bodies attached as separate files.
- <a id="tracing-start-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-start-har-option-content"></a>`content` `"omit" | "embed" | "attach"` *(optional)*

    Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file as per HAR specification. Defaults to `attach` for `.zip` output files and to `embed` for all other file extensions.
  - <a id="tracing-start-har-option-mode"></a>`mode` `"full" | "minimal"` *(optional)*

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
  - <a id="tracing-start-har-option-url-filter"></a>`urlFilter` `string` *(optional)*

    A glob or regex pattern to filter requests that are stored in the HAR. Defaults to none.
  - <a id="tracing-start-har-option-url-filter-regex"></a>`urlFilterRegex` `RegExp` *(optional)*

    A glob or regex pattern to filter requests that are stored in the HAR. Defaults to none.
  - <a id="tracing-start-har-option-url-filter-string"></a>`urlFilterString` `string` *(optional)*

    A glob or regex pattern to filter requests that are stored in the HAR. Defaults to none.

**Returns**

- `Disposable`


### Tracing.StopAsync() {#tracing-stop}

<Badge type="info" text="Added in: v1.12" />

Stop tracing.

**Arguments**

- <a id="tracing-stop-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-stop-option-path"></a>`path` `path` *(optional)*

    Export trace into the file with the given path.


### Tracing.StopChunkAsync() {#tracing-stop-chunk}

<Badge type="info" text="Added in: v1.15" />

Stop the trace chunk. See [`Tracing.StartChunkAsync()`](/dotnet/api/class-tracing#tracing-start-chunk) for more details about multiple trace chunks.

**Arguments**

- <a id="tracing-stop-chunk-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-stop-chunk-option-path"></a>`path` `path` *(optional)*

    Export trace collected since the last [`Tracing.StartChunkAsync()`](/dotnet/api/class-tracing#tracing-start-chunk) call into the file with the given path.


### Tracing.StopHarAsync() {#tracing-stop-har}

<Badge type="info" text="Added in: v1.60" />

Stop HAR recording and save the HAR file to the path given to [`Tracing.StartHarAsync()`](/dotnet/api/class-tracing#tracing-start-har).

