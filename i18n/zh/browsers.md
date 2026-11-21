---
title: "浏览器"
---

# 浏览器

## 简介

每个版本的 Playwright 都需要特定版本的浏览器二进制文件才能运行。您需要使用 Playwright CLI 来安装这些浏览器。

每次发布新版本时，Playwright 都会更新其支持的浏览器版本，因此最新的 Playwright 始终支持最新的浏览器。这意味着每次更新 Playwright 时，您可能需要重新运行 `install` CLI 命令。

## 安装浏览器

Playwright 可以安装支持的浏览器。不带参数运行该命令将安装默认浏览器。

```bash
npx playwright install
```

您也可以通过提供参数来安装特定浏览器：

```bash
npx playwright install webkit
```

查看所有支持的浏览器：

```bash
npx playwright install --help
```

## 安装系统依赖

系统依赖可以自动安装。这在 CI 环境中非常有用。

```bash
npx playwright install-deps
```

您也可以通过传递参数来仅安装单个浏览器的依赖：

```bash
npx playwright install-deps chromium
```

还可以将 `install-deps` 与 `install` 组合使用，这样浏览器和操作系统依赖可以通过一个命令安装。

```bash
npx playwright install --with-deps chromium
```

有关官方支持的操作系统，请参阅[系统要求](./intro.md#system-requirements)。

## 定期更新 Playwright

保持 Playwright 版本更新可以让您使用新功能，并在最新浏览器版本向公众发布之前，在最新的浏览器版本上测试您的应用程序并捕获故障。

```bash
# 更新 playwright
npm install -D @playwright/test@latest

# 安装新浏览器
npx playwright install
```

查看[发布说明](./release-notes.md)以了解最新版本及其变更内容。

```bash
# 通过运行以下命令查看您的 Playwright 版本
npx playwright --version
```

## 配置浏览器

Playwright 可以在 Chromium、WebKit 和 Firefox 浏览器以及品牌浏览器（如 Google Chrome 和 Microsoft Edge）上运行测试。它还可以在模拟的平板电脑和移动设备上运行。有关所选桌面、平板电脑和移动设备的完整列表，请参阅[设备参数注册表](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json)。

### 在不同浏览器上运行测试

Playwright 可以通过在配置中设置 **projects** 来在多个浏览器和配置上运行测试。您还可以为每个项目添加[不同的选项](./test-configuration)。

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    /* 针对桌面浏览器测试 */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* 针对移动视口测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    /* 针对品牌浏览器测试 */
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // 或 'chrome-beta'
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }, // 或 'msedge-dev'
    },
  ],
});
```

Playwright 默认会运行所有项目。

```bash
npx playwright test

Running 7 tests using 5 workers

  ✓ [chromium] › example.spec.ts:3:1 › basic test (2s)
  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)
  ✓ [webkit] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Mobile Chrome] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Mobile Safari] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Google Chrome] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Microsoft Edge] › example.spec.ts:3:1 › basic test (2s)
```

使用 `--project` 命令行选项来运行单个项目。

```bash
npx playwright test --project=firefox

Running 1 test using 1 worker

  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)
