---
title: Dialog
outline: 2
---

# Dialog

<Badge type="info" text="Added in: v1.8" />

[Dialog](/api/class-dialog) 对象通过 [`page.on('dialog')`](/api/class-page#page-event-dialog) 事件由页面派发。

使用 `Dialog` 类的示例：

```js
const { chromium } = require('playwright');  // 或 'firefox' 或 'webkit'。

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
对话框会自动关闭，除非有 [`page.on('dialog')`](/api/class-page#page-event-dialog) 监听器。
当存在监听器时，它**必须**调用 [`dialog.accept()`](/api/class-dialog#dialog-accept) 或 [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) 对话框 - 否则页面将[冻结](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking)等待对话框，点击等操作将永远不会完成。
:::

## Methods

### dialog.accept() {#dialog-accept}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

当对话框被接受时返回。

**Arguments**

- <a id="dialog-accept-option-prompt-text"></a>`promptText` `string` *(optional)*

  要在提示框中输入的文本。如果对话框的 `type` 不是 prompt，则不会产生任何效果。可选。


### dialog.defaultValue() {#dialog-default-value}

<Badge type="info" text="Added in: v1.8" />

如果对话框是 prompt，返回默认提示值。否则，返回空字符串。

**Returns**

- `string`


### dialog.dismiss() {#dialog-dismiss}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

当对话框被关闭时返回。


### dialog.message() {#dialog-message}

<Badge type="info" text="Added in: v1.8" />

对话框中显示的消息。

**Returns**

- `string`


### dialog.page() {#dialog-page}

<Badge type="info" text="Added in: v1.34" />

发起此对话框的页面（如果有）。

**Returns**

- `null | Page`


### dialog.type() {#dialog-type}

<Badge type="info" text="Added in: v1.8" />

返回对话框的类型，可以是 `alert`、`beforeunload`、`confirm` 或 `prompt` 之一。

**Returns**

- `string`
