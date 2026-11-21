---
title: "Pages"
---

# Pages

## Pages

Each [BrowserContext](/dotnet/api/class-browsercontext) can have multiple pages. A [Page](/dotnet/api/class-page) refers to a single tab or a popup window within a browser
context. It should be used to navigate to URLs and interact with the page content.

```csharp
// Create a page.
var page = await context.NewPageAsync();

// Navigate explicitly, similar to entering a URL in the browser.
await page.GotoAsync("http://example.com");
// Fill an input.
await page.Locator("#search").FillAsync("query");

// Navigate implicitly by clicking a link.
await page.Locator("#submit").ClickAsync();
// Expect a new url.
Console.WriteLine(page.Url);
```

## Multiple pages

Each browser context can host multiple pages (tabs).
* Each page behaves like a focused, active page. Bringing the page to front is not required.
* Pages inside a context respect context-level emulation, like viewport sizes, custom network routes or browser
  locale.

```csharp
// Create two pages
var pageOne = await context.NewPageAsync();
var pageTwo = await context.NewPageAsync();

// Get pages of a browser context
var allPages = context.Pages;
```

## Handling new pages

The `page` event on browser contexts can be used to get new pages that are created in the context. This can be used to
handle new pages opened by `target="_blank"` links.

```csharp
// Get page after a specific action (e.g. clicking a link)
var newPage = await context.RunAndWaitForPageAsync(async () =>
{
    await page.GetByText("open new tab").ClickAsync();
});
// Interact with the new page normally
await newPage.GetByRole(AriaRole.Button).ClickAsync();
Console.WriteLine(await newPage.TitleAsync());
```

If the action that triggers the new page is unknown, the following pattern can be used.

```csharp
// Get all new pages (including popups) in the context
context.Page += async  (_, page) => {
    await page.WaitForLoadStateAsync();
    Console.WriteLine(await page.TitleAsync());
};
```

## Handling popups

If the page opens a pop-up (e.g. pages opened by `target="_blank"` links), you can get a reference to it by listening to the `popup` event on the page.

This event is emitted in addition to the `browserContext.on('page')` event, but only for popups relevant to this page.

```csharp
// Get popup after a specific action (e.g., click)
var popup = await page.RunAndWaitForPopupAsync(async () =>
{
    await page.GetByText("open the popup").ClickAsync();
});
// Interact with the popup normally
await popup.GetByRole(AriaRole.Button).ClickAsync();
Console.WriteLine(await popup.TitleAsync());
```

If the action that triggers the popup is unknown, the following pattern can be used.

```csharp
// Get all popups when they open
page.Popup += async  (_, popup) => {
    await popup.WaitForLoadStateAsync();
    Console.WriteLine(await page.TitleAsync());
};
```
