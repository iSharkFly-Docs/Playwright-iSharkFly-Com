---
title: PlaywrightAssertionException
outline: 2
---

# PlaywrightAssertionException

<Badge type="info" text="Added in: v1.65" />

Extends: [PlaywrightException](./class-playwrightexception)

* extends: [PlaywrightException](/dotnet/api/class-playwrightexception)

PlaywrightAssertionException is thrown when an [assertion](../test-assertions.md) is not met, e.g. [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) times out
waiting for the element. It inherits from
[PlaywrightException](/dotnet/api/class-playwrightexception), so `catch (PlaywrightException)` blocks catch it as well.

```csharp
try
{
    await Expect(page.GetByRole(AriaRole.Button)).ToBeVisibleAsync();
}
catch (PlaywrightAssertionException e)
{
    Console.WriteLine($"Assertion failed: {e.Message}");
}
```
