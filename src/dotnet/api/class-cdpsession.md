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

```csharp
var client = await Page.Context.NewCDPSessionAsync(Page);
await client.SendAsync("Runtime.enable");
client.Event("Animation.animationCreated").OnEvent += (_, _) => Console.WriteLine("Animation created!");
var response = await client.SendAsync("Animation.getPlaybackRate");
var playbackRate = response.Value.GetProperty("playbackRate").GetDouble();
Console.WriteLine("playback rate is " + playbackRate);
await client.SendAsync("Animation.setPlaybackRate", new() { { "playbackRate", playbackRate / 2 } });
```

## Methods

### CdpSession.DetachAsync() {#cdp-session-detach}

<Badge type="info" text="Added in: v1.8" />

Detaches the CDPSession from the target. Once detached, the CDPSession object won't emit any events and can't be used to
send messages.


### CdpSession.Event() {#cdp-session-event}

<Badge type="info" text="Added in: v1.30" />

Returns an event emitter for the given CDP event name.

**Arguments**

- <a id="cdp-session-event-option-event-name"></a>`eventName` `string`

  CDP event name.

**Returns**

- `CDPSessionEvent`


### CdpSession.SendAsync() {#cdp-session-send}

<Badge type="info" text="Added in: v1.8" />

**Arguments**

- <a id="cdp-session-send-option-method"></a>`method` `string`

  Protocol method name.
- <a id="cdp-session-send-option-params"></a>`args` `Map<string, Object>` *(optional)* <Badge type="info" text="Added in: v1.30" />

  Optional method parameters.
- <a id="cdp-session-send-option-options"></a>`options` `Object` *(optional)*

  - <a id="cdp-session-send-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.65" />

    Maximum time in milliseconds to wait for the response. Defaults to `0` - no timeout.

**Returns**

- `JsonElement?`


## Events

### CdpSession.Close {#cdp-session-event-close}

<Badge type="info" text="Added in: v1.59" />

Emitted when the session is closed, either because the target was closed or `session.detach()` was called.

**Event data**

- `CDPSession`

