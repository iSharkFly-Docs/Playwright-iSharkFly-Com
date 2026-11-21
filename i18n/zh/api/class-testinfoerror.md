---
title: TestInfoError
outline: 2
---

# TestInfoError

<Badge type="info" text="Added in: v1.10" />

关于测试执行过程中抛出的错误的信息。

## 属性

### testInfoError.cause {#test-info-error-cause}

<Badge type="info" text="Added in: v1.49" />

错误原因。当错误存在 [cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) 时设置。如果没有原因或原因不是 [Error] 实例，则为 `undefined`。

**类型**

- `TestInfoError`


### testInfoError.errorContext {#test-info-error-error-context}

<Badge type="info" text="Added in: v1.60" />

错误的附加上下文，例如 `expect(...)` 匹配器失败时接收者的 aria 快照。

**类型**

- `string`


### testInfoError.message {#test-info-error-message}

<Badge type="info" text="Added in: v1.10" />

错误消息。当抛出 [Error]（或其子类）时设置。

**类型**

- `string`


### testInfoError.stack {#test-info-error-stack}

<Badge type="info" text="Added in: v1.10" />

错误堆栈。当抛出 [Error]（或其子类）时设置。

**类型**

- `string`


### testInfoError.value {#test-info-error-value}

<Badge type="info" text="Added in: v1.10" />

被抛出的值。当抛出的不是 [Error]（或其子类）时设置。

**类型**

- `string`
