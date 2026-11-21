---
title: BrowserServer
outline: 2
---

# BrowserServer

<Badge type="info" text="Added in: v1.8" />

## Methods

### browserServer.close() {#browser-server-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

优雅地关闭浏览器并确保进程已终止。


### browserServer.kill() {#browser-server-kill}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

强制终止浏览器进程并等待进程退出。


### browserServer.process() {#browser-server-process}

<Badge type="info" text="Added in: v1.8" />

已生成的浏览器应用程序进程。

**Returns**

- `ChildProcess`


### browserServer.wsEndpoint() {#browser-server-ws-endpoint}

<Badge type="info" text="Added in: v1.8" />

浏览器 websocket url。

浏览器 websocket 端点，可用作 [`browserType.connect()`](/api/class-browsertype#browser-type-connect) 的参数来建立与浏览器的连接。

**Returns**

- `string`


## Events

### browserServer.on('close') {#browser-server-event-close}

<Badge type="info" text="Added in: v1.8" />

当浏览器服务器关闭时触发。

**Event data**

- `void`
