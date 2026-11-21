---
title: "持续集成"
---

# 持续集成

## 简介

Playwright 测试可以在 CI 环境中执行。我们为常见的 CI 提供商创建了示例配置。

在 CI 上运行测试的 3 个步骤：
1. **确保 CI 代理可以运行浏览器**：在 Linux 代理上使用[我们的 Docker 镜像](./docker.md)或使用 [CLI](./browsers#install-system-dependencies) 安装依赖项。
1. **安装 Playwright**：
   
   ```bash
   pip install playwright
   playwright install --with-deps
   ```
1. **运行你的测试**：
   
   ```bash
   pytest
   ```

## CI 配置

[命令行工具](./browsers#install-system-dependencies)可用于在 CI 中安装所有操作系统依赖项。

### GitHub Actions

#### 在 push/pull_request 时

测试将在 main/master 分支上的 push 或 pull request 时运行。[工作流](https://docs.github.com/en/actions/using-workflows/about-workflows)将安装所有依赖项，安装 Playwright，然后运行测试。

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

#### 通过容器

GitHub Actions 支持通过使用 [`jobs.<job_id>.container`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer) 选项[在容器中运行作业](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container)。这对于不污染主机环境的依赖项很有用，并且可以在不同操作系统之间为例如截图/视觉回归测试提供一致的环境。

::: code-group

```yml [.github/workflows/playwright.yml]
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  playwright:
    name: 'Playwright Tests'
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright/python:v%%VERSION%%-noble
      options: --user 1001
    steps:
      - uses: actions/checkout@v6
      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: '3.13'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r local-requirements.txt
          pip install -e .
      - name: Run your tests
        run: pytest
```

:::

#### 在部署时

这将在 [GitHub Deployment](https://developer.github.com/v3/repos/deployments/) 进入 `success` 状态后启动测试。像 Vercel 这样的服务使用这种模式，这样你就可以在它们的部署环境上运行端到端测试。

::: code-group

```yml [.github/workflows/playwright.yml]
name: Playwright Tests
on:
  deployment_status:
jobs:
  test:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
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
    - name: Run tests
      run: pytest
      env:
        # 这可能取决于你的测试运行器
        PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}
```

:::

### Docker

我们有一个[预构建的 Docker 镜像](./docker.md)，可以直接使用或作为更新现有 Docker 定义的参考。确保遵循[推荐的 Docker 配置](./docker.md#recommended-docker-configuration)以确保最佳性能。

### Azure Pipelines

对于 Windows 或 macOS 代理，不需要额外配置，只需安装 Playwright 并运行你的测试。

对于 Linux 代理，你可以使用[我们的 Docker 容器](./docker.md)，因为 Azure Pipelines 支持[运行容器化作业](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/container-phases?view=azure-devops)。或者，你可以使用[命令行工具](./browsers#install-system-dependencies)安装所有必要的依赖项。

要运行 Playwright 测试，请使用此流水线任务：

```yml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.13'
  displayName: 'Use Python'
- script: |
    python -m pip install --upgrade pip
    pip install -r requirements.txt
  displayName: 'Install dependencies'
- script: playwright install --with-deps
  displayName: 'Install Playwright browsers'
- script: pytest
  displayName: 'Run Playwright tests'
```

#### Azure Pipelines（容器化）

```yml
trigger:
- main

pool:
  vmImage: ubuntu-latest
container: mcr.microsoft.com/playwright/python:v%%VERSION%%-noble

steps:
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.13'
  displayName: 'Use Python'

- script: |
    python -m pip install --upgrade pip
    pip install -r requirements.txt
  displayName: 'Install dependencies'
- script: pytest
  displayName: 'Run tests'
```

### CircleCI

在 CircleCI 上运行 Playwright 与在 GitHub Actions 上运行非常相似。要指定预构建的 Playwright [Docker 镜像](./docker.md)，只需在你的配置中使用 `docker:` 修改代理定义，如下所示：

```yml
executors:
  pw-noble-development:
    docker:
      - image: mcr.microsoft.com/playwright/python:v%%VERSION%%-noble
```

注意：当使用 docker 代理定义时，你将 playwright 运行的资源类指定为 'medium' 层级[在这里](https://circleci.com/docs/configuration-reference?#docker-execution-environment)。Playwright 的默认行为是将工作者数量设置为检测到的核心数（medium 层级的情况下为 2）。将工作者数量覆盖为大于此数字将导致不必要的超时和失败。

### Jenkins

Jenkins 支持流水线的 Docker 代理。使用 [Playwright Docker 镜像](./docker.md)在 Jenkins 上运行测试。

```groovy
pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright/python:v%%VERSION%%-noble' } }
   stages {
      stage('e2e-tests') {
         steps {
            sh 'pip install -r requirements.txt'
            sh 'pytest'
         }
      }
   }
}
```

### Bitbucket Pipelines

Bitbucket Pipelines 可以使用公共 [Docker 镜像作为构建环境](https://confluence.atlassian.com/bitbucket/use-docker-images-as-build-environments-792298897.html)。要在 Bitbucket 上运行 Playwright 测试，请使用我们的公共 Docker 镜像（[参见 Dockerfile](./docker.md)）。

```yml
image: mcr.microsoft.com/playwright/python:v%%VERSION%%-noble
```

### GitLab CI

要在 GitLab 上运行 Playwright 测试，请使用我们的公共 Docker 镜像（[参见 Dockerfile](./docker.md)）。

```yml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright/python:v%%VERSION%%-noble
  script:
  ...
```

```yml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-noble
  script:
  ...
```

## 缓存浏览器

不建议缓存浏览器二进制文件，因为恢复缓存所需的时间与下载二进制文件所需的时间相当。特别是在 Linux 下，需要安装[操作系统依赖项](./browsers.md#install-system-dependencies)，这些是不可缓存的。

如果你仍想在 CI 运行之间缓存浏览器二进制文件，请在你的 CI 配置中针对 Playwright 版本的哈希值缓存[这些目录](./browsers.md#managing-browser-binaries)。

## 调试浏览器启动

Playwright 支持 `DEBUG` 环境变量在执行期间输出调试日志。将其设置为 `pw:browser` 对于调试 `Error: Failed to launch browser` 错误很有帮助。

```bash
DEBUG=pw:browser pytest
```

## 有界面运行

默认情况下，Playwright 以无头模式启动浏览器。请参阅我们的[运行测试](./running-tests.md#run-tests-in-headed-mode)指南了解如何以有界面模式运行测试。

在 Linux 代理上，有界面执行需要安装 [Xvfb](https://en.wikipedia.org/wiki/Xvfb)。我们的 [Docker 镜像](./docker.md)和 GitHub Action 已预装 Xvfb。要使用 Xvfb 以有界面模式运行浏览器，请在实际命令前添加 `xvfb-run`。

```bash
xvfb-run pytest
```
