---
title: WebSocket
outline: 2
---

# WebSocket

<Badge type="info" text="Added in: v1.8" />

The [WebSocket](/java/api/class-websocket) class represents WebSocket connections within a page. It provides the ability to inspect and manipulate the data being transmitted and received.

If you want to intercept or modify WebSocket frames, consider using [WebSocketRoute](/java/api/class-websocketroute).

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


### webSocket.waitForFrameReceived() {#web-socket-wait-for-frame-received}

<Badge type="info" text="Added in: v1.10" />

Performs action and waits for a frame to be sent. If predicate is provided, it passes
[WebSocketFrame](/java/api/class-websocketframe) value into the `predicate` function and waits for `predicate(webSocketFrame)` to return a truthy value.
Will throw an error if the WebSocket or Page is closed before the frame is received.

**Arguments**

- <a id="web-socket-wait-for-frame-received-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-socket-wait-for-frame-received-option-predicate"></a>`predicate` `function(WebSocketFrame): boolean` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Receives the [WebSocketFrame](/java/api/class-websocketframe) object and resolves to truthy value when the waiting should resolve.
  - <a id="web-socket-wait-for-frame-received-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout).
- <a id="web-socket-wait-for-frame-received-option-callback"></a>`callback` `Runnable` <Badge type="info" text="Added in: v1.9" />

  Callback that performs the action triggering the event.

**Returns**

- `WebSocketFrame`


### webSocket.waitForFrameSent() {#web-socket-wait-for-frame-sent}

<Badge type="info" text="Added in: v1.10" />

Performs action and waits for a frame to be sent. If predicate is provided, it passes
[WebSocketFrame](/java/api/class-websocketframe) value into the `predicate` function and waits for `predicate(webSocketFrame)` to return a truthy value.
Will throw an error if the WebSocket or Page is closed before the frame is sent.

**Arguments**

- <a id="web-socket-wait-for-frame-sent-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-socket-wait-for-frame-sent-option-predicate"></a>`predicate` `function(WebSocketFrame): boolean` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Receives the [WebSocketFrame](/java/api/class-websocketframe) object and resolves to truthy value when the waiting should resolve.
  - <a id="web-socket-wait-for-frame-sent-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout).
- <a id="web-socket-wait-for-frame-sent-option-callback"></a>`callback` `Runnable` <Badge type="info" text="Added in: v1.9" />

  Callback that performs the action triggering the event.

**Returns**

- `WebSocketFrame`


## Events

### webSocket.onClose() {#web-socket-event-close}

<Badge type="info" text="Added in: v1.8" />

Fired when the websocket closes.

**Event data**

- `WebSocket`


### webSocket.onFrameReceived() {#web-socket-event-frame-received}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket receives a frame.

**Event data**

- `WebSocketFrame`


### webSocket.onFrameSent() {#web-socket-event-frame-sent}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket sends a frame.

**Event data**

- `WebSocketFrame`


### webSocket.onSocketError() {#web-socket-event-socket-error}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket has an error.

**Event data**

- `string`

