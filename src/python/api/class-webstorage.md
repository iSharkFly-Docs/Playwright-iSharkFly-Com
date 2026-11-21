---
title: WebStorage
outline: 2
---

# WebStorage

<Badge type="info" text="Added in: v1.61" />

WebStorage exposes the page's `localStorage` or `sessionStorage` for the current origin via an async,
[browser-consistent](https://developer.mozilla.org/en-US/docs/Web/API/Storage) API.

Instances are accessed through [`page.local_storage`](/python/api/class-page#page-local-storage) and [`page.session_storage`](/python/api/class-page#page-session-storage).

::: code-group

```python [Async]
await page.goto("https://example.com")
await page.local_storage.set_item("token", "abc")
token = await page.local_storage.get_item("token")
all = await page.local_storage.items()
await page.local_storage.remove_item("token")
await page.local_storage.clear()
```

```python [Sync]
page.goto("https://example.com")
page.local_storage.set_item("token", "abc")
token = page.local_storage.get_item("token")
all = page.local_storage.items()
page.local_storage.remove_item("token")
page.local_storage.clear()
```

:::

## Methods

### web_storage.clear() {#web-storage-clear}

<Badge type="info" text="Added in: v1.61" />

Removes all items from the storage.


### web_storage.get_item() {#web-storage-get-item}

<Badge type="info" text="Added in: v1.61" />

Returns the value for the given [`name`](/python/api/class-webstorage#web-storage-get-item-option-name) if present.

**Arguments**

- <a id="web-storage-get-item-option-name"></a>`name` `string`

  Name of the item to retrieve.

**Returns**

- `null | string`


### web_storage.items() {#web-storage-items}

<Badge type="info" text="Added in: v1.61" />

Returns all items in the storage as name/value pairs.

**Returns**

- `Array<Object>`


### web_storage.remove_item() {#web-storage-remove-item}

<Badge type="info" text="Added in: v1.61" />

Removes the item with the given [`name`](/python/api/class-webstorage#web-storage-remove-item-option-name). No-op if the item is absent.

**Arguments**

- <a id="web-storage-remove-item-option-name"></a>`name` `string`

  Name of the item to remove.


### web_storage.set_item() {#web-storage-set-item}

<Badge type="info" text="Added in: v1.61" />

Sets the value for the given [`name`](/python/api/class-webstorage#web-storage-set-item-option-name). Overwrites any existing value for that name.

**Arguments**

- <a id="web-storage-set-item-option-name"></a>`name` `string`

  Name of the item to set.
- <a id="web-storage-set-item-option-value"></a>`value` `string`

  New value for the item.

