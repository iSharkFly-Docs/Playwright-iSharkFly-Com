---
title: "Touch events (legacy)"
---

# Touch events (legacy)

## Introduction

Web applications that handle legacy [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) to respond to gestures like swipe, pinch, and tap can be tested by manually dispatching [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)s to the page. The examples below demonstrate how to use [`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event) and pass [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) points as arguments.

Note that [`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event) does not set [`Event.isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) property. If your web page relies on it, make sure to disable `isTrusted` check during the test.

### Emulating pan gesture

In the example below, we emulate pan gesture that is expected to move the map. The app under test only uses `clientX/clientY` coordinates of the touch point, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.

```csharp
using Microsoft.Playwright;
using System.Collections.Generic;
using System.Threading.Tasks;

public class TouchEvents
{
    public static async Task Main(string[] args)
    {
        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.LaunchAsync();
        var context = await browser.NewContextAsync(playwright.Devices["Pixel 7"]);
        var page = await context.NewPageAsync();

        await page.GotoAsync(
            "https://www.google.com/maps/place/@37.4117722,-122.0713234,15z",
            new PageGotoOptions { WaitUntil = WaitUntilState.Commit }
        );
        await page.GetByRole(AriaRole.Button, new PageGetByRoleOptions { Name = "Keep using web" }).ClickAsync();
        await page.GetByRole(AriaRole.Button, new PageGetByRoleOptions { Name = "Keep using web" })
            .WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Hidden });

        var met = page.Locator("[data-test-id='met']");
        for (int i = 0; i < 5; i++)
        {
            await Pan(met, 200, 100);
        }
        await page.ScreenshotAsync(new PageScreenshotOptions { Path = "screenshot.png" });
    }

    public static async Task Pan(ILocator locator, int deltaX, int deltaY, int steps = 5)
    {
        var bounds = await locator.BoundingBoxAsync();
        double centerX = bounds.X + bounds.Width / 2;
        double centerY = bounds.Y + bounds.Height / 2;

        var touches = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                { "identifier", 0 },
                { "clientX", centerX },
                { "clientY", centerY }
            }
        };
        await locator.DispatchEventAsync("touchstart", new { touches, changedTouches = touches, targetTouches = touches });

        for (int i = 1; i <= steps; i++)
        {
            touches = new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "identifier", 0 },
                    { "clientX", centerX + deltaX * i / steps },
                    { "clientY", centerY + deltaY * i / steps }
                }
            };
            await locator.DispatchEventAsync("touchmove", new { touches, changedTouches = touches, targetTouches = touches });
        }

        await locator.DispatchEventAsync("touchend");
    }
}
```

### Emulating pinch gesture

In the example below, we emulate pinch gesture, i.e. two touch points moving closer to each other. It is expected to zoom out the map. The app under test only uses `clientX/clientY` coordinates of touch points, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.

```csharp
using Microsoft.Playwright;
using System.Collections.Generic;
using System.Threading.Tasks;

public class TouchEvents
{
    public static async Task Pinch(ILocator locator, int deltaX = 50, int steps = 5, string direction = "in")
    {
        var bounds = await locator.BoundingBoxAsync();
        double centerX = bounds.X + bounds.Width / 2;
        double centerY = bounds.Y + bounds.Height / 2;
        double stepDeltaX = deltaX / (steps + 1.0);

        var touches = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                { "identifier", 0 },
                { "clientX", centerX - (direction == "in" ? deltaX : stepDeltaX) },
                { "clientY", centerY }
            },
            new Dictionary<string, object>
            {
                { "identifier", 1 },
                { "clientX", centerX + (direction == "in" ? deltaX : stepDeltaX) },
                { "clientY", centerY }
            }
        };
        await locator.DispatchEventAsync("touchstart", new { touches, changedTouches = touches, targetTouches = touches });

        for (int i = 1; i <= steps; i++)
        {
            double offset = direction == "in" ? (deltaX - i * stepDeltaX) : (stepDeltaX * (i + 1));
            touches = new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "identifier", 0 },
                    { "clientX", centerX - offset },
                    { "clientY", centerY }
                },
                new Dictionary<string, object>
                {
                    { "identifier", 1 },
                    { "clientX", centerX + offset },
                    { "clientY", centerY }
                }
            };
            await locator.DispatchEventAsync("touchmove", new { touches, changedTouches = touches, targetTouches = touches });
        }

        await locator.DispatchEventAsync("touchend", new { touches = new List<object>(), changedTouches = new List<object>(), targetTouches = new List<object>() });
    }

    public static async Task TestPinchInGestureToZoomOutTheMap(IPage page)
    {
        await page.GotoAsync("https://www.google.com/maps/place/@37.4117722,-122.0713234,15z", new PageGotoOptions { WaitUntil = WaitUntilState.Commit });
        await page.GetByRole(AriaRole.Button, new PageGetByRoleOptions { Name = "Keep using web" }).ClickAsync();
        await page.GetByRole(AriaRole.Button, new PageGetByRoleOptions { Name = "Keep using web" }).WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Hidden });

        var met = page.Locator("[data-test-id='met']");
        for (int i = 0; i < 5; i++)
        {
            await Pinch(met, 40, 5, "in");
        }
        await page.ScreenshotAsync(new PageScreenshotOptions { Path = "screenshot.png" });
    }
}
```
