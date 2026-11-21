---
title: FormData
outline: 2
---

# FormData

<Badge type="info" text="Added in: v1.18" />

The [FormData](/java/api/class-formdata) is used create form data that is sent via [APIRequestContext](/java/api/class-apirequestcontext).

```java
import com.microsoft.playwright.options.FormData;
// ...
FormData form = FormData.create()
    .set("firstName", "John")
    .set("lastName", "Doe")
    .set("age", 30);
page.request().post("http://localhost/submit", RequestOptions.create().setForm(form));
```

## Methods

### formData.append() {#form-data-append}

<Badge type="info" text="Added in: v1.44" />

Appends a new value onto an existing key inside a FormData object, or adds the key if it
does not already exist. File values can be passed either as `Path` or as `FilePayload`.
Multiple fields with the same name can be added.

The difference between [`formData.set()`](/java/api/class-formdata#form-data-set) and [`formData.append()`](/java/api/class-formdata#form-data-append) is that if the specified key already exists,
[`formData.set()`](/java/api/class-formdata#form-data-set) will overwrite all existing values with the new one, whereas [`formData.append()`](/java/api/class-formdata#form-data-append) will append
the new value onto the end of the existing set of values.

```java
import com.microsoft.playwright.options.FormData;
// ...
FormData form = FormData.create()
    // Only name and value are set.
    .append("firstName", "John")
    // Name and value are set, filename and Content-Type are inferred from the file path.
    .append("attachment", Paths.get("pic.jpg"))
    // Name, value, filename and Content-Type are set.
    .append("attachment", new FilePayload("table.csv", "text/csv", Files.readAllBytes(Paths.get("my-tble.csv"))));
page.request().post("http://localhost/submit", RequestOptions.create().setForm(form));
```

**Arguments**

- <a id="form-data-append-option-name"></a>`name` `string`

  Field name.
- <a id="form-data-append-option-value"></a>`value` `string | boolean | int | path | Object`

  Field value.

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content

**Returns**

- `FormData`


### formData.create() {#form-data-create}

<Badge type="info" text="Added in: v1.18" />

Creates new instance of [FormData](/java/api/class-formdata).

**Returns**

- `FormData`


### formData.set() {#form-data-set}

<Badge type="info" text="Added in: v1.18" />

Sets a field on the form. File values can be passed either as `Path` or as `FilePayload`.

```java
import com.microsoft.playwright.options.FormData;
// ...
FormData form = FormData.create()
    // Only name and value are set.
    .set("firstName", "John")
    // Name and value are set, filename and Content-Type are inferred from the file path.
    .set("profilePicture1", Paths.get("john.jpg"))
    // Name, value, filename and Content-Type are set.
    .set("profilePicture2", new FilePayload("john.jpg", "image/jpeg", Files.readAllBytes(Paths.get("john.jpg"))))
    .set("age", 30);
page.request().post("http://localhost/submit", RequestOptions.create().setForm(form));
```

**Arguments**

- <a id="form-data-set-option-name"></a>`name` `string`

  Field name.
- <a id="form-data-set-option-value"></a>`value` `string | boolean | int | path | Object`

  Field value.

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content

**Returns**

- `FormData`

