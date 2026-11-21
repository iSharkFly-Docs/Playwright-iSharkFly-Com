---
title: FormData
outline: 2
---

# FormData

<Badge type="info" text="Added in: v1.18" />

[FormData](/java/api/class-formdata) 用于创建通过 [APIRequestContext](/java/api/class-apirequestcontext) 发送的表单数据。

```java
import com.microsoft.playwright.options.FormData;
// ...
FormData form = FormData.create()
    .set("firstName", "John")
    .set("lastName", "Doe")
    .set("age", 30);
page.request().post("http://localhost/submit", RequestOptions.create().setForm(form));
```

## 方法

### formData.append() {#form-data-append}

<Badge type="info" text="Added in: v1.44" />

将新值追加到 FormData 对象中现有键上，如果键不存在则添加该键。文件值可以作为 `Path` 或 `FilePayload` 传递。可以添加多个具有相同名称的字段。

[`formData.set()`](/java/api/class-formdata#form-data-set) 和 [`formData.append()`](/java/api/class-formdata#form-data-append) 之间的区别在于，如果指定的键已经存在，[`formData.set()`](/java/api/class-formdata#form-data-set) 将用新值覆盖所有现有值，而 [`formData.append()`](/java/api/class-formdata#form-data-append) 将在现有值集的末尾追加新值。

```java
import com.microsoft.playwright.options.FormData;
// ...
FormData form = FormData.create()
    // 仅设置名称和值。
    .append("firstName", "John")
    // 设置名称和值，文件名和 Content-Type 从文件路径推断。
    .append("attachment", Paths.get("pic.jpg"))
    // 设置名称、值、文件名和 Content-Type。
    .append("attachment", new FilePayload("table.csv", "text/csv", Files.readAllBytes(Paths.get("my-tble.csv"))));
page.request().post("http://localhost/submit", RequestOptions.create().setForm(form));
```

**参数**

- <a id="form-data-append-option-name"></a>`name` `string`

  字段名称。
- <a id="form-data-append-option-value"></a>`value` `string | boolean | int | path | Object`

  字段值。

  - `name` `string`

    文件名
  - `mimeType` `string`

    文件类型
  - `buffer` `Buffer`

    文件内容

**返回值**

- `FormData`


### formData.create() {#form-data-create}

<Badge type="info" text="Added in: v1.18" />

创建 [FormData](/java/api/class-formdata) 的新实例。

**返回值**

- `FormData`


### formData.set() {#form-data-set}

<Badge type="info" text="Added in: v1.18" />

设置表单上的字段。文件值可以作为 `Path` 或 `FilePayload` 传递。

```java
import com.microsoft.playwright.options.FormData;
// ...
FormData form = FormData.create()
    // 仅设置名称和值。
    .set("firstName", "John")
    // 设置名称和值，文件名和 Content-Type 从文件路径推断。
    .set("profilePicture1", Paths.get("john.jpg"))
    // 设置名称、值、文件名和 Content-Type。
    .set("profilePicture2", new FilePayload("john.jpg", "image/jpeg", Files.readAllBytes(Paths.get("john.jpg"))))
    .set("age", 30);
page.request().post("http://localhost/submit", RequestOptions.create().setForm(form));
```

**参数**

- <a id="form-data-set-option-name"></a>`name` `string`

  字段名称。
- <a id="form-data-set-option-value"></a>`value` `string | boolean | int | path | Object`

  字段值。

  - `name` `string`

    文件名
  - `mimeType` `string`

    文件类型
  - `buffer` `Buffer`

    文件内容

**返回值**

- `FormData`
