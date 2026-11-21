---
title: WebError
outline: 2
---

# WebError

<Badge type="info" text="新增于: v1.38" />

[WebError](/api/class-weberror) 类表示页面中抛出的未处理异常。它通过 [`browserContext.on('webError')`](/api/class-browsercontext#browser-context-event-web-error) 事件进行分发。

```js
// 将所有未捕获的异常记录到终端
context.on('weberror', webError => {
  console.log(`未捕获的异常: "${webError.error()}"`);
});

// 导航到一个会抛出异常的页面。
await page.goto('data:text/html,<script>throw new Error("Test")</script>');
```

## 方法

### webError.error() {#web-error-error}

<Badge type="info" text="新增于: v1.38" />

被抛出的未处理错误。

**返回值**

- `Error`


### webError.location() {#web-error-location}

<Badge type="info" text="新增于: v1.60" />

**返回值**

- `Object`


### webError.page() {#web-error-page}

<Badge type="info" text="新增于: v1.38" />

产生此未处理异常的页面（如果有的话）。

**返回值**

- `null | Page`
