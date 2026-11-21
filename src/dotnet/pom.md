---
title: "Page object models"
---

# Page object models

## Introduction

Large test suites can be structured to optimize ease of authoring and maintenance. Page object models are one such approach to structure your test suite.

A page object represents a part of your web application. An e-commerce web application might have a home page, a listings page and a checkout page. Each of them can be represented by page object models.

Page objects **simplify authoring** by creating a higher-level API which suits your application and **simplify maintenance** by capturing element selectors in one place and create reusable code to avoid repetition.

## Implementation

Page object models wrap over a Playwright [Page](/dotnet/api/class-page).

```csharp
using System.Threading.Tasks;
using Microsoft.Playwright;

namespace BigEcommerceApp.Tests.Models;

public class SearchPage
{
  private readonly IPage _page;
  private readonly ILocator _searchTermInput;

  public SearchPage(IPage page)
  {
    _page = page;
    _searchTermInput = page.Locator("[aria-label='Enter your search term']");
  }

  public async Task GotoAsync()
  {
    await _page.GotoAsync("https://bing.com");
  }

  public async Task SearchAsync(string text)
  {
    await _searchTermInput.FillAsync(text);
    await _searchTermInput.PressAsync("Enter");
  }
}
```

Page objects can then be used inside a test.

```csharp
using BigEcommerceApp.Tests.Models;

// in the test
var page = new SearchPage(await browser.NewPageAsync());
await page.GotoAsync();
await page.SearchAsync("search query");
```
