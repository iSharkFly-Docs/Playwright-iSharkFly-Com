---
title: "Assertions"
---

# Assertions

## Introduction

Playwright includes web-specific assertions that automatically retry until the expected condition is met.  Consider the following example:

```java
assertThat(page.getByTestId("status")).hasText("Submitted");
```

Playwright will re-test the element with the test ID of `status` until it has the `"Submitted"` text.  It will re-fetch the element and check it repeatedly until the condition is met or the timeout is reached.

By default, the timeout for assertions is 5 seconds.

## Auto-retrying assertions

The following assertions will retry until the assertion passes or the assertion timeout is reached.

| Assertion | Description |
| :- | :- |
| [`locatorAssertions.isAttached()`](/java/api/class-locatorassertions#locator-assertions-to-be-attached) | Element is attached |
| [`locatorAssertions.isChecked()`](/java/api/class-locatorassertions#locator-assertions-to-be-checked) | Checkbox is checked |
| [`locatorAssertions.isDisabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-disabled) | Element is disabled |
| [`locatorAssertions.isEditable()`](/java/api/class-locatorassertions#locator-assertions-to-be-editable) | Element is editable |
| [`locatorAssertions.isEmpty()`](/java/api/class-locatorassertions#locator-assertions-to-be-empty) | Container is empty |
| [`locatorAssertions.isEnabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-enabled) | Element is enabled |
| [`locatorAssertions.isFocused()`](/java/api/class-locatorassertions#locator-assertions-to-be-focused) | Element is focused |
| [`locatorAssertions.isHidden()`](/java/api/class-locatorassertions#locator-assertions-to-be-hidden) | Element is not visible |
| [`locatorAssertions.isInViewport()`](/java/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | Element intersects viewport |
| [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible) | Element is visible |
| [`locatorAssertions.containsClass()`](/java/api/class-locatorassertions#locator-assertions-to-contain-class) | Element has specified CSS classes |
| [`locatorAssertions.containsText()`](/java/api/class-locatorassertions#locator-assertions-to-contain-text) | Element contains text |
| [`locatorAssertions.hasAccessibleDescription()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-description) | Element has a matching [accessible description](https://w3c.github.io/accname/#dfn-accessible-description) |
| [`locatorAssertions.hasAccessibleName()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-name) | Element has a matching [accessible name](https://w3c.github.io/accname/#dfn-accessible-name) |
| [`locatorAssertions.hasAttribute()`](/java/api/class-locatorassertions#locator-assertions-to-have-attribute) | Element has a DOM attribute |
| [`locatorAssertions.hasClass()`](/java/api/class-locatorassertions#locator-assertions-to-have-class) | Element has a class property |
| [`locatorAssertions.hasCount()`](/java/api/class-locatorassertions#locator-assertions-to-have-count) | List has exact number of children |
| [`locatorAssertions.hasCSS()`](/java/api/class-locatorassertions#locator-assertions-to-have-css) | Element has CSS property |
| [`locatorAssertions.hasId()`](/java/api/class-locatorassertions#locator-assertions-to-have-id) | Element has an ID |
| [`locatorAssertions.hasJSProperty()`](/java/api/class-locatorassertions#locator-assertions-to-have-js-property) | Element has a JavaScript property |
| [`locatorAssertions.hasRole()`](/java/api/class-locatorassertions#locator-assertions-to-have-role) | Element has a specific [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles) |
| [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) | Element matches text |
| [`locatorAssertions.hasValue()`](/java/api/class-locatorassertions#locator-assertions-to-have-value) | Input has a value |
| [`locatorAssertions.hasValues()`](/java/api/class-locatorassertions#locator-assertions-to-have-values) | Select has options selected |
| [`locatorAssertions.matchesAriaSnapshot()`](/java/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) | Element matches provided Aria snapshot |
| [`pageAssertions.hasTitle()`](/java/api/class-pageassertions#page-assertions-to-have-title) | Page has a title |
| [`pageAssertions.hasURL()`](/java/api/class-pageassertions#page-assertions-to-have-url) | Page has a URL |
| [`apiResponseAssertions.isOK()`](/java/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | Response has an OK status |

## Setting a custom timeout

You can specify a custom timeout for assertions either globally or per assertion. The default timeout is 5 seconds.

### Global timeout

```java
import com.microsoft.playwright.assertions.PlaywrightAssertions;

PlaywrightAssertions.setDefaultAssertionTimeout(10_000);
```

### Per assertion timeout

```java
import com.microsoft.playwright.assertions.LocatorAssertions;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

assertThat(page.getByText("Name")).isVisible(
    new LocatorAssertions.IsVisibleOptions().setTimeout(10_000));
```
