---
title: "Dialogs"
---

# Dialogs

## Introduction

Playwright can interact with the web page dialogs such as [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) as well as [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) confirmation. For print dialogs, see [Print](#print-dialogs).

## alert(), confirm(), prompt() dialogs

By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them. However, you can register a dialog handler before the action that triggers the dialog to either [`dialog.accept()`](/java/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/java/api/class-dialog#dialog-dismiss) it.

```java
page.onDialog(dialog -> dialog.accept());
page.getByRole(AriaRole.BUTTON).click();
```

::: info
[`page.onDialog()`](/java/api/class-page#page-event-dialog) listener **must handle** the dialog. Otherwise your action will stall, be it [`locator.click()`](/java/api/class-locator#locator-click) or something else. That's because dialogs in Web are modals and therefore block further page execution until they are handled.
:::

As a result, the following snippet will never resolve:

::: warning
WRONG!
:::

```java
page.onDialog(dialog -> System.out.println(dialog.message()));
page.getByRole(AriaRole.BUTTON).click(); // Will hang here
```

::: info
If there is no listener for [`page.onDialog()`](/java/api/class-page#page-event-dialog), all dialogs are automatically dismissed.
:::

## beforeunload dialog

When [`page.close()`](/java/api/class-page#page-close) is invoked with the truthy [`runBeforeUnload`](/java/api/class-page#page-close-option-run-before-unload) value, the page runs its unload handlers. This is the only case when [`page.close()`](/java/api/class-page#page-close) does not wait for the page to actually close, because it might be that the page stays open in the end of the operation.

You can register a dialog handler to handle the `beforeunload` dialog yourself:

```java
page.onDialog(dialog -> {
  assertEquals("beforeunload", dialog.type());
  dialog.dismiss();
});
page.close(new Page.CloseOptions().setRunBeforeUnload(true));
```

## Print dialogs

In order to assert that a print dialog via [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) was triggered, you can use the following snippet:

```java
page.navigate("<url>");

page.evaluate("(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()");
page.getByText("Print it!").click();

page.waitForFunction("window.waitForPrintDialog");
```

This will wait for the print dialog to be opened after the button is clicked.
Make sure to evaluate the script before clicking the button / after the page is loaded.
