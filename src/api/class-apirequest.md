---
title: APIRequest
outline: 2
---

# APIRequest

<Badge type="info" text="Added in: v1.16" />

Exposes API that can be used for the Web API testing. This class is used for creating
[APIRequestContext](/api/class-apirequestcontext) instance which in turn can be used for sending web requests. An instance
of this class can be obtained via [`playwright.request`](/api/class-playwright#playwright-request). For more information
see [APIRequestContext](/api/class-apirequestcontext).

## Methods

### apiRequest.newContext() {#api-request-new-context}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Creates new instances of [APIRequestContext](/api/class-apirequestcontext).

**Arguments**

- <a id="api-request-new-context-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-new-context-option-base-url"></a>`baseURL` `string` *(optional)*

    Methods like [`apiRequestContext.get()`](/api/class-apirequestcontext#api-request-context-get) take the base URL into consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Examples:
    * baseURL: `http://localhost:3000` and sending request to `/bar.html` results in `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` and sending request to `./bar.html` results in `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in `http://localhost:3000/bar.html`
  - <a id="api-request-new-context-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(optional)* <Badge type="info" text="Added in: v1.46" />

    TLS Client Authentication allows the server to request a client certificate and verify it.

    **Details**

    An array of client certificates to be used. Each certificate object must have either both `certPath` and `keyPath`, a single `pfxPath`, or their corresponding direct value equivalents (`cert` and `key`, or `pfx`). Optionally, `passphrase` property should be provided if the certificate is encrypted. The `origin` property should be provided with an exact match to the request origin that the certificate is valid for.

    Client certificate authentication is only active when at least one client certificate is provided. If you want to reject all client certificates sent by the server, you need to provide a client certificate with an `origin` that does not match any of the domains you plan to visit.

    ::: info
    When using WebKit on macOS, accessing `localhost` will not pick up client certificates. You can make it work by replacing `localhost` with `local.playwright`.
    :::

    - `origin` `string` <Badge type="info" text="Added in: v1.46" />

      Exact origin that the certificate is valid for. Origin includes `https` protocol, a hostname and optionally a port.
    - `certPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the certificate in PEM format.
    - `cert` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the certificate in PEM format.
    - `keyPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the private key in PEM format.
    - `key` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the private key in PEM format.
    - `pfxPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the PFX or PKCS12 encoded private key and certificate chain.
    - `pfx` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the PFX or PKCS12 encoded private key and certificate chain.
    - `passphrase` `string` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Passphrase for the private key (PEM or PFX).
  - <a id="api-request-new-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="api-request-new-context-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-new-context-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(optional)*

    Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
    If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

    Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(optional)*

      Restrain sending http credentials on specific origin (scheme://host:port).
    - `send` `"unauthorized" | "always"` *(optional)*

      This option only applies to the requests sent from corresponding [APIRequestContext](/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="api-request-new-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-new-context-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.52" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects. This can be overwritten for each request individually.
  - <a id="api-request-new-context-option-proxy"></a>`proxy` `Object` *(optional)*

    Network proxy settings.

    - `server` `string`

      Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example
      `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP
      proxy.
    - `bypass` `string` *(optional)*

      Optional comma-separated domains to bypass proxy, for example `".com, chromium.org,
      .domain.com"`.
    - `username` `string` *(optional)*

      Optional username to use if HTTP proxy requires authentication.
    - `password` `string` *(optional)*

      Optional password to use if HTTP proxy requires authentication.
  - <a id="api-request-new-context-option-storage-state"></a>`storageState` `path | Object` *(optional)*

    Populates context with given storage state. This option can be used to initialize context with logged-in information
    obtained via [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) or [`apiRequestContext.storageState()`](/api/class-apirequestcontext#api-request-context-storage-state). Either a path to the
    file with saved storage, or the value returned by one of [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) or
    [`apiRequestContext.storageState()`](/api/class-apirequestcontext#api-request-context-storage-state) methods.

    - `cookies` `Array<Object>`

      - `name` `string`
      - `value` `string`
      - `domain` `string`
      - `path` `string`
      - `expires` `float`

        Unix time in seconds.
      - `httpOnly` `boolean`
      - `secure` `boolean`
      - `sameSite` `"Strict" | "Lax" | "None"`
    - `origins` `Array<Object>`

      - `origin` `string`
      - `localStorage` `Array<Object>`

        - `name` `string`
        - `value` `string`
  - <a id="api-request-new-context-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the response. Defaults to
    `30000` (30 seconds). Pass `0` to disable timeout.
  - <a id="api-request-new-context-option-user-agent"></a>`userAgent` `string` *(optional)*

    Specific user agent to use in this context.

**Returns**

- `Promise<APIRequestContext>`

