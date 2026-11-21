---
title: WebStorage
outline: 2
---

# WebStorage

<Badge type="info" text="Added in: v1.61" />

WebStorage exposes the page's `localStorage` or `sessionStorage` for the current origin via an async,
[browser-consistent](https://developer.mozilla.org/en-US/docs/Web/API/Storage) API.

Instances are accessed through [`page.localStorage()`](/java/api/class-page#page-local-storage) and [`page.sessionStorage()`](/java/api/class-page#page-session-storage).

```java
page.navigate("https://example.com");
page.localStorage().setItem("token", "abc");
String token = page.localStorage().getItem("token");
List<WebStorageItem> all = page.localStorage().items();
page.localStorage().removeItem("token");
page.localStorage().clear();
```

## Methods

### webStorage.clear() {#web-storage-clear}

<Badge type="info" text="Added in: v1.61" />

Removes all items from the storage.


### webStorage.getItem() {#web-storage-get-item}

<Badge type="info" text="Added in: v1.61" />

Returns the value for the given [`name`](/java/api/class-webstorage#web-storage-get-item-option-name) if present.

**Arguments**

- <a id="web-storage-get-item-option-name"></a>`name` `string`

  Name of the item to retrieve.

**Returns**

- `null | string`


### webStorage.items() {#web-storage-items}

<Badge type="info" text="Added in: v1.61" />

Returns all items in the storage as name/value pairs.

**Returns**

- `Array<Object>`


### webStorage.removeItem() {#web-storage-remove-item}

<Badge type="info" text="Added in: v1.61" />

Removes the item with the given [`name`](/java/api/class-webstorage#web-storage-remove-item-option-name). No-op if the item is absent.

**Arguments**

- <a id="web-storage-remove-item-option-name"></a>`name` `string`

  Name of the item to remove.


### webStorage.setItem() {#web-storage-set-item}

<Badge type="info" text="Added in: v1.61" />

Sets the value for the given [`name`](/java/api/class-webstorage#web-storage-set-item-option-name). Overwrites any existing value for that name.

**Arguments**

- <a id="web-storage-set-item-option-name"></a>`name` `string`

  Name of the item to set.
- <a id="web-storage-set-item-option-value"></a>`value` `string`

  New value for the item.

