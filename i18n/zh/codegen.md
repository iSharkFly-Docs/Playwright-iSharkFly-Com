---
title: "测试生成器"
---

# 测试生成器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

Playwright 具有在您在浏览器中执行操作时自动生成测试的能力，这是快速开始测试的绝佳方式。Playwright 会分析您的页面并找出最佳的定位器，优先使用[角色、文本和测试 ID 定位器](./locators.md)。如果生成器发现多个元素匹配该定位器，它会改进定位器使其更具弹性，以唯一标识目标元素。

## 在 VS Code 中生成测试

安装 VS Code 扩展并直接从 VS Code 生成测试。该扩展可在 [VS Code 市场](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)获取。查看我们的 [VS Code 入门指南](./getting-started-vscode.md)。

<LiteYouTube
id="LM4yqrOzmFE"
title="在 VS Code 中生成 Playwright 测试"
/>

### 录制新测试

要录制测试，请点击测试侧边栏中的 **Record new** 按钮。这将创建一个 `test-1.spec.ts` 文件并打开一个浏览器窗口。

<img height="1940" width="2770" alt="在 VS Code 中录制新测试" src="https://user-images.githubusercontent.com/13063165/220961665-615d0ab8-3f0b-439c-ad0b-0424d9aa154b.png" />

在浏览器中访问您想要测试的 URL，然后开始点击以录制您的用户操作。

<img src="https://github.com/microsoft/playwright/assets/13063165/1d4c8f37-8325-4816-a665-d0e95e63f509" alt="生成用户操作" width="2788" height="1824" />

Playwright 会录制您的操作并直接在 VS Code 中生成测试代码。您还可以通过选择工具栏中的图标然后点击页面上的元素来生成断言。可以生成以下断言：
* `'assert visibility'` 断言元素可见
* `'assert text'` 断言元素包含特定文本
* `'assert value'` 断言元素具有特定值

<img src="https://github.com/microsoft/playwright/assets/13063165/d131eb35-b2ca-4bf4-a8ac-88b6e40dcf07" alt="生成断言" width="2788" height="1400" />

录制完成后，点击 **cancel** 按钮或关闭浏览器窗口。然后您可以检查 `test-1.spec.ts` 文件并根据需要手动改进。

<img src="https://github.com/microsoft/playwright/assets/13063165/2ba4c212-4713-460a-b054-6dc6b67a9a7c" alt="生成测试的代码" width="3126" height="1654" />

### 在光标处录制

要从测试中的特定位置开始录制，请将光标移动到您想要录制更多操作的位置，然后点击测试侧边栏中的 **Record at cursor** 按钮。如果您的浏览器窗口尚未打开，请先在勾选"显示浏览器"的情况下运行测试，然后点击 **Record at cursor** 按钮。

<img src="https://github.com/microsoft/playwright/assets/13063165/77948ab8-92a2-435f-9833-0944da5ae664" alt="在 VS Code 中在光标处录制" width="3126" height="1756" />

在浏览器窗口中开始执行您想要录制的操作。

<img height="1824" width="2788" alt="在待办事项应用中添加喂狗任务" src="https://user-images.githubusercontent.com/13063165/220960770-6435cec7-1723-42a8-8c1f-8244e2d800c7.png" />

在 VS Code 的测试文件中，您将看到新生成的操作被添加到测试中的光标位置。

<img src="https://github.com/microsoft/playwright/assets/13063165/4f4bb34e-9cda-41fe-bf65-8d8016d84c7f" alt="生成测试的代码" width="3180" height="1944" />

### 生成定位器

您可以使用测试生成器生成定位器。
- 点击测试侧边栏中的 **Pick locator** 按钮，然后将鼠标悬停在浏览器窗口中的元素上，查看每个元素下方高亮显示的[定位器](./locators.md)。
- 点击您需要的元素，它将显示在 VS Code 的 **Pick locator** 框中。
- 按键盘上的 <kbd>Enter</kbd> 将定位器复制到剪贴板，然后粘贴到代码中的任意位置。如果要取消，请按"escape"。

