---
title: FileChooser
outline: 2
---

# FileChooser

<Badge type="info" text="Added in: v1.8" />

[FileChooser](/python/api/class-filechooser) objects are dispatched by the page in the [`page.on("fileChooser")`](/python/api/class-page#page-event-file-chooser) event.

::: code-group

```python [Async]
async with page.expect_file_chooser() as fc_info:
    await page.get_by_text("Upload file").click()
file_chooser = await fc_info.value
await file_chooser.set_files("myfile.pdf")
```

```python [Sync]
with page.expect_file_chooser() as fc_info:
    page.get_by_text("Upload file").click()
file_chooser = fc_info.value
file_chooser.set_files("myfile.pdf")
```

:::

## Methods

### file_chooser.element() {#file-chooser-element}

<Badge type="info" text="Added in: v1.8" />

Returns input element associated with this file chooser.

**Returns**

- `ElementHandle`


### file_chooser.is_multiple() {#file-chooser-is-multiple}

<Badge type="info" text="Added in: v1.8" />

Returns whether this file chooser accepts multiple files.

**Returns**

- `boolean`


### file_chooser.page() {#file-chooser-page}

<Badge type="info" text="Added in: v1.8" />

Returns page this file chooser belongs to.

**Returns**

- `Page`


### file_chooser.set_files() {#file-chooser-set-files}

<Badge type="info" text="Added in: v1.8" />

Sets the value of the file input this chooser is associated with. If some of the `filePaths` are relative paths, then
they are resolved relative to the current working directory. For empty array, clears the selected files.

**Arguments**

- <a id="file-chooser-set-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    File name
  - `mime_type` `string`

    File type
  - `buffer` `Buffer`

    File content
- <a id="file-chooser-set-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="file-chooser-set-files-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="file-chooser-set-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

