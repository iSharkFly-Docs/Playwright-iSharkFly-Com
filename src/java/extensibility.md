---
title: "Extensibility"
---

# Extensibility

## Custom selector engines

Playwright supports custom selector engines, registered with [`selectors.register()`](/java/api/class-selectors#selectors-register).

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

```java
// Must be a script that evaluates to a selector engine instance.  The script is evaluated in the page context.
String createTagNameEngine = "{\n" +
  "  // Returns the first element matching given selector in the root's subtree.\n" +
  "  query(root, selector) {\n" +
  "    return root.querySelector(selector);\n" +
  "  },\n" +
  "\n" +
  "  // Returns all elements matching given selector in the root's subtree.\n" +
  "  queryAll(root, selector) {\n" +
  "    return Array.from(root.querySelectorAll(selector));\n" +
  "  }\n" +
  "}";

// Register the engine. Selectors will be prefixed with "tag=".
playwright.selectors().register("tag", createTagNameEngine);

// Now we can use "tag=" selectors.
Locator button = page.locator("tag=button");
button.click();

// We can combine it with built-in locators.
page.locator("tag=div").getByText("Click me").click();

// We can use it in any methods supporting selectors.
int buttonCount = (int) page.locator("tag=button").count();
```
