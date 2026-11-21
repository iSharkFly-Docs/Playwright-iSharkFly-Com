---
title: "Assertions"
---

# Assertions

## Introduction

Playwright includes web-specific assertions that automatically retry until the expected condition is met.  Consider the following example:

```python
expect(page.get_by_test_id("status")).to_have_text("Submitted")
```

Playwright will re-test the element with the test ID of `status` until it has the `"Submitted"` text.  It will re-fetch the element and check it repeatedly until the condition is met or the timeout is reached.

By default, the timeout for assertions is 5 seconds.

## Auto-retrying assertions

The following assertions will retry until the assertion passes or the assertion timeout is reached.

| Assertion | Description |
| :- | :- |
| [`locator_assertions.to_be_attached()`](/python/api/class-locatorassertions#locator-assertions-to-be-attached) | Element is attached |
| [`locator_assertions.to_be_checked()`](/python/api/class-locatorassertions#locator-assertions-to-be-checked) | Checkbox is checked |
| [`locator_assertions.to_be_disabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-disabled) | Element is disabled |
| [`locator_assertions.to_be_editable()`](/python/api/class-locatorassertions#locator-assertions-to-be-editable) | Element is editable |
| [`locator_assertions.to_be_empty()`](/python/api/class-locatorassertions#locator-assertions-to-be-empty) | Container is empty |
| [`locator_assertions.to_be_enabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-enabled) | Element is enabled |
| [`locator_assertions.to_be_focused()`](/python/api/class-locatorassertions#locator-assertions-to-be-focused) | Element is focused |
| [`locator_assertions.to_be_hidden()`](/python/api/class-locatorassertions#locator-assertions-to-be-hidden) | Element is not visible |
| [`locator_assertions.to_be_in_viewport()`](/python/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | Element intersects viewport |
| [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible) | Element is visible |
| [`locator_assertions.to_contain_class()`](/python/api/class-locatorassertions#locator-assertions-to-contain-class) | Element has specified CSS classes |
| [`locator_assertions.to_contain_text()`](/python/api/class-locatorassertions#locator-assertions-to-contain-text) | Element contains text |
| [`locator_assertions.to_have_accessible_description()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-description) | Element has a matching [accessible description](https://w3c.github.io/accname/#dfn-accessible-description) |
| [`locator_assertions.to_have_accessible_name()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-name) | Element has a matching [accessible name](https://w3c.github.io/accname/#dfn-accessible-name) |
| [`locator_assertions.to_have_attribute()`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute) | Element has a DOM attribute |
| [`locator_assertions.to_have_class()`](/python/api/class-locatorassertions#locator-assertions-to-have-class) | Element has a class property |
| [`locator_assertions.to_have_count()`](/python/api/class-locatorassertions#locator-assertions-to-have-count) | List has exact number of children |
| [`locator_assertions.to_have_css()`](/python/api/class-locatorassertions#locator-assertions-to-have-css) | Element has CSS property |
| [`locator_assertions.to_have_id()`](/python/api/class-locatorassertions#locator-assertions-to-have-id) | Element has an ID |
| [`locator_assertions.to_have_js_property()`](/python/api/class-locatorassertions#locator-assertions-to-have-js-property) | Element has a JavaScript property |
| [`locator_assertions.to_have_role()`](/python/api/class-locatorassertions#locator-assertions-to-have-role) | Element has a specific [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles) |
| [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) | Element matches text |
| [`locator_assertions.to_have_value()`](/python/api/class-locatorassertions#locator-assertions-to-have-value) | Input has a value |
| [`locator_assertions.to_have_values()`](/python/api/class-locatorassertions#locator-assertions-to-have-values) | Select has options selected |
| [`locator_assertions.to_match_aria_snapshot()`](/python/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) | Element matches provided Aria snapshot |
| [`page_assertions.to_have_title()`](/python/api/class-pageassertions#page-assertions-to-have-title) | Page has a title |
| [`page_assertions.to_have_url()`](/python/api/class-pageassertions#page-assertions-to-have-url) | Page has a URL |
| [`api_response_assertions.to_be_ok()`](/python/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | Response has an OK status |

## Soft assertions

By default, failed assertion will terminate test execution. Playwright also
supports *soft assertions*: failed soft assertions **do not** terminate test
execution, but mark the test as failed.

```python
# Make a few checks that will not stop the test when failed...
expect.soft(page.get_by_test_id("status")).to_have_text("Success")
expect.soft(page.get_by_test_id("eta")).to_have_text("1 day")

# ... and continue the test to check more things.
page.get_by_role("link", name="next page").click()
expect.soft(page.get_by_role("heading", name="Make another order")).to_be_visible()
```

Note that soft assertions only work with the
[`pytest-playwright`](https://pypi.org/project/pytest-playwright/) (or
[`pytest-playwright-asyncio`](https://pypi.org/project/pytest-playwright-asyncio/))
plugin, version `0.8.0` or newer.

## Custom Expect Message

You can specify a custom expect message as a second argument to the `expect` function, for example:

```python
expect(page.get_by_text("Name"), "should be logged in").to_be_visible()
```

When expect fails, the error would look like this:

```bash
    def test_foobar(page: Page) -> None:
>       expect(page.get_by_text("Name"), "should be logged in").to_be_visible()
E       AssertionError: should be logged in
E       Actual value: None
E       Call log:
E       LocatorAssertions.to_be_visible with timeout 5000ms
E       waiting for get_by_text("Name")
E       waiting for get_by_text("Name")

tests/test_foobar.py:22: AssertionError
```

## Setting a custom timeout

You can specify a custom timeout for assertions either globally or per assertion. The default timeout is 5 seconds.

### Global timeout

::: code-group

```python [conftest.py]
from playwright.sync_api import expect

expect.set_options(timeout=10_000)
```

:::

### Per assertion timeout

::: code-group

```python [test_foobar.py]
from playwright.sync_api import expect

def test_foobar(page: Page) -> None:
    expect(page.get_by_text("Name")).to_be_visible(timeout=10_000)
```

:::
