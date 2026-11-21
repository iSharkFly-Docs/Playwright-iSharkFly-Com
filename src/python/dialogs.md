---
title: "Dialogs"
---

# Dialogs

## Introduction

Playwright can interact with the web page dialogs such as [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) as well as [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) confirmation. For print dialogs, see [Print](#print-dialogs).

## alert(), confirm(), prompt() dialogs

By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them. However, you can register a dialog handler before the action that triggers the dialog to either [`dialog.accept()`](/python/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/python/api/class-dialog#dialog-dismiss) it.

::: code-group

```python [Async]
page.on("dialog", lambda dialog: dialog.accept())
await page.get_by_role("button").click()
```

```python [Sync]
page.on("dialog", lambda dialog: dialog.accept())
page.get_by_role("button").click()
```

:::

::: info
[`page.on("dialog")`](/python/api/class-page#page-event-dialog) listener **must handle** the dialog. Otherwise your action will stall, be it [`locator.click()`](/python/api/class-locator#locator-click) or something else. That's because dialogs in Web are modals and therefore block further page execution until they are handled.
:::

As a result, the following snippet will never resolve:

::: warning
WRONG!
:::

::: code-group

```python [Async]
page.on("dialog", lambda dialog: print(dialog.message))
await page.get_by_role("button").click() # Will hang here
```

```python [Sync]
page.on("dialog", lambda dialog: print(dialog.message))
page.get_by_role("button").click() # Will hang here
```

:::

::: info
If there is no listener for [`page.on("dialog")`](/python/api/class-page#page-event-dialog), all dialogs are automatically dismissed.
:::

## beforeunload dialog

When [`page.close()`](/python/api/class-page#page-close) is invoked with the truthy [`run_before_unload`](/python/api/class-page#page-close-option-run-before-unload) value, the page runs its unload handlers. This is the only case when [`page.close()`](/python/api/class-page#page-close) does not wait for the page to actually close, because it might be that the page stays open in the end of the operation.

You can register a dialog handler to handle the `beforeunload` dialog yourself:

::: code-group

```python [Async]
async def handle_dialog(dialog):
    assert dialog.type == 'beforeunload'
    await dialog.dismiss()

page.on('dialog', handle_dialog)
await page.close(run_before_unload=True)
```

```python [Sync]
def handle_dialog(dialog):
    assert dialog.type == 'beforeunload'
    dialog.dismiss()

page.on('dialog', handle_dialog)
page.close(run_before_unload=True)
```

:::

## Print dialogs

In order to assert that a print dialog via [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) was triggered, you can use the following snippet:

::: code-group

```python [Async]
await page.goto("<url>")

await page.evaluate("(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()")
await page.get_by_text("Print it!").click()

await page.wait_for_function("window.waitForPrintDialog")
```

```python [Sync]
page.goto("<url>")

page.evaluate("(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()")
page.get_by_text("Print it!").click()

page.wait_for_function("window.waitForPrintDialog")
```

:::

This will wait for the print dialog to be opened after the button is clicked.
Make sure to evaluate the script before clicking the button / after the page is loaded.
