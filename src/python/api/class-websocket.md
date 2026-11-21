---
title: WebSocket
outline: 2
---

# WebSocket

<Badge type="info" text="Added in: v1.8" />

The [WebSocket](/python/api/class-websocket) class represents WebSocket connections within a page. It provides the ability to inspect and manipulate the data being transmitted and received.

If you want to intercept or modify WebSocket frames, consider using [WebSocketRoute](/python/api/class-websocketroute).

## Methods

### web_socket.expect_event() {#web-socket-wait-for-event}

<Badge type="info" text="Added in: v1.8" />

Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy
value. Will throw an error if the webSocket is closed before the event is fired. Returns the event data value.

**Arguments**

- <a id="web-socket-wait-for-event-option-event"></a>`event` `string`

  Event name, same one would pass into `webSocket.on(event)`.
- <a id="web-socket-wait-for-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-socket-wait-for-event-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="web-socket-wait-for-event-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `EventContextManager`


### web_socket.is_closed() {#web-socket-is-closed}

<Badge type="info" text="Added in: v1.8" />

Indicates that the web socket has been closed.

**Returns**

- `boolean`


### web_socket.url() {#web-socket-url}

<Badge type="info" text="Added in: v1.8" />

Contains the URL of the WebSocket.

**Returns**

- `string`


### web_socket.wait_for_event() {#web-socket-wait-for-event-2}

<Badge type="info" text="Added in: v1.8" />

::: info
In most cases, you should use [`web_socket.expect_event()`](/python/api/class-websocket#web-socket-wait-for-event).
:::

Waits for given `event` to fire. If predicate is provided, it passes
event's value into the `predicate` function and waits for `predicate(event)` to return a truthy value.
Will throw an error if the socket is closed before the `event` is fired.

**Arguments**

- <a id="web-socket-wait-for-event-2-option-event"></a>`event` `string`

  Event name, same one typically passed into `*.on(event)`.
- <a id="web-socket-wait-for-event-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-socket-wait-for-event-2-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="web-socket-wait-for-event-2-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `any`


## Events

### webSocket.on("close") {#web-socket-event-close}

<Badge type="info" text="Added in: v1.8" />

Fired when the websocket closes.

**Event data**

- `WebSocket`


### webSocket.on("frameReceived") {#web-socket-event-frame-received}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket receives a frame.

**Event data**

- `string | Buffer`


### webSocket.on("frameSent") {#web-socket-event-frame-sent}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket sends a frame.

**Event data**

- `string | Buffer`


### webSocket.on("socketError") {#web-socket-event-socket-error}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket has an error.

**Event data**

- `string`

