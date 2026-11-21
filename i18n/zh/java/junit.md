---
title: "JUnit（实验性）"
---

# JUnit（实验性）

## 介绍

只需几行代码，你就可以将 Playwright 连接到你喜爱的 Java 测试运行器。

在 [JUnit](https://junit.org/junit5/) 中，你可以使用 Playwright [fixtures](./junit.md#fixtures) 来自动初始化 [Playwright](/java/api/class-playwright)、[Browser](/java/api/class-browser)、[BrowserContext](/java/api/class-browsercontext) 或 [Page](/java/api/class-page)。在下面的示例中，所有三个测试方法使用相同的 [Browser](/java/api/class-browser)。每个测试使用自己的 [BrowserContext](/java/api/class-browsercontext) 和 [Page](/java/api/class-page)。

```java
package org.example;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.junit.UsePlaywright;
import org.junit.jupiter.api.Test;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@UsePlaywright
public class TestExample {
  @Test
  void shouldClickButton(Page page) {
    page.navigate("data:text/html,<script>var result;</script><button onclick='result=\"Clicked\"'>Go</button>");
    page.locator("button").click();
    assertEquals("Clicked", page.evaluate("result"));
  }

  @Test
  void shouldCheckTheBox(Page page) {
    page.setContent("<input id='checkbox' type='checkbox'></input>");
    page.locator("input").check();
    assertEquals(true, page.evaluate("window['checkbox'].checked"));
  }

  @Test
  void shouldSearchWiki(Page page) {
    page.navigate("https://www.wikipedia.org/");
    page.locator("input[name=\"search\"]").click();
    page.locator("input[name=\"search\"]").fill("playwright");
    page.locator("input[name=\"search\"]").press("Enter");
    assertThat(page).hasURL("https://en.wikipedia.org/wiki/Playwright");
  }
}
```

## Fixtures

只需将 JUnit 注解 `@UsePlaywright` 添加到你的测试类中即可启用 Playwright fixtures。测试 fixtures 用于为每个测试建立环境，为测试提供所需的一切而不包含多余的内容。

```java
@UsePlaywright
public class TestExample {

  @Test
  void basicTest(Page page) {
    page.navigate("https://playwright.dev/");

    assertThat(page).hasTitle(Pattern.compile("Playwright"));
  }
}
```

`Page page` 参数告诉 JUnit 设置 `page` fixture 并将其提供给你的测试方法。

以下是预定义 fixtures 的列表：

|Fixture       |类型               |描述                      |
|:-------------|:------------------|:--------------------------------|
|page          |[Page](/java/api/class-page)             |此测试运行的隔离页面。|
|browserContext|[BrowserContext](/java/api/class-browsercontext)   |此测试运行的隔离上下文。`page` fixture 也属于此上下文。|
|browser       |[Browser](/java/api/class-browser)          |浏览器在测试之间共享以优化资源。|
|playwright    |[Playwright](/java/api/class-playwright)       |Playwright 实例在同一线程上运行的测试之间共享。|
|request       |[APIRequestContext](/java/api/class-apirequestcontext)|此测试运行的隔离 APIRequestContext。了解如何进行 [API 测试](./api-testing)。|

## 自定义选项

要自定义 fixture 选项，你应该实现一个 `OptionsFactory` 并在 `@UsePlaywright()` 注解中指定该类。

你可以轻松覆盖 [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) 的启动选项，或 [`browser.newContext()`](/java/api/class-browser#browser-new-context) 和 [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context) 的上下文选项。请参见以下示例：

```java
import com.microsoft.playwright.junit.Options;
import com.microsoft.playwright.junit.OptionsFactory;
import com.microsoft.playwright.junit.UsePlaywright;

@UsePlaywright(MyTest.CustomOptions.class)
public class MyTest {

  public static class CustomOptions implements OptionsFactory {
    @Override
    public Options getOptions() {
      return new Options()
          .setHeadless(false)
          .setContextOption(new Browser.NewContextOptions()
              .setBaseURL("https://github.com"))
          .setApiRequestOptions(new APIRequest.NewContextOptions()
              .setBaseURL("https://playwright.dev"));
    }
  }

  @Test
  public void testWithCustomOptions(Page page, APIRequestContext request) {
    page.navigate("/");
    assertThat(page).hasURL(Pattern.compile("github"));

    APIResponse response = request.get("/");
    assertTrue(response.text().contains("Playwright"));
  }
}
```

## 并行运行测试

默认情况下，JUnit 将在单个线程上顺序运行所有测试。从 JUnit 5.3 开始，你可以更改此行为以并行运行测试来加快执行速度（参见[此页面](https://junit.org/junit5/docs/snapshot/user-guide/index.html#writing-tests-parallel-execution)）。由于在没有额外同步的情况下从多个线程使用相同的 Playwright 对象是不安全的，我们建议你为每个线程创建 Playwright 实例并仅在该线程上使用它。以下是如何并行运行多个测试类的示例。

```java
@UsePlaywright
class Test1 {
  @Test
  void shouldClickButton(Page page) {
    page.navigate("data:text/html,<script>var result;</script><button onclick='result=\"Clicked\"'>Go</button>");
    page.locator("button").click();
    assertEquals("Clicked", page.evaluate("result"));
  }

  @Test
  void shouldCheckTheBox(Page page) {
    page.setContent("<input id='checkbox' type='checkbox'></input>");
    page.locator("input").check();
    assertEquals(true, page.evaluate("window['checkbox'].checked"));
  }

  @Test
  void shouldSearchWiki(Page page) {
    page.navigate("https://www.wikipedia.org/");
    page.locator("input[name=\"search\"]").click();
    page.locator("input[name=\"search\"]").fill("playwright");
    page.locator("input[name=\"search\"]").press("Enter");
    assertThat(page).hasURL("https://en.wikipedia.org/wiki/Playwright");
  }
}

@UsePlaywright
class Test2 {
  @Test
  void shouldReturnInnerHTML(Page page) {
    page.setContent("<div>hello</div>");
    assertEquals("hello", page.innerHTML("css=div"));
  }

  @Test
  void shouldClickButton(Page page) {
    Page popup = page.waitForPopup(() -> {
      page.evaluate("window.open('about:blank');");
    });
    assertEquals("about:blank", popup.url());
  }
}
```

配置 JUnit 以在每个类中顺序运行测试，并在并行线程上运行多个类（最大线程数等于 CPU 核心数的 1/2）：

```bash
junit.jupiter.execution.parallel.enabled = true
junit.jupiter.execution.parallel.mode.default = same_thread
junit.jupiter.execution.parallel.mode.classes.default = concurrent
junit.jupiter.execution.parallel.config.strategy=dynamic
junit.jupiter.execution.parallel.config.dynamic.factor=0.5
```
