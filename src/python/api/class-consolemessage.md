---
title: ConsoleMessage
outline: 2
---

# ConsoleMessage

<Badge type="info" text="Added in: v1.8" />

[ConsoleMessage](/python/api/class-consolemessage) objects are dispatched by page via the [`page.on("console")`](/python/api/class-page#page-event-console) event.
For each console message logged in the page there will be corresponding event in the Playwright
context.

::: code-group

```python [Async]
# Listen for all console logs
page.on("console", lambda msg: print(msg.text))

# Listen for all console events and handle errors
page.on("console", lambda msg: print(f"error: {msg.text}") if msg.type == "error" else None)

# Get the next console log
async with page.expect_console_message() as msg_info:
    # Issue console.log inside the page
    await page.evaluate("console.log('hello', 42, { foo: 'bar' })")
msg = await msg_info.value

# Deconstruct print arguments
await msg.args[0].json_value() # hello
await msg.args[1].json_value() # 42
```

```python [Sync]
# Listen for all console logs
page.on("console", lambda msg: print(msg.text))

# Listen for all console events and handle errors
page.on("console", lambda msg: print(f"error: {msg.text}") if msg.type == "error" else None)

# Get the next console log
with page.expect_console_message() as msg_info:
    # Issue console.log inside the page
    page.evaluate("console.log('hello', 42, { foo: 'bar' })")
msg = msg_info.value

# Deconstruct print arguments
msg.args[0].json_value() # hello
msg.args[1].json_value() # 42
```

:::

## Methods

### console_message.args() {#console-message-args}

<Badge type="info" text="Added in: v1.8" />

List of arguments passed to a `console` function call. See also [`page.on("console")`](/python/api/class-page#page-event-console).

**Returns**

- `Array<JSHandle>`


### console_message.location() {#console-message-location}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `Object`


### console_message.page() {#console-message-page}

<Badge type="info" text="Added in: v1.34" />

The page that produced this console message, if any.

**Returns**

- `null | Page`


### console_message.text() {#console-message-text}

<Badge type="info" text="Added in: v1.8" />

The text of the console message.

**Returns**

- `string`


### console_message.timestamp() {#console-message-timestamp}

<Badge type="info" text="Added in: v1.59" />

The timestamp of the console message in milliseconds since the Unix epoch.

**Returns**

- `float`


### console_message.type() {#console-message-type}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `"log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "time" | "timeEnd"`


### console_message.worker() {#console-message-worker}

<Badge type="info" text="Added in: v1.57" />

The web worker or service worker that produced this console message, if any. Note that console messages from web workers also have non-null [`console_message.page()`](/python/api/class-consolemessage#console-message-page).

**Returns**

- `null | Worker`

