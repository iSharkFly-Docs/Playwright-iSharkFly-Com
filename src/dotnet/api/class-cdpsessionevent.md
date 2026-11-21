---
title: CDPSessionEvent
outline: 2
---

# CDPSessionEvent

<Badge type="info" text="Added in: v1.30" />

[CDPSessionEvent](/dotnet/api/class-cdpsessionevent) objects are returned by page via the [`CdpSession.Event()`](/dotnet/api/class-cdpsession#cdp-session-event) method.

Each object represents a named event and allows handling of the event when it is raised.

## Properties

### CdpSessionEvent.EventName {#cdp-session-event-event-name}

<Badge type="info" text="Added in: v1.30" />

**Type**

- `string`


## Events

### CdpSessionEvent.OnEvent {#cdp-session-event-event-on-event}

<Badge type="info" text="Added in: v1.30" />

**Event data**

- `JsonElement?`

