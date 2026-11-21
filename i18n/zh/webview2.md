---
title: "WebView2"
---

# WebView2

## 简介

以下将解释如何将 Playwright 与 [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/) 一起使用。WebView2 是一个 WinForms 控件，它在底层使用 Microsoft Edge 来渲染 Web 内容。它是 Microsoft Edge 浏览器的一部分，可在 Windows 10 和 Windows 11 上使用。Playwright 可用于自动化 WebView2 应用程序，并可用于测试 WebView2 中的 Web 内容。为了连接到 WebView2，Playwright 使用 [`browserType.connectOverCDP()`](/api/class-browsertype#browser-type-connect-over-cdp)，通过 Chrome DevTools Protocol (CDP) 连接到它。

## 概述

可以通过设置 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` 环境变量为 `--remote-debugging-port=9222` 或调用带有 `--remote-debugging-port=9222` 参数的 [EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22) 来指示 WebView2 控件监听传入的 CDP 连接。这将启动启用了 Chrome DevTools Protocol 的 WebView2 进程，允许 Playwright 进行自动化。9222 在本例中是示例端口，但也可以使用任何其他未使用的端口。

一旦您的包含 WebView2 控件的应用程序运行起来，您可以通过 Playwright 连接到它：

```js
const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
const context = browser.contexts()[0];
const page = context.pages()[0];
```

为确保 WebView2 控件准备就绪，您可以等待 [`CoreWebView2InitializationCompleted`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.corewebview2initializationcompleted?view=webview2-dotnet-1.0.1343.22) 事件：

## 编写和运行测试

默认情况下，WebView2 控件将为所有实例使用相同的用户数据目录。这意味着如果您并行运行多个测试，它们会相互干扰。为避免这种情况，您应该将 `WEBVIEW2_USER_DATA_FOLDER` 环境变量（或使用 [WebView2.EnsureCoreWebView2Async 方法](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)）设置为每个测试不同的文件夹。这将确保每个测试在其自己的用户数据目录中运行。

使用以下代码，Playwright 将作为子进程运行您的 WebView2 应用程序，为其分配唯一的用户数据目录，并将 [Page](/api/class-page) 实例提供给您的测试：

::: code-group

```js [webView2Test.ts]
import { test as base } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import childProcess from 'child_process';

const EXECUTABLE_PATH = path.join(
    __dirname,
    '../../webview2-app/bin/Debug/net8.0-windows/webview2.exe',
);

export const test = base.extend({
  browser: async ({ playwright }, use, testInfo) => {
    const cdpPort = 10000 + testInfo.workerIndex;
    // 确保可执行文件存在且可执行
    fs.accessSync(EXECUTABLE_PATH, fs.constants.X_OK);
    const userDataDir = path.join(
        fs.realpathSync.native(os.tmpdir()),
        `playwright-webview2-tests/user-data-dir-${testInfo.workerIndex}`,
    );
    const webView2Process = childProcess.spawn(EXECUTABLE_PATH, [], {
      shell: true,
      env: {
        ...process.env,
        WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${cdpPort}`,
        WEBVIEW2_USER_DATA_FOLDER: userDataDir,
      }
    });
    await new Promise<void>(resolve => webView2Process.stdout.on('data', data => {
      if (data.toString().includes('WebView2 initialized'))
        resolve();
    }));
    const browser = await playwright.chromium.connectOverCDP(`http://127.0.0.1:${cdpPort}`);
    await use(browser);
    await browser.close();
    childProcess.execSync(`taskkill /pid ${webView2Process.pid} /T /F`);
    fs.rmdirSync(userDataDir, { recursive: true });
  },
  context: async ({ browser }, use) => {
    const context = browser.contexts()[0];
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0];
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

:::

::: code-group

```js [example.spec.ts]
import { test, expect } from './webView2Test';

test('测试 WebView2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const getStarted = page.getByText('Get Started');
  await expect(getStarted).toBeVisible();
});
```

:::

## 调试

在您的 webview2 控件内部，您只需右键单击打开上下文菜单并选择"检查"以打开 DevTools，或按 <kbd>F12</kbd>。您还可以使用 [WebView2.CoreWebView2.OpenDevToolsWindow](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.opendevtoolswindow?view=webview2-dotnet-1.0.1462.37) 方法以编程方式打开 DevTools。

有关调试测试的信息，请参阅 Playwright [调试指南](./debug)。
