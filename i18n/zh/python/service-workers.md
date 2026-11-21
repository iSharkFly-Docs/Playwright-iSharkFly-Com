---
title: "Service Workers"
---

# Service Workers

## 简介

::: warning
Service Workers 仅在基于 Chromium 的浏览器上受支持。
:::

::: info
如果您想进行一般的网络模拟、路由和拦截，请先参阅[网络指南](./network.md)。Playwright 为此用例提供了内置 API，不需要以下信息。但是，如果您对 Service Workers 本身发出的请求感兴趣，请继续阅读下文。
:::

[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 提供了一种浏览器原生的方法，用于处理页面使用原生 [Fetch API (`fetch`)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 发出的请求以及其他网络请求的资源（如脚本、CSS 和图片）。

它们可以作为页面和外部网络之间的**网络代理**来执行缓存逻辑，或者如果 Service Worker 添加了 [FetchEvent](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent#examples) 监听器，可以为用户提供离线体验。

许多使用 Service Workers 的网站只是将其作为透明的优化技术。虽然用户可能会注意到更快的体验，但应用程序的实现并不知道它们的存在。在启用或不启用 Service Workers 的情况下运行应用程序，功能上看起来是等效的。

## 如何禁用 Service Workers

Playwright 允许在测试期间禁用 Service Workers。这使得测试更加可预测和高效。但是，如果您的实际页面使用 Service Worker，行为可能会有所不同。

要禁用 Service Workers，请将 `service_workers` 上下文选项设置为 `"block"`。

::: code-group

```python [conftest.py]
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "service_workers": "block"
    }
```

:::

## 访问 Service Workers 并等待激活

您可以使用 [`browser_context.service_workers()`](/python/api/class-browsercontext#browser-context-service-workers) 列出 Service [Worker](/python/api/class-worker)，或者如果您预期页面会触发其[注册](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)，可以专门监视 Service [Worker](/python/api/class-worker)：

::: code-group

```python [Sync]
with context.expect_event("serviceworker") as worker_info:
  page.goto("/example-with-a-service-worker.html")
service_worker = worker_info.value
```

```python [Async]
async with context.expect_event("serviceworker") as worker_info:
  await page.goto("/example-with-a-service-worker.html")
service_worker = await worker_info.value
```

:::

[`browserContext.on("serviceWorker")`](/python/api/class-browsercontext#browser-context-event-service-worker) 事件在 Service Worker 接管页面***之前***触发，因此在使用 [`worker.evaluate()`](/python/api/class-worker#worker-evaluate) 在 worker 中执行代码***之前***，您应该等待其激活。

有更符合习惯的方法来等待 Service Worker 激活，但以下是一个与实现无关的方法：

::: code-group

```python [Sync]
page.evaluate("""async () => {
  const registration = await window.navigator.serviceWorker.getRegistration();
  if (registration.active?.state === 'activated')
    return;
  await new Promise(resolve => {
    window.navigator.serviceWorker.addEventListener('controllerchange', resolve);
  });
}""")
```

```python [Async]
await page.evaluate("""async () => {
  const registration = await window.navigator.serviceWorker.getRegistration();
  if (registration.active?.state === 'activated')
    return;
  await new Promise(resolve => {
    window.navigator.serviceWorker.addEventListener('controllerchange', resolve);
  });
}""")
```

:::

## 网络事件和路由

**Service Worker** 发出的任何网络请求都会通过 [BrowserContext](/python/api/class-browsercontext) 对象报告：
* [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request)、[`browserContext.on("requestFinished")`](/python/api/class-browsercontext#browser-context-event-request-finished)、[`browserContext.on("response")`](/python/api/class-browsercontext#browser-context-event-response) 和 [`browserContext.on("requestFailed")`](/python/api/class-browsercontext#browser-context-event-request-failed) 会被触发
* [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route) 可以看到请求
* [`request.service_worker()`](/python/api/class-request#request-service-worker) 将被设置为 Service [Worker](/python/api/class-worker) 实例，而 [`request.frame()`](/python/api/class-request#request-frame) 将**抛出**异常

此外，对于**页面**发出的任何网络请求，当请求由 Service Worker 的 fetch 处理程序处理时，方法 [`response.from_service_worker()`](/python/api/class-response#response-from-service-worker) 返回 `true`。

考虑一个简单的 Service Worker，它获取页面发出的每个请求：

如果 `index.html` 注册了这个 Service Worker，然后获取 `data.json`，将会发出以下 Request/Response 事件（以及相应的网络生命周期事件）：

| 事件                              | 所有者           | URL                            | 可路由 | [`response.from_service_worker()`](/python/api/class-response#response-from-service-worker) |
| -                                 | -                | -                              | -      | -                                      |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | [Frame](/python/api/class-frame)          | index.html                     | 是     |                                        |
| [`page.on("request")`](/python/api/class-page#page-event-request)           | [Frame](/python/api/class-frame)          | index.html                     | 是     |                                        |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | Service [Worker](/python/api/class-worker) | transparent-service-worker.js  | 是     |                                        |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | Service [Worker](/python/api/class-worker) | data.json                      | 是     |                                        |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | [Frame](/python/api/class-frame)          | data.json                      |        | 是                                     |
| [`page.on("request")`](/python/api/class-page#page-event-request)           | [Frame](/python/api/class-frame)          | data.json                      |        | 是                                     |

由于示例中的 Service Worker 只是作为基本的透明"代理"：
* `data.json` 有 2 个 [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) 事件；一个属于 [Frame](/python/api/class-frame)，另一个属于 Service [Worker](/python/api/class-worker)。
* 只有 Service [Worker](/python/api/class-worker) 拥有的资源请求可以通过 [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route) 进行路由；`data.json` 的 [Frame](/python/api/class-frame) 拥有的事件不可路由，因为由于 Service Worker 注册了 fetch 处理程序，它们甚至没有可能访问外部网络。

::: warning
需要注意的是：如果对具有非空 [`request.service_worker()`](/python/api/class-request#request-service-worker) 的 [Request](/python/api/class-request)/[Response](/python/api/class-response) 调用 [`request.frame()`](/python/api/class-request#request-frame) 或 [`response.frame()`](/python/api/class-response#response-frame)，将**抛出**异常。
:::

## 仅路由 Service Worker 请求

::: code-group

```python [Sync]
def handle_route(route: Route):
  if route.request.service_worker:
    # 注意：在这里访问 route.request.frame 会抛出异常
    route.fulfill(content_type="text/plain", status=200, body="from sw")
  else:
    route.continue_()

context.route("**", handle_route)
```

```python [Async]
async def handle_route(route: Route):
  if route.request.service_worker:
    # 注意：在这里访问 route.request.frame 会抛出异常
    await route.fulfill(content_type="text/plain", status=200, body="from sw")
  else:
    await route.continue_()

await context.route("**", handle_route)
```

:::

## 已知限制

目前无法路由更新 Service Worker 主脚本代码的请求 (https://github.com/microsoft/playwright/issues/14711)。