<img height="1744" width="3282" alt="在 VS Code 中选取定位器" src="https://user-images.githubusercontent.com/13063165/220958368-95b03620-3c9b-40a8-be74-01c96ba03cad.png" />

## 使用 Playwright Inspector 生成测试

运行 `codegen` 命令时会打开两个窗口：一个是您与要测试的网站交互的浏览器窗口，另一个是 Playwright Inspector 窗口，您可以在其中录制测试然后将它们复制到编辑器中。

### 运行 Codegen

使用 `codegen` 命令运行测试生成器，后面跟上您想要生成测试的网站 URL。URL 是可选的，您也可以不带 URL 运行命令，然后直接在浏览器窗口中输入 URL。

```bash
npx playwright codegen demo.playwright.dev/todomvc
```

### 录制测试

运行 `codegen` 命令并在浏览器窗口中执行操作。Playwright 将为用户交互生成代码，您可以在 Playwright Inspector 窗口中看到。完成测试录制后，停止录制并按 **copy** 按钮将生成的测试复制到编辑器中。

使用测试生成器，您可以录制：
* 通过简单地与页面交互来录制点击或填充等操作
* 通过点击工具栏中的图标然后点击页面上的元素来录制断言。您可以选择：
  * `'assert visibility'` 断言元素可见
  * `'assert text'` 断言元素包含特定文本
  * `'assert value'` 断言元素具有特定值

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/34a79ea1-639e-4cb3-8115-bfdc78e3d34d" alt="录制测试" width="2788" height="1824" />

###### 
完成与页面的交互后，按 **record** 按钮停止录制，然后使用 **copy** 按钮将生成的代码复制到编辑器中。

使用 **clear** 按钮清除代码以重新开始录制。完成后，关闭 Playwright inspector 窗口或停止终端命令。

### 生成定位器

您可以使用测试生成器生成[定位器](/locators.md)。
* 按 `'Record'` 按钮停止录制，`'Pick Locator'` 按钮将出现。
* 点击 `'Pick Locator'` 按钮，然后将鼠标悬停在浏览器窗口中的元素上，查看每个元素下方高亮显示的定位器。
* 要选择定位器，请点击您想要定位的元素，该定位器的代码将出现在 Pick Locator 按钮旁边的字段中。
* 然后您可以在此字段中编辑定位器以进行微调，或使用复制按钮复制它并粘贴到代码中。

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/2c8a12e2-4e98-4fdd-af92-1d73ae696d86" alt="选取定位器" width="2788" height="1824" />

## 模拟

您可以使用测试生成器通过模拟来生成测试，以便为特定视口、设备、配色方案生成测试，以及模拟地理位置、语言或时区。测试生成器还可以在保留身份验证状态的情况下生成测试。

### 模拟视口大小

Playwright 打开的浏览器窗口具有设置为特定宽度和高度的视口，并且不是响应式的，因为测试需要在相同条件下运行。使用 `--viewport` 选项生成具有不同视口大小的测试。

```bash
npx playwright codegen --viewport-size="800,600" playwright.dev
```

###### 
<img height="1496" width="1740" alt="为 playwright.dev 网站生成具有特定视口的测试代码" src="https://user-images.githubusercontent.com/13063165/220402029-f90d1c9f-d740-4c0f-acc8-95235ee83f85.png" />

### 模拟设备

使用 `--device` 选项在模拟移动设备的同时录制脚本和测试，该选项会设置视口大小和用户代理等。

```bash
npx playwright codegen --device="iPhone 13" playwright.dev
```

###### 
<img height="1660" width="2600" alt="为 playwright.dev 网站生成模拟 iPhone 13 的测试代码" src="https://user-images.githubusercontent.com/13063165/220921482-dc4f5532-9dce-40bd-8a28-e0d87d26a601.png" />

### 模拟配色方案

使用 `--color-scheme` 选项在模拟配色方案的同时录制脚本和测试。

```bash
npx playwright codegen --color-scheme=dark playwright.dev
```

###### 
<img height="1824" width="2788" alt="为 playwright.dev 网站生成深色模式的测试代码" src="https://user-images.githubusercontent.com/13063165/220930273-f3a25bae-64dd-4bbb-99ed-1e97c0cb1ebf.png" />

