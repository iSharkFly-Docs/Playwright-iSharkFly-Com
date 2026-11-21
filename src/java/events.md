---
title: "Events"
---

# Events

## Introduction

Playwright allows listening to various types of events happening on the web page, such as network requests, creation of child pages, dedicated workers etc. There are several ways to subscribe to such events, such as waiting for events or adding or removing event listeners.

## Waiting for event

Most of the time, scripts will need to wait for a particular event to happen. Below are some of the typical event awaiting patterns.

Wait for a request with the specified url using [`page.waitForRequest()`](/java/api/class-page#page-wait-for-request):

```java
// The callback lambda defines scope of the code that is expected to
// trigger request.
Request request = page.waitForRequest("**/*logo*.png", () -> {
  page.navigate("https://wikipedia.org");
});
System.out.println(request.url());
```

Wait for popup window:

```java
// The callback lambda defines scope of the code that is expected to
// create popup window.
Page popup = page.waitForPopup(() -> {
  page.getByText("open the popup").click();
});
popup.navigate("https://wikipedia.org");
```

## Adding/removing event listener

Sometimes, events happen in random time and instead of waiting for them, they need to be handled. Playwright supports traditional language mechanisms for subscribing and unsubscribing from the events:

```java
page.onRequest(request -> System.out.println("Request sent: " + request.url()));
Consumer<Request> listener = request -> System.out.println("Request finished: " + request.url());
page.onRequestFinished(listener);
page.navigate("https://wikipedia.org");

// Remove previously added listener, each on* method has corresponding off*
page.offRequestFinished(listener);
page.navigate("https://www.openstreetmap.org/");
```

## Adding one-off listeners

If a certain event needs to be handled once, there is a convenience API for that:

```java
page.onceDialog(dialog -> dialog.accept("2021"));
page.evaluate("prompt('Enter a number:')");
```
