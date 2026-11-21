---
title: "Service Workers"
---

# Service Workers

## 简介

::: warning
Service workers 仅在基于 Chromium 的浏览器上受支持。
:::

::: info
如果你想进行一般的网络模拟、路由和拦截，请先参阅[网络指南](./network.md)。Playwright 为这种用例提供了内置 API，不需要下面的信息。但是，如果你对 Service Workers 本身发出的请求感兴趣，请继续阅读。
:::

[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 提供了一种浏览器原生的方法来处理页面使用原生 [Fetch API (`fetch`)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 发出的请求以及其他网络请求的资源（如脚本、CSS 和图片）。

它们可以充当页面和外部网络之间的**网络代理**来执行缓存逻辑，或者如果 Service Worker 添加了 [FetchEvent](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent#examples) 监听器，可以为用户提供离线体验。

许多使用 Service Workers 的网站只是将它们作为透明的优化技术。虽然用户可能会注意到更快的体验，但应用程序的实现并不知道它们的存在。启用或不启用 Service Workers 运行应用程序在功能上看起来是等效的。

## 如何禁用 Service Workers

Playwright 允许在测试期间禁用 Service Workers。这使测试更加可预测和高效。但是，如果你的实际页面使用了 Service Worker，行为可能会有所不同。

要禁用 service workers，请将 [`testOptions.serviceWorkers`](/api/class-testoptions#test-options-service-workers) 设置为 `'block'`。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    serviceWorkers: 'block'
  },
});
```

:::

## 访问 Service Workers 并等待激活

你可以使用 [`browserContext.serviceWorkers()`](/api/class-browsercontext#browser-context-service-workers) 列出 Service [Worker](/api/class-worker)，或者如果你预期页面将触发其[注册](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)，可以专门监听 Service [Worker](/api/class-worker)：

```js
const serviceWorkerPromise = context.waitForEvent('serviceworker');
await page.goto('/example-with-a-service-worker.html');
const serviceworker = await serviceWorkerPromise;
```

[`browserContext.on('serviceWorker')`](/api/class-browsercontext#browser-context-event-service-worker) 事件在 Service Worker 接管页面***之前***触发，因此在使用 [`worker.evaluate()`](/api/class-worker#worker-evaluate) 在 worker 中执行代码***之前***，你应该等待其激活。

有更符合惯例的方法来等待 Service Worker 被激活，但以下是一种与实现无关的方法：

```js
await page.evaluate(async () => {
  const registration = await window.navigator.serviceWorker.getRegistration();
  if (registration.active?.state === 'activated')
    return;
  await new Promise(resolve => {
    window.navigator.serviceWorker.addEventListener('controllerchange', resolve);
  });
});
```

## 网络事件和路由

**Service Worker** 发出的任何网络请求都会通过 [BrowserContext](/api/class-browsercontext) 对象报告：
* [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request)、[`browserContext.on('requestFinished')`](/api/class-browsercontext#browser-context-event-request-finished)、[`browserContext.on('response')`](/api/class-browsercontext#browser-context-event-response) 和 [`browserContext.on('requestFailed')`](/api/class-browsercontext#browser-context-event-request-failed) 会被触发
* [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 可以看到请求
* [`request.serviceWorker()`](/api/class-request#request-service-worker) 将被设置为 Service [Worker](/api/class-worker) 实例，而 [`request.frame()`](/api/class-request#request-frame) 将**抛出异常**

此外，对于**页面**发出的任何网络请求，当请求由 Service Worker 的 fetch 处理程序处理时，方法 [`response.fromServiceWorker()`](/api/class-response#response-from-service-worker) 返回 `true`。

考虑一个简单的 service worker，它获取页面发出的每个请求：

::: code-group

```js [transparent-service-worker.js]
self.addEventListener('fetch', event => {
  // 实际发出请求
  const responsePromise = fetch(event.request);
  // 将其发送回页面
  event.respondWith(responsePromise);
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
```

:::

如果 `index.html` 注册了这个 service worker，然后获取 `data.json`，将会发出以下 Request/Response 事件（以及相应的网络生命周期事件）：

| 事件                              | 所有者           | URL                            | 可路由 | [`response.fromServiceWorker()`](/api/class-response#response-from-service-worker) |
| -                                 | -                | -                              | -      | -                                      |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | [Frame](/api/class-frame)          | index.html                     | 是     |                                        |
| [`page.on('request')`](/api/class-page#page-event-request)           | [Frame](/api/class-frame)          | index.html                     | 是     |                                        |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | Service [Worker](/api/class-worker) | transparent-service-worker.js  | 是     |                                        |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | Service [Worker](/api/class-worker) | data.json                      | 是     |                                        |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | [Frame](/api/class-frame)          | data.json                      |        | 是                                     |
| [`page.on('request')`](/api/class-page#page-event-request)           | [Frame](/api/class-frame)          | data.json                      |        | 是                                     |

由于示例 Service Worker 只是充当基本的透明"代理"：
* 对于 `data.json` 有 2 个 [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) 事件；一个是 [Frame](/api/class-frame) 拥有的，另一个是 Service [Worker](/api/class-worker) 拥有的。
* 只有 Service [Worker](/api/class-worker) 拥有的资源请求可以通过 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 进行路由；`data.json` 的 [Frame](/api/class-frame) 拥有的事件不可路由，因为由于 Service Worker 注册了 fetch 处理程序，它们甚至不可能访问外部网络。

::: warning
需要注意的是：如果在具有非空 [`request.serviceWorker()`](/api/class-request#request-service-worker) 的 [Request](/api/class-request)/[Response](/api/class-response) 上调用 [`request.frame()`](/api/class-request#request-frame) 或 [`response.frame()`](/api/class-response#response-frame)，将**抛出异常**。
:::

## 仅路由 Service Worker 请求

```js
await context.route('**', async route => {
  if (route.request().serviceWorker()) {
    // 注意：在这里调用 route.request().frame() 会抛出异常
    await route.fulfill({
      contentType: 'text/plain',
      status: 200,
      body: 'from sw',
    });
  } else {
    await route.continue();
  }
});
```

## 已知限制

目前无法路由更新 Service Worker 主脚本代码的请求 (https://github.com/microsoft/playwright/issues/14711)。
