---
title: APIResponseAssertions
outline: 2
---

# APIResponseAssertions

<Badge type="info" text="Added in: v1.18" />

The [APIResponseAssertions](/dotnet/api/class-apiresponseassertions) class provides assertion methods that can be used to make assertions about the [APIResponse](/dotnet/api/class-apiresponse) in the tests.

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTests : PageTest
{
    [TestMethod]
    public async Task NavigatesToLoginPage()
    {
        var response = await Page.APIRequest.GetAsync("https://playwright.dev");
        await Expect(response).ToBeOKAsync();
    }
}
```

## Methods

### ApiResponseAssertions.ToBeOKAsync() {#api-response-assertions-to-be-ok}

<Badge type="info" text="Added in: v1.18" />

Ensures the response status code is within `200..299` range.

**Usage**

```csharp
await Expect(response).ToBeOKAsync();
```


## Properties

### ApiResponseAssertions.Not {#api-response-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the response status is not successful:

```csharp
await Expect(response).Not.ToBeOKAsync();
```

**Type**

- `APIResponseAssertions`

