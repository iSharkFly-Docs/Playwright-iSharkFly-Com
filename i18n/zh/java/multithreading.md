---
title: "多线程"
---

# 多线程

## 简介

Playwright Java 不是线程安全的，也就是说，它的所有方法以及由它创建的所有对象（如 [BrowserContext](/java/api/class-browsercontext)、[Browser](/java/api/class-browser)、[Page](/java/api/class-page) 等）的方法都应该在创建 Playwright 对象的同一线程上调用，或者应该实现适当的同步机制以确保在任何给定时间只有一个线程调用 Playwright 方法。话虽如此，可以创建多个 Playwright 实例，每个实例在自己的线程上运行。

以下是一个示例，创建三个 playwright 实例，每个实例在自己的线程上运行。每个实例启动自己的浏览器进程并对其运行测试。

```java
package org.example;

import com.microsoft.playwright.*;

import java.nio.file.Paths;

import static java.util.Arrays.asList;

public class PlaywrightThread extends Thread {
  private final String browserName;

  private PlaywrightThread(String browserName) {
    this.browserName = browserName;
  }

  public static void main(String[] args) throws InterruptedException {
    // 为每个浏览器创建单独的 playwright 线程。
    for (String browserName: asList("chromium", "webkit", "firefox")) {
      Thread thread = new PlaywrightThread(browserName);
      thread.start();
    }
  }

  @Override
  public void run() {
    try (Playwright playwright = Playwright.create()) {
      BrowserType browserType = getBrowserType(playwright, browserName);
      Browser browser = browserType.launch();
      Page page = browser.newPage();
      page.navigate("https://playwright.dev/");
      page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("user-agent-" + browserName + ".png")));
    }
  }

  private static BrowserType getBrowserType(Playwright playwright, String browserName) {
    switch (browserName) {
      case "chromium":
        return playwright.chromium();
      case "webkit":
        return playwright.webkit();
      case "firefox":
        return playwright.firefox();
      default:
        throw new IllegalArgumentException();
    }
  }
}
```

## 同步 API 和事件分发

在同步 Playwright API 中，所有事件只有在 Playwright 运行其消息循环时才会被分发。
当你调用任何 API 方法时会自动发生这种情况，如果堆栈上没有活动的
Playwright 调用则不会发生。如果你需要等待事件，最好的方式是使用
`waitFor*` 方法之一。

### Page.waitForTimeout() 与 Thread.sleep()

同步 API 的一个后果是，如果你出于任何原因调用 `Thread.sleep()`，在线程休眠期间不会触发任何事件。如果你希望在程序

执行暂停时仍然能够分发来自浏览器的事件，请使用 [`page.waitForTimeout()`](/java/api/class-page#page-wait-for-timeout) 或 [`frame.waitForTimeout()`](/java/api/class-frame#frame-wait-for-timeout)：

```java
page.onResponse(response -> System.out.println(response.url()));
page.navigate("https://playwright.dev");
System.out.println("-- 导航完成 --");
// 阻塞当前线程 60 秒并确保事件被分发。
page.waitForTimeout(60_000);
```
