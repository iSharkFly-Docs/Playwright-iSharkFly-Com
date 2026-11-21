---
title: "下载"
---

# 下载

## 简介

对于页面下载的每个附件，都会触发 [`page.onDownload()`](/java/api/class-page#page-event-download) 事件。所有这些附件都下载到临时文件夹中。您可以使用事件中的 [Download](/java/api/class-download) 对象获取下载 URL、文件名和有效负载流。

您可以使用 [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) 中的 [`downloadsPath`](/java/api/class-browsertype#browser-type-launch-option-downloads-path) 选项指定下载文件的保存位置。

::: info
当产生下载的浏览器上下文关闭时，下载的文件将被删除。
:::

这是处理文件下载的最简单方法：

```java
// 等待下载开始
Download download = page.waitForDownload(() -> {
    // 执行启动下载的操作
    page.getByText("Download file").click();
});

// 等待下载过程完成并将下载的文件保存到某处
download.saveAs(Paths.get("/path/to/save/at/", download.suggestedFilename()));
```

#### 变体

如果您不知道是什么启动了下载，仍然可以处理该事件：

```java
page.onDownload(download -> System.out.println(download.path()));
```

请注意，处理事件会分叉控制流并使脚本更难跟踪。您的场景可能在下载文件时结束，因为主控制流没有等待此操作解决。

::: info
有关上传文件，请参阅[上传文件](./input.md#upload-files)部分。
:::
