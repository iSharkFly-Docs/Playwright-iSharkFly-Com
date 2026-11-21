---
title: TestError
outline: 2
---

# TestError

<Badge type="info" text="Added in: v1.10" />

关于测试执行过程中抛出的错误的信息。

## 属性

### testError.cause {#test-error-cause}

<Badge type="info" text="Added in: v1.49" />

错误原因。当错误存在 [cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) 时设置。如果没有原因或原因不是 [Error] 实例，则为 `undefined`。

**类型**

- `TestError`


### testError.location {#test-error-location}

<Badge type="info" text="Added in: v1.30" />

错误在源代码中的位置。

**类型**

- `Location`


### testError.message {#test-error-message}

<Badge type="info" text="Added in: v1.10" />

错误消息。当抛出 [Error]（或其子类）时设置。

**类型**

- `string`


### testError.snippet {#test-error-snippet}

<Badge type="info" text="Added in: v1.33" />

带有高亮错误的源代码片段。

**类型**

- `string`


### testError.stack {#test-error-stack}

<Badge type="info" text="Added in: v1.10" />

错误堆栈。当抛出 [Error]（或其子类）时设置。

**类型**

- `string`


### testError.value {#test-error-value}

<Badge type="info" text="Added in: v1.10" />

被抛出的值。当抛出的不是 [Error]（或其子类）时设置。

**类型**

- `string`
