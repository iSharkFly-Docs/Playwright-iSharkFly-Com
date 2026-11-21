---
title: Disposable
outline: 2
---

# Disposable

<Badge type="info" text="Added in: v1.59" />

[Disposable](/python/api/class-disposable) is returned from various methods to allow undoing the corresponding action. For example,
[`page.add_init_script()`](/python/api/class-page#page-add-init-script) returns a [Disposable](/python/api/class-disposable) that can be used to remove the init script.

## Methods

### disposable.close() {#disposable-close}

<Badge type="info" text="Added in: v1.59" />

Removes the associated resource. For example, removes the init script installed via
[`page.add_init_script()`](/python/api/class-page#page-add-init-script) or [`browser_context.add_init_script()`](/python/api/class-browsercontext#browser-context-add-init-script).

