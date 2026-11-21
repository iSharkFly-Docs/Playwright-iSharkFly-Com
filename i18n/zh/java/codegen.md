---
title: "测试生成器"
---

# 测试生成器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

Playwright 具有在您在浏览器中执行操作时为您生成测试的能力，是快速开始测试的好方法。Playwright 会查看您的页面并找出最佳定位器，优先考虑[角色、文本和测试 ID 定位器](./locators.md)。如果生成器找到多个匹配定位器的元素，它将改进定位器使其具有弹性，以唯一标识目标元素。

## 使用 Playwright Inspector 生成测试

运行 `codegen` 命令时会打开两个窗口，一个浏览器窗口用于与您想要测试的网站交互，一个 Playwright Inspector 窗口用于记录测试，然后将它们复制到编辑器中。

### 运行 Codegen

使用 `codegen` 命令运行测试生成器，后跟您要为其生成测试的网站 URL。URL 是可选的，您始终可以在不使用 URL 的情况下运行命令，然后直接在浏览器窗口中添加 URL。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen demo.playwright.dev/todomvc"
```

### 录制测试

运行 `codegen` 命令并在浏览器窗口中执行操作。Playwright 将为用户交互生成代码，您可以在 Playwright Inspector 窗口中看到。完成录制测试后，停止录制并按**复制**按钮将生成的测试复制到编辑器中。

使用测试生成器，您可以录制：
* 通过简单地与页面交互来录制点击或填充等操作
* 通过点击工具栏中的图标之一然后点击页面上的元素来进行断言。您可以选择：
  * `'assert visibility'` 断言元素可见
  * `'assert text'` 断言元素包含特定文本
  * `'assert value'` 断言元素具有特定值

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/ec9c4071-4af8-4ae7-8b36-aebcc29bdbbb" alt="录制测试" width="2788" height="1824" />

###### 
完成与页面交互后，按**录制**按钮停止录制，并使用**复制**按钮将生成的代码复制到编辑器。

使用**清除**按钮清除代码以重新开始录制。完成后，关闭 Playwright Inspector 窗口或停止终端命令。

### 生成定位器

您可以使用测试生成器生成[定位器](/locators.md)。
* 按 `'Record'` 按钮停止录制，`'Pick Locator'` 按钮将出现。
* 点击 `'Pick Locator'` 按钮，然后将鼠标悬停在浏览器窗口中的元素上，查看每个元素下方突出显示的定位器。
* 要选择定位器，点击您要定位的元素，该定位器的代码将出现在 Pick Locator 按钮旁边的字段中。
* 然后您可以在此字段中编辑定位器以进行微调，或使用复制按钮复制它并粘贴到您的代码中。

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/733b48fd-5edf-4150-93f0-018adc52b6ff" alt="选择定位器" width="2700" height="1736" />

## 模拟

您可以使用测试生成器通过模拟生成测试，以便为特定视口、设备、配色方案生成测试，以及模拟地理位置、语言或时区。测试生成器还可以在保留身份验证状态的同时生成测试。

### 模拟视口大小

Playwright 打开一个视口设置为特定宽度和高度的浏览器窗口，并且不是响应式的，因为测试需要在相同条件下运行。使用 `--viewport` 选项生成具有不同视口大小的测试。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --viewport-size='800,600' playwright.dev"
```

###### 
<img height="1496" width="1740" alt="Codegen 为具有特定视口的 playwright.dev 网站生成测试代码 java" src="https://user-images.githubusercontent.com/13063165/220402748-12a856c2-b3ff-4155-b82d-64dad9c46886.png" />

### 模拟设备

使用 `--device` 选项在模拟移动设备时录制脚本和测试，该选项设置视口大小和用户代理等。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args='codegen --device="iPhone 13" playwright.dev'
```

###### 
<img height="1660" width="2600" alt="Codegen 为模拟 iPhone 13 的 playwright.dev 网站生成测试代码 java" src="https://user-images.githubusercontent.com/13063165/220922591-241e6a59-a920-4cb1-97a2-d46c33ea17c5.png" />

### 模拟配色方案

使用 `--color-scheme` 选项在模拟配色方案时录制脚本和测试。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --color-scheme=dark playwright.dev"
```

