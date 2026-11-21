---
title: "运行和调试测试"
---

# 运行和调试测试

## 简介

Playwright 测试可以通过多种方式运行。我们建议将其连接到您喜欢的测试运行器，例如 [JUnit](./test-runners.md)，因为它可以让您并行运行测试、运行单个测试等。

您可以运行单个测试、一组测试或所有测试。测试可以在一个浏览器或多个浏览器上运行。默认情况下，测试以无头模式运行，这意味着在运行测试时不会打开浏览器窗口，结果将显示在终端中。如果您愿意，可以使用 `launch(new BrowserType.LaunchOptions().setHeadless(false))` 选项以有头模式运行测试。

在 [JUnit](https://junit.org/junit5/) 中，您可以在 [@BeforeAll](https://junit.org/junit5/docs/current/api/org.junit.jupiter.api/org/junit/jupiter/api/BeforeAll.html) 方法中初始化 [Playwright](/java/api/class-playwright) 和 [Browser](/java/api/class-browser)，并在 [@AfterAll](https://junit.org/junit5/docs/current/api/org.junit.jupiter.api/org/junit/jupiter/api/AfterAll.html) 中销毁它们。在下面的示例中，所有三个测试方法使用同一个 [Browser](/java/api/class-browser)。每个测试使用自己的 [BrowserContext](/java/api/class-browsercontext) 和 [Page](/java/api/class-page)。

```java
package org.example;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestExample {
  // 在此类中的所有测试之间共享。
  static Playwright playwright;
  static Browser browser;

  // 每个测试方法的新实例。
  BrowserContext context;
  Page page;

  @BeforeAll
  static void launchBrowser() {
    playwright = Playwright.create();
    browser = playwright.chromium().launch();
  }

  @AfterAll
  static void closeBrowser() {
    playwright.close();
  }

  @BeforeEach
  void createContextAndPage() {
    context = browser.newContext();
    page = context.newPage();
  }

  @AfterEach
  void closeContext() {
    context.close();
  }

  @Test
  void shouldClickButton() {
    page.navigate("data:text/html,<script>var result;</script><button onclick='result=\"Clicked\"'>Go</button>");
    page.locator("button").click();
    assertEquals("Clicked", page.evaluate("result"));
  }

  @Test
  void shouldCheckTheBox() {
    page.setContent("<input id='checkbox' type='checkbox'></input>");
    page.locator("input").check();
    assertTrue((Boolean) page.evaluate("() => window['checkbox'].checked"));
  }

  @Test
  void shouldSearchWiki() {
    page.navigate("https://www.wikipedia.org/");
    page.locator("input[name=\"search\"]").click();
    page.locator("input[name=\"search\"]").fill("playwright");
    page.locator("input[name=\"search\"]").press("Enter");
    assertEquals("https://en.wikipedia.org/wiki/Playwright", page.url());
  }
}
```

有关如何并行运行测试等更多详细信息，请参阅[此处](./test-runners.md)。

查看实验性的 [JUnit 集成](./junit.md)以自动初始化 Playwright 对象等。

### 以有头模式运行测试

如果您愿意，可以使用 `launch(new BrowserType.LaunchOptions().setHeadless(false))` 选项以有头模式运行测试。

## 下一步
- [调试测试](./debug.md)
- [使用 Codegen 生成测试](./codegen.md)
- [查看测试追踪](./trace-viewer-intro.md)
