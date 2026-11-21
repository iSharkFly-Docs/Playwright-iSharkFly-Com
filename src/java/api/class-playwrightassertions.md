---
title: PlaywrightAssertions
outline: 2
---

# PlaywrightAssertions

<Badge type="info" text="Added in: v1.17" />

Playwright gives you Web-First Assertions with convenience methods for creating assertions that will wait and retry until the expected condition is met.

Consider the following example:

```java
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class TestExample {
  // ...
  @Test
  void statusBecomesSubmitted() {
    // ...
    page.locator("#submit-button").click();
    assertThat(page.locator(".status")).hasText("Submitted");
  }
}
```

Playwright will be re-testing the node with the selector `.status` until fetched Node has the `"Submitted"`
text. It will be re-fetching the node and checking it over and over, until the condition is met or until the timeout is
reached. You can pass this timeout as an option.

By default, the timeout for assertions is set to 5 seconds.

## Methods

### playwrightAssertions.assertThat() {#playwright-assertions-expect-api-response}

<Badge type="info" text="Added in: v1.18" />

Creates a [APIResponseAssertions](/java/api/class-apiresponseassertions) object for the given [APIResponse](/java/api/class-apiresponse).

**Usage**

```java
PlaywrightAssertions.assertThat(response).isOK();
```

**Arguments**

- <a id="playwright-assertions-expect-api-response-option-response"></a>`response` `APIResponse`

  [APIResponse](/java/api/class-apiresponse) object to use for assertions.

**Returns**

- `APIResponseAssertions`


### playwrightAssertions.assertThat() {#playwright-assertions-expect-locator}

<Badge type="info" text="Added in: v1.18" />

Creates a [LocatorAssertions](/java/api/class-locatorassertions) object for the given [Locator](/java/api/class-locator).

**Usage**

```java
PlaywrightAssertions.assertThat(locator).isVisible();
```

**Arguments**

- <a id="playwright-assertions-expect-locator-option-locator"></a>`locator` `Locator`

  [Locator](/java/api/class-locator) object to use for assertions.

**Returns**

- `LocatorAssertions`


### playwrightAssertions.assertThat() {#playwright-assertions-expect-page}

<Badge type="info" text="Added in: v1.18" />

Creates a [PageAssertions](/java/api/class-pageassertions) object for the given [Page](/java/api/class-page).

**Usage**

```java
PlaywrightAssertions.assertThat(page).hasTitle("News");
```

**Arguments**

- <a id="playwright-assertions-expect-page-option-page"></a>`page` `Page`

  [Page](/java/api/class-page) object to use for assertions.

**Returns**

- `PageAssertions`


### playwrightAssertions.setDefaultAssertionTimeout() {#playwright-assertions-set-default-assertion-timeout}

<Badge type="info" text="Added in: v1.25" />

Changes default timeout for Playwright assertions from 5 seconds to the specified value.

**Usage**

```java
PlaywrightAssertions.setDefaultAssertionTimeout(30_000);
```

**Arguments**

- <a id="playwright-assertions-set-default-assertion-timeout-option-timeout"></a>`timeout` `float`

  Timeout in milliseconds.

