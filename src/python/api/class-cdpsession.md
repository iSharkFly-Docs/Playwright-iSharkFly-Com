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

::: code-group

```python [Async]
client = await page.context.new_cdp_session(page)
await client.send("Animation.enable")
client.on("Animation.animationCreated", lambda: print("animation created!"))
response = await client.send("Animation.getPlaybackRate")
print("playback rate is " + str(response["playbackRate"]))
await client.send("Animation.setPlaybackRate", {
    "playbackRate": response["playbackRate"] / 2
})
```

```python [Sync]
client = page.context.new_cdp_session(page)
client.send("Animation.enable")
client.on("Animation.animationCreated", lambda: print("animation created!"))
response = client.send("Animation.getPlaybackRate")
print("playback rate is " + str(response["playbackRate"]))
client.send("Animation.setPlaybackRate", {
    "playbackRate": response["playbackRate"] / 2
})
```

:::

## Methods

### cdp_session.detach() {#cdp-session-detach}

<Badge type="info" text="Added in: v1.8" />

Detaches the CDPSession from the target. Once detached, the CDPSession object won't emit any events and can't be used to
send messages.


### cdp_session.send() {#cdp-session-send}

<Badge type="info" text="Added in: v1.8" />

**Arguments**

- <a id="cdp-session-send-option-method"></a>`method` `string`

  Protocol method name.
- <a id="cdp-session-send-option-params"></a>`params` `Object` *(optional)*

  Optional method parameters.
- <a id="cdp-session-send-option-options"></a>`options` `Object` *(optional)*

  - <a id="cdp-session-send-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.65" />

    Maximum time in milliseconds to wait for the response. Defaults to `0` - no timeout.

**Returns**

- `Object`


## Events

### cdpSession.on("close") {#cdp-session-event-close}

<Badge type="info" text="Added in: v1.59" />

Emitted when the session is closed, either because the target was closed or `session.detach()` was called.

**Event data**

- `CDPSession`

