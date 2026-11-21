---
title: "UI 模式"
---

# UI 模式

import LiteYouTube from '@site/src/components/LiteYouTube';

## 介绍

UI 模式让您可以浏览、运行和调试测试，并具有完整的时间旅行体验和监视模式。所有测试文件都显示在测试侧边栏中，允许您展开每个文件和 describe 块来单独运行、查看、监视和调试每个测试。通过**名称**、[**项目**](./test-projects)（在 `playwright.config` 文件中设置）、**@tag** 或按**通过**、**失败**和**跳过**的执行状态来筛选测试。查看测试的完整跟踪，并在每个操作上前后悬停以查看每个步骤期间发生的情况。您还可以将给定时刻的 DOM 快照弹出到单独的窗口中，以获得更好的调试体验。

<LiteYouTube
id="d0u6XhXknzU"
title="Playwrights UI Mode"
/>

## 打开 UI 模式

要打开 UI 模式，请在终端中运行以下命令：

```bash
npx playwright test --ui
```

## 运行测试

启动 UI 模式后，您将看到所有测试文件的列表。您可以通过点击侧边栏中的三角形图标来运行所有测试。您也可以通过将鼠标悬停在名称上并点击旁边的三角形来运行单个测试文件、一组测试或单个测试。

<img src="https://github.com/microsoft/playwright/assets/13063165/6b87712f-64a5-4d73-a91d-6562b864712c" alt="running tests in ui mode" width="3960" height="2326" />

## 筛选测试

通过文本或 `@tag` 或按通过、失败或跳过的测试进行筛选。您还可以按 `playwright.config` 文件中设置的[项目](./test-projects)进行筛选。如果您使用项目依赖，请确保在运行依赖它们的测试之前先运行设置测试。UI 模式不会考虑设置测试，因此您必须手动先运行它们。

<img src="https://github.com/microsoft/playwright/assets/13063165/6f05e589-036d-45d5-9078-38134e1261e4" alt="filtering tests in ui mode" width="3960" height="2326" />

## 时间轴视图

在跟踪顶部，您可以看到测试的时间轴视图，用不同的颜色高亮显示导航和操作。前后悬停可查看每个操作的图像快照。双击某个操作可查看该操作的时间范围。您可以使用时间轴中的滑块增加选中的操作，这些操作将显示在操作标签页中，所有控制台日志和网络日志将被筛选为仅显示所选操作的日志。

<img src="https://github.com/microsoft/playwright/assets/13063165/811a9985-32aa-4a3e-9869-de32053cf468" alt="timeline view in ui mode" width="3960" height="2326" />

## 操作

在操作标签页中，您可以查看每个操作使用的定位器以及每个操作的运行时间。将鼠标悬停在测试的每个操作上，可以直观地看到 DOM 快照的变化。在时间上前后移动并点击操作进行检查和调试。使用"之前"和"之后"标签页可以直观地查看操作前后发生的情况。

<img src="https://github.com/microsoft/playwright/assets/13063165/7b22fab5-7346-4b98-8fdd-a78ed280647f" alt="use before and after actions in ui mode" width="3960" height="2326" />

## 弹出并检查 DOM

通过点击 DOM 快照上方的弹出图标，将 DOM 快照弹出到独立窗口中，以获得更好的调试体验。从那里您可以打开浏览器开发者工具并检查 HTML、CSS、控制台等。返回 UI 模式并点击另一个操作，将其弹出以轻松并排比较两者或单独调试每个。

<img src="https://github.com/microsoft/playwright/assets/13063165/f9f43a0c-78d7-4574-9a58-c69d2ec53c8f" alt="pop out dom snapshot in ui mode" width="3958" height="2322" />

## 选择定位器

点击选择定位器按钮并将鼠标悬停在 DOM 快照上，当您悬停时会看到每个元素的定位器高亮显示。点击元素将其添加到定位器测试区。您可以在测试区中修改定位器，并查看修改后的定位器是否匹配 DOM 快照中的任何定位器。一旦您对定位器满意，可以使用复制按钮复制定位器并将其粘贴到测试中。

<img src="https://github.com/microsoft/playwright/assets/13063165/9e7eeb84-bd26-4010-8614-75e24b56c716" alt="pick locator in ui mode" width="3960" height="2326" />

## 源代码

当您将鼠标悬停在测试的每个操作上时，该操作的代码行会在源代码面板中高亮显示。"在 VSCode 中打开"按钮位于此部分的右上角。点击该按钮后，它将在 VS Code 中打开您的测试，正好定位到您点击的代码行。

