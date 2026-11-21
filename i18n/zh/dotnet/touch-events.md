---
title: "触摸事件（旧版）"
---

# 触摸事件（旧版）

## 简介

处理旧版[触摸事件](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)以响应滑动、捏合和点击等手势的 Web 应用程序可以通过手动向页面派发 [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent) 来进行测试。下面的示例演示了如何使用 [`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event) 并将 [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) 点作为参数传递。

请注意，[`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event) 不会设置 [`Event.isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) 属性。如果您的网页依赖该属性，请确保在测试期间禁用 `isTrusted` 检查。

### 模拟平移手势

在下面的示例中，我们模拟预期会移动地图的平移手势。被测应用仅使用触摸点的 `clientX/clientY` 坐标，因此我们只初始化这些属性。在更复杂的场景中，如果您的应用需要，您可能还需要设置 `pageX/pageY/screenX/screenY`。

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

### 模拟捏合手势

在下面的示例中，我们模拟捏合手势，即两个触摸点相互靠近。预期这会缩小地图。被测应用仅使用触摸点的 `clientX/clientY` 坐标，因此我们只初始化这些属性。在更复杂的场景中，如果您的应用需要，您可能还需要设置 `pageX/pageY/screenX/screenY`。

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
