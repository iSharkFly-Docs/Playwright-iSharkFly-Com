---
title: WebSocket
outline: 2
---

# WebSocket

<Badge type="info" text="Added in: v1.8" />

The [WebSocket](/dotnet/api/class-websocket) class represents WebSocket connections within a page. It provides the ability to inspect and manipulate the data being transmitted and received.

If you want to intercept or modify WebSocket frames, consider using [WebSocketRoute](/dotnet/api/class-websocketroute).

## Methods

### WebSocket.IsClosed() {#web-socket-is-closed}

<Badge type="info" text="Added in: v1.8" />

Indicates that the web socket has been closed.

**Returns**

- `boolean`


### WebSocket.Url() {#web-socket-url}

<Badge type="info" text="Added in: v1.8" />

Contains the URL of the WebSocket.

**Returns**

- `string`


## Events

### WebSocket.Close {#web-socket-event-close}

<Badge type="info" text="Added in: v1.8" />

Fired when the websocket closes.

**Event data**

- `WebSocket`


### WebSocket.FrameReceived {#web-socket-event-frame-received}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket receives a frame.

**Event data**

- `WebSocketFrame`


### WebSocket.FrameSent {#web-socket-event-frame-sent}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket sends a frame.

**Event data**

- `WebSocketFrame`


### WebSocket.SocketError {#web-socket-event-socket-error}

<Badge type="info" text="Added in: v1.9" />

Fired when the websocket has an error.

**Event data**

- `string`

