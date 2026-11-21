---
title: Debugger
outline: 2
---

# Debugger

<Badge type="info" text="Added in: v1.59" />

API for controlling the Playwright debugger. The debugger allows pausing script execution and inspecting the page.
Obtain the debugger instance via [`browserContext.debugger()`](/java/api/class-browsercontext#browser-context-debugger).

## Methods

### debugger.next() {#debugger-next}

<Badge type="info" text="Added in: v1.59" />

Resumes script execution and pauses again before the next action. Throws if the debugger is not paused.


### debugger.pausedDetails() {#debugger-paused-details}

<Badge type="info" text="Added in: v1.59" />

Returns details about the currently paused call. Returns `null` if the debugger is not paused.

**Returns**

- `null | Object`


### debugger.requestPause() {#debugger-request-pause}

<Badge type="info" text="Added in: v1.59" />

Configures the debugger to pause before the next action is executed.

Throws if the debugger is already paused. Use [`debugger.next()`](/java/api/class-debugger#debugger-next) or [`debugger.runTo()`](/java/api/class-debugger#debugger-run-to) to step while paused.

Note that [`page.pause()`](/java/api/class-page#page-pause) is equivalent to a "debugger" statement — it pauses execution at the call site immediately. On the contrary, [`debugger.requestPause()`](/java/api/class-debugger#debugger-request-pause) is equivalent to "pause on next statement" — it configures the debugger to pause before the next action is executed.


### debugger.resume() {#debugger-resume}

<Badge type="info" text="Added in: v1.59" />

Resumes script execution. Throws if the debugger is not paused.


### debugger.runTo() {#debugger-run-to}

<Badge type="info" text="Added in: v1.59" />

Resumes script execution and pauses when an action originates from the given source location. Throws if the debugger is not paused.

**Arguments**

- <a id="debugger-run-to-option-location"></a>`location` `Object`

  The source location to pause at.

  - `file` `string`
  - `line` `int` *(optional)*
  - `column` `int` *(optional)*


## Events

### debugger.onPausedStateChanged() {#debugger-event-paused-state-changed}

<Badge type="info" text="Added in: v1.59" />

Emitted when the debugger pauses or resumes.

**Event data**

- `void`

