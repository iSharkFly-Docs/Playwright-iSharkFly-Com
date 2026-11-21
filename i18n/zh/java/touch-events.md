---
title: "触摸事件（旧版）"
---

# 触摸事件（旧版）

## 简介

处理旧版[触摸事件](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)以响应滑动、捏合和点击等手势的 Web 应用程序可以通过手动向页面分发 [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent) 来进行测试。下面的示例演示了如何使用 [`locator.dispatchEvent()`](/java/api/class-locator#locator-dispatch-event) 并将 [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) 点作为参数传递。

请注意，[`locator.dispatchEvent()`](/java/api/class-locator#locator-dispatch-event) 不会设置 [`Event.isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) 属性。如果你的网页依赖于此属性，请确保在测试期间禁用 `isTrusted` 检查。

### 模拟平移手势

在下面的示例中，我们模拟预期会移动地图的平移手势。被测应用程序只使用触摸点的 `clientX/clientY` 坐标，所以我们只初始化这些。在更复杂的场景中，如果你的应用程序需要，你可能还需要设置 `pageX/pageY/screenX/screenY`。

```java
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;

public class TouchEvents {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      Browser browser = playwright.chromium().launch();
      BrowserContext context = browser.newContext(new Browser.NewContextOptions()
        .setViewportSize(412, 839)
        .setDeviceScaleFactor(2.625)
        .setUserAgent("Mozilla/5.0 (Linux; Android 12; Pixel 7 Build/SP1A.210812.015) AppleWebKit/537.36" +
          " (KHTML, like Gecko) Chrome/94.0.4606.71 Mobile Safari/537.36")
        .setHasTouch(true)
        .setIsMobile(true)
      );
      Page page = context.newPage();

      page.navigate("https://www.google.com/maps/place/@37.4117722,-122.0713234,15z", new Page.NavigateOptions().setWaitUntil(WaitUntilState.COMMIT));
      page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Keep using web")).click();
      page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Keep using web")).waitFor(
        new Locator.WaitForOptions().setState(WaitForSelectorState.HIDDEN));

      Locator met = page.locator("[data-test-id='met']");
      for (int i = 0; i < 5; i++) {
        pan(met, 200, 100);
      }
      page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("screenshot.png")));
    }
  }

  public static void pan(Locator locator, int deltaX, int deltaY) {
    pan(locator, deltaX, deltaY, 5);
  }

  public static void pan(Locator locator, int deltaX, int deltaY, int steps) {
    BoundingBox bounds = locator.boundingBox();
    double centerX = bounds.x + bounds.width / 2;
    double centerY = bounds.y + bounds.height / 2;

    List<Map<String, Object>> touches = List.of(Map.of(
      "identifier", 0,
      "clientX", centerX,
      "clientY", centerY
    ));
    locator.dispatchEvent("touchstart", Map.of(
      "touches", touches,
      "changedTouches", touches,
      "targetTouches", touches
    ));

    for (int i = 1; i <= steps; i++) {
      touches = List.of(Map.of(
        "identifier", 0,
        "clientX", centerX + deltaX * i / steps,
        "clientY", centerY + deltaY * i / steps
      ));
      locator.dispatchEvent("touchmove", Map.of(
        "touches", touches,
        "changedTouches", touches,
        "targetTouches", touches
      ));
    }

    locator.dispatchEvent("touchend");
  }
}
```

### 模拟捏合手势

在下面的示例中，我们模拟捏合手势，即两个触摸点相互靠近。预期这会缩小地图。被测应用程序只使用触摸点的 `clientX/clientY` 坐标，所以我们只初始化这些。在更复杂的场景中，如果你的应用程序需要，你可能还需要设置 `pageX/pageY/screenX/screenY`。

```java
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;

public class TouchEvents {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      Browser browser = playwright.chromium().launch();
      BrowserContext context = browser.newContext(new Browser.NewContextOptions()
        .setViewportSize(412, 839)
        .setDeviceScaleFactor(2.625)
        .setUserAgent("Mozilla/5.0 (Linux; Android 12; Pixel 7 Build/SP1A.210812.015) AppleWebKit/537.36" +
          " (KHTML, like Gecko) Chrome/94.0.4606.71 Mobile Safari/537.36")
        .setHasTouch(true)
        .setIsMobile(true)
      );
      Page page = context.newPage();

      page.navigate("https://www.google.com/maps/place/@37.4117722,-122.0713234,15z", new Page.NavigateOptions().setWaitUntil(WaitUntilState.COMMIT));
      page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Keep using web")).click();
      page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Keep using web")).waitFor(
        new Locator.WaitForOptions().setState(WaitForSelectorState.HIDDEN));

      Locator met = page.locator("[data-test-id='met']");
      for (int i = 0; i < 5; i++) {
        pinch(met, 40, "in");
      }
      page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("screenshot.png")));
    }
  }

  public static void pinch(Locator locator, int deltaX, String direction) {
    pinch(locator, deltaX, direction, 5);
  }

  public static void pinch(Locator locator, int deltaX, String direction, int steps) {
    BoundingBox bounds = locator.boundingBox();
    double centerX = bounds.x + bounds.width / 2;
    double centerY = bounds.y + bounds.height / 2;
    double stepDeltaX = deltaX / (steps + 1.0);

    List<Map<String, Object>> touches = List.of(
      Map.of("identifier", 0, "clientX", centerX - (direction.equals("in") ? deltaX : stepDeltaX), "clientY", centerY),
      Map.of("identifier", 1, "clientX", centerX + (direction.equals("in") ? deltaX : stepDeltaX), "clientY", centerY)
    );
    locator.dispatchEvent("touchstart", Map.of("touches", touches, "changedTouches", touches, "targetTouches", touches));

    for (int i = 1; i <= steps; i++) {
      double offset = direction.equals("in") ? (deltaX - i * stepDeltaX) : (stepDeltaX * (i + 1));
      touches = List.of(
        Map.of("identifier", 0, "clientX", centerX - offset, "clientY", centerY),
        Map.of("identifier", 1, "clientX", centerX + offset, "clientY", centerY)
      );
      locator.dispatchEvent("touchmove", Map.of("touches", touches, "changedTouches", touches, "targetTouches", touches));
    }

    locator.dispatchEvent("touchend", Map.of("touches", List.of(), "changedTouches", List.of(), "targetTouches", List.of()));
  }
}
```
