---
title: "事件"
---

# 事件

## 简介

Playwright 允许监听网页上发生的各种类型的事件，例如网络请求、子页面的创建、专用工作线程等。有几种订阅此类事件的方式，例如等待事件或添加或移除事件监听器。

## 等待事件

大多数情况下，脚本需要等待特定事件发生。以下是一些典型的事件等待模式。

使用 [`Page.RunAndWaitForRequestAsync()`](/dotnet/api/class-page#page-wait-for-request) 等待具有指定 URL 的请求：

```csharp
var waitForRequestTask = page.WaitForRequestAsync("**/*logo*.png");
await page.GotoAsync("https://wikipedia.org");
var request = await waitForRequestTask;
Console.WriteLine(request.Url);
```

等待弹出窗口：

```csharp
var popup = await page.RunAndWaitForPopupAsync(async =>
{
    await page.GetByText("open the popup").ClickAsync();
});
await popup.GotoAsync("https://wikipedia.org");
```

## 添加/移除事件监听器

有时，事件在随机时间发生，不需要等待它们，而是需要处理它们。Playwright 支持传统的语言机制来订阅和取消订阅事件：

```csharp
page.Request += (_, request) => Console.WriteLine("Request sent: " + request.Url);
void listener(object sender, IRequest request)
{
    Console.WriteLine("Request finished: " + request.Url);
};
page.RequestFinished += listener;
await page.GotoAsync("https://wikipedia.org");

// 移除之前添加的监听器。
page.RequestFinished -= listener;
await page.GotoAsync("https://www.openstreetmap.org/");
```
