---
title: Clock
outline: 2
---

# Clock

<Badge type="info" text="新增于: v1.45" />

准确模拟时间相关行为对于验证应用程序的正确性至关重要。了解更多关于[时钟模拟](../clock.md)的信息。

请注意，时钟是为整个 [BrowserContext](/api/class-browsercontext) 安装的，因此所有页面和 iframe 中的时间都由同一个时钟控制。

## 方法

### clock.fastForward() {#clock-fast-forward}

<Badge type="info" text="新增于: v1.45" /> <Badge type="tip" text="async" />

通过跳跃方式快进时钟。最多只触发一次到期的定时器。这相当于用户合上笔记本电脑盖一段时间后再打开，在给定时间后。

**用法**

```js
await page.clock.fastForward(1000);
await page.clock.fastForward('30:00');
```

**参数**

- <a id="clock-fast-forward-option-ticks"></a>`ticks` `long | string`

  时间可以是要推进时钟的有限毫秒数，也可以是人类可读的字符串。有效的字符串格式为 "08" 表示八秒，"01:00" 表示一分钟，"02:34:10" 表示两小时三十四分十秒。


### clock.install() {#clock-install}

<Badge type="info" text="新增于: v1.45" /> <Badge type="tip" text="async" />

为以下时间相关函数安装伪实现：
* `Date`
* `Temporal.Now`
* `setTimeout`
* `clearTimeout`
* `setInterval`
* `clearInterval`
* `requestAnimationFrame`
* `cancelAnimationFrame`
* `requestIdleCallback`
* `cancelIdleCallback`
* `performance`

伪定时器用于在测试中手动控制时间流动。它们允许您推进时间、触发定时器并控制时间相关函数的行为。有关更多信息，请参阅 [`clock.runFor()`](/api/class-clock#clock-run-for) 和 [`clock.fastForward()`](/api/class-clock#clock-fast-forward)。

**参数**

- <a id="clock-install-option-options"></a>`options` `Object` *(可选)*

  - <a id="clock-install-option-time"></a>`time` `long | string | Date` *(可选)*

    初始化时间，默认为当前系统时间。


### clock.pauseAt() {#clock-pause-at}

<Badge type="info" text="新增于: v1.45" /> <Badge type="tip" text="async" />

通过跳跃方式快进时钟并暂停时间。一旦调用此方法，除非调用 [`clock.runFor()`](/api/class-clock#clock-run-for)、[`clock.fastForward()`](/api/class-clock#clock-fast-forward)、[`clock.pauseAt()`](/api/class-clock#clock-pause-at) 或 [`clock.resume()`](/api/class-clock#clock-resume)，否则不会触发任何定时器。

最多只触发一次到期的定时器。
这相当于用户合上笔记本电脑盖一段时间后在指定时间打开并暂停。

**用法**

```js
await page.clock.pauseAt(new Date('2020-02-02'));
await page.clock.pauseAt('2020-02-02');
```

为获得最佳效果，请在导航页面之前安装时钟，并将其设置为略早于预期测试时间的时间。这确保所有定时器在页面加载期间正常运行，防止页面卡住。一旦页面完全加载，您就可以安全地使用 [`clock.pauseAt()`](/api/class-clock#clock-pause-at) 来暂停时钟。

```js
// 使用测试时间之前的某个时间初始化时钟，让页面自然加载。
// `Date.now` 将随着定时器触发而推进。
await page.clock.install({ time: new Date('2024-12-10T08:00:00') });
await page.goto('http://localhost:3333');
await page.clock.pauseAt(new Date('2024-12-10T10:00:00'));
```

**参数**

- <a id="clock-pause-at-option-time"></a>`time` `long | string | Date`

  要暂停的时间。


### clock.resume() {#clock-resume}

<Badge type="info" text="新增于: v1.45" /> <Badge type="tip" text="async" />

恢复定时器。一旦调用此方法，时间恢复流动，定时器照常触发。


### clock.runFor() {#clock-run-for}

<Badge type="info" text="新增于: v1.45" /> <Badge type="tip" text="async" />

推进时钟，触发所有时间相关的回调。

**用法**

```js
await page.clock.runFor(1000);
await page.clock.runFor('30:00');
```

**参数**

- <a id="clock-run-for-option-ticks"></a>`ticks` `long | string`

  时间可以是要推进时钟的有限毫秒数，也可以是人类可读的字符串。有效的字符串格式为 "08" 表示八秒，"01:00" 表示一分钟，"02:34:10" 表示两小时三十四分十秒。


### clock.setFixedTime() {#clock-set-fixed-time}

<Badge type="info" text="新增于: v1.45" /> <Badge type="tip" text="async" />

使 `Date.now` 和 `new Date()` 始终返回固定的伪时间，同时保持所有定时器运行。

将此方法用于只需要使用预定义时间进行测试的简单场景。对于更高级的场景，请改用 [`clock.install()`](/api/class-clock#clock-install)。阅读[时钟模拟](../clock.md)文档以了解更多信息。

**用法**

```js
await page.clock.setFixedTime(Date.now());
await page.clock.setFixedTime(new Date('2020-02-02'));
await page.clock.setFixedTime('2020-02-02');
```

**参数**

- <a id="clock-set-fixed-time-option-time"></a>`time` `long | string | Date`

  要设置的时间（毫秒）。


### clock.setSystemTime() {#clock-set-system-time}

<Badge type="info" text="新增于: v1.45" /> <Badge type="tip" text="async" />

设置系统时间，但不触发任何定时器。使用此方法测试网页对时间偏移的反应，例如从夏令时切换到冬令时，或更改时区。

**用法**

```js
await page.clock.setSystemTime(Date.now());
await page.clock.setSystemTime(new Date('2020-02-02'));
await page.clock.setSystemTime('2020-02-02');
```

**参数**

- <a id="clock-set-system-time-option-time"></a>`time` `long | string | Date`

  要设置的时间（毫秒）。
