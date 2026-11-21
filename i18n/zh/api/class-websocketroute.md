---
title: WebSocketRoute
outline: 2
---

# WebSocketRoute

<Badge type="info" text="新增于: v1.48" />

当通过 [`page.routeWebSocket()`](/api/class-page#page-route-web-socket) 或 [`browserContext.routeWebSocket()`](/api/class-browsercontext#browser-context-route-web-socket) 设置 [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 路由时，`WebSocketRoute` 对象允许像真实服务器一样处理 WebSocket。

**模拟**

默认情况下，被路由的 WebSocket 不会连接到服务器。这样，您可以模拟整个 WebSocket 通信。以下是一个用 `"response"` 响应 `"request"` 的示例。

```js
await page.routeWebSocket('wss://example.com/ws', ws => {
  ws.onMessage(message => {
    if (message === 'request')
      ws.send('response');
  });
});
```

由于我们没有在 WebSocket 路由处理程序中调用 [`webSocketRoute.connectToServer()`](/api/class-websocketroute#web-socket-route-connect-to-server)，Playwright 假定 WebSocket 将被模拟，并自动在页面内打开 WebSocket。

以下是另一个处理 JSON 消息的示例：

```js
await page.routeWebSocket('wss://example.com/ws', ws => {
  ws.onMessage(message => {
    const json = JSON.parse(message);
    if (json.request === 'question')
      ws.send(JSON.stringify({ response: 'answer' }));
  });
});
```

**拦截**

或者，您可能希望连接到实际服务器，但在中间拦截消息并修改或阻止它们。调用 [`webSocketRoute.connectToServer()`](/api/class-websocketroute#web-socket-route-connect-to-server) 会返回一个服务器端的 `WebSocketRoute` 实例，您可以向其发送消息或处理传入的消息。

下面是一个修改页面发送到服务器的某些消息的示例。从服务器发送到页面的消息保持不变，依赖于默认转发。

```js
await page.routeWebSocket('/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message === 'request')
      server.send('request2');
    else
      server.send(message);
  });
});
```

连接到服务器后，所有**消息默认会在页面和服务器之间转发**。

但是，如果您在原始路由上调用 [`webSocketRoute.onMessage()`](/api/class-websocketroute#web-socket-route-on-message)，从页面到服务器的消息**将不再自动转发**，而应由 [`handler`](/api/class-websocketroute#web-socket-route-on-message-option-handler) 处理。

同样，在服务器端 WebSocket 上调用 [`webSocketRoute.onMessage()`](/api/class-websocketroute#web-socket-route-on-message) 将**停止从服务器到页面的消息转发**，[`handler`](/api/class-websocketroute#web-socket-route-on-message-option-handler) 应负责处理它们。

以下示例在两个方向上阻止某些消息。由于它在两个方向上都调用了 [`webSocketRoute.onMessage()`](/api/class-websocketroute#web-socket-route-on-message)，因此完全没有自动转发。

```js
await page.routeWebSocket('/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message !== 'blocked-from-the-page')
      server.send(message);
  });
  server.onMessage(message => {
    if (message !== 'blocked-from-the-server')
      ws.send(message);
  });
});
```

## 方法

### webSocketRoute.close() {#web-socket-route-close}

<Badge type="info" text="新增于: v1.48" /> <Badge type="tip" text="async" />

关闭 WebSocket 连接的一侧。

**参数**

- <a id="web-socket-route-close-option-options"></a>`options` `Object` *(可选)*

  - <a id="web-socket-route-close-option-code"></a>`code` `int` *(可选)*

    可选的[关闭代码](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#code)。
  - <a id="web-socket-route-close-option-reason"></a>`reason` `string` *(可选)*

    可选的[关闭原因](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#reason)。


### webSocketRoute.connectToServer() {#web-socket-route-connect-to-server}

<Badge type="info" text="新增于: v1.48" />

默认情况下，被路由的 WebSocket 不会连接到服务器，因此您可以模拟整个 WebSocket 通信。此方法连接到实际的 WebSocket 服务器，并返回服务器端的 [WebSocketRoute](/api/class-websocketroute) 实例，使您能够向服务器发送和接收消息。

连接到服务器后：
* 从服务器接收的消息将**自动转发**到页面中的 WebSocket，除非在服务器端 `WebSocketRoute` 上调用了 [`webSocketRoute.onMessage()`](/api/class-websocketroute#web-socket-route-on-message)。
* 页面中通过 [`WebSocket.send()`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send) 调用发送的消息将**自动转发**到服务器，除非在原始 `WebSocketRoute` 上调用了 [`webSocketRoute.onMessage()`](/api/class-websocketroute#web-socket-route-on-message)。

更多详细信息请参阅顶部的示例。

**返回值**

- `WebSocketRoute`


### webSocketRoute.onClose() {#web-socket-route-on-close}

<Badge type="info" text="新增于: v1.48" />

允许处理 [`WebSocket.close`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close)。

默认情况下，关闭连接的一侧（无论是在页面中还是在服务器上）将关闭另一侧。但是，当设置了 [`webSocketRoute.onClose()`](/api/class-websocketroute#web-socket-route-on-close) 处理程序时，关闭的默认转发将被禁用，处理程序应负责处理它。

**参数**

- <a id="web-socket-route-on-close-option-handler"></a>`handler` `function(int | undefined, string | undefined): Promise<any> | any`

  将处理 WebSocket 关闭的函数。接收可选的[关闭代码](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#code)和可选的[关闭原因](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close#reason)。


### webSocketRoute.onMessage() {#web-socket-route-on-message}

<Badge type="info" text="新增于: v1.48" />

此方法允许处理 WebSocket 发送的消息，无论是来自页面还是来自服务器。

当在原始 WebSocket 路由上调用时，此方法处理从页面发送的消息。您可以通过使用 [`webSocketRoute.send()`](/api/class-websocketroute#web-socket-route-send) 响应这些消息，将它们转发到 [`webSocketRoute.connectToServer()`](/api/class-websocketroute#web-socket-route-connect-to-server) 返回的服务器端连接，或执行其他操作来处理这些消息。

一旦调用此方法，消息将不再自动转发到服务器或页面 - 您应该通过调用 [`webSocketRoute.send()`](/api/class-websocketroute#web-socket-route-send) 手动执行此操作。更多详细信息请参阅顶部的示例。

再次调用此方法将用新的处理程序覆盖原有的处理程序。

**参数**

- <a id="web-socket-route-on-message-option-handler"></a>`handler` `function(string | Buffer): Promise<any> | any`

  将处理消息的函数。


### webSocketRoute.protocols() {#web-socket-route-protocols}

<Badge type="info" text="新增于: v1.60" />

页面请求的 WebSocket 子协议列表，通过 [`WebSocket` 构造函数](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket)的第二个参数传递。对应于 `Sec-WebSocket-Protocol` 请求头。

如果未指定协议，则返回空数组。

**用法**

```js
await page.routeWebSocket('wss://example.com/ws', ws => {
  if (ws.protocols().includes('chat.v2'))
    ws.onMessage(message => ws.send(JSON.stringify({ version: 2, echo: message })));
  else
    ws.close({ code: 1002, reason: 'Unsupported protocol' });
});
```

**返回值**

- `Array<string>`


### webSocketRoute.send() {#web-socket-route-send}

<Badge type="info" text="新增于: v1.48" />

向 WebSocket 发送消息。当在原始 WebSocket 上调用时，将消息发送到页面。当在 [`webSocketRoute.connectToServer()`](/api/class-websocketroute#web-socket-route-connect-to-server) 的结果上调用时，将消息发送到服务器。更多详细信息请参阅顶部的示例。

**参数**

- <a id="web-socket-route-send-option-message"></a>`message` `string | Buffer`

  要发送的消息。


### webSocketRoute.url() {#web-socket-route-url}

<Badge type="info" text="新增于: v1.48" />

在页面中创建的 WebSocket 的 URL。

**返回值**

- `string`
