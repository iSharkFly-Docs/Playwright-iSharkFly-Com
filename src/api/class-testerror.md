---
title: TestError
outline: 2
---

# TestError

<Badge type="info" text="Added in: v1.10" />

Information about an error thrown during test execution.

## Properties

### testError.cause {#test-error-cause}

<Badge type="info" text="Added in: v1.49" />

Error cause. Set when there is a [cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) for the error. Will be `undefined` if there is no cause or if the cause is not an instance of [Error].

**Type**

- `TestError`


### testError.location {#test-error-location}

<Badge type="info" text="Added in: v1.30" />

Error location in the source code.

**Type**

- `Location`


### testError.message {#test-error-message}

<Badge type="info" text="Added in: v1.10" />

Error message. Set when [Error] (or its subclass) has been thrown.

**Type**

- `string`


### testError.snippet {#test-error-snippet}

<Badge type="info" text="Added in: v1.33" />

Source code snippet with highlighted error.

**Type**

- `string`


### testError.stack {#test-error-stack}

<Badge type="info" text="Added in: v1.10" />

Error stack. Set when [Error] (or its subclass) has been thrown.

**Type**

- `string`


### testError.value {#test-error-value}

<Badge type="info" text="Added in: v1.10" />

The value that was thrown. Set when anything except the [Error] (or its subclass) has been thrown.

**Type**

- `string`

