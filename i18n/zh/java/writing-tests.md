---
title: "编写测试"
---

# 编写测试

## 简介

Playwright 断言专为动态 Web 而创建。检查会自动重试，直到满足必要条件。Playwright 内置了[自动等待](./actionability.md)功能，这意味着它会在执行操作之前等待元素变为可操作状态。Playwright 提供 [assertThat](./test-assertions.md) 重载方法来编写断言。

请查看下面的示例测试，了解如何使用 Web 优先断言、定位器和选择器编写测试。

```java
package org.example;

import java.util.regex.Pattern;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class App {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();
            page.navigate("https://playwright.dev");

            // 期望标题"包含"某个子字符串。
            assertThat(page).hasTitle(Pattern.compile("Playwright"));

            // 创建一个定位器
            Locator getStarted = page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Get Started"));

            // 期望属性"严格等于"该值。
            assertThat(getStarted).hasAttribute("href", "/docs/intro");

            // 点击"开始"链接。
            getStarted.click();

            // 期望页面有一个名为"Installation"的标题。
            assertThat(page.getByRole(AriaRole.HEADING,
               new Page.GetByRoleOptions().setName("Installation"))).isVisible();
        }
    }
}
```

### 断言

Playwright 提供 [`assertThat`](./test-assertions.md) 重载方法，它会等待直到满足预期条件。

```java
import java.util.regex.Pattern;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

assertThat(page).hasTitle(Pattern.compile("Playwright"));
```

### 定位器

[定位器](./locators.md)是 Playwright 自动等待和重试能力的核心部分。定位器表示一种在任何时刻查找页面上元素的方法，用于对元素执行操作，如 `.click`、`.fill` 等。可以使用 [`page.locator()`](/java/api/class-page#page-locator) 方法创建自定义定位器。

```java
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

Locator getStarted = page.locator("text=Get Started");

assertThat(getStarted).hasAttribute("href", "/docs/intro");
getStarted.click();
```

Playwright 支持多种不同的定位器，如[角色](./locators.md#locate-by-role)、[文本](./locators.md#get-by-text)、[测试 ID](./locators.md#get-by-test-id) 等。在这篇[深入指南](./locators.md)中了解更多可用的定位器以及如何选择它们。

```java
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

assertThat(page.locator("text=Installation")).isVisible();
```

### 测试隔离

Playwright 有 [BrowserContext](/java/api/class-browsercontext) 的概念，它是一个内存中隔离的浏览器配置文件。建议为每个测试创建一个新的 [BrowserContext](/java/api/class-browsercontext)，以确保它们不会相互干扰。

```java
Browser browser = playwright.chromium().launch();
BrowserContext context = browser.newContext();
Page page = context.newPage();
```

## 下一步
- [运行单个测试、多个测试、有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen.md)
- [查看测试追踪](./trace-viewer-intro.md)
