---
title: "安装"
---

# 安装

## 介绍

Playwright 专为满足端到端测试的需求而创建。Playwright 支持所有现代渲染引擎，包括 Chromium、WebKit 和 Firefox。可在 Windows、Linux 和 macOS 上进行测试，无论是本地还是 CI 环境，支持无头模式或有头模式，以及原生移动端模拟。

[Playwright 库](./library.md)可用作通用的浏览器自动化工具，为同步和异步 Python 提供强大的 API 集来自动化 Web 应用程序。

本介绍描述了 Playwright Pytest 插件，这是编写端到端测试的推荐方式。

**你将学到**
- [如何安装 Playwright Pytest](/python/intro.md#installing-playwright-pytest)
- [如何运行示例测试](/python/intro.md#running-the-example-test)

## Linux 系统依赖

从 Playwright 1.65 开始，捆绑的 Node.js 26 在 Linux 上需要 `libatomic.so.1`。精简镜像（包括 `python:*-slim`）可能不包含此库。在 Debian 和 Ubuntu 上，在运行 Playwright 命令或使用 Python API 之前，以 root 身份安装 `libatomic1`：

```bash
apt-get update && apt-get install -y libatomic1
```

如果捆绑的 Node.js 无法启动，`playwright install --with-deps` 将无法安装此库。

## 安装 Playwright Pytest

Playwright 推荐使用官方的 [Playwright Pytest 插件](./test-runners.md)来编写端到端测试。它提供上下文隔离，开箱即用地支持在多种浏览器配置上运行。

通过安装 Playwright 并运行示例测试来开始使用，看看它的实际效果。

安装 [Pytest 插件](https://pypi.org/project/pytest-playwright/)：

<Tabs group-id="package-managers" default-value="pip" :tabs='[{"label":"Pip","value":"pip"},{"label":"Poetry","value":"poetry"},{"label":"uv","value":"uv"}]'>

<TabItem value="pip">

```bash
pip install pytest-playwright
```

</TabItem>

<TabItem value="poetry">

```bash
poetry add pytest-playwright
```

</TabItem>

<TabItem value="uv">

```bash
uv add pytest-playwright
```

</TabItem>

</Tabs>

安装所需的浏览器：

```bash
playwright install
```

## 添加示例测试

在当前工作目录或子目录中创建一个遵循 `test_` 前缀约定的文件，例如 `test_example.py`，并包含以下代码。确保你的测试名称也遵循 `test_` 前缀约定。

::: code-group

```python [test_example.py]
import re
from playwright.sync_api import Page, expect

def test_has_title(page: Page):
    page.goto("https://playwright.dev/")

    # 期望标题"包含"一个子字符串。
    expect(page).to_have_title(re.compile("Playwright"))

def test_get_started_link(page: Page):
    page.goto("https://playwright.dev/")

    # 点击"开始使用"链接。
    page.get_by_role("link", name="Get started").click()

    # 期望页面有一个名为 Installation 的标题。
    expect(page.get_by_role("heading", name="Installation")).to_be_visible()
```

:::

## 运行示例测试

默认情况下，测试将在 chromium 上运行。这可以通过 [CLI 选项](./running-tests.md)进行配置。测试在无头模式下运行，这意味着运行测试时不会打开浏览器 UI。测试结果和测试日志将显示在终端中。

```bash
pytest
```

## 更新 Playwright

要将 Playwright 更新到最新版本，请运行以下命令：

<Tabs group-id="package-managers" default-value="pip" :tabs='[{"label":"pip","value":"pip"},{"label":"Poetry","value":"poetry"},{"label":"uv","value":"uv"}]'>

<TabItem value="pip">

```bash
pip install pytest-playwright playwright -U
```

</TabItem>

<TabItem value="poetry">

```bash
poetry update pytest-playwright playwright
```

</TabItem>

<TabItem value="uv">

```bash
uv add --upgrade pytest-playwright playwright
```

</TabItem>

</Tabs>

## 系统要求
- Python 3.8 或更高版本。
- Windows 11+、Windows Server 2019+ 或 Windows Subsystem for Linux (WSL)。
- macOS 14 (Sonoma) 或更高版本。
- Debian 12 / 13、Ubuntu 22.04 / 24.04 / 26.04 (x86-64 或 arm64)。

## 下一步
- [使用 Web 优先断言、页面夹具和定位器编写测试](./writing-tests.md)
- [运行单个测试、多个测试、有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen.md)
- [查看测试的追踪记录](./trace-viewer-intro.md)
