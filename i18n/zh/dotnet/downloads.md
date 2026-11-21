---
title: "下载"
---

# 下载

## 简介

对于页面下载的每个附件，都会触发 [`Page.Download`](/dotnet/api/class-page#page-event-download) 事件。所有这些附件都下载到临时文件夹中。您可以使用事件中的 [Download](/dotnet/api/class-download) 对象获取下载 URL、文件名和有效负载流。

您可以使用 [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch) 中的 [`downloadsPath`](/dotnet/api/class-browsertype#browser-type-launch-option-downloads-path) 选项指定下载文件的持久化位置。

::: info
当产生它们的浏览器上下文关闭时，下载的文件将被删除。
:::

以下是处理文件下载的最简单方法：

```csharp
// 在点击之前启动等待下载的任务
var waitForDownloadTask = page.WaitForDownloadAsync();
await page.GetByText("Download file").ClickAsync();
var download = await waitForDownloadTask;

// 等待下载过程完成并将下载的文件保存到某处
await download.SaveAsAsync("/path/to/save/at/" + download.SuggestedFilename);
```

#### 变体

如果您不知道是什么触发了下载，您仍然可以处理该事件：

```csharp
page.Download += (sender, download) => Console.WriteLine(download.Url);
```

请注意，处理事件会分叉控制流，使脚本更难跟踪。由于您的主控制流没有等待此操作解析，因此在您下载文件时场景可能会结束。

::: info
有关上传文件，请参阅[上传文件](./input.md#upload-files)部分。
:::
