---
title: Clock
outline: 2
---

# Clock

<Badge type="info" text="Added in: v1.45" />

Accurately simulating time-dependent behavior is essential for verifying the correctness of applications. Learn more about [clock emulation](../clock.md).

Note that clock is installed for the entire [BrowserContext](/java/api/class-browsercontext), so the time
in all the pages and iframes is controlled by the same clock.

## Methods

### clock.fastForward() {#clock-fast-forward}

<Badge type="info" text="Added in: v1.45" />

Advance the clock by jumping forward in time. Only fires due timers at most once. This is equivalent to user closing the laptop lid for a while and
reopening it later, after given time.

**Usage**

```java
page.clock().fastForward(1000);
page.clock().fastForward("30:00");
```

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

Fake timers are used to manually control the flow of time in tests. They allow you to advance time, fire timers, and control the behavior of time-dependent functions. See [`clock.runFor()`](/java/api/class-clock#clock-run-for) and [`clock.fastForward()`](/java/api/class-clock#clock-fast-forward) for more information.

**Arguments**

- <a id="clock-install-option-options"></a>`options` `Object` *(optional)*

  - <a id="clock-install-option-time"></a>`time` `long | string | Date` *(optional)*

    Time to initialize with, current system time by default.


### clock.pauseAt() {#clock-pause-at}

<Badge type="info" text="Added in: v1.45" />

Advance the clock by jumping forward in time and pause the time. Once this method is called, no timers
are fired unless [`clock.runFor()`](/java/api/class-clock#clock-run-for), [`clock.fastForward()`](/java/api/class-clock#clock-fast-forward), [`clock.pauseAt()`](/java/api/class-clock#clock-pause-at) or [`clock.resume()`](/java/api/class-clock#clock-resume) is called.

Only fires due timers at most once.
This is equivalent to user closing the laptop lid for a while and reopening it at the specified time and
pausing.

**Usage**

```java
SimpleDateFormat format = new SimpleDateFormat("yyy-MM-dd");
page.clock().pauseAt(format.parse("2020-02-02"));
page.clock().pauseAt("2020-02-02");
```

For best results, install the clock before navigating the page and set it to a time slightly before the intended test time. This ensures that all timers run normally during page loading, preventing the page from getting stuck. Once the page has fully loaded, you can safely use [`clock.pauseAt()`](/java/api/class-clock#clock-pause-at) to pause the clock.

```java
// Initialize clock with some time before the test time and let the page load
// naturally. `Date.now` will progress as the timers fire.
SimpleDateFormat format = new SimpleDateFormat("yyy-MM-dd'T'HH:mm:ss");
page.clock().install(new Clock.InstallOptions().setTime(format.parse("2024-12-10T08:00:00")));
page.navigate("http://localhost:3333");
page.clock().pauseAt(format.parse("2024-12-10T10:00:00"));
```

**Arguments**

- <a id="clock-pause-at-option-time"></a>`time` `long | string | Date`

  Time to pause at.


### clock.resume() {#clock-resume}

<Badge type="info" text="Added in: v1.45" />

Resumes timers. Once this method is called, time resumes flowing, timers are fired as usual.


### clock.runFor() {#clock-run-for}

<Badge type="info" text="Added in: v1.45" />

Advance the clock, firing all the time-related callbacks.

**Usage**

```java
page.clock().runFor(1000);
page.clock().runFor("30:00");
```

**Arguments**

- <a id="clock-run-for-option-ticks"></a>`ticks` `long | string`

  Time may be a finite number of milliseconds to advance the clock by or a human-readable string. Valid string formats are "08" for eight seconds, "01:00" for one minute and "02:34:10" for two hours, 34 minutes and ten seconds.


### clock.setFixedTime() {#clock-set-fixed-time}

<Badge type="info" text="Added in: v1.45" />

Makes `Date.now` and `new Date()` return fixed fake time at all times,
keeps all the timers running.

Use this method for simple scenarios where you only need to test with a predefined time. For more advanced scenarios, use [`clock.install()`](/java/api/class-clock#clock-install) instead. Read docs on [clock emulation](../clock.md) to learn more.

**Usage**

```java
page.clock().setFixedTime(new Date());
page.clock().setFixedTime(new SimpleDateFormat("yyy-MM-dd").parse("2020-02-02"));
page.clock().setFixedTime("2020-02-02");
```

**Arguments**

- <a id="clock-set-fixed-time-option-time"></a>`time` `long | string | Date`

  Time to be set in milliseconds.


### clock.setSystemTime() {#clock-set-system-time}

<Badge type="info" text="Added in: v1.45" />

Sets system time, but does not trigger any timers. Use this to test how the web page reacts to a time shift, for example switching from summer to winter time, or changing time zones.

**Usage**

```java
page.clock().setSystemTime(new Date());
page.clock().setSystemTime(new SimpleDateFormat("yyy-MM-dd").parse("2020-02-02"));
page.clock().setSystemTime("2020-02-02");
```

**Arguments**

- <a id="clock-set-system-time-option-time"></a>`time` `long | string | Date`

  Time to be set in milliseconds.

