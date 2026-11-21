---
title: Dialog
outline: 2
---

# Dialog

<Badge type="info" text="Added in: v1.8" />

[Dialog](/python/api/class-dialog) objects are dispatched by page via the [`page.on("dialog")`](/python/api/class-page#page-event-dialog) event.

An example of using `Dialog` class:

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def handle_dialog(dialog):
    print(dialog.message)
    await dialog.dismiss()

async def run(playwright: Playwright):
    chromium = playwright.chromium
    browser = await chromium.launch()
    page = await browser.new_page()
    page.on("dialog", handle_dialog)
    page.evaluate("alert('1')")
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def handle_dialog(dialog):
    print(dialog.message)
    dialog.dismiss()

def run(playwright: Playwright):
    chromium = playwright.chromium
    browser = chromium.launch()
    page = browser.new_page()
    page.on("dialog", handle_dialog)
    page.evaluate("alert('1')")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

:::

::: info
Dialogs are dismissed automatically, unless there is a [`page.on("dialog")`](/python/api/class-page#page-event-dialog) listener.
When listener is present, it **must** either [`dialog.accept()`](/python/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/python/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.
:::

## Methods

### dialog.accept() {#dialog-accept}

<Badge type="info" text="Added in: v1.8" />

Returns when the dialog has been accepted.

**Arguments**

- <a id="dialog-accept-option-prompt-text"></a>`prompt_text` `string` *(optional)*

  A text to enter in prompt. Does not cause any effects if the dialog's `type` is not prompt. Optional.


### dialog.default_value() {#dialog-default-value}

<Badge type="info" text="Added in: v1.8" />

If dialog is prompt, returns default prompt value. Otherwise, returns empty string.

**Returns**

- `string`


### dialog.dismiss() {#dialog-dismiss}

<Badge type="info" text="Added in: v1.8" />

Returns when the dialog has been dismissed.


### dialog.message() {#dialog-message}

<Badge type="info" text="Added in: v1.8" />

A message displayed in the dialog.

**Returns**

- `string`


### dialog.page() {#dialog-page}

<Badge type="info" text="Added in: v1.34" />

The page that initiated this dialog, if available.

**Returns**

- `null | Page`


### dialog.type() {#dialog-type}

<Badge type="info" text="Added in: v1.8" />

Returns dialog's type, can be one of `alert`, `beforeunload`, `confirm` or `prompt`.

**Returns**

- `string`

