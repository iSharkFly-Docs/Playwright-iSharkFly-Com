---
title: PlaywrightException
outline: 2
---

# PlaywrightException

<Badge type="info" text="Added in: v1.10" />

Extends: [RuntimeException](./class-runtimeexception)

* extends: [RuntimeException]

PlaywrightException is thrown whenever certain operations are terminated abnormally, e.g.
browser closes while [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) is running.

```csharp
try
{
    await page.EvaluateAsync("() => new Promise(() => {})");
}
catch (PlaywrightException e)
{
    // When the page closes during the call, the exception message says so.
    Console.WriteLine(e.Message);
}
```
