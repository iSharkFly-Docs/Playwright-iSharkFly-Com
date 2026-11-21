---
title: WebStorage
outline: 2
---

# WebStorage

<Badge type="info" text="Added in: v1.61" />

WebStorage exposes the page's `localStorage` or `sessionStorage` for the current origin via an async,
[browser-consistent](https://developer.mozilla.org/en-US/docs/Web/API/Storage) API.

Instances are accessed through [`page.localStorage`](/api/class-page#page-local-storage) and [`page.sessionStorage`](/api/class-page#page-session-storage).

```js
await page.goto('https://example.com');
await page.localStorage.setItem('token', 'abc');
const token = await page.localStorage.getItem('token');
const all = await page.localStorage.items();
await page.localStorage.removeItem('token');
await page.localStorage.clear();
```

## Methods

### webStorage.clear() {#web-storage-clear}

<Badge type="info" text="Added in: v1.61" /> <Badge type="tip" text="async" />

Removes all items from the storage.


### webStorage.getItem() {#web-storage-get-item}

<Badge type="info" text="Added in: v1.61" /> <Badge type="tip" text="async" />

Returns the value for the given [`name`](/api/class-webstorage#web-storage-get-item-option-name) if present.

**Arguments**

- <a id="web-storage-get-item-option-name"></a>`name` `string`

  Name of the item to retrieve.

**Returns**

- `Promise<null | string>`


### webStorage.items() {#web-storage-items}

<Badge type="info" text="Added in: v1.61" /> <Badge type="tip" text="async" />

Returns all items in the storage as name/value pairs.

**Returns**

- `Promise<Array<Object>>`


### webStorage.removeItem() {#web-storage-remove-item}

<Badge type="info" text="Added in: v1.61" /> <Badge type="tip" text="async" />

Removes the item with the given [`name`](/api/class-webstorage#web-storage-remove-item-option-name). No-op if the item is absent.

**Arguments**

- <a id="web-storage-remove-item-option-name"></a>`name` `string`

  Name of the item to remove.


### webStorage.setItem() {#web-storage-set-item}

<Badge type="info" text="Added in: v1.61" /> <Badge type="tip" text="async" />

Sets the value for the given [`name`](/api/class-webstorage#web-storage-set-item-option-name). Overwrites any existing value for that name.

**Arguments**

- <a id="web-storage-set-item-option-name"></a>`name` `string`

  Name of the item to set.
- <a id="web-storage-set-item-option-value"></a>`value` `string`

  New value for the item.