### 模拟地理位置、语言和时区

使用 `--timezone`、`--geolocation` 和 `--lang` 选项在模拟时区、语言和位置的同时录制脚本和测试。页面打开后：
1. 接受 cookies
1. 在右上角，点击定位按钮查看地理位置的实际效果。

```bash
npx playwright codegen --timezone="Europe/Rome" --geolocation="41.890221,12.492348" --lang="it-IT" bing.com/maps
```

###### 
<img height="1824" width="2788" alt="为必应地图生成显示时区、地理位置为意大利罗马且使用意大利语的测试代码" src="https://user-images.githubusercontent.com/13063165/220931996-d3144421-8d3b-4f9f-896c-769c01566c01.png" />

### 保留身份验证状态

使用 `--save-storage` 运行 `codegen` 以在会话结束时保存 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 和 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 数据。这对于单独录制身份验证步骤并在以后录制更多测试时重用非常有用。

```bash
npx playwright codegen github.com/microsoft/playwright --save-storage=auth.json
```

###### 
<img height="1824" width="2788" alt="登录前的 GitHub 页面" src="https://user-images.githubusercontent.com/13063165/220929062-88dfe567-0c6d-4e49-b9f9-74ae241fb8c7.png" />

#### 登录

执行身份验证并关闭浏览器后，`auth.json` 将包含存储状态，您可以在测试中重用它。

<img height="1824" width="2788" alt="GitHub 登录屏幕" src="https://user-images.githubusercontent.com/13063165/220561688-04b2b984-4ba6-4446-8b0a-8058876e2a02.png" />

确保仅在本地使用 `auth.json`，因为它包含敏感信息。将其添加到 `.gitignore` 或在生成测试完成后删除它。

#### 加载身份验证状态

使用 `--load-storage` 运行以使用之前从 `auth.json` 加载的存储。这样，所有 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 和 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 数据都将被恢复，使大多数 Web 应用无需再次登录即可进入已认证状态。这意味着您可以继续从已登录状态生成测试。

```bash
npx playwright codegen --load-storage=auth.json github.com/microsoft/playwright
```

###### 
<img height="1824" width="2788" alt="GitHub 已登录状态显示使用加载存储" src="https://user-images.githubusercontent.com/13063165/220927873-9e55fdda-2def-45c1-9a1b-bcc851885f96.png" />

#### 使用现有的 userDataDir

使用 `--user-data-dir` 运行 `codegen` 以为浏览器会话设置固定的[用户数据目录](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir)。如果您创建了自定义浏览器用户数据目录，codegen 将使用此现有浏览器配置文件并可以访问该配置文件中存在的任何身份验证状态。

::: warning
[从 Chrome 136 开始，默认用户数据目录无法通过自动化工具访问](https://developer.chrome.com/blog/remote-debugging-port)，例如 Playwright。您必须创建一个单独的用户数据目录用于测试。
:::

```bash
npx playwright codegen --user-data-dir=/path/to/your/browser/data/ github.com/microsoft/playwright
```

#### 使用 HTTP 凭据进行身份验证

使用 `--http-credentials` 运行 `codegen` 以通过 [HTTP 基本身份验证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication)进行身份验证。与嵌入在 URL 中的凭据不同，它们会在录制会话期间发送到任何请求它们的来源，并包含在生成的代码中。

```bash
npx playwright codegen --http-credentials="username:password" example.com
```

## 使用自定义设置录制

如果您想在某些非标准设置中使用 codegen（例如，使用 [`browserContext.route()`](/api/class-browsercontext#browser-context-route)），可以调用 [`page.pause()`](/api/class-page#page-pause)，这将打开一个带有 codegen 控件的单独窗口。

```js
const { chromium } = require('@playwright/test');

(async () => {
  // 确保以有头模式运行。
  const browser = await chromium.launch({ headless: false });

  // 根据需要设置上下文。
  const context = await browser.newContext({ /* 传入任何选项 */ });
  await context.route('**/*', route => route.continue());

  // 暂停页面，手动开始录制。
  const page = await context.newPage();
  await page.pause();
})();
```
