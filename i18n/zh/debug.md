---
title: "调试测试"
---

# 调试测试

## VS Code 调试器

我们建议使用 [VS Code 扩展](./getting-started-vscode.md) 进行调试，以获得更好的开发体验。使用 VS Code 扩展，你可以直接在 VS Code 中调试测试，查看错误消息，设置断点并逐步执行测试。

<img height="1424" width="2538" alt="在调试模式下运行测试" src="https://user-images.githubusercontent.com/13063165/212740233-3f278825-13e7-4a88-a118-dd4478d43a16.png" />

### 错误消息

如果你的测试失败，VS Code 会直接在编辑器中显示错误消息，显示预期值、实际收到的值以及完整的调用日志。

<img height="1424" width="2538" alt="VS Code 中的错误消息" src="https://user-images.githubusercontent.com/13063165/212738654-b573b7c9-05be-476f-ab4c-201bf4265bc0.png" />

### 实时调试

你可以在 VS Code 中实时调试测试。在选中 `Show Browser` 选项后运行测试，点击 VS Code 中的任何定位器，它将在浏览器窗口中高亮显示。Playwright 还会显示是否有多个匹配项。

<img height="2184" width="2788" alt="VS Code 中的实时调试" src="https://user-images.githubusercontent.com/13063165/212884329-0755b007-0d69-4987-b084-38fd5bfb577d.png" />

你还可以在 VS Code 中编辑定位器，Playwright 会在浏览器窗口中实时显示更改。

<img height="2184" width="2788" alt="VS Code 中的实时调试" src="https://user-images.githubusercontent.com/13063165/212884772-5022d4b1-6fab-456f-88e3-506f2354e238.png" />

### 选择定位器

通过点击测试侧边栏中的 **Pick locator** 按钮，选择一个[定位器](./locators.md)并将其复制到测试文件中。然后在浏览器中点击你需要的元素，它将显示在 VS Code 的 **Pick locator** 框中。按键盘上的 'enter' 键将定位器复制到剪贴板，然后粘贴到代码中的任何位置。或者按 'escape' 取消。

<img height="1824" width="2788" alt="选择定位器" src="https://user-images.githubusercontent.com/13063165/212741666-6479a702-2517-44a3-9eca-e719e13b379c.png" />

Playwright 会查看你的页面并找出最佳定位器，优先使用[角色、文本和测试 ID 定位器](./locators.md)。如果 Playwright 找到多个匹配定位器的元素，它会改进定位器使其具有弹性并唯一标识目标元素，这样你就不必担心由于定位器导致的测试失败。

### 在调试模式下运行

要设置断点，点击要设置断点的行号旁边，直到出现红点。通过右键点击要运行的测试旁边的行，以调试模式运行测试。

<img height="1424" width="2538" alt="设置调试测试模式" src="https://user-images.githubusercontent.com/13063165/212739847-ecb7dcfe-8929-45f3-b24e-f9c4b592f430.png" />

浏览器窗口将打开，测试将运行并在设置断点的位置暂停。你可以从 VS Code 的菜单中逐步执行测试、暂停测试和重新运行测试。

<img height="1424" width="2538" alt="在调试模式下运行测试" src="https://user-images.githubusercontent.com/13063165/212740233-3f278825-13e7-4a88-a118-dd4478d43a16.png" />

### 使用 Chrome DevTools 调试测试

不要使用 `Debug Test`，选择 VS Code 中的 `Run Test`。启用 `Show Browser` 后，浏览器会话会被重用，让你可以打开 Chrome DevTools 持续调试测试和 Web 应用。

### 在不同浏览器中调试

默认情况下，使用 Chromium 配置文件进行调试。你可以通过右键点击测试侧边栏中的调试图标，并从下拉菜单中点击 'Select Default Profile' 选项，在不同浏览器上调试测试。

<img height="1724" width="2624" alt="在特定配置文件上调试" src="https://user-images.githubusercontent.com/13063165/212879469-436f8130-c62a-49e1-9d67-c1903b478d5f.png" />

然后选择你想用于调试测试的测试配置文件。每次以调试模式运行测试时，都会使用你选择的配置文件。你可以通过右键点击测试所在的行号并从菜单中选择 'Debug Test' 来以调试模式运行测试。

<img height="1724" width="2624" alt="选择调试配置文件" src="https://user-images.githubusercontent.com/13063165/212880198-eac22c3e-68ce-47da-9163-d6b376ae7575.png" />

