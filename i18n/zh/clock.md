---
title: "时钟"
---

# 时钟

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

准确模拟时间相关行为对于验证应用程序的正确性至关重要。利用 [Clock](/api/class-clock) 功能允许开发人员在测试中操纵和控制时间，从而能够精确验证诸如渲染时间、超时、计划任务等功能，而无需承受实时执行的延迟和变化性。

[Clock](/api/class-clock) API 提供以下方法来控制时间：
- `setFixedTime`：为 `Date.now()` 和 `new Date()` 设置固定时间。
- `install`：初始化时钟并允许你：
  - `pauseAt`：在特定时间暂停时间。
  - `fastForward`：快进时间。
  - `runFor`：运行指定持续时间的时间。
  - `resume`：恢复时间。
- `setSystemTime`：设置当前系统时间。

推荐的方法是使用 `setFixedTime` 将时间设置为特定值。如果这不适合你的用例，可以使用 `install`，它允许你稍后暂停时间、快进时间、推进时间等。`setSystemTime` 仅推荐用于高级用例。

::: info
[`page.clock`](/api/class-page#page-clock) 覆盖与时间相关的原生全局类和函数，允许手动控制它们：
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
如果你在测试的任何时候调用 `install`，该调用***必须***在任何其他与时钟相关的调用之前发生（请参阅上面的列表）。不按顺序调用这些方法将导致未定义的行为。例如，你不能先调用 `setInterval`，然后调用 `install`，再调用 `clearInterval`，因为 `install` 会覆盖时钟函数的原生定义。
:::

## 使用预定义时间测试

通常你只需要伪造 `Date.now`，同时保持计时器正常运行。这样时间自然流逝，但 `Date.now` 始终返回固定值。

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

```js
await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
await page.goto('http://localhost:3333');
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

await page.clock.setFixedTime(new Date('2024-02-02T10:30:00'));
// 我们知道页面有一个每秒更新时间的计时器。
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');
```

## 一致的时间和计时器

有时你的计时器依赖于 `Date.now`，当 `Date.now` 值随时间不变化时会产生混淆。在这种情况下，你可以安装时钟并在测试时快进到感兴趣的时间点。

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

```js
// 在测试时间之前用某个时间初始化时钟，让页面自然加载。
// `Date.now` 会随着计时器触发而推进。
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.goto('http://localhost:3333');

// 假设用户合上笔记本电脑盖子，然后在上午 10 点重新打开，
// 到达该时间点时暂停时间。
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));

// 断言页面状态。
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

// 再次合上笔记本电脑盖子，在上午 10:30 打开。
await page.clock.fastForward('30:00');
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');
```

## 测试不活动监控

不活动监控是 Web 应用程序中的常见功能，它会在用户一段时间不活动后将其注销。测试此功能可能很棘手，因为你需要等待很长时间才能看到效果。借助时钟，你可以加速时间并快速测试此功能。

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

```js
// 初始时间对测试不重要，所以我们可以选择当前时间。
await page.clock.install();
await page.goto('http://localhost:3333');
// 与页面交互
await page.getByRole('button').click();

// 快进 5 分钟，就好像用户什么都没做。
// 快进就像合上笔记本电脑盖子然后 5 分钟后打开。
// 所有到期的计时器会像在真实浏览器中一样立即触发一次。
await page.clock.fastForward('05:00');

// 检查用户是否被自动注销。
await expect(page.getByText('You have been logged out due to inactivity.')).toBeVisible();
```

## 手动推进时间，一致地触发所有计时器

在极少数情况下，你可能想要手动推进时间，在此过程中触发所有计时器和动画帧，以实现对时间流逝的精细控制。

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

```js
// 用特定时间初始化时钟，让页面自然加载。
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.goto('http://localhost:3333');

// 暂停时间流动，停止计时器，你现在可以手动控制
// 页面时间。
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

// 手动推进时间，在此过程中触发所有计时器。
// 在这种情况下，屏幕上的时间将更新 2 次。
await page.clock.runFor(2000);
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:02 AM');
```

## 相关视频

<LiteYouTube
id="54_aC-rVKHg"
title="Playwright 1.45"
/>
