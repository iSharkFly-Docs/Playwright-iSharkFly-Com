---
title: WebSocket
outline: 2
---

# WebSocket

<Badge type="info" text="Added in: v1.8" />

[WebSocket](/api/class-websocket) 类表示页面内的 WebSocket 连接。它提供了检查和操作正在传输和接收的数据的能力。

如果你想要拦截或修改 WebSocket 帧，请考虑使用 [WebSocketRoute](/api/class-websocketroute)。

## 方法

### webSocket.isClosed() {#web-socket-is-closed}

<Badge type="info" text="Added in: v1.8" />

指示 web socket 是否已关闭。

**返回值**

- `boolean`


### webSocket.url() {#web-socket-url}

<Badge type="info" text="Added in: v1.8" />

包含 WebSocket 的 URL。

**返回值**

- `string`


### webSocket.waitForEvent() {#web-socket-wait-for-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

等待事件触发并将其值传递给谓词函数。当谓词返回真值时返回。如果在事件触发之前 webSocket 关闭，将抛出错误。返回事件数据值。

**参数**

- <a id="web-socket-wait-for-event-option-event"></a>`event` `string`

  事件名称，与传递给 `webSocket.on(event)` 的相同。
- <a id="web-socket-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(可选)*

  接收事件的谓词或选项对象。可选。

  - `predicate` `function()`

    接收事件数据，当等待应该解析时返回真值。
  - `timeout` `float` *(可选)*

    最大等待时间，以毫秒为单位。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项更改默认值，或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法。
- <a id="web-socket-wait-for-event-option-options"></a>`options` `Object` *(可选)*

  - <a id="web-socket-wait-for-event-option-predicate"></a>`predicate` `function()` *(可选)*

    接收事件数据，当等待应该解析时返回真值。
  - <a id="web-socket-wait-for-event-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消等待。如果信号被中止，等待将被中止，操作将抛出错误。
    注意提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 更改；传递 `timeout: 0` 可以完全禁用超时。

**返回值**

- `Promise<any>`


## 事件

### webSocket.on('close') {#web-socket-event-close}

<Badge type="info" text="Added in: v1.8" />

当 websocket 关闭时触发。

**事件数据**

- `WebSocket`


### webSocket.on('frameReceived') {#web-socket-event-frame-received}

<Badge type="info" text="Added in: v1.9" />

当 websocket 接收到一个帧时触发。

**事件数据**

- `Object`


### webSocket.on('frameSent') {#web-socket-event-frame-sent}

<Badge type="info" text="Added in: v1.9" />

当 websocket 发送一个帧时触发。

**事件数据**

- `Object`


### webSocket.on('socketError') {#web-socket-event-socket-error}

<Badge type="info" text="Added in: v1.9" />

当 websocket 发生错误时触发。

**事件数据**

- `string`
