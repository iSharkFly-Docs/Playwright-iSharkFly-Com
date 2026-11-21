---
title: "时钟"
---

# 时钟

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

准确模拟时间相关行为对于验证应用程序的正确性至关重要。利用 [Clock](/java/api/class-clock) 功能允许开发人员在测试中操作和控制时间，从而能够精确验证诸如渲染时间、超时、计划任务等功能，而无需实时执行的延迟和不确定性。

[Clock](/java/api/class-clock) API 提供以下方法来控制时间：
- `setFixedTime`：为 `Date.now()` 和 `new Date()` 设置固定时间。
- `install`：初始化时钟并允许你：
  - `pauseAt`：在特定时间暂停时间。
  - `fastForward`：快进时间。
  - `runFor`：运行特定持续时间的时间。
  - `resume`：恢复时间。
- `setSystemTime`：设置当前系统时间。

推荐的方法是使用 `setFixedTime` 将时间设置为特定值。如果这不适用于你的用例，你可以使用 `install`，它允许你稍后暂停时间、快进、推进等。`setSystemTime` 仅推荐用于高级用例。

::: info
[`page.clock()`](/java/api/class-page#page-clock) 覆盖与时间相关的原生全局类和函数，允许手动控制它们：
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
如果你在测试中的任何时候调用 `install`，该调用 _必须_ 在任何其他时钟相关调用之前发生（有关列表，请参见上面的注释）。以错误的顺序调用这些方法将导致未定义的行为。例如，你不能先调用 `setInterval`，然后调用 `install`，再调用 `clearInterval`，因为 `install` 会覆盖时钟函数的原生定义。
:::

## 使用预定义时间测试

通常你只需要伪造 `Date.now` 同时保持计时器运行。这样时间自然流逝，但 `Date.now` 始终返回固定值。

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

```java
SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
page.clock().setFixedTime(format.parse("2024-02-02T10:00:00"));
page.navigate("http://localhost:3333");
Locator locator = page.getByTestId("current-time");
assertThat(locator).hasText("2/2/2024, 10:00:00 AM");
page.clock().setFixedTime(format.parse("2024-02-02T10:30:00"));
// 我们知道页面有一个每秒更新时间的计时器。
assertThat(locator).hasText("2/2/2024, 10:30:00 AM");
```

## 一致的时间和计时器

有时你的计时器依赖于 `Date.now`，当 `Date.now` 值随时间不变时会感到困惑。在这种情况下，你可以安装时钟并在测试时快进到感兴趣的时间。

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

```java
// 在测试时间之前用某个时间初始化时钟，让页面自然加载。
// `Date.now` 将随着计时器触发而推进。
SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
page.clock().install(new Clock.InstallOptions().setTime(format.parse("2024-02-02T08:00:00")));
page.navigate("http://localhost:3333");
Locator locator = page.getByTestId("current-time");

// 假装用户合上了笔记本电脑盖子，然后在上午 10 点重新打开。
// 到达那个时间点后暂停时间。
page.clock().pauseAt(format.parse("2024-02-02T10:00:00"));

// 断言页面状态。
assertThat(locator).hasText("2/2/2024, 10:00:00 AM");

// 再次合上笔记本电脑盖子，在上午 10:30 打开。
page.clock().fastForward("30:00");
assertThat(locator).hasText("2/2/2024, 10:30:00 AM");
```

## 测试非活动监控

非活动监控是 Web 应用程序中的常见功能，在一段时间不活动后会将用户登出。测试此功能可能很棘手，因为你需要等待很长时间才能看到效果。借助时钟，你可以加速时间并快速测试此功能。

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

```java
// 初始时间对测试无关紧要，所以我们可以选择当前时间。
page.clock().install();
page.navigate("http://localhost:3333");
Locator locator = page.getByRole("button");

// 与页面交互
locator.click();

// 快进 5 分钟，就好像用户什么都没做。
// 快进就像合上笔记本电脑盖子然后 5 分钟后打开一样。
// 所有到期的计时器将立即触发一次，就像在真正的浏览器中一样。
page.clock().fastForward("05:00");

// 检查用户是否被自动登出。
assertThat(page.getByText("You have been logged out due to inactivity.")).isVisible();
```

## 手动推进时间，一致地触发所有计时器

在极少数情况下，你可能想要手动推进时间，在此过程中触发所有计时器和动画帧，以实现对时间流逝的细粒度控制。

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

```java
SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
// 用特定时间初始化时钟，让页面自然加载。
page.clock().install(new Clock.InstallOptions()
    .setTime(format.parse("2024-02-02T08:00:00")));
page.navigate("http://localhost:3333");
Locator locator = page.getByTestId("current-time");

// 暂停时间流，停止计时器，你现在可以手动控制页面时间。
page.clock().pauseAt(format.parse("2024-02-02T10:00:00"));
assertThat(locator).hasText("2/2/2024, 10:00:00 AM");

// 手动推进时间，在此过程中触发所有计时器。
// 在这种情况下，时间将在屏幕上更新 2 次。
page.clock().runFor(2000);
assertThat(locator).hasText("2/2/2024, 10:00:02 AM");
```

## 相关视频

<LiteYouTube
id="54_aC-rVKHg"
title="Playwright 1.45"
/>
