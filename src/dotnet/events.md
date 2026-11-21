---
title: "Events"
---

# Events

## Introduction

Playwright allows listening to various types of events happening on the web page, such as network requests, creation of child pages, dedicated workers etc. There are several ways to subscribe to such events, such as waiting for events or adding or removing event listeners.

## Waiting for event

Most of the time, scripts will need to wait for a particular event to happen. Below are some of the typical event awaiting patterns.

Wait for a request with the specified url using [`Page.RunAndWaitForRequestAsync()`](/dotnet/api/class-page#page-wait-for-request):

```csharp
var waitForRequestTask = page.WaitForRequestAsync("**/*logo*.png");
await page.GotoAsync("https://wikipedia.org");
var request = await waitForRequestTask;
Console.WriteLine(request.Url);
```

Wait for popup window:

```csharp
var popup = await page.RunAndWaitForPopupAsync(async =>
{
    await page.GetByText("open the popup").ClickAsync();
});
await popup.GotoAsync("https://wikipedia.org");
```

## Adding/removing event listener

Sometimes, events happen in random time and instead of waiting for them, they need to be handled. Playwright supports traditional language mechanisms for subscribing and unsubscribing from the events:

```csharp
page.Request += (_, request) => Console.WriteLine("Request sent: " + request.Url);
void listener(object sender, IRequest request)
{
    Console.WriteLine("Request finished: " + request.Url);
};
page.RequestFinished += listener;
await page.GotoAsync("https://wikipedia.org");

// Remove previously added listener.
page.RequestFinished -= listener;
await page.GotoAsync("https://www.openstreetmap.org/");
```
