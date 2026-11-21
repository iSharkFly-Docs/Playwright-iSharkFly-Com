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

```java
CDPSession client = page.context().newCDPSession(page);
client.send("Runtime.enable");

client.on("Animation.animationCreated", (event) -> System.out.println("Animation created!"));

JsonObject response = client.send("Animation.getPlaybackRate");
double playbackRate = response.get("playbackRate").getAsDouble();
System.out.println("playback rate is " + playbackRate);

JsonObject params = new JsonObject();
params.addProperty("playbackRate", playbackRate / 2);
client.send("Animation.setPlaybackRate", params);
```

## Methods

### cdpSession.detach() {#cdp-session-detach}

<Badge type="info" text="Added in: v1.8" />

Detaches the CDPSession from the target. Once detached, the CDPSession object won't emit any events and can't be used to
send messages.


### cdpSession.off() {#cdp-session-off}

<Badge type="info" text="Added in: v1.37" />

Unregister an event handler for events with the specified event name.
The given handler will not be called anymore for events with the given name.

**Arguments**

- <a id="cdp-session-off-option-event-name"></a>`eventName` `string`

  CDP event name.
- <a id="cdp-session-off-option-handler"></a>`handler` `function(JsonObject)`

  Event handler.


### cdpSession.on() {#cdp-session-on}

<Badge type="info" text="Added in: v1.37" />

Register an event handler for events with the specified event name.
The given handler will be called for every event with the given name.

**Arguments**

- <a id="cdp-session-on-option-event-name"></a>`eventName` `string`

  CDP event name.
- <a id="cdp-session-on-option-handler"></a>`handler` `function(JsonObject)`

  Event handler.


### cdpSession.send() {#cdp-session-send}

<Badge type="info" text="Added in: v1.8" />

**Arguments**

- <a id="cdp-session-send-option-method"></a>`method` `string`

  Protocol method name.
- <a id="cdp-session-send-option-params"></a>`args` `JsonObject` *(optional)* <Badge type="info" text="Added in: v1.37" />

  Optional method parameters.
- <a id="cdp-session-send-option-options"></a>`options` `Object` *(optional)*

  - <a id="cdp-session-send-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.65" />

    Maximum time in milliseconds to wait for the response. Defaults to `0` - no timeout.

**Returns**

- `JsonObject`


## Events

### cdpSession.onClose() {#cdp-session-event-close}

<Badge type="info" text="Added in: v1.59" />

Emitted when the session is closed, either because the target was closed or `session.detach()` was called.

**Event data**

- `CDPSession`

