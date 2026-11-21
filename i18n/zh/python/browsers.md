---
title: "浏览器"
---

# 浏览器

## 简介

每个版本的 Playwright 需要特定版本的浏览器二进制文件才能运行。你需要使用 Playwright CLI 来安装这些浏览器。

每次发布时，Playwright 都会更新它支持的浏览器版本，因此最新的 Playwright 始终支持最新的浏览器。这意味着每次更新 Playwright 时，你可能需要重新运行 `install` CLI 命令。

## 安装浏览器

Playwright 可以安装支持的浏览器。不带参数运行命令将安装默认浏览器。

```bash
playwright install
```

你也可以通过提供参数来安装特定的浏览器：

```bash
playwright install webkit
```

查看所有支持的浏览器：

```bash
playwright install --help
```

## 安装系统依赖

系统依赖可以自动安装。这对于 CI 环境很有用。

```bash
playwright install-deps
```

你也可以通过传递参数为单个浏览器安装依赖：

```bash
playwright install-deps chromium
```

还可以将 `install-deps` 与 `install` 结合使用，这样浏览器和操作系统依赖项可以通过单个命令安装。

```bash
playwright install --with-deps chromium
```

请参阅[系统要求](./intro.md#system-requirements)了解官方支持的操作系统。

## 配置浏览器

Playwright 可以在 Chromium、WebKit 和 Firefox 浏览器上运行测试，也可以在品牌浏览器上运行，如 Google Chrome 和 Microsoft Edge。它还可以在模拟的平板电脑和移动设备上运行。请参阅[设备参数注册表](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json)了解选定的桌面、平板和移动设备的完整列表。

### 在不同浏览器上运行测试

在特定浏览器上运行测试：

```bash
pytest test_login.py --browser webkit
```

在多个浏览器上运行测试：

```bash
pytest test_login.py --browser webkit --browser firefox
```

针对移动视口进行测试：

```bash
pytest test_login.py --device="iPhone 13"
```

针对品牌浏览器进行测试：

```bash
pytest test_login.py --browser-channel msedge
```

### Chromium

对于 Google Chrome、Microsoft Edge 和其他基于 Chromium 的浏览器，默认情况下，Playwright 使用开源 Chromium 构建。由于 Chromium 项目领先于品牌浏览器，当全球使用 Google Chrome N 时，Playwright 已经支持 Chromium N+1，它将在几周后发布到 Google Chrome 和 Microsoft Edge。

### Chromium：无头 shell

Playwright 为有头操作提供常规 Chromium 构建，为无头模式提供单独的 [chromium headless shell](https://developer.chrome.com/blog/chrome-headless-shell)。

如果你只在无头 shell 中运行测试（即**未**指定 `channel` 选项），例如在 CI 上，你可以通过在安装时传递 `--only-shell` 来避免下载完整的 Chromium 浏览器。

```bash
# 仅以无头方式运行测试
playwright install --with-deps --only-shell
```

### Chromium：新无头模式

你可以通过使用 `'chromium'` channel 选择使用新的无头模式。正如[官方 Chrome 文档所述](https://developer.chrome.com/blog/chrome-headless-shell)：

> 另一方面，新的无头模式是真正的 Chrome 浏览器，因此更加真实、可靠，并提供更多功能。这使其更适合高精度的端到端 Web 应用程序测试或浏览器扩展测试。

详情请参阅 [issue #33566](https://github.com/microsoft/playwright/issues/33566)。

```bash
pytest test_login.py --browser-channel chromium
```

使用新的无头模式，你可以在浏览器安装期间使用 `--no-shell` 选项跳过下载 headless shell：

```bash
# 仅以无头方式运行测试
playwright install --with-deps --no-shell
```

### Google Chrome 和 Microsoft Edge

虽然 Playwright 可以下载并使用最新的 Chromium 构建，但它可以针对机器上可用的品牌 Google Chrome 和 Microsoft Edge 浏览器运行（注意 Playwright 默认不安装它们）。特别是，当前的 Playwright 版本将支持这些浏览器的稳定版和测试版渠道。

可用的渠道有 `chrome`、`msedge`、`chrome-beta`、`msedge-beta`、`chrome-dev`、`msedge-dev`、`chrome-canary`、`msedge-canary`。

::: warning
某些企业浏览器策略可能会影响 Playwright 启动和控制 Google Chrome 和 Microsoft Edge 的能力。在具有浏览器策略的环境中运行超出了 Playwright 项目的范围。
:::

::: warning
Google Chrome 和 Microsoft Edge 已切换到更接近常规有头模式的[新无头模式](https://developer.chrome.com/docs/chromium/headless)实现。这与 Playwright 在无头运行时默认使用的 [chromium headless shell](https://developer.chrome.com/blog/chrome-headless-shell) 不同，因此在某些情况下会有不同的行为。详情请参阅 [issue #33566](https://github.com/microsoft/playwright/issues/33566)。
:::

```bash
pytest test_login.py --browser-channel msedge
```

###### 
或者，当直接使用库时，你可以在启动浏览器时指定浏览器 [`channel`](/python/api/class-browsertype#browser-type-launch-option-channel)：

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Channel 可以是 "chrome"、"msedge"、"chrome-beta"、"msedge-beta" 或 "msedge-dev"。
    browser = p.chromium.launch(channel="msedge")
    page = browser.new_page()
    page.goto("https://playwright.dev")
    print(page.title())
    browser.close()
```

#### 安装 Google Chrome 和 Microsoft Edge

如果你的机器上没有 Google Chrome 或 Microsoft Edge，你可以使用 Playwright 命令行工具安装它们：

```bash
playwright install msedge
```

::: warning
Google Chrome 或 Microsoft Edge 安装将安装在你的操作系统的默认全局位置，覆盖你当前的浏览器安装。
:::

使用 `--help` 选项运行以查看可以安装的浏览器的完整列表。

#### 何时使用 Google Chrome 和 Microsoft Edge，何时不使用？

##### 默认设置

大多数时候，使用最新 Chromium 的默认 Playwright 配置是一个好主意。由于 Playwright 领先于浏览器的稳定版渠道，它可以让你放心，即将发布的 Google Chrome 或 Microsoft Edge 不会破坏你的网站。你可以及早发现问题，并有足够的时间在官方 Chrome 更新之前修复它。

##### 回归测试

话虽如此，测试策略通常要求对当前公开可用的浏览器执行回归测试。在这种情况下，你可以选择使用稳定渠道之一，`"chrome"` 或 `"msedge"`。

##### 媒体编解码器

使用官方二进制文件进行测试的另一个原因是测试与媒体编解码器相关的功能。由于各种许可考虑和协议，Chromium 没有 Google Chrome 或 Microsoft Edge 捆绑的所有编解码器。如果你的网站依赖于这种编解码器（这种情况很少见），你也会想要使用官方渠道。

##### 企业策略

Google Chrome 和 Microsoft Edge 遵守企业策略，包括对功能的限制、网络代理、阻碍测试的强制扩展。因此，如果你是使用此类策略的组织的一部分，最简单的方法是使用捆绑的 Chromium 进行本地测试，你仍然可以在通常没有此类限制的 bot 上选择稳定渠道。

### Firefox

Playwright 的 Firefox 版本与最新的 [Firefox Stable](https://www.mozilla.org/en-US/firefox/new/) 构建相匹配。Playwright 不能与品牌版本的 Firefox 一起使用，因为它依赖于补丁。

请注意，某些功能的可用性（严重依赖于底层平台）可能因操作系统而异。例如，可用的媒体编解码器在 Linux、macOS 和 Windows 之间有很大差异。

### WebKit

Playwright 的 WebKit 来源于最新的 WebKit 主分支源代码，通常在这些更新被纳入 Apple Safari 和其他基于 WebKit 的浏览器之前。这为对潜在的浏览器更新问题做出反应提供了大量的准备时间。Playwright 不能与品牌版本的 Safari 一起使用，因为它依赖于补丁。相反，你可以使用最新的 WebKit 构建进行测试。

请注意，某些功能的可用性（严重依赖于底层平台）可能因操作系统而异。例如，可用的媒体编解码器在 Linux、macOS 和 Windows 之间有很大差异。虽然在 Linux CI 上运行 WebKit 通常是最经济的选择，但为了获得最接近 Safari 的体验，你应该在 Mac 上运行 WebKit，例如如果你进行视频播放。

## 通过防火墙或代理安装

默认情况下，Playwright 从 Microsoft 的 CDN 下载浏览器。

有时公司维护内部代理来阻止直接访问公共资源。在这种情况下，可以配置 Playwright 通过代理服务器下载浏览器。

::: code-group

```bash [Bash]
pip install playwright
HTTPS_PROXY=https://192.0.2.1 playwright install
```

```bat [Batch]
set HTTPS_PROXY=https://192.0.2.1
pip install playwright
playwright install
```

```powershell [PowerShell]
$Env:HTTPS_PROXY="https://192.0.2.1"
pip install playwright
playwright install
```

:::

如果代理的请求被自定义的不受信任的证书颁发机构（CA）拦截，并且在下载浏览器时产生 `Error: self signed certificate in certificate chain`，你必须在安装浏览器之前通过 [`NODE_EXTRA_CA_CERTS`](https://nodejs.org/api/cli.html#node_extra_ca_certsfile) 环境变量设置你的自定义根证书：

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

如果浏览器存档下载缓慢或停滞，你可以使用 `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT` 环境变量增加下载套接字超时时间（以毫秒为单位）。尽管名称如此，这是一个空闲超时而不是连接超时；它限制下载在多长时间内没有接收数据，默认为 30 秒：

::: code-group

```bash [Bash]
pip install playwright
PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=120000 playwright install
```

```bat [Batch]
set PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=120000
pip install playwright
playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT="120000"
pip install playwright
playwright install
```

:::

如果你正在 Linux 上[安装依赖](#安装系统依赖)并需要使用代理，请确保以 root 用户身份运行命令。否则，Playwright 将尝试成为 root 并且不会将像 `HTTPS_PROXY` 这样的环境变量传递给 Linux 包管理器。

```bash
sudo HTTPS_PROXY=https://192.0.2.1 playwright install-deps
```

## 从制品仓库下载

默认情况下，Playwright 从 Microsoft 的 CDN 下载浏览器。

有时公司维护内部制品仓库来托管浏览器二进制文件。在这种情况下，可以使用 `PLAYWRIGHT_DOWNLOAD_HOST` 环境变量配置 Playwright 从自定义位置下载。

::: code-group

```bash [Bash]
pip install playwright
PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 playwright install
```

```bat [Batch]
set PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1
pip install playwright
playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_DOWNLOAD_HOST="http://192.0.2.1"
pip install playwright
playwright install
```

:::

还可以使用 `PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST`、`PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST` 和 `PLAYWRIGHT_WEBKIT_DOWNLOAD_HOST` 环境变量为每个浏览器指定下载主机，这些变量优先于 `PLAYWRIGHT_DOWNLOAD_HOST`。

::: code-group

```bash [Bash]
pip install playwright
PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST=http://203.0.113.3 PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 playwright install
```

```bat [Batch]
set PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST=http://203.0.113.3
set PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1
pip install playwright
playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST="http://203.0.113.3"
$Env:PLAYWRIGHT_DOWNLOAD_HOST="http://192.0.2.1"
pip install playwright
playwright install
```

:::

## 使用预装的 Node.js

::: code-group

```bash [Bash]
pip install playwright
PLAYWRIGHT_NODEJS_PATH="/usr/local/bin/node" playwright install
```

```bat [Batch]
set PLAYWRIGHT_NODEJS_PATH=C:\Program Files\nodejs\node.exe
pip install playwright
playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_NODEJS_PATH="C:\Program Files\nodejs\node.exe"
pip install playwright
playwright install
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

你可以使用环境变量覆盖默认行为。安装 Playwright 时，让它将浏览器下载到特定位置：

::: code-group

```bash [Bash]
pip install playwright
PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers python -m playwright install
```

```bat [Batch]
set PLAYWRIGHT_BROWSERS_PATH=%USERPROFILE%\pw-browsers
pip install playwright
playwright install
```

```powershell [PowerShell]
$Env:PLAYWRIGHT_BROWSERS_PATH="$Env:USERPROFILE\pw-browsers"
pip install playwright
playwright install
```

:::

运行 Playwright 脚本时，让 Playwright 在共享位置搜索浏览器。

::: code-group

```bash [Bash]
PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers python playwright_script.py
```

```bat [Batch]
set PLAYWRIGHT_BROWSERS_PATH=%USERPROFILE%\pw-browsers
python playwright_script.py
```

```powershell [PowerShell]

$Env:PLAYWRIGHT_BROWSERS_PATH="$Env:USERPROFILE\pw-browsers"
python playwright_script.py
```

:::

Playwright 跟踪需要这些浏览器的包，并在你更新 Playwright 到较新版本时进行垃圾回收。

::: info
开发人员可以通过在他们的 `.bashrc` 中导出 `PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers` 来选择此模式。
:::

### 过期浏览器删除

Playwright 跟踪使用其浏览器的客户端。当不再有客户端需要某个特定版本的浏览器时，该版本将从系统中删除。这样你可以安全地使用不同版本的 Playwright 实例，同时不会为不再使用的浏览器浪费磁盘空间。

要选择退出未使用的浏览器删除，你可以设置 `PLAYWRIGHT_SKIP_BROWSER_GC=1` 环境变量，或将 `--no-remove` 选项传递给 install 命令：

```bash
playwright install --no-remove
```

### 列出所有已安装的浏览器：

打印机器上所有 Playwright 安装的浏览器列表。

```bash
playwright install --list
```

### 卸载浏览器

这将删除当前 Playwright 安装的浏览器（chromium、firefox、webkit）：

```bash
playwright uninstall
```

要同时删除其他 Playwright 安装的浏览器，请传递 `--all` 标志：

```bash
playwright uninstall --all
```
