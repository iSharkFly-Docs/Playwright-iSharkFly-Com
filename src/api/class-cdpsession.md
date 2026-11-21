---
title: CDPSession
outline: 2
---

# CDPSession

<Badge type="info" text="Added in: v1.8" />

The `CDPSession` instances are used to talk raw Chrome Devtools Protocol:
* protocol methods can be called with `session.send` method.
* protocol events can be subscribed to with `session.on` method.

Useful links:
* Documentation on DevTools Protocol can be found here:
  [DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/).
* Getting Started with DevTools Protocol:
  https://github.com/aslushnikov/getting-started-with-cdp/blob/master/README.md

```js
const client = await page.context().newCDPSession(page);
await client.send('Animation.enable');
client.on('Animation.animationCreated', () => console.log('Animation created!'));
const response = await client.send('Animation.getPlaybackRate');
console.log('playback rate is ' + response.playbackRate);
await client.send('Animation.setPlaybackRate', {
  playbackRate: response.playbackRate / 2
});
```

## Methods

### cdpSession.detach() {#cdp-session-detach}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Detaches the CDPSession from the target. Once detached, the CDPSession object won't emit any events and can't be used to
send messages.


### cdpSession.send() {#cdp-session-send}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

**Arguments**

- <a id="cdp-session-send-option-method"></a>`method` `string`

  Protocol method name.
- <a id="cdp-session-send-option-params"></a>`params` `Object` *(optional)*

  Optional method parameters.
- <a id="cdp-session-send-option-options"></a>`options` `Object` *(optional)*

  - <a id="cdp-session-send-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.65" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
  - <a id="cdp-session-send-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.65" />

    Maximum time in milliseconds to wait for the response. Defaults to `0` - no timeout.

**Returns**

- `Promise<Object>`


## Events

### cdpSession.on('close') {#cdp-session-event-close}

<Badge type="info" text="Added in: v1.59" />

Emitted when the session is closed, either because the target was closed or `session.detach()` was called.

**Event data**

- `CDPSession`


### cdpSession.on('event') {#cdp-session-event-event}

<Badge type="info" text="Added in: v1.59" />

Emitted for every CDP event received from the session. Allows subscribing to all CDP events at once without knowing
their names ahead of time.

**Usage**

```js
session.on('event', ({ method, params }) => {
  console.log(`CDP event: ${method}`, params);
});
```

**Event data**

- `Object`

