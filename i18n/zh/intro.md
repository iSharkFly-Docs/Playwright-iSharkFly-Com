---
title: "安装"
---

# 安装

## 简介

Playwright Test 是一个为现代 Web 应用打造的端到端测试框架。它集成了测试运行器、断言、隔离、并行化和丰富的工具。Playwright 支持在 Windows、Linux 和 macOS 上测试 Chromium、WebKit 和 Firefox，可在本地或 CI 中运行，支持无头或有头模式，并原生支持 Chrome（Android）和 Mobile Safari 的移动端模拟。

**你将学到**
- [如何安装 Playwright](/intro.md#installing-playwright)
- [安装了什么](/intro.md#whats-installed)
- [如何运行示例测试](/intro.md#running-the-example-test)
- [如何打开 HTML 测试报告](/intro.md#html-test-reports)

## 安装 Playwright

通过以下方法之一开始安装 Playwright。

### 使用 npm、yarn 或 pnpm

以下命令可以初始化新项目或将 Playwright 添加到现有项目中。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npm init playwright@latest
```

</TabItem>

<TabItem value="yarn">

```bash
yarn create playwright
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm create playwright
```

</TabItem>

</Tabs>

出现提示时，选择/确认：
- TypeScript 或 JavaScript（默认：TypeScript）
- 测试文件夹名称（默认：`tests`，如果 `tests` 已存在则为 `e2e`）
- 添加 GitHub Actions 工作流（推荐用于 CI）
- 安装 Playwright 浏览器（默认：是）

你可以稍后重新运行该命令；它不会覆盖现有测试。

### 使用 VS Code 扩展

你也可以使用 [VS Code 扩展](./getting-started-vscode.md) 创建和运行测试。

## 安装了什么

Playwright 会下载所需的浏览器二进制文件并创建以下脚手架。

```bash
playwright.config.ts         # 测试配置
package.json
package-lock.json            # 或 yarn.lock / pnpm-lock.yaml
tests/
  example.spec.ts            # 最小示例测试
```

[playwright.config](./test-configuration.md) 集中管理配置：目标浏览器、超时、重试、项目、报告器等。在现有项目中，依赖项会添加到你当前的 `package.json` 中。

`tests/` 包含一个最小的入门测试。

## 运行示例测试

默认情况下，测试在 Chromium、Firefox 和 WebKit 上并行无头运行（可在 [playwright.config](./test-configuration.md) 中配置）。输出和汇总结果显示在终端中。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright test
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright test
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright test
```

</TabItem>

</Tabs>

![在命令行中运行测试](/images/getting-started/run-tests-cli.png)

提示：
- 查看浏览器窗口：添加 `--headed`。
- 运行单个项目/浏览器：`--project=chromium`。
- 运行单个文件：`npx playwright test tests/example.spec.ts`。
- 打开测试 UI：`--ui`。

详细信息请参阅 [运行测试](./running-tests.md)，了解过滤、有头模式、分片和重试。

## HTML 测试报告

测试运行后，[HTML 报告器](./test-reporters.md#html-reporter) 提供一个仪表板，可按浏览器、通过、失败、跳过、不稳定等进行过滤。点击测试可查看错误、附件和步骤。它仅在发生失败时自动打开；使用以下命令手动打开。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright show-report
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright show-report
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright show-report
```

</TabItem>

</Tabs>

![HTML 报告](/images/getting-started/html-report-basic.png)

## 在 UI 模式下运行示例测试

使用 [UI 模式](./test-ui-mode.md) 运行测试，享受监视模式、实时步骤查看、时间旅行调试等功能。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright test --ui
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright test --ui
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright test --ui
```

</TabItem>

</Tabs>

![UI 模式](/images/getting-started/ui-mode.png)

查看 [UI 模式详细指南](./test-ui-mode.md)，了解监视过滤器、步骤详情和追踪集成。

## 更新 Playwright

更新 Playwright 并下载新的浏览器二进制文件及其依赖项：

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npm install -D @playwright/test@latest
npx playwright install --with-deps
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add --dev @playwright/test@latest
yarn playwright install --with-deps
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm install --save-dev @playwright/test@latest
pnpm exec playwright install --with-deps
```

</TabItem>

</Tabs>

检查已安装的版本：

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright --version
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright --version
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright --version
```

</TabItem>

</Tabs>

## 系统要求
- Node.js：最新的 22.x、24.x 或 26.x。
- Windows 11+、Windows Server 2019+ 或 Windows Subsystem for Linux (WSL)。
- macOS 14 (Sonoma) 或更高版本。
- Debian 12 / 13、Ubuntu 22.04 / 24.04 / 26.04（x86-64 或 arm64）。

## 下一步
- [使用 Web 优先断言、测试夹具和定位器编写测试](./writing-tests.md)
- [运行单个或多个测试；有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen-intro.md)
- [查看测试的追踪记录](./trace-viewer-intro.md)
