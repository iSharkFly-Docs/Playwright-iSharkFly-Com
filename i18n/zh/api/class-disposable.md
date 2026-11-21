---
title: Disposable
outline: 2
---

# Disposable

<Badge type="info" text="添加于: v1.59" />

[Disposable](/api/class-disposable) 从各种方法返回，允许撤销相应的操作。例如，[`page.addInitScript()`](/api/class-page#page-add-init-script) 返回一个 [Disposable](/api/class-disposable)，可用于移除初始化脚本。

## 方法

### disposable.dispose() {#disposable-dispose}

<Badge type="info" text="添加于: v1.59" /> <Badge type="tip" text="异步" />

移除关联的资源。例如，移除通过 [`page.addInitScript()`](/api/class-page#page-add-init-script) 或 [`browserContext.addInitScript()`](/api/class-browsercontext#browser-context-add-init-script) 安装的初始化脚本。
