---
title: "页面对象模型"
---

# 页面对象模型

## 简介

大型测试套件可以通过结构化来优化编写和维护的便利性。页面对象模型是构建测试套件的一种方法。

页面对象代表你的 Web 应用程序的一部分。一个电子商务 Web 应用程序可能有主页、列表页和结账页。每个页面都可以用页面对象模型来表示。

页面对象通过创建适合你的应用程序的高级 API 来**简化编写**，并通过在一个地方捕获元素选择器并创建可重用代码来避免重复，从而**简化维护**。

## 实现

页面对象模型封装 Playwright [Page](/dotnet/api/class-page)。

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

然后可以在测试中使用页面对象。

```csharp
using BigEcommerceApp.Tests.Models;

// 在测试中
var page = new SearchPage(await browser.NewPageAsync());
await page.GotoAsync();
await page.SearchAsync("search query");
```