```

使用 VS Code 扩展，您可以通过在 Playwright 侧边栏中勾选浏览器名称旁边的复选框来在不同浏览器上运行测试。这些名称在 Playwright 配置文件的 projects 部分中定义。安装 Playwright 时的默认配置提供了 3 个项目：Chromium、Firefox 和 WebKit。默认选择第一个项目。

![VS Code 扩展中的项目部分](/images/vscode-projects-section.png)

要在多个项目（浏览器）上运行测试，请勾选项目名称旁边的复选框来选择每个项目。

<img src="https://github.com/microsoft/playwright/assets/13063165/6dc86ef4-6097-481c-9cab-b6e053ec7ea6" alt="选择要运行测试的项目" width="3978" height="2294" />

### Chromium

对于 Google Chrome、Microsoft Edge 和其他基于 Chromium 的浏览器，Playwright 默认使用开源 Chromium 构建版本。由于 Chromium 项目领先于品牌浏览器，当全球使用 Google Chrome N 版本时，Playwright 已经支持将在几周后发布到 Google Chrome 和 Microsoft Edge 的 Chromium N+1 版本。

### Chromium：无头 shell

Playwright 为有界面操作提供常规 Chromium 构建版本，为无头模式提供单独的 [chromium headless shell](https://developer.chrome.com/blog/chrome-headless-shell)。

如果您只在无头 shell 中运行测试（即**未**指定 `channel` 选项），例如在 CI 环境中，可以通过在安装时传递 `--only-shell` 来避免下载完整的 Chromium 浏览器。

```bash
# 仅在无头模式下运行测试
npx playwright install --with-deps --only-shell
```

### Chromium：新的无头模式

您可以通过使用 `'chromium'` channel 来选择新的无头模式。正如 [Chrome 官方文档所述](https://developer.chrome.com/blog/chrome-headless-shell)：

> 新的无头模式是真正的 Chrome 浏览器，因此更加真实、可靠，并提供更多功能。这使其更适合高精度的端到端 Web 应用测试或浏览器扩展测试。

详情请参阅 [issue #33566](https://github.com/microsoft/playwright/issues/33566)。

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
});
```

使用新的无头模式，您可以通过使用 `--no-shell` 选项在浏览器安装期间跳过下载无头 shell：

```bash
# 仅在无头模式下运行测试
npx playwright install --with-deps --no-shell
```

### Google Chrome 和 Microsoft Edge

虽然 Playwright 可以下载并使用最新的 Chromium 构建版本，但它也可以针对机器上可用的品牌 Google Chrome 和 Microsoft Edge 浏览器运行（请注意，Playwright 默认不会安装它们）。特别是，当前的 Playwright 版本将支持这些浏览器的稳定版和测试版渠道。

可用的渠道包括 `chrome`、`msedge`、`chrome-beta`、`msedge-beta`、`chrome-dev`、`msedge-dev`、`chrome-canary`、`msedge-canary`。

::: warning
某些企业浏览器策略可能会影响 Playwright 启动和控制 Google Chrome 和 Microsoft Edge 的能力。在具有浏览器策略的环境中运行超出了 Playwright 项目的范围。
:::

