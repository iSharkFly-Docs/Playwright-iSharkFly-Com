---
title: "运行和调试测试"
---

# 运行和调试测试

## 介绍

你可以运行单个测试、一组测试或所有测试。可以使用 `--browser` 标志在一个或多个浏览器上运行测试。默认情况下，测试以无头模式运行，这意味着运行测试时不会打开浏览器窗口，结果将在终端中显示。如果你愿意，可以使用 `--headed` CLI 参数以有头模式运行测试。

**你将学到**
- [如何从命令行运行测试](/python/running-tests.md#command-line)
- [如何调试测试](/python/running-tests.md#debugging-tests)

## 运行测试

### 命令行

要运行测试，请使用 `pytest` 命令。这将默认在 Chromium 浏览器上运行测试。测试默认以无头模式运行，这意味着运行测试时不会打开浏览器窗口，结果将在终端中显示。

```bash
pytest
```

### 以有头模式运行测试

要以有头模式运行测试，请使用 `--headed` 标志。这将在运行测试时打开一个浏览器窗口，测试完成后浏览器窗口将关闭。

```bash
pytest --headed
```

### 在不同浏览器上运行测试

要指定在哪个浏览器上运行测试，请使用 `--browser` 标志，后跟浏览器的名称。

```bash
pytest --browser webkit
```

要指定多个浏览器来运行测试，请多次使用 `--browser` 标志，后跟每个浏览器的名称。

```bash
pytest --browser webkit --browser firefox
```

### 运行特定测试

要运行单个测试文件，请传入要运行的测试文件的名称。

```bash
pytest test_login.py
```

要运行一组测试文件，请传入要运行的测试文件的名称。

```bash
pytest tests/test_todo_page.py tests/test_landing_page.py
```

要运行特定测试，请传入要运行的测试的函数名称。

```bash
pytest -k test_add_a_todo_item
```

### 并行运行测试

要并行运行测试，请使用 `--numprocesses` 标志，后跟要运行测试的进程数。我们建议使用逻辑 CPU 核心数的一半。

```bash
pytest --numprocesses 2
```

（这假设已安装 `pytest-xdist`。更多信息请参见[这里](./test-runners.md#parallelism-running-multiple-tests-at-once)。）

更多信息，请参阅 [Playwright Pytest 用法](./test-runners.md)或 Pytest 文档中的[通用 CLI 用法](https://docs.pytest.org/en/stable/usage.html)。

## 调试测试

由于 Playwright 在 Python 中运行，你可以使用你选择的调试器来调试它，例如在 Visual Studio Code 中使用 [Python 扩展](https://code.visualstudio.com/docs/python/python-tutorial)。Playwright 附带 Playwright Inspector，它允许你逐步执行 Playwright API 调用、查看它们的调试日志并探索[定位器](./locators.md)。

要调试所有测试，请运行以下命令。

::: code-group

```bash [Bash]
PWDEBUG=1 pytest -s
```

```bat [Batch]
set PWDEBUG=1
pytest -s
```

```powershell [PowerShell]
$env:PWDEBUG=1
pytest -s
```

:::

要调试一个测试文件，请运行命令，后跟要调试的测试文件的名称。

::: code-group

```bash [Bash]
PWDEBUG=1 pytest -s test_example.py
```

```bat [Batch]
set PWDEBUG=1
pytest -s test_example.py
```

```powershell [PowerShell]
$env:PWDEBUG=1
pytest -s test_example.py
```

:::

要调试特定测试，请添加 `-k`，后跟要调试的测试的名称。

::: code-group

```bash [Bash]
PWDEBUG=1 pytest -s -k test_get_started_link
```

```bat [Batch]
set PWDEBUG=1
pytest -s -k test_get_started_link
```

```powershell [PowerShell]
$env:PWDEBUG=1
pytest -s -k test_get_started_link
```

:::

此命令将打开一个浏览器窗口以及 Playwright Inspector。你可以使用检查器顶部的单步执行按钮来逐步执行测试。或者按播放按钮从头到尾运行测试。测试完成后，浏览器窗口将关闭。

在调试时，你可以使用"选择定位器"按钮来选择页面上的元素，并查看 Playwright 将用于查找该元素的定位器。你还可以编辑定位器，并在浏览器窗口中实时查看它的高亮显示。使用"复制定位器"按钮将定位器复制到剪贴板，然后将其粘贴到你的测试中。

<img src="https://github.com/microsoft/playwright/assets/13063165/c94c89c8-f945-460c-a653-7809c6ca50ee" alt="Playwright Inspector" width="2060" height="1384" />

查看我们的[调试指南](./debug.md)以了解更多关于 [Playwright Inspector](./debug.md#playwright-inspector) 以及使用[浏览器开发者工具](./debug.md#browser-developer-tools)进行调试的信息。

## 下一步
- [使用 Codegen 生成测试](./codegen.md)
- [查看测试的追踪记录](./trace-viewer-intro.md)
- [使用 GitHub Actions 在 CI 上运行测试](./ci-intro.md)
