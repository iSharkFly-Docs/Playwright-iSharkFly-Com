---
title: FormData
outline: 2
---

# FormData

<Badge type="info" text="Added in: v1.18" />

The [FormData](/dotnet/api/class-formdata) is used create form data that is sent via [APIRequestContext](/dotnet/api/class-apirequestcontext).

## Methods

### FormData.Append() {#form-data-append}

<Badge type="info" text="Added in: v1.44" />

Appends a new value onto an existing key inside a FormData object, or adds the key if it
does not already exist. File values can be passed either as `Path` or as `FilePayload`.
Multiple fields with the same name can be added.

The difference between [`FormData.Set()`](/dotnet/api/class-formdata#form-data-set) and [`FormData.Append()`](/dotnet/api/class-formdata#form-data-append) is that if the specified key already exists,
[`FormData.Set()`](/dotnet/api/class-formdata#form-data-set) will overwrite all existing values with the new one, whereas [`FormData.Append()`](/dotnet/api/class-formdata#form-data-append) will append
the new value onto the end of the existing set of values.

```csharp
var multipart = Context.APIRequest.CreateFormData();
// Only name and value are set.
multipart.Append("firstName", "John");
// Name, value, filename and Content-Type are set.
multipart.Append("attachment", new FilePayload()
{
    Name = "pic.jpg",
    MimeType = "image/jpeg",
    Buffer = File.ReadAllBytes("john.jpg")
});
// Name, value, filename and Content-Type are set.
multipart.Append("attachment", new FilePayload()
{
    Name = "table.csv",
    MimeType = "text/csv",
    Buffer = File.ReadAllBytes("my-tble.csv")
});
await Page.APIRequest.PostAsync("https://localhost/submit", new() { Multipart = multipart });
```

**Arguments**

- <a id="form-data-append-option-name"></a>`name` `string`

  Field name.
- <a id="form-data-append-option-value"></a>`value` `string | boolean | int | Object`

  Field value.

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content

**Returns**

- `FormData`


### FormData.Set() {#form-data-set}

<Badge type="info" text="Added in: v1.18" />

Sets a field on the form. File values can be passed either as `Path` or as `FilePayload`.

```csharp
var multipart = Context.APIRequest.CreateFormData();
// Only name and value are set.
multipart.Set("firstName", "John");
// Name, value, filename and Content-Type are set.
multipart.Set("profilePicture", new FilePayload()
{
    Name = "john.jpg",
    MimeType = "image/jpeg",
    Buffer = File.ReadAllBytes("john.jpg")
});
multipart.Set("age", 30);
await Page.APIRequest.PostAsync("https://localhost/submit", new() { Multipart = multipart });
```

**Arguments**

- <a id="form-data-set-option-name"></a>`name` `string`

  Field name.
- <a id="form-data-set-option-value"></a>`value` `string | boolean | int | Object`

  Field value.

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content

**Returns**

- `FormData`

