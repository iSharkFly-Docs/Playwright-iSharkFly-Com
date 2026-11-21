---
title: Disposable
outline: 2
---

# Disposable

<Badge type="info" text="Added in: v1.59" />

[Disposable](/api/class-disposable) is returned from various methods to allow undoing the corresponding action. For example,
[`page.addInitScript()`](/api/class-page#page-add-init-script) returns a [Disposable](/api/class-disposable) that can be used to remove the init script.

## Methods

### disposable.dispose() {#disposable-dispose}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Removes the associated resource. For example, removes the init script installed via
[`page.addInitScript()`](/api/class-page#page-add-init-script) or [`browserContext.addInitScript()`](/api/class-browsercontext#browser-context-add-init-script).

