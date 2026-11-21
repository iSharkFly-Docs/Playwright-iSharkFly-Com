---
title: "Touch events (legacy)"
---

# Touch events (legacy)

## Introduction

Web applications that handle legacy [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) to respond to gestures like swipe, pinch, and tap can be tested by manually dispatching [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)s to the page. The examples below demonstrate how to use [`locator.dispatchEvent()`](/java/api/class-locator#locator-dispatch-event) and pass [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) points as arguments.

Note that [`locator.dispatchEvent()`](/java/api/class-locator#locator-dispatch-event) does not set [`Event.isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) property. If your web page relies on it, make sure to disable `isTrusted` check during the test.

### Emulating pan gesture

In the example below, we emulate pan gesture that is expected to move the map. The app under test only uses `clientX/clientY` coordinates of the touch point, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.

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

### Emulating pinch gesture

In the example below, we emulate pinch gesture, i.e. two touch points moving closer to each other. It is expected to zoom out the map. The app under test only uses `clientX/clientY` coordinates of touch points, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.

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
