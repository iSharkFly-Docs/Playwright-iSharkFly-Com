---
title: AndroidSocket
outline: 2
---

# AndroidSocket

<Badge type="info" text="Added in: v1.9" />

[AndroidSocket](/api/class-androidsocket) is a way to communicate with a process launched on the [AndroidDevice](/api/class-androiddevice). Use [`androidDevice.open()`](/api/class-androiddevice#android-device-open) to open a socket.

## Methods

### androidSocket.close() {#android-socket-close}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Closes the socket.


### androidSocket.write() {#android-socket-write}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Writes some [`data`](/api/class-androidsocket#android-socket-write-option-data) to the socket.

**Arguments**

- <a id="android-socket-write-option-data"></a>`data` `Buffer`

  Data to write.


## Events

### androidSocket.on('close') {#android-socket-event-close}

<Badge type="info" text="Added in: v1.9" />

Emitted when the socket is closed.

**Event data**

- `void`


### androidSocket.on('data') {#android-socket-event-data}

<Badge type="info" text="Added in: v1.9" />

Emitted when data is available to read from the socket.

**Event data**

- `Buffer`

