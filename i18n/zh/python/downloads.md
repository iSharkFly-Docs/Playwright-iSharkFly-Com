---
title: "下载"
---

# 下载

## 简介

对于页面下载的每个附件，都会触发 [`page.on("download")`](/python/api/class-page#page-event-download) 事件。所有这些附件都下载到临时文件夹中。您可以使用事件中的 [Download](/python/api/class-download) 对象获取下载 URL、文件名和有效负载流。

您可以使用 [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch) 中的 [`downloads_path`](/python/api/class-browsertype#browser-type-launch-option-downloads-path) 选项指定下载文件的保存位置。

::: info
当产生下载的浏览器上下文关闭时，下载的文件将被删除。
:::

这是处理文件下载的最简单方法：

::: code-group

```python [Async]
# 开始等待下载
async with page.expect_download() as download_info:
    # 执行启动下载的操作
    await page.get_by_text("Download file").click()
download = await download_info.value

# 等待下载过程完成并将下载的文件保存到某处
await download.save_as("/path/to/save/at/" + download.suggested_filename)
```

```python [Sync]
# 开始等待下载
with page.expect_download() as download_info:
    # 执行启动下载的操作
    page.get_by_text("Download file").click()
download = download_info.value

# 等待下载过程完成并将下载的文件保存到某处
download.save_as("/path/to/save/at/" + download.suggested_filename)
```

:::

#### 变体

如果您不知道是什么启动了下载，仍然可以处理该事件：

::: code-group

```python [Async]
async def handle_download(download):
    print(await download.path())
page.on("download", handle_download)
```

```python [Sync]
page.on("download", lambda download: print(download.path()))
```

:::

请注意，处理事件会分叉控制流并使脚本更难跟踪。您的场景可能在下载文件时结束，因为主控制流没有等待此操作解决。

::: info
有关上传文件，请参阅[上传文件](./input.md#upload-files)部分。
:::
