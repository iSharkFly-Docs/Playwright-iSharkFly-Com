---
title: BrowserType
outline: 2
---

# BrowserType

<Badge type="info" text="Added in: v1.8" />

BrowserType 提供了启动特定浏览器实例或连接到现有实例的方法。以下是使用 Playwright 进行自动化的典型示例：

```js
const { chromium } = require('playwright');  // 或 'firefox' 或 'webkit'。

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  // 其他操作...
  await browser.close();
})();
```

## Methods

### browserType.connect() {#browser-type-connect}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法将 Playwright 连接到通过 Node.js 中的 `BrowserType.launchServer` 创建的现有浏览器实例。

::: info
连接的 Playwright 实例的主版本号和次版本号需要与启动浏览器的 Playwright 版本匹配（1.2.3 → 与 1.2.x 兼容）。
:::

**Arguments**

- <a id="browser-type-connect-option-endpoint"></a>`endpoint` `string` <Badge type="info" text="Added in: v1.10" />

  要连接的 Playwright 浏览器 websocket 端点。您可以通过 `BrowserServer.wsEndpoint` 获取此端点。
- <a id="browser-type-connect-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-connect-option-expose-network"></a>`exposeNetwork` `string` *(optional)* <Badge type="info" text="Added in: v1.37" />

    此选项将连接客户端上可用的网络暴露给正在连接的浏览器。由逗号分隔的规则列表组成。

    可用规则：
    1. 主机名模式，例如：`example.com`、`*.org:99`、`x.*.y.com`、`*foo.org`。
    1. IP 字面量，例如：`127.0.0.1`、`0.0.0.0:99`、`[::1]`、`[0:0::1]:99`。
    1. `<loopback>` 匹配本地回环接口：`localhost`、`*.localhost`、`127.0.0.1`、`[::1]`。

    一些常见示例：
    1. `"*"` 暴露所有网络。
    1. `"<loopback>"` 暴露 localhost 网络。
    1. `"*.test.internal-domain,*.staging.internal-domain,<loopback>"` 暴露测试/预发布部署和 localhost。
  - <a id="browser-type-connect-option-headers"></a>`headers` `Object<string, string>` *(optional)* <Badge type="info" text="Added in: v1.11" />

    与 web socket 连接请求一起发送的附加 HTTP 头。可选。
  - <a id="browser-type-connect-option-launch-options"></a>`launchOptions` `LaunchOptions` *(optional)* <Badge type="info" text="Added in: v1.66" />

    用于启动浏览器的选项，与传递给 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 的选项相同。仅在服务器为每个连接启动浏览器时适用。服务器会忽略不允许的选项。
  - <a id="browser-type-connect-option-slow-mo"></a>`slowMo` `float` *(optional)* <Badge type="info" text="Added in: v1.10" />

    将 Playwright 操作减慢指定的毫秒数。这对于观察正在发生的事情很有用。默认为 0。
  - <a id="browser-type-connect-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.10" />

    等待建立连接的最大时间（毫秒）。默认为 `0`（无超时）。

**Returns**

- `Promise<Browser>`


### browserType.connectOverCDP() {#browser-type-connect-over-cdp}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

此方法使用 Chrome DevTools Protocol 将 Playwright 连接到现有浏览器实例。

