---
title: WebError
outline: 2
---

# WebError

<Badge type="info" text="Added in: v1.38" />

[WebError](/dotnet/api/class-weberror) class represents an unhandled exception thrown in the page. It is dispatched via the [`BrowserContext.WebError`](/dotnet/api/class-browsercontext#browser-context-event-web-error) event.

```csharp
// Log all uncaught errors to the terminal
context.WebError += (_, webError) =>
{
  Console.WriteLine("Uncaught exception: " + webError.Error);
};
```

## Methods

### WebError.Error() {#web-error-error}

<Badge type="info" text="Added in: v1.38" />

Unhandled error that was thrown.

**Returns**

- `string`


### WebError.Location() {#web-error-location}

<Badge type="info" text="Added in: v1.60" />

**Returns**

- `Object`


### WebError.Page() {#web-error-page}

<Badge type="info" text="Added in: v1.38" />

The page that produced this unhandled exception, if any.

**Returns**

- `null | Page`

