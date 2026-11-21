---
title: "导航"
---

# 导航

## 简介

Playwright 可以导航到 URL 并处理由页面交互引起的导航。

## 基本导航

最简单的导航形式是打开一个 URL：

```js
// 导航页面
await page.goto('https://example.com');
```

上面的代码加载页面并等待网页触发 [load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) 事件。
load 事件在整个页面加载完成后触发，包括所有依赖资源，如样式表、脚本、iframe 和图片。

::: info
如果页面在 `load` 之前进行客户端重定向，[`page.goto()`](/api/class-page#page-goto) 将等待重定向后的页面触发 `load` 事件。
:::

::: info
在 Firefox 中，页面触发的导航可能会以 `NS_BINDING_ABORTED` 错误中断 [`page.goto()`](/api/class-page#page-goto)。这是一个[已知的 Firefox 限制](https://github.com/microsoft/playwright/issues/20749)。
:::

## 页面何时加载完成？

现代页面在 `load` 事件触发后会执行大量活动。它们会延迟获取数据、填充 UI、在 `load` 事件触发后加载昂贵的资源、脚本和样式。没有办法判断页面是否已"加载完成"，这取决于页面、框架等。那么什么时候可以开始与页面交互呢？

在 Playwright 中，您可以随时与页面交互。它会自动等待目标元素变得[可操作](./actionability.md)。

```js
// 导航并点击元素
// 点击会自动等待元素
await page.goto('https://example.com');
await page.getByText('Example Domain').click();
```

对于上述场景，Playwright 将等待文本变得可见，等待该元素的其余可操作性检查通过，然后点击它。

Playwright 像一个非常快速的用户一样操作——它一看到按钮就点击它。在一般情况下，您不需要担心所有资源是否已加载等问题。

## 水合

在某个时候，您会遇到这样的用例：Playwright 执行了一个操作，但似乎什么都没发生。或者您在输入字段中输入了一些文本，但文本消失了。这背后最可能的原因是页面[水合](https://en.wikipedia.org/wiki/Hydration_%28web_development%29)不良。

当页面被水合时，首先会向浏览器发送页面的静态版本。然后发送动态部分，页面变得"活跃"。作为一个非常快速的用户，Playwright 会在看到页面的那一刻就开始与之交互。如果页面上的按钮已启用，但监听器尚未添加，Playwright 会完成其工作，但点击不会产生任何效果。

验证页面是否存在水合不良问题的简单方法是打开 Chrome DevTools，在 Network 面板中选择"Slow 3G"网络模拟并重新加载页面。一旦您看到感兴趣的元素，就与它交互。您会发现按钮点击被忽略，输入的文本被后续页面加载代码重置。解决此问题的正确方法是确保所有交互控件在水合完成之前（即页面完全功能化之前）保持禁用状态。

## 等待导航

点击元素可能会触发多个导航。在这些情况下，建议显式使用 [`page.waitForURL()`](/api/class-page#page-wait-for-url) 等待特定的 URL。

```js
await page.getByText('Click me').click();
await page.waitForURL('**/login');
```

## 后退/前进缓存（BFCache）

现代浏览器使用后退/前进缓存（BFCache）来在用户向后或向前导航时即时加载页面。这是通过将页面的 DOM 和 JavaScript 堆冻结在内存中，并在返回时解冻来实现的。

默认情况下，Playwright 在所有浏览器中禁用 BFCache，以确保一致、干净的测试环境。

即使您显式启用 BFCache，**测试 BFCache 恢复也不受支持**。因为 BFCache 恢复跳过网络获取阶段，浏览器不会触发标准导航生命周期事件（如 `commit`、`domcontentloaded` 或 `load`）。Playwright 的内部 `Page` 状态严重依赖这些网络级别的事件来保持同步。

因此，触发 BFCache 恢复（例如通过 `page.goBack()`）将绕过 Playwright 的生命周期跟踪，导致超时和完全不同步的 `Page` 对象，后续交互将失败。

## 导航事件

Playwright 将在页面中显示新文档的过程分为**导航**和**加载**。

**导航开始**于更改页面 URL 或与页面交互（例如点击链接）。
导航意图可能会被取消，例如在遇到未解析的 DNS 地址时，或转变为文件下载。

**导航提交**发生在响应头被解析且会话历史记录被更新时。只有在导航成功（已提交）后，页面才开始**加载**文档。

**加载**包括通过网络获取剩余的响应体、解析、执行脚本和触发加载事件：
- [`page.url()`](/api/class-page#page-url) 被设置为新的 URL
- 通过网络加载和解析文档内容
- 触发 [`page.on('DOMContentLoaded')`](/api/class-page#page-event-dom-content-loaded) 事件
- 页面执行一些脚本并加载资源，如样式表和图片
- 触发 [`page.on('load')`](/api/class-page#page-event-load) 事件
- 页面执行动态加载的脚本
