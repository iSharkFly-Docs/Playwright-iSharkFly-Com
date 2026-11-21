---
title: "运行和调试测试"
---

# 运行和调试测试

## 简介

使用 Playwright，你可以运行单个测试、一组测试或所有测试。可以使用 `--project` 标志在一个或多个浏览器上运行测试。默认情况下，测试并行运行并以无头模式执行，这意味着运行测试时不会打开浏览器窗口，结果显示在终端中。你可以使用 `--headed` CLI 参数在有头模式下运行测试，或使用 `--ui` 标志在 [UI 模式](./test-ui-mode.md) 下运行测试，以查看测试的完整追踪。

**你将学到**
- [如何从命令行运行测试](/running-tests.md#command-line)
- [如何调试测试](/running-tests.md#debugging-tests)
- [如何打开 HTML 测试报告](/running-tests.md#test-reports)

## 运行测试

### 命令行

你可以使用 `playwright test` 命令运行测试。这会按照 `playwright.config` 文件中的配置在所有浏览器上运行测试，结果显示在终端中。默认情况下，测试以无头模式运行，这意味着运行测试时不会打开浏览器窗口。

```bash
npx playwright test
```

![在命令行中运行测试](/images/getting-started/run-tests-cli.png)

### 在 UI 模式下运行测试

我们强烈建议使用 [UI 模式](./test-ui-mode.md) 运行测试，以获得更好的开发体验，你可以轻松地逐步执行测试的每一步，并直观地看到每一步之前、期间和之后发生了什么。UI 模式还带有许多其他功能，如定位器选择器、监视模式等。

```bash
npx playwright test --ui
```

![UI 模式](/images/getting-started/ui-mode.png)

查看我们的 [UI 模式详细指南](./test-ui-mode.md) 以了解更多功能。

### 在有头模式下运行测试

要在有头模式下运行测试，请使用 `--headed` 标志。这让你能够直观地看到 Playwright 如何与网站交互。

```bash
npx playwright test --headed
```

### 在不同浏览器上运行测试

要指定在哪个浏览器上运行测试，请使用 `--project` 标志后跟浏览器名称。

```bash
npx playwright test --project webkit
```

要指定多个浏览器来运行测试，请多次使用 `--project` 标志，每次后跟浏览器名称。

```bash
npx playwright test --project webkit --project firefox
```

### 运行特定测试

要运行单个测试文件，请传入要运行的测试文件名。

```bash
npx playwright test landing-page.spec.ts
```

要运行来自不同目录的一组测试文件，请传入要运行测试的目录名。

```bash
npx playwright test tests/todo-page/ tests/landing-page/
```

要运行文件名中包含 `landing` 或 `login` 的文件，只需将这些关键词传递给 CLI。

```bash
npx playwright test landing login
```

要运行具有特定标题的测试，请使用 `-g` 标志后跟测试标题。

```bash
npx playwright test -g "add a todo item"
```

### 运行上次失败的测试

要仅运行上次测试运行中失败的测试，首先运行你的测试，然后使用 `--last-failed` 标志再次运行它们。

```bash
npx playwright test --last-failed
```

Playwright 将上次运行的失败测试列表存储在 `<outputDir>/.last-run.json` 中（参见 [`testConfig.outputDir`](./test-configuration.md)）。要使用不同的文件路径，请传递 `--last-failed-file=<path>` 或设置 `PLAYWRIGHT_LAST_RUN_OUTPUT_FILE`。

```bash
npx playwright test --last-failed --last-failed-file=.cache/last-run-shard-1.json
```

### 在 VS Code 中运行测试

可以直接从 VS Code 使用 [VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) 运行测试。安装后，你只需点击要运行的测试旁边的绿色三角形，或从测试侧边栏运行所有测试。查看我们的 [VS Code 入门指南](./getting-started-vscode.md) 了解更多详情。

![安装 Playwright 扩展](/images/getting-started/vscode-extension.png)

## 调试测试

由于 Playwright 在 Node.js 中运行，你可以使用你喜欢的调试器来调试它，例如在 IDE 中使用 `console.log`，或直接在 VS Code 中使用 [VS Code 扩展](./getting-started-vscode.md)。Playwright 带有 [UI 模式](./test-ui-mode.md)，你可以轻松地逐步执行测试的每一步，查看日志、错误、网络请求，检查 DOM 快照等。你还可以使用 [Playwright 检查器](./debug.md#playwright-inspector)，它允许你逐步执行 Playwright API 调用，查看它们的调试日志，并探索[定位器](./locators.md)。

### 在 UI 模式下调试测试

我们强烈建议使用 [UI 模式](./test-ui-mode.md) 调试测试，以获得更好的开发体验，你可以轻松地逐步执行测试的每一步，并直观地看到每一步之前、期间和之后发生了什么。UI 模式还带有许多其他功能，如定位器选择器、监视模式等。

```bash
npx playwright test --ui
```

![在 UI 模式中显示错误](/images/getting-started/ui-mode-error.png)

调试时，你可以使用"选择定位器"按钮在页面上选择一个元素，并查看 Playwright 用于查找该元素的定位器。你还可以在定位器游乐场中编辑定位器，并在浏览器窗口中实时看到它的高亮显示。使用"复制定位器"按钮将定位器复制到剪贴板，然后粘贴到你的测试中。

![在 UI 模式中选择定位器](/images/getting-started/ui-mode-pick-locator.png)

查看我们的 [UI 模式详细指南](./test-ui-mode.md) 以了解更多功能。

### 使用 Playwright 检查器调试测试

要调试所有测试，请运行 Playwright 测试命令后跟 `--debug` 标志。

```bash
npx playwright test --debug
```

![使用 Playwright 检查器调试测试](/images/getting-started/run-tests-debug.png)

此命令会打开一个浏览器窗口以及 Playwright 检查器。你可以使用检查器顶部的单步执行按钮逐步执行测试。或者，按播放按钮从头到尾运行测试。测试完成后，浏览器窗口关闭。

要调试一个测试文件，请运行 Playwright 测试命令并附上要调试的测试文件名，然后跟上 `--debug` 标志。

```bash
npx playwright test example.spec.ts --debug
```

要调试从定义 `test(..` 的行号开始的特定测试，在测试文件名末尾添加冒号和行号，然后跟上 `--debug` 标志。

```bash
npx playwright test example.spec.ts:10 --debug
```

调试时，你可以使用"选择定位器"按钮在页面上选择一个元素，并查看 Playwright 用于查找该元素的定位器。你还可以编辑定位器并在浏览器窗口中实时看到它的高亮显示。使用"复制定位器"按钮将定位器复制到剪贴板，然后粘贴到你的测试中。

![Playwright 检查器中的定位器选择器](/images/getting-started/run-tests-pick-locator.png)

查看我们的 [调试指南](./debug.md) 以了解更多关于使用 [VS Code 调试器](./debug.md#vs-code-debugger)、UI 模式和 [Playwright 检查器](./debug.md#playwright-inspector) 以及 [浏览器开发者工具](./debug.md#browser-developer-tools) 进行调试的信息。

## 测试报告

[HTML 报告器](./test-reporters.md#html-reporter) 显示测试的完整报告，允许你按浏览器、通过的测试、失败的测试、跳过的测试和不稳定的测试进行过滤。默认情况下，如果某些测试失败，HTML 报告会自动打开，否则你可以使用以下命令打开它。

```bash
npx playwright show-report
```

![HTML 报告](/images/getting-started/html-report.png)

你可以过滤和搜索测试，还可以点击每个测试查看测试错误并探索测试的每一步。

![HTML 报告器详细视图](/images/getting-started/html-report-detail.png)

## 下一步
- [使用 Codegen 生成测试](./codegen-intro.md)
- [查看测试的追踪记录](./trace-viewer-intro.md)
- [探索 UI 模式的所有功能](./test-ui-mode.md)
- [使用 GitHub Actions 在 CI 上运行测试](./ci-intro.md)
