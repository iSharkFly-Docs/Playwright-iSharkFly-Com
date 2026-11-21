---
title: "设置 CI"
---

# 设置 CI

## 介绍

Playwright 测试可以在任何 CI 提供商上运行。在本节中，我们将介绍如何使用 GitHub Actions 在 GitHub 上运行测试。如果您想了解如何配置其他 CI 提供商，请查看我们关于[持续集成](./ci.md)的详细文档。

#### 您将学习
- [如何设置 GitHub Actions](/ci-intro.md#setting-up-github-actions)
- [如何查看测试日志](/ci-intro.md#viewing-test-logs)
- [如何查看跟踪](/ci-intro.md#viewing-the-trace)

## 设置 GitHub Actions

要添加 [GitHub Actions](https://docs.github.com/en/actions) 文件，首先创建 `.github/workflows` 文件夹，并在其中添加一个包含以下示例代码的 `playwright.yml` 文件，这样您的测试将在每次推送和拉取请求到 main/master 分支时运行。

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
    - name: Set up Python
      uses: actions/setup-python@v6
      with:
        python-version: '3.13'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Ensure browsers are installed
      run: python -m playwright install --with-deps
    - name: Run your tests
      run: pytest --tracing=retain-on-failure
    - uses: actions/upload-artifact@v5
      if: ${{ !cancelled() }}
      with:
        name: playwright-traces
        path: test-results/
```

:::

要了解更多信息，请参阅["了解 GitHub Actions"](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)。

查看 `jobs.test.steps` 中的步骤列表，您可以看到工作流执行以下步骤：
1. 克隆您的仓库
1. 安装语言依赖
1. 安装项目依赖并构建
1. 安装 Playwright 浏览器
1. 运行测试

## 创建仓库并推送到 GitHub

一旦设置好 [GitHub Actions 工作流](#setting-up-github-actions)，您需要做的就是[在 GitHub 上创建一个仓库](https://docs.github.com/en/get-started/quickstart/create-a-repo)或将代码推送到现有仓库。按照 GitHub 上的说明操作，别忘了使用 `git init` 命令[初始化 git 仓库](https://github.com/git-guides/git-init)，这样您就可以[添加](https://github.com/git-guides/git-add)、[提交](https://github.com/git-guides/git-commit)和[推送](https://github.com/git-guides/git-push)您的代码。

###### 
<img height="745" width="1721" alt="创建仓库并推送到 GitHub" src="https://user-images.githubusercontent.com/13063165/183423254-d2735278-a2ab-4d63-bb99-48d8e5e447bc.png"/>

## 打开工作流

点击 **Actions** 选项卡查看工作流。在这里您可以看到测试是通过还是失败。

###### 
<img src="https://user-images.githubusercontent.com/13063165/183423783-58bf2008-514e-4f96-9c12-c9a55703960c.png" alt="打开工作流" width="1678" height="1207" />

## 查看测试日志

点击工作流运行会显示 GitHub 执行的所有操作，点击 **Run Playwright tests** 会显示错误消息、预期值和实际接收值以及调用日志。

###### 
<img src="https://user-images.githubusercontent.com/13063165/183423783-58bf2008-514e-4f96-9c12-c9a55703960c.png" alt="查看测试日志" width="1678" height="1207" />

## 查看跟踪

[trace.playwright.dev](https://trace.playwright.dev) 是 Trace Viewer 的静态托管版本。您可以通过拖放上传跟踪文件。

![playwright 跟踪查看器](/images/getting-started/trace-viewer-failed-test.png)

## 正确处理敏感信息

跟踪文件或控制台日志等工件包含有关测试执行的信息。
它们可能包含敏感数据，如测试用户的用户凭据、登台后端的访问令牌、测试源代码，有时甚至是您的应用程序源代码。像对待敏感数据一样谨慎对待这些文件。
如果您在 CI 工作流中上传报告和跟踪，请确保只将它们上传到受信任的工件存储，或在上传前加密文件。与团队成员共享工件时也是如此：使用受信任的文件共享或在共享前加密文件。

## 下一步
- [了解如何使用定位器](./locators.md)
- [了解如何执行操作](./input.md)
- [了解如何编写断言](./test-assertions.md)
- [了解更多关于 Trace Viewer 的信息](/trace-viewer.md)
- [了解更多在 GitHub Actions 上运行测试的方法](/ci.md#github-actions)
- [了解更多关于在其他 CI 提供商上运行测试的信息](/ci.md)
