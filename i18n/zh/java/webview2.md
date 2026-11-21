---
title: "WebView2"
---

# WebView2

## 简介

以下将解释如何将 Playwright 与 [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/) 一起使用。WebView2 是一个 WinForms 控件，它在底层使用 Microsoft Edge 来渲染 Web 内容。它是 Microsoft Edge 浏览器的一部分，可在 Windows 10 和 Windows 11 上使用。Playwright 可用于自动化 WebView2 应用程序，并可用于测试 WebView2 中的 Web 内容。为了连接到 WebView2，Playwright 使用 [`browserType.connectOverCDP()`](/java/api/class-browsertype#browser-type-connect-over-cdp) 通过 Chrome DevTools Protocol (CDP) 连接到它。

## 概述

可以通过设置 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` 环境变量为 `--remote-debugging-port=9222` 或使用 `--remote-debugging-port=9222` 参数调用 [EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22) 来指示 WebView2 控件监听传入的 CDP 连接。这将启用 Chrome DevTools Protocol 启动 WebView2 进程，从而允许 Playwright 进行自动化。9222 在此示例中是一个示例端口，但也可以使用任何其他未使用的端口。

一旦你的带有 WebView2 控件的应用程序正在运行，你就可以通过 Playwright 连接到它：

```java
Browser browser = playwright.chromium().connectOverCDP("http://localhost:9222");
BrowserContext context = browser.contexts().get(0);
Page page = context.pages().get(0);
```

为确保 WebView2 控件已准备就绪，你可以等待 [`CoreWebView2InitializationCompleted`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.corewebview2initializationcompleted?view=webview2-dotnet-1.0.1343.22) 事件：

## 编写和运行测试

默认情况下，WebView2 控件将为所有实例使用相同的用户数据目录。这意味着如果你并行运行多个测试，它们将相互干扰。为避免这种情况，你应该将 `WEBVIEW2_USER_DATA_FOLDER` 环境变量（或使用 [WebView2.EnsureCoreWebView2Async 方法](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)）设置为每个测试的不同文件夹。这将确保每个测试在其自己的用户数据目录中运行。

使用以下代码，Playwright 将作为子进程运行你的 WebView2 应用程序，为其分配唯一的用户数据目录，并将 [Page](/java/api/class-page) 实例提供给你的测试：

::: code-group

```java [WebView2Process.java]
package com.example;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class WebView2Process {
  public int cdpPort;
  private Path _dataDir;
  private Process _process;
  private Path _executablePath = Path.of("../webview2-app/bin/Debug/net8.0-windows/webview2.exe");

  public WebView2Process() throws IOException {
    cdpPort = nextFreePort();
    _dataDir = Files.createTempDirectory("pw-java-webview2-tests-");

    if (!Files.exists(_executablePath)) {
      throw new RuntimeException("未找到可执行文件: " + _executablePath);
    }
    ProcessBuilder pb = new ProcessBuilder().command(_executablePath.toAbsolutePath().toString());
    Map<String, String> envMap = pb.environment();
    envMap.put("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--remote-debugging-port=" + cdpPort);
    envMap.put("WEBVIEW2_USER_DATA_FOLDER", _dataDir.toString());
    _process = pb.start();
    // 等待直到打印 "WebView2 initialized"
    BufferedReader reader = new BufferedReader(new InputStreamReader(_process.getInputStream()));
    while (true) {
      String line = reader.readLine();
      if (line == null) {
        throw new RuntimeException("WebView2 进程已退出");
      }
      if (line.contains("WebView2 initialized")) {
        break;
      }
    }
  }

  private static final AtomicInteger nextUnusedPort = new AtomicInteger(9000);

  private static boolean available(int port) {
    try (ServerSocket ignored = new ServerSocket(port)) {
      return true;
    } catch (IOException ignored) {
      return false;
    }
  }

  static int nextFreePort() {
    for (int i = 0; i < 100; i++) {
      int port = nextUnusedPort.getAndIncrement();
      if (available(port)) {
        return port;
      }
    }
    throw new RuntimeException("无法找到空闲端口: " + nextUnusedPort.get());
  }

  public void dispose() {
    _process.destroy();
    try {
      _process.waitFor();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }
}
```

:::

::: code-group

```java [TestExample.java]
package com.example;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.io.IOException;

public class TestExample {
  // 在此类中的所有测试之间共享。
  static WebView2Process webview2Process;
  static Playwright playwright;
  static Browser browser;
  static BrowserContext context;
  static Page page;

  @BeforeAll
  static void launchBrowser() throws IOException {
    playwright = Playwright.create();
    webview2Process = new WebView2Process();
    browser = playwright.chromium().connectOverCDP("http://127.0.0.1:" + webview2Process.cdpPort);
    context = browser.contexts().get(0);
    page = context.pages().get(0);
  }

  @AfterAll
  static void closeBrowser() {
    webview2Process.dispose();
  }

  @Test
  public void shouldClickButton() {
    page.navigate("https://playwright.dev");
    Locator gettingStarted = page.getByText("Get started");
    assertThat(gettingStarted).isVisible();
  }
}
```

:::

## 调试

在你的 webview2 控件内，你可以右键单击打开上下文菜单并选择"检查"来打开开发者工具，或按 <kbd>F12</kbd>。你也可以使用 [WebView2.CoreWebView2.OpenDevToolsWindow](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.opendevtoolswindow?view=webview2-dotnet-1.0.1462.37) 方法以编程方式打开开发者工具。

有关调试测试的信息，请参阅 Playwright [调试指南](./debug)。
