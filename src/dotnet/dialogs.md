---
title: "Dialogs"
---

# Dialogs

## Introduction

Playwright can interact with the web page dialogs such as [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) as well as [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) confirmation. For print dialogs, see [Print](#print-dialogs).

## alert(), confirm(), prompt() dialogs

By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them. However, you can register a dialog handler before the action that triggers the dialog to either [`Dialog.AcceptAsync()`](/dotnet/api/class-dialog#dialog-accept) or [`Dialog.DismissAsync()`](/dotnet/api/class-dialog#dialog-dismiss) it.

```csharp
Page.Dialog += async (_, dialog) =>
{
    await dialog.AcceptAsync();
};
await Page.GetByRole(AriaRole.Button).ClickAsync();
```

::: info
[`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) listener **must handle** the dialog. Otherwise your action will stall, be it [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) or something else. That's because dialogs in Web are modals and therefore block further page execution until they are handled.
:::

As a result, the following snippet will never resolve:

::: warning
WRONG!
:::

```csharp
page.Dialog += (_, dialog) => Console.WriteLine(dialog.Message);
await page.GetByRole(AriaRole.Button).ClickAsync(); // Will hang here
```

::: info
If there is no listener for [`Page.Dialog`](/dotnet/api/class-page#page-event-dialog), all dialogs are automatically dismissed.
:::

## beforeunload dialog

When [`Page.CloseAsync()`](/dotnet/api/class-page#page-close) is invoked with the truthy [`runBeforeUnload`](/dotnet/api/class-page#page-close-option-run-before-unload) value, the page runs its unload handlers. This is the only case when [`Page.CloseAsync()`](/dotnet/api/class-page#page-close) does not wait for the page to actually close, because it might be that the page stays open in the end of the operation.

You can register a dialog handler to handle the `beforeunload` dialog yourself:

```csharp
Page.Dialog += async (_, dialog) =>
{
    Assert.AreEqual("beforeunload", dialog.Type);
    await dialog.DismissAsync();
};
await Page.CloseAsync(new() { RunBeforeUnload = true });
```

## Print dialogs

In order to assert that a print dialog via [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) was triggered, you can use the following snippet:

```csharp
await Page.GotoAsync("<url>");

await Page.EvaluateAsync("(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()");
await Page.GetByText("Print it!").ClickAsync();

await Page.WaitForFunctionAsync("window.waitForPrintDialog");
```

This will wait for the print dialog to be opened after the button is clicked.
Make sure to evaluate the script before clicking the button / after the page is loaded.
