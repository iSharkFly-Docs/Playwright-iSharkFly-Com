---
title: WebSocket
outline: 2
---

# WebSocket

<Badge type="info" text="Added in: v1.8" />

The [WebSocket](/api/class-websocket) class represents WebSocket connections within a page. It provides the ability to inspect and manipulate the data being transmitted and received.

If you want to intercept or modify WebSocket frames, consider using [WebSocketRoute](/api/class-websocketroute).

## Methods

### webSocket.isClosed() {#web-socket-is-closed}

<Badge type="info" text="Added in: v1.8" />

Indicates that the web socket has been closed.

**Returns**

- `boolean`


### webSocket.url() {#web-socket-url}

<Badge type="info" text="Added in: v1.8" />

Contains the URL of the WebSocket.

**Returns**

- `string`


### webSocket.waitForEvent() {#web-socket-wait-for-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy
value. Will throw an error if the webSocket is closed before the event is fired. Returns the event data value.

**Arguments**

- <a id="web-socket-wait-for-event-option-event"></a>`event` `string`

  Event name, same one would pass into `webSocket.on(event)`.
- <a id="web-socket-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(optional)*

  Either a predicate that receives an event or an options object. Optional.

  - `predicate` `function()`

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - `timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
- <a id="web-socket-wait-for-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-socket-wait-for-event-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="web-socket-wait-for-event-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.

**Returns**

- `Promise<any>`


## Events

### webSocket.on('close') {#web-socket-event-close}

<Badge type="info" text="Added in: v1.8" />

Fired when the websocket closes.

**Event data**

- `WebSocket`


### webSocket.on('frameReceived') {#web-socket-event-frame-received}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket receives a frame.

**Event data**

- `Object`


### webSocket.on('frameSent') {#web-socket-event-frame-sent}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket sends a frame.

**Event data**

- `Object`


### webSocket.on('socketError') {#web-socket-event-socket-error}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket has an error.

**Event data**

- `string`

