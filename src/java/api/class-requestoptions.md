---
title: RequestOptions
outline: 2
---

# RequestOptions

<Badge type="info" text="Added in: v1.18" />

The [RequestOptions](/java/api/class-requestoptions) allows to create form data to be sent via [APIRequestContext](/java/api/class-apirequestcontext). Playwright will automatically
determine content type of the request.

```java
context.request().post(
  "https://example.com/submit",
  RequestOptions.create()
    .setQueryParam("page", 1)
    .setData("My data"));
```

**Uploading html form data**

[FormData](/java/api/class-formdata) class can be used to send a form to the server, by default the request will use `application/x-www-form-urlencoded` encoding:

```java
context.request().post("https://example.com/signup", RequestOptions.create().setForm(
  FormData.create()
    .set("firstName", "John")
    .set("lastName", "Doe")));
```

You can also send files as fields of an html form. The data will be encoded using [`multipart/form-data`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST):

```java
Path path = Paths.get("members.csv");
APIResponse response = context.request().post("https://example.com/upload_members",
  RequestOptions.create().setMultipart(FormData.create().set("membersList", path)));
```

Alternatively, you can build the file payload manually:

```java
FilePayload filePayload = new FilePayload("members.csv", "text/csv",
  "Alice, 33\nJohn, 35\n".getBytes(StandardCharsets.UTF_8));
APIResponse response = context.request().post("https://example.com/upload_members",
  RequestOptions.create().setMultipart(FormData.create().set("membersList", filePayload)));
```

## Methods

### requestOptions.create() {#request-options-create}

<Badge type="info" text="Added in: v1.18" />

Creates new instance of [RequestOptions](/java/api/class-requestoptions).

**Returns**

- `RequestOptions`


### requestOptions.setData() {#request-options-set-data}

<Badge type="info" text="Added in: v1.18" />

Sets the request's post data.

**Arguments**

- <a id="request-options-set-data-option-data"></a>`data` `string | Buffer | Serializable`

  Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
  and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
  set to `application/octet-stream` if not explicitly set.

**Returns**

- `RequestOptions`


### requestOptions.setFailOnStatusCode() {#request-options-set-fail-on-status-code}

<Badge type="info" text="Added in: v1.18" />

**Arguments**

- <a id="request-options-set-fail-on-status-code-option-fail-on-status-code"></a>`failOnStatusCode` `boolean`

  Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
  for all status codes.

**Returns**

- `RequestOptions`


### requestOptions.setForm() {#request-options-set-form}

<Badge type="info" text="Added in: v1.18" />

Provides [FormData](/java/api/class-formdata) object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
unless explicitly provided.

**Arguments**

- <a id="request-options-set-form-option-form"></a>`form` `FormData`

  Form data to be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
  this request body.

**Returns**

- `RequestOptions`


### requestOptions.setHeader() {#request-options-set-header}

<Badge type="info" text="Added in: v1.18" />

Sets an HTTP header to the request. This header will apply to the fetched request as well as any redirects initiated by it.

**Arguments**

- <a id="request-options-set-header-option-name"></a>`name` `string`

  Header name.
- <a id="request-options-set-header-option-value"></a>`value` `string`

  Header value.

**Returns**

- `RequestOptions`


### requestOptions.setIgnoreHTTPSErrors() {#request-options-set-ignore-https-errors}

<Badge type="info" text="Added in: v1.18" />

**Arguments**

- <a id="request-options-set-ignore-https-errors-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean`

  Whether to ignore HTTPS errors when sending network requests.

**Returns**

- `RequestOptions`


### requestOptions.setMaxRedirects() {#request-options-set-max-redirects}

<Badge type="info" text="Added in: v1.26" />

**Arguments**

- <a id="request-options-set-max-redirects-option-max-redirects"></a>`maxRedirects` `int`

  Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
  Defaults to `20`. Pass `0` to not follow redirects.

**Returns**

- `RequestOptions`


### requestOptions.setMaxRetries() {#request-options-set-max-retries}

<Badge type="info" text="Added in: v1.46" />

**Arguments**

- <a id="request-options-set-max-retries-option-max-retries"></a>`maxRetries` `int`

  Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.

**Returns**

- `RequestOptions`


### requestOptions.setMethod() {#request-options-set-method}

<Badge type="info" text="Added in: v1.18" />

Changes the request method (e.g. [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) or
[POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)).

**Arguments**

- <a id="request-options-set-method-option-method"></a>`method` `string`

  Request method, e.g. [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST).

**Returns**

- `RequestOptions`


### requestOptions.setMultipart() {#request-options-set-multipart}

<Badge type="info" text="Added in: v1.18" />

Provides [FormData](/java/api/class-formdata) object that will be serialized as html form using `multipart/form-data` encoding and sent as
this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
unless explicitly provided.

**Arguments**

- <a id="request-options-set-multipart-option-form"></a>`form` `FormData`

  Form data to be serialized as html form using `multipart/form-data` encoding and sent as
  this request body.

**Returns**

- `RequestOptions`


### requestOptions.setQueryParam() {#request-options-set-query-param}

<Badge type="info" text="Added in: v1.18" />

Adds a query parameter to the request URL.

**Arguments**

- <a id="request-options-set-query-param-option-name"></a>`name` `string`

  Parameter name.
- <a id="request-options-set-query-param-option-value"></a>`value` `string | boolean | int`

  Parameter value.

**Returns**

- `RequestOptions`


### requestOptions.setTimeout() {#request-options-set-timeout}

<Badge type="info" text="Added in: v1.18" />

Sets request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Arguments**

- <a id="request-options-set-timeout-option-timeout"></a>`timeout` `float`

  Request timeout in milliseconds.

**Returns**

- `RequestOptions`

