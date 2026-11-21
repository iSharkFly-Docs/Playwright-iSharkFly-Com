---
title: LocatorAssertions
outline: 2
---

# LocatorAssertions

<Badge type="info" text="Added in: v1.17" />

The [LocatorAssertions](/dotnet/api/class-locatorassertions) class provides assertion methods that can be used to make assertions about the [Locator](/dotnet/api/class-locator) state in the tests.

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTests : PageTest
{
    [TestMethod]
    public async Task StatusBecomesSubmitted()
    {
        // ...
        await Page.GetByRole(AriaRole.Button, new() { Name = "Sign In" }).ClickAsync();
        await Expect(Page.Locator(".status")).ToHaveTextAsync("Submitted");
    }
}
```

## Methods

### LocatorAssertions.ToBeAttachedAsync() {#locator-assertions-to-be-attached}

<Badge type="info" text="Added in: v1.33" />

Ensures that [Locator](/dotnet/api/class-locator) points to an element that is [connected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected) to a Document or a ShadowRoot.

**Usage**

```csharp
await Expect(Page.GetByText("Hidden text")).ToBeAttachedAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-attached-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-attached-option-attached"></a>`attached` `boolean` *(optional)*
  - <a id="locator-assertions-to-be-attached-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeCheckedAsync() {#locator-assertions-to-be-checked}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to a checked input.

**Usage**

