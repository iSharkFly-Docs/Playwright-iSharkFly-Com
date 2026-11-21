---
title: Download
outline: 2
---

# Download

<Badge type="info" text="Added in: v1.8" />

[Download](/api/class-download) 对象通过 [`page.on('download')`](/api/class-page#page-event-download) 事件由页面派发。

当浏览器上下文关闭时，属于该浏览器上下文的所有下载文件都会被删除。

下载事件在下载开始时触发。下载路径在下载完成后可用。

```js
// 在点击之前开始等待下载。注意没有 await。
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;

// 等待下载过程完成并将下载的文件保存到某处。
await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
```

## Methods

### download.cancel() {#download-cancel}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

取消下载。如果下载已完成或已取消，则不会失败。
成功取消后，`download.failure()` 将解析为 `'canceled'`。


### download.createReadStream() {#download-create-read-stream}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回成功下载的可读流，或对于失败/已取消的下载抛出异常。

::: info
如果您不需要可读流，通常在下载完成后从磁盘读取文件会更简单。请参阅 [`download.path()`](/api/class-download#download-path)。
:::

**Returns**

- `Promise<Readable>`


### download.delete() {#download-delete}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

删除下载的文件。如果必要，将等待下载完成。


### download.failure() {#download-failure}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回下载错误（如果有）。如果必要，将等待下载完成。

**Returns**

- `Promise<null | string>`


### download.page() {#download-page}

<Badge type="info" text="Added in: v1.12" />

获取下载所属的页面。

**Returns**

- `Page`


### download.path() {#download-path}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回成功下载的下载文件路径，或对于失败/已取消的下载抛出异常。如果必要，该方法将等待下载完成。当远程连接时，该方法会抛出异常。

请注意，下载的文件名是随机 GUID，使用 [`download.suggestedFilename()`](/api/class-download#download-suggested-filename) 获取建议的文件名。

**Returns**

- `Promise<path>`


### download.saveAs() {#download-save-as}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

将下载复制到用户指定的路径。在下载仍在进行时调用此方法是安全的。如果必要，将等待下载完成。

**Usage**

```js
await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
```

**Arguments**

- <a id="download-save-as-option-path"></a>`path` `path`

  下载应复制到的路径。


### download.suggestedFilename() {#download-suggested-filename}

<Badge type="info" text="Added in: v1.8" />

返回此下载的建议文件名。它通常由浏览器从 [`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) 响应头或 `download` 属性计算得出。请参阅 [whatwg](https://html.spec.whatwg.org/#downloading-resources) 上的规范。不同的浏览器可能使用不同的逻辑来计算它。

**Returns**

- `string`


### download.url() {#download-url}

<Badge type="info" text="Added in: v1.8" />

返回下载的 url。

**Returns**

- `string`
