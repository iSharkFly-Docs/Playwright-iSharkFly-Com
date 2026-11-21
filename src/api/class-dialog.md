---
title: Dialog
outline: 2
---

# Dialog

<Badge type="info" text="Added in: v1.8" />

[Dialog](/api/class-dialog) objects are dispatched by page via the [`page.on('dialog')`](/api/class-page#page-event-dialog) event.

An example of using `Dialog` class:

```js
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();
  });
  await page.evaluate(() => alert('1'));
  await browser.close();
})();
```

::: info
Dialogs are dismissed automatically, unless there is a [`page.on('dialog')`](/api/class-page#page-event-dialog) listener.
When listener is present, it **must** either [`dialog.accept()`](/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.
:::

## Methods

### dialog.accept() {#dialog-accept}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns when the dialog has been accepted.

**Arguments**

- <a id="dialog-accept-option-prompt-text"></a>`promptText` `string` *(optional)*

  A text to enter in prompt. Does not cause any effects if the dialog's `type` is not prompt. Optional.


### dialog.defaultValue() {#dialog-default-value}

<Badge type="info" text="Added in: v1.8" />

If dialog is prompt, returns default prompt value. Otherwise, returns empty string.

**Returns**

- `string`


### dialog.dismiss() {#dialog-dismiss}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

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

