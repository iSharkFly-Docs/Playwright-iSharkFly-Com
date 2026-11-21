---
title: "页面"
---

# 页面

## 页面

每个 [BrowserContext](/java/api/class-browsercontext) 可以有多个页面。[Page](/java/api/class-page) 代表浏览器上下文中的单个标签页或弹出窗口。它应该用于导航到 URL 并与页面内容进行交互。

```java
// 创建页面。
Page page = context.newPage();

// 显式导航，类似于在浏览器中输入 URL。
page.navigate("http://example.com");
// 填写输入框。
page.locator("#search").fill("query");

// 通过点击链接隐式导航。
page.locator("#submit").click();
// 期望一个新的 url。
System.out.println(page.url());
```

## 多个页面

每个浏览器上下文可以托管多个页面（标签页）。
* 每个页面的行为就像一个聚焦的活动页面。不需要将页面置于前台。
* 上下文内的页面遵循上下文级别的模拟，如视口大小、自定义网络路由或浏览器区域设置。

```java
// 创建两个页面
Page pageOne = context.newPage();
Page pageTwo = context.newPage();

// 获取浏览器上下文的页面
List<Page> allPages = context.pages();
```

## 处理新页面

浏览器上下文上的 `page` 事件可用于获取在上下文中创建的新页面。这可用于处理由 `target="_blank"` 链接打开的新页面。

```java
// 在特定操作后获取页面（例如点击链接）
Page newPage = context.waitForPage(() -> {
  page.getByText("open new tab").click(); // 打开新标签页
});
// 正常与新页面交互
newPage.getByRole(AriaRole.BUTTON).click();
System.out.println(newPage.title());
```

如果触发新页面的操作未知，可以使用以下模式。

```java
// 获取上下文中的所有新页面（包括弹出窗口）
context.onPage(page -> {
  page.waitForLoadState();
  System.out.println(page.title());
});
```

## 处理弹出窗口

如果页面打开了一个弹出窗口（例如由 `target="_blank"` 链接打开的页面），你可以通过监听页面上的 `popup` 事件来获取对它的引用。

除了 `browserContext.on('page')` 事件之外，此事件也会被触发，但仅针对与此页面相关的弹出窗口。

```java
// 在特定操作后获取弹出窗口（例如点击）
Page popup = page.waitForPopup(() -> {
  page.getByText("open the popup").click();
});
// 正常与弹出窗口交互
popup.getByRole(AriaRole.BUTTON).click();
System.out.println(popup.title());
```

如果触发弹出窗口的操作未知，可以使用以下模式。

```java
// 在弹出窗口打开时获取所有弹出窗口
page.onPopup(popup -> {
  popup.waitForLoadState();
  System.out.println(popup.title());
});
```
