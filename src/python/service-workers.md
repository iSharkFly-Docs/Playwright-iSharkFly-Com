---
title: "Service Workers"
---

# Service Workers

## Introduction

::: warning
Service workers are only supported on Chromium-based browsers.
:::

::: info
If you're looking to do general network mocking, routing, and interception, please see the [Network Guide](./network.md) first. Playwright provides built-in APIs for this use case that don't require the information below. However, if you're interested in requests made by Service Workers themselves, please read below.
:::

[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) provide a browser-native method of handling requests made by a page with the native [Fetch API (`fetch`)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) along with other network-requested assets (like scripts, css, and images).

They can act as a **network proxy** between the page and the external network to perform caching logic or can provide users with an offline experience if the Service Worker adds a [FetchEvent](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent#examples) listener.

Many sites that use Service Workers simply use them as a transparent optimization technique. While users might notice a faster experience, the app's implementation is unaware of their existence. Running the app with or without Service Workers enabled appears functionally equivalent.

## How to Disable Service Workers

Playwright allows to disable Service Workers during testing. This makes tests more predictable and performant. However, if your actual page uses a Service Worker, the behavior might be different.

To disable service workers, set `service_workers` context option to `"block"`.

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

## Accessing Service Workers and Waiting for Activation

You can use [`browser_context.service_workers()`](/python/api/class-browsercontext#browser-context-service-workers) to list the Service [Worker](/python/api/class-worker)s, or specifically watch for the Service [Worker](/python/api/class-worker) if you anticipate a page will trigger its [registration](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register):

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

[`browserContext.on("serviceWorker")`](/python/api/class-browsercontext#browser-context-event-service-worker) event is fired ***before*** the Service Worker has taken control over the page, so ***before*** evaluating in the worker with [`worker.evaluate()`](/python/api/class-worker#worker-evaluate) you should wait on its activation.

There are more idiomatic methods of waiting for a Service Worker to be activated, but the following is an implementation agnostic method:

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

## Network Events and Routing

Any network request made by the **Service Worker** is reported through the [BrowserContext](/python/api/class-browsercontext) object:
* [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request), [`browserContext.on("requestFinished")`](/python/api/class-browsercontext#browser-context-event-request-finished), [`browserContext.on("response")`](/python/api/class-browsercontext#browser-context-event-response) and [`browserContext.on("requestFailed")`](/python/api/class-browsercontext#browser-context-event-request-failed) are fired
* [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route) sees the request
* [`request.service_worker()`](/python/api/class-request#request-service-worker) will be set to the Service [Worker](/python/api/class-worker) instance, and [`request.frame()`](/python/api/class-request#request-frame) will **throw**

Additionally, for any network request made by the **Page**, method [`response.from_service_worker()`](/python/api/class-response#response-from-service-worker) return `true` when the request was handled a Service Worker's fetch handler.

Consider a simple service worker that fetches every request made by the page:

If `index.html` registers this service worker, and then fetches `data.json`, the following Request/Response events would be emitted (along with the corresponding network lifecycle events):

| Event                             | Owner            | URL                            | Routed | [`response.from_service_worker()`](/python/api/class-response#response-from-service-worker) |
| -                                 | -                | -                              | -      | -                                      |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | [Frame](/python/api/class-frame)          | index.html                     | Yes    |                                        |
| [`page.on("request")`](/python/api/class-page#page-event-request)           | [Frame](/python/api/class-frame)          | index.html                     | Yes    |                                        |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | Service [Worker](/python/api/class-worker) | transparent-service-worker.js  | Yes    |                                        |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | Service [Worker](/python/api/class-worker) | data.json                      | Yes    |                                        |
| [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) | [Frame](/python/api/class-frame)          | data.json                      |        | Yes                                    |
| [`page.on("request")`](/python/api/class-page#page-event-request)           | [Frame](/python/api/class-frame)          | data.json                      |        | Yes                                    |

Since the example Service Worker just acts a basic transparent "proxy":
* There's 2 [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) events for `data.json`; one [Frame](/python/api/class-frame)-owned, the other Service [Worker](/python/api/class-worker)-owned.
* Only the Service [Worker](/python/api/class-worker)-owned request for the resource was routable via [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route); the [Frame](/python/api/class-frame)-owned events for `data.json` are not routeable, as they would not have even had the possibility to hit the external network since the Service Worker has a fetch handler registered.

::: warning
It's important to note: calling [`request.frame()`](/python/api/class-request#request-frame) or [`response.frame()`](/python/api/class-response#response-frame) will **throw** an exception, if called on a [Request](/python/api/class-request)/[Response](/python/api/class-response) that has a non-null [`request.service_worker()`](/python/api/class-request#request-service-worker).
:::

## Routing Service Worker Requests Only

::: code-group

```python [Sync]
def handle_route(route: Route):
  if route.request.service_worker:
    # NB: accessing route.request.frame here would THROW
    route.fulfill(content_type="text/plain", status=200, body="from sw")
  else:
    route.continue_()

context.route("**", handle_route)
```

```python [Async]
async def handle_route(route: Route):
  if route.request.service_worker:
    # NB: accessing route.request.frame here would THROW
    await route.fulfill(content_type="text/plain", status=200, body="from sw")
  else:
    await route.continue_()

await context.route("**", handle_route)
```

:::

## Known Limitations

Requests for updated Service Worker main script code currently cannot be routed (https://github.com/microsoft/playwright/issues/14711).
