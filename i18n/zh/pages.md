---
title: "页面"
---

# 页面

## 页面

每个 [BrowserContext](/api/class-browsercontext) 可以有多个页面。[Page](/api/class-page) 指的是浏览器上下文中的单个标签页或弹出窗口。它应该用于导航到 URL 并与页面内容交互。

```js
// 创建页面。
const page = await context.newPage();

// 显式导航，类似于在浏览器中输入 URL。
await page.goto('http://example.com');
// 填写输入框。
await page.locator('#search').fill('query');

// 通过点击链接隐式导航。
await page.locator('#submit').click();
// 期望新的 URL。
console.log(page.url());
```

## 多个页面

每个浏览器上下文可以托管多个页面（标签页）。
* 每个页面的行为就像一个聚焦的、活动的页面。不需要将页面置于前台。
* 上下文中的页面遵循上下文级别的模拟，如视口大小、自定义网络路由或浏览器区域设置。

```js
// 创建两个页面
const pageOne = await context.newPage();
const pageTwo = await context.newPage();

// 获取浏览器上下文的页面
const allPages = context.pages();
```

## 处理新页面

浏览器上下文上的 `page` 事件可用于获取在上下文中创建的新页面。这可用于处理由 `target="_blank"` 链接打开的新页面。

```js
// 在点击之前开始等待新页面。注意没有 await。
const pagePromise = context.waitForEvent('page');
await page.getByText('open new tab').click();
const newPage = await pagePromise;
// 正常与新页面交互。
await newPage.getByRole('button').click();
console.log(await newPage.title());
```

如果触发新页面的操作未知，可以使用以下模式。

```js
// 获取上下文中的所有新页面（包括弹出窗口）
context.on('page', async page => {
  await page.waitForLoadState();
  console.log(await page.title());
});
```

## 处理弹出窗口

如果页面打开弹出窗口（例如，由 `target="_blank"` 链接打开的页面），您可以通过监听页面上的 `popup` 事件获取对它的引用。

除了 `browserContext.on('page')` 事件外，还会触发此事件，但仅适用于与此页面相关的弹出窗口。

```js
// 在点击之前开始等待弹出窗口。注意没有 await。
const popupPromise = page.waitForEvent('popup');
await page.getByText('open the popup').click();
const popup = await popupPromise;
// 正常与新弹出窗口交互。
await popup.getByRole('button').click();
console.log(await popup.title());
```

如果触发弹出窗口的操作未知，可以使用以下模式。

```js
// 当弹出窗口打开时获取所有弹出窗口
page.on('popup', async popup => {
  await popup.waitForLoadState();
  console.log(await popup.title());
});
```
