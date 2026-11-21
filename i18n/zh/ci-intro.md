---
title: "设置 CI"
---

# 设置 CI

## 介绍

Playwright 测试可以在任何 CI 提供商上运行。本指南介绍了使用 GitHub Actions 在 GitHub 上运行测试的一种方法。如果您想了解更多信息或如何配置其他 CI 提供商，请查看我们关于[持续集成](./ci.md)的详细文档。

#### 您将学习
- [如何设置 GitHub Actions](/ci-intro.md#setting-up-github-actions)
- [如何查看测试日志](/ci-intro.md#viewing-test-logs)
- [如何查看 HTML 报告](/ci-intro.md#viewing-the-html-report)
- [如何查看跟踪](/ci-intro.md#viewing-the-trace)
- [如何在网上发布报告](/ci-intro.md#publishing-report-on-the-web)

## 设置 GitHub Actions

使用 [VS Code 扩展](./getting-started-vscode.md)或 `npm init playwright@latest` [安装 Playwright](./intro.md) 时，您可以选择添加 [GitHub Actions](https://docs.github.com/en/actions) 工作流。这会在 `.github/workflows` 文件夹中创建一个 `playwright.yml` 文件，其中包含在每次推送和拉取请求到 main/master 分支时运行测试所需的所有内容。该文件如下所示：

::: code-group

```yml [.github/workflows/playwright.yml]
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-node@v6
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v5
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

:::

该工作流执行以下步骤：
1. 克隆您的仓库
1. 安装 Node.js
1. 安装 NPM 依赖
1. 安装 Playwright 浏览器
1. 运行 Playwright 测试
1. 将 HTML 报告上传到 GitHub UI

请注意，工作流没有设置作业级别的 `timeout-minutes`。相反，请在配置中设置 [`globalTimeout`](./test-timeouts.md#global-timeout)：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 一小时后使运行失败，以便报告器仍能生成报告。
  globalTimeout: 60 * 60 * 1000,
});
```

:::

要了解更多信息，请参阅["了解 GitHub Actions"](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)。

## 创建仓库并推送到 GitHub

一旦您设置了 [GitHub Actions 工作流](#setting-up-github-actions)，您只需要[在 GitHub 上创建仓库](https://docs.github.com/en/get-started/quickstart/create-a-repo)或将代码推送到现有仓库。按照 GitHub 上的说明操作，不要忘记使用 `git init` 命令[初始化 git 仓库](https://github.com/git-guides/git-init)，以便您可以[添加](https://github.com/git-guides/git-add)、[提交](https://github.com/git-guides/git-commit)和[推送](https://github.com/git-guides/git-push)您的代码。

###### 
<img height="745" width="1721" alt="Create a Repo and Push to GitHub" src="https://user-images.githubusercontent.com/13063165/183423254-d2735278-a2ab-4d63-bb99-48d8e5e447bc.png"/>

## 打开工作流

点击 **Actions** 标签页查看工作流。在这里您可以看到测试是通过还是失败。

###### 
<img src="https://user-images.githubusercontent.com/13063165/183423783-58bf2008-514e-4f96-9c12-c9a55703960c.png" alt="opening the workflow" width="1678" height="1207" />

## 查看测试日志

点击工作流运行会显示 GitHub 执行的所有操作，点击 **Run Playwright tests** 会显示错误消息、预期值和接收值以及调用日志。

###### 
<img src="https://user-images.githubusercontent.com/13063165/183423783-58bf2008-514e-4f96-9c12-c9a55703960c.png" alt="Viewing Test Logs" width="1678" height="1207" />

## HTML 报告

HTML 报告向您显示测试的完整报告。您可以按浏览器、通过的测试、失败的测试、跳过的测试和不稳定的测试进行筛选。

### 下载 HTML 报告

在 Artifacts 部分，点击 **playwright-report** 以 zip 文件格式下载报告。

<img height="1245" width="1943" alt="Downloading the HTML Report" src="https://user-images.githubusercontent.com/13063165/183437023-524f1803-84e4-4862-9ce3-1d55af0e023e.png" />

### 查看 HTML 报告

在本地打开报告无法按预期工作，因为您需要一个 Web 服务器才能使一切正常工作。首先，解压 zip 文件，最好解压到已安装 Playwright 的文件夹中。使用命令行，切换到报告所在的目录，然后使用 `npx playwright show-report` 后跟解压文件夹的名称。这将启动报告服务并允许您在浏览器中查看它。

```bash
npx playwright show-report name-of-my-extracted-playwright-report
```

<img src="https://github.com/microsoft/playwright/assets/13063165/c5f60e56-fb75-4a2d-a4b6-054b8c5d69c1" alt="viewing the HTML report" width="2296" height="1424" />

要了解更多关于报告的信息，请查看我们关于 [HTML 报告器](/test-reporters.md#html-reporter)的详细指南

## 查看跟踪

使用 `npx playwright show-report` 启动报告后，点击测试文件名旁边的跟踪图标，如上图所示。然后您可以查看测试的跟踪并检查每个操作，以尝试找出测试失败的原因。

<img src="https://github.com/microsoft/playwright/assets/13063165/10fe3585-8401-4051-b1c2-b2e92ac4c274" alt="playwright trace viewer" width="3598" height="2218" />

## 在网上发布报告

将 HTML 报告下载为 zip 文件不是很方便。但是，我们可以利用 Azure 存储的静态网站托管功能，轻松高效地在互联网上提供 HTML 报告，只需最少的配置。
1. 创建一个 [Azure 存储帐户](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create)。
1. 为存储帐户启用[静态网站托管](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to#enable-static-website-hosting)。
1. 在 Azure 中创建服务主体并授予其访问 Azure Blob 存储的权限。成功执行后，该命令将显示将在下一步中使用的凭据。
   
   ```bash
   az ad sp create-for-rbac --name "github-actions" --role "Storage Blob Data Contributor" --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
   ```
1. 使用上一步的凭据在 GitHub 仓库中设置加密密钥。转到仓库的设置，在 [GitHub Actions 密钥](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)下添加以下密钥：
   - `AZCOPY_SPA_APPLICATION_ID`
   - `AZCOPY_SPA_CLIENT_SECRET`
   - `AZCOPY_TENANT_ID`
   
   有关如何使用客户端密钥授权服务主体的详细指南，请参阅[这篇 Microsoft 文档](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-authorize-azure-active-directory#authorize-a-service-principal-by-using-a-client-secret)。
1. 添加一个将 HTML 报告上传到 Azure 存储的步骤。
   
   ::: code-group
   
   ```yaml [.github/workflows/playwright.yml]
   ...
       - name: Upload HTML report to Azure
         shell: bash
         run: |
           REPORT_DIR='run-${{ github.run_id }}-${{ github.run_attempt }}'
           azcopy cp --recursive "./playwright-report/*" "https://<STORAGE_ACCOUNT_NAME>.blob.core.windows.net/\$web/$REPORT_DIR"
           echo "::notice title=HTML report url::https://<STORAGE_ACCOUNT_NAME>.z1.web.core.windows.net/$REPORT_DIR/index.html"
         env:
           AZCOPY_AUTO_LOGIN_TYPE: SPN
           AZCOPY_SPA_APPLICATION_ID: '${{ secrets.AZCOPY_SPA_APPLICATION_ID }}'
           AZCOPY_SPA_CLIENT_SECRET: '${{ secrets.AZCOPY_SPA_CLIENT_SECRET }}'
           AZCOPY_TENANT_ID: '${{ secrets.AZCOPY_TENANT_ID }}'
   ```
   
   :::

`$web` 存储容器的内容可以通过网站的[公共 URL](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal#portal-find-url) 从浏览器访问。

::: info
此步骤对于从 fork 仓库创建的拉取请求不起作用，因为此类工作流[无法访问密钥](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#using-secrets-in-a-workflow)。
:::

## 正确处理密钥

跟踪文件、HTML 报告甚至控制台日志等工件包含有关测试执行的信息。它们可能包含敏感数据，如测试用户的用户凭据、暂存后端的访问令牌、测试源代码，有时甚至是您的应用程序源代码。请像对待敏感数据一样谨慎对待这些文件。如果您在 CI 工作流中上传报告和跟踪，请确保仅将它们上传到受信任的工件存储，或在上传前加密文件。共享工件给团队成员时也是如此：使用受信任的文件共享或在共享前加密文件。

## 下一步
- [学习如何使用定位器](./locators.md)
- [学习如何执行操作](./input.md)
- [学习如何编写断言](./test-assertions.md)
- [了解更多关于跟踪查看器的信息](/trace-viewer.md)
- [了解更多在 GitHub Actions 上运行测试的方法](/ci.md#github-actions)
- [了解更多在其他 CI 提供商上运行测试的信息](/ci.md)
