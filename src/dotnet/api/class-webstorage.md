---
title: WebStorage
outline: 2
---

# WebStorage

<Badge type="info" text="Added in: v1.61" />

WebStorage exposes the page's `localStorage` or `sessionStorage` for the current origin via an async,
[browser-consistent](https://developer.mozilla.org/en-US/docs/Web/API/Storage) API.

Instances are accessed through [`Page.LocalStorage`](/dotnet/api/class-page#page-local-storage) and [`Page.SessionStorage`](/dotnet/api/class-page#page-session-storage).

```csharp
await page.GotoAsync("https://example.com");
await page.LocalStorage.SetItemAsync("token", "abc");
var token = await page.LocalStorage.GetItemAsync("token");
var all = await page.LocalStorage.ItemsAsync();
await page.LocalStorage.RemoveItemAsync("token");
await page.LocalStorage.ClearAsync();
```

## Methods

### WebStorage.ClearAsync() {#web-storage-clear}

<Badge type="info" text="Added in: v1.61" />

Removes all items from the storage.


### WebStorage.GetItemAsync() {#web-storage-get-item}

<Badge type="info" text="Added in: v1.61" />

Returns the value for the given [`name`](/dotnet/api/class-webstorage#web-storage-get-item-option-name) if present.

**Arguments**

- <a id="web-storage-get-item-option-name"></a>`name` `string`

  Name of the item to retrieve.

**Returns**

- `null | string`


### WebStorage.ItemsAsync() {#web-storage-items}

<Badge type="info" text="Added in: v1.61" />

Returns all items in the storage as name/value pairs.

**Returns**

- `Array<Object>`


### WebStorage.RemoveItemAsync() {#web-storage-remove-item}

<Badge type="info" text="Added in: v1.61" />

Removes the item with the given [`name`](/dotnet/api/class-webstorage#web-storage-remove-item-option-name). No-op if the item is absent.

**Arguments**

- <a id="web-storage-remove-item-option-name"></a>`name` `string`

  Name of the item to remove.


### WebStorage.SetItemAsync() {#web-storage-set-item}

<Badge type="info" text="Added in: v1.61" />

Sets the value for the given [`name`](/dotnet/api/class-webstorage#web-storage-set-item-option-name). Overwrites any existing value for that name.

**Arguments**

- <a id="web-storage-set-item-option-name"></a>`name` `string`

  Name of the item to set.
- <a id="web-storage-set-item-option-value"></a>`value` `string`

  New value for the item.

