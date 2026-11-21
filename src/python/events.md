---
title: "Events"
---

# Events

## Introduction

Playwright allows listening to various types of events happening on the web page, such as network requests, creation of child pages, dedicated workers etc. There are several ways to subscribe to such events, such as waiting for events or adding or removing event listeners.

## Waiting for event

Most of the time, scripts will need to wait for a particular event to happen. Below are some of the typical event awaiting patterns.

Wait for a request with the specified url using [`page.expect_request()`](/python/api/class-page#page-wait-for-request):

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

Wait for popup window:

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

## Adding/removing event listener

Sometimes, events happen in random time and instead of waiting for them, they need to be handled. Playwright supports traditional language mechanisms for subscribing and unsubscribing from the events:

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

## Adding one-off listeners

If a certain event needs to be handled once, there is a convenience API for that:

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
