---
title: APIResponseAssertions
outline: 2
---

# APIResponseAssertions

<Badge type="info" text="Added in: v1.18" />

The [APIResponseAssertions](/java/api/class-apiresponseassertions) class provides assertion methods that can be used to make assertions about the [APIResponse](/java/api/class-apiresponse) in the tests.

```java
// ...
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class TestPage {
  // ...
  @Test
  void navigatesToLoginPage() {
    // ...
    APIResponse response = page.request().get("https://playwright.dev");
    assertThat(response).isOK();
  }
}
```

## Methods

### apiResponseAssertions.isOK() {#api-response-assertions-to-be-ok}

<Badge type="info" text="Added in: v1.18" />

Ensures the response status code is within `200..299` range.

**Usage**

```java
assertThat(response).isOK();
```


## Properties

### apiResponseAssertions.not() {#api-response-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the response status is not successful:

```java
assertThat(response).not().isOK();
```

**Type**

- `APIResponseAssertions`

