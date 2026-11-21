---
title: "入门 - 库"
---

# 入门 - 库

## 安装

在 Linux 上，捆绑的 Node.js 需要 `libatomic.so.1`。如果缺少该文件，请在运行以下命令之前[安装 `libatomic1`](./intro.md#linux-system-dependency)。

[<img src="https://badge.fury.io/py/playwright.svg" alt="PyPI version" width="132" height="20" />](https://pypi.python.org/pypi/playwright/)

<Tabs group-id="package-managers" default-value="pip" :tabs='[{"label":"Pip","value":"pip"},{"label":"Poetry","value":"poetry"},{"label":"uv","value":"uv"}]'>

<TabItem value="pip">

```bash
pip install --upgrade pip
pip install playwright
playwright install
```

</TabItem>

<TabItem value="poetry">

```bash
poetry self update
poetry add playwright
playwright install
```

</TabItem>

<TabItem value="uv">

```bash
uv self update
uv add playwright
playwright install
```

</TabItem>

</Tabs>

这些命令会下载 Playwright 包并安装 Chromium、Firefox 和 WebKit 的浏览器二进制文件。要修改此行为，请参阅[安装参数](./browsers.md#install-browsers)。

## 使用

安装后，您可以在 Python 脚本中 `import` Playwright，并启动 3 种浏览器中的任何一种（`chromium`、`firefox` 和 `webkit`）。

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://playwright.dev")
    print(page.title())
    browser.close()
```

Playwright 支持两种 API 变体：同步和异步。如果您的现代项目使用 [asyncio](https://docs.python.org/3/library/asyncio.html)，您应该使用异步 API：

```python
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("https://playwright.dev")
        print(await page.title())
        await browser.close()

asyncio.run(main())
```

## 第一个脚本

在我们的第一个脚本中，我们将导航到 `https://playwright.dev/` 并在 WebKit 中截取屏幕截图。

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.webkit.launch()
    page = browser.new_page()
    page.goto("https://playwright.dev/")
    page.screenshot(path="example.png")
    browser.close()
```

默认情况下，Playwright 以无头模式运行浏览器。要查看浏览器 UI，请将 [`headless`](/python/api/class-browsertype#browser-type-launch-option-headless) 选项设置为 `False`。您还可以使用 [`slow_mo`](/python/api/class-browsertype#browser-type-launch-option-slow-mo) 来减慢执行速度。在调试工具[部分](./debug.md)了解更多。

```python
firefox.launch(headless=False, slow_mo=50)
```

## 交互模式（REPL）

您可以启动交互式 Python REPL：

```bash
python
```

然后在其中启动 Playwright 进行快速实验：

```python
from playwright.sync_api import sync_playwright
playwright = sync_playwright().start()
# 使用 playwright.chromium、playwright.firefox 或 playwright.webkit
# 将 headless=False 传递给 launch() 以查看浏览器 UI
browser = playwright.chromium.launch()
page = browser.new_page()
page.goto("https://playwright.dev/")
page.screenshot(path="example.png")
browser.close()
playwright.stop()
```

异步 REPL，如 `asyncio` REPL：

```bash
python -m asyncio
```

```python
from playwright.async_api import async_playwright
playwright = await async_playwright().start()
browser = await playwright.chromium.launch()
page = await browser.new_page()
await page.goto("https://playwright.dev/")
await page.screenshot(path="example.png")
await browser.close()
await playwright.stop()
```

## Pyinstaller

您可以将 Playwright 与 [Pyinstaller](https://www.pyinstaller.org/) 一起使用来创建独立的可执行文件。

::: code-group

```python [main.py]
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://playwright.dev/")
    page.screenshot(path="example.png")
    browser.close()
```

:::

如果您想将浏览器与可执行文件捆绑在一起：

::: code-group

```bash [Bash]
PLAYWRIGHT_BROWSERS_PATH=0 playwright install chromium
pyinstaller -F main.py
```

```bat [Batch]
set PLAYWRIGHT_BROWSERS_PATH=0
playwright install chromium
pyinstaller -F main.py
```

```powershell [PowerShell]
$env:PLAYWRIGHT_BROWSERS_PATH="0"
playwright install chromium
pyinstaller -F main.py
```

:::

::: info
将浏览器与可执行文件捆绑会生成更大的二进制文件。
建议只捆绑您使用的浏览器。
:::

## 已知问题

### `time.sleep()` 导致状态过时

大多数情况下您不需要手动等待，因为 Playwright 具有[自动等待](./actionability.md)功能。如果您仍然依赖它，应该使用 `page.wait_for_timeout(5000)` 而不是 `time.sleep(5)`，最好不要等待超时，但有时它对调试很有用。在这些情况下，请使用我们的 wait（`wait_for_timeout`）方法而不是 `time` 模块。这是因为我们内部依赖于异步操作，使用 `time.sleep(5)` 时它们无法正确处理。

### 与 Windows 上 `asyncio` 的 `SelectorEventLoop` 不兼容

Playwright 在子进程中运行驱动程序，因此在 Windows 上需要 `asyncio` 的 `ProactorEventLoop`，因为 `SelectorEventLoop` 不支持异步子进程。

在 Windows Python 3.7 上，Playwright 将默认事件循环设置为 `ProactorEventLoop`，因为它是 Python 3.8+ 的默认值。

### 线程

Playwright 的 API 不是线程安全的。如果您在多线程环境中使用 Playwright，应该为每个线程创建一个 playwright 实例。有关更多详细信息，请参阅[线程问题](https://github.com/microsoft/playwright-python/issues/623)。

### 取消 `asyncio` 任务

不支持取消正在运行 Playwright 调用的任务，这会导致未定义的行为。如果操作必须比其调用者存活更长时间，请在单独的任务中运行它并使用 [`asyncio.shield()`](https://docs.python.org/3/library/asyncio-task.html#asyncio.shield) 保护它。
