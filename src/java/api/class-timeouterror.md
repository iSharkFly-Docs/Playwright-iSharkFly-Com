---
title: TimeoutError
outline: 2
---

# TimeoutError

<Badge type="info" text="Added in: v1.8" />

Extends: [Error](./class-error)

* extends: [Error]

TimeoutError is emitted whenever certain operations are terminated due to timeout, e.g. [`locator.waitFor()`](/java/api/class-locator#locator-wait-for) or [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch).

```java
package org.example;

import com.microsoft.playwright.*;

public class TimeoutErrorExample {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      Browser browser = playwright.firefox().launch();
      BrowserContext context = browser.newContext();
      Page page = context.newPage();
      try {
        page.locator("text=Example").click(new Locator.ClickOptions().setTimeout(100));
      } catch (TimeoutError e) {
        System.out.println("Timeout!");
      }
    }
  }
}
```
