---
title: Download
outline: 2
---

# Download

<Badge type="info" text="Added in: v1.8" />

[Download](/python/api/class-download) objects are dispatched by page via the [`page.on("download")`](/python/api/class-page#page-event-download) event.

All the downloaded files belonging to the browser context are deleted when the
browser context is closed.

Download event is emitted once the download starts. Download path becomes available once download completes.

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

## Methods

### download.cancel() {#download-cancel}

<Badge type="info" text="Added in: v1.13" />

Cancels a download. Will not fail if the download is already finished or canceled.
Upon successful cancellations, `download.failure()` would resolve to `'canceled'`.


### download.delete() {#download-delete}

<Badge type="info" text="Added in: v1.8" />

Deletes the downloaded file. Will wait for the download to finish if necessary.


### download.failure() {#download-failure}

<Badge type="info" text="Added in: v1.8" />

Returns download error if any. Will wait for the download to finish if necessary.

**Returns**

- `null | string`


### download.page() {#download-page}

<Badge type="info" text="Added in: v1.12" />

Get the page that the download belongs to.

**Returns**

- `Page`


### download.path() {#download-path}

<Badge type="info" text="Added in: v1.8" />

Returns path to the downloaded file for a successful download, or throws for a failed/canceled download. The method will wait for the download to finish if necessary. The method throws when connected remotely.

Note that the download's file name is a random GUID, use [`download.suggested_filename()`](/python/api/class-download#download-suggested-filename)
to get suggested file name.

**Returns**

- `path`


### download.save_as() {#download-save-as}

<Badge type="info" text="Added in: v1.8" />

Copy the download to a user-specified path. It is safe to call this method while the download
is still in progress. Will wait for the download to finish if necessary.

**Usage**

::: code-group

```python [Async]
await download.save_as("/path/to/save/at/" + download.suggested_filename)
```

```python [Sync]
download.save_as("/path/to/save/at/" + download.suggested_filename)
```

:::

**Arguments**

- <a id="download-save-as-option-path"></a>`path` `path`

  Path where the download should be copied.


### download.suggested_filename() {#download-suggested-filename}

<Badge type="info" text="Added in: v1.8" />

Returns suggested filename for this download. It is typically computed by the browser from the
[`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) response header
or the `download` attribute. See the spec on [whatwg](https://html.spec.whatwg.org/#downloading-resources). Different
browsers can use different logic for computing it.

**Returns**

- `string`


### download.url() {#download-url}

<Badge type="info" text="Added in: v1.8" />

Returns downloaded url.

**Returns**

- `string`

