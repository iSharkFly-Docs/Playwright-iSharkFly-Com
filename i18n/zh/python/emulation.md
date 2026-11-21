---
title: "模拟"
---

# 模拟

## 简介

使用 Playwright，您可以在任何浏览器上测试您的应用程序，还可以模拟真实设备，如手机或平板电脑。只需配置您想要模拟的设备，Playwright 就会模拟浏览器行为，如 `"userAgent"`、`"screenSize"`、`"viewport"` 以及是否启用 `"hasTouch"`。您还可以为所有测试或特定测试模拟 `"geolocation"`、`"locale"` 和 `"timezone"`，以及设置 `"permissions"` 来显示通知或更改 `"colorScheme"`。

## 设备

Playwright 附带了一个[设备参数注册表](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json)，使用 [`playwright.devices`](/python/api/class-playwright#playwright-devices) 来选择桌面、平板和移动设备。它可用于模拟特定设备的浏览器行为，如用户代理、屏幕大小、视口以及是否启用触摸功能。所有测试都将使用指定的设备参数运行。

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    iphone_13 = playwright.devices['iPhone 13']
    browser = await playwright.webkit.launch(headless=False)
    context = await browser.new_context(
        **iphone_13,
    )

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    iphone_13 = playwright.devices['iPhone 13']
    browser = playwright.webkit.launch(headless=False)
    context = browser.new_context(
        **iphone_13,
    )

with sync_playwright() as playwright:
    run(playwright)
```

:::

<img height="1582" width="916" alt="为 iPhone 13 模拟的 playwright.dev 网站" src="https://user-images.githubusercontent.com/13063165/220411073-76fe59f9-9a2d-463d-8e30-c19a7deca133.png" />

**注意**：预配置的设备假定特定的平台。例如，"Desktop Chrome" 将提供 Windows 特定的用户代理字符串。

如果您想使用运行测试的平台特定的用户代理，我们建议取消设置用户代理属性。

```python
desktop_chrome = playwright.devices["Desktop Chrome"]
context = browser.new_context(**desktop_chrome, user_agent=None)
```

## 视口

视口包含在设备中，但您可以为某些测试使用 [`page.set_viewport_size()`](/python/api/class-page#page-set-viewport-size) 覆盖它。

测试文件：

在测试文件中同样适用。

::: code-group

```python [Async]
# 使用给定视口创建上下文
context = await browser.new_context(
  viewport={ 'width': 1280, 'height': 1024 }
)

# 为单个页面调整视口大小
await page.set_viewport_size({"width": 1600, "height": 1200})

# 模拟高 DPI
context = await browser.new_context(
  viewport={ 'width': 2560, 'height': 1440 },
  device_scale_factor=2,
)
```

```python [Sync]
# 使用给定视口创建上下文
context = browser.new_context(
  viewport={ 'width': 1280, 'height': 1024 }
)

# 为单个页面调整视口大小
page.set_viewport_size({"width": 1600, "height": 1200})

# 模拟高 DPI
context = browser.new_context(
  viewport={ 'width': 2560, 'height': 1440 },
  device_scale_factor=2,
)
```

:::

## isMobile

是否考虑 meta viewport 标签并启用触摸事件。

::: code-group

```python [Async]
context = await browser.new_context(
  is_mobile=False
)
```

```python [Sync]
context = browser.new_context(
  is_mobile=False
)
```

:::

## 语言环境和时区

模拟浏览器的语言环境和时区，可以在配置中为所有测试全局设置，然后为特定测试覆盖。

::: code-group

```python [Async]
context = await browser.new_context(
  locale='de-DE',
  timezone_id='Europe/Berlin',
)
```

```python [Sync]
context = browser.new_context(
  locale='de-DE',
  timezone_id='Europe/Berlin',
)
```

:::

<img height="1824" width="2788" alt="德语和时区的必应" src="https://user-images.githubusercontent.com/13063165/220416571-ccc96ab1-44bb-4579-8430-64502fc24a15.png" />

## 权限

允许应用程序显示系统通知。

::: code-group

```python [Async]
context = await browser.new_context(
  permissions=['notifications'],
)
```

```python [Sync]
context = browser.new_context(
  permissions=['notifications'],
)
```

:::

允许特定域名的通知。

::: code-group

```python [Async]
await context.grant_permissions(['notifications'], origin='https://skype.com')
```

```python [Sync]
context.grant_permissions(['notifications'], origin='https://skype.com')
```

:::

使用 [`browser_context.clear_permissions()`](/python/api/class-browsercontext#browser-context-clear-permissions) 撤销所有权限。

::: code-group

```python [Async]
await context.clear_permissions()
```

```python [Sync]
context.clear_permissions()
```

:::

## 地理位置

授予 `"geolocation"` 权限并将地理位置设置为特定区域。

::: code-group

```python [Async]
context = await browser.new_context(
  geolocation={"longitude": 41.890221, "latitude": 12.492348},
  permissions=["geolocation"]
)
```

```python [Sync]
context = browser.new_context(
  geolocation={"longitude": 41.890221, "latitude": 12.492348},
  permissions=["geolocation"]
)
```

:::

<img height="1824" width="2788" alt="必应地图上意大利的地理位置" src="https://user-images.githubusercontent.com/13063165/220417670-bb22d815-f5cd-47c4-8562-0b88165eac27.png" />

稍后更改位置：

::: code-group

```python [Async]
await context.set_geolocation({"longitude": 48.858455, "latitude": 2.294474})
```

```python [Sync]
context.set_geolocation({"longitude": 48.858455, "latitude": 2.294474})
```

:::

**注意**：您只能为上下文中的所有页面更改地理位置。

## 颜色方案和媒体

模拟用户的 `"colorScheme"`。支持的值有 'light'、'dark' 和 'no-preference'。您还可以使用 [`page.emulate_media()`](/python/api/class-page#page-emulate-media) 模拟媒体类型。

::: code-group

```python [Async]
# 创建深色模式的上下文
context = await browser.new_context(
  color_scheme='dark' # 或 'light'
)

# 创建深色模式的页面
page = await browser.new_page(
  color_scheme='dark' # 或 'light'
)

# 更改页面的颜色方案
await page.emulate_media(color_scheme='dark')

# 更改页面的媒体
await page.emulate_media(media='print')
```

```python [Sync]
# 创建深色模式的上下文
context = browser.new_context(
  color_scheme='dark' # 或 'light'
)

# 创建深色模式的页面
page = browser.new_page(
  color_scheme='dark' # 或 'light'
)

# 更改页面的颜色方案
page.emulate_media(color_scheme='dark')

# 更改页面的媒体
page.emulate_media(media='print')
```

:::

<img height="1824" width="2788" alt="深色模式下的 playwright 网站" src="https://user-images.githubusercontent.com/13063165/220411638-55d2b051-4678-4da7-9f0b-ed22f5a3c47c.png" />

`"reducedMotion"`、`"forcedColors"` 和 `"contrast"` 选项以相同的方式模拟 `prefers-reduced-motion`、`forced-colors` 和 `prefers-contrast` 媒体功能。减少动画的支持值为 `'reduce'` 和 `'no-preference'`，强制颜色的支持值为 `'active'` 和 `'none'`，对比度的支持值为 `'more'` 和 `'no-preference'`。[`page.emulate_media()`](/python/api/class-page#page-emulate-media) 可为单个页面更改这些设置。

::: code-group

```python [Async]
# 创建减少动画、强制颜色和更高对比度的上下文
context = await browser.new_context(
  reduced_motion='reduce', # 或 'no-preference'
  forced_colors='active', # 或 'none'
  contrast='more' # 或 'no-preference'
)

# 更改页面的媒体功能
await page.emulate_media(reduced_motion='reduce', forced_colors='active', contrast='more')
```

```python [Sync]
# 创建减少动画、强制颜色和更高对比度的上下文
context = browser.new_context(
  reduced_motion='reduce', # 或 'no-preference'
  forced_colors='active', # 或 'none'
  contrast='more' # 或 'no-preference'
)

# 更改页面的媒体功能
page.emulate_media(reduced_motion='reduce', forced_colors='active', contrast='more')
```

:::

## 用户代理

用户代理包含在设备中，因此您很少需要更改它，但如果您确实需要测试不同的用户代理，可以使用 `userAgent` 属性覆盖它。

::: code-group

```python [Async]
context = await browser.new_context(
  user_agent='My user agent'
)
```

```python [Sync]
context = browser.new_context(
  user_agent='My user agent'
)
```

:::

## 离线

模拟网络离线状态。

::: code-group

```python [Async]
context = await browser.new_context(
  offline=True
)
```

```python [Sync]
context = browser.new_context(
  offline=True
)
```

:::

::: info
离线模拟影响 HTTP 请求，如页面导航、`fetch()` 和 `XMLHttpRequest`。

WebSocket 的行为取决于浏览器以及连接是否已建立。Chromium 和 Firefox 在离线时会使新的 WebSocket 连接失败，但不会关闭已打开的连接。Chromium 可以推迟传入消息直到上下文恢复在线，而不是丢失它们；Firefox 可以在离线时继续传递消息。WebKit 可以在离线时允许新的 WebSocket 连接和已建立连接的流量。不要依赖离线模拟来测试 WebSocket 消息丢失或连接关闭。

离线模拟不影响 WebRTC 流量：已建立的 `RTCPeerConnection` 会继续通过 UDP 发送和接收媒体。要测试 WebRTC 连接丢失，请在浏览器外部中断连接，例如停止 TURN 服务器或使用操作系统级防火墙。
:::

## 启用 JavaScript

模拟禁用 JavaScript 的用户场景。

::: code-group

```python [Async]
context = await browser.new_context(
  java_script_enabled=False
)
```

```python [Sync]
context = browser.new_context(
  java_script_enabled=False
)
```

:::
