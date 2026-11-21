---
title: "Snapshot testing"
---

# Snapshot testing

import LiteYouTube from '@site/src/components/LiteYouTube';

## Overview

With Playwright's Snapshot testing you can assert the accessibility tree of a page against a predefined snapshot template.

```csharp
await page.GotoAsync("https://playwright.dev/");
await Expect(page).ToMatchAriaSnapshotAsync(@"
  - banner:
    - heading ""Playwright enables reliable end-to-end testing for modern web apps."" [level=1]
    - link ""Get started"":
      - /url: /docs/intro
    - link ""Star microsoft/playwright on GitHub"":
      - /url: https://github.com/microsoft/playwright
    - link /[\d]+k\+ stargazers on GitHub/
");
```

<LiteYouTube
id="P4R6hnsE0UY"
title="Getting started with ARIA Snapshots"
/>

## Assertion testing vs Snapshot testing

Snapshot testing and assertion testing serve different purposes in test automation:

### Assertion testing

Assertion testing is a targeted approach where you assert specific values or conditions about elements or components. For instance, with Playwright, [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text)
verifies that an element contains the expected text, and [`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value)
confirms that an input field has the expected value.
Assertion tests are specific and generally check the current state of an element or property
against an expected, predefined state.
They work well for predictable, single-value checks but are limited in scope when testing the
broader structure or variations.

**Advantages**
- **Clarity**: The intent of the test is explicit and easy to understand.
- **Specificity**: Tests focus on particular aspects of functionality, making them more robust
  against unrelated changes.
- **Debugging**: Failures provide targeted feedback, pointing directly to the problematic aspect.

**Disadvantages**
- **Verbose for complex outputs**: Writing assertions for complex data structures or large outputs
  can be cumbersome and error-prone.
- **Maintenance overhead**: As code evolves, manually updating assertions can be time-consuming.

### Snapshot testing

Snapshot testing captures a “snapshot” or representation of the entire
state of an element, component, or data at a given moment, which is then saved for future
comparisons. When re-running tests, the current state is compared to the snapshot, and if there
are differences, the test fails. This approach is especially useful for complex or dynamic
structures, where manually asserting each detail would be too time-consuming. Snapshot testing
is broader and more holistic than assertion testing, allowing you to track more complex changes over time.

**Advantages**
- **Simplifies complex outputs**: For example, testing a UI component's rendered output can be tedious with traditional assertions. Snapshots capture the entire output for easy comparison.
- **Quick Feedback loop**: Developers can easily spot unintended changes in the output.
- **Encourages consistency**: Helps maintain consistent output as code evolves.

**Disadvantages**
- **Over-Reliance**: It can be tempting to accept changes to snapshots without fully understanding
  them, potentially hiding bugs.
- **Granularity**: Large snapshots may be hard to interpret when differences arise, especially
  if minor changes affect large portions of the output.
- **Suitability**: Not ideal for highly dynamic content where outputs change frequently or
  unpredictably.

### When to use
- **Snapshot testing** is ideal for:
  - UI testing of whole pages and components.
  - Broad structural checks for complex UI components.
  - Regression testing for outputs that rarely change structure.
- **Assertion testing** is ideal for:
  - Core logic validation.
  - Computed value testing.
  - Fine-grained tests requiring precise conditions.

By combining snapshot testing for broad, structural checks and assertion testing for specific functionality, you can achieve a well-rounded testing strategy.

## Aria snapshots

In Playwright, aria snapshots provide a YAML representation of the accessibility tree of a page.
These snapshots can be stored and compared later to verify if the page structure remains consistent or meets defined
expectations. A template is a constraint, not necessarily a complete serialization of the accessibility tree.

The YAML format describes the hierarchical structure of accessible elements on the page, detailing **roles**, **attributes**, **values**, and **text content**.
The structure follows a tree-like syntax, where each node represents an accessible element, and indentation indicates
nested elements.

Each accessible element in the tree is represented as a YAML node:

```yaml
- role "name" [attribute=value]
```
- **role**: Specifies the ARIA or HTML role of the element (e.g., `heading`, `list`, `listitem`, `button`).
- **"name"**: Accessible name of the element. Quoted strings indicate exact values, `/patterns/` are used for regular expression.
- **[attribute=value]**: Attributes and values, in square brackets, represent specific ARIA attributes, such
  as `checked`, `disabled`, `expanded`, `invalid`, `level`, `pressed`, `required`, or `selected`. Attributes can constrain a
  specific value, such as `[pressed=mixed]`.

These values are derived from ARIA attributes or calculated based on HTML semantics. To inspect the accessibility tree
structure of a page, use the [Chrome DevTools Accessibility Tab](https://developer.chrome.com/docs/devtools/accessibility/reference#tab).

## Snapshot matching

The [`PageAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-match-aria-snapshot) assertion method in Playwright compares the accessible
structure of the page with a predefined aria snapshot template, helping validate the page's state against
testing requirements. You can also use [`LocatorAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) to match a specific part of the page.

For the following DOM:

```html
<h1>title</h1>
```

You can match it using the following snapshot template:

```csharp
await Expect(page).ToMatchAriaSnapshotAsync(@"
  - heading ""title""
");
```

When matching, the snapshot template is compared to the current accessibility tree of the page:
* If the tree structure matches the template, the test passes; otherwise, it fails, indicating a mismatch between
  expected and actual accessibility states.
* The comparison is case-sensitive and normalizes whitespace within names and text values. YAML indentation
  determines nesting.
* The comparison is order-sensitive, meaning the order of elements in the snapshot template must match the order in the
  page's accessibility tree.
* A single-node template can match at any depth within the selected page or locator. Multiple top-level nodes must match
  under the same parent, in order.

### Partial matching

You can perform partial matches on nodes by omitting attributes or accessible names, enabling verification of specific
parts of the accessibility tree without requiring exact matches. This flexibility is helpful for dynamic or irrelevant
attributes.

```html
<button>Submit</button>
```

::: code-group

```yaml [aria snapshot]
- button
```

:::

In this example, the button role is matched, but the accessible name ("Submit") is not specified, allowing the test to
pass regardless of the button's label.

<hr/>

For elements with ARIA attributes like `checked` or `disabled`, omitting these attributes allows partial matching,
focusing solely on role and hierarchy.

```html
<input type="checkbox" checked>
```

::: code-group

```yaml [aria snapshot (partial match)]
- checkbox
```

:::

In this partial match, the `checked` attribute is ignored, so the test will pass regardless of the checkbox state.

<hr/>

Similarly, you can partially match children in lists or groups by omitting specific list items or nested elements.

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

::: code-group

```yaml [aria snapshot (partial match)]
- list:
  - listitem: Feature B
```

:::

Partial matches let you create flexible snapshot tests that verify essential page structure without enforcing
specific content or attributes.

### Strict matching

By default, a template containing the subset of children will be matched:

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

::: code-group

```yaml [aria snapshot (partial match)]
- list:
  - listitem: Feature B
```

:::

The `/children` property controls children for the node where it appears:
- `contain` (default): Matches if all specified children are present in order.
- `equal`: Matches if direct children exactly match the specified list in order.
- `deep-equal`: Matches if children and nested children exactly match the specified list in order.

With no expected child entries, `contain` allows any children, while `equal` and `deep-equal` require none. Add
`/children: contain` to a nested node to override inherited `deep-equal` matching and allow extra children there.

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

Following snapshot will fail due to Feature C not being in the template:

::: code-group

```yaml [aria snapshot]
- list:
  - /children: equal
  - listitem: Feature A
  - listitem: Feature B
```

:::

#### Setting `children` mode globally

Instead of adding a `/children` property to every snapshot, you can set the default children matching mode for all
`toMatchAriaSnapshot` calls in the configuration file:

Individual snapshots can still override the global setting by including an explicit `/children` property in the template.

### Matching with regular expressions

Regular expressions allow flexible matching for elements with dynamic or variable text. Accessible names and text can
support regex patterns.

```html
<h1>Issues 12</h1>
```

::: code-group

```yaml [aria snapshot]
- heading /Issues \d+/
```

:::

## Generating snapshots

Creating aria snapshots in Playwright helps ensure and maintain your application's structure.
You can generate snapshots in various ways depending on your testing setup and workflow.

### Generating snapshots with the Playwright code generator

If you're using Playwright's [Code Generator](./codegen.md), generating aria snapshots is streamlined with its
interactive interface:
- **"Assert snapshot" Action**: In the code generator, you can use the "Assert snapshot" action to automatically create
  a snapshot assertion for the selected elements. This is a quick way to capture the aria snapshot as part of your
  recorded test flow.
- **"Aria snapshot" Tab**: The "Aria snapshot" tab within the code generator interface visually represents the
  aria snapshot for a selected locator, letting you explore, inspect, and verify element roles, attributes, and
  accessible names to aid snapshot creation and review.

### Using [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) and [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot)

Methods [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) and [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot) allow you to programmatically create a YAML representation of accessible
elements within a locator's scope, especially helpful for generating snapshots dynamically during test execution.

**Example**:

```csharp
var snapshot = await page.AriaSnapshotAsync();
Console.WriteLine(snapshot);
```

This command outputs the aria snapshot within the specified locator's scope in YAML format, which you can validate
or store as needed.

## Accessibility tree examples

### Headings with level attributes

Headings can include a `level` attribute indicating their heading level.

```html
<h1>Title</h1>
<h2>Subtitle</h2>
```

::: code-group

```yaml [aria snapshot]
- heading "Title" [level=1]
- heading "Subtitle" [level=2]
```

:::

### Text nodes

Standalone or descriptive text elements appear as text nodes.

```html
<div>Sample accessible name</div>
```

::: code-group

```yaml [aria snapshot]
- text: Sample accessible name
```

:::

### Inline multiline text

Multiline text, such as paragraphs, is normalized in the aria snapshot.

```html
<p>Line 1<br>Line 2</p>
```

::: code-group

```yaml [aria snapshot]
- paragraph: Line 1 Line 2
```

:::

### Links

Links display their text or composed content from pseudo-elements. The link’s destination may be matched using the
`/url` property.

```html
<a href="#more-info">Read more about Accessibility</a>
```

::: code-group

```yaml [aria snapshot]
- link "Read more about Accessibility":
    - /url: "#more-info"
```

:::

The value of `/url` may also be a regular expression:

```html
<a href="https://www.youtube.com/channel/UC46Zj8pDH5tDosqm1gd7WTg">YouTube channel</a>
```

::: code-group

```yaml [aria snapshot]
- link:
  - /url: /https://www.youtube.com/channel/.*/
```

:::

### Text boxes

Input elements of type `text` show their `value` attribute content.

```html
<input type="text" value="Enter your name">
```

::: code-group

```yaml [aria snapshot]
- textbox: Enter your name
```

:::

### Lists with items

Ordered and unordered lists include their list items.

```html
<ul aria-label="Main Features">
  <li>Feature 1</li>
  <li>Feature 2</li>
</ul>
```

::: code-group

```yaml [aria snapshot]
- list "Main Features":
  - listitem: Feature 1
  - listitem: Feature 2
```

:::

### Grouped elements

Groups capture nested elements, such as `<details>` elements with summary content.

```html
<details>
  <summary>Summary</summary>
  <p>Detail content here</p>
</details>
```

::: code-group

```yaml [aria snapshot]
- group: Summary
```

:::

### Attributes and states

Commonly used ARIA attributes, like `checked`, `disabled`, `expanded`, `invalid`, `level`, `pressed`, `required`, and `selected`, represent
control states.

#### Checkbox with `checked` attribute

```html
<input type="checkbox" checked>
```

::: code-group

```yaml [aria snapshot]
- checkbox [checked]
```

:::

#### Button with `pressed` attribute

```html
<button aria-pressed="true">Toggle</button>
```

::: code-group

```yaml [aria snapshot]
- button "Toggle" [pressed=true]
```

:::

#### Input with `aria-invalid` attribute

The `aria-invalid` value is surfaced directly. A value of `true` renders as `[invalid]`, while `grammar`
and `spelling` render as `[invalid=grammar]` and `[invalid=spelling]`. A `false` value is omitted.

```html
<input type="text" aria-label="Email" aria-invalid="true" value="not-an-email">
```

::: code-group

```yaml [aria snapshot]
- textbox "Email" [invalid]: not-an-email
```

:::

```html
<input type="text" aria-label="Bio" aria-invalid="spelling">
```

::: code-group

```yaml [aria snapshot]
- textbox "Bio" [invalid=spelling]
```

:::

#### Input with `required` attribute

On roles that support `aria-required`, native `required` attributes on inputs, textareas and selects,
or `aria-required="true"`, render as `[required]`. A native `required` attribute takes precedence over
`aria-required="false"`. A false value is omitted from snapshots, but can be asserted with `[required=false]`.

```html
<input type="email" aria-label="Email" required>
```

::: code-group

```yaml [aria snapshot]
- textbox "Email" [required]
```

:::
