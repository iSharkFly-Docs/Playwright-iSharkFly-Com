---
title: FormData
outline: 2
---

# FormData

<Badge type="info" text="Added in: v1.18" />

The [FormData](/python/api/class-formdata) is used create form data that is sent via [APIRequestContext](/python/api/class-apirequestcontext).

::: code-group

```python [Async]
form = FormData()
form.set("firstName", "John")
form.set("lastName", "Doe")
form.set("age", 30)
await page.request.post("http://localhost/submit", form=form)
```

```python [Sync]
form = FormData()
form.set("firstName", "John")
form.set("lastName", "Doe")
form.set("age", 30)
page.request.post("http://localhost/submit", form=form)
```

:::

## Methods

### form_data.append() {#form-data-append}

<Badge type="info" text="Added in: v1.44" />

Appends a new value onto an existing key inside a FormData object, or adds the key if it
does not already exist. File values can be passed either as `Path` or as `FilePayload`.
Multiple fields with the same name can be added.

The difference between [`form_data.set()`](/python/api/class-formdata#form-data-set) and [`form_data.append()`](/python/api/class-formdata#form-data-append) is that if the specified key already exists,
[`form_data.set()`](/python/api/class-formdata#form-data-set) will overwrite all existing values with the new one, whereas [`form_data.append()`](/python/api/class-formdata#form-data-append) will append
the new value onto the end of the existing set of values.

::: code-group

```python [Async]
form = FormData()
# Only name and value are set.
form.append("firstName", "John")
# Name and value are set, filename and Content-Type are inferred from the file path.
form.append("attachment", Path("pic.jpg"))
# Name, value, filename and Content-Type are set.
form.append("attachment", {
    "name": "table.csv",
    "mimeType": "text/csv",
    "buffer": Path("my-table.csv").read_bytes(),
})
await page.request.post("http://localhost/submit", multipart=form)
```

```python [Sync]
form = FormData()
# Only name and value are set.
form.append("firstName", "John")
# Name and value are set, filename and Content-Type are inferred from the file path.
form.append("attachment", Path("pic.jpg"))
# Name, value, filename and Content-Type are set.
form.append("attachment", {
    "name": "table.csv",
    "mimeType": "text/csv",
    "buffer": Path("my-table.csv").read_bytes(),
})
page.request.post("http://localhost/submit", multipart=form)
```

:::

**Arguments**

- <a id="form-data-append-option-name"></a>`name` `string`

  Field name.
- <a id="form-data-append-option-value"></a>`value` `string | boolean | int | path | Object`

  Field value.

  - `name` `string`

    File name
  - `mime_type` `string`

    File type
  - `buffer` `Buffer`

    File content

**Returns**

- `FormData`


### form_data.set() {#form-data-set}

<Badge type="info" text="Added in: v1.18" />

Sets a field on the form. File values can be passed either as `Path` or as `FilePayload`.

::: code-group

```python [Async]
form = FormData()
# Only name and value are set.
form.set("firstName", "John")
# Name and value are set, filename and Content-Type are inferred from the file path.
form.set("profilePicture1", Path("john.jpg"))
# Name, value, filename and Content-Type are set.
form.set("profilePicture2", {
    "name": "john.jpg",
    "mimeType": "image/jpeg",
    "buffer": Path("john.jpg").read_bytes(),
})
form.set("age", 30)
await page.request.post("http://localhost/submit", multipart=form)
```

```python [Sync]
form = FormData()
# Only name and value are set.
form.set("firstName", "John")
# Name and value are set, filename and Content-Type are inferred from the file path.
form.set("profilePicture1", Path("john.jpg"))
# Name, value, filename and Content-Type are set.
form.set("profilePicture2", {
    "name": "john.jpg",
    "mimeType": "image/jpeg",
    "buffer": Path("john.jpg").read_bytes(),
})
form.set("age", 30)
page.request.post("http://localhost/submit", multipart=form)
```

:::

**Arguments**

- <a id="form-data-set-option-name"></a>`name` `string`

  Field name.
- <a id="form-data-set-option-value"></a>`value` `string | boolean | int | path | Object`

  Field value.

  - `name` `string`

    File name
  - `mime_type` `string`

    File type
  - `buffer` `Buffer`

    File content

**Returns**

- `FormData`