::: warning
Google Chrome 和 Microsoft Edge 已切换到更接近常规有界面模式的[新无头模式](https://developer.chrome.com/docs/chromium/headless)实现。这与 Playwright 在无头运行时默认使用的 [chromium headless shell](https://developer.chrome.com/blog/chrome-headless-shell) 不同，因此在某些情况下可能会有不同的行为。详情请参阅 [issue #33566](https://github.com/microsoft/playwright/issues/33566)。
:::

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    /* 针对品牌浏览器测试 */
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // 或 'chrome-beta'
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }, // 或 "msedge-beta" 或 'msedge-dev'
    },
  ],
});
```

#### 安装 Google Chrome 和 Microsoft Edge

如果您的机器上没有 Google Chrome 或 Microsoft Edge，可以使用 Playwright 命令行工具安装它们：

```bash
npx playwright install msedge
```

::: warning
Google Chrome 或 Microsoft Edge 安装将安装到操作系统的默认全局位置，覆盖您当前的浏览器安装。
:::

使用 `--help` 选项运行以查看可以安装的浏览器的完整列表。

#### 何时使用 Google Chrome 和 Microsoft Edge，何时不使用？

##### 默认设置

大多数情况下，使用带有最新 Chromium 的默认 Playwright 配置是个好主意。由于 Playwright 领先于浏览器的稳定渠道，它让您放心即将发布的 Google Chrome 或 Microsoft Edge 版本不会破坏您的网站。您可以及早发现问题，并有足够的时间在 Chrome 官方更新之前修复它。

##### 回归测试

话虽如此，测试策略通常要求针对当前公开可用的浏览器执行回归测试。在这种情况下，您可以选择稳定渠道之一，`"chrome"` 或 `"msedge"`。

##### 媒体编解码器

使用官方二进制文件进行测试的另一个原因是测试与媒体编解码器相关的功能。由于各种许可考虑和协议，Chromium 没有 Google Chrome 或 Microsoft Edge 捆绑的所有编解码器。如果您的网站依赖这类编解码器（这种情况很少见），您也需要使用官方渠道。

##### 企业策略

Google Chrome 和 Microsoft Edge 遵守企业策略，这些策略包括对功能的限制、网络代理、妨碍测试的强制扩展。因此，如果您所在的组织使用此类策略，在本地测试时最好使用捆绑的 Chromium，您仍然可以在通常没有这些限制的机器人上选择稳定渠道。

### Firefox

Playwright 的 Firefox 版本与最新的 [Firefox 稳定版](https://www.mozilla.org/en-US/firefox/new/)构建版本匹配。Playwright 不适用于品牌版本的 Firefox，因为它依赖于补丁。

请注意，某些功能的可用性（这些功能严重依赖于底层平台）可能因操作系统而异。例如，可用的媒体编解码器在 Linux、macOS 和 Windows 之间差异很大。

### WebKit

Playwright 的 WebKit 源自最新的 WebKit 主分支源代码，通常在这些更新被纳入 Apple Safari 和其他基于 WebKit 的浏览器之前。这为应对潜在的浏览器更新问题提供了大量的提前准备时间。Playwright 不适用于品牌版本的 Safari，因为它依赖于补丁。相反，您可以使用最新的 WebKit 构建版本进行测试。

请注意，某些功能的可用性（这些功能严重依赖于底层平台）可能因操作系统而异。例如，可用的媒体编解码器在 Linux、macOS 和 Windows 之间差异很大。虽然在 Linux CI 上运行 WebKit 通常是最经济实惠的选择，但为了获得最接近 Safari 的体验，您应该在 Mac 上运行 WebKit，例如在进行视频播放测试时。

## 在防火墙或代理后面安装

默认情况下，Playwright 从 Microsoft 的 CDN 下载浏览器。

有时公司会维护一个内部代理，阻止直接访问公共资源。在这种情况下，可以将 Playwright 配置为通过代理服务器下载浏览器。

::: code-group

```bash [Bash]
HTTPS_PROXY=https://192.0.2.1 npx playwright install
```

```bat [Batch]
set HTTPS_PROXY=https://192.0.2.1
npx playwright install
```

```powershell [PowerShell]
$Env:HTTPS_PROXY="https://192.0.2.1"
npx playwright install
```

:::

如果代理请求被自定义的不受信任的证书颁发机构 (CA) 拦截，并且在下载浏览器时产生 `Error: self signed certificate in certificate chain` 错误，您必须在安装浏览器之前通过 [`NODE_EXTRA_CA_CERTS`](https://nodejs.org/api/cli.html#node_extra_ca_certsfile) 环境变量设置自定义根证书：

::: code-group

```bash [Bash]
export NODE_EXTRA_CA_CERTS="/path/to/cert.pem"
```

```bat [Batch]
set NODE_EXTRA_CA_CERTS="C:\certs\root.crt"
```

```powershell [PowerShell]
$Env:NODE_EXTRA_CA_CERTS="C:\certs\root.crt"
```

:::

如果浏览器归档文件下载缓慢或停滞，您可以使用 `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT` 环境变量增加下载套接字超时时间（以毫秒为单位）。尽管名称如此，这是一个空闲超时而非连接超时；它限制下载在没有接收数据的情况下可以持续多长时间，默认为 30 秒：

::: code-group

```bash [Bash]
PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=120000 npx playwright install
```

```bat [Batch]
set PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=120000
npx playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT="120000"
npx playwright install
```

:::

如果您在 Linux 上[安装依赖](#安装系统依赖)并需要使用代理，请确保以 root 用户身份运行命令。否则，Playwright 将尝试获取 root 权限，并且不会将环境变量（如 `HTTPS_PROXY`）传递给 Linux 包管理器。

```bash
sudo HTTPS_PROXY=https://192.0.2.1 npx playwright install-deps
```

## 从制品仓库下载

默认情况下，Playwright 从 Microsoft 的 CDN 下载浏览器。

有时公司会维护内部制品仓库来托管浏览器二进制文件。在这种情况下，可以使用 `PLAYWRIGHT_DOWNLOAD_HOST` 环境变量将 Playwright 配置为从自定义位置下载。

::: code-group

```bash [Bash]
PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install
```

```bat [Batch]
set PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1
npx playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_DOWNLOAD_HOST="http://192.0.2.1"
npx playwright install
```

:::

还可以使用 `PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST`、`PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST` 和 `PLAYWRIGHT_WEBKIT_DOWNLOAD_HOST` 环境变量为每个浏览器设置下载主机，它们优先于 `PLAYWRIGHT_DOWNLOAD_HOST`。

::: code-group

```bash [Bash]
PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST=http://203.0.113.3 PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install
```

```bat [Batch]
set PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST=http://203.0.113.3
set PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1
npx playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST="http://203.0.113.3"
$Env:PLAYWRIGHT_DOWNLOAD_HOST="http://192.0.2.1"
npx playwright install
```

:::

## 管理浏览器二进制文件

Playwright 将 Chromium、WebKit 和 Firefox 浏览器下载到特定于操作系统的缓存文件夹：
- Windows：`%USERPROFILE%\AppData\Local\ms-playwright`
- macOS：`~/Library/Caches/ms-playwright`
- Linux：`~/.cache/ms-playwright`

安装后，这些浏览器将占用几百兆字节的磁盘空间：

```bash
du -hs ~/Library/Caches/ms-playwright/*
281M  chromium-XXXXXX
187M  firefox-XXXX
180M  webkit-XXXX
```

您可以使用环境变量覆盖默认行为。安装 Playwright 时，让它将浏览器下载到特定位置：

::: code-group

```bash [Bash]
PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright install
```

```bat [Batch]
set PLAYWRIGHT_BROWSERS_PATH=%USERPROFILE%\pw-browsers
npx playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_BROWSERS_PATH="$Env:USERPROFILE\pw-browsers"
npx playwright install
```

:::

运行 Playwright 脚本时，让 Playwright 在共享位置搜索浏览器。

::: code-group

```bash [Bash]
PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright test
```

```bat [Batch]
set PLAYWRIGHT_BROWSERS_PATH=%USERPROFILE%\pw-browsers
npx playwright test
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_BROWSERS_PATH="$Env:USERPROFILE\pw-browsers"
npx playwright test
```

:::

Playwright 会跟踪需要这些浏览器的包，并在您更新到较新版本的 Playwright 时对它们进行垃圾回收。

::: info
开发人员可以通过在 `.bashrc` 中导出 `PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers` 来选择此模式。
:::

### 封闭安装

您可以选择封闭安装，将二进制文件放在本地文件夹中：

::: code-group

```bash [Bash]
# 将二进制文件放在 node_modules/playwright-core/.local-browsers
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install
```

```bat [Batch]
# 将二进制文件放在 node_modules\playwright-core\.local-browsers
set PLAYWRIGHT_BROWSERS_PATH=0
npx playwright install
```

```powershell [PowerShell]
# 将二进制文件放在 node_modules\playwright-core\.local-browsers
$Env:PLAYWRIGHT_BROWSERS_PATH=0
npx playwright install
```

:::

::: info
`PLAYWRIGHT_BROWSERS_PATH` 不会更改 Google Chrome 和 Microsoft Edge 的安装路径。
:::

### 过期浏览器移除

Playwright 会跟踪使用其浏览器的客户端。当没有更多客户端需要特定版本的浏览器时，该版本将从系统中删除。这样，您可以安全地使用不同版本的 Playwright 实例，同时不会为不再使用的浏览器浪费磁盘空间。

要选择退出未使用的浏览器移除，您可以设置 `PLAYWRIGHT_SKIP_BROWSER_GC=1` 环境变量，或向安装命令传递 `--no-remove` 选项：

```bash
npx playwright install --no-remove
```

### 列出所有已安装的浏览器

打印机器上所有 Playwright 安装的浏览器列表。

```bash
npx playwright install --list
```

### 卸载浏览器

这将移除当前 Playwright 安装的浏览器（chromium、firefox、webkit）：

```bash
npx playwright uninstall
```

要同时移除其他 Playwright 安装的浏览器，请传递 `--all` 标志：

```bash
npx playwright uninstall --all
```
