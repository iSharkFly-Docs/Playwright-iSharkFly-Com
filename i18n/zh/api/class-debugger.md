---
title: Debugger
outline: 2
---

# Debugger

<Badge type="info" text="添加于: v1.59" />

用于控制 Playwright 调试器的 API。调试器允许暂停脚本执行并检查页面。通过 [`browserContext.debugger`](/api/class-browsercontext#browser-context-debugger) 获取调试器实例。

## 方法

### debugger.next() {#debugger-next}

<Badge type="info" text="添加于: v1.59" /> <Badge type="tip" text="异步" />

恢复脚本执行并在下一个操作之前再次暂停。如果调试器未暂停则抛出异常。


### debugger.pausedDetails() {#debugger-paused-details}

<Badge type="info" text="添加于: v1.59" />

返回当前暂停调用的详细信息。如果调试器未暂停则返回 `null`。

**返回值**

- `null | Object`


### debugger.requestPause() {#debugger-request-pause}

<Badge type="info" text="添加于: v1.59" /> <Badge type="tip" text="异步" />

配置调试器在执行下一个操作之前暂停。

如果调试器已经暂停则抛出异常。使用 [`debugger.next()`](/api/class-debugger#debugger-next) 或 [`debugger.runTo()`](/api/class-debugger#debugger-run-to) 在暂停时单步执行。

注意，[`page.pause()`](/api/class-page#page-pause) 等同于 "debugger" 语句 — 它在调用位置立即暂停执行。相反，[`debugger.requestPause()`](/api/class-debugger#debugger-request-pause) 等同于 "在下一语句处暂停" — 它配置调试器在执行下一个操作之前暂停。


### debugger.resume() {#debugger-resume}

<Badge type="info" text="添加于: v1.59" /> <Badge type="tip" text="异步" />

恢复脚本执行。如果调试器未暂停则抛出异常。


### debugger.runTo() {#debugger-run-to}

<Badge type="info" text="添加于: v1.59" /> <Badge type="tip" text="异步" />

恢复脚本执行，并在操作来自给定源位置时暂停。如果调试器未暂停则抛出异常。

**参数**

- <a id="debugger-run-to-option-location"></a>`location` `Object`

  要暂停的源位置。

  - `file` `string`
  - `line` `int` *(可选)*
  - `column` `int` *(可选)*


## 事件

### debugger.on('pausedStateChanged') {#debugger-event-paused-state-changed}

<Badge type="info" text="添加于: v1.59" />

当调试器暂停或恢复时触发。

**事件数据**

- `void`
