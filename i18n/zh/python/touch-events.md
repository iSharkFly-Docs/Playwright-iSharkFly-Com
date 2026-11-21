---
title: "触摸事件（传统）"
---

# 触摸事件（传统）

## 简介

处理传统[触摸事件](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)以响应滑动、捏合和点击等手势的 Web 应用程序可以通过手动向页面分发 [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent) 来测试。以下示例演示如何使用 [`locator.dispatch_event()`](/python/api/class-locator#locator-dispatch-event) 并传递 [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) 点作为参数。

请注意，[`locator.dispatch_event()`](/python/api/class-locator#locator-dispatch-event) 不会设置 [`Event.isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) 属性。如果你的网页依赖它，请确保在测试期间禁用 `isTrusted` 检查。

### 模拟平移手势

在下面的示例中，我们模拟预期移动地图的平移手势。被测应用程序仅使用触摸点的 `clientX/clientY` 坐标，因此我们只初始化这些。在更复杂的场景中，如果你的应用程序需要，你可能还需要设置 `pageX/pageY/screenX/screenY`。

::: code-group

```python [Sync]
from playwright.sync_api import sync_playwright, expect

def pan(locator, deltaX=0, deltaY=0, steps=5):
    bounds = locator.bounding_box()
    centerX = bounds['x'] + bounds['width'] / 2
    centerY = bounds['y'] + bounds['height'] / 2

    touches = [{
        'identifier': 0,
        'clientX': centerX,
        'clientY': centerY,
    }]
    locator.dispatch_event('touchstart', {
        'touches': touches,
        'changedTouches': touches,
        'targetTouches': touches
    })

    for i in range(1, steps + 1):
        touches = [{
            'identifier': 0,
            'clientX': centerX + deltaX * i / steps,
            'clientY': centerY + deltaY * i / steps,
        }]
        locator.dispatch_event('touchmove', {
            'touches': touches,
            'changedTouches': touches,
            'targetTouches': touches
        })

    locator.dispatch_event('touchend')

def test_pan_gesture_to_move_the_map(page):
    page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z', wait_until='commit')
    page.get_by_role('button', name='Keep using web').click()
    expect(page.get_by_role('button', name='Keep using web')).not_to_be_visible()
    met = page.locator('[data-test-id="met"]')
    for _ in range(5):
        pan(met, 200, 100)
    page.screenshot(path="screenshot.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(**p.devices['Pixel 7'])
    page = context.new_page()
    test_pan_gesture_to_move_the_map(page)
    browser.close()
```

```python [Async]
from playwright.async_api import async_playwright, expect

async def pan(locator, deltaX=0, deltaY=0, steps=5):
    bounds = await locator.bounding_box()
    centerX = bounds['x'] + bounds['width'] / 2
    centerY = bounds['y'] + bounds['height'] / 2

    touches = [{
        'identifier': 0,
        'clientX': centerX,
        'clientY': centerY,
    }]
    await locator.dispatch_event('touchstart', {
        'touches': touches,
        'changedTouches': touches,
        'targetTouches': touches
    })

    for i in range(1, steps + 1):
        touches = [{
            'identifier': 0,
            'clientX': centerX + deltaX * i / steps,
            'clientY': centerY + deltaY * i / steps,
        }]
        await locator.dispatch_event('touchmove', {
            'touches': touches,
            'changedTouches': touches,
            'targetTouches': touches
        })

    await locator.dispatch_event('touchend')

async def test_pan_gesture_to_move_the_map(page):
    await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z', wait_until='commit')
    await page.get_by_role('button', name='Keep using web').click()
    await expect(page.get_by_role('button', name='Keep using web')).not_to_be_visible()
    met = page.locator('[data-test-id="met"]')
    for _ in range(5):
        await pan(met, 200, 100)
    await page.screenshot(path="screenshot.png")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(**p.devices['Pixel 7'])
        page = await context.new_page()
        await test_pan_gesture_to_move_the_map(page)
        await browser.close()

import asyncio
asyncio.run(main())
```

:::

### 模拟捏合手势

在下面的示例中，我们模拟捏合手势，即两个触摸点相互靠近。这预期会缩小地图。被测应用程序仅使用触摸点的 `clientX/clientY` 坐标，因此我们只初始化这些。在更复杂的场景中，如果你的应用程序需要，你可能还需要设置 `pageX/pageY/screenX/screenY`。

::: code-group

```python [Async]
from playwright.async_api import async_playwright, expect

async def pinch(locator, arg):
    bounds = await locator.bounding_box()
    centerX = bounds['x'] + bounds['width'] / 2
    centerY = bounds['y'] + bounds['height'] / 2

    deltaX = arg.get('deltaX', 50)
    steps = arg.get('steps', 5)
    stepDeltaX = deltaX / (steps + 1)

    touches = [
        {
            'identifier': 0,
            'clientX': centerX - (deltaX if arg.get('direction') == 'in' else stepDeltaX),
            'clientY': centerY,
        },
        {
            'identifier': 1,
            'clientX': centerX + (deltaX if arg.get('direction') == 'in' else stepDeltaX),
            'clientY': centerY,
        },
    ]
    await locator.dispatch_event('touchstart', {
        'touches': touches,
        'changedTouches': touches,
        'targetTouches': touches
    })

    for i in range(1, steps + 1):
        offset = deltaX - i * stepDeltaX if arg.get('direction') == 'in' else stepDeltaX * (i + 1)
        touches = [
            {
                'identifier': 0,
                'clientX': centerX - offset,
                'clientY': centerY,
            },
            {
                'identifier': 1,
                'clientX': centerX + offset,
                'clientY': centerY,
            },
        ]
        await locator.dispatch_event('touchmove', {
            'touches': touches,
            'changedTouches': touches,
            'targetTouches': touches
        })

    await locator.dispatch_event('touchend', {
        'touches': [],
        'changedTouches': [],
        'targetTouches': []
    })

async def test_pinch_in_gesture_to_zoom_out_the_map(page):
    await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z', wait_until='commit')
    await page.get_by_role('button', name='Keep using web').click()
    await expect(page.get_by_role('button', name='Keep using web')).not_to_be_visible()
    met = page.locator('[data-test-id="met"]')
    for _ in range(5):
        await pinch(met, {'deltaX': 40, 'direction': 'in'})
    await page.screenshot(path="screenshot.png")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(**p.devices['Pixel 7'])
        page = await context.new_page()
        await test_pinch_in_gesture_to_zoom_out_the_map(page)
        await browser.close()

import asyncio
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, expect

def pinch(locator, arg):
    bounds = locator.bounding_box()
    centerX = bounds['x'] + bounds['width'] / 2
    centerY = bounds['y'] + bounds['height'] / 2

    deltaX = arg.get('deltaX', 50)
    steps = arg.get('steps', 5)
    stepDeltaX = deltaX / (steps + 1)

    touches = [
        {
            'identifier': 0,
            'clientX': centerX - (deltaX if arg.get('direction') == 'in' else stepDeltaX),
            'clientY': centerY,
        },
        {
            'identifier': 1,
            'clientX': centerX + (deltaX if arg.get('direction') == 'in' else stepDeltaX),
            'clientY': centerY,
        },
    ]
    locator.dispatch_event('touchstart', {
        'touches': touches,
        'changedTouches': touches,
        'targetTouches': touches
    })

    for i in range(1, steps + 1):
        offset = deltaX - i * stepDeltaX if arg.get('direction') == 'in' else stepDeltaX * (i + 1)
        touches = [
            {
                'identifier': 0,
                'clientX': centerX - offset,
                'clientY': centerY,
            },
            {
                'identifier': 1,
                'clientX': centerX + offset,
                'clientY': centerY,
            },
        ]
        locator.dispatch_event('touchmove', {
            'touches': touches,
            'changedTouches': touches,
            'targetTouches': touches
        })

    locator.dispatch_event('touchend', {
        'touches': [],
        'changedTouches': [],
        'targetTouches': []
    })

def test_pinch_in_gesture_to_zoom_out_the_map(page):
    page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z', wait_until='commit')
    page.get_by_role('button', name='Keep using web').click()
    expect(page.get_by_role('button', name='Keep using web')).not_to_be_visible()
    met = page.locator('[data-test-id="met"]')
    for _ in range(5):
        pinch(met, {'deltaX': 40, 'direction': 'in'})
    page.screenshot(path="screenshot.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(**p.devices['Pixel 7'])
    page = context.new_page()
    test_pinch_in_gesture_to_zoom_out_the_map(page)
    browser.close()
```

:::
