---
title: "Chrome 扩展"
---

# Chrome 扩展

## 介绍

::: info
扩展仅在使用持久上下文启动时在 Chromium 中有效。使用自定义浏览器参数时需自担风险，因为某些参数可能会破坏 Playwright 功能。

Google Chrome 和 Microsoft Edge [移除了侧载扩展所需的命令行标志](https://groups.google.com/a/chromium.org/g/chromium-extensions/c/FxMU1TvxWWg/m/daZVTYNlBQAJ)，因此请使用 Playwright 捆绑的 Chromium。
:::

下面的代码片段检索源代码位于 `./my-extension` 的 [Manifest v3](https://developer.chrome.com/docs/extensions/develop/migrate) 扩展的 [service worker](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)。

注意使用 `chromium` 通道，它允许在无头模式下运行扩展。或者，您也可以在有头模式下启动浏览器。

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

path_to_extension = "./my-extension"
user_data_dir = "/tmp/test-user-data-dir"


async def run(playwright: Playwright):
    context = await playwright.chromium.launch_persistent_context(
        user_data_dir,
        channel="chromium",
        args=[
            f"--disable-extensions-except={path_to_extension}",
            f"--load-extension={path_to_extension}",
        ],
    )

    if len(context.service_workers) == 0:
        service_worker = await context.wait_for_event('serviceworker')
    else:
        service_worker = context.service_workers[0]

    # 像测试任何其他 worker 一样测试 service worker。
    await context.close()


async def main():
    async with async_playwright() as playwright:
        await run(playwright)


asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

path_to_extension = "./my-extension"
user_data_dir = "/tmp/test-user-data-dir"


def run(playwright: Playwright):
    context = playwright.chromium.launch_persistent_context(
        user_data_dir,
        channel="chromium",
        args=[
            f"--disable-extensions-except={path_to_extension}",
            f"--load-extension={path_to_extension}",
        ],
    )
    if len(context.service_workers) == 0:
        service_worker = context.wait_for_event('serviceworker')
    else:
        service_worker = context.service_workers[0]

    # 像测试任何其他 worker 一样测试 service worker。
    context.close()


with sync_playwright() as playwright:
    run(playwright)
```

:::

## Service worker 空闲挂起 (MV3)

Chrome MV3 service worker 在大约 30 秒不活动后会自动挂起，并在需要时重新启动。当这种情况发生时，Playwright 会保持**同一个 [Worker](/python/api/class-worker) 对象存活** — 不会发出新的 `'serviceworker'` 事件。在重启窗口期间发出的新 `evaluate()` 调用会暂停，直到新上下文准备好，然后自动恢复：

::: code-group

```python [Async]
sw = await context.wait_for_event('serviceworker')

# ... SW 在 30 秒不活动后挂起并被浏览器重新启动 ...

# 现有句柄在重启过程中是透明的。
await sw.evaluate("sendMessage({ type: 'ping' })")  # 正常工作
```

```python [Sync]
sw = context.wait_for_event('serviceworker')

# ... SW 在 30 秒不活动后挂起并被浏览器重新启动 ...

# 现有句柄在重启过程中是透明的。
sw.evaluate("sendMessage({ type: 'ping' })")  # 正常工作
```

:::

::: info
在挂起的确切时刻正在执行的 `evaluate()` 调用将抛出 `"Service worker restarted"` 异常，这与页面导航期间的行为一致。
:::

## 测试

要在运行测试时加载扩展，您可以使用测试夹具来设置上下文。您还可以动态检索扩展 id 并使用它来加载和测试弹出页面。

注意使用 `chromium` 通道，它允许在无头模式下运行扩展。或者，您也可以在有头模式下启动浏览器。

首先，添加加载扩展的夹具：

::: code-group

```python [conftest.py]
from typing import Generator
from pathlib import Path
from playwright.sync_api import Playwright, BrowserContext
import pytest


@pytest.fixture()
def context(playwright: Playwright) -> Generator[BrowserContext, None, None]:
    path_to_extension = Path(__file__).parent.joinpath("my-extension")
    context = playwright.chromium.launch_persistent_context(
        "",
        channel="chromium",
        args=[
            f"--disable-extensions-except={path_to_extension}",
            f"--load-extension={path_to_extension}",
        ],
    )
    yield context
    context.close()


@pytest.fixture()
def extension_id(context) -> Generator[str, None, None]:
    # 对于 manifest v3：
    service_worker = context.service_workers[0]
    if not service_worker:
        service_worker = context.wait_for_event("serviceworker")

    extension_id = service_worker.url.split("/")[2]
    yield extension_id

```

:::

然后在测试中使用这些夹具：

::: code-group

```python [test_foo.py]
from playwright.sync_api import expect, Page


def test_example_test(page: Page) -> None:
    page.goto("https://example.com")
    expect(page.locator("body")).to_contain_text("Changed by my-extension")


def test_popup_page(page: Page, extension_id: str) -> None:
    page.goto(f"chrome-extension://{extension_id}/popup.html")
    expect(page.locator("body")).to_have_text("my-extension popup")
```

:::
