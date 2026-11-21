---
title: Video
outline: 2
---

# Video

<Badge type="info" text="Added in: v1.8" />

When browser context is created with the `recordVideo` option, each page has a video object associated with it.

```js
console.log(await page.video().path());
```

## Methods

### video.delete() {#video-delete}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

Deletes the video file. Will wait for the video to finish if necessary.


### video.path() {#video-path}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the file system path this video will be recorded to. The video is guaranteed to be written to the filesystem
upon closing the browser context. This method throws when connected remotely.

**Returns**

- `Promise<path>`


### video.saveAs() {#video-save-as}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

Saves the video to a user-specified path. It is safe to call this method while the video
is still in progress, or after the page has closed. This method waits until the page is closed and the video is fully saved.

**Arguments**

- <a id="video-save-as-option-path"></a>`path` `path`

  Path where the video should be saved.

