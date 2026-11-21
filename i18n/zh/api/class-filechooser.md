---
title: FileChooser
outline: 2
---

# FileChooser

<Badge type="info" text="Added in: v1.8" />

[FileChooser](/api/class-filechooser) 对象通过 [`page.on('fileChooser')`](/api/class-page#page-event-file-chooser) 事件由页面派发。

```js
// 在点击之前开始等待文件选择器。注意没有 await。
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByText('Upload file').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles(path.join(__dirname, 'myfile.pdf'));
```

## Methods

### fileChooser.element() {#file-chooser-element}

<Badge type="info" text="Added in: v1.8" />

返回与此文件选择器关联的输入元素。

**Returns**

- `ElementHandle`


### fileChooser.isMultiple() {#file-chooser-is-multiple}

<Badge type="info" text="Added in: v1.8" />

返回此文件选择器是否接受多个文件。

**Returns**

- `boolean`


### fileChooser.page() {#file-chooser-page}

<Badge type="info" text="Added in: v1.8" />

返回此文件选择器所属的页面。

**Returns**

- `Page`


### fileChooser.setFiles() {#file-chooser-set-files}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

设置此选择器关联的文件输入的值。如果某些 `filePaths` 是相对路径，则它们相对于当前工作目录解析。对于空数组，清除所选文件。

**Arguments**

- <a id="file-chooser-set-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    文件名
  - `mimeType` `string`

    文件类型
  - `buffer` `Buffer`

    文件内容
- <a id="file-chooser-set-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="file-chooser-set-files-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    此选项无效果。
  - <a id="file-chooser-set-files-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传递 `timeout: 0` 以完全禁用超时。
  - <a id="file-chooser-set-files-option-timeout"></a>`timeout` `float` *(optional)*

    最大时间（毫秒）。默认为 `0` - 无超时。默认值可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改。
