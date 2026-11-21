---
title: "测试生成器"
---

# 测试生成器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

Playwright 具备在你在浏览器中执行操作时为你生成测试的能力，这是快速开始测试的好方法。Playwright 将查看你的页面并找出最佳定位器，优先考虑[角色、文本和测试 ID 定位器](./locators.md)。如果生成器找到多个匹配定位器的元素，它将改进定位器使其具有弹性，唯一标识目标元素。

## 使用 Playwright Inspector 生成测试

运行 `codegen` 命令时会打开两个窗口：一个是你与要测试的网站交互的浏览器窗口，另一个是 Playwright Inspector 窗口，你可以在其中录制测试然后将其复制到编辑器中。

### 运行 Codegen

使用 `codegen` 命令运行测试生成器，后跟你要为其生成测试的网站 URL。URL 是可选的，你也可以不带 URL 运行命令，然后直接在浏览器窗口中添加 URL。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen demo.playwright.dev/todomvc
```

### 录制测试

运行 `codegen` 命令并在浏览器窗口中执行操作。Playwright 将生成用户交互的代码，你可以在 Playwright Inspector 窗口中看到。完成录制测试后，停止录制并按 **copy** 按钮将生成的测试复制到编辑器中。

使用测试生成器，你可以录制：
* 通过简单地与页面交互来执行点击或填充等操作
* 通过点击工具栏中的一个图标然后点击页面上的元素来进行断言。你可以选择：
  * `'assert visibility'`（断言可见性）来断言元素可见
  * `'assert text'`（断言文本）来断言元素包含特定文本
  * `'assert value'`（断言值）来断言元素具有特定值

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/53bdfb6f-d462-4ce0-ab95-0619faaebf1e" alt="录制测试" width="2788" height="1824" />

###### 
当你完成与页面的交互后，按 **record** 按钮停止录制，并使用 **copy** 按钮将生成的代码复制到编辑器。

使用 **clear** 按钮清除代码以重新开始录制。完成后，关闭 Playwright inspector 窗口或停止终端命令。

### 生成定位器

你可以使用测试生成器生成[定位器](/locators.md)。
* 按 `'Record'` 按钮停止录制，`'Pick Locator'` 按钮将出现。
* 点击 `'Pick Locator'` 按钮，然后将鼠标悬停在浏览器窗口中的元素上，查看每个元素下方高亮显示的定位器。
* 要选择定位器，点击你想要定位的元素，该定位器的代码将出现在 Pick Locator 按钮旁边的字段中。
* 然后你可以在此字段中编辑定位器以进行微调，或使用复制按钮将其复制并粘贴到代码中。

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/1478f56f-422f-4276-9696-0674041f11dc" alt="选择定位器" width="2788" height="1824" />

## 模拟

你可以使用测试生成器生成使用模拟的测试，以便为特定视口、设备、配色方案生成测试，以及模拟地理位置、语言或时区。测试生成器还可以在保留身份验证状态的情况下生成测试。

### 模拟视口大小

Playwright 打开一个视口设置为特定宽度和高度的浏览器窗口，并且不是响应式的，因为测试需要在相同条件下运行。使用 `--viewport` 选项生成具有不同视口大小的测试。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen --viewport-size="800,600" playwright.dev
```

###### 
<img height="1496" width="1740" alt="Codegen 为 playwright.dev 网站生成具有特定视口的测试代码 dotnet" src="https://user-images.githubusercontent.com/13063165/220403496-4a46a9a1-4bc4-43e7-8f22-9cc760ceadaf.png" />

### 模拟设备

使用 `--device` 选项在模拟移动设备的同时录制脚本和测试，该选项会设置视口大小和用户代理等。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen --device="iPhone 13" playwright.dev
```

###### 
<img height="1660" width="2600" alt="Codegen 为 playwright.dev 网站生成模拟 iPhone 13 的测试代码 csharp" src="https://user-images.githubusercontent.com/13063165/220923048-f13583b1-ab08-4702-ab74-58691d50acfe.png" />

### 模拟配色方案

使用 `--color-scheme` 选项在模拟配色方案的同时录制脚本和测试。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen --color-scheme=dark playwright.dev
```

