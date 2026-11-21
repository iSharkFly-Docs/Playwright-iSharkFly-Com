---
title: "测试运行器"
---

# 测试运行器

## 简介

只需几行代码，你就可以将 Playwright 与你喜欢的 Java 测试运行器集成。

Playwright 和 Browser 实例可以在测试之间重用以获得更好的性能。我们
建议在新的 BrowserContext 中运行每个测试用例，这样浏览器状态将在测试之间被隔离。

## JUnit

在 [JUnit](https://junit.org/junit5/) 中，你可以在 [@BeforeAll](https://junit.org/junit5/docs/current/api/org.junit.jupiter.api/org/junit/jupiter/api/BeforeAll.html) 方法中初始化 [Playwright](/java/api/class-playwright) 和 [Browser](/java/api/class-browser)，
并在 [@AfterAll](https://junit.org/junit5/docs/current/api/org.junit.jupiter.api/org/junit/jupiter/api/AfterAll.html) 中销毁它们。在下面的示例中，所有三个测试方法使用相同的
[Browser](/java/api/class-browser)。每个测试使用自己的 [BrowserContext](/java/api/class-browsercontext) 和 [Page](/java/api/class-page)。

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

查看实验性 [JUnit 集成](./junit.md) 以自动初始化 Playwright 对象等。

### 并行运行测试

默认情况下，JUnit 会在单个线程上按顺序运行所有测试。从 JUnit 5.3 开始，你可以更改此行为以并行运行测试
来加快执行速度（参见[此页面](https://junit.org/junit5/docs/snapshot/user-guide/index.html#writing-tests-parallel-execution)）。
由于在没有额外同步的情况下从多个线程使用相同的 Playwright 对象是不安全的，我们建议你为每个线程创建 Playwright
实例并在该线程上独占使用它。以下是如何并行运行多个测试类的示例。

使用 [`@TestInstance(TestInstance.Lifecycle.PER_CLASS)`](https://junit.org/junit5/docs/current/api/org.junit.jupiter.api/org/junit/jupiter/api/TestInstance.html)
注解使 JUnit 为该类中的所有测试方法创建一个类实例（默认情况下，JUnit 会为每个测试方法创建一个新的类实例）。将 [Playwright](/java/api/class-playwright) 和 [Browser](/java/api/class-browser) 对象存储在实例字段中。它们将在测试之间共享。该类的每个实例将使用其
自己的 Playwright 副本。

```java
// 子类将继承 PER_CLASS 行为。
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TestFixtures {
  // 在类中的所有测试之间共享。
  Playwright playwright;
  Browser browser;

  @BeforeAll
  void launchBrowser() {
    playwright = Playwright.create();
    browser = playwright.chromium().launch();
  }

  @AfterAll
  void closeBrowser() {
    playwright.close();
  }

  // 每个测试方法的新实例。
  BrowserContext context;
  Page page;

  @BeforeEach
  void createContextAndPage() {
    context = browser.newContext();
    page = context.newPage();
  }

  @AfterEach
  void closeContext() {
    context.close();
  }
}

class Test1 extends TestFixtures {
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

class Test2 extends TestFixtures {
  @Test
  void shouldReturnInnerHTML() {
    page.setContent("<div>hello</div>");
    assertEquals("hello", page.innerHTML("css=div"));
  }

  @Test
  void shouldClickButton() {
    Page popup = page.waitForPopup(() -> {
      page.evaluate("window.open('about:blank');");
    });
    assertEquals("about:blank", popup.url());
  }
}
```

配置 JUnit 在每个类中按顺序运行测试，并在并行线程上运行多个类（最大
线程数等于 CPU 核心数的 1/2）：

```bash
junit.jupiter.execution.parallel.enabled = true
junit.jupiter.execution.parallel.mode.default = same_thread
junit.jupiter.execution.parallel.mode.classes.default = concurrent
junit.jupiter.execution.parallel.config.strategy=dynamic
junit.jupiter.execution.parallel.config.dynamic.factor=0.5
```

### 使用 Gradle

你可以使用 Groovy 或 Kotlin 编写的 Gradle 构建配置脚本。

<Tabs group-id="jvm-language" default-value="groovy" :tabs='[{"label":"Groovy","value":"groovy"},{"label":"Kotlin","value":"kotlin"}]'>

<TabItem value="groovy">

::: code-group

```groovy [build.gradle]
plugins {
  application
  id 'java'
}

repositories {
  mavenCentral()
}

dependencies {
  implementation 'com.microsoft.playwright:playwright:%%VERSION%%'
}

application {
  mainClass = 'org.example.App'
}

// 用法: ./gradlew playwright --args="help"
task playwright(type: JavaExec) {
  classpath sourceSets.test.runtimeClasspath
  mainClass = 'com.microsoft.playwright.CLI'
}

test {
  useJUnitPlatform()
}
```

:::

</TabItem>

<TabItem value="kotlin">

::: code-group

```groovy [build.gradle.kts]
plugins {
  application
  id("java")
}

repositories {
  mavenCentral()
}

dependencies {
  implementation("com.microsoft.playwright:playwright:%%VERSION%%")
}

application {
  mainClass.set("org.example.App")
}

// 用法: ./gradlew playwright --args="help"
tasks.register<JavaExec>("playwright") {
  classpath(sourceSets["test"].runtimeClasspath)
  mainClass.set("com.microsoft.playwright.CLI")
}

tasks.test {
  useJUnitPlatform()
  testLogging {
    events("passed", "skipped", "failed")
  }
}
```

:::

</TabItem>

</Tabs>

然后可以按以下方式启动测试：

```bash
./gradlew run
```

此外，可以通过以下方式运行 Playwright 命令行工具：

```bash
./gradlew playwright --args="help"
```

## TestNG

在 [TestNG](https://testng.org/) 中，你可以在 [@BeforeClass](https://javadoc.io/doc/org.testng/testng/latest/org/testng/annotations/BeforeClass.html) 方法中初始化 [Playwright](/java/api/class-playwright) 和 [Browser](/java/api/class-browser)，
并在 [@AfterClass](https://javadoc.io/doc/org.testng/testng/latest/org/testng/annotations/AfterClass.html) 中销毁它们。在下面的示例中，所有三个测试方法使用相同的
[Browser](/java/api/class-browser)。每个测试使用自己的 [BrowserContext](/java/api/class-browsercontext) 和 [Page](/java/api/class-page)。

```java
package org.example;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import org.testng.annotations.*;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class TestExample {
  // 在此类中的所有测试之间共享。
  Playwright playwright;
  Browser browser;

  // 每个测试方法的新实例。
  BrowserContext context;
  Page page;

  @BeforeClass
  void launchBrowser() {
    playwright = Playwright.create();
    browser = playwright.chromium().launch();
  }

  @AfterClass
  void closeBrowser() {
    playwright.close();
  }

  @BeforeMethod
  void createContextAndPage() {
    context = browser.newContext();
    page = context.newPage();
  }

  @AfterMethod
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
