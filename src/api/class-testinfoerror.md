---
title: TestInfoError
outline: 2
---

# TestInfoError

<Badge type="info" text="Added in: v1.10" />

Information about an error thrown during test execution.

## Properties

### testInfoError.cause {#test-info-error-cause}

<Badge type="info" text="Added in: v1.49" />

Error cause. Set when there is a [cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) for the error. Will be `undefined` if there is no cause or if the cause is not an instance of [Error].

**Type**

- `TestInfoError`


### testInfoError.errorContext {#test-info-error-error-context}

<Badge type="info" text="Added in: v1.60" />

Additional context for the error, such as the aria snapshot of the receiver at the time of an `expect(...)` matcher failure.

**Type**

- `string`


### testInfoError.message {#test-info-error-message}

<Badge type="info" text="Added in: v1.10" />

Error message. Set when [Error] (or its subclass) has been thrown.

**Type**

- `string`


### testInfoError.stack {#test-info-error-stack}

<Badge type="info" text="Added in: v1.10" />

Error stack. Set when [Error] (or its subclass) has been thrown.

**Type**

- `string`


### testInfoError.value {#test-info-error-value}

<Badge type="info" text="Added in: v1.10" />

The value that was thrown. Set when anything except the [Error] (or its subclass) has been thrown.

**Type**

- `string`

