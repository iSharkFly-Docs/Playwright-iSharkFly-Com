---
title: Selectors
outline: 2
---

# Selectors

<Badge type="info" text="Added in: v1.8" />

Selectors can be used to install custom selector engines. See [extensibility](../extensibility.md) for more
information.

## Methods

### Selectors.RegisterAsync() {#selectors-register}

<Badge type="info" text="Added in: v1.8" />

Selectors must be registered before creating the page.

**Usage**

An example of registering selector engine that queries elements based on a tag name:

```csharp
using Microsoft.Playwright;

using var playwright = await Playwright.CreateAsync();
// Script that evaluates to a selector engine instance. The script is evaluated in the page context.
await playwright.Selectors.RegisterAsync("tag", new()
{
    Script = @"{
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

await using var browser = await playwright.Chromium.LaunchAsync();
var page = await browser.NewPageAsync();
await page.SetContentAsync("<div><button>Click me</button></div>");
// Use the selector prefixed with its name.
var button = page.Locator("tag=button");
// Combine it with built-in locators.
await page.Locator("tag=div").GetByText("Click me").ClickAsync();
// Can use it in any methods supporting selectors.
int buttonCount = await page.Locator("tag=button").CountAsync();
```

**Arguments**

- <a id="selectors-register-option-name"></a>`name` `string`

  Name that is used in selectors as a prefix, e.g. `{name: 'foo'}` enables `foo=myselectorbody` selectors. May only
  contain `[a-zA-Z0-9_]` characters.
- <a id="selectors-register-option-options"></a>`options` `Object` *(optional)*

  - <a id="selectors-register-option-content-script"></a>`contentScript` `boolean` *(optional)*

    Whether to run this selector engine in isolated JavaScript environment. This environment has access to the same DOM, but
    not any JavaScript objects from the frame's scripts. Defaults to `false`. Note that running as a content script is not
    guaranteed when this engine is used together with other registered engines.
  - <a id="selectors-register-option-path"></a>`path` `path` *(optional)*

    Script that evaluates to a selector engine instance. The script is evaluated in the page context.
  - <a id="selectors-register-option-script"></a>`script` `string` *(optional)*

    Script that evaluates to a selector engine instance. The script is evaluated in the page context.


### Selectors.SetTestIdAttribute() {#selectors-set-test-id-attribute}

<Badge type="info" text="Added in: v1.27" />

Defines custom attribute name to be used in [`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id). `data-testid` is used by default.

**Arguments**

- <a id="selectors-set-test-id-attribute-option-attribute-name"></a>`attributeName` `string`

  Test id attribute name. To match elements with any of several attributes, pass them as a
  comma-separated list, e.g. `"data-pw,data-ti"`.