要了解更多关于调试的信息，请参阅 [Visual Studio Code 中的调试](https://code.visualstudio.com/docs/editor/debugging)。

## Playwright 检查器

Playwright 检查器是一个 GUI 工具，帮助你调试 Playwright 测试。它允许你逐步执行测试，实时编辑定位器，选择定位器并查看可操作性日志。

<img height="1746" width="1728" alt="Playwright 检查器" src="https://user-images.githubusercontent.com/13063165/212924587-4b84e5f6-b147-40e9-8c75-d7b9ab6b7ca1.png" />

### 在调试模式下运行

使用 `--debug` 标志运行测试以打开检查器。这会配置 Playwright 进行调试并打开检查器。使用 `--debug` 时还会配置其他有用的默认值：
- 浏览器以有头模式启动
- 默认超时设置为 0（= 无超时）

#### 在所有浏览器上调试所有测试

要调试所有测试，请使用 `--debug` 标志运行测试命令。这将逐个运行测试，并为每个测试打开检查器和浏览器窗口。

```bash
npx playwright test --debug
```

#### 在所有浏览器上调试一个测试

要调试特定行的一个测试，请运行测试命令后跟测试文件名和要调试的测试行号，然后是 `--debug` 标志。这将在 [`playwright.config`](./test-projects.md#configure-projects-for-multiple-browsers) 中配置的每个浏览器中运行单个测试并打开检查器。

```bash
npx playwright test example.spec.ts:10 --debug
```

#### 在特定浏览器上调试

在 Playwright 中，你可以在 [`playwright.config`](./test-projects.md#configure-projects-for-multiple-browsers) 中配置项目。配置后，你可以使用 `--project` 标志后跟 `playwright.config` 中配置的项目名称，在特定浏览器或移动视口上调试测试。

```bash
npx playwright test --project=chromium --debug
npx playwright test --project="Mobile Safari" --debug
npx playwright test --project="Microsoft Edge" --debug
```

#### 在特定浏览器上调试一个测试

要在特定浏览器上运行一个测试，请添加测试文件名和要调试的测试行号，以及 `--project` 标志后跟项目名称。

```bash
npx playwright test example.spec.ts:10 --project=webkit --debug
```

### 逐步执行测试

你可以使用检查器顶部的工具栏播放、暂停或逐步执行测试的每个操作。你可以看到当前操作在测试代码中高亮显示，以及匹配的元素在浏览器窗口中高亮显示。

<img height="1736" width="2680" alt="Playwright 检查器和浏览器" src="https://user-images.githubusercontent.com/13063165/212936618-84b87acc-bc2e-46ed-994b-32b2ef742e60.png" />

### 从特定断点运行测试

为了加快调试过程，你可以在测试中添加 [`page.pause()`](/api/class-page#page-pause) 方法。这样你就不必逐步执行测试的每个操作才能到达要调试的点。

```js
await page.pause();
```

添加 `page.pause()` 调用后，以调试模式运行测试。点击检查器中的 "Resume" 按钮将运行测试并仅在 `page.pause()` 处停止。

<img height="1736" width="2700" alt="带有 page.pause 的测试" src="https://user-images.githubusercontent.com/13063165/219473050-122be4c2-31d0-4cbd-aa8b-8588e8b781a6.png" />

### 实时编辑定位器

在调试模式下运行时，你可以实时编辑定位器。在 'Pick Locator' 按钮旁边有一个字段，显示测试暂停时的[定位器](./locators.md)。你可以直接在 **Pick Locator** 字段中编辑此定位器，匹配的元素将在浏览器窗口中高亮显示。

<img height="1694" width="2696" alt="实时编辑定位器" src="https://user-images.githubusercontent.com/13063165/212980815-1cf6ef7b-e69a-496c-898a-ec603a3bc562.png" />

### 选择定位器

在调试时，你可能需要选择一个更具弹性的定位器。你可以通过点击 **Pick Locator** 按钮并将鼠标悬停在浏览器窗口中的任何元素上来做到这一点。悬停在元素上时，你会看到下方高亮显示定位此元素所需的代码。点击浏览器中的元素会将定位器添加到字段中，然后你可以对其进行调整或复制到代码中。

<img height="1782" width="2784" alt="选择定位器" src="https://user-images.githubusercontent.com/13063165/212968640-ce82a027-9277-4bdf-b0a9-6282fb2becb7.png" />

Playwright 会查看你的页面并找出最佳定位器，优先使用[角色、文本和测试 ID 定位器](./locators.md)。如果 Playwright 找到多个匹配定位器的元素，它会改进定位器使其具有弹性并唯一标识目标元素，这样你就不必担心由于定位器导致的测试失败。

### 可操作性日志

当 Playwright 在点击操作上暂停时，它已经执行了可以在日志中找到的[可操作性检查](./actionability.md)。这可以帮助你了解测试期间发生了什么以及 Playwright 做了或试图做什么。日志告诉你元素是否可见、已启用和稳定，定位器是否解析到元素，是否滚动到视图中，等等。如果无法达到可操作性，它会将操作显示为待处理。

<img height="1866" width="1766" alt="可操作性日志" src="https://user-images.githubusercontent.com/13063165/212968907-5dede739-e0e3-482a-91cd-726a0f5b0b6d.png" />

## 追踪查看器

Playwright [追踪查看器](/trace-viewer.md) 是一个 GUI 工具，让你可以探索录制的 Playwright 测试追踪。你可以在左侧前后浏览每个操作，并直观地看到操作期间发生了什么。在屏幕中间，你可以看到操作的 DOM 快照。在右侧，你可以看到操作详情，如时间、参数、返回值和日志。你还可以探索控制台消息、网络请求和源代码。

<video width="100%" height="100%" controls muted>

<source src="https://user-images.githubusercontent.com/13063165/219132713-17b9d75b-71e3-42c4-a43f-3f9e2e15f834.mp4" type="video/mp4" />

</video>

要了解更多关于如何录制追踪和使用追踪查看器的信息，请查看[追踪查看器](/trace-viewer.md)指南。

## 浏览器开发者工具

使用 `PWDEBUG=console` 在调试模式下运行时，开发者工具控制台中有一个 `playwright` 对象可用。开发者工具可以帮助你：
- 检查 DOM 树并**查找元素选择器**
- **查看执行期间的控制台日志**（或学习如何[通过 API 读取日志](./api/class-page.md#page-event-console)）
- 检查**网络活动**和其他开发者工具功能

<img height="1626" width="2798" alt="带有 Playwright 对象的浏览器开发者工具" src="https://user-images.githubusercontent.com/13063165/219128002-898f604d-9697-4b7f-95b5-a6a8260b7282.png" />

要使用浏览器开发者工具调试测试，首先在测试中设置断点，使用 [`page.pause()`](/api/class-page#page-pause) 方法暂停执行。

```js
await page.pause();
```

在测试中设置断点后，你可以使用 `PWDEBUG=console` 运行测试。

::: code-group

```bash [Bash]
PWDEBUG=console npx playwright test
```

```bat [Batch]
set PWDEBUG=console
npx playwright test
```

```powershell [PowerShell]
$env:PWDEBUG="console"
npx playwright test
```

:::

一旦 Playwright 启动浏览器窗口，你就可以打开开发者工具。
`playwright` 对象将在控制台面板中可用。

#### playwright.$(selector)

使用实际的 Playwright 查询引擎查询 Playwright 选择器，例如：

```bash
playwright.$('.auth-form >> text=Log in');

<button>Log in</button>
```

#### playwright.$$(selector)

与 `playwright.$` 相同，但返回所有匹配的元素。

```bash
playwright.$$('li >> text=John')

[<li>, <li>, <li>, <li>]
```

#### playwright.inspect(selector)

在元素面板中显示元素。

```bash
playwright.inspect('text=Log in')
```

#### playwright.locator(selector)

创建定位器并查询匹配的元素，例如：

```bash
playwright.locator('.auth-form', { hasText: 'Log in' });

Locator ()
  - element: button
  - elements: [button]
```

#### playwright.selector(element)

为给定元素生成选择器。例如，在元素面板中选择一个元素并传递 `$0`：

```bash
playwright.selector($0)

"div[id="glow-ingress-block"] >> text=/.*Hello.*/"
```

## 详细 API 日志

Playwright 支持使用 `DEBUG` 环境变量进行详细日志记录。

::: code-group

```bash [Bash]
DEBUG=pw:api npx playwright test
```

```bat [Batch]
set DEBUG=pw:api
npx playwright test
```

```powershell [PowerShell]
$env:DEBUG="pw:api"
npx playwright test
```

:::

::: info
**对于 WebKit**：在执行期间启动 WebKit 检查器将阻止 Playwright 脚本继续执行，并将重置预配置的用户代理和设备模拟。
:::

## 有头模式

默认情况下，Playwright 以无头模式运行浏览器。要更改此行为，请使用 `headless: false` 作为启动选项。

你还可以使用 [`slowMo`](/api/class-browsertype#browser-type-launch-option-slow-mo) 选项来减慢执行速度（每个操作 N 毫秒），并在调试时跟随进度。

```js
// Chromium、Firefox 或 WebKit
await chromium.launch({ headless: false, slowMo: 100 });
```
