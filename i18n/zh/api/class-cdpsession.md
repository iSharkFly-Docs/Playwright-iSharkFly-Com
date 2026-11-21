---
title: CDPSession
outline: 2
---

# CDPSession

<Badge type="info" text="新增于: v1.8" />

`CDPSession` 实例用于直接与 Chrome DevTools Protocol 通信：
* 可以使用 `session.send` 方法调用协议方法。
* 可以使用 `session.on` 方法订阅协议事件。

有用的链接：
* DevTools Protocol 文档可以在这里找到：
  [DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/)。
* DevTools Protocol 入门指南：
  https://github.com/aslushnikov/getting-started-with-cdp/blob/master/README.md

```js
const client = await page.context().newCDPSession(page);
await client.send('Animation.enable');
client.on('Animation.animationCreated', () => console.log('动画已创建！'));
const response = await client.send('Animation.getPlaybackRate');
console.log('播放速率是 ' + response.playbackRate);
await client.send('Animation.setPlaybackRate', {
  playbackRate: response.playbackRate / 2
});
```

## 方法

### cdpSession.detach() {#cdp-session-detach}

<Badge type="info" text="新增于: v1.8" /> <Badge type="tip" text="async" />

从目标分离 CDPSession。一旦分离，CDPSession 对象将不会发出任何事件，也无法用于发送消息。


### cdpSession.send() {#cdp-session-send}

<Badge type="info" text="新增于: v1.8" /> <Badge type="tip" text="async" />

**参数**

- <a id="cdp-session-send-option-method"></a>`method` `string`

  协议方法名称。
- <a id="cdp-session-send-option-params"></a>`params` `Object` *(可选)*

  可选的方法参数。
- <a id="cdp-session-send-option-options"></a>`options` `Object` *(可选)*

  - <a id="cdp-session-send-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="新增于: v1.65" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
  - <a id="cdp-session-send-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="新增于: v1.65" />

    等待响应的最大时间（毫秒）。默认为 `0` - 无超时。

**返回值**

- `Promise<Object>`


## 事件

### cdpSession.on('close') {#cdp-session-event-close}

<Badge type="info" text="新增于: v1.59" />

当会话关闭时触发，无论是因为目标被关闭还是调用了 `session.detach()`。

**事件数据**

- `CDPSession`


### cdpSession.on('event') {#cdp-session-event-event}

<Badge type="info" text="新增于: v1.59" />

对于从会话接收的每个 CDP 事件都会触发。允许一次性订阅所有 CDP 事件，而无需事先知道它们的名称。

**用法**

```js
session.on('event', ({ method, params }) => {
  console.log(`CDP 事件: ${method}`, params);
});
```

**事件数据**

- `Object`
