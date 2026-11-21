---
title: PageAssertions
outline: 2
---

# PageAssertions

<Badge type="info" text="Added in: v1.17" />

The [PageAssertions](/java/api/class-pageassertions) class provides assertion methods that can be used to make assertions about the [Page](/java/api/class-page) state in the tests.

```java
// ...
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class TestPage {
  // ...
  @Test
  void navigatesToLoginPage() {
    // ...
    page.getByText("Sign in").click();
    assertThat(page).hasURL(Pattern.compile(".*/login"));
  }
}
```

## Methods

### pageAssertions.hasTitle() {#page-assertions-to-have-title}

<Badge type="info" text="Added in: v1.20" />

Ensures the page has the given title.

**Usage**

```java
assertThat(page).hasTitle("Playwright");
```

**Arguments**

- <a id="page-assertions-to-have-title-option-title-or-reg-exp"></a>`titleOrRegExp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected title or RegExp.
- <a id="page-assertions-to-have-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-title-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### pageAssertions.hasURL() {#page-assertions-to-have-url}

<Badge type="info" text="Added in: v1.20" />

Ensures the page is navigated to the given URL.

**Usage**

```java
assertThat(page).hasURL(".com");
```

**Arguments**

- <a id="page-assertions-to-have-url-option-url-or-reg-exp"></a>`urlOrRegExp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected URL string or RegExp.
- <a id="page-assertions-to-have-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-url-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.44" />

    Whether to perform case-insensitive match. [`ignoreCase`](/java/api/class-pageassertions#page-assertions-to-have-url-option-ignore-case) option takes precedence over the corresponding regular expression parameter if specified. A provided predicate ignores this flag.
  - <a id="page-assertions-to-have-url-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### pageAssertions.matchesAriaSnapshot() {#page-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.60" />

Asserts that the page body matches the given [accessibility snapshot](../aria-snapshots.md).

**Usage**

```java
page.navigate("https://demo.playwright.dev/todomvc/");
assertThat(page).matchesAriaSnapshot("""
  - heading "todos"
  - textbox "What needs to be done?"
""");
```

**Arguments**

- <a id="page-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="page-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


## Properties

### pageAssertions.not() {#page-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the page URL doesn't contain `"error"`:

```java
assertThat(page).not().hasURL("error");
```

**Type**

- `PageAssertions`

