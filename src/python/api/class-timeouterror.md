---
title: TimeoutError
outline: 2
---

# TimeoutError

<Badge type="info" text="Added in: v1.8" />

Extends: [Error](./class-error)

* extends: [Error](/python/api/class-error)

TimeoutError is emitted whenever certain operations are terminated due to timeout, e.g. [`locator.wait_for()`](/python/api/class-locator#locator-wait-for) or [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch).

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError, Playwright

async def run(playwright: Playwright):
    browser = await playwright.chromium.launch()
    page = await browser.new_page()
    try:
      await page.locator("text=Example").click(timeout=100)
    except PlaywrightTimeoutError:
      print("Timeout!")
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)

asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
      page.locator("text=Example").click(timeout=100)
    except PlaywrightTimeoutError:
      print("Timeout!")
    browser.close()
```

:::
