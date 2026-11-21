---
title: WebSocketFrame
outline: 2
---

# WebSocketFrame

<Badge type="info" text="Added in: v1.9" />

The [WebSocketFrame](/dotnet/api/class-websocketframe) class represents frames sent over [WebSocket](/dotnet/api/class-websocket) connections in the page. Frame payload is returned by either [`WebSocketFrame.Text()`](/dotnet/api/class-websocketframe#web-socket-frame-text) or [`WebSocketFrame.Binary()`](/dotnet/api/class-websocketframe#web-socket-frame-binary) method depending on the its type.

## Methods

### WebSocketFrame.Binary() {#web-socket-frame-binary}

<Badge type="info" text="Added in: v1.9" />

Returns binary payload.

**Returns**

- `null | Buffer`


### WebSocketFrame.Text() {#web-socket-frame-text}

<Badge type="info" text="Added in: v1.9" />

Returns text payload.

**Returns**

- `null | string`

