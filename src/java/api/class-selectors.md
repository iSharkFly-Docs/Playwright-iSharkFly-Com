---
title: Selectors
outline: 2
---

# Selectors

<Badge type="info" text="Added in: v1.8" />

Selectors can be used to install custom selector engines. See [extensibility](../extensibility.md) for more
information.

## Methods

### selectors.register() {#selectors-register}

<Badge type="info" text="Added in: v1.8" />

Selectors must be registered before creating the page.

**Usage**

An example of registering selector engine that queries elements based on a tag name:

```java
// Script that evaluates to a selector engine instance. The script is evaluated in the page context.
String createTagNameEngine = "{\n" +
  "  // Returns the first element matching given selector in the root's subtree.\n" +
  "  query(root, selector) {\n" +
  "    return root.querySelector(selector);\n" +
  "  },\n" +
  "  // Returns all elements matching given selector in the root's subtree.\n" +
  "  queryAll(root, selector) {\n" +
  "    return Array.from(root.querySelectorAll(selector));\n" +
  "  }\n" +
  "}";
// Register the engine. Selectors will be prefixed with "tag=".
playwright.selectors().register("tag", createTagNameEngine);
Browser browser = playwright.firefox().launch();
Page page = browser.newPage();
page.setContent("<div><button>Click me</button></div>");
// Use the selector prefixed with its name.
Locator button = page.locator("tag=button");
// Combine it with built-in locators.
page.locator("tag=div").getByText("Click me").click();
// Can use it in any methods supporting selectors.
int buttonCount = (int) page.locator("tag=button").count();
browser.close();
```

**Arguments**

- <a id="selectors-register-option-name"></a>`name` `string`

  Name that is used in selectors as a prefix, e.g. `{name: 'foo'}` enables `foo=myselectorbody` selectors. May only
  contain `[a-zA-Z0-9_]` characters.
- <a id="selectors-register-option-script"></a>`script` `string | path`

  Script that evaluates to a selector engine instance. The script is evaluated in the page context.
- <a id="selectors-register-option-options"></a>`options` `Object` *(optional)*

  - <a id="selectors-register-option-content-script"></a>`contentScript` `boolean` *(optional)*

    Whether to run this selector engine in isolated JavaScript environment. This environment has access to the same DOM, but
    not any JavaScript objects from the frame's scripts. Defaults to `false`. Note that running as a content script is not
    guaranteed when this engine is used together with other registered engines.


### selectors.setTestIdAttribute() {#selectors-set-test-id-attribute}

<Badge type="info" text="Added in: v1.27" />

Defines custom attribute name to be used in [`page.getByTestId()`](/java/api/class-page#page-get-by-test-id). `data-testid` is used by default.

**Arguments**

- <a id="selectors-set-test-id-attribute-option-attribute-name"></a>`attributeName` `string`

  Test id attribute name. To match elements with any of several attributes, pass them as a
  comma-separated list, e.g. `"data-pw,data-ti"`.

