---
title: WebSocketRoute
outline: 2
---

# WebSocketRoute

<Badge type="info" text="Added in: v1.48" />

Whenever a [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) route is set up with [`page.routeWebSocket()`](/java/api/class-page#page-route-web-socket) or [`browserContext.routeWebSocket()`](/java/api/class-browsercontext#browser-context-route-web-socket), the `WebSocketRoute` object allows to handle the WebSocket, like an actual server would do.

**Mocking**

By default, the routed WebSocket will not connect to the server. This way, you can mock entire communication over the WebSocket. Here is an example that responds to a `"request"` with a `"response"`.

```java
page.routeWebSocket("wss://example.com/ws", ws -> {
  ws.onMessage(frame -> {
    if ("request".equals(frame.text()))
      ws.send("response");
  });
});
```

Since we do not call [`webSocketRoute.connectToServer()`](/java/api/class-websocketroute#web-socket-route-connect-to-server) inside the WebSocket route handler, Playwright assumes that WebSocket will be mocked, and opens the WebSocket inside the page automatically.

Here is another example that handles JSON messages:

```java
page.routeWebSocket("wss://example.com/ws", ws -> {
  ws.onMessage(frame -> {
    JsonObject json = new JsonParser().parse(frame.text()).getAsJsonObject();
    if ("question".equals(json.get("request").getAsString())) {
      Map<String, String> result = new HashMap();
      result.put("response", "answer");
      ws.send(gson.toJson(result));
    }
  });
});
```

**Intercepting**

Alternatively, you may want to connect to the actual server, but intercept messages in-between and modify or block them. Calling [`webSocketRoute.connectToServer()`](/java/api/class-websocketroute#web-socket-route-connect-to-server) returns a server-side `WebSocketRoute` instance that you can send messages to, or handle incoming messages.

Below is an example that modifies some messages sent by the page to the server. Messages sent from the server to the page are left intact, relying on the default forwarding.

```java
page.routeWebSocket("/ws", ws -> {
  WebSocketRoute server = ws.connectToServer();
  ws.onMessage(frame -> {
    if ("request".equals(frame.text()))
      server.send("request2");
    else
      server.send(frame.text());
  });
});
```

After connecting to the server, all **messages are forwarded** between the page and the server by default.

However, if you call [`webSocketRoute.onMessage()`](/java/api/class-websocketroute#web-socket-route-on-message) on the original route, messages from the page to the server **will not be forwarded** anymore, but should instead be handled by the [`handler`](/java/api/class-websocketroute#web-socket-route-on-message-option-handler).

Similarly, calling [`webSocketRoute.onMessage()`](/java/api/class-websocketroute#web-socket-route-on-message) on the server-side WebSocket will **stop forwarding messages** from the server to the page, and [`handler`](/java/api/class-websocketroute#web-socket-route-on-message-option-handler) should take care of them.

The following example blocks some messages in both directions. Since it calls [`webSocketRoute.onMessage()`](/java/api/class-websocketroute#web-socket-route-on-message) in both directions, there is no automatic forwarding at all.

```java
page.routeWebSocket("/ws", ws -> {
  WebSocketRoute server = ws.connectToServer();
  ws.onMessage(frame -> {
    if (!"blocked-from-the-page".equals(frame.text()))
      server.send(frame.text());
  });
  server.onMessage(frame -> {
    if (!"blocked-from-the-server".equals(frame.text()))
      ws.send(frame.text());
  });
});
```

## Methods

### webSocketRoute.close() {#web-socket-route-close}

<Badge type="info" text="Added in: v1.48" />

Closes one side of the WebSocket connection.

**Arguments**

- <a id="web-socket-route-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-socket-route-close-option-code"></a>`code` `int` *(optional)*

    Optional [close code](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#code).
  - <a id="web-socket-route-close-option-reason"></a>`reason` `string` *(optional)*

    Optional [close reason](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#reason).


### webSocketRoute.connectToServer() {#web-socket-route-connect-to-server}

<Badge type="info" text="Added in: v1.48" />

By default, routed WebSocket does not connect to the server, so you can mock entire WebSocket communication. This method connects to the actual WebSocket server, and returns the server-side [WebSocketRoute](/java/api/class-websocketroute) instance, giving the ability to send and receive messages from the server.

Once connected to the server:
* Messages received from the server will be **automatically forwarded** to the WebSocket in the page, unless [`webSocketRoute.onMessage()`](/java/api/class-websocketroute#web-socket-route-on-message) is called on the server-side `WebSocketRoute`.
* Messages sent by the [`WebSocket.send()`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send) call in the page will be **automatically forwarded** to the server, unless [`webSocketRoute.onMessage()`](/java/api/class-websocketroute#web-socket-route-on-message) is called on the original `WebSocketRoute`.

See examples at the top for more details.

**Returns**

- `WebSocketRoute`


### webSocketRoute.onClose() {#web-socket-route-on-close}

<Badge type="info" text="Added in: v1.48" />

Allows to handle [`WebSocket.close`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close).

By default, closing one side of the connection, either in the page or on the server, will close the other side. However, when [`webSocketRoute.onClose()`](/java/api/class-websocketroute#web-socket-route-on-close) handler is set up, the default forwarding of closure is disabled, and handler should take care of it.

**Arguments**

- <a id="web-socket-route-on-close-option-handler"></a>`handler` `function(null | int, null | string)`

  Function that will handle WebSocket closure. Received an optional [close code](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#code) and an optional [close reason](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#reason).


### webSocketRoute.onMessage() {#web-socket-route-on-message}

<Badge type="info" text="Added in: v1.48" />

This method allows to handle messages that are sent by the WebSocket, either from the page or from the server.

When called on the original WebSocket route, this method handles messages sent from the page. You can handle this messages by responding to them with [`webSocketRoute.send()`](/java/api/class-websocketroute#web-socket-route-send), forwarding them to the server-side connection returned by [`webSocketRoute.connectToServer()`](/java/api/class-websocketroute#web-socket-route-connect-to-server) or do something else.

Once this method is called, messages are not automatically forwarded to the server or to the page - you should do that manually by calling [`webSocketRoute.send()`](/java/api/class-websocketroute#web-socket-route-send). See examples at the top for more details.

Calling this method again will override the handler with a new one.

**Arguments**

- <a id="web-socket-route-on-message-option-handler"></a>`handler` `function(WebSocketFrame)`

  Function that will handle messages.


### webSocketRoute.protocols() {#web-socket-route-protocols}

<Badge type="info" text="Added in: v1.60" />

The list of WebSocket subprotocols requested by the page, as passed via the second argument to the [`WebSocket` constructor](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket). Corresponds to the `Sec-WebSocket-Protocol` request header.

Returns an empty array if no protocols were specified.

**Usage**

```java
page.routeWebSocket("wss://example.com/ws", ws -> {
  if (ws.protocols().contains("chat.v2")) {
    ws.onMessage(frame -> ws.send("v2:" + frame.text()));
  } else {
    ws.close(1002, "Unsupported protocol");
  }
});
```

**Returns**

- `Array<string>`


### webSocketRoute.send() {#web-socket-route-send}

<Badge type="info" text="Added in: v1.48" />

Sends a message to the WebSocket. When called on the original WebSocket, sends the message to the page. When called on the result of [`webSocketRoute.connectToServer()`](/java/api/class-websocketroute#web-socket-route-connect-to-server), sends the message to the server. See examples at the top for more details.

**Arguments**

- <a id="web-socket-route-send-option-message"></a>`message` `string | Buffer`

  Message to send.


### webSocketRoute.url() {#web-socket-route-url}

<Badge type="info" text="Added in: v1.48" />

URL of the WebSocket created in the page.

**Returns**

- `string`

