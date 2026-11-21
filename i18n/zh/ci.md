---
title: "持续集成"
---

# 持续集成

## 介绍

Playwright 测试可以在 CI 环境中执行。我们为常见的 CI 提供商创建了示例配置。

让测试在 CI 上运行的 3 个步骤：
1. **确保 CI 代理可以运行浏览器**：在 Linux 代理中使用[我们的 Docker 镜像](./docker.md)，或使用 [CLI](./browsers#install-system-dependencies) 安装依赖。
1. **安装 Playwright**：
   
   ```bash
   # 安装 NPM 包
   npm ci
   
   # 安装 Playwright 浏览器和依赖
   npx playwright install --with-deps
   ```
1. **运行测试**：
   
   ```bash
   npx playwright test
   ```

## 工作进程

我们建议在 CI 环境中将 [workers](./api/class-testconfig.md#test-config-workers) 设置为 "1"，以优先考虑稳定性和可重复性。顺序运行测试确保每个测试获得完整的系统资源，避免潜在冲突。但是，如果您有强大的自托管 CI 系统，可以启用[并行](./test-parallel.md)测试。对于更广泛的并行化，请考虑[分片](./test-parallel.md#shard-tests-between-multiple-machines) - 将测试分布在多个 CI 作业中。

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 在 CI 上选择退出并行测试。
  workers: process.env.CI ? 1 : undefined,
});
```

:::

## 全局超时

始终在 CI 中设置[全局超时](./test-timeouts.md#global-timeout)。默认情况下，测试运行没有上限，因此挂起的测试套件或缓慢增长超过 CI 提供商作业限制的套件会在运行中途被运行器终止，并且不会生成测试报告。

设置 [`testConfig.globalTimeout`](/api/class-testconfig#test-config-global-timeout) 后，Playwright 会自行停止运行。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 一小时后使运行失败，以便报告器仍能生成报告。
  globalTimeout: 60 * 60 * 1000,
});
```

:::

因此，以下示例不设置作业级超时，如 GitHub Actions 中的 `timeout-minutes`。如果您确实要添加，请将其设置为明显高于 `globalTimeout`，以便 Playwright 始终首先停止。

## CI 配置

