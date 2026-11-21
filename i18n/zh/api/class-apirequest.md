---
title: APIRequest
outline: 2
---

# APIRequest

<Badge type="info" text="添加于: v1.16" />

暴露可用于 Web API 测试的 API。此类用于创建 [APIRequestContext](/api/class-apirequestcontext) 实例，该实例可用于发送 Web 请求。此类的实例可通过 [`playwright.request`](/api/class-playwright#playwright-request) 获取。更多信息请参阅 [APIRequestContext](/api/class-apirequestcontext)。

## 方法

### apiRequest.newContext() {#api-request-new-context}

<Badge type="info" text="添加于: v1.16" /> <Badge type="tip" text="异步" />

创建新的 [APIRequestContext](/api/class-apirequestcontext) 实例。

**参数**

- <a id="api-request-new-context-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-new-context-option-base-url"></a>`baseURL` `string` *(可选)*

    像 [`apiRequestContext.get()`](/api/class-apirequestcontext#api-request-context-get) 这样的方法通过使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数构建相应的 URL 时会考虑基础 URL。示例：
    * baseURL: `http://localhost:3000` 并发送请求到 `/bar.html` 结果为 `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` 并发送请求到 `./bar.html` 结果为 `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo`（没有尾部斜杠）并导航到 `./bar.html` 结果为 `http://localhost:3000/bar.html`
  - <a id="api-request-new-context-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(可选)* <Badge type="info" text="添加于: v1.46" />

    TLS 客户端认证允许服务器请求客户端证书并进行验证。

    **详情**

    一个客户端证书数组。每个证书对象必须同时具有 `certPath` 和 `keyPath`，或者单个 `pfxPath`，或者它们对应的直接值等价物（`cert` 和 `key`，或 `pfx`）。如果证书是加密的，则应提供 `passphrase` 属性。`origin` 属性应提供与证书有效的请求源完全匹配的值。

    客户端证书认证仅在提供至少一个客户端证书时才会激活。如果您想拒绝服务器发送的所有客户端证书，您需要提供一个 `origin` 与您计划访问的任何域都不匹配的客户端证书。

    ::: info
    在 macOS 上使用 WebKit 时，访问 `localhost` 将不会选择客户端证书。您可以通过将 `localhost` 替换为 `local.playwright` 来使其工作。
    :::

    - `origin` `string` <Badge type="info" text="添加于: v1.46" />

      证书有效的确切源。源包括 `https` 协议、主机名和可选的端口。
    - `certPath` `path` *(可选)* <Badge type="info" text="添加于: v1.46" />

      PEM 格式证书文件的路径。
    - `cert` `Buffer` *(可选)* <Badge type="info" text="添加于: v1.46" />

      PEM 格式证书的直接值。
    - `keyPath` `path` *(可选)* <Badge type="info" text="添加于: v1.46" />

      PEM 格式私钥文件的路径。
    - `key` `Buffer` *(可选)* <Badge type="info" text="添加于: v1.46" />

      PEM 格式私钥的直接值。
    - `pfxPath` `path` *(可选)* <Badge type="info" text="添加于: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链文件的路径。
    - `pfx` `Buffer` *(可选)* <Badge type="info" text="添加于: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链的直接值。
    - `passphrase` `string` *(可选)* <Badge type="info" text="添加于: v1.46" />

      私钥（PEM 或 PFX）的密码。
  - <a id="api-request-new-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(可选)*

    包含要随每个请求发送的额外 HTTP 头的对象。默认为无。
  - <a id="api-request-new-context-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)* <Badge type="info" text="添加于: v1.51" />

    是否在响应代码不是 2xx 和 3xx 时抛出异常。默认情况下，所有状态码都会返回响应对象。
  - <a id="api-request-new-context-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(可选)*

    用于 [HTTP 认证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的凭据。如果未指定源，则用户名和密码将在未授权响应时发送到任何服务器。

    传递数组以对不同的源使用不同的凭据。第一个匹配请求源的条目将被使用，没有源的条目匹配任何请求。

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(可选)*

      限制仅在特定源（scheme://host:port）上发送 http 凭据。
    - `send` `"unauthorized" | "always"` *(可选)*

      此选项仅适用于从相应 [APIRequestContext](/api/class-apirequestcontext) 发送的请求，不影响从浏览器发送的请求。`'always'` - 每次 API 请求都会发送带有基本认证凭据的 `Authorization` 头。`'unauthorized'` - 仅在收到带有 `WWW-Authenticate` 头的 401（未授权）响应时才发送凭据。默认为 `'unauthorized'`。
  - <a id="api-request-new-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-new-context-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="添加于: v1.52" />

    将自动跟随的最大请求重定向次数。如果超过该数量将抛出错误。默认为 `20`。传递 `0` 表示不跟随重定向。这可以为每个请求单独覆盖。
  - <a id="api-request-new-context-option-proxy"></a>`proxy` `Object` *(可选)*

    网络代理设置。

    - `server` `string`

      用于所有请求的代理。支持 HTTP 和 SOCKS 代理，例如 `http://myproxy.com:3128` 或 `socks5://myproxy.com:3128`。短格式 `myproxy.com:3128` 被视为 HTTP 代理。
    - `bypass` `string` *(可选)*

      绕过代理的可选逗号分隔域名，例如 `".com, chromium.org, .domain.com"`。
    - `username` `string` *(可选)*

      HTTP 代理需要认证时使用的可选用户名。
    - `password` `string` *(可选)*

      HTTP 代理需要认证时使用的可选密码。
  - <a id="api-request-new-context-option-storage-state"></a>`storageState` `path | Object` *(可选)*

    使用给定的存储状态填充上下文。此选项可用于使用通过 [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 或 [`apiRequestContext.storageState()`](/api/class-apirequestcontext#api-request-context-storage-state) 获取的登录信息初始化上下文。可以是保存存储的文件路径，或者是 [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 或 [`apiRequestContext.storageState()`](/api/class-apirequestcontext#api-request-context-storage-state) 方法返回的值。

    - `cookies` `Array<Object>`

      - `name` `string`
      - `value` `string`
      - `domain` `string`
      - `path` `string`
      - `expires` `float`

        Unix 时间戳，单位为秒。
      - `httpOnly` `boolean`
      - `secure` `boolean`
      - `sameSite` `"Strict" | "Lax" | "None"`
    - `origins` `Array<Object>`

      - `origin` `string`
      - `localStorage` `Array<Object>`

        - `name` `string`
        - `value` `string`
  - <a id="api-request-new-context-option-timeout"></a>`timeout` `float` *(可选)*

    等待响应的最大时间（毫秒）。默认为 `30000`（30 秒）。传递 `0` 禁用超时。
  - <a id="api-request-new-context-option-user-agent"></a>`userAgent` `string` *(可选)*

    在此上下文中使用的特定用户代理。

**返回值**

- `Promise<APIRequestContext>`