###### 
<img height="1824" width="2788" alt="Codegen 为深色模式下的 playwright.dev 网站生成测试代码 java" src="https://user-images.githubusercontent.com/13063165/220930514-3b105fab-c87e-4f58-affa-d11d570122a8.png" />

### 模拟地理位置、语言和时区

使用 `--timezone`、`--geolocation` 和 `--lang` 选项在模拟时区、语言和位置时录制脚本和测试。页面打开后：
1. 接受 cookies
1. 在右上角，点击定位按钮查看地理位置的实际效果。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args='codegen --timezone="Europe/Rome" --geolocation="41.890221,12.492348" --lang="it-IT" bing.com/maps'
```

###### 
<img height="1824" width="2788" alt="Codegen 为 bing 地图生成测试代码，显示时区、地理位置为意大利罗马，使用意大利语 java" src="https://user-images.githubusercontent.com/13063165/220932268-9012163f-7673-4072-aa91-13b3c8f57799.png" />

### 保留身份验证状态

使用 `--save-storage` 运行 `codegen` 以在会话结束时保存 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 和 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 数据。这对于单独记录身份验证步骤并在以后录制更多测试时重用它非常有用。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen github.com/microsoft/playwright  --save-storage=auth.json"
```

###### 
<img height="1824" width="2788" alt="登录前的 GitHub 页面 java" src="https://user-images.githubusercontent.com/13063165/220929236-08129e16-82a9-46a3-9f1c-3e59619c6289.png" />

#### 登录

执行身份验证并关闭浏览器后，`auth.json` 将包含存储状态，您可以在测试中重用它。

<img height="1824" width="2788" alt="GitHub 登录屏幕" src="https://user-images.githubusercontent.com/13063165/220561688-04b2b984-4ba6-4446-8b0a-8058876e2a02.png" />

确保仅在本地使用 `auth.json`，因为它包含敏感信息。将其添加到 `.gitignore` 或在生成测试完成后删除它。

#### 加载身份验证状态

使用 `--load-storage` 运行以使用先前从 `auth.json` 加载的存储。这样，所有 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 和 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 数据都将被恢复，使大多数 Web 应用程序进入已验证状态，无需再次登录。这意味着您可以从已登录状态继续生成测试。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --load-storage=auth.json github.com/microsoft/playwright"
```

###### 
<img height="1824" width="2788" alt="GitHub 已登录，显示使用 load storage java" src="https://user-images.githubusercontent.com/13063165/220928075-1e38347b-9d0d-4d9e-9a67-506c717893df.png" />

#### 使用现有的 userDataDir

使用 `--user-data-dir` 运行 `codegen` 以为浏览器会话设置固定的[用户数据目录](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir)。如果您创建自定义浏览器用户数据目录，codegen 将使用此现有浏览器配置文件并可以访问该配置文件中存在的任何身份验证状态。

::: warning
[从 Chrome 136 开始，默认用户数据目录无法通过自动化工具访问](https://developer.chrome.com/blog/remote-debugging-port)，例如 Playwright。您必须创建一个单独的用户数据目录用于测试。
:::

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --user-data-dir=/path/to/your/browser/data/ github.com/microsoft/playwright"
```

#### 使用 HTTP 凭据进行身份验证

使用 `--http-credentials` 运行 `codegen` 以使用 [HTTP 基本身份验证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication)进行身份验证。与嵌入在 URL 中的凭据不同，它们会在录制会话期间发送到请求它们的任何来源，并包含在生成的代码中。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args='codegen --http-credentials="username:password" example.com'
```

## 使用自定义设置录制

如果您想在一些非标准设置中使用 codegen（例如，使用 [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route)），可以调用 [`page.pause()`](/java/api/class-page#page-pause)，这将打开一个带有 codegen 控件的单独窗口。

```java
import com.microsoft.playwright.*;

public class Example {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      BrowserType chromium = playwright.chromium();
      // 确保以有头模式运行。
      Browser browser = chromium.launch(new BrowserType.LaunchOptions().setHeadless(false));
      // 根据需要设置上下文。
      BrowserContext context = browser.newContext(/* 传递任何选项 */);
      context.route("**/*", route -> route.resume());
      // 暂停页面，手动开始录制。
      Page page = context.newPage();
      page.pause();
    }
  }
}
```
