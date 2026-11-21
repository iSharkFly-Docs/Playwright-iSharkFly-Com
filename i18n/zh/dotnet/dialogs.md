---
title: "对话框"
---

# 对话框

## 简介

Playwright 可以与网页对话框交互，例如 [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)、[`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)、[`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) 以及 [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) 确认。对于打印对话框，请参阅[打印对话框](#打印对话框)。

## alert()、confirm()、prompt() 对话框

默认情况下，对话框会被 Playwright 自动关闭，因此你不需要处理它们。但是，你可以在触发对话框的操作之前注册一个对话框处理程序，以 [`Dialog.AcceptAsync()`](/dotnet/api/class-dialog#dialog-accept) 或 [`Dialog.DismissAsync()`](/dotnet/api/class-dialog#dialog-dismiss) 来处理它。

```csharp
Page.Dialog += async (_, dialog) =>
{
    await dialog.AcceptAsync();
};
await Page.GetByRole(AriaRole.Button).ClickAsync();
```

::: info
[`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) 监听器**必须处理**对话框。否则你的操作将会停滞，无论是 [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) 还是其他操作。这是因为 Web 中的对话框是模态的，会阻止页面的进一步执行，直到它们被处理。
:::

因此，以下代码片段将永远不会解析：

::: warning
错误做法！
:::

```csharp
page.Dialog += (_, dialog) => Console.WriteLine(dialog.Message);
await page.GetByRole(AriaRole.Button).ClickAsync(); // 将在此处挂起
```

::: info
如果没有 [`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) 的监听器，所有对话框都会自动关闭。
:::

## beforeunload 对话框

当使用真值 [`runBeforeUnload`](/dotnet/api/class-page#page-close-option-run-before-unload) 调用 [`Page.CloseAsync()`](/dotnet/api/class-page#page-close) 时，页面会运行其卸载处理程序。这是 [`Page.CloseAsync()`](/dotnet/api/class-page#page-close) 不等待页面实际关闭的唯一情况，因为在操作结束时页面可能会保持打开状态。

你可以注册一个对话框处理程序来自己处理 `beforeunload` 对话框：

```csharp
Page.Dialog += async (_, dialog) =>
{
    Assert.AreEqual("beforeunload", dialog.Type);
    await dialog.DismissAsync();
};
await Page.CloseAsync(new() { RunBeforeUnload = true });
```

## 打印对话框

为了断言通过 [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) 触发了打印对话框，你可以使用以下代码片段：

```csharp
await Page.GotoAsync("<url>");

await Page.EvaluateAsync("(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()");
await Page.GetByText("Print it!").ClickAsync();

await Page.WaitForFunctionAsync("window.waitForPrintDialog");
```

这将等待点击按钮后打开打印对话框。
确保在点击按钮之前/页面加载完成后执行脚本。
