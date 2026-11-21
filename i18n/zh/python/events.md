---
title: "事件"
---

# 事件

## 简介

Playwright 允许监听网页上发生的各种类型的事件，如网络请求、子页面创建、专用 Worker 等。有几种订阅此类事件的方式，如等待事件或添加或移除事件监听器。

## 等待事件

大多数时候，脚本需要等待特定事件的发生。以下是一些典型的事件等待模式。

使用 [`page.expect_request()`](/python/api/class-page#page-wait-for-request) 等待具有指定 URL 的请求：

::: code-group

```python [Async]
async with page.expect_request("**/*logo*.png") as first:
  await page.goto("https://wikipedia.org")
first_request = await first.value
print(first_request.url)
```

```python [Sync]
with page.expect_request("**/*logo*.png") as first:
  page.goto("https://wikipedia.org")
print(first.value.url)
```

:::

等待弹出窗口：

::: code-group

```python [Async]
async with page.expect_popup() as popup:
  await page.get_by_text("open the popup").click()
child_page = await popup.value
await child_page.goto("https://wikipedia.org")
```

```python [Sync]
with page.expect_popup() as popup:
  page.get_by_text("open the popup").click()
popup.value.goto("https://wikipedia.org")
```

:::

## 添加/移除事件监听器

有时，事件在随机时间发生，需要处理它们而不是等待它们。Playwright 支持传统的语言机制来订阅和取消订阅事件：

::: code-group

```python [Async]
def print_request_sent(request):
  print("Request sent: " + request.url)

def print_request_finished(request):
  print("Request finished: " + request.url)

page.on("request", print_request_sent)
page.on("requestfinished", print_request_finished)
await page.goto("https://wikipedia.org")

page.remove_listener("requestfinished", print_request_finished)
await page.goto("https://www.openstreetmap.org/")
```

```python [Sync]
def print_request_sent(request):
  print("Request sent: " + request.url)

def print_request_finished(request):
  print("Request finished: " + request.url)

page.on("request", print_request_sent)
page.on("requestfinished", print_request_finished)
page.goto("https://wikipedia.org")

page.remove_listener("requestfinished", print_request_finished)
page.goto("https://www.openstreetmap.org/")
```

:::

## 添加一次性监听器

如果某个事件只需要处理一次，有一个便捷的 API：

::: code-group

```python [Async]
page.once("dialog", lambda dialog: dialog.accept("2021"))
await page.evaluate("prompt('Enter a number:')")
```

```python [Sync]
page.once("dialog", lambda dialog: dialog.accept("2021"))
page.evaluate("prompt('Enter a number:')")
```

:::
