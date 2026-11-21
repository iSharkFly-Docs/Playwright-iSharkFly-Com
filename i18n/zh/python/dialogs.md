---
title: "对话框"
---

# 对话框

## 简介

Playwright 可以与网页对话框交互，如 [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)、[`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)、[`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) 以及 [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) 确认对话框。有关打印对话框，请参阅[打印对话框](#打印对话框)。

## alert()、confirm()、prompt() 对话框

默认情况下，Playwright 会自动关闭对话框，因此您不必处理它们。但是，您可以在触发对话框的操作之前注册一个对话框处理程序，以使用 [`dialog.accept()`](/python/api/class-dialog#dialog-accept) 或 [`dialog.dismiss()`](/python/api/class-dialog#dialog-dismiss) 来接受或关闭对话框。

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
[`page.on("dialog")`](/python/api/class-page#page-event-dialog) 监听器**必须处理**对话框。否则您的操作将会停滞，无论是 [`locator.click()`](/python/api/class-locator#locator-click) 还是其他操作。这是因为 Web 中的对话框是模态的，因此在处理它们之前会阻止页面的进一步执行。
:::

因此，以下代码片段永远不会完成：

::: warning
错误示范！
:::

::: code-group

```python [Async]
page.on("dialog", lambda dialog: print(dialog.message))
await page.get_by_role("button").click() # 将在此处挂起
```

```python [Sync]
page.on("dialog", lambda dialog: print(dialog.message))
page.get_by_role("button").click() # 将在此处挂起
```

:::

::: info
如果没有 [`page.on("dialog")`](/python/api/class-page#page-event-dialog) 的监听器，所有对话框都会自动关闭。
:::

## beforeunload 对话框

当使用真值 [`run_before_unload`](/python/api/class-page#page-close-option-run-before-unload) 调用 [`page.close()`](/python/api/class-page#page-close) 时，页面会运行其卸载处理程序。这是 [`page.close()`](/python/api/class-page#page-close) 唯一不会等待页面实际关闭的情况，因为页面可能在操作结束时仍然保持打开状态。

您可以注册一个对话框处理程序来自己处理 `beforeunload` 对话框：

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

## 打印对话框

为了断言通过 [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) 触发了打印对话框，您可以使用以下代码片段：

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

这将等待按钮被点击后打印对话框打开。
确保在点击按钮之前/页面加载之后执行脚本。
