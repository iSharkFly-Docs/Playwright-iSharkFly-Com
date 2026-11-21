---
title: WebError
outline: 2
---

# WebError

<Badge type="info" text="Added in: v1.38" />

[WebError](/java/api/class-weberror) class represents an unhandled exception thrown in the page. It is dispatched via the [`browserContext.onWebError()`](/java/api/class-browsercontext#browser-context-event-web-error) event.

```java
// Log all uncaught errors to the terminal
context.onWebError(webError -> {
  System.out.println("Uncaught exception: " + webError.error());
});

// Navigate to a page with an exception.
page.navigate("data:text/html,<script>throw new Error('Test')</script>");
```

## Methods

### webError.error() {#web-error-error}

<Badge type="info" text="Added in: v1.38" />

Unhandled error that was thrown.

**Returns**

- `string`


### webError.location() {#web-error-location}

<Badge type="info" text="Added in: v1.60" />

**Returns**

- `Object`


### webError.page() {#web-error-page}

<Badge type="info" text="Added in: v1.38" />

The page that produced this unhandled exception, if any.

**Returns**

- `null | Page`

