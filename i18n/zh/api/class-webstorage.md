---
title: WebStorage
outline: 2
---

# WebStorage

<Badge type="info" text="新增于: v1.61" />

WebStorage 通过异步、[浏览器一致](https://developer.mozilla.org/en-US/docs/Web/API/Storage)的 API 暴露当前源的页面 `localStorage` 或 `sessionStorage`。

实例通过 [`page.localStorage`](/api/class-page#page-local-storage) 和 [`page.sessionStorage`](/api/class-page#page-session-storage) 访问。

```js
await page.goto('https://example.com');
await page.localStorage.setItem('token', 'abc');
const token = await page.localStorage.getItem('token');
const all = await page.localStorage.items();
await page.localStorage.removeItem('token');
await page.localStorage.clear();
```

## 方法

### webStorage.clear() {#web-storage-clear}

<Badge type="info" text="新增于: v1.61" /> <Badge type="tip" text="async" />

从存储中移除所有项目。


### webStorage.getItem() {#web-storage-get-item}

<Badge type="info" text="新增于: v1.61" /> <Badge type="tip" text="async" />

如果存在，返回给定 [`name`](/api/class-webstorage#web-storage-get-item-option-name) 的值。

**参数**

- <a id="web-storage-get-item-option-name"></a>`name` `string`

  要获取的项目的名称。

**返回值**

- `Promise<null | string>`


### webStorage.items() {#web-storage-items}

<Badge type="info" text="新增于: v1.61" /> <Badge type="tip" text="async" />

以名称/值对的形式返回存储中的所有项目。

**返回值**

- `Promise<Array<Object>>`


### webStorage.removeItem() {#web-storage-remove-item}

<Badge type="info" text="新增于: v1.61" /> <Badge type="tip" text="async" />

移除具有给定 [`name`](/api/class-webstorage#web-storage-remove-item-option-name) 的项目。如果项目不存在，则不执行任何操作。

**参数**

- <a id="web-storage-remove-item-option-name"></a>`name` `string`

  要移除的项目的名称。


### webStorage.setItem() {#web-storage-set-item}

<Badge type="info" text="新增于: v1.61" /> <Badge type="tip" text="async" />

为给定的 [`name`](/api/class-webstorage#web-storage-set-item-option-name) 设置值。覆盖该名称的任何现有值。

**参数**

- <a id="web-storage-set-item-option-name"></a>`name` `string`

  要设置的项目的名称。
- <a id="web-storage-set-item-option-value"></a>`value` `string`

  项目的新值。
