---
title: "Downloads"
---

# Downloads

## Introduction

For every attachment downloaded by the page, [`page.onDownload()`](/java/api/class-page#page-event-download) event is emitted. All these attachments are downloaded into a temporary folder. You can obtain the download url, file name and payload stream using the [Download](/java/api/class-download) object from the event.

You can specify where to persist downloaded files using the [`downloadsPath`](/java/api/class-browsertype#browser-type-launch-option-downloads-path) option in [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch).

::: info
Downloaded files are deleted when the browser context that produced them is closed.
:::

Here is the simplest way to handle the file download:

```java
// Wait for the download to start
Download download = page.waitForDownload(() -> {
    // Perform the action that initiates download
    page.getByText("Download file").click();
});

// Wait for the download process to complete and save the downloaded file somewhere
download.saveAs(Paths.get("/path/to/save/at/", download.suggestedFilename()));
```

#### Variations

If you have no idea what initiates the download, you can still handle the event:

```java
page.onDownload(download -> System.out.println(download.path()));
```

Note that handling the event forks the control flow and makes the script harder to follow. Your scenario might end while you are downloading a file since your main control flow is not awaiting for this operation to resolve.

::: info
For uploading files, see the [uploading files](./input.md#upload-files) section.
:::
