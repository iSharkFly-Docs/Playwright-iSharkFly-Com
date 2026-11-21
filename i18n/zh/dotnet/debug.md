---
title: "调试测试"
---

# 调试测试

## Playwright Inspector

Playwright Inspector 是一个 GUI 工具，可帮助你调试 Playwright 测试。它允许你逐步执行测试，实时编辑定位器，选择定位器并查看可操作性日志。

<img height="1746" width="1728" alt="Playwright Inspector" src="https://user-images.githubusercontent.com/13063165/212924587-4b84e5f6-b147-40e9-8c75-d7b9ab6b7ca1.png" />

### 在调试模式下运行

设置 `PWDEBUG` 环境变量以在调试模式下运行 Playwright 测试。这将为调试配置 Playwright 并打开检查器。当设置 `PWDEBUG=1` 时，还会配置其他有用的默认值：
- 浏览器以有头模式启动
- 默认超时设置为 0（= 无超时）

::: code-group

```bash [Bash]
PWDEBUG=1 dotnet test
```

```bat [Batch]
set PWDEBUG=1
dotnet test
```

```powershell [PowerShell]
$env:PWDEBUG=1
dotnet test
```

:::

### 逐步执行测试

你可以使用检查器顶部的工具栏来播放、暂停或逐步执行测试的每个操作。你可以看到当前操作在测试代码中高亮显示，匹配的元素在浏览器窗口中高亮显示。

<img height="1736" width="2680" alt="Playwright Inspector 和浏览器" src="https://user-images.githubusercontent.com/13063165/212936618-84b87acc-bc2e-46ed-994b-32b2ef742e60.png" />

### 从特定断点运行测试

为了加快调试过程，你可以在测试中添加 [`Page.PauseAsync()`](/dotnet/api/class-page#page-pause) 方法。这样你就不必逐步执行测试的每个操作来到达你想要调试的位置。

```csharp
await page.PauseAsync();
```

添加 `page.pause()` 调用后，在调试模式下运行测试。在检查器中点击"Resume"按钮将运行测试，并只在 `page.pause()` 处停止。

<img height="1736" width="2700" alt="带有 page.pause 的测试" src="https://user-images.githubusercontent.com/13063165/219473050-122be4c2-31d0-4cbd-aa8b-8588e8b781a6.png" />

### 实时编辑定位器

在调试模式下运行时，你可以实时编辑定位器。在"Pick Locator"按钮旁边有一个字段显示测试暂停时的[定位器](./locators.md)。你可以直接在 **Pick Locator** 字段中编辑此定位器，匹配的元素将在浏览器窗口中高亮显示。

<img height="1694" width="2696" alt="实时编辑定位器" src="https://user-images.githubusercontent.com/13063165/212980815-1cf6ef7b-e69a-496c-898a-ec603a3bc562.png" />

### 选择定位器

在调试时，你可能需要选择一个更可靠的定位器。你可以通过点击 **Pick Locator** 按钮并悬停在浏览器窗口中的任何元素上来实现。当悬停在元素上时，你将看到定位此元素所需的代码在下方高亮显示。点击浏览器中的元素将把定位器添加到字段中，然后你可以调整它或将其复制到代码中。

<img height="1782" width="2784" alt="选择定位器" src="https://user-images.githubusercontent.com/13063165/212968640-ce82a027-9277-4bdf-b0a9-6282fb2becb7.png" />

Playwright 将查看你的页面并找出最佳定位器，优先考虑[角色、文本和测试 ID 定位器](./locators.md)。如果 Playwright 找到多个匹配定位器的元素，它将改进定位器使其具有弹性并唯一标识目标元素，因此你不必担心由于定位器导致的测试失败。

### 可操作性日志

当 Playwright 在点击操作上暂停时，它已经执行了[可操作性检查](./actionability.md)，这些检查可以在日志中找到。这可以帮助你了解测试期间发生了什么以及 Playwright 做了什么或试图做什么。日志会告诉你元素是否可见、是否启用、是否稳定，定位器是否解析为元素，是否滚动到视图中等等。如果无法达到可操作性，它将显示操作为待处理。

<img height="1866" width="1766" alt="可操作性日志" src="https://user-images.githubusercontent.com/13063165/212968907-5dede739-e0e3-482a-91cd-726a0f5b0b6d.png" />

## 跟踪查看器

Playwright [跟踪查看器](/trace-viewer.md)是一个 GUI 工具，可让你探索测试的录制 Playwright 跟踪。你可以在左侧前后浏览每个操作，并直观地看到每个操作期间发生了什么。在屏幕中间，你可以看到操作的 DOM 快照。在右侧，你可以看到操作详情，如时间、参数、返回值和日志。你还可以探索控制台消息、网络请求和源代码。

<video width="100%" height="100%" controls muted>

<source src="https://user-images.githubusercontent.com/13063165/219132713-17b9d75b-71e3-42c4-a43f-3f9e2e15f834.mp4" type="video/mp4" />

</video>

要了解更多关于如何录制跟踪和使用跟踪查看器的信息，请查看[跟踪查看器](/trace-viewer.md)指南。

## 浏览器开发者工具

当使用 `PWDEBUG=console` 在调试模式下运行时，`playwright` 对象在开发者工具控制台中可用。开发者工具可以帮助你：
- 检查 DOM 树并**查找元素选择器**
- **查看执行期间的控制台日志**（或了解如何[通过 API 读取日志](./api/class-page.md#page-event-console)）
- 检查**网络活动**和其他开发者工具功能

<img height="1626" width="2798" alt="带有 Playwright 对象的浏览器开发者工具" src="https://user-images.githubusercontent.com/13063165/219128002-898f604d-9697-4b7f-95b5-a6a8260b7282.png" />

要使用浏览器开发者工具调试测试，首先通过使用 [`Page.PauseAsync()`](/dotnet/api/class-page#page-pause) 方法在测试中设置断点来暂停执行。

```csharp
await page.PauseAsync();
```

在测试中设置断点后，你可以使用 `PWDEBUG=console` 运行测试。

::: code-group

```bash [Bash]
PWDEBUG=console dotnet test
```

```bat [Batch]
set PWDEBUG=console
dotnet test
```

```powershell [PowerShell]
$env:PWDEBUG=console
dotnet test
```

:::

一旦 Playwright 启动浏览器窗口，你就可以打开开发者工具。`playwright` 对象将在控制台面板中可用。

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
DEBUG=pw:api dotnet run
```

```bat [Batch]
set DEBUG=pw:api
dotnet run
```

```powershell [PowerShell]
$env:DEBUG="pw:api"
dotnet run
```

:::

::: info
**对于 WebKit**：在执行期间启动 WebKit Inspector 将阻止 Playwright 脚本进一步执行，并将重置预配置的用户代理和设备模拟。
:::

## 有头模式

Playwright 默认以无头模式运行浏览器。要更改此行为，使用 `headless: false` 作为启动选项。

你还可以使用 [`slowMo`](/dotnet/api/class-browsertype#browser-type-launch-option-slow-mo) 选项来减慢执行速度（每个操作延迟 N 毫秒），以便在调试时跟踪。

```csharp
// Chromium、Firefox 或 WebKit
await using var browser = await playwright.Chromium.LaunchAsync(new()
{
    Headless = false,
    SlowMo = 100
});
```
