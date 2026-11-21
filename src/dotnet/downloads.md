---
title: "Downloads"
---

# Downloads

## Introduction

For every attachment downloaded by the page, [`Page.Download`](/dotnet/api/class-page#page-event-download) event is emitted. All these attachments are downloaded into a temporary folder. You can obtain the download url, file name and payload stream using the [Download](/dotnet/api/class-download) object from the event.

You can specify where to persist downloaded files using the [`downloadsPath`](/dotnet/api/class-browsertype#browser-type-launch-option-downloads-path) option in [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch).

::: info
Downloaded files are deleted when the browser context that produced them is closed.
:::

Here is the simplest way to handle the file download:

```csharp
// Start the task of waiting for the download before clicking
var waitForDownloadTask = page.WaitForDownloadAsync();
await page.GetByText("Download file").ClickAsync();
var download = await waitForDownloadTask;

// Wait for the download process to complete and save the downloaded file somewhere
await download.SaveAsAsync("/path/to/save/at/" + download.SuggestedFilename);
```

#### Variations

If you have no idea what initiates the download, you can still handle the event:

```csharp
page.Download += (sender, download) => Console.WriteLine(download.Url);
```

Note that handling the event forks the control flow and makes the script harder to follow. Your scenario might end while you are downloading a file since your main control flow is not awaiting for this operation to resolve.

::: info
For uploading files, see the [uploading files](./input.md#upload-files) section.
:::
