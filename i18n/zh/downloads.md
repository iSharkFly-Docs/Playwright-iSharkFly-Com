---
title: "下载"
---

# 下载

## 简介

对于页面下载的每个附件，都会触发 [`page.on('download')`](/api/class-page#page-event-download) 事件。所有这些附件都下载到临时文件夹中。您可以使用事件中的 [Download](/api/class-download) 对象获取下载 URL、文件名和有效负载流。

您可以使用 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 中的 [`downloadsPath`](/api/class-browsertype#browser-type-launch-option-downloads-path) 选项指定下载文件的持久保存位置。

::: info
当产生下载文件的浏览器上下文关闭时，下载的文件会被删除。
:::

以下是处理文件下载的最简单方法：

```js
// 在点击之前开始等待下载。注意没有 await。
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;

// 等待下载过程完成并将下载的文件保存到某处。
await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
```

#### 变体

如果您不知道是什么触发了下载，仍然可以处理该事件：

```js
page.on('download', download => download.path().then(console.log));
```

请注意，处理事件会分叉控制流，使脚本更难跟踪。您的场景可能会在下载文件时结束，因为您的主控制流没有等待此操作完成。

::: info
有关上传文件的内容，请参阅[上传文件](./input.md#upload-files)部分。
:::
