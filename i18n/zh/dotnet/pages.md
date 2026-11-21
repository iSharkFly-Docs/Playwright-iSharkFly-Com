---
title: "页面"
---

# 页面

## 页面

每个 [BrowserContext](/dotnet/api/class-browsercontext) 可以有多个页面。[Page](/dotnet/api/class-page) 指的是浏览器上下文中的单个标签页或弹出窗口。它应该用于导航到 URL 并与页面内容交互。

```csharp
// 创建页面。
var page = await context.NewPageAsync();

// 显式导航，类似于在浏览器中输入 URL。
await page.GotoAsync("http://example.com");
// 填写输入框。
await page.Locator("#search").FillAsync("query");

// 通过点击链接隐式导航。
await page.Locator("#submit").ClickAsync();
// 期望新的 URL。
Console.WriteLine(page.Url);
```

## 多个页面

每个浏览器上下文可以托管多个页面（标签页）。
* 每个页面的行为就像一个聚焦的、活动的页面。不需要将页面置于前台。
* 上下文内的页面遵循上下文级别的模拟，如视口大小、自定义网络路由或浏览器语言环境。

```csharp
// 创建两个页面
var pageOne = await context.NewPageAsync();
var pageTwo = await context.NewPageAsync();

// 获取浏览器上下文的页面
var allPages = context.Pages;
```

## 处理新页面

浏览器上下文上的 `page` 事件可用于获取在上下文中创建的新页面。这可用于处理由 `target="_blank"` 链接打开的新页面。

```csharp
// 在特定操作后获取页面（例如点击链接）
var newPage = await context.RunAndWaitForPageAsync(async () =>
{
    await page.GetByText("open new tab").ClickAsync();
});
// 正常与新页面交互
await newPage.GetByRole(AriaRole.Button).ClickAsync();
Console.WriteLine(await newPage.TitleAsync());
```

如果触发新页面的操作未知，可以使用以下模式。

```csharp
// 获取上下文中的所有新页面（包括弹出窗口）
context.Page += async  (_, page) => {
    await page.WaitForLoadStateAsync();
    Console.WriteLine(await page.TitleAsync());
};
```

## 处理弹出窗口

如果页面打开弹出窗口（例如由 `target="_blank"` 链接打开的页面），你可以通过监听页面上的 `popup` 事件来获取对它的引用。

除了 `browserContext.on('page')` 事件之外，还会发出此事件，但仅针对与此页面相关的弹出窗口。

```csharp
// 在特定操作后获取弹出窗口（例如点击）
var popup = await page.RunAndWaitForPopupAsync(async () =>
{
    await page.GetByText("open the popup").ClickAsync();
});
// 正常与弹出窗口交互
await popup.GetByRole(AriaRole.Button).ClickAsync();
Console.WriteLine(await popup.TitleAsync());
```

如果触发弹出窗口的操作未知，可以使用以下模式。

```csharp
// 在弹出窗口打开时获取所有弹出窗口
page.Popup += async  (_, popup) => {
    await popup.WaitForLoadStateAsync();
    Console.WriteLine(await page.TitleAsync());
};
```
