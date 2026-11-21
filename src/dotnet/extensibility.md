---
title: "Extensibility"
---

# Extensibility

## Custom selector engines

Playwright supports custom selector engines, registered with [`Selectors.RegisterAsync()`](/dotnet/api/class-selectors#selectors-register).

Selector engine should have the following properties:
- `query` function to query first element matching `selector` relative to the `root`.
- `queryAll` function to query all elements matching `selector` relative to the `root`.

By default the engine is run directly in the frame's JavaScript context and, for example, can call an
application-defined function. To isolate the engine from any JavaScript in the frame, but leave access to the DOM,
register the engine with `{contentScript: true}` option. Content script engine is safer because it is protected from any
tampering with the global objects, for example altering `Node.prototype` methods. All built-in selector engines run as
content scripts. Note that running as a content script is not guaranteed when the engine is used together with other
custom engines.

Selectors must be registered before creating the page.

An example of registering selector engine that queries elements based on a tag name:

```csharp
// Register the engine. Selectors will be prefixed with "tag=".
// The script is evaluated in the page context.
await playwright.Selectors.RegisterAsync("tag", new() {
  Script = @"
  // Must evaluate to a selector engine instance.
  {
    // Returns the first element matching given selector in the root's subtree.
    query(root, selector) {
      return root.querySelector(selector);
    },

    // Returns all elements matching given selector in the root's subtree.
    queryAll(root, selector) {
      return Array.from(root.querySelectorAll(selector));
    }
  }"
});

// Now we can use "tag=" selectors.
await page.Locator("tag=button").ClickAsync();

// We can combine it with built-in locators.
await page.Locator("tag=div").GetByText("Click me").ClickAsync();
```
