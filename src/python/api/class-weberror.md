---
title: WebError
outline: 2
---

# WebError

<Badge type="info" text="Added in: v1.38" />

[WebError](/python/api/class-weberror) class represents an unhandled exception thrown in the page. It is dispatched via the [`browserContext.on("webError")`](/python/api/class-browsercontext#browser-context-event-web-error) event.

::: code-group

```python [Async]
# Log all uncaught errors to the terminal
context.on("weberror", lambda web_error: print(f"uncaught exception: {web_error.error}"))

# Navigate to a page with an exception.
await page.goto("data:text/html,<script>throw new Error('test')</script>")
```

```python [Sync]
# Log all uncaught errors to the terminal
context.on("weberror", lambda web_error: print(f"uncaught exception: {web_error.error}"))

# Navigate to a page with an exception.
page.goto("data:text/html,<script>throw new Error('test')</script>")
```

:::

## Methods

### web_error.error() {#web-error-error}

<Badge type="info" text="Added in: v1.38" />

Unhandled error that was thrown.

**Returns**

- `Error`


### web_error.location() {#web-error-location}

<Badge type="info" text="Added in: v1.60" />

**Returns**

- `Object`


### web_error.page() {#web-error-page}

<Badge type="info" text="Added in: v1.38" />

The page that produced this unhandled exception, if any.

**Returns**

- `null | Page`

