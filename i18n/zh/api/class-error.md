---
title: Error
outline: 2
---

# Error

<Badge type="info" text="Added in: v1.11" />

Extends: [Exception](./class-exception)

* extends: [Exception]

当某些操作异常终止时会引发 Error，例如在 [`page.evaluate()`](/python/api/class-page#page-evaluate) 运行时浏览器关闭。所有 Playwright 异常都继承自此类。

## 属性

### error.message {#error-message}

<Badge type="info" text="Added in: v1.11" />

错误的消息。

**类型**

- `str`


### error.name {#error-name}

<Badge type="info" text="Added in: v1.11" />

在浏览器内部抛出的错误名称。可选。

**类型**

- `str`


### error.stack {#error-stack}

<Badge type="info" text="Added in: v1.11" />

在浏览器内部抛出的错误堆栈。可选。

**类型**

- `str`
