---
title: AndroidSocket
outline: 2
---

# AndroidSocket

<Badge type="info" text="添加于: v1.9" />

[AndroidSocket](/api/class-androidsocket) 是一种与在 [AndroidDevice](/api/class-androiddevice) 上启动的进程进行通信的方式。使用 [`androidDevice.open()`](/api/class-androiddevice#android-device-open) 打开一个套接字。

## 方法

### androidSocket.close() {#android-socket-close}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

关闭套接字。


### androidSocket.write() {#android-socket-write}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

向套接字写入一些 [`data`](/api/class-androidsocket#android-socket-write-option-data)。

**参数**

- <a id="android-socket-write-option-data"></a>`data` `Buffer`

  要写入的数据。


## 事件

### androidSocket.on('close') {#android-socket-event-close}

<Badge type="info" text="添加于: v1.9" />

当套接字关闭时触发。

**事件数据**

- `void`


### androidSocket.on('data') {#android-socket-event-data}

<Badge type="info" text="添加于: v1.9" />

当有数据可从套接字读取时触发。

**事件数据**

- `Buffer`