[命令行工具](./browsers#install-system-dependencies)可用于在 CI 中安装所有操作系统依赖。

### GitHub Actions

#### 在 push/pull_request 时

测试将在 main/master 分支的推送或拉取请求时运行。[工作流](https://docs.github.com/en/actions/using-workflows/about-workflows)将安装所有依赖、安装 Playwright，然后运行测试。它还将创建 HTML 报告。

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

#### 在 push/pull_request 时（分片）

GitHub Actions 支持[在多个作业之间分片测试](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)。查看我们的[分片文档](./test-sharding)以了解更多关于分片的信息，并查看 [GitHub actions 示例](./test-sharding.md#github-actions-example)以了解如何配置作业以在多台机器上运行测试以及如何合并 HTML 报告。

#### 通过容器

GitHub Actions 支持通过 [`jobs.<job_id>.container`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer) 选项[在容器中运行作业](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container)。这有助于避免在主机环境中污染依赖，并为例如截图/视觉回归测试提供跨不同操作系统的一致环境。

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
      image: mcr.microsoft.com/playwright:v%%VERSION%%-noble
      options: --user 1001
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci
      - name: Run your tests
        run: npx playwright test
```

:::

#### 在部署时

这将在 [GitHub 部署](https://developer.github.com/v3/repos/deployments/)进入 `success` 状态后启动测试。Vercel 等服务使用此模式，以便您可以在其部署环境中运行端到端测试。

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
    - uses: actions/setup-node@v6
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
      env:
        PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}
```

:::

#### 快速失败

大型测试套件可能需要很长时间才能执行。通过使用 `--only-changed` 标志执行初步测试运行，您可以首先运行可能失败的测试文件。这将为您提供更快的反馈循环，并在处理拉取请求时稍微降低 CI 消耗。为了检测受更改集影响的测试文件，`--only-changed` 会分析套件的依赖图。这是一种启发式方法，可能会遗漏测试，因此在初步测试运行后始终运行完整的测试套件非常重要。

::: code-group

```yml{23-25} [.github/workflows/playwright.yml]
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
      with:
        # 强制非浅克隆，以便我们可以引用 $GITHUB_BASE_REF。
        # 更多详情请参阅 https://github.com/actions/checkout。
        fetch-depth: 0
    - uses: actions/setup-node@v6
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run changed Playwright tests
      run: npx playwright test --only-changed=origin/$GITHUB_BASE_REF
      if: github.event_name == 'pull_request'
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

### Docker

我们有一个[预构建的 Docker 镜像](./docker.md)，可以直接使用或作为更新现有 Docker 定义的参考。确保遵循[推荐的 Docker 配置](./docker.md#recommended-docker-configuration)以确保最佳性能。

### Azure Pipelines

对于 Windows 或 macOS 代理，无需额外配置，只需安装 Playwright 并运行测试。

对于 Linux 代理，您可以使用[我们的 Docker 容器](./docker.md)配合 Azure Pipelines 支持的[运行容器化作业](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/container-phases?view=azure-devops)。或者，您可以使用[命令行工具](./browsers#install-system-dependencies)安装所有必要的依赖。

对于运行 Playwright 测试，请使用此管道任务：

```yml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: UseNode@1
  inputs:
    version: '22'
  displayName: 'Install Node.js'
- script: npm ci
  displayName: 'npm ci'
- script: npx playwright install --with-deps
  displayName: 'Install Playwright browsers'
- script: npx playwright test
  displayName: 'Run Playwright tests'
  env:
    CI: 'true'
```

#### 使用 Azure Pipelines 上传 playwright-report 文件夹

如果任何 Playwright 测试失败，这将使管道运行失败。如果您还想将测试结果与 Azure DevOps 集成，请使用 `PublishTestResults` 任务，如下所示：

```yml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: UseNode@1
  inputs:
    version: '22'
  displayName: 'Install Node.js'

- script: npm ci
  displayName: 'npm ci'
- script: npx playwright install --with-deps
  displayName: 'Install Playwright browsers'
- script: npx playwright test
  displayName: 'Run Playwright tests'
  env:
    CI: 'true'
- task: PublishTestResults@2
  displayName: 'Publish test results'
  inputs:
    searchFolder: 'test-results'
    testResultsFormat: 'JUnit'
    testResultsFiles: 'e2e-junit-results.xml'
    mergeTestResults: true
    failTaskOnFailedTests: true
    testRunTitle: 'My End-To-End Tests'
  condition: succeededOrFailed()
- task: PublishPipelineArtifact@1
  inputs:
    targetPath: playwright-report
    artifact: playwright-report
    publishLocation: 'pipeline'
  condition: succeededOrFailed()

```

注意：JUnit 报告器需要在 `playwright.config.ts` 中进行相应配置：

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['junit', { outputFile: 'test-results/e2e-junit-results.xml' }]],
});
```

#### Azure Pipelines（分片）

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

strategy:
  matrix:
    chromium-1:
      project: chromium
      shard: 1/3
    chromium-2:
      project: chromium
      shard: 2/3
    chromium-3:
      project: chromium
      shard: 3/3
    firefox-1:
      project: firefox
      shard: 1/3
    firefox-2:
      project: firefox
      shard: 2/3
    firefox-3:
      project: firefox
      shard: 3/3
    webkit-1:
      project: webkit
      shard: 1/3
    webkit-2:
      project: webkit
      shard: 2/3
    webkit-3:
      project: webkit
      shard: 3/3
steps:
- task: UseNode@1
  inputs:
    version: '22'
  displayName: 'Install Node.js'

- script: npm ci
  displayName: 'npm ci'
- script: npx playwright install --with-deps
  displayName: 'Install Playwright browsers'
- script: npx playwright test --project=$(project) --shard=$(shard)
  displayName: 'Run Playwright tests'
  env:
    CI: 'true'
```

#### Azure Pipelines（容器化）

```yml
trigger:
- main

pool:
  vmImage: ubuntu-latest
container: mcr.microsoft.com/playwright:v%%VERSION%%-noble

steps:
- task: UseNode@1
  inputs:
    version: '22'
  displayName: 'Install Node.js'

- script: npm ci
  displayName: 'npm ci'
- script: npx playwright test
  displayName: 'Run Playwright tests'
  env:
    CI: 'true'
```

### CircleCI

在 CircleCI 上运行 Playwright 与在 GitHub Actions 上运行非常相似。为了指定预构建的 Playwright [Docker 镜像](./docker.md)，只需在配置中使用 `docker:` 修改代理定义，如下所示：

```yml
executors:
  pw-noble-development:
    docker:
      - image: mcr.microsoft.com/playwright:v%%VERSION%%-noble
```

注意：使用 docker 代理定义时，您将 Playwright 运行的资源类指定为"medium"层级（[参见此处](https://circleci.com/docs/configuration-reference?#docker-execution-environment)）。Playwright 的默认行为是将工作进程数设置为检测到的核心数（medium 层级为 2）。将工作进程数覆盖为大于此数字将导致不必要的超时和失败。

#### CircleCI 中的分片

CircleCI 中的分片索引从 0 开始，这意味着您需要覆盖默认的并行环境变量。以下示例演示了如何通过将 1 添加到 `CIRCLE_NODE_INDEX` 来传递给 `--shard` CLI 参数，以使用 CircleCI 并行度为 4 运行 Playwright。

```yml
  playwright-job-name:
    executor: pw-noble-development
    parallelism: 4
    steps:
      - run: SHARD="$((${CIRCLE_NODE_INDEX}+1))"; npx playwright test --shard=${SHARD}/${CIRCLE_NODE_TOTAL}
```

### Jenkins

Jenkins 支持管道的 Docker 代理。使用 [Playwright Docker 镜像](./docker.md)在 Jenkins 上运行测试。

```groovy
pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v%%VERSION%%-noble' } }
   stages {
      stage('e2e-tests') {
         steps {
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}
```

### Bitbucket Pipelines

Bitbucket Pipelines 可以使用公共 [Docker 镜像作为构建环境](https://confluence.atlassian.com/bitbucket/use-docker-images-as-build-environments-792298897.html)。要在 Bitbucket 上运行 Playwright 测试，请使用我们的公共 Docker 镜像（[参见 Dockerfile](./docker.md)）。

```yml
image: mcr.microsoft.com/playwright:v%%VERSION%%-noble
```

### GitLab CI

要在 GitLab 上运行 Playwright 测试，请使用我们的公共 Docker 镜像（[参见 Dockerfile](./docker.md)）。

```yml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright:v%%VERSION%%-noble
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

#### 分片

GitLab CI 支持使用 [parallel](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel) 关键字[在多个作业之间分片测试](https://docs.gitlab.com/ee/ci/jobs/job_control.html#parallelize-large-jobs)。测试作业将被分成多个较小的作业并行运行。并行作业按顺序命名为 `job_name 1/N` 到 `job_name N/N`。

```yml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright:v%%VERSION%%-noble
  parallel: 7
  script:
    - npm ci
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
```

GitLab CI 还支持使用 [parallel:matrix](https://docs.gitlab.com/ee/ci/yaml/index.html#parallelmatrix) 选项在多个作业之间分片测试。测试作业将在单个管道中并行运行多次，但每个作业实例具有不同的变量值。在下面的示例中，我们有 2 个 `PROJECT` 值和 10 个 `SHARD` 值，总共产生 20 个要运行的作业。

```yml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright:v%%VERSION%%-noble
  parallel:
    matrix:
      - PROJECT: ['chromium', 'webkit']
        SHARD: ['1/10', '2/10', '3/10', '4/10', '5/10', '6/10', '7/10', '8/10', '9/10', '10/10']
  script:
    - npm ci
    - npx playwright test --project=$PROJECT --shard=$SHARD
```

### Google Cloud Build

要在 Google Cloud Build 上运行 Playwright 测试，请使用我们的公共 Docker 镜像（[参见 Dockerfile](./docker.md)）。

```yml
steps:
- name: mcr.microsoft.com/playwright:v%%VERSION%%-noble
  script:
  ...
  env:
  - 'CI=true'
```

### Drone

要在 Drone 上运行 Playwright 测试，请使用我们的公共 Docker 镜像（[参见 Dockerfile](./docker.md)）。

```yml
kind: pipeline
name: default
type: docker

steps:
  - name: test
    image: mcr.microsoft.com/playwright:v%%VERSION%%-noble
    commands:
      - npx playwright test
```

## 缓存浏览器

不建议缓存浏览器二进制文件，因为恢复缓存所需的时间与下载二进制文件的时间相当。特别是在 Linux 上，需要安装[操作系统依赖](./browsers.md#install-system-dependencies)，这些是不可缓存的。

如果您仍想在 CI 运行之间缓存浏览器二进制文件，请在 CI 配置中针对 Playwright 版本的哈希值缓存[这些目录](./browsers.md#managing-browser-binaries)。

## 调试浏览器启动

Playwright 支持 `DEBUG` 环境变量以在执行期间输出调试日志。将其设置为 `pw:browser` 有助于调试 `Error: Failed to launch browser` 错误。

```bash
DEBUG=pw:browser npx playwright test
```

## 有头运行

默认情况下，Playwright 以无头模式启动浏览器。请参阅我们的[运行测试](./running-tests.md#run-tests-in-headed-mode)指南，了解如何以有头模式运行测试。

在 Linux 代理上，有头执行需要安装 [Xvfb](https://en.wikipedia.org/wiki/Xvfb)。我们的 [Docker 镜像](./docker.md)和 GitHub Action 已预装 Xvfb。要使用 Xvfb 以有头模式运行浏览器，请在实际命令前添加 `xvfb-run`。

```bash
xvfb-run npx playwright test
```
