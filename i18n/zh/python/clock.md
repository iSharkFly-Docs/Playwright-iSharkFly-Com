---
title: "时钟"
---

# 时钟

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

准确模拟时间相关行为对于验证应用程序的正确性至关重要。利用 [Clock](/python/api/class-clock) 功能允许开发人员在测试中操纵和控制时间，从而能够精确验证诸如渲染时间、超时、计划任务等功能，而无需实时执行的延迟和可变性。

[Clock](/python/api/class-clock) API 提供以下方法来控制时间：
- `setFixedTime`：为 `Date.now()` 和 `new Date()` 设置固定时间。
- `install`：初始化时钟并允许你：
  - `pauseAt`：在特定时间暂停时间。
  - `fastForward`：快进时间。
  - `runFor`：运行特定持续时间的时间。
  - `resume`：恢复时间。
- `setSystemTime`：设置当前系统时间。

推荐的方法是使用 `setFixedTime` 将时间设置为特定值。如果这不适合你的用例，你可以使用 `install`，它允许你稍后暂停时间、快进时间、滴答时间等。`setSystemTime` 仅推荐用于高级用例。

::: info
[`page.clock`](/python/api/class-page#page-clock) 覆盖与时间相关的原生全局类和函数，允许手动控制它们：
- `Date`
- `Temporal.Now`
- `setTimeout`
- `clearTimeout`
- `setInterval`
- `clearInterval`
- `requestAnimationFrame`
- `cancelAnimationFrame`
- `requestIdleCallback`
- `cancelIdleCallback`
- `performance`
- `Event.timeStamp`
:::

::: warning
如果你在测试中的任何时候调用 `install`，该调用*必须*在任何其他与时钟相关的调用之前发生（请参阅上面的列表）。不按顺序调用这些方法将导致未定义的行为。例如，你不能调用 `setInterval`，然后调用 `install`，然后调用 `clearInterval`，因为 `install` 会覆盖时钟函数的原生定义。
:::

## 使用预定义时间测试

通常你只需要伪造 `Date.now` 同时保持计时器运行。这样时间自然流动，但 `Date.now` 始终返回固定值。

```html
<div id="current-time" data-testid="current-time"></div>
<script>
  const renderTime = () => {
    document.getElementById('current-time').textContent =
        new Date().toLocaleString();
  };
  setInterval(renderTime, 1000);
</script>
```

::: code-group

```python [Async]
await page.clock.set_fixed_time(datetime.datetime(2024, 2, 2, 10, 0, 0))
await page.goto("http://localhost:3333")
await expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:00:00 AM")

await page.clock.set_fixed_time(datetime.datetime(2024, 2, 2, 10, 30, 0))
# 我们知道页面有一个每秒更新时间的计时器。
await expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:30:00 AM")
```

```python [Sync]
page.clock.set_fixed_time(datetime.datetime(2024, 2, 2, 10, 0, 0))
page.goto("http://localhost:3333")
expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:00:00 AM")
page.clock.set_fixed_time(datetime.datetime(2024, 2, 2, 10, 30, 0))
# 我们知道页面有一个每秒更新时间的计时器。
expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:30:00 AM")
```

:::

## 一致的时间和计时器

有时你的计时器依赖于 `Date.now`，当 `Date.now` 值不随时间变化时会感到困惑。在这种情况下，你可以安装时钟并在测试时快进到感兴趣的时间。

```html
<div id="current-time" data-testid="current-time"></div>
<script>
  const renderTime = () => {
    document.getElementById('current-time').textContent =
        new Date().toLocaleString();
  };
  setInterval(renderTime, 1000);
</script>
```

::: code-group

```python [Async]
# 在测试时间之前用某个时间初始化时钟，让页面自然加载。
# `Date.now` 将随着计时器触发而前进。
await page.clock.install(time=datetime.datetime(2024, 2, 2, 8, 0, 0))
await page.goto("http://localhost:3333")

# 假装用户关闭了笔记本电脑盖，并在上午 10 点再次打开。
# 到达该时间点后暂停时间。
await page.clock.pause_at(datetime.datetime(2024, 2, 2, 10, 0, 0))

# 断言页面状态。
await expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:00:00 AM")

# 再次关闭笔记本电脑盖并在上午 10:30 打开。
await page.clock.fast_forward("30:00")
await expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:30:00 AM")
```

```python [Sync]
# 在测试时间之前用某个时间初始化时钟，让页面自然加载。
# `Date.now` 将随着计时器触发而前进。
page.clock.install(time=datetime.datetime(2024, 2, 2, 8, 0, 0))
page.goto("http://localhost:3333")

# 假装用户关闭了笔记本电脑盖，并在上午 10 点再次打开。
# 到达该时间点后暂停时间。
page.clock.pause_at(datetime.datetime(2024, 2, 2, 10, 0, 0))

# 断言页面状态。
expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:00:00 AM")

# 再次关闭笔记本电脑盖并在上午 10:30 打开。
page.clock.fast_forward("30:00")
expect(page.get_by_test_id("current-time")).to_have_text("2/2/2024, 10:30:00 AM")
```

:::

## 测试不活动监控

不活动监控是 Web 应用程序中的一个常见功能，它在用户一段时间不活动后将其登出。测试此功能可能很棘手，因为你需要等待很长时间才能看到效果。借助时钟，你可以加速时间并快速测试此功能。

```html
<div id="remaining-time" data-testid="remaining-time"></div>
<script>
  const endTime = Date.now() + 5 * 60_000;
  const renderTime = () => {
    const diffInSeconds = Math.round((endTime - Date.now()) / 1000);
    if (diffInSeconds <= 0) {
      document.getElementById('remaining-time').textContent =
        'You have been logged out due to inactivity.';
    } else {
      document.getElementById('remaining-time').textContent =
        `You will be logged out in ${diffInSeconds} seconds.`;
    }
    setTimeout(renderTime, 1000);
  };
  renderTime();
</script>
<button type="button">Interaction</button>
```

::: code-group

```python [Async]
# 初始时间对测试无关紧要，所以我们可以选择当前时间。
await page.clock.install()
await page.goto("http://localhost:3333")
# 与页面交互
await page.get_by_role("button").click()

# 快进时间 5 分钟，就像用户没有做任何事情。
# 快进就像关闭笔记本电脑盖并在 5 分钟后打开。
# 所有到期的计时器将像在真实浏览器中一样立即触发一次。
await page.clock.fast_forward("05:00")

# 检查用户是否因不活动而自动登出。
await expect(page.get_by_text("You have been logged out due to inactivity.")).to_be_visible()
```

```python [Sync]
# 初始时间对测试无关紧要，所以我们可以选择当前时间。
page.clock.install()
page.goto("http://localhost:3333")
# 与页面交互
page.get_by_role("button").click()

# 快进时间 5 分钟，就像用户没有做任何事情。
# 快进就像关闭笔记本电脑盖并在 5 分钟后打开。
# 所有到期的计时器将像在真实浏览器中一样立即触发一次。
page.clock.fast_forward("05:00")

# 检查用户是否因不活动而自动登出。
expect(page.get_by_text("You have been logged out due to inactivity.")).to_be_visible()
```

:::

## 手动滴答时间，一致地触发所有计时器

在少数情况下，你可能希望手动滴答时间，在此过程中触发所有计时器和动画帧，以实现对时间流逝的精细控制。

```html
<div id="current-time" data-testid="current-time"></div>
<script>
  const renderTime = () => {
    document.getElementById('current-time').textContent =
        new Date().toLocaleString();
  };
  setInterval(renderTime, 1000);
</script>
```

::: code-group

```python [Async]
# 用特定时间初始化时钟，让页面自然加载。
await page.clock.install(time=
    datetime.datetime(2024, 2, 2, 8, 0, 0, tzinfo=datetime.timezone.pst),
)
await page.goto("http://localhost:3333")
locator = page.get_by_test_id("current-time")

# 暂停时间流，停止计时器，你现在可以手动控制
# 页面时间。
await page.clock.pause_at(datetime.datetime(2024, 2, 2, 10, 0, 0))
await expect(locator).to_have_text("2/2/2024, 10:00:00 AM")

# 手动滴答时间，在此过程中触发所有计时器。
# 在这种情况下，屏幕上的时间将更新 2 次。
await page.clock.run_for(2000)
await expect(locator).to_have_text("2/2/2024, 10:00:02 AM")
```

```python [Sync]
# 用特定时间初始化时钟，让页面自然加载。
page.clock.install(
    time=datetime.datetime(2024, 2, 2, 8, 0, 0, tzinfo=datetime.timezone.pst),
)
page.goto("http://localhost:3333")
locator = page.get_by_test_id("current-time")

# 暂停时间流，停止计时器，你现在可以手动控制
# 页面时间。
page.clock.pause_at(datetime.datetime(2024, 2, 2, 10, 0, 0))
expect(locator).to_have_text("2/2/2024, 10:00:00 AM")

# 手动滴答时间，在此过程中触发所有计时器。
# 在这种情况下，屏幕上的时间将更新 2 次。
page.clock.run_for(2000)
expect(locator).to_have_text("2/2/2024, 10:00:02 AM")
```

:::

## 相关视频

<LiteYouTube
id="54_aC-rVKHg"
title="Playwright 1.45"
/>
