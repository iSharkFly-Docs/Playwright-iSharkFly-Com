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

::: code-group

```python [Async]
browser = await chromium.launch()
context = await browser.new_context()
await context.tracing.start(screenshots=True, snapshots=True)
page = await context.new_page()
await page.goto("https://playwright.dev")
await context.tracing.stop(path = "trace.zip")
```

```python [Sync]
browser = chromium.launch()
context = browser.new_context()
context.tracing.start(screenshots=True, snapshots=True)
page = context.new_page()
page.goto("https://playwright.dev")
context.tracing.stop(path = "trace.zip")
```

:::

## Methods

### tracing.group() {#tracing-group}

<Badge type="info" text="Added in: v1.49" />

::: warning
Use `test.step` instead when available.
:::

Creates a new group within the trace, assigning any subsequent API calls to this group, until [`tracing.group_end()`](/python/api/class-tracing#tracing-group-end) is called. Groups can be nested and will be visible in the trace viewer.

**Usage**

::: code-group

```python [Sync]
# All actions between group and group_end
# will be shown in the trace viewer as a group.
page.context.tracing.group("Open Playwright.dev > API")
page.goto("https://playwright.dev/")
page.get_by_role("link", name="API").click()
page.context.tracing.group_end()
```

```python [Async]
# All actions between group and group_end
# will be shown in the trace viewer as a group.
await page.context.tracing.group("Open Playwright.dev > API")
await page.goto("https://playwright.dev/")
await page.get_by_role("link", name="API").click()
await page.context.tracing.group_end()
```

:::

**Arguments**

- <a id="tracing-group-option-name"></a>`name` `string`

  Group name shown in the trace viewer.
- <a id="tracing-group-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-group-option-location"></a>`location` `Object` *(optional)*

    Specifies a custom location for the group to be shown in the trace viewer. Defaults to the location of the [`tracing.group()`](/python/api/class-tracing#tracing-group) call.

    - `file` `string`
    - `line` `int` *(optional)*
    - `column` `int` *(optional)*

**Returns**

- `Disposable`


### tracing.group_end() {#tracing-group-end}

<Badge type="info" text="Added in: v1.49" />

Closes the last group created by [`tracing.group()`](/python/api/class-tracing#tracing-group).


### tracing.start() {#tracing-start}

<Badge type="info" text="Added in: v1.12" />

Start tracing. Disposing the returned [Disposable](/python/api/class-disposable) stops tracing without saving the trace, similarly to calling [`tracing.stop()`](/python/api/class-tracing#tracing-stop) without a path.

::: info
You probably want to [enable tracing in your config file](https://playwright.dev/docs/api/class-testoptions#test-options-trace) instead of using `Tracing.start`.

The `context.tracing` API captures browser operations and network activity, but it doesn't record test assertions (like `expect` calls). We recommend [enabling tracing through Playwright Test configuration](https://playwright.dev/docs/api/class-testoptions#test-options-trace), which includes those assertions and provides a more complete trace for debugging test failures.
:::

**Usage**

::: code-group

```python [Async]
await context.tracing.start(screenshots=True, snapshots=True)
page = await context.new_page()
await page.goto("https://playwright.dev")
await context.tracing.stop(path = "trace.zip")
```

```python [Sync]
context.tracing.start(screenshots=True, snapshots=True)
page = context.new_page()
page.goto("https://playwright.dev")
context.tracing.stop(path = "trace.zip")
```

:::

**Arguments**

- <a id="tracing-start-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-start-option-aria-snapshots"></a>`aria_snapshots` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Whether to capture aria snapshot of the page on every action.
  - <a id="tracing-start-option-live"></a>`live` `boolean` *(optional)* <Badge type="info" text="Added in: v1.59" />

    When enabled, the trace is written to an unarchived file that is updated in real time as actions occur,
    instead of caching changes and archiving them into a zip file at the end. This is useful for live trace
    viewing during test execution.
  - <a id="tracing-start-option-name"></a>`name` `string` *(optional)*

    If specified, intermediate trace files are going to be saved into the files with the
    given name prefix inside the [`traces_dir`](/python/api/class-browsertype#browser-type-launch-option-traces-dir) directory specified in [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch).
    To specify the final trace zip file name, you need to pass `path` option to
    [`tracing.stop()`](/python/api/class-tracing#tracing-stop) instead.
  - <a id="tracing-start-option-screenshots"></a>`screenshots` `boolean` *(optional)*

    Whether to capture screenshots during tracing. Screenshots are used to build
    a timeline preview.
  - <a id="tracing-start-option-screen-snapshots"></a>`screen_snapshots` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Whether to capture a screenshot of the page on every action.
  - <a id="tracing-start-option-snapshots"></a>`snapshots` `boolean` *(optional)*

    Whether to capture DOM snapshot and record network activity on every action.
  - <a id="tracing-start-option-sources"></a>`sources` `boolean` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Whether to include source files for trace actions.
  - <a id="tracing-start-option-title"></a>`title` `string` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Trace name to be shown in the Trace Viewer.

**Returns**

- `Disposable`


### tracing.start_chunk() {#tracing-start-chunk}

<Badge type="info" text="Added in: v1.15" />

Start a new trace chunk. Disposing the returned [Disposable](/python/api/class-disposable) stops the chunk without saving it, similarly to calling [`tracing.stop_chunk()`](/python/api/class-tracing#tracing-stop-chunk) without a path. If you'd like to record multiple traces on the same [BrowserContext](/python/api/class-browsercontext), use [`tracing.start()`](/python/api/class-tracing#tracing-start) once, and then create multiple trace chunks with [`tracing.start_chunk()`](/python/api/class-tracing#tracing-start-chunk) and [`tracing.stop_chunk()`](/python/api/class-tracing#tracing-stop-chunk).

**Usage**

::: code-group

```python [Async]
await context.tracing.start(screenshots=True, snapshots=True)
page = await context.new_page()
await page.goto("https://playwright.dev")

await context.tracing.start_chunk()
await page.get_by_text("Get Started").click()
# Everything between start_chunk and stop_chunk will be recorded in the trace.
await context.tracing.stop_chunk(path = "trace1.zip")

await context.tracing.start_chunk()
await page.goto("http://example.com")
# Save a second trace file with different actions.
await context.tracing.stop_chunk(path = "trace2.zip")
```

```python [Sync]
context.tracing.start(screenshots=True, snapshots=True)
page = context.new_page()
page.goto("https://playwright.dev")

context.tracing.start_chunk()
page.get_by_text("Get Started").click()
# Everything between start_chunk and stop_chunk will be recorded in the trace.
context.tracing.stop_chunk(path = "trace1.zip")

context.tracing.start_chunk()
page.goto("http://example.com")
# Save a second trace file with different actions.
context.tracing.stop_chunk(path = "trace2.zip")
```

:::

**Arguments**

- <a id="tracing-start-chunk-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-start-chunk-option-name"></a>`name` `string` *(optional)* <Badge type="info" text="Added in: v1.32" />

    If specified, intermediate trace files are going to be saved into the files with the
    given name prefix inside the [`traces_dir`](/python/api/class-browsertype#browser-type-launch-option-traces-dir) directory specified in [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch).
    To specify the final trace zip file name, you need to pass `path` option to
    [`tracing.stop_chunk()`](/python/api/class-tracing#tracing-stop-chunk) instead.
  - <a id="tracing-start-chunk-option-title"></a>`title` `string` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Trace name to be shown in the Trace Viewer.

**Returns**

- `Disposable`


### tracing.start_har() {#tracing-start-har}

<Badge type="info" text="Added in: v1.60" />

Start recording a HAR (HTTP Archive) of network activity in this context. The HAR file is written to disk when [`tracing.stop_har()`](/python/api/class-tracing#tracing-stop-har) is called, or when the returned [Disposable](/python/api/class-disposable) is disposed.

Only one HAR recording can be active at a time per [Tracing](/python/api/class-tracing) instance.

**Usage**

::: code-group

```python [Async]
await context.tracing.start_har("trace.har")
page = await context.new_page()
await page.goto("https://playwright.dev")
await context.tracing.stop_har()
```

```python [Sync]
context.tracing.start_har("trace.har")
page = context.new_page()
page.goto("https://playwright.dev")
context.tracing.stop_har()
```

:::

**Arguments**

- <a id="tracing-start-har-option-path"></a>`path` `path`

  Path on the filesystem to write the HAR file to. If the file name ends with `.zip`, the HAR is saved as a zip archive with response bodies attached as separate files.
- <a id="tracing-start-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-start-har-option-content"></a>`content` `"omit" | "embed" | "attach"` *(optional)*

    Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file as per HAR specification. Defaults to `attach` for `.zip` output files and to `embed` for all other file extensions.
  - <a id="tracing-start-har-option-mode"></a>`mode` `"full" | "minimal"` *(optional)*

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
  - <a id="tracing-start-har-option-url-filter"></a>`url_filter` `string | RegExp` *(optional)*

    A glob or regex pattern to filter requests that are stored in the HAR. Defaults to none.

**Returns**

- `Disposable`


### tracing.stop() {#tracing-stop}

<Badge type="info" text="Added in: v1.12" />

Stop tracing.

**Arguments**

- <a id="tracing-stop-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-stop-option-path"></a>`path` `path` *(optional)*

    Export trace into the file with the given path.


### tracing.stop_chunk() {#tracing-stop-chunk}

<Badge type="info" text="Added in: v1.15" />

Stop the trace chunk. See [`tracing.start_chunk()`](/python/api/class-tracing#tracing-start-chunk) for more details about multiple trace chunks.

**Arguments**

- <a id="tracing-stop-chunk-option-options"></a>`options` `Object` *(optional)*

  - <a id="tracing-stop-chunk-option-path"></a>`path` `path` *(optional)*

    Export trace collected since the last [`tracing.start_chunk()`](/python/api/class-tracing#tracing-start-chunk) call into the file with the given path.


### tracing.stop_har() {#tracing-stop-har}

<Badge type="info" text="Added in: v1.60" />

Stop HAR recording and save the HAR file to the path given to [`tracing.start_har()`](/python/api/class-tracing#tracing-start-har).

