---
title: Video
outline: 2
---

# Video

<Badge type="info" text="新增于: v1.8" />

当使用 `recordVideo` 选项创建浏览器上下文时，每个页面都有一个与之关联的视频对象。

```js
console.log(await page.video().path());
```

## 方法

### video.delete() {#video-delete}

<Badge type="info" text="新增于: v1.11" /> <Badge type="tip" text="async" />

删除视频文件。如有必要，将等待视频录制完成。


### video.path() {#video-path}

<Badge type="info" text="新增于: v1.8" /> <Badge type="tip" text="async" />

返回此视频将被录制到的文件系统路径。在关闭浏览器上下文时，保证视频被写入文件系统。当远程连接时，此方法会抛出异常。

**返回值**

- `Promise<path>`


### video.saveAs() {#video-save-as}

<Badge type="info" text="新增于: v1.11" /> <Badge type="tip" text="async" />

将视频保存到用户指定的路径。在视频仍在录制中或页面已关闭后调用此方法都是安全的。此方法会等待页面关闭且视频完全保存后才返回。

**参数**

- <a id="video-save-as-option-path"></a>`path` `path`

  视频应保存到的路径。
