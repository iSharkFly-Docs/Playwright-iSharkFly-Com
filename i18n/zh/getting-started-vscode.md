---
title: "VS Code"
---

# VS Code

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

Playwright VS Code 扩展将 Playwright Test 的强大功能直接带入您的编辑器，让您能够通过无缝的 UI 驱动体验来运行、调试和生成测试。本指南将引导您完成扩展的设置，并使用其核心功能来增强您的端到端测试工作流程。

<LiteYouTube
id="WvsLGZnHmzw"
title="在 VS Code 中开始使用 Playwright"
/>

## 前置条件

在开始之前，请确保您已安装以下软件：
- [Node.js](https://nodejs.org/)（推荐 LTS 版本）
- [Visual Studio Code](https://code.visualstudio.com/)

## 快速入门

### 安装和设置
1.  **安装扩展**：打开 VS Code 中的扩展视图（`Ctrl+Shift+X` 或 `Cmd+Shift+X`），搜索"Playwright"。[从 Microsoft 安装官方扩展](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)。

![安装 Playwright 扩展](/images/getting-started/vscode-extension.png)
1.  **安装 Playwright**：扩展安装完成后，打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`），运行 **Test: Install Playwright** 命令。

![安装 Playwright](/images/getting-started/install-playwright.png)

3.  **选择浏览器**：选择您要用于测试的浏览器（例如 Chromium、Firefox、WebKit）。您还可以添加 GitHub Actions 工作流以在 CI 中运行测试。这些设置可以稍后在 `playwright.config.ts` 文件中更改。

![安装浏览器](/images/getting-started/install-browsers.png)

### 打开测试侧边栏

点击 VS Code 活动栏中的**测试图标**以打开测试资源管理器。在这里，您可以找到您的测试，以及用于管理项目、工具和设置的 Playwright 侧边栏。

![测试侧边栏](/images/getting-started/testing-sidebar.png)

## 核心功能

### 运行测试

<LiteYouTube
id="mQmcIBMsc38"
title="在 VS Code 中运行 Playwright 测试"
/>
-   **运行单个测试**：点击任意测试旁边的绿色"播放"图标来运行它。如果测试通过，播放按钮会变成绿色复选标记；如果测试失败，会变成红色 X。您可以看到测试运行的时间显示在测试名称旁边。此外，测试结果面板会自动在 VS Code 底部打开，显示测试执行的摘要，包括运行了多少测试、通过、失败或跳过了多少测试，以及总执行时间。

![运行单个测试](/images/getting-started/run-single-test.png)
-   **运行所有测试**：您可以在不同级别运行所有测试。点击特定测试文件旁边的播放图标可以运行该文件中的所有测试，或者点击测试资源管理器顶部的播放图标可以运行整个项目中的所有测试。

![运行所有测试](/images/getting-started/run-all-tests.png)
-   **在多个浏览器上运行**：在 Playwright 侧边栏中，勾选您要测试的项目（浏览器）的复选框。Playwright 中的项目代表不同的浏览器配置——每个项目通常对应一个特定的浏览器（如 Chromium、Firefox 或 WebKit），并有自己的设置，如视口大小、设备模拟或其他浏览器特定选项。当您运行测试时，它会在所有选定的项目上执行，让您可以验证您的应用程序在不同浏览器和配置中的一致性表现。

![选择要运行测试的项目](/images/getting-started/select-projects.png)
-   **显示浏览器**：要在实时浏览器窗口中观看测试执行，请在侧边栏中启用**显示浏览器**选项。禁用它则以无头模式运行（测试在后台运行，不打开可见的浏览器窗口）。

![运行测试时显示浏览器](/images/getting-started/show-browser.png)

### 调试测试

<LiteYouTube
id="tJF7UhA59Gc"
title="在 VS Code 中调试 Playwright 测试"
/>

VS Code 扩展提供强大的调试工具来帮助您识别和修复测试中的问题。您可以设置断点、检查变量、查看详细的错误消息、获取 AI 驱动的建议来解决测试失败，并使用全面的追踪查看器逐步分析测试执行。
-   **使用断点**：通过点击行号旁边的边槽来设置断点。右键点击测试并选择**调试测试**。测试将在您的断点处暂停，允许您检查变量并逐步执行代码。
  
  ![设置调试模式](/images/getting-started/debug-mode.png)
-   **实时调试**：启用**显示浏览器**后，点击代码中的定位器。Playwright 将在浏览器中高亮显示相应的元素，方便您验证定位器。
  
  ![VS Code 中的实时调试](/images/getting-started/live-debugging.png)
-   **查看错误消息**：如果测试失败，扩展会直接在编辑器中显示详细的错误消息，包括期望值与实际值的对比以及完整的调用日志。

![VS Code 中的错误消息](/images/getting-started/error-messaging.png)
-   **AI 修复**：当测试失败时，点击错误旁边的闪光图标可以获取 Copilot 提供的 AI 驱动的修复建议。Copilot 会分析错误并建议代码更改来解决问题。

![VS Code 中的 AI 修复](/images/getting-started/fix-with-ai.png)
-   **使用追踪查看器调试**：要进行全面的调试，请在 Playwright 侧边栏中启用**显示追踪查看器**选项。当测试完成后，会自动打开详细的追踪，为您提供测试执行的完整时间线。追踪查看器特别适用于：
  - **逐步分析**：浏览测试执行的每个操作及其精确时间戳
  - **DOM 检查**：在测试执行的任何时刻查看 DOM 快照，了解页面的确切外观
  - **网络监控**：检查测试期间发生的所有网络请求和响应
  - **控制台日志**：访问浏览器的所有控制台消息和错误
  - **源码映射**：直接跳转到执行每个操作的源代码
  - **可视化调试**：查看截图并了解用户在每一步会看到什么
  
  追踪查看器在调试不稳定的测试或理解复杂的用户交互时特别有价值。

![追踪查看器调试](/images/getting-started/trace-viewer-debug.png)

要了解更多信息，请参阅我们的[追踪查看器指南](./trace-viewer.md)。

### 使用 CodeGen 生成测试

CodeGen 是 Playwright 强大的测试生成工具，通过录制您与网页的交互来自动创建测试代码。您无需从头开始编写测试，只需浏览应用程序，CodeGen 就会捕获您的操作并将其转换为具有适当定位器和断言的可靠测试代码。

<LiteYouTube
id="5XIZPqKkdBA"
title="在 VS Code 中生成 Playwright 测试"
/>
-   **录制新测试**：在侧边栏中点击**录制新测试**。浏览器窗口将打开。当您与页面交互时，Playwright 将自动生成测试代码。您还可以从录制工具栏生成断言。

![录制新测试](/images/getting-started/record-new-test.png)
-   **在光标处录制**：将光标放在现有测试内部，然后点击**在光标处录制**，在该特定位置添加新操作。
  ![在光标处录制](/images/getting-started/record-at-cursor.png)
-   **选择定位器**：使用**选择定位器**工具点击打开的浏览器中的任意元素。Playwright 将确定最佳定位器并将其复制到剪贴板，随时可以粘贴到代码中。

![选择定位器](/images/getting-started/pick-locator.png)

要了解更多信息，请参阅我们的 [CodeGen 指南](./codegen.md)。

## 高级功能

### 项目依赖

使用[项目依赖](./test-projects.md)来定义在其他测试之前运行的设置测试。例如，您可以创建一个先运行的登录测试，然后在多个测试中重用该认证状态，而无需每次测试都重新登录。在 VS Code 中，您可以在测试资源管理器中看到这些设置测试，并在需要时独立运行它们。

![VS Code 中的设置测试](/images/getting-started/setup-tests.png)

要了解更多信息，请参阅我们的[项目依赖指南](./test-projects.md)。

### 全局设置

对于只需要在所有测试之前运行一次的任务（如初始化数据库），请使用**全局设置**。您可以从 Playwright 侧边栏手动触发全局设置和清理。

![运行全局设置](/images/getting-started/global-setup.png)

### 多配置

如果您有多个 `playwright.config.ts` 文件，可以使用 Playwright 侧边栏中的齿轮图标在它们之间切换。这使您可以轻松处理不同的测试套件或环境。

![选择配置文件](/images/getting-started/selecting-configuration.png)

## 快速参考

| 操作                  | 在 VS Code 中如何操作                                     |
| ----------------------- | ----------------------------------------------------------- |
| **安装 Playwright**  | 命令面板 → `Test: Install Playwright`                |
| **运行测试**          | 点击测试旁边的"播放"图标                      |
| **调试测试**        | 设置断点，右键点击测试 → `调试测试`       |
| **显示实时浏览器**   | 在 Playwright 侧边栏中启用 `显示浏览器`            |
| **录制新测试**   | 在 Playwright 侧边栏中点击 `录制新测试`                |
| **选择定位器**      | 在 Playwright 侧边栏中点击 `选择定位器`              |
| **查看测试追踪**     | 在 Playwright 侧边栏中启用 `显示追踪查看器`        |

## 下一步
-   [使用 Web 优先断言、页面 Fixtures 和定位器编写测试](./writing-tests.md)
-   [在 CI 上运行测试](./ci-intro.md)
-   [了解更多关于追踪查看器的信息](./trace-viewer.md)
