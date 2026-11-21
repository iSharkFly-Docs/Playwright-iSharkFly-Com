---
title: TimeoutError
outline: 2
---

# TimeoutError

<Badge type="info" text="Added in: v1.8" />

继承自: [Error](./class-error)

* extends: [Error]

当某些操作因超时而终止时会发出 TimeoutError，例如 [`locator.waitFor()`](/api/class-locator#locator-wait-for) 或 [`browserType.launch()`](/api/class-browsertype#browser-type-launch)。

```js
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.locator('text=Foo').click({
      timeout: 100,
    });
  } catch (error) {
    if (error instanceof playwright.errors.TimeoutError)
      console.log('超时！');
  }
  await browser.close();
})();
```
