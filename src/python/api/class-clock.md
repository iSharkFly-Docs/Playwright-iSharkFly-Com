---
title: Clock
outline: 2
---

# Clock

<Badge type="info" text="Added in: v1.45" />

Accurately simulating time-dependent behavior is essential for verifying the correctness of applications. Learn more about [clock emulation](../clock.md).

Note that clock is installed for the entire [BrowserContext](/python/api/class-browsercontext), so the time
in all the pages and iframes is controlled by the same clock.

## Methods

### clock.fast_forward() {#clock-fast-forward}

<Badge type="info" text="Added in: v1.45" />

Advance the clock by jumping forward in time. Only fires due timers at most once. This is equivalent to user closing the laptop lid for a while and
reopening it later, after given time.

**Usage**

::: code-group

```python [Async]
await page.clock.fast_forward(1000)
await page.clock.fast_forward("30:00")
```

```python [Sync]
page.clock.fast_forward(1000)
page.clock.fast_forward("30:00")
```

:::

**Arguments**

- <a id="clock-fast-forward-option-ticks"></a>`ticks` `long | string`

  Time may be a finite number of milliseconds to advance the clock by or a human-readable string. Valid string formats are "08" for eight seconds, "01:00" for one minute and "02:34:10" for two hours, 34 minutes and ten seconds.


### clock.install() {#clock-install}

<Badge type="info" text="Added in: v1.45" />

Install fake implementations for the following time-related functions:
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

Fake timers are used to manually control the flow of time in tests. They allow you to advance time, fire timers, and control the behavior of time-dependent functions. See [`clock.run_for()`](/python/api/class-clock#clock-run-for) and [`clock.fast_forward()`](/python/api/class-clock#clock-fast-forward) for more information.

**Arguments**

- <a id="clock-install-option-options"></a>`options` `Object` *(optional)*

  - <a id="clock-install-option-time"></a>`time` `float | string | Date` *(optional)*

    Time to initialize with, current system time by default. Numeric values are Unix time in seconds.


### clock.pause_at() {#clock-pause-at}

<Badge type="info" text="Added in: v1.45" />

Advance the clock by jumping forward in time and pause the time. Once this method is called, no timers
are fired unless [`clock.run_for()`](/python/api/class-clock#clock-run-for), [`clock.fast_forward()`](/python/api/class-clock#clock-fast-forward), [`clock.pause_at()`](/python/api/class-clock#clock-pause-at) or [`clock.resume()`](/python/api/class-clock#clock-resume) is called.

Only fires due timers at most once.
This is equivalent to user closing the laptop lid for a while and reopening it at the specified time and
pausing.

**Usage**

::: code-group

```python [Async]
await page.clock.pause_at(datetime.datetime(2020, 2, 2))
await page.clock.pause_at("2020-02-02")
```

```python [Sync]
page.clock.pause_at(datetime.datetime(2020, 2, 2))
page.clock.pause_at("2020-02-02")
```

:::

For best results, install the clock before navigating the page and set it to a time slightly before the intended test time. This ensures that all timers run normally during page loading, preventing the page from getting stuck. Once the page has fully loaded, you can safely use [`clock.pause_at()`](/python/api/class-clock#clock-pause-at) to pause the clock.

::: code-group

```python [Async]
# Initialize clock with some time before the test time and let the page load
# naturally. `Date.now` will progress as the timers fire.
await page.clock.install(time=datetime.datetime(2024, 12, 10, 8, 0, 0))
await page.goto("http://localhost:3333")
await page.clock.pause_at(datetime.datetime(2024, 12, 10, 10, 0, 0))
```

```python [Sync]
# Initialize clock with some time before the test time and let the page load
# naturally. `Date.now` will progress as the timers fire.
page.clock.install(time=datetime.datetime(2024, 12, 10, 8, 0, 0))
page.goto("http://localhost:3333")
page.clock.pause_at(datetime.datetime(2024, 12, 10, 10, 0, 0))
```

:::

**Arguments**

- <a id="clock-pause-at-option-time"></a>`time` `float | string | Date`

  Time to pause at. Numeric values are Unix time in seconds.


### clock.resume() {#clock-resume}

<Badge type="info" text="Added in: v1.45" />

Resumes timers. Once this method is called, time resumes flowing, timers are fired as usual.


### clock.run_for() {#clock-run-for}

<Badge type="info" text="Added in: v1.45" />

Advance the clock, firing all the time-related callbacks.

**Usage**

::: code-group

```python [Async]
await page.clock.run_for(1000);
await page.clock.run_for("30:00")
```

```python [Sync]
page.clock.run_for(1000);
page.clock.run_for("30:00")
```

:::

**Arguments**

- <a id="clock-run-for-option-ticks"></a>`ticks` `long | string`

  Time may be a finite number of milliseconds to advance the clock by or a human-readable string. Valid string formats are "08" for eight seconds, "01:00" for one minute and "02:34:10" for two hours, 34 minutes and ten seconds.


### clock.set_fixed_time() {#clock-set-fixed-time}

<Badge type="info" text="Added in: v1.45" />

Makes `Date.now` and `new Date()` return fixed fake time at all times,
keeps all the timers running.

Use this method for simple scenarios where you only need to test with a predefined time. For more advanced scenarios, use [`clock.install()`](/python/api/class-clock#clock-install) instead. Read docs on [clock emulation](../clock.md) to learn more.

**Usage**

::: code-group

```python [Async]
await page.clock.set_fixed_time(datetime.datetime.now())
await page.clock.set_fixed_time(datetime.datetime(2020, 2, 2))
await page.clock.set_fixed_time("2020-02-02")
```

```python [Sync]
page.clock.set_fixed_time(datetime.datetime.now())
page.clock.set_fixed_time(datetime.datetime(2020, 2, 2))
page.clock.set_fixed_time("2020-02-02")
```

:::

**Arguments**

- <a id="clock-set-fixed-time-option-time"></a>`time` `float | string | Date`

  Time to be set. Numeric values are Unix time in seconds.


### clock.set_system_time() {#clock-set-system-time}

<Badge type="info" text="Added in: v1.45" />

Sets system time, but does not trigger any timers. Use this to test how the web page reacts to a time shift, for example switching from summer to winter time, or changing time zones.

**Usage**

::: code-group

```python [Async]
await page.clock.set_system_time(datetime.datetime.now())
await page.clock.set_system_time(datetime.datetime(2020, 2, 2))
await page.clock.set_system_time("2020-02-02")
```

```python [Sync]
page.clock.set_system_time(datetime.datetime.now())
page.clock.set_system_time(datetime.datetime(2020, 2, 2))
page.clock.set_system_time("2020-02-02")
```

:::

**Arguments**

- <a id="clock-set-system-time-option-time"></a>`time` `float | string | Date`

  Time to be set. Numeric values are Unix time in seconds.