```csharp
var locator = Page.GetByLabel("Subscribe to newsletter");
await Expect(locator).ToBeCheckedAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-checked-option-checked"></a>`checked` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Provides state to assert for. Asserts for input to be checked by default.
    This option can't be used when [`indeterminate`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-checked-option-indeterminate) is set to true.
  - <a id="locator-assertions-to-be-checked-option-indeterminate"></a>`indeterminate` `boolean` *(optional)* <Badge type="info" text="Added in: v1.50" />

    Asserts that the element is in the indeterminate (mixed) state. Only supported for checkboxes and radio buttons.
    This option can't be true when [`checked`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-checked-option-checked) is provided.
  - <a id="locator-assertions-to-be-checked-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeDisabledAsync() {#locator-assertions-to-be-disabled}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to a disabled element. Element is disabled if it has "disabled" attribute
or is disabled via ['aria-disabled'](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).
Note that only native control elements such as HTML `button`, `input`, `select`, `textarea`, `option`, `optgroup`
can be disabled by setting "disabled" attribute. "disabled" attribute on other elements is ignored
by the browser.

**Usage**

```csharp
var locator = Page.Locator("button.submit");
await Expect(locator).ToBeDisabledAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-disabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeEditableAsync() {#locator-assertions-to-be-editable}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an editable element.

**Usage**

```csharp
var locator = Page.GetByRole(AriaRole.Textbox);
await Expect(locator).ToBeEditableAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-editable-option-editable"></a>`editable` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-editable-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeEmptyAsync() {#locator-assertions-to-be-empty}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an empty editable element or to a DOM node that has no text.

**Usage**

```csharp
var locator = Page.Locator("div.warning");
await Expect(locator).ToBeEmptyAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-empty-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-empty-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeEnabledAsync() {#locator-assertions-to-be-enabled}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an enabled element.

**Usage**

```csharp
var locator = Page.Locator("button.submit");
await Expect(locator).ToBeEnabledAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-enabled-option-enabled"></a>`enabled` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-enabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeFocusedAsync() {#locator-assertions-to-be-focused}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to a focused DOM node.

**Usage**

```csharp
var locator = Page.GetByRole(AriaRole.Textbox);
await Expect(locator).ToBeFocusedAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-focused-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-focused-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeHiddenAsync() {#locator-assertions-to-be-hidden}

<Badge type="info" text="Added in: v1.20" />

Ensures that [Locator](/dotnet/api/class-locator) either does not resolve to any DOM node, or resolves to a [non-visible](../actionability.md#visible) one.

**Usage**

```csharp
var locator = Page.Locator(".my-element");
await Expect(locator).ToBeHiddenAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-hidden-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeInViewportAsync() {#locator-assertions-to-be-in-viewport}

<Badge type="info" text="Added in: v1.31" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element that intersects viewport, according to the [intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

**Usage**

```csharp
var locator = Page.GetByRole(AriaRole.Button);
// Make sure at least some part of element intersects viewport.
await Expect(locator).ToBeInViewportAsync();
// Make sure element is fully outside of viewport.
await Expect(locator).Not.ToBeInViewportAsync();
// Make sure that at least half of the element intersects viewport.
await Expect(locator).ToBeInViewportAsync(new() { Ratio = 0.5 });
```

**Arguments**

- <a id="locator-assertions-to-be-in-viewport-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-in-viewport-option-ratio"></a>`ratio` `float` *(optional)*

    The minimal ratio of the element to intersect viewport. If equals to `0`, then
    element should intersect viewport at any positive ratio. Defaults to `0`.
  - <a id="locator-assertions-to-be-in-viewport-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToBeVisibleAsync() {#locator-assertions-to-be-visible}

<Badge type="info" text="Added in: v1.20" />

Ensures that [Locator](/dotnet/api/class-locator) points to an attached and [visible](../actionability.md#visible) DOM node.

To check that at least one element from the list is visible, use [`Locator.First()`](/dotnet/api/class-locator#locator-first).

**Usage**

```csharp
// A specific element is visible.
await Expect(Page.GetByText("Welcome")).ToBeVisibleAsync();

// At least one item in the list is visible.
await Expect(Page.GetByTestId("todo-item").First).ToBeVisibleAsync();

// At least one of the two elements is visible, possibly both.
await Expect(
  Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" })
    .Or(Page.GetByRole(AriaRole.Button, new() { Name = "Sign up" }))
    .First
).ToBeVisibleAsync();
```

**Arguments**

- <a id="locator-assertions-to-be-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-visible-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-to-be-visible-option-visible"></a>`visible` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />


### LocatorAssertions.ToContainClassAsync() {#locator-assertions-to-contain-class}

<Badge type="info" text="Added in: v1.52" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with given CSS classes. All classes from the asserted value, separated by spaces, must be present in the [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) in any order.

**Usage**

```html
<div class='middle selected row' id='component'></div>
```

```csharp
var locator = Page.Locator("#component");
await Expect(locator).ToContainClassAsync("middle selected row");
await Expect(locator).ToContainClassAsync("selected");
await Expect(locator).ToContainClassAsync("row middle");
```

When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class lists. Each element's class attribute is matched against the corresponding class in the array:

```html
<div class='list'>
  <div class='component inactive'></div>
  <div class='component active'></div>
  <div class='component inactive'></div>
</div>
```

```csharp
var locator = Page.Locator(".list > .component");
await Expect(locator).ToContainClassAsync(new string[]{"inactive", "active", "inactive"});
```

**Arguments**

- <a id="locator-assertions-to-contain-class-option-expected"></a>`expected` `string | Array<string>`

  A string containing expected class names, separated by spaces, or a list of such strings to assert multiple elements.
- <a id="locator-assertions-to-contain-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-contain-class-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToContainTextAsync() {#locator-assertions-to-contain-text}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element that contains the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.

**Details**

When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and
in the expected string before matching. When regular expression is used, the actual text is matched as is.

**Usage**

```csharp
var locator = Page.Locator(".title");
await Expect(locator).ToContainTextAsync("substring");
await Expect(locator).ToContainTextAsync(new Regex("\\d messages"));
```

If you pass an array as an expected value, the expectations are:
1. Locator resolves to a list of elements.
1. Elements from a **subset** of this list contain text from the expected array, respectively.
1. The matching subset of elements has the same order as the expected array.
1. Each text value from the expected array is matched by some element from the list.

For example, consider the following list:

```html
<ul>
  <li>Item Text 1</li>
  <li>Item Text 2</li>
  <li>Item Text 3</li>
</ul>
```

Let's see how we can use the assertion:

```csharp
// ✓ Contains the right items in the right order
await Expect(Page.Locator("ul > li")).ToContainTextAsync(new string[] {"Text 1", "Text 3"});

// ✖ Wrong order
await Expect(Page.Locator("ul > li")).ToContainTextAsync(new string[] {"Text 3", "Text 2"});

// ✖ No item contains this text
await Expect(Page.Locator("ul > li")).ToContainTextAsync(new string[] {"Some 33"});

// ✖ Locator points to the outer list element, not to the list items
await Expect(Page.Locator("ul")).ToContainTextAsync(new string[] {"Text 3"});
```

**Arguments**

- <a id="locator-assertions-to-contain-text-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected substring or RegExp or a list of those.
- <a id="locator-assertions-to-contain-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-contain-text-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignoreCase`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-contain-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-to-contain-text-option-use-inner-text"></a>`useInnerText` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### LocatorAssertions.ToHaveAccessibleDescriptionAsync() {#locator-assertions-to-have-accessible-description}

<Badge type="info" text="Added in: v1.44" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with a given [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).

**Usage**

```csharp
var locator = Page.GetByTestId("save-button");
await Expect(locator).ToHaveAccessibleDescriptionAsync("Save results to disk");
```

**Arguments**

- <a id="locator-assertions-to-have-accessible-description-option-description"></a>`description` `string | RegExp`

  Expected accessible description.
- <a id="locator-assertions-to-have-accessible-description-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-description-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignoreCase`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-description-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-description-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveAccessibleErrorMessageAsync() {#locator-assertions-to-have-accessible-error-message}

<Badge type="info" text="Added in: v1.50" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with a given [aria errormessage](https://w3c.github.io/aria/#aria-errormessage).

**Usage**

```csharp
var locator = Page.GetByTestId("username-input");
await Expect(locator).ToHaveAccessibleErrorMessageAsync("Username is required.");
```

**Arguments**

- <a id="locator-assertions-to-have-accessible-error-message-option-error-message"></a>`errorMessage` `string | RegExp`

  Expected accessible error message.
- <a id="locator-assertions-to-have-accessible-error-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-error-message-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignoreCase`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-error-message-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveAccessibleNameAsync() {#locator-assertions-to-have-accessible-name}

<Badge type="info" text="Added in: v1.44" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with a given [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).

**Usage**

```csharp
var locator = Page.GetByTestId("save-button");
await Expect(locator).ToHaveAccessibleNameAsync("Save to disk");
```

**Arguments**

- <a id="locator-assertions-to-have-accessible-name-option-name"></a>`name` `string | RegExp`

  Expected accessible name.
- <a id="locator-assertions-to-have-accessible-name-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-name-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignoreCase`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-name-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-name-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveAttributeAsync() {#locator-assertions-to-have-attribute}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with given attribute.

**Usage**

```csharp
var locator = Page.Locator("input");
await Expect(locator).ToHaveAttributeAsync("type", "text");
```

**Arguments**

- <a id="locator-assertions-to-have-attribute-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Attribute name.
- <a id="locator-assertions-to-have-attribute-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected attribute value.
- <a id="locator-assertions-to-have-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-attribute-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.40" />

    Whether to perform case-insensitive match. [`ignoreCase`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-attribute-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-attribute-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveClassAsync() {#locator-assertions-to-have-class}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with given CSS classes. When a string is provided, it must fully match the element's `class` attribute. To match individual classes use [`LocatorAssertions.ToContainClassAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-class).

**Usage**

```html
<div class='middle selected row' id='component'></div>
```

```csharp
var locator = Page.Locator("#component");
await Expect(locator).ToHaveClassAsync("middle selected row");
await Expect(locator).ToHaveClassAsync(new Regex("(^|\\s)selected(\\s|$)"));
```

When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class values. Each element's class attribute is matched against the corresponding string or regular expression in the array:

```csharp
var locator = Page.Locator(".list > .component");
await Expect(locator).ToHaveClassAsync(new string[]{"component", "component selected", "component"});
```

**Arguments**

- <a id="locator-assertions-to-have-class-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected class or RegExp or a list of those.
- <a id="locator-assertions-to-have-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-class-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveCountAsync() {#locator-assertions-to-have-count}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) resolves to an exact number of DOM nodes.

**Usage**

```csharp
var locator = Page.Locator("list > .component");
await Expect(locator).ToHaveCountAsync(3);
```

**Arguments**

- <a id="locator-assertions-to-have-count-option-count"></a>`count` `int` <Badge type="info" text="Added in: v1.18" />

  Expected count.
- <a id="locator-assertions-to-have-count-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-count-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveCSSAsync() {#locator-assertions-to-have-css}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) resolves to an element with the given computed CSS style.

**Usage**

```csharp
var locator = Page.GetByRole(AriaRole.Button);
await Expect(locator).ToHaveCSSAsync("display", "flex");
```

**Arguments**

- <a id="locator-assertions-to-have-css-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  CSS property name.
- <a id="locator-assertions-to-have-css-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  CSS property value.
- <a id="locator-assertions-to-have-css-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-css-option-pseudo"></a>`pseudo` `"before" | "after"` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Pseudo-element to read computed styles from.
  - <a id="locator-assertions-to-have-css-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveIdAsync() {#locator-assertions-to-have-id}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with the given DOM Node ID.

**Usage**

```csharp
var locator = Page.GetByRole(AriaRole.Textbox);
await Expect(locator).ToHaveIdAsync("lastname");
```

**Arguments**

- <a id="locator-assertions-to-have-id-option-id"></a>`id` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Element id.
- <a id="locator-assertions-to-have-id-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-id-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveJSPropertyAsync() {#locator-assertions-to-have-js-property}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with given JavaScript property. Note that this property can be
of a primitive type as well as a plain serializable JavaScript object.

**Usage**

```csharp
var locator = Page.Locator(".component");
await Expect(locator).ToHaveJSPropertyAsync("loaded", true);
```

**Arguments**

- <a id="locator-assertions-to-have-js-property-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Property name.
- <a id="locator-assertions-to-have-js-property-option-value"></a>`value` `any` <Badge type="info" text="Added in: v1.18" />

  Property value.
- <a id="locator-assertions-to-have-js-property-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-js-property-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveRoleAsync() {#locator-assertions-to-have-role}

<Badge type="info" text="Added in: v1.44" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with a given [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles).

Note that role is matched as a string, disregarding the ARIA role hierarchy. For example, asserting  a superclass role `"checkbox"` on an element with a subclass role `"switch"` will fail.

**Usage**

```csharp
var locator = Page.GetByTestId("save-button");
await Expect(locator).ToHaveRoleAsync(AriaRole.Button);
```

**Arguments**

- <a id="locator-assertions-to-have-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="locator-assertions-to-have-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-role-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveTextAsync() {#locator-assertions-to-have-text}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.

**Details**

When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and
in the expected string before matching. When regular expression is used, the actual text is matched as is.

**Usage**

```csharp
var locator = Page.Locator(".title");
await Expect(locator).ToHaveTextAsync(new Regex("Welcome, Test User"));
await Expect(locator).ToHaveTextAsync(new Regex("Welcome, .*"));
```

If you pass an array as an expected value, the expectations are:
1. Locator resolves to a list of elements.
1. The number of elements equals the number of expected values in the array.
1. Elements from the list have text matching expected array values, one by one, in order.

For example, consider the following list:

```html
<ul>
  <li>Text 1</li>
  <li>Text 2</li>
  <li>Text 3</li>
</ul>
```

Let's see how we can use the assertion:

```csharp
// ✓ Has the right items in the right order
await Expect(Page.Locator("ul > li")).ToHaveTextAsync(new string[] {"Text 1", "Text 2", "Text 3"});

// ✖ Wrong order
await Expect(Page.Locator("ul > li")).ToHaveTextAsync(new string[] {"Text 3", "Text 2", "Text 1"});

// ✖ Last item does not match
await Expect(Page.Locator("ul > li")).ToHaveTextAsync(new string[] {"Text 1", "Text 2", "Text"});

// ✖ Locator points to the outer list element, not to the list items
await Expect(Page.Locator("ul")).ToHaveTextAsync(new string[] {"Text 1", "Text 2", "Text 3"});
```

**Arguments**

- <a id="locator-assertions-to-have-text-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected string or RegExp or a list of those.
- <a id="locator-assertions-to-have-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-text-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignoreCase`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-to-have-text-option-use-inner-text"></a>`useInnerText` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### LocatorAssertions.ToHaveValueAsync() {#locator-assertions-to-have-value}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/dotnet/api/class-locator) points to an element with the given input value. You can use regular expressions for the value as well.

**Usage**

```csharp
var locator = Page.Locator("input[type=number]");
await Expect(locator).ToHaveValueAsync(new Regex("[0-9]"));
```

**Arguments**

- <a id="locator-assertions-to-have-value-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected value.
- <a id="locator-assertions-to-have-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-value-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToHaveValuesAsync() {#locator-assertions-to-have-values}

<Badge type="info" text="Added in: v1.23" />

Ensures the [Locator](/dotnet/api/class-locator) points to multi-select/combobox (i.e. a `select` with the `multiple` attribute) and the specified values are selected.

**Usage**

For example, given the following element:

```html
<select id="favorite-colors" multiple>
  <option value="R">Red</option>
  <option value="G">Green</option>
  <option value="B">Blue</option>
</select>
```

```csharp
var locator = Page.Locator("id=favorite-colors");
await locator.SelectOptionAsync(new string[] { "R", "G" });
await Expect(locator).ToHaveValuesAsync(new Regex[] { new Regex("R"), new Regex("G") });
```

**Arguments**

- <a id="locator-assertions-to-have-values-option-values"></a>`values` `Array<string> | Array<RegExp>`

  Expected options currently selected.
- <a id="locator-assertions-to-have-values-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-values-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### LocatorAssertions.ToMatchAriaSnapshotAsync() {#locator-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.49" />

Asserts that the target element matches the given [accessibility snapshot](../aria-snapshots.md).

**Usage**

```csharp
await page.GotoAsync("https://demo.playwright.dev/todomvc/");
await Expect(page.Locator("body")).ToMatchAriaSnapshotAsync(@"
  - heading ""todos""
  - textbox ""What needs to be done?""
");
```

**Arguments**

- <a id="locator-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="locator-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


## Properties

### LocatorAssertions.Not {#locator-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the Locator doesn't contain text `"error"`:

```csharp
await Expect(locator).Not.ToContainTextAsync("error");
```

**Type**

- `LocatorAssertions`

