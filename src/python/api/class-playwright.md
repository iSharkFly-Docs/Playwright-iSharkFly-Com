---
title: Playwright
outline: 2
---

# Playwright

<Badge type="info" text="Added in: v1.8" />

Playwright module provides a method to launch a browser instance. The following is a typical example of using Playwright
to drive automation:

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    chromium = playwright.chromium # or "firefox" or "webkit".
    browser = await chromium.launch()
    page = await browser.new_page()
    await page.goto("http://example.com")
    # other actions...
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    chromium = playwright.chromium # or "firefox" or "webkit".
    browser = chromium.launch()
    page = browser.new_page()
    page.goto("http://example.com")
    # other actions...
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

:::

## Methods

### playwright.stop() {#playwright-stop}

<Badge type="info" text="Added in: v1.8" />

Terminates this instance of Playwright in case it was created bypassing the Python context manager. This is useful in REPL applications.

```python
from playwright.sync_api import sync_playwright

playwright = sync_playwright().start()

browser = playwright.chromium.launch()
page = browser.new_page()
page.goto("https://playwright.dev/")
page.screenshot(path="example.png")
browser.close()

playwright.stop()
```


## Properties

### playwright.chromium {#playwright-chromium}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Chromium, returning instances of [Browser](/python/api/class-browser).

**Type**

- `BrowserType`


### playwright.devices {#playwright-devices}

<Badge type="info" text="Added in: v1.8" />

Returns a dictionary of devices to be used with [`browser.new_context()`](/python/api/class-browser#browser-new-context) or [`browser.new_page()`](/python/api/class-browser#browser-new-page).

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    webkit = playwright.webkit
    iphone = playwright.devices["iPhone 6"]
    browser = await webkit.launch()
    context = await browser.new_context(**iphone)
    page = await context.new_page()
    await page.goto("http://example.com")
    # other actions...
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    webkit = playwright.webkit
    iphone = playwright.devices["iPhone 6"]
    browser = webkit.launch()
    context = browser.new_context(**iphone)
    page = context.new_page()
    page.goto("http://example.com")
    # other actions...
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

:::

**Type**

- `Object`


### playwright.firefox {#playwright-firefox}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Firefox, returning instances of [Browser](/python/api/class-browser).

**Type**

- `BrowserType`


### playwright.request {#playwright-request}

<Badge type="info" text="Added in: v1.16" />

Exposes API that can be used for the Web API testing.

**Type**

- `APIRequest`


### playwright.selectors {#playwright-selectors}

<Badge type="info" text="Added in: v1.8" />

Selectors can be used to install custom selector engines. See
[extensibility](../extensibility.md) for more information.

**Type**

- `Selectors`


### playwright.webkit {#playwright-webkit}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to WebKit, returning instances of [Browser](/python/api/class-browser).

**Type**

- `BrowserType`

