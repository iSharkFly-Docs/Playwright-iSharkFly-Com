---
title: "设置 CI"
---

# 设置 CI

## 简介

Playwright 测试可以在任何 CI 提供商上运行。在本节中，我们将介绍如何使用 GitHub Actions 在 GitHub 上运行测试。如果您想了解如何配置其他 CI 提供商，请查看我们关于[持续集成](./ci.md)的详细文档。

#### 您将学习
- [如何设置 GitHub Actions](/ci-intro.md#setting-up-github-actions)
- [如何查看测试日志](/ci-intro.md#viewing-test-logs)
- [如何查看追踪信息](/ci-intro.md#viewing-the-trace)

## 设置 GitHub Actions

要添加 [GitHub Actions](https://docs.github.com/en/actions) 文件，首先创建 `.github/workflows` 文件夹，然后在其中添加一个包含以下示例代码的 `playwright.yml` 文件，这样您的测试就会在每次向 main/master 分支推送和发起拉取请求时运行。

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
    - name: Setup dotnet
      uses: actions/setup-dotnet@v5
      with:
        dotnet-version: 8.0.x
    - name: Build & Install
      run: dotnet build
    - name: Ensure browsers are installed
      run: pwsh bin/Debug/net8.0/playwright.ps1 install --with-deps
    - name: Run your tests
      run: dotnet test
```

:::

要了解更多信息，请参阅["理解 GitHub Actions"](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)。

查看 `jobs.test.steps` 中的步骤列表，您可以看到工作流执行了以下步骤：
1. 克隆您的仓库
1. 安装语言依赖项
1. 安装项目依赖项并构建
1. 安装 Playwright 浏览器
1. 运行测试

## 创建仓库并推送到 GitHub

一旦您设置好 [GitHub Actions 工作流](#setting-up-github-actions)，您只需要[在 GitHub 上创建一个仓库](https://docs.github.com/en/get-started/quickstart/create-a-repo)或将代码推送到现有仓库。按照 GitHub 上的说明操作，不要忘记使用 `git init` 命令[初始化 git 仓库](https://github.com/git-guides/git-init)，这样您就可以[添加](https://github.com/git-guides/git-add)、[提交](https://github.com/git-guides/git-commit)和[推送](https://github.com/git-guides/git-push)您的代码。

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/4f1b4cc3-b850-4d60-a99e-24057eaf91ad" alt="GitHub 上的 dotnet 仓库" width="2802" height="1570" />

## 打开工作流

点击 **Actions** 选项卡查看工作流。在这里您可以看到测试是通过还是失败。

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/71793c09-0815-4faa-866b-85684a1f87e5" alt="打开工作流" width="2812" height="824" />

在拉取请求中，您还可以点击 [PR 状态检查](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)中的 **Details** 链接。

<img height="404" width="1290" alt="PR 状态检查" src="https://user-images.githubusercontent.com/13063165/183722462-17a985db-0e10-4205-b16c-8aaac36117b9.png" />

## 查看测试日志

点击工作流运行可以显示 GitHub 执行的所有操作，点击 **Run Playwright tests** 可以显示错误消息、预期值和实际值以及调用日志。

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/ba2d8d7b-ffce-42de-95e0-bcb35c421975" alt="查看测试日志" width="2794" height="1858" />

## 查看追踪信息

您可以将在 CI（如 GitHub Actions）上创建的追踪作为工件上传。这需要[启动和停止追踪](./trace-viewer-intro#recording-a-trace)。我们建议只为失败的测试记录追踪。一旦您的追踪上传到 CI，就可以下载并使用 [trace.playwright.dev](https://trace.playwright.dev) 打开，这是追踪查看器的静态托管版本。您可以通过拖放来上传追踪文件。

###### 
![playwright 追踪查看器](/images/getting-started/trace-viewer-failed-test.png)

## 正确处理敏感信息

追踪文件或控制台日志等工件包含有关测试执行的信息。
它们可能包含敏感数据，如测试用户的用户凭据、暂存后端的访问令牌、测试源代码，有时甚至是您的应用程序源代码。请像处理敏感数据一样谨慎处理这些文件。
如果您在 CI 工作流中上传报告和追踪，请确保只将它们上传到受信任的工件存储，或者在上传前对文件进行加密。与团队成员共享工件时也是如此：使用受信任的文件共享或在共享前对文件进行加密。

## 下一步
- [学习如何使用定位器](./locators.md)
- [学习如何执行操作](./input.md)
- [学习如何编写断言](./test-assertions.md)
- [了解更多关于追踪查看器的信息](/trace-viewer.md)
- [了解更多在 GitHub Actions 上运行测试的方法](/ci.md#github-actions)
- [了解更多在其他 CI 提供商上运行测试的信息](/ci.md)
