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

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Selectors must be registered before creating the page.

**Usage**

An example of registering selector engine that queries elements based on a tag name:

```js
const { selectors, firefox } = require('@playwright/test');  // Or 'chromium' or 'webkit'.

(async () => {
  // Must be a function that evaluates to a selector engine instance.
  const createTagNameEngine = () => ({
    // Returns the first element matching given selector in the root's subtree.
    query(root, selector) {
      return root.querySelector(selector);
    },

    // Returns all elements matching given selector in the root's subtree.
    queryAll(root, selector) {
      return Array.from(root.querySelectorAll(selector));
    }
  });

  // Register the engine. Selectors will be prefixed with "tag=".
  await selectors.register('tag', createTagNameEngine);

  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.setContent(`<div><button>Click me</button></div>`);

  // Use the selector prefixed with its name.
  const button = page.locator('tag=button');
  // We can combine it with built-in locators.
  await page.locator('tag=div').getByText('Click me').click();
  // Can use it in any methods supporting selectors.
  const buttonCount = await page.locator('tag=button').count();

  await browser.close();
})();
```

**Arguments**

- <a id="selectors-register-option-name"></a>`name` `string`

  Name that is used in selectors as a prefix, e.g. `{name: 'foo'}` enables `foo=myselectorbody` selectors. May only
  contain `[a-zA-Z0-9_]` characters.
- <a id="selectors-register-option-script"></a>`script` `function() | string | Object`

  Script that evaluates to a selector engine instance. The script is evaluated in the page context.

  - `path` `path` *(optional)*

    Path to the JavaScript file. If `path` is a relative path, then it is resolved relative to the
    current working directory. Optional.
  - `content` `string` *(optional)*

    Raw script content. Optional.
- <a id="selectors-register-option-options"></a>`options` `Object` *(optional)*

  - <a id="selectors-register-option-content-script"></a>`contentScript` `boolean` *(optional)*

    Whether to run this selector engine in isolated JavaScript environment. This environment has access to the same DOM, but
    not any JavaScript objects from the frame's scripts. Defaults to `false`. Note that running as a content script is not
    guaranteed when this engine is used together with other registered engines.


### selectors.setTestIdAttribute() {#selectors-set-test-id-attribute}

<Badge type="info" text="Added in: v1.27" />

Defines custom attribute name to be used in [`page.getByTestId()`](/api/class-page#page-get-by-test-id). `data-testid` is used by default.

**Arguments**

- <a id="selectors-set-test-id-attribute-option-attribute-name"></a>`attributeName` `string`

  Test id attribute name. To match elements with any of several attributes, pass them as a
  comma-separated list, e.g. `"data-pw,data-ti"`.

