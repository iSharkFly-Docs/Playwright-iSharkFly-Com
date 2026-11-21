---
title: "时钟"
---

# 时钟

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

准确模拟时间相关的行为对于验证应用程序的正确性至关重要。利用 [Clock](/dotnet/api/class-clock) 功能允许开发人员在测试中操纵和控制时间，使得能够精确验证诸如渲染时间、超时、定时任务等功能，而无需实时执行的延迟和不确定性。

[Clock](/dotnet/api/class-clock) API 提供以下方法来控制时间：
- `setFixedTime`：为 `Date.now()` 和 `new Date()` 设置固定时间。
- `install`：初始化时钟并允许你：
  - `pauseAt`：在特定时间暂停时间。
  - `fastForward`：快进时间。
  - `runFor`：运行特定持续时间的时间。
  - `resume`：恢复时间。
- `setSystemTime`：设置当前系统时间。

推荐的方法是使用 `setFixedTime` 将时间设置为特定值。如果这不适用于你的用例，你可以使用 `install`，它允许你稍后暂停时间、快进时间、推进时间等。`setSystemTime` 仅推荐用于高级用例。

::: info
[`Page.Clock`](/dotnet/api/class-page#page-clock) 覆盖与时间相关的原生全局类和函数，允许手动控制它们：
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
如果你在测试中的任何时候调用 `install`，该调用_必须_在任何其他与时钟相关的调用之前发生（请参阅上面的列表）。不按顺序调用这些方法将导致未定义的行为。例如，你不能调用 `setInterval`，然后调用 `install`，再调用 `clearInterval`，因为 `install` 覆盖了时钟函数的原生定义。
:::

## 使用预定义时间测试

通常你只需要伪造 `Date.now` 同时保持定时器运行。这样时间自然流逝，但 `Date.now` 始终返回固定值。

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

```csharp
// 为时钟设置固定时间。
await Page.Clock.SetFixedTimeAsync(new DateTime(2024, 2, 2, 10, 0, 0));
await Page.GotoAsync("http://localhost:3333");
await Expect(Page.GetByTestId("current-time")).ToHaveTextAsync("2/2/2024, 10:00:00 AM");
// 为时钟设置固定时间。
await Page.Clock.SetFixedTimeAsync(new DateTime(2024, 2, 2, 10, 30, 0));
// 我们知道页面有一个每秒更新时间的定时器。
await Expect(Page.GetByTestId("current-time")).ToHaveTextAsync("2/2/2024, 10:30:00 AM");
```

## 一致的时间和定时器

有时你的定时器依赖于 `Date.now`，当 `Date.now` 值随时间不变时会感到困惑。在这种情况下，你可以安装时钟并在测试时快进到感兴趣的时间。

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

```csharp
// 在测试时间之前用某个时间初始化时钟，让页面自然加载。
// `Date.now` 将随着定时器触发而前进。
await Page.Clock.InstallAsync(new()
{
  TimeDate = new DateTime(2024, 2, 2, 8, 0, 0)
});
await Page.GotoAsync("http://localhost:3333");

// 假设用户合上笔记本电脑盖子，然后在上午 10 点重新打开。
// 到达该时间点后暂停时间。
await Page.Clock.PauseAtAsync(new DateTime(2024, 2, 2, 10, 0, 0));

// 断言页面状态。
await Expect(Page.GetByTestId("current-time")).ToHaveTextAsync("2/2/2024, 10:00:00 AM");

// 再次合上笔记本电脑盖子，在上午 10:30 打开。
await Page.Clock.FastForwardAsync("30:00");
await Expect(Page.GetByTestId("current-time")).ToHaveTextAsync("2/2/2024, 10:30:00 AM");
```

## 测试非活动监控

非活动监控是 Web 应用程序中的常见功能，在一段时间不活动后注销用户。测试此功能可能很棘手，因为你需要等待很长时间才能看到效果。借助时钟，你可以加速时间并快速测试此功能。

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

```csharp
// 初始时间对测试无关紧要，所以我们可以选择当前时间。
await Page.Clock.InstallAsync();
await page.GotoAsync("http://localhost:3333");

// 与页面交互
await page.GetByRole("button").ClickAsync();

// 快进 5 分钟，就好像用户什么都没做。
// 快进就像合上笔记本电脑盖子，5 分钟后打开。
// 所有到期的定时器将立即触发一次，就像在真实浏览器中一样。
await Page.Clock.FastForwardAsync("05:00");

// 检查用户是否被自动注销。
await Expect(Page.GetByText("You have been logged out due to inactivity.")).ToBeVisibleAsync();
```

## 手动推进时间，一致地触发所有定时器

在极少数情况下，你可能想要手动推进时间，在过程中触发所有定时器和动画帧，以实现对时间流逝的细粒度控制。

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

```csharp
// 用特定时间初始化时钟，让页面自然加载。
await Page.Clock.InstallAsync(new()
{
  TimeDate = new DateTime(2024, 2, 2, 8, 0, 0, DateTimeKind.Pst)
});
await page.GotoAsync("http://localhost:3333");
var locator = page.GetByTestId("current-time");

// 暂停时间流，停止定时器，现在你可以手动控制
// 页面时间。
await Page.Clock.PauseAtAsync(new DateTime(2024, 2, 2, 10, 0, 0));
await Expect(locator).ToHaveTextAsync("2/2/2024, 10:00:00 AM");

// 手动推进时间，在过程中触发所有定时器。
// 在这种情况下，屏幕上的时间将更新 2 次。
await Page.Clock.RunForAsync(2000);
await Expect(locator).ToHaveTextAsync("2/2/2024, 10:00:02 AM");
```

## 相关视频

<LiteYouTube
id="54_aC-rVKHg"
title="Playwright 1.45"
/>
