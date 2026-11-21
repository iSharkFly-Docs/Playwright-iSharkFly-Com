---
title: "对话框"
---

# 对话框

## 简介

Playwright 可以与网页对话框进行交互，包括 [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)、[`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)、[`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) 以及 [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) 确认对话框。关于打印对话框，请参阅[打印对话框](#打印对话框)。

## alert()、confirm()、prompt() 对话框

默认情况下，Playwright 会自动关闭对话框，因此您无需手动处理它们。但是，您可以在触发对话框的操作之前注册一个对话框处理器，以便 [`dialog.accept()`](/api/class-dialog#dialog-accept) 接受或 [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) 关闭对话框。

```js
page.on('dialog', dialog => dialog.accept());
await page.getByRole('button').click();
```

::: info
[`page.on('dialog')`](/api/class-page#page-event-dialog) 监听器**必须处理**对话框。否则您的操作将会阻塞，无论是 [`locator.click()`](/api/class-locator#locator-click) 还是其他操作。这是因为 Web 中的对话框是模态的，会阻止页面的进一步执行，直到对话框被处理。
:::

因此，以下代码片段将永远不会解析：

::: warning
错误示例！
:::

```js
page.on('dialog', dialog => console.log(dialog.message()));
await page.getByRole('button').click(); // 将在此处阻塞
```

::: info
如果没有为 [`page.on('dialog')`](/api/class-page#page-event-dialog) 设置监听器，所有对话框都会被自动关闭。
:::

## beforeunload 对话框

当使用 truthy [`runBeforeUnload`](/api/class-page#page-close-option-run-before-unload) 值调用 [`page.close()`](/api/class-page#page-close) 时，页面会运行其卸载处理器。这是 [`page.close()`](/api/class-page#page-close) 不会等待页面真正关闭的唯一情况，因为在操作结束时页面可能仍然保持打开状态。

您可以注册一个对话框处理器来自行处理 `beforeunload` 对话框：

```js
page.on('dialog', async dialog => {
  assert(dialog.type() === 'beforeunload');
  await dialog.dismiss();
});
await page.close({ runBeforeUnload: true });
```

## 打印对话框

为了断言通过 [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) 触发了打印对话框，您可以使用以下代码片段：

```js
await page.goto('<url>');

await page.evaluate('(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()');
await page.getByText('Print it!').click();

await page.waitForFunction('window.waitForPrintDialog');
```

这将等待点击按钮后打印对话框打开。
请确保在点击按钮之前/页面加载之后执行脚本。
