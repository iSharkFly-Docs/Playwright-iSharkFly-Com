---
title: "事件"
---

# 事件

## 简介

Playwright 允许监听网页上发生的各种类型的事件，例如网络请求、子页面创建、专用 worker 等。有几种方式可以订阅这些事件，例如等待事件或添加/移除事件监听器。

## 等待事件

大多数情况下，脚本需要等待特定事件发生。以下是一些典型的事件等待模式。

使用 [`page.waitForRequest()`](/api/class-page#page-wait-for-request) 等待具有指定 URL 的请求：

```js
// 在 goto 之前开始等待请求。注意没有 await。
const requestPromise = page.waitForRequest('**/*logo*.png');
await page.goto('https://wikipedia.org');
const request = await requestPromise;
console.log(request.url());
```

等待弹出窗口：

```js
// 在点击之前开始等待弹出窗口。注意没有 await。
const popupPromise = page.waitForEvent('popup');
await page.getByText('open the popup').click();
const popup = await popupPromise;
await popup.goto('https://wikipedia.org');
```

## 添加/移除事件监听器

有时，事件会在随机时间发生，需要处理它们而不是等待它们。Playwright 支持传统的语言机制来订阅和取消订阅事件：

```js
page.on('request', request => console.log(`Request sent: ${request.url()}`));
const listener = request => console.log(`Request finished: ${request.url()}`);
page.on('requestfinished', listener);
await page.goto('https://wikipedia.org');

page.off('requestfinished', listener);
await page.goto('https://www.openstreetmap.org/');
```

## 添加一次性监听器

如果某个事件只需要处理一次，有一个便捷的 API：

```js
page.once('dialog', dialog => dialog.accept('2021'));
await page.evaluate("prompt('Enter a number:')");
```