###### 
<img height="1824" width="2788" alt="Codegen 为 playwright.dev 网站在深色模式下生成测试代码 csharp" src="https://user-images.githubusercontent.com/13063165/220930893-c1d0df65-c662-4b33-91eb-ea10552d7cc5.png" />

### 模拟地理位置、语言和时区

使用 `--timezone`、`--geolocation` 和 `--lang` 选项在模拟时区、语言和位置的同时录制脚本和测试。页面打开后：
1. 接受 cookies
1. 在右上角，点击"定位我"按钮查看地理位置的效果。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen --timezone="Europe/Rome" --geolocation="41.890221,12.492348" --lang="it-IT" bing.com/maps
```

###### 
<img height="1824" width="2788" alt="Codegen 为 bing 地图生成测试代码，显示时区、地理位置为意大利罗马，使用意大利语 csharp" src="https://user-images.githubusercontent.com/13063165/220932688-a47df2a8-332b-47a4-9580-7d351def9f50.png" />

### 保留身份验证状态

使用 `--save-storage` 运行 `codegen` 以在会话结束时保存 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 和 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 数据。这对于单独录制身份验证步骤并在以后录制更多测试时重用非常有用。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen github.com/microsoft/playwright --save-storage=auth.json
```

###### 
<img height="1824" width="2788" alt="登录前的 github 页面 csharp" src="https://user-images.githubusercontent.com/13063165/220929619-28d4ed0c-d172-4cf1-b30b-bf5bed0e07bf.png" />

#### 登录

执行身份验证并关闭浏览器后，`auth.json` 将包含存储状态，你可以在测试中重用。

<img height="1824" width="2788" alt="登录 GitHub 屏幕" src="https://user-images.githubusercontent.com/13063165/220561688-04b2b984-4ba6-4446-8b0a-8058876e2a02.png" />

确保只在本地使用 `auth.json`，因为它包含敏感信息。将其添加到 `.gitignore` 或在完成生成测试后删除它。

#### 加载身份验证状态

使用 `--load-storage` 运行以使用之前从 `auth.json` 加载的存储。这样，所有 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 和 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 数据将被恢复，使大多数 Web 应用程序进入已验证状态，而无需再次登录。这意味着你可以从已登录状态继续生成测试。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen --load-storage=auth.json github.com/microsoft/playwright
```

###### 
<img height="1824" width="2788" alt="github 已登录显示使用 load storage scharp" src="https://user-images.githubusercontent.com/13063165/220928354-caa0e958-fe09-4125-9b54-67483064da51.png" />

#### 使用现有的 userDataDir

使用 `--user-data-dir` 运行 `codegen` 以为浏览器会话设置固定的[用户数据目录](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir)。如果你创建了自定义浏览器用户数据目录，codegen 将使用此现有浏览器配置文件并可以访问该配置文件中存在的任何身份验证状态。

::: warning
[从 Chrome 136 开始，默认用户数据目录无法通过自动化工具访问](https://developer.chrome.com/blog/remote-debugging-port)，例如 Playwright。你必须创建一个单独的用户数据目录用于测试。
:::

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen --user-data-dir=/path/to/your/browser/data/ github.com/microsoft/playwright
```

#### 使用 HTTP 凭证进行身份验证

使用 `--http-credentials` 运行 `codegen` 以使用 [HTTP 基本身份验证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication)进行身份验证。与嵌入在 URL 中的凭证不同，它们在录制会话期间会发送到任何请求它们的来源，并包含在生成的代码中。

```bash
pwsh bin/Debug/netX/playwright.ps1 codegen --http-credentials="username:password" example.com
```

## 使用自定义设置录制

如果你想在一些非标准设置中使用 codegen（例如，使用 [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route)），可以调用 [`Page.PauseAsync()`](/dotnet/api/class-page#page-pause)，它将打开一个带有 codegen 控件的单独窗口。

```csharp
using Microsoft.Playwright;

using var playwright = await Playwright.CreateAsync();
var chromium = playwright.Chromium;
// 确保以有头模式运行。
var browser = await chromium.LaunchAsync(new() { Headless = false });

// 按你喜欢的方式设置上下文。
var context = await browser.NewContextAsync(); // 传递任何选项
await context.RouteAsync("**/*", route => route.ContinueAsync());

// 暂停页面，并手动开始录制。
var page = await context.NewPageAsync();
await page.PauseAsync();
```