<img src="https://github.com/microsoft/playwright/assets/13063165/49b9fa2a-8a57-4044-acaa-0a2ea4784c5c" alt="showing source code of tests in ui mode" width="3958" height="2322" />

## 调用

调用标签页显示有关操作的信息，例如耗时、使用的定位器、是否处于严格模式以及使用的键。

<img src="https://github.com/microsoft/playwright/assets/13063165/442314c3-0b16-4400-bf25-c198f8654849" alt="showing call tab in ui mode" width="3958" height="2322" />

## 日志

查看测试的完整日志，以更好地了解 Playwright 在幕后的操作，例如滚动到视图中、等待元素可见、启用和稳定，以及执行点击、填充、按键等操作。

<img src="https://github.com/microsoft/playwright/assets/13063165/1d214ee5-2c07-414d-a342-f88d0864ac89" alt="showing log of tests in ui mode" width="3958" height="2322" />

## 错误

如果您的测试失败，您将在错误标签页中看到每个测试的错误消息。时间轴还将显示一条红线，高亮显示错误发生的位置。您还可以点击源代码标签页查看错误发生在源代码的哪一行。

<img src="https://github.com/microsoft/playwright/assets/13063165/ffca2fd1-5349-41fb-ade9-ace143bb2c58" alt="showing errors in ui mode" width="3958" height="2322" />

## 控制台

查看来自浏览器以及测试的控制台日志。会显示不同的图标来指示控制台日志是来自浏览器还是测试文件。

<img src="https://github.com/microsoft/playwright/assets/13063165/b6a44763-da04-4152-bbac-3369ca4a60ac" alt="showing console logs from tests in ui mode" width="3958" height="2322" />

## 网络

网络标签页显示测试期间发出的所有网络请求。您可以按不同类型的请求、状态码、方法、请求、内容类型、持续时间和大小进行排序。点击请求可查看更多信息，例如请求头、响应头、请求体和响应体。

<img src="https://github.com/microsoft/playwright/assets/13063165/946c2722-447a-4005-9518-b4e9b73a8240" alt="showing network requests from tests in ui mode" width="3958" height="2322" />

## 附件

"附件"标签页允许您浏览附件。如果您正在进行[视觉回归测试](./test-snapshots.md)，您将能够通过检查图像差异、实际图像和预期图像来比较截图。当您点击预期图像时，可以使用滑块将一张图像滑动到另一张图像上，以便轻松查看截图中的差异。

<img src="https://github.com/microsoft/playwright/assets/13063165/bb83b406-84ed-4380-a96c-0e62d1388093" alt="ui mode with attachments" width="3606" height="2228" />

## 元数据

在操作标签页旁边，您会找到元数据标签页，它将显示有关测试的更多信息，例如浏览器、视口大小、测试持续时间等。

<img src="https://github.com/microsoft/playwright/assets/13063165/befff46e-381a-41c2-8259-e47442add425" alt="metadata tab in ui mode" width="3958" height="2322" />

## 监视模式

在侧边栏中每个测试名称旁边，您会找到一个眼睛图标。点击该图标将激活监视模式，当您对测试进行更改时，它将重新运行测试。您可以通过点击每个测试旁边的眼睛图标同时监视多个测试，或者通过点击侧边栏顶部的眼睛图标监视所有测试。

<img src="https://github.com/microsoft/playwright/assets/13063165/20d7d44c-b52d-43ff-8871-8b828671f3da" alt="watch mode in ui mode" width="3960" height="2326" />

## Docker 和 GitHub Codespaces

对于 Docker 和 GitHub Codespaces 环境，您可以在浏览器中运行 UI 模式。为了使端点可以从容器外部访问，需要将其绑定到 `0.0.0.0` 接口：

```bash
npx playwright test --ui-host=0.0.0.0
```

在 GitHub Codespaces 的情况下，端口会[自动转发](https://docs.github.com/en/codespaces/developing-in-codespaces/forwarding-ports-in-your-codespace#about-forwarded-ports)，因此您可以通过点击终端中的链接在浏览器中打开 UI 模式。

要使用静态端口，可以传递 `--ui-port` 标志：

```bash
npx playwright test --ui-port=8080 --ui-host=0.0.0.0
```

::: info
请注意，当指定 `--ui-host` 标志时，UI 模式（包含您的跟踪、密码和密钥）对任何能够访问此地址和端口的人都是可访问的。使用 `--ui-host=0.0.0.0` 时，这包括您网络中的其他机器。在 GitHub Codespaces 的情况下，默认情况下端口只能从您的帐户访问。

当指定 `--ui-port` 标志时，您机器上的其他用户可以连接到该端口上的 UI 模式。他们可以运行您的测试并读取您的项目文件和跟踪。
:::
