---
title: Error
outline: 2
---

# Error

<Badge type="info" text="Added in: v1.11" />

Extends: [Exception](./class-exception)

* extends: [Exception]

Error is raised whenever certain operations are terminated abnormally, e.g.
browser closes while [`page.evaluate()`](/python/api/class-page#page-evaluate) is running. All Playwright exceptions
inherit from this class.

## Properties

### error.message {#error-message}

<Badge type="info" text="Added in: v1.11" />

Message of the error.

**Type**

- `str`


### error.name {#error-name}

<Badge type="info" text="Added in: v1.11" />

Name of the error which got thrown inside the browser. Optional.

**Type**

- `str`


### error.stack {#error-stack}

<Badge type="info" text="Added in: v1.11" />

Stack of the error which got thrown inside the browser. Optional.

**Type**

- `str`

