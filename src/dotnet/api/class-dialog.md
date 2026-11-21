---
title: Dialog
outline: 2
---

# Dialog

<Badge type="info" text="Added in: v1.8" />

[Dialog](/dotnet/api/class-dialog) objects are dispatched by page via the [`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) event.

An example of using `Dialog` class:

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class DialogExample
{
    public static async Task Run()
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync();
        var page = await browser.NewPageAsync();

        page.Dialog += async (_, dialog) =>
        {
            System.Console.WriteLine(dialog.Message);
            await dialog.DismissAsync();
        };

        await page.EvaluateAsync("alert('1');");
    }
}
```

::: info
Dialogs are dismissed automatically, unless there is a [`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) listener.
When listener is present, it **must** either [`Dialog.AcceptAsync()`](/dotnet/api/class-dialog#dialog-accept) or [`Dialog.DismissAsync()`](/dotnet/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.
:::

## Methods

### Dialog.AcceptAsync() {#dialog-accept}

<Badge type="info" text="Added in: v1.8" />

Returns when the dialog has been accepted.

**Arguments**

- <a id="dialog-accept-option-prompt-text"></a>`promptText` `string` *(optional)*

  A text to enter in prompt. Does not cause any effects if the dialog's `type` is not prompt. Optional.


### Dialog.DefaultValue() {#dialog-default-value}

<Badge type="info" text="Added in: v1.8" />

If dialog is prompt, returns default prompt value. Otherwise, returns empty string.

**Returns**

- `string`


### Dialog.DismissAsync() {#dialog-dismiss}

<Badge type="info" text="Added in: v1.8" />

Returns when the dialog has been dismissed.


### Dialog.Message() {#dialog-message}

<Badge type="info" text="Added in: v1.8" />

A message displayed in the dialog.

**Returns**

- `string`


### Dialog.Page() {#dialog-page}

<Badge type="info" text="Added in: v1.34" />

The page that initiated this dialog, if available.

**Returns**

- `null | Page`


### Dialog.Type() {#dialog-type}

<Badge type="info" text="Added in: v1.8" />

Returns dialog's type, can be one of `alert`, `beforeunload`, `confirm` or `prompt`.

**Returns**

- `string`