可通过 [`browser.contexts()`](/api/class-browser#browser-contexts) 访问默认浏览器上下文。

::: info
通过 Chrome DevTools Protocol 连接仅支持基于 Chromium 的浏览器。
:::

::: info
此连接的保真度明显低于通过 [`browserType.connect()`](/api/class-browsertype#browser-type-connect) 的 Playwright 协议连接。如果您遇到问题或尝试使用高级功能，您可能需要使用 [`browserType.connect()`](/api/class-browsertype#browser-type-connect)。
:::

::: warning
Playwright 维护着一个精心策划的浏览器启动参数列表。如果您在没有 Playwright 的情况下启动浏览器且未传递完全相同的参数，则连接到浏览器后，某些 Playwright 功能可能会损坏。
:::

**Usage**

```js
const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
const defaultContext = browser.contexts()[0];
const page = defaultContext.pages()[0];
```

**Arguments**

- <a id="browser-type-connect-over-cdp-option-endpoint-url"></a>`endpointURL` `string` <Badge type="info" text="Added in: v1.11" />

  要连接的 CDP websocket 端点或 http url。例如 `http://localhost:9222/` 或 `ws://127.0.0.1:9222/devtools/browser/387adf4c-243f-4051-a181-46798f4a46f4`。

  或者，指示连接到哪个正在运行的浏览器的 URL：
  * `remote-debugging://<channel>` - 启用了远程调试的浏览器，例如 `remote-debugging://msedge`。可选的 `userDataDir` 参数是浏览器的用户数据目录，当它不是默认目录时：`remote-debugging://chrome?userDataDir=/path/to/data`。单独的频道名称如 `chrome` 等同于 `remote-debugging://chrome`。
  * `extension://<channel>/<profile directory>` - 通过 [Playwright Extension](https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm) 访问浏览器配置文件的标签页，例如 `extension://chrome/Profile 1`。Playwright 在该配置文件中打开扩展的连接页面，用户选择要共享的标签页。如果没有配置文件目录，Playwright 使用 `Default` 配置文件。可选参数有 `userDataDir`（当浏览器的用户数据目录不是默认目录时）和 `executablePath`（当浏览器可执行文件不在标准位置时）：`extension://chromium?executablePath=/path/to/chrome&userDataDir=/path/to/data`。在 [`headers`](/api/class-browsertype#browser-type-connect-over-cdp-option-headers) 中传递此连接的其他选项。

  `userDataDir` 和 `executablePath` 的值必须进行 URL 编码，例如使用 `encodeURIComponent` 或 `URLSearchParams`。频道是浏览器频道名称，如 `chrome`、`chrome-beta` 或 `msedge`。频道的默认用户数据目录是浏览器保存其数据的位置。在 Linux 上，当设置了 `CHROME_USER_DATA_DIR` 时 Playwright 使用它。否则，它使用 `CHROME_CONFIG_HOME`，然后是 `XDG_CONFIG_HOME`，然后是 `~/.config` 来定位该目录。
- <a id="browser-type-connect-over-cdp-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-connect-over-cdp-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)* <Badge type="info" text="Added in: v1.61" />

    如果指定，浏览器产物（如跟踪和下载）将保存到此目录。
  - <a id="browser-type-connect-over-cdp-option-endpoint-url"></a>`endpointURL` `string` *(optional)* <Badge type="info" text="Added in: v1.14" />
  - <a id="browser-type-connect-over-cdp-option-headers"></a>`headers` `Object<string, string>` *(optional)* <Badge type="info" text="Added in: v1.11" />

    与连接请求一起发送的附加 HTTP 头。可选。

    当 [`endpointURL`](/api/class-browsertype#browser-type-connect-over-cdp-option-endpoint-url) 是扩展 URL（如 `extension://chrome`）时，头不会被发送。它们是连接的选项：
    * `x-playwright-extension-token` - 扩展的令牌。有了令牌，用户不必批准连接。没有令牌，用户必须在 [`timeout`](/api/class-browsertype#browser-type-connect-over-cdp-option-timeout) 过期前批准连接，因此请将其设置为给用户足够时间的值。
    * `x-playwright-extension-client-name` - 扩展向用户显示的客户端名称。
    * `x-playwright-extension-tab-group` - 传递 `false` 以使标签页不在标签组中。
    * `x-playwright-extension-tab-group-title` - 标签组的标题。
    * `x-playwright-extension-tab-group-color` - 标签组的颜色：`green`、`blue`、`purple`、`orange`、`pink`、`cyan`、`yellow` 或 `red`。
    * `x-playwright-extension-background` - 传递 `true` 以使标签页不成为活动状态。
  - <a id="browser-type-connect-over-cdp-option-is-local"></a>`isLocal` `boolean` *(optional)* <Badge type="info" text="Added in: v1.58" />

    告诉 Playwright 它在与 CDP 服务器相同的主机上运行。这将启用某些依赖于 Playwright 和浏览器之间文件系统相同的优化。
  - <a id="browser-type-connect-over-cdp-option-no-defaults"></a>`noDefaults` `boolean` *(optional)* <Badge type="info" text="Added in: v1.60" />

    当为 true 时，Playwright 将不会对现有的默认浏览器上下文应用其默认覆盖。
    具体来说，[`acceptDownloads`](/api/class-browser#browser-new-context-option-accept-downloads) 和字体系列保持浏览器的设置，不启用焦点模拟，且不应用媒体模拟选项（如 [`colorScheme`](/api/class-browser#browser-new-context-option-color-scheme)、[`reducedMotion`](/api/class-browser#browser-new-context-option-reduced-motion)、[`forcedColors`](/api/class-browser#browser-new-context-option-forced-colors) 和 [`contrast`](/api/class-browser#browser-new-context-option-contrast)）。这对于附加到用户日常使用的浏览器非常有用，在这种情况下，这些覆盖会干扰现有的浏览器状态。通过 [`browser.newContext()`](/api/class-browser#browser-new-context) 创建的新上下文不受影响。默认为 `false`。
  - <a id="browser-type-connect-over-cdp-option-slow-mo"></a>`slowMo` `float` *(optional)* <Badge type="info" text="Added in: v1.11" />

    将 Playwright 操作减慢指定的毫秒数。这对于观察正在发生的事情很有用。默认为 0。
  - <a id="browser-type-connect-over-cdp-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.11" />

    等待建立连接的最大时间（毫秒）。默认为 `30000`（30 秒）。传递 `0` 禁用超时。

**Returns**

- `Promise<Browser>`


### browserType.executablePath() {#browser-type-executable-path}

<Badge type="info" text="Added in: v1.8" />

Playwright 期望找到捆绑浏览器可执行文件的路径。

**Returns**

- `string`


### browserType.launch() {#browser-type-launch}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回浏览器实例。

**Usage**

您可以使用 [`ignoreDefaultArgs`](/api/class-browsertype#browser-type-launch-option-ignore-default-args) 从默认参数中过滤掉 `--mute-audio`：

```js
const browser = await chromium.launch({  // 或 'firefox' 或 'webkit'。
  ignoreDefaultArgs: ['--mute-audio']
});
```

> **仅限 Chromium** Playwright 也可用于控制 Google Chrome 或 Microsoft Edge 浏览器，但它与其捆绑的 Chromium 版本配合效果最佳。不保证它能与任何其他版本一起工作。请极其谨慎地使用 [`executablePath`](/api/class-browsertype#browser-type-launch-option-executable-path) 选项。
>
> 如果首选 Google Chrome（而非 Chromium），建议使用 [Chrome Canary](https://www.google.com/chrome/browser/canary.html) 或 [Dev Channel](https://www.chromium.org/getting-involved/dev-channel) 版本。
>
> 像 Google Chrome 和 Microsoft Edge 这样的标准浏览器适用于需要专有媒体编解码器进行视频播放的测试。请参阅[这篇文章](https://www.howtogeek.com/202825/what%E2%80%99s-the-difference-between-chromium-and-chrome/)了解 Chromium 和 Chrome 之间的其他差异。[这篇文章](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/chromium_browser_vs_google_chrome.md)描述了 Linux 用户的一些差异。

**Arguments**

- <a id="browser-type-launch-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-launch-option-args"></a>`args` `Array<string>` *(optional)*

    ::: warning
    使用自定义浏览器参数风险自负，因为其中一些可能会破坏 Playwright 功能。
    :::

    传递给浏览器实例的附加参数。Chromium 标志列表可在[这里](https://peter.sh/experiments/chromium-command-line-switches/)找到。
  - <a id="browser-type-launch-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)*

    如果指定，产物（跟踪、视频、下载、HAR 文件等）将保存到此目录。当浏览器关闭时，该目录不会被清理。如果未指定，则使用临时目录，并在浏览器关闭时清理。
  - <a id="browser-type-launch-option-channel"></a>`channel` `string` *(optional)*

    浏览器分发渠道。

    使用 "chromium" [选择新的无头模式](../browsers.md#chromium-new-headless-mode)。

    使用 "chrome"、"chrome-beta"、"chrome-dev"、"chrome-canary"、"msedge"、"msedge-beta"、"msedge-dev" 或 "msedge-canary" 来使用品牌版的 [Google Chrome 和 Microsoft Edge](../browsers.md#google-chrome--microsoft-edge)。
  - <a id="browser-type-launch-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(optional)*

    启用 Chromium 沙箱。默认为 `false`。
  - <a id="browser-type-launch-option-downloads-path"></a>`downloadsPath` `path` *(optional)*

    如果指定，已接受的下载将下载到此目录。否则，将创建临时目录，并在浏览器关闭时删除。无论哪种情况，当创建它们的浏览器上下文关闭时，下载都会被删除。
  - <a id="browser-type-launch-option-env"></a>`env` `Object<string, string | undefined>` *(optional)*
  - <a id="browser-type-launch-option-executable-path"></a>`executablePath` `path` *(optional)*

    要运行的浏览器可执行文件的路径，而不是捆绑的。如果 [`executablePath`](/api/class-browsertype#browser-type-launch-option-executable-path) 是相对路径，则相对于当前工作目录解析。请注意，Playwright 仅与捆绑的 Chromium、Firefox 或 WebKit 配合使用，使用风险自负。
  - <a id="browser-type-launch-option-firefox-user-prefs"></a>`firefoxUserPrefs` `Object<string, string | float | boolean>` *(optional)*

    Firefox 用户首选项。在 [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox) 了解更多关于 Firefox 用户首选项的信息。

    您还可以通过 `PLAYWRIGHT_FIREFOX_POLICIES_JSON` 环境变量提供自定义 [`policies.json` 文件](https://mozilla.github.io/policy-templates/)的路径。
  - <a id="browser-type-launch-option-handle-sighup"></a>`handleSIGHUP` `boolean` *(optional)*

    在 SIGHUP 信号时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-option-handle-sigint"></a>`handleSIGINT` `boolean` *(optional)*

    在 Ctrl-C 时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-option-handle-sigterm"></a>`handleSIGTERM` `boolean` *(optional)*

    在 SIGTERM 信号时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-option-headless"></a>`headless` `boolean` *(optional)*

    是否以无头模式运行浏览器。更多详情请参阅 [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) 和 [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/)。默认为 `true`。
  - <a id="browser-type-launch-option-ignore-default-args"></a>`ignoreDefaultArgs` `boolean | Array<string>` *(optional)*

    如果为 `true`，Playwright 不会传递其自己的配置参数，只使用 [`args`](/api/class-browsertype#browser-type-launch-option-args) 中的参数。如果给出数组，则过滤掉给定的默认参数。危险选项；谨慎使用。默认为 `false`。
  - <a id="browser-type-launch-option-logger"></a>`logger` `Logger` *(optional)*

    Playwright 日志记录的日志接收器。
  - <a id="browser-type-launch-option-proxy"></a>`proxy` `Object` *(optional)*

    网络代理设置。

    - `server` `string`

      用于所有请求的代理。支持 HTTP 和 SOCKS 代理，例如 `http://myproxy.com:3128` 或 `socks5://myproxy.com:3128`。简写形式 `myproxy.com:3128` 被视为 HTTP 代理。
    - `bypass` `string` *(optional)*

      可选的逗号分隔域名列表，用于绕过代理，例如 `".com, chromium.org, .domain.com"`。
    - `username` `string` *(optional)*

      如果 HTTP 代理需要认证，可选的用户名。
    - `password` `string` *(optional)*

      如果 HTTP 代理需要认证，可选的密码。
  - <a id="browser-type-launch-option-slow-mo"></a>`slowMo` `float` *(optional)*

    将 Playwright 操作减慢指定的毫秒数。这对于观察正在发生的事情很有用。
  - <a id="browser-type-launch-option-timeout"></a>`timeout` `float` *(optional)*

    等待浏览器实例启动的最大时间（毫秒）。默认为 `180000`（3 分钟）。传递 `0` 禁用超时。
  - <a id="browser-type-launch-option-traces-dir"></a>`tracesDir` `path` *(optional)*

    如果指定，跟踪将保存到此目录。

**Returns**

- `Promise<Browser>`


### browserType.launchPersistentContext() {#browser-type-launch-persistent-context}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回持久浏览器上下文实例。

启动使用位于 [`userDataDir`](/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir) 的持久存储的浏览器并返回唯一的上下文。关闭此上下文将自动关闭浏览器。

**Arguments**

- <a id="browser-type-launch-persistent-context-option-user-data-dir"></a>`userDataDir` `path`

  用户数据目录的路径，用于存储浏览器会话数据，如 cookie 和本地存储。传递空字符串以创建临时目录。

  更多详情请参阅 [Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md#introduction) 和 [Firefox](https://wiki.mozilla.org/Firefox/CommandLineOptions#User_profile)。Chromium 的用户数据目录是 `chrome://version` 中看到的"配置文件路径"的**父**目录。

  请注意，浏览器不允许使用相同的用户数据目录启动多个实例。

  ::: warning
  Chromium/Chrome：由于最近的 Chrome 策略变更，不支持自动化默认 Chrome 用户配置文件。将 `userDataDir` 指向 Chrome 的主"用户数据"目录（用于常规浏览的配置文件）可能导致页面无法加载或浏览器退出。请创建并使用单独的目录（例如，空文件夹）作为自动化配置文件。详情请参阅 https://developer.chrome.com/blog/remote-debugging-port。
  :::
- <a id="browser-type-launch-persistent-context-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-launch-persistent-context-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)*

    是否自动下载所有附件。默认为 `true`，接受所有下载。
  - <a id="browser-type-launch-persistent-context-option-args"></a>`args` `Array<string>` *(optional)*

    ::: warning
    使用自定义浏览器参数风险自负，因为其中一些可能会破坏 Playwright 功能。
    :::

    传递给浏览器实例的附加参数。Chromium 标志列表可在[这里](https://peter.sh/experiments/chromium-command-line-switches/)找到。
  - <a id="browser-type-launch-persistent-context-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)*

    如果指定，产物（跟踪、视频、下载、HAR 文件等）将保存到此目录。当浏览器关闭时，该目录不会被清理。如果未指定，则使用临时目录，并在浏览器关闭时清理。
  - <a id="browser-type-launch-persistent-context-option-base-url"></a>`baseURL` `string` *(optional)*

    当使用 [`page.goto()`](/api/class-page#page-goto)、[`page.route()`](/api/class-page#page-route)、[`page.waitForURL()`](/api/class-page#page-wait-for-url)、[`page.waitForRequest()`](/api/class-page#page-wait-for-request) 或 [`page.waitForResponse()`](/api/class-page#page-wait-for-response) 时，通过使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数构建相应的 URL 时会考虑基础 URL。默认未设置。示例：
    * baseURL: `http://localhost:3000` 并导航到 `/bar.html` 结果为 `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` 并导航到 `./bar.html` 结果为 `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo`（无尾随斜杠）并导航到 `./bar.html` 结果为 `http://localhost:3000/bar.html`
  - <a id="browser-type-launch-persistent-context-option-bypass-csp"></a>`bypassCSP` `boolean` *(optional)*

    切换绕过页面的内容安全策略。默认为 `false`。
  - <a id="browser-type-launch-persistent-context-option-channel"></a>`channel` `string` *(optional)*

    浏览器分发渠道。

    使用 "chromium" [选择新的无头模式](../browsers.md#chromium-new-headless-mode)。

    使用 "chrome"、"chrome-beta"、"chrome-dev"、"chrome-canary"、"msedge"、"msedge-beta"、"msedge-dev" 或 "msedge-canary" 来使用品牌版的 [Google Chrome 和 Microsoft Edge](../browsers.md#google-chrome--microsoft-edge)。
  - <a id="browser-type-launch-persistent-context-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(optional)*

    启用 Chromium 沙箱。默认为 `false`。
  - <a id="browser-type-launch-persistent-context-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(optional)* <Badge type="info" text="Added in: v1.46" />

    TLS 客户端认证允许服务器请求客户端证书并验证它。

    **详情**

    要使用的客户端证书数组。每个证书对象必须有 `certPath` 和 `keyPath`，或单个 `pfxPath`，或其相应的直接值等效项（`cert` 和 `key`，或 `pfx`）。可选地，如果证书已加密，应提供 `passphrase` 属性。`origin` 属性应提供与证书有效的请求源完全匹配。

    客户端证书认证仅在至少提供一个客户端证书时才处于活动状态。如果您想拒绝服务器发送的所有客户端证书，您需要提供一个 `origin` 与您计划访问的任何域都不匹配的客户端证书。

    ::: info
    在 macOS 上使用 WebKit 时，访问 `localhost` 不会获取客户端证书。您可以通过将 `localhost` 替换为 `local.playwright` 使其工作。
    :::

    - `origin` `string` <Badge type="info" text="Added in: v1.46" />

      证书有效的确切源。源包括 `https` 协议、主机名和可选的端口。
    - `certPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式证书文件的路径。
    - `cert` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式证书的直接值。
    - `keyPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式私钥文件的路径。
    - `key` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式私钥的直接值。
    - `pfxPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链文件的路径。
    - `pfx` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链的直接值。
    - `passphrase` `string` *(optional)* <Badge type="info" text="Added in: v1.46" />

      私钥（PEM 或 PFX）的密码。
  - <a id="browser-type-launch-persistent-context-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(optional)*

    模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体特性，支持的值为 `'light'` 和 `'dark'`。更多详情请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'light'`。
  - <a id="browser-type-launch-persistent-context-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)*

    模拟 `'prefers-contrast'` 媒体特性，支持的值为 `'no-preference'`、`'more'`。更多详情请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="browser-type-launch-persistent-context-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(optional)*

    指定设备缩放因子（可视为 dpr）。默认为 `1`。了解更多关于[使用设备缩放因子模拟设备](../emulation.md#devices)。
  - <a id="browser-type-launch-persistent-context-option-downloads-path"></a>`downloadsPath` `path` *(optional)*

    如果指定，已接受的下载将下载到此目录。否则，将创建临时目录，并在浏览器关闭时删除。无论哪种情况，当创建它们的浏览器上下文关闭时，下载都会被删除。
  - <a id="browser-type-launch-persistent-context-option-env"></a>`env` `Object<string, string | undefined>` *(optional)*
  - <a id="browser-type-launch-persistent-context-option-executable-path"></a>`executablePath` `path` *(optional)*

    要运行的浏览器可执行文件的路径，而不是捆绑的。如果 [`executablePath`](/api/class-browsertype#browser-type-launch-persistent-context-option-executable-path) 是相对路径，则相对于当前工作目录解析。请注意，Playwright 仅与捆绑的 Chromium、Firefox 或 WebKit 配合使用，使用风险自负。
  - <a id="browser-type-launch-persistent-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    包含要与每个请求一起发送的附加 HTTP 头的对象。默认为无。
  - <a id="browser-type-launch-persistent-context-option-firefox-user-prefs"></a>`firefoxUserPrefs` `Object<string, string | float | boolean>` *(optional)* <Badge type="info" text="Added in: v1.40" />

    Firefox 用户首选项。在 [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox) 了解更多关于 Firefox 用户首选项的信息。

    您还可以通过 `PLAYWRIGHT_FIREFOX_POLICIES_JSON` 环境变量提供自定义 [`policies.json` 文件](https://mozilla.github.io/policy-templates/)的路径。
  - <a id="browser-type-launch-persistent-context-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)*

    模拟 `'forced-colors'` 媒体特性，支持的值为 `'active'`、`'none'`。更多详情请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'none'`。
  - <a id="browser-type-launch-persistent-context-option-geolocation"></a>`geolocation` `Object` *(optional)*

    - `latitude` `float`

      介于 -90 和 90 之间的纬度。
    - `longitude` `float`

      介于 -180 和 180 之间的经度。
    - `accuracy` `float` *(optional)*

      非负的精度值。默认为 `0`。
  - <a id="browser-type-launch-persistent-context-option-handle-sighup"></a>`handleSIGHUP` `boolean` *(optional)*

    在 SIGHUP 信号时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-persistent-context-option-handle-sigint"></a>`handleSIGINT` `boolean` *(optional)*

    在 Ctrl-C 时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-persistent-context-option-handle-sigterm"></a>`handleSIGTERM` `boolean` *(optional)*

    在 SIGTERM 信号时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-persistent-context-option-has-touch"></a>`hasTouch` `boolean` *(optional)*

    指定视口是否支持触摸事件。默认为 false。了解更多关于[移动模拟](../emulation.md#devices)。
  - <a id="browser-type-launch-persistent-context-option-headless"></a>`headless` `boolean` *(optional)*

    是否以无头模式运行浏览器。更多详情请参阅 [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) 和 [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/)。默认为 `true`。
  - <a id="browser-type-launch-persistent-context-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(optional)*

    [HTTP 认证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的凭据。
    如果未指定源，则在收到未授权响应时将用户名和密码发送到任何服务器。

    传递数组以对不同的源使用不同的凭据。匹配请求源的第一个条目被使用，没有源的条目匹配任何请求。

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(optional)*

      限制在特定源（scheme://host:port）上发送 http 凭据。
    - `send` `"unauthorized" | "always"` *(optional)*

      此选项仅适用于从相应的 [APIRequestContext](/api/class-apirequestcontext) 发送的请求，不影响从浏览器发送的请求。`'always'` - `Authorization` 头带有基本认证凭据将随每个 API 请求发送。`'unauthorized'` - 仅在收到带有 `WWW-Authenticate` 头的 401（未授权）响应时发送凭据。默认为 `'unauthorized'`。
  - <a id="browser-type-launch-persistent-context-option-ignore-default-args"></a>`ignoreDefaultArgs` `boolean | Array<string>` *(optional)*

    如果为 `true`，Playwright 不会传递其自己的配置参数，只使用 [`args`](/api/class-browsertype#browser-type-launch-persistent-context-option-args) 中的参数。如果给出数组，则过��掉给定的默认参数。危险选项；谨慎使用。默认为 `false`。
  - <a id="browser-type-launch-persistent-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="browser-type-launch-persistent-context-option-is-mobile"></a>`isMobile` `boolean` *(optional)*

    是否考虑 `meta viewport` 标签并启用触摸事件。isMobile 是设备的一部分，因此您实际上不需要手动设置它。默认为 `false`。了解更多关于[移动模拟](../emulation.md#ismobile)。
  - <a id="browser-type-launch-persistent-context-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(optional)*

    是否在上下文中启用 JavaScript。默认为 `true`。了解更多关于[禁用 JavaScript](../emulation.md#javascript-enabled)。
  - <a id="browser-type-launch-persistent-context-option-locale"></a>`locale` `string` *(optional)*

    指定用户区域设置，例如 `en-GB`、`de-DE` 等。区域设置将影响 `navigator.language` 值、`Accept-Language` 请求头值以及数字和日期格式规则。默认为系统默认区域设置。在我们的[模拟指南](../emulation.md#locale--timezone)中了解更多关于模拟的信息。
  - <a id="browser-type-launch-persistent-context-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(optional)*

    此上下文中的定位器是否只查找[可见](../actionability.md#visible)元素。默认为 `false`。

    启用后，Playwright 应用两条规则：
    1. 定位器找到的元素必须可见。操作、断言和查询的行为就像在定位器链末尾调用了 [`locator.visible()`](/api/class-locator#locator-visible)。
    1. [`locator.first()`](/api/class-locator#locator-first)、[`locator.last()`](/api/class-locator#locator-last) 和 [`locator.nth()`](/api/class-locator#locator-nth) 在可见元素中选择。它们的行为就像在它们之前立即调用了 [`locator.visible()`](/api/class-locator#locator-visible)。

    ```js
    // <div hidden>One</div> <div>Two</div> <div>Three</div>
    await expect(page.locator('div')).toHaveCount(2);
    await expect(page.locator('div').first()).toHaveText('Two');
    await expect(page.locator('div').last()).toHaveText('Three');
    ```

    显式的可见性过滤器始终具有优先级。Playwright 不会在已有过滤器的位置添加自己的过滤器。例如，`page.locator('div').filter({ visible: false }).first()` 查找第一个隐藏元素。

    定位器链的所有其他部分不会被过滤。在 `page.locator('section').getByRole('button')` 中，按钮必须可见，但 section 可以按照[可见性](../actionability.md#visible)规则隐藏，例如因为它的尺寸为零。同样的规则适用于 [`locator.filter()`](/api/class-locator#locator-filter)、[`locator.and()`](/api/class-locator#locator-and) 和 [`locator.or()`](/api/class-locator#locator-or) 的内部定位器：只有第二条规则适用于它们。

    此选项不会更改 [`page.getByRole()`](/api/class-page#page-get-by-role) 的无障碍规则或基于选择器的方法（如 [`page.$()`](/api/class-page#page-query-selector)）的行为。
  - <a id="browser-type-launch-persistent-context-option-logger"></a>`logger` `Logger` *(optional)*

    Playwright 日志记录的日志接收器。
  - <a id="browser-type-launch-persistent-context-option-offline"></a>`offline` `boolean` *(optional)*

    是否模拟网络离线。默认为 `false`。了解更多关于[网络模拟](../emulation.md#offline)。
  - <a id="browser-type-launch-persistent-context-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    要授予此上下文中所有页面的权限列表。更多详情请参阅 [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions)。默认为无。
  - <a id="browser-type-launch-persistent-context-option-proxy"></a>`proxy` `Object` *(optional)*

    网络代理设置。

    - `server` `string`

      用于所有请求的代理。支持 HTTP 和 SOCKS 代理，例如 `http://myproxy.com:3128` 或 `socks5://myproxy.com:3128`。简写形式 `myproxy.com:3128` 被视为 HTTP 代理。
    - `bypass` `string` *(optional)*

      可选的逗号分隔域名列表，用于绕过代理，例如 `".com, chromium.org, .domain.com"`。
    - `username` `string` *(optional)*

      如果 HTTP 代理需要认证，可选的用户名。
    - `password` `string` *(optional)*

      如果 HTTP 代理需要认证，可选的密码。
  - <a id="browser-type-launch-persistent-context-option-record-har"></a>`recordHar` `Object` *(optional)*

    启用将所有页面的 [HAR](http://www.softwareishard.com/blog/har-12-spec) 记录到 `recordHar.path` 文件。如果未指定，则不记录 HAR。请确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存 HAR。

    - `omitContent` `boolean` *(optional)*

      可选设置，用于控制是否从 HAR 中省略请求内容。默认为 `false`。已弃用，请改用 `content` 策略。
    - `content` `"omit" | "embed" | "attach"` *(optional)*

      可选设置，用于控制资源内容管理。如果指定 `omit`，则不持久化内容。如果指定 `attach`，资源将作为单独的文件或 ZIP 存档中的条目持久化。如果指定 `embed`，内容将按 HAR 规范内联存储在 HAR 文件中。对于 `.zip` 输出文件默认为 `attach`，对于所有其他文件扩展名默认为 `embed`。
    - `path` `path`

      写入 HAR 文件的文件系统路径。如果文件名以 `.zip` 结尾，默认使用 `content: 'attach'`。
    - `mode` `"full" | "minimal"` *(optional)*

      设置为 `minimal` 时，仅记录从 HAR 路由所需的信息。这省略了从 HAR 重放时不使用的大小、时间、页面、cookie、安全性和其他类型的 HAR 信息。默认为 `full`。
    - `urlFilter` `string | RegExp` *(optional)*

      用于过滤存储在 HAR 中的请求的 glob 或正则表达式模式。当通过上下文选项提供了 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 且传递的 URL 是路径时，它通过 [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数合并。默认为无。
  - <a id="browser-type-launch-persistent-context-option-record-video"></a>`recordVideo` `Object` *(optional)*

    启用将所有页面的视频录制到 `recordVideo.dir` 目录。如果未指定，则不录制视频。请确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存视频。

    - `dir` `path` *(optional)*

      存放视频的目录路径。如果未指定，视频将存储在 `artifactsDir`（请参阅 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 选项）。
    - `size` `Object` *(optional)*

      录制视频的可选尺寸。如果未指定，尺寸将等于缩小到 800x800 以内的 `viewport`。如果未显式配置 `viewport`，视频尺寸默认为 800x450。如果必要，每个页面的实际图片将缩小以适应指定的尺寸。

      - `width` `int`

        视频帧宽度。
      - `height` `int`

        视频帧高度。
    - `fps` `int` *(optional)*

      录制视频的每秒帧数。默认为 `25`。Firefox 和 WebKit 目前最多捕获每秒 25 帧。
    - `showActions` `Object` *(optional)*

      如果指定，在视频录制期间对交互元素启用视觉注释。

      - `duration` `float` *(optional)*

        每个注释显示的时长（毫秒）。默认为 `500`。
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(optional)*

        操作标题覆盖层的位置。默认为 `"top-right"`。
      - `fontSize` `int` *(optional)*

        操作标题的字体大小（像素）。默认为 `24`。已弃用，请改用 `style.title`。
      - `cursor` `"none" | "pointer"` *(optional)*

        为指针操作显示的光标装饰。`"pointer"`（默认）渲染一个鼠标指针，从前一个操作点动画到下一个。`"none"` 禁用光标装饰。
      - `style` `Object` *(optional)*

        操作装饰的样式。

        - `point` `string` *(optional)*

          居中于操作点的零尺寸标记的 CSS 声明。省略时不显示。
        - `highlight` `string` *(optional)*

          覆盖目标元素的框的 CSS 声明。省略时不显示。
        - `title` `string` *(optional)*

          操作标题的 CSS 声明。
  - <a id="browser-type-launch-persistent-context-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)*

    模拟 `'prefers-reduced-motion'` 媒体特性，支持的值为 `'reduce'`、`'no-preference'`。更多详情请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="browser-type-launch-persistent-context-option-screen"></a>`screen` `Object` *(optional)*

    模拟 web 页面中通过 `window.screen` 可用的一致窗口屏幕尺寸。仅在设置了 [`viewport`](/api/class-browsertype#browser-type-launch-persistent-context-option-viewport) 时使用。

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。
  - <a id="browser-type-launch-persistent-context-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(optional)*

    是否允许站点注册 Service Worker。默认为 `'allow'`。
    * `'allow'`：可以注册 [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。
    * `'block'`：Playwright 将阻止所有 Service Worker 的注册。
  - <a id="browser-type-launch-persistent-context-option-slow-mo"></a>`slowMo` `float` *(optional)*

    将 Playwright 操作减慢指定的毫秒数。这对于观察正在发生的事情很有用。
  - <a id="browser-type-launch-persistent-context-option-strict-selectors"></a>`strictSelectors` `boolean` *(optional)*

    如果设置为 true，则为此上下文启用严格选择器模式。在严格选择器模式下，所有暗示单个目标 DOM 元素的选择器操作在多个元素匹配选择器时会抛出错误。此选项不影响任何 Locator API（Locators 始终是严格的）。默认为 `false`。请参阅 [Locator](/api/class-locator) 了解更多关于严格模式的信息。
  - <a id="browser-type-launch-persistent-context-option-timeout"></a>`timeout` `float` *(optional)*

    等待浏览器实例启动的最大时间（毫秒）。默认为 `180000`（3 分钟）。传递 `0` 禁用超时。
  - <a id="browser-type-launch-persistent-context-option-timezone-id"></a>`timezoneId` `string` *(optional)*

    更改上下文的时区。请参阅 [ICU 的 metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1) 了解支持的时区 ID 列表。默认为系统时区。
  - <a id="browser-type-launch-persistent-context-option-traces-dir"></a>`tracesDir` `path` *(optional)*

    如果指定，跟踪将保存到此目录。
  - <a id="browser-type-launch-persistent-context-option-user-agent"></a>`userAgent` `string` *(optional)*

    在此上下文中使用的特定用户代理。
  - <a id="browser-type-launch-persistent-context-option-viewport"></a>`viewport` `null | Object` *(optional)*

    为每个页面模拟一致的视口。默认为 1280x720 视口。使用 `null` 禁用一致的视口模拟。了解更多关于[视口模拟](../emulation#viewport)。

    ::: info
    `null` 值选择退出默认预设，使视口取决于操作系统定义的主机窗口大小。这使测试的执行变得不确定。
    :::

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。

**Returns**

- `Promise<BrowserContext>`


### browserType.launchServer() {#browser-type-launch-server}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回浏览器应用程序实例。您可以通过 [`browserType.connect()`](/api/class-browsertype#browser-type-connect) 连接到它，这需要客户端/服务器的主版本号和次版本号匹配（1.2.3 → 与 1.2.x 兼容）。

**Usage**

启动客户端可以连接的浏览器服务器。以下是启动浏览器可执行文件并稍后连接到它的示例：

```js
const { chromium } = require('playwright');  // 或 'webkit' 或 'firefox'。

(async () => {
  const browserServer = await chromium.launchServer();
  const wsEndpoint = browserServer.wsEndpoint();
  // 稍后使用 web socket 端点建立连接。
  const browser = await chromium.connect(wsEndpoint);
  // 关闭浏览器实例。
  await browserServer.close();
})();
```

**Arguments**

- <a id="browser-type-launch-server-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-launch-server-option-args"></a>`args` `Array<string>` *(optional)*

    ::: warning
    使用自定义浏览器参数风险自负，因为其中一些可能会破坏 Playwright 功能。
    :::

    传递给浏览器实例的附加参数。Chromium 标志列表可在[这里](https://peter.sh/experiments/chromium-command-line-switches/)找到。
  - <a id="browser-type-launch-server-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)*

    如果指定，产物（跟踪、视频、下载、HAR 文件等）将保存到此目录。当浏览器关闭时，该目录不会被清理。如果未指定，则使用临时目录，并在浏览器关闭时清理。
  - <a id="browser-type-launch-server-option-channel"></a>`channel` `string` *(optional)*

    浏览器分发渠道。

    使用 "chromium" [选择新的无头模式](../browsers.md#chromium-new-headless-mode)。

    使用 "chrome"、"chrome-beta"、"chrome-dev"、"chrome-canary"、"msedge"、"msedge-beta"、"msedge-dev" 或 "msedge-canary" 来使用品牌版的 [Google Chrome 和 Microsoft Edge](../browsers.md#google-chrome--microsoft-edge)。
  - <a id="browser-type-launch-server-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(optional)*

    启用 Chromium 沙箱。默认为 `false`。
  - <a id="browser-type-launch-server-option-downloads-path"></a>`downloadsPath` `path` *(optional)*

    如果指定，已接受的下载将下载到此目录。否则，将创建临时目录，并在浏览器关闭时删除。无论哪种情况，当创建它们的浏览器上下文关闭时，下载都会被删除。
  - <a id="browser-type-launch-server-option-env"></a>`env` `Object<string, string | undefined>` *(optional)*
  - <a id="browser-type-launch-server-option-executable-path"></a>`executablePath` `path` *(optional)*

    要运行的浏览器可执行文件的路径，而不是捆绑的。如果 [`executablePath`](/api/class-browsertype#browser-type-launch-server-option-executable-path) 是相对路径，则相对于当前工作目录解析。请注意，Playwright 仅与捆绑的 Chromium、Firefox 或 WebKit 配合使用，使用风险自负。
  - <a id="browser-type-launch-server-option-firefox-user-prefs"></a>`firefoxUserPrefs` `Object<string, string | float | boolean>` *(optional)*

    Firefox 用户首选项。在 [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox) 了解更多关于 Firefox 用户首选项的信息。

    您还可以通过 `PLAYWRIGHT_FIREFOX_POLICIES_JSON` 环境变量提供自定义 [`policies.json` 文件](https://mozilla.github.io/policy-templates/)的路径。
  - <a id="browser-type-launch-server-option-handle-sighup"></a>`handleSIGHUP` `boolean` *(optional)*

    在 SIGHUP 信号时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-server-option-handle-sigint"></a>`handleSIGINT` `boolean` *(optional)*

    在 Ctrl-C 时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-server-option-handle-sigterm"></a>`handleSIGTERM` `boolean` *(optional)*

    在 SIGTERM 信号时关闭浏览器进程。默认为 `true`。
  - <a id="browser-type-launch-server-option-headless"></a>`headless` `boolean` *(optional)*

    是否以无头模式运行浏览器。更多详情请参阅 [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) 和 [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/)。默认为 `true`。
  - <a id="browser-type-launch-server-option-host"></a>`host` `string` *(optional)* <Badge type="info" text="Added in: v1.45" />

    用于 web socket 的主机。它是可选的，默认为 `localhost`，仅接受来自回环接口的连接。传递显式地址（例如 `0.0.0.0`）以接受来自网络的连接。

    ::: warning
    浏览器服务器没有认证。能够到达监听端口并知道 [`wsPath`](/api/class-browsertype#browser-type-launch-server-option-ws-path) 的客户端可以完全控制浏览器，并可以作为启动服务器的操作系统用户操作。当您传递显式主机时，请使用您的网络配置限制对端口的访问，例如防火墙、私有网络或认证代理。不要仅依赖 `wsPath`。
    :::
  - <a id="browser-type-launch-server-option-ignore-default-args"></a>`ignoreDefaultArgs` `boolean | Array<string>` *(optional)*

    如果为 `true`，Playwright 不会传递其自己的配置参数，只使用 [`args`](/api/class-browsertype#browser-type-launch-server-option-args) 中的参数。如果给出数组，则过滤掉给定的默认参数。危险选项；谨慎使用。默认为 `false`。
  - <a id="browser-type-launch-server-option-logger"></a>`logger` `Logger` *(optional)*

    Playwright 日志记录的日志接收器。
  - <a id="browser-type-launch-server-option-port"></a>`port` `int` *(optional)*

    用于 web socket 的端口。默认为 0，选择任何可用端口。
  - <a id="browser-type-launch-server-option-proxy"></a>`proxy` `Object` *(optional)*

    网络代理设置。

    - `server` `string`

      用于所有请求的代理。支持 HTTP 和 SOCKS 代理，例如 `http://myproxy.com:3128` 或 `socks5://myproxy.com:3128`。简写形式 `myproxy.com:3128` 被视为 HTTP 代理。
    - `bypass` `string` *(optional)*

      可选的逗号分隔域名列表，用于绕过代理，例如 `".com, chromium.org, .domain.com"`。
    - `username` `string` *(optional)*

      如果 HTTP 代理需要认证，可选的用户名。
    - `password` `string` *(optional)*

      如果 HTTP 代理需要认证，可选的密码。
  - <a id="browser-type-launch-server-option-timeout"></a>`timeout` `float` *(optional)*

    等待浏览器实例启动的最大时间（毫秒）。默认为 `180000`（3 分钟）。传递 `0` 禁用超时。
  - <a id="browser-type-launch-server-option-traces-dir"></a>`tracesDir` `path` *(optional)*

    如果指定，跟踪将保存到此目录。
  - <a id="browser-type-launch-server-option-ws-path"></a>`wsPath` `string` *(optional)* <Badge type="info" text="Added in: v1.15" />

    提供浏览器服务器的路径。出于安全考虑，默认为不可猜测的字符串。

    ::: warning
    任何进程或网页（包括在 Playwright 中运行的）只要知道 `wsPath` 就可以控制操作系统用户。因此，使用此选项时应使用不可猜测的令牌。

    不可猜测的路径保护回环接口上的服务器免受网页和其他本地进程的侵害。它不能替代网络访问控制：路径是 URL 的一部分，通过 `ws://` 以明文发送。请参阅 [`host`](/api/class-browsertype#browser-type-launch-server-option-host)。
    :::

**Returns**

- `Promise<BrowserServer>`


### browserType.name() {#browser-type-name}

<Badge type="info" text="Added in: v1.8" />

返回浏览器名称。例如：`'chromium'`、`'webkit'` 或 `'firefox'`。

**Returns**

- `string`
