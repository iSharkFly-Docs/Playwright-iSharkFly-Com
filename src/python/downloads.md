---
title: "Downloads"
---

# Downloads

## Introduction

For every attachment downloaded by the page, [`page.on("download")`](/python/api/class-page#page-event-download) event is emitted. All these attachments are downloaded into a temporary folder. You can obtain the download url, file name and payload stream using the [Download](/python/api/class-download) object from the event.

You can specify where to persist downloaded files using the [`downloads_path`](/python/api/class-browsertype#browser-type-launch-option-downloads-path) option in [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch).

::: info
Downloaded files are deleted when the browser context that produced them is closed.
:::

Here is the simplest way to handle the file download:

::: code-group

```python [Async]
# Start waiting for the download
async with page.expect_download() as download_info:
    # Perform the action that initiates download
    await page.get_by_text("Download file").click()
download = await download_info.value

# Wait for the download process to complete and save the downloaded file somewhere
await download.save_as("/path/to/save/at/" + download.suggested_filename)
```

```python [Sync]
# Start waiting for the download
with page.expect_download() as download_info:
    # Perform the action that initiates download
    page.get_by_text("Download file").click()
download = download_info.value

# Wait for the download process to complete and save the downloaded file somewhere
download.save_as("/path/to/save/at/" + download.suggested_filename)
```

:::

#### Variations

If you have no idea what initiates the download, you can still handle the event:

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

Note that handling the event forks the control flow and makes the script harder to follow. Your scenario might end while you are downloading a file since your main control flow is not awaiting for this operation to resolve.

::: info
For uploading files, see the [uploading files](./input.md#upload-files) section.
:::
