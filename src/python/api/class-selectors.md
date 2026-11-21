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

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    tag_selector = """
      {
          // Returns the first element matching given selector in the root's subtree.
          query(root, selector) {
              return root.querySelector(selector);
          },
          // Returns all elements matching given selector in the root's subtree.
          queryAll(root, selector) {
              return Array.from(root.querySelectorAll(selector));
          }
      }"""

    # Register the engine. Selectors will be prefixed with "tag=".
    await playwright.selectors.register("tag", tag_selector)
    browser = await playwright.chromium.launch()
    page = await browser.new_page()
    await page.set_content('<div><button>Click me</button></div>')

    # Use the selector prefixed with its name.
    button = await page.query_selector('tag=button')
    # Combine it with built-in locators.
    await page.locator('tag=div').get_by_text('Click me').click()
    # Can use it in any methods supporting selectors.
    button_count = await page.locator('tag=button').count()
    print(button_count)
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)

asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    tag_selector = """
      {
          // Returns the first element matching given selector in the root's subtree.
          query(root, selector) {
              return root.querySelector(selector);
          },
          // Returns all elements matching given selector in the root's subtree.
          queryAll(root, selector) {
              return Array.from(root.querySelectorAll(selector));
          }
      }"""

    # Register the engine. Selectors will be prefixed with "tag=".
    playwright.selectors.register("tag", tag_selector)
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.set_content('<div><button>Click me</button></div>')

    # Use the selector prefixed with its name.
    button = page.locator('tag=button')
    # Combine it with built-in locators.
    page.locator('tag=div').get_by_text('Click me').click()
    # Can use it in any methods supporting selectors.
    button_count = page.locator('tag=button').count()
    print(button_count)
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

:::

**Arguments**

- <a id="selectors-register-option-name"></a>`name` `string`

  Name that is used in selectors as a prefix, e.g. `{name: 'foo'}` enables `foo=myselectorbody` selectors. May only
  contain `[a-zA-Z0-9_]` characters.
- <a id="selectors-register-option-script"></a>`script` `string` *(optional)*

  Raw script content.
- <a id="selectors-register-option-options"></a>`options` `Object` *(optional)*

  - <a id="selectors-register-option-content-script"></a>`content_script` `boolean` *(optional)*

    Whether to run this selector engine in isolated JavaScript environment. This environment has access to the same DOM, but
    not any JavaScript objects from the frame's scripts. Defaults to `false`. Note that running as a content script is not
    guaranteed when this engine is used together with other registered engines.
  - <a id="selectors-register-option-path"></a>`path` `path` *(optional)*

    Path to the JavaScript file. If `path` is a relative path, then it is resolved relative to the current working directory.


### selectors.set_test_id_attribute() {#selectors-set-test-id-attribute}

<Badge type="info" text="Added in: v1.27" />

Defines custom attribute name to be used in [`page.get_by_test_id()`](/python/api/class-page#page-get-by-test-id). `data-testid` is used by default.

**Arguments**

- <a id="selectors-set-test-id-attribute-option-attribute-name"></a>`attribute_name` `string`

  Test id attribute name. To match elements with any of several attributes, pass them as a
  comma-separated list, e.g. `"data-pw,data-ti"`.

