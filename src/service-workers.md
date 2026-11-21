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

To disable service workers, set [`testOptions.serviceWorkers`](/api/class-testoptions#test-options-service-workers) to `'block'`.

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

## Accessing Service Workers and Waiting for Activation

You can use [`browserContext.serviceWorkers()`](/api/class-browsercontext#browser-context-service-workers) to list the Service [Worker](/api/class-worker)s, or specifically watch for the Service [Worker](/api/class-worker) if you anticipate a page will trigger its [registration](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register):

```js
const serviceWorkerPromise = context.waitForEvent('serviceworker');
await page.goto('/example-with-a-service-worker.html');
const serviceworker = await serviceWorkerPromise;
```

[`browserContext.on('serviceWorker')`](/api/class-browsercontext#browser-context-event-service-worker) event is fired ***before*** the Service Worker has taken control over the page, so ***before*** evaluating in the worker with [`worker.evaluate()`](/api/class-worker#worker-evaluate) you should wait on its activation.

There are more idiomatic methods of waiting for a Service Worker to be activated, but the following is an implementation agnostic method:

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

## Network Events and Routing

Any network request made by the **Service Worker** is reported through the [BrowserContext](/api/class-browsercontext) object:
* [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request), [`browserContext.on('requestFinished')`](/api/class-browsercontext#browser-context-event-request-finished), [`browserContext.on('response')`](/api/class-browsercontext#browser-context-event-response) and [`browserContext.on('requestFailed')`](/api/class-browsercontext#browser-context-event-request-failed) are fired
* [`browserContext.route()`](/api/class-browsercontext#browser-context-route) sees the request
* [`request.serviceWorker()`](/api/class-request#request-service-worker) will be set to the Service [Worker](/api/class-worker) instance, and [`request.frame()`](/api/class-request#request-frame) will **throw**

Additionally, for any network request made by the **Page**, method [`response.fromServiceWorker()`](/api/class-response#response-from-service-worker) return `true` when the request was handled a Service Worker's fetch handler.

Consider a simple service worker that fetches every request made by the page:

::: code-group

```js [transparent-service-worker.js]
self.addEventListener('fetch', event => {
  // actually make the request
  const responsePromise = fetch(event.request);
  // send it back to the page
  event.respondWith(responsePromise);
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
```

:::

If `index.html` registers this service worker, and then fetches `data.json`, the following Request/Response events would be emitted (along with the corresponding network lifecycle events):

| Event                             | Owner            | URL                            | Routed | [`response.fromServiceWorker()`](/api/class-response#response-from-service-worker) |
| -                                 | -                | -                              | -      | -                                      |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | [Frame](/api/class-frame)          | index.html                     | Yes    |                                        |
| [`page.on('request')`](/api/class-page#page-event-request)           | [Frame](/api/class-frame)          | index.html                     | Yes    |                                        |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | Service [Worker](/api/class-worker) | transparent-service-worker.js  | Yes    |                                        |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | Service [Worker](/api/class-worker) | data.json                      | Yes    |                                        |
| [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) | [Frame](/api/class-frame)          | data.json                      |        | Yes                                    |
| [`page.on('request')`](/api/class-page#page-event-request)           | [Frame](/api/class-frame)          | data.json                      |        | Yes                                    |

Since the example Service Worker just acts a basic transparent "proxy":
* There's 2 [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) events for `data.json`; one [Frame](/api/class-frame)-owned, the other Service [Worker](/api/class-worker)-owned.
* Only the Service [Worker](/api/class-worker)-owned request for the resource was routable via [`browserContext.route()`](/api/class-browsercontext#browser-context-route); the [Frame](/api/class-frame)-owned events for `data.json` are not routeable, as they would not have even had the possibility to hit the external network since the Service Worker has a fetch handler registered.

::: warning
It's important to note: calling [`request.frame()`](/api/class-request#request-frame) or [`response.frame()`](/api/class-response#response-frame) will **throw** an exception, if called on a [Request](/api/class-request)/[Response](/api/class-response) that has a non-null [`request.serviceWorker()`](/api/class-request#request-service-worker).
:::

## Routing Service Worker Requests Only

```js
await context.route('**', async route => {
  if (route.request().serviceWorker()) {
    // NB: calling route.request().frame() here would THROW
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

## Known Limitations

Requests for updated Service Worker main script code currently cannot be routed (https://github.com/microsoft/playwright/issues/14711).
