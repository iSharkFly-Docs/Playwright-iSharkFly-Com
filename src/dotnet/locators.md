---
title: "Locators"
---

# Locators

## Introduction

[Locator](/dotnet/api/class-locator)s are the central piece of Playwright's auto-waiting and retry-ability. In a nutshell, locators represent
a way to find element(s) on the page at any moment.

### Quick Guide

These are the recommended built-in locators.
- [`Page.GetByRole()`](#locate-by-role) to locate by explicit and implicit accessibility attributes.
- [`Page.GetByText()`](#locate-by-text) to locate by text content.
- [`Page.GetByLabel()`](#locate-by-label) to locate a form control by associated label's text.
- [`Page.GetByPlaceholder()`](#locate-by-placeholder) to locate an input by placeholder.
- [`Page.GetByAltText()`](#locate-by-alt-text) to locate an element, usually image, by its text alternative.
- [`Page.GetByTitle()`](#locate-by-title) to locate an element by its title attribute.
- [`Page.GetByTestId()`](#locate-by-test-id) to locate an element based on its `data-testid` attribute (other attributes can be configured).

```csharp
await Page.GetByLabel("User Name").FillAsync("John");

await Page.GetByLabel("Password").FillAsync("secret-password");

await Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();

await Expect(Page.GetByText("Welcome, John!")).ToBeVisibleAsync();
```

## Locating elements

Playwright comes with multiple built-in locators. To make tests resilient, we recommend prioritizing user-facing attributes and explicit contracts such as [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role).

For example, consider the following DOM structure.

```html
<button>Sign in</button>
```

Locate the element by its role of `button` with name "Sign in".

```csharp
await Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();
```

::: info
Use the [code generator](./codegen.md) to generate a locator, and then edit it as you'd like.
:::

Every time a locator is used for an action, an up-to-date DOM element is located in the page. In the snippet
below, the underlying DOM element will be located twice, once prior to every action. This means that if the
DOM changes in between the calls due to re-render, the new element corresponding to the
locator will be used.

```csharp
var locator = Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" });

await locator.HoverAsync();
await locator.ClickAsync();
```

Note that all methods that create a locator, such as [`Page.GetByLabel()`](/dotnet/api/class-page#page-get-by-label), are also available on the [Locator](/dotnet/api/class-locator) and [FrameLocator](/dotnet/api/class-framelocator) classes, so you can chain them and iteratively narrow down your locator.

```csharp
var locator = Page
    .FrameLocator("#my-frame")
    .GetByRole(AriaRole.Button, new() { Name = "Sign in" });

await locator.ClickAsync();
```

### Locate by role

The [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) locator reflects how users and assistive technology perceive the page, for example whether some element is a button or a checkbox. When locating by role, you should usually pass the accessible name as well, so that the locator pinpoints the exact element.

For example, consider the following DOM structure.

```html
<h3>Sign up</h3>
<label>
  <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
```

You can locate each element by its implicit role:

```csharp
await Expect(Page
    .GetByRole(AriaRole.Heading, new() { Name = "Sign up" }))
    .ToBeVisibleAsync();

await Page
    .GetByRole(AriaRole.Checkbox, new() { Name = "Subscribe" })
    .CheckAsync();

await Page
    .GetByRole(AriaRole.Button, new() {
        NameRegex = new Regex("submit", RegexOptions.IgnoreCase)
    })
    .ClickAsync();
```

Role locators include [buttons, checkboxes, headings, links, lists, tables, and many more](https://www.w3.org/TR/html-aria/#docconformance) and follow W3C specifications for [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). Note that many html elements like `<button>` have an [implicitly defined role](https://w3c.github.io/html-aam/#html-element-role-mappings) that is recognized by the role locator.

Note that role locators **do not replace** accessibility audits and conformance tests, but rather give early feedback about the ARIA guidelines.

:::note[When to use role locators]

We recommend prioritizing role locators to locate elements, as it is the closest way to how users and assistive technology perceive the page.
:::

### Locate by label

Most form controls usually have dedicated labels that could be conveniently used to interact with the form. In this case, you can locate the control by its associated label using [`Page.GetByLabel()`](/dotnet/api/class-page#page-get-by-label).

For example, consider the following DOM structure.

```html
<label>Password <input type="password" /></label>

```

You can fill the input after locating it by the label text:

```csharp
await Page.GetByLabel("Password").FillAsync("secret");
```

:::note[When to use label locators]

Use this locator when locating form fields.
:::

### Locate by placeholder

Inputs may have a placeholder attribute to hint to the user what value should be entered. You can locate such an input using [`Page.GetByPlaceholder()`](/dotnet/api/class-page#page-get-by-placeholder).

For example, consider the following DOM structure.

```html
<input type="email" placeholder="name@example.com" />
```

You can fill the input after locating it by the placeholder text:

```csharp
await Page
    .GetByPlaceholder("name@example.com")
    .FillAsync("playwright@microsoft.com");
```

:::note[When to use placeholder locators]

Use this locator when locating form elements that do not have labels but do have placeholder texts.
:::

### Locate by text

Find an element by the text it contains. You can match by a substring, exact string, or a regular expression when using [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text).

For example, consider the following DOM structure.

```html
<span>Welcome, John</span>
```

You can locate the element by the text it contains:

```csharp
await Expect(Page.GetByText("Welcome, John")).ToBeVisibleAsync();
```

Set an exact match:

```csharp
await Expect(Page
    .GetByText("Welcome, John", new() { Exact = true }))
    .ToBeVisibleAsync();
```

Match with a regular expression:

```csharp
await Expect(Page
    .GetByText(new Regex("welcome, john", RegexOptions.IgnoreCase)))
    .ToBeVisibleAsync();
```

::: info
Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.
:::

:::note[When to use text locators]
We recommend using text locators to find non interactive elements like `div`, `span`, `p`, etc. For interactive elements like `button`, `a`, `input`, etc. use [role locators](#locate-by-role).
:::

You can also [filter by text](#filter-by-text) which can be useful when trying to find a particular item in a list.

### Locate by alt text

All images should have an `alt` attribute that describes the image. You can locate an image based on the text alternative using [`Page.GetByAltText()`](/dotnet/api/class-page#page-get-by-alt-text).

For example, consider the following DOM structure.

```html
<img alt="playwright logo" src="/img/playwright-logo.svg" width="100" />
```

You can click on the image after locating it by the text alternative:

```csharp
await Page.GetByAltText("playwright logo").ClickAsync();
```

:::note[When to use alt locators]

Use this locator when your element supports alt text such as `img` and `area` elements.
:::

### Locate by title

Locate an element with a matching title attribute using [`Page.GetByTitle()`](/dotnet/api/class-page#page-get-by-title).

For example, consider the following DOM structure.

```html
<span title='Issues count'>25 issues</span>
```

You can check the issues count after locating it by the title text:

```csharp
await Expect(Page.GetByTitle("Issues count")).toHaveText("25 issues");
```

:::note[When to use title locators]

Use this locator when your element has the `title` attribute.
:::

### Locate by test id

Testing by test ids is the most resilient way of testing as even if your text or role of the attribute changes, the test will still pass. QA's and developers should define explicit test ids and query them with [`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id). However testing by test ids is not user facing. If the role or text value is important to you then consider using user facing locators such as [role](#locate-by-role) and [text locators](#locate-by-text).

For example, consider the following DOM structure.

```html
<button data-testid="directions">Itinéraire</button>
```

You can locate the element by its test id:

```csharp
await Page.GetByTestId("directions").ClickAsync();
```

:::note[When to use testid locators]

You can also use test ids when you choose to use the test id methodology or when you can't locate by [role](#locate-by-role) or [text](#locate-by-text).
:::

#### Set a custom test id attribute

By default, [`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id) will locate elements based on the `data-testid` attribute, but you can configure it in your test config or by calling [`Selectors.SetTestIdAttribute()`](/dotnet/api/class-selectors#selectors-set-test-id-attribute).

Set the test id to use a custom data attribute for your tests.

```csharp
playwright.Selectors.SetTestIdAttribute("data-pw");
```

In your html you can now use `data-pw` as your test id instead of the default `data-testid`.

```html
<button data-pw="directions">Itinéraire</button>
```

And then locate the element as you would normally do:

```csharp
await Page.GetByTestId("directions").ClickAsync();
```

### Locate by CSS or XPath

If you absolutely must use CSS or XPath locators, you can use [`Page.Locator()`](/dotnet/api/class-page#page-locator) to create a locator that takes a selector describing how to find an element in the page. Playwright supports CSS and XPath selectors, and auto-detects them if you omit `css=` or `xpath=` prefix.

```csharp
await Page.Locator("css=button").ClickAsync();
await Page.Locator("xpath=//button").ClickAsync();

await Page.Locator("button").ClickAsync();
await Page.Locator("//button").ClickAsync();
```

XPath and CSS selectors can be tied to the DOM structure or implementation. These selectors can break when the DOM structure changes. Long CSS or XPath chains below are an example of a **bad practice** that leads to unstable tests:

```csharp
await Page.Locator("#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input").ClickAsync();

await Page.Locator("//*[@id='tsf']/div[2]/div[1]/div[1]/div/div[2]/input").ClickAsync();
```

:::note[When to use this]

CSS and XPath are not recommended as the DOM can often change leading to non resilient tests. Instead, try to come up with a locator that is close to how the user perceives the page such as [role locators](#locate-by-role) or [define an explicit testing contract](#locate-by-test-id) using test ids.
:::

## Locate in Shadow DOM

All locators in Playwright **by default** work with elements in Shadow DOM. The exceptions are:
- Locating by XPath does not pierce shadow roots.
- [Closed-mode shadow roots](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) are not supported.

Consider the following example with a custom web component:

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

You can locate in the same way as if the shadow root was not present at all.

To click `<div>Details</div>`:

```csharp
await page.GetByText("Details").ClickAsync();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

To click `<x-details>`:

```csharp
await page
    .Locator("x-details", new() { HasText = "Details" })
    .ClickAsync();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

To ensure that `<x-details>` contains the text "Details":

```csharp
await Expect(Page.Locator("x-details")).ToContainTextAsync("Details");
```

## Filtering Locators

Consider the following DOM structure where we want to click on the buy button of the second product card. We have a few options in order to filter the locators to get the right one.

```html
<ul>
  <li>
    <h3>Product 1</h3>
    <button>Add to cart</button>
  </li>
  <li>
    <h3>Product 2</h3>
    <button>Add to cart</button>
  </li>
</ul>
```

### Filter by text

Locators can be filtered by text with the [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) method. It will search for a particular string somewhere inside the element, possibly in a descendant element, case-insensitively. You can also pass a regular expression.

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasText = "Product 2" })
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

Use a regular expression:

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasTextRegex = new Regex("Product 2") })
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

### Filter by not having text

Alternatively, filter by **not having** text:

```csharp
// 5 in-stock items
await Expect(Page.GetByRole(AriaRole.Listitem).Filter(new() { HasNotText = "Out of stock" }))
    .ToHaveCountAsync(5);
```

### Filter by child/descendant

Locators support an option to only select elements that have or have not a descendant matching another locator. You can therefore filter by any other locator such as a [`Locator.GetByRole()`](/dotnet/api/class-locator#locator-get-by-role), [`Locator.GetByTestId()`](/dotnet/api/class-locator#locator-get-by-test-id), [`Locator.GetByText()`](/dotnet/api/class-locator#locator-get-by-text) etc.

```html
<ul>
  <li>
    <h3>Product 1</h3>
    <button>Add to cart</button>
  </li>
  <li>
    <h3>Product 2</h3>
    <button>Add to cart</button>
  </li>
</ul>
```

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        Has = page.GetByRole(AriaRole.Heading, new() {
            Name = "Product 2"
        })
    })
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

We can also assert the product card to make sure there is only one:

```csharp
await Expect(Page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        Has = page.GetByRole(AriaRole.Heading, new() { Name = "Product 2" })
    }))
    .ToHaveCountAsync(1);
```

The filtering locator **must be relative** to the original locator and is queried starting with the original locator match, not the document root. Therefore, the following will not work, because the filtering locator starts matching from the `<ul>` list element that is outside of the `<li>` list item matched by the original locator:

```csharp
// ✖ WRONG
await Expect(Page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        Has = page.GetByRole(AriaRole.List).GetByRole(AriaRole.Heading, new() { Name = "Product 2" })
    }))
    .ToHaveCountAsync(1);
```

### Filter by not having child/descendant

We can also filter by **not having** a matching element inside.

```csharp
await Expect(Page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        HasNot = page.GetByRole(AriaRole.Heading, new() { Name = "Product 2" })
    }))
    .ToHaveCountAsync(1);
```

Note that the inner locator is matched starting from the outer one, not from the document root.

## Locator operators

### Matching inside a locator

You can chain methods that create a locator, like [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) or [`Locator.GetByRole()`](/dotnet/api/class-locator#locator-get-by-role), to narrow down the search to a particular part of the page.

In this example we first create a locator called product by locating its role of `listitem`. We then filter by text. We can use the product locator again to get by role of button and click it and then use an assertion to make sure there is only one product with the text "Product 2".

```csharp
var product = page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasText = "Product 2" });

await product
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

You can also combine two locators with [`Locator.Within()`](/dotnet/api/class-locator#locator-within), for example to find a "Save" button inside a particular dialog:

```csharp
var saveButton = page.GetByRole(AriaRole.Button, new() { Name = "Save" });
// ...
var dialog = page.GetByTestId("settings-dialog");
await saveButton.Within(dialog).ClickAsync();
```

### Matching two locators simultaneously

Method [`Locator.And()`](/dotnet/api/class-locator#locator-and) narrows down an existing locator by matching an additional locator. For example, you can combine [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) and [`Page.GetByTitle()`](/dotnet/api/class-page#page-get-by-title) to match by both role and title.

```csharp
var button = page.GetByRole(AriaRole.Button).And(page.GetByTitle("Subscribe"));
```

### Matching one of the two alternative locators

If you'd like to target one of the two or more elements, and you don't know which one it will be, use [`Locator.Or()`](/dotnet/api/class-locator#locator-or) to create a locator that matches any one or both of the alternatives.

For example, consider a scenario where you'd like to click on a "New email" button, but sometimes a security settings dialog shows up instead. In this case, you can wait for either a "New email" button, or a dialog and act accordingly.

::: info
If both "New email" button and security dialog appear on screen, the "or" locator will match both of them,
possibly throwing the ["strict mode violation" error](#strictness). In this case, you can use [`Locator.First()`](/dotnet/api/class-locator#locator-first) to only match one of them.
:::

```csharp
var newEmail = page.GetByRole(AriaRole.Button, new() { Name = "New" });
var dialog = page.GetByText("Confirm security settings");
await Expect(newEmail.Or(dialog).First).ToBeVisibleAsync();
if (await dialog.IsVisibleAsync())
  await page.GetByRole(AriaRole.Button, new() { Name = "Dismiss" }).ClickAsync();
await newEmail.ClickAsync();
```

### Matching only visible elements

::: info
It's usually better to find a [more reliable way](./locators.md#quick-guide) to uniquely identify the element instead of checking the visibility.
:::

Consider a page with two buttons, the first invisible and the second [visible](./actionability.md#visible).

```html
<button style='display: none'>Invisible</button>
<button>Visible</button>
```
* This will find both buttons and throw a [strictness](./locators.md#strictness) violation error:
  
  ```csharp
  await page.Locator("button").ClickAsync();
  ```
* This will only find a second button, because it is visible, and then click it.
  
  ```csharp
  await page.Locator("button").Visible.ClickAsync();
  ```

To match invisible elements instead, use [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) with the [`visible`](/dotnet/api/class-locator#locator-filter-option-visible) option set to `false`.

## Lists

### Count items in a list

You can assert locators in order to count the items in a list.

For example, consider the following DOM structure:

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Use the count assertion to ensure that the list has 3 items.

```csharp
await Expect(Page.GetByRole(AriaRole.Listitem)).ToHaveCountAsync(3);
```

### Assert all text in a list

You can assert locators in order to find all the text in a list.

For example, consider the following DOM structure:

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Use [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) to ensure that the list has the text "apple", "banana" and "orange".

```csharp
await Expect(Page
    .GetByRole(AriaRole.Listitem))
    .ToHaveTextAsync(new string[] {"apple", "banana", "orange"});
```

### Get a specific item

There are many ways to get a specific item in a list.

#### Get by text

Use the [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) method to locate an element in a list by its text content and then click on it.

For example, consider the following DOM structure:

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Locate an item by its text content and click it.

```csharp
await page.GetByText("orange").ClickAsync();
```

#### Filter by text

Use the [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) to locate a specific item in a list.

For example, consider the following DOM structure:

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Locate an item by the role of "listitem" and then filter by the text of "orange" and then click it.

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasText = "orange" })
    .ClickAsync();
```

#### Get by test id

Use the [`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id) method to locate an element in a list. You may need to modify the html and add a test id if you don't already have a test id.

For example, consider the following DOM structure:

```html
<ul>
  <li data-testid='apple'>apple</li>
  <li data-testid='banana'>banana</li>
  <li data-testid='orange'>orange</li>
</ul>
```

Locate an item by its test id of "orange" and then click it.

```csharp
await page.GetByTestId("orange").ClickAsync();
```

#### Get by nth item

If you have a list of identical elements, and the only way to distinguish between them is the order, you can choose a specific element from a list with [`Locator.First()`](/dotnet/api/class-locator#locator-first), [`Locator.Last()`](/dotnet/api/class-locator#locator-last) or [`Locator.Nth()`](/dotnet/api/class-locator#locator-nth).

```csharp
var banana = await page.GetByRole(AriaRole.Listitem).Nth(1);
```

However, use this method with caution. Often times, the page might change, and the locator will point to a completely different element from the one you expected. Instead, try to come up with a unique locator that will pass the [strictness criteria](#strictness).

### Chaining filters

When you have elements with various similarities, you can use the [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) method to select the right one. You can also chain multiple filters to narrow down the selection.

For example, consider the following DOM structure:

```html
<ul>
  <li>
    <div>John</div>
    <div><button>Say hello</button></div>
  </li>
  <li>
    <div>Mary</div>
    <div><button>Say hello</button></div>
  </li>
  <li>
    <div>John</div>
    <div><button>Say goodbye</button></div>
  </li>
  <li>
    <div>Mary</div>
    <div><button>Say goodbye</button></div>
  </li>
</ul>
```

To take a screenshot of the row with "Mary" and "Say goodbye":

```csharp
var rowLocator = page.GetByRole(AriaRole.Listitem);

await rowLocator
    .Filter(new() { HasText = "Mary" })
    .Filter(new() {
        Has = page.GetByRole(AriaRole.Button, new() { Name = "Say goodbye" })
    })
    .ScreenshotAsync(new() { Path = "screenshot.png" });
```

You should now have a "screenshot.png" file in your project's root directory.

### Rare use cases

#### Do something with each element in the list

Iterate elements:

```csharp
foreach (var row in await page.GetByRole(AriaRole.Listitem).AllAsync())
  Console.WriteLine(await row.TextContentAsync());
```

Iterate using regular for loop:

```csharp
var rows = page.GetByRole(AriaRole.Listitem);
var count = await rows.CountAsync();
for (int i = 0; i < count; ++i)
  Console.WriteLine(await rows.Nth(i).TextContentAsync());
```

#### Evaluate in the page

The code inside [`Locator.EvaluateAllAsync()`](/dotnet/api/class-locator#locator-evaluate-all) runs in the page, you can call any DOM apis there.

```csharp
var rows = page.GetByRole(AriaRole.Listitem);
var texts = await rows.EvaluateAllAsync(
    "list => list.map(element => element.textContent)");
```

## Strictness

Locators are strict. This means that all operations on locators that imply
some target DOM element will throw an exception if more than one element matches. For example, the following call throws if there are several buttons in the DOM:

#### Throws an error if more than one

```csharp
await page.GetByRole(AriaRole.Button).ClickAsync();
```

On the other hand, Playwright understands when you perform a multiple-element operation,
so the following call works perfectly fine when the locator resolves to multiple elements.

#### Works fine with multiple elements

```csharp
await page.GetByRole(AriaRole.Button).CountAsync();
```

You can explicitly opt-out from strictness check by telling Playwright which element to use when multiple elements match, through [`Locator.First()`](/dotnet/api/class-locator#locator-first), [`Locator.Last()`](/dotnet/api/class-locator#locator-last), and [`Locator.Nth()`](/dotnet/api/class-locator#locator-nth). These methods are **not recommended** because when your page changes, Playwright may click on an element you did not intend. Instead, follow best practices above to create a locator that uniquely identifies the target element.

## More Locators

For less commonly used locators, look at the [other locators](./other-locators.md) guide.
