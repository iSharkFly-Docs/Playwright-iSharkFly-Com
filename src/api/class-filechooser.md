---
title: FileChooser
outline: 2
---

# FileChooser

<Badge type="info" text="Added in: v1.8" />

[FileChooser](/api/class-filechooser) objects are dispatched by the page in the [`page.on('fileChooser')`](/api/class-page#page-event-file-chooser) event.

```js
// Start waiting for file chooser before clicking. Note no await.
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByText('Upload file').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles(path.join(__dirname, 'myfile.pdf'));
```

## Methods

### fileChooser.element() {#file-chooser-element}

<Badge type="info" text="Added in: v1.8" />

Returns input element associated with this file chooser.

**Returns**

- `ElementHandle`


### fileChooser.isMultiple() {#file-chooser-is-multiple}

<Badge type="info" text="Added in: v1.8" />

Returns whether this file chooser accepts multiple files.

**Returns**

- `boolean`


### fileChooser.page() {#file-chooser-page}

<Badge type="info" text="Added in: v1.8" />

Returns page this file chooser belongs to.

**Returns**

- `Page`


### fileChooser.setFiles() {#file-chooser-set-files}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Sets the value of the file input this chooser is associated with. If some of the `filePaths` are relative paths, then
they are resolved relative to the current working directory. For empty array, clears the selected files.

**Arguments**

- <a id="file-chooser-set-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content
- <a id="file-chooser-set-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="file-chooser-set-files-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="file-chooser-set-files-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="file-chooser-set-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

