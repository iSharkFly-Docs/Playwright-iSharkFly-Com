---
title: FileChooser
outline: 2
---

# FileChooser

<Badge type="info" text="Added in: v1.8" />

[FileChooser](/dotnet/api/class-filechooser) objects are dispatched by the page in the [`Page.FileChooser`](/dotnet/api/class-page#page-event-file-chooser) event.

```csharp
var fileChooser = await page.RunAndWaitForFileChooserAsync(async () =>
{
    await page.GetByText("Upload file").ClickAsync();
});
await fileChooser.SetFilesAsync("temp.txt");
```

## Methods

### FileChooser.Element() {#file-chooser-element}

<Badge type="info" text="Added in: v1.8" />

Returns input element associated with this file chooser.

**Returns**

- `ElementHandle`


### FileChooser.IsMultiple() {#file-chooser-is-multiple}

<Badge type="info" text="Added in: v1.8" />

Returns whether this file chooser accepts multiple files.

**Returns**

- `boolean`


### FileChooser.Page() {#file-chooser-page}

<Badge type="info" text="Added in: v1.8" />

Returns page this file chooser belongs to.

**Returns**

- `Page`


### FileChooser.SetFilesAsync() {#file-chooser-set-files}

<Badge type="info" text="Added in: v1.8" />

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
  - <a id="file-chooser-set-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

