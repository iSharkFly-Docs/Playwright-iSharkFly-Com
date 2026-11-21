---
title: "Pages"
---

# Pages

## Pages

Each [BrowserContext](/java/api/class-browsercontext) can have multiple pages. A [Page](/java/api/class-page) refers to a single tab or a popup window within a browser
context. It should be used to navigate to URLs and interact with the page content.

```java
// Create a page.
Page page = context.newPage();

// Navigate explicitly, similar to entering a URL in the browser.
page.navigate("http://example.com");
// Fill an input.
page.locator("#search").fill("query");

// Navigate implicitly by clicking a link.
page.locator("#submit").click();
// Expect a new url.
System.out.println(page.url());
```

## Multiple pages

Each browser context can host multiple pages (tabs).
* Each page behaves like a focused, active page. Bringing the page to front is not required.
* Pages inside a context respect context-level emulation, like viewport sizes, custom network routes or browser
  locale.

```java
// Create two pages
Page pageOne = context.newPage();
Page pageTwo = context.newPage();

// Get pages of a browser context
List<Page> allPages = context.pages();
```

## Handling new pages

The `page` event on browser contexts can be used to get new pages that are created in the context. This can be used to
handle new pages opened by `target="_blank"` links.

```java
// Get page after a specific action (e.g. clicking a link)
Page newPage = context.waitForPage(() -> {
  page.getByText("open new tab").click(); // Opens a new tab
});
// Interact with the new page normally
newPage.getByRole(AriaRole.BUTTON).click();
System.out.println(newPage.title());
```

If the action that triggers the new page is unknown, the following pattern can be used.

```java
// Get all new pages (including popups) in the context
context.onPage(page -> {
  page.waitForLoadState();
  System.out.println(page.title());
});
```

## Handling popups

If the page opens a pop-up (e.g. pages opened by `target="_blank"` links), you can get a reference to it by listening to the `popup` event on the page.

This event is emitted in addition to the `browserContext.on('page')` event, but only for popups relevant to this page.

```java
// Get popup after a specific action (e.g., click)
Page popup = page.waitForPopup(() -> {
  page.getByText("open the popup").click();
});
// Interact with the popup normally
popup.getByRole(AriaRole.BUTTON).click();
System.out.println(popup.title());
```

If the action that triggers the popup is unknown, the following pattern can be used.

```java
// Get all popups when they open
page.onPopup(popup -> {
  popup.waitForLoadState();
  System.out.println(popup.title());
});
```
