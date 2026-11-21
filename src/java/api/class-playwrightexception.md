---
title: PlaywrightException
outline: 2
---

# PlaywrightException

<Badge type="info" text="Added in: v1.10" />

Extends: [RuntimeException](./class-runtimeexception)

* extends: [RuntimeException]

PlaywrightException is thrown whenever certain operations are terminated abnormally, e.g.
browser closes while [`page.evaluate()`](/java/api/class-page#page-evaluate) is running.

```java
try {
  page.evaluate("() => new Promise(() => {})");
} catch (PlaywrightException e) {
  // When the page closes during the call, the exception message says so.
  System.out.println(e.getMessage());
}
```
