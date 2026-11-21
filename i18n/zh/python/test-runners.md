---
title: "Pytest 插件参考"
---

# Pytest 插件参考

## 简介

Playwright 提供了一个 [Pytest](https://docs.pytest.org/en/stable/) 插件来编写端到端测试。要开始使用，请参阅[入门指南](./intro.md)。

## 使用

要运行测试，请使用 [Pytest](https://docs.pytest.org/en/stable/) CLI。

```bash
pytest --browser webkit --headed
```

如果您想自动添加 CLI 参数而不必每次指定，可以使用 [pytest.ini](https://docs.pytest.org/en/stable/reference.html#ini-options-ref) 文件：

```ini
# pytest.ini 的内容
[pytest]
# 使用 UI 运行 firefox
addopts = --headed --browser firefox
```

## CLI 参数

请注意，CLI 参数仅应用于默认的 `browser`、`context` 和 `page` fixtures。
如果您使用 API 调用创建浏览器、上下文或页面，如 [`browser.new_context()`](/python/api/class-browser#browser-new-context)，则不会应用 CLI 参数。
- `--headed`：以有头模式运行测试（默认：无头）。
- `--browser`：在不同浏览器中运行测试，可以是 `chromium`、`firefox` 或 `webkit`。可以多次指定（默认：`chromium`）。
- `--browser-channel` 要使用的[浏览器通道](./browsers.md)。
- `--slowmo` 将 Playwright 操作减慢指定的毫秒数。用于查看正在发生的事情（默认：0）。
- `--device` 要模拟的[设备](./emulation.md)。
- `--output` 测试生成的工件的目录（默认：`test-results`）。
- `--tracing` 是否为每个测试录制[跟踪](./trace-viewer.md)。`on`、`off` 或 `retain-on-failure`（默认：`off`）。
- `--video` 是否为每个测试录制视频。`on`、`off` 或 `retain-on-failure`（默认：`off`）。
- `--screenshot` 是否在每个测试后自动捕获屏幕截图。`on`、`off` 或 `only-on-failure`（默认：`off`）。
- `--full-page-screenshot` 是否在失败时截取整页屏幕截图。默认情况下，只捕获视口。需要启用 `--screenshot`（默认：`off`）。

## Fixtures

此插件为 pytest 配置了 Playwright 特定的 [fixtures](https://docs.pytest.org/en/latest/fixture.html)。要使用这些 fixtures，请将 fixture 名称用作测试函数的参数。

```python
def test_my_app_is_working(fixture_name):
    pass
    # 使用 fixture_name 进行测试
    # ...
```

**函数作用域**：这些 fixtures 在测试函数中请求时创建，并在测试结束时销毁。
- `context`：测试的新[浏览器上下文](./browser-contexts)。
- `page`：测试的新[浏览器页面](./pages)。
- `new_context`：允许为测试创建不同的[浏览器上下文](./browser-contexts)。对多用户场景很有用。接受与 [`browser.new_context()`](/python/api/class-browser#browser-new-context) 相同的参数。

**会话作用域**：这些 fixtures 在测试函数中请求时创建，并在所有测试结束时销毁。
- `playwright`：[Playwright](./api/class-playwright) 实例。
- `browser_type`：当前浏览器的 [BrowserType](./api/class-browsertype) 实例。
- `browser`：Playwright 启动的 [Browser](./api/class-browser) 实例。
- `browser_name`：浏览器名称（字符串）。
- `browser_channel`：浏览器通道（字符串）。
- `is_chromium`、`is_webkit`、`is_firefox`：相应浏览器类型的布尔值。

**自定义 fixture 选项**：对于 `browser` 和 `context` fixtures，使用以下 fixtures 定义自定义启动选项。
- `browser_type_launch_args`：覆盖 [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch) 的启动参数。应返回 Dict。
- `browser_context_args`：覆盖 [`browser.new_context()`](/python/api/class-browser#browser-new-context) 的选项。应返回 Dict。
- `connect_options`：通过 WebSocket 端点连接到现有浏览器。应返回包含 [`browser_type.connect()`](/python/api/class-browsertype#browser-type-connect) 选项的 Dict。

也可以使用 `browser_context_args` 标记为单个测试覆盖上下文选项（[`browser.new_context()`](/python/api/class-browser#browser-new-context)）：

```python
import pytest

@pytest.mark.browser_context_args(timezone_id="Europe/Berlin", locale="en-GB")
def test_browser_context_args(page):
    assert page.evaluate("window.navigator.userAgent") == "Europe/Berlin"
    assert page.evaluate("window.navigator.languages") == ["de-DE"]
```

## 并行：同时运行多个测试

如果您的测试在具有大量 CPU 的机器上运行，可以使用 [`pytest-xdist`](https://pypi.org/project/pytest-xdist/) 同时运行多个测试来加快测试套件的整体执行时间：

```bash
# 安装依赖
pip install pytest-xdist
# 使用 --numprocesses 标志
pytest --numprocesses auto
```

根据硬件和测试的性质，您可以将 `numprocesses` 设置为从 `2` 到机器上 CPU 数量的任何值。如果设置得太高，可能会出现意外行为。

有关 `pytest` 选项的一般信息，请参阅[运行测试](./running-tests.md)。

## 示例

### 配置类型提示以实现自动完成

::: code-group

```python [test_my_application.py]
from playwright.sync_api import Page

def test_visit_admin_dashboard(page: Page):
    page.goto("/admin")
    # ...
```

:::

如果您使用带有 Pylance 的 VSCode，可以通过启用 `python.testing.pytestEnabled` 设置来推断这些类型，这样您就不需要类型注解。

### 使用多个上下文

为了模拟多个用户，您可以创建多个 [`BrowserContext`](./browser-contexts) 实例。

::: code-group

```python [test_my_application.py]
from playwright.sync_api import Page, BrowserContext
from pytest_playwright.pytest_playwright import CreateContextCallback

def test_foo(page: Page, new_context: CreateContextCallback) -> None:
    page.goto("https://example.com")
    context = new_context()
    page2 = context.new_page()
    # page 和 page2 在不同的上下文中
```

:::

### 按浏览器跳过测试

::: code-group

```python [test_my_application.py]
import pytest

@pytest.mark.skip_browser("firefox")
def test_visit_example(page):
    page.goto("https://example.com")
    # ...
```

:::

### 在特定浏览器上运行

::: code-group

```python [conftest.py]
import pytest

@pytest.mark.only_browser("chromium")
def test_visit_example(page):
    page.goto("https://example.com")
    # ...
```

:::

### 使用自定义浏览器通道运行，如 Google Chrome 或 Microsoft Edge

```bash
pytest --browser-channel chrome
```

::: code-group

```python [test_my_application.py]
def test_example(page):
    page.goto("https://example.com")
```

:::

### 配置 base-url

使用 `base-url` 参数启动 Pytest。[`pytest-base-url`](https://github.com/pytest-dev/pytest-base-url) 插件用于此目的，它允许您从配置、CLI 参数或作为 fixture 设置基本 URL。

```bash
pytest --base-url http://localhost:8080
```

::: code-group

```python [test_my_application.py]
def test_visit_example(page):
    page.goto("/admin")
    # -> 将变成 http://localhost:8080/admin
```

:::

### 忽略 HTTPS 错误

::: code-group

```python [conftest.py]
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "ignore_https_errors": True
    }
```

:::

### 使用自定义视口大小

::: code-group

```python [conftest.py]
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "viewport": {
            "width": 1920,
            "height": 1080,
        }
    }
```

:::

### 设备模拟 / BrowserContext 选项覆盖

::: code-group

```python [conftest.py]
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, playwright):
    iphone_11 = playwright.devices['iPhone 11 Pro']
    return {
        **browser_context_args,
        **iphone_11,
    }
```

:::

或通过 CLI `--device="iPhone 11 Pro"`

### 连接到远程浏览器

::: code-group

```python [conftest.py]
import pytest

@pytest.fixture(scope="session")
def connect_options():
    return {
        "wsEndpoint": "ws://localhost:8080/ws"
    }
```

:::

### 与 `unittest.TestCase` 一起使用

请参阅以下示例以与 `unittest.TestCase` 一起使用。这有一个限制，
即只能指定单个浏览器，并且在指定多个浏览器时不会生成多浏览器矩阵。

```python
import pytest
import unittest

from playwright.sync_api import Page


class MyTest(unittest.TestCase):
    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        self.page = page

    def test_foobar(self):
        self.page.goto("https://microsoft.com")
        self.page.locator("#foobar").click()
        assert self.page.evaluate("1 + 1") == 2
```

## 调试

### 与 pdb 一起使用

在测试代码中使用 `breakpoint()` 语句来暂停执行并获取 [pdb](https://docs.python.org/3/library/pdb.html) REPL。

```python
def test_bing_is_working(page):
    page.goto("https://bing.com")
    breakpoint()
    # ...
```

## 部署到 CI

请参阅 [CI 提供商指南](./ci.md)将测试部署到 CI/CD。

## 异步 Fixtures

要使用异步 fixtures，请安装 [`pytest-playwright-asyncio`](https://pypi.org/project/pytest-playwright-asyncio/)。

确保您使用 `pytest-asyncio>=0.26.0` 并在配置中设置 [`asyncio_default_test_loop_scope = session`](https://pytest-asyncio.readthedocs.io/en/v0.26.0/how-to-guides/change_default_test_loop.html)（`pytest.ini/pyproject.toml/setup.cfg`）。

```python
import pytest
from playwright.async_api import Page

@pytest.mark.asyncio(loop_scope="session")
async def test_foo(page: Page):
    await page.goto("https://github.com")
    # ...
```
