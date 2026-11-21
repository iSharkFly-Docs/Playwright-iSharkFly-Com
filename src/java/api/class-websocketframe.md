---
title: WebSocketFrame
outline: 2
---

# WebSocketFrame

<Badge type="info" text="Added in: v1.9" />

The [WebSocketFrame](/java/api/class-websocketframe) class represents frames sent over [WebSocket](/java/api/class-websocket) connections in the page. Frame payload is returned by either [`webSocketFrame.text()`](/java/api/class-websocketframe#web-socket-frame-text) or [`webSocketFrame.binary()`](/java/api/class-websocketframe#web-socket-frame-binary) method depending on the its type.

## Methods

### webSocketFrame.binary() {#web-socket-frame-binary}

<Badge type="info" text="Added in: v1.9" />

Returns binary payload.

**Returns**

- `null | Buffer`


### webSocketFrame.text() {#web-socket-frame-text}

<Badge type="info" text="Added in: v1.9" />

Returns text payload.

**Returns**

- `null | string`

