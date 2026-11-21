---
title: "事件"
---

# 事件

## 简介

Playwright 允许监听网页上发生的各种类型的事件，如网络请求、子页面创建、专用 Worker 等。有几种订阅此类事件的方式，如等待事件或添加或移除事件监听器。

## 等待事件

大多数时候，脚本需要等待特定事件的发生。以下是一些典型的事件等待模式。

使用 [`page.waitForRequest()`](/java/api/class-page#page-wait-for-request) 等待具有指定 URL 的请求：

```java
// 回调 lambda 定义了预期触发请求的代码范围。
Request request = page.waitForRequest("**/*logo*.png", () -> {
  page.navigate("https://wikipedia.org");
});
System.out.println(request.url());
```

等待弹出窗口：

```java
// 回调 lambda 定义了预期创建弹出窗口的代码范围。
Page popup = page.waitForPopup(() -> {
  page.getByText("open the popup").click();
});
popup.navigate("https://wikipedia.org");
```

## 添加/移除事件监听器

有时，事件在随机时间发生，需要处理它们而不是等待它们。Playwright 支持传统的语言机制来订阅和取消订阅事件：

```java
page.onRequest(request -> System.out.println("Request sent: " + request.url()));
Consumer<Request> listener = request -> System.out.println("Request finished: " + request.url());
page.onRequestFinished(listener);
page.navigate("https://wikipedia.org");

// 移除之前添加的监听器，每个 on* 方法都有对应的 off*
page.offRequestFinished(listener);
page.navigate("https://www.openstreetmap.org/");
```

## 添加一次性监听器

如果某个事件只需要处理一次，有一个便捷的 API：

```java
page.onceDialog(dialog -> dialog.accept("2021"));
page.evaluate("prompt('Enter a number:')");
```
