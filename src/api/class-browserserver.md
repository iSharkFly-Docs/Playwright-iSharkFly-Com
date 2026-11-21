---
title: BrowserServer
outline: 2
---

# BrowserServer

<Badge type="info" text="Added in: v1.8" />

## Methods

### browserServer.close() {#browser-server-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Closes the browser gracefully and makes sure the process is terminated.


### browserServer.kill() {#browser-server-kill}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Kills the browser process and waits for the process to exit.


### browserServer.process() {#browser-server-process}

<Badge type="info" text="Added in: v1.8" />

Spawned browser application process.

**Returns**

- `ChildProcess`


### browserServer.wsEndpoint() {#browser-server-ws-endpoint}

<Badge type="info" text="Added in: v1.8" />

Browser websocket url.

Browser websocket endpoint which can be used as an argument to [`browserType.connect()`](/api/class-browsertype#browser-type-connect) to establish connection
to the browser.

**Returns**

- `string`


## Events

### browserServer.on('close') {#browser-server-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when the browser server closes.

**Event data**

- `void`

