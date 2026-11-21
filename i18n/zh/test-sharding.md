---
title: "分片"
---

# 分片

## 介绍

默认情况下，Playwright 会[并行](./test-parallel.md)运行测试文件，并力求最佳利用机器上的 CPU 核心。为了实现更大的并行化，你可以通过在多台机器上同时运行测试来进一步扩展 Playwright 测试执行。我们将这种操作模式称为"分片"。Playwright 中的分片意味着将测试分成更小的部分，称为"分片"。每个分片就像一个可以独立运行的单独作业。整个目的是划分测试以加快测试运行时间。

当你对测试进行分片时，每个分片可以独立运行，利用可用的 CPU 核心。这有助于通过同时执行任务来加速测试过程。

在 CI 流水线中，每个分片可以作为单独的作业运行，利用 CI 流水线中可用的硬件资源（如 CPU 核心）来更快地运行测试。

## 在多台机器之间分片测试

要分片测试套件，请在命令行中传递 `--shard=x/y`。例如，要将套件分成四个分片，每个运行四分之一的测试：

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

现在，如果你在不同的作业上并行运行这些分片，你的测试套件完成速度将提高四倍。

请注意，Playwright 只能分片可以并行运行的测试。默认情况下，这意味着 Playwright 将分片测试文件。在[并行指南](./test-parallel.md)中了解其他选项。

## 平衡分片

分片可以在两个粒度级别上进行，取决于你是否使用 [`testProject.fullyParallel`](/api/class-testproject#test-project-fully-parallel) 选项。这会影响测试如何在分片之间平衡。

**使用 fullyParallel 进行分片**

当启用 `fullyParallel: true` 时，Playwright Test 会在多个分片之间并行运行单个测试，确保每个分片接收到均匀分布的测试。这允许测试级别的粒度，意味着每个分片将尝试平衡它运行的单个测试数量。这是在分片时确保负载均匀分布的首选模式，因为 Playwright 可以根据测试总数优化分片执行。

**不使用 fullyParallel 进行分片**

如果没有 fullyParallel 设置，Playwright Test 默认使用文件级别的粒度，意味着整个测试文件被分配给分片（注意同一文件可能在不同项目中被分配到不同的分片）。在这种情况下，每个文件的测试数量会极大地影响分片分布。如果你的测试文件大小不均匀（即某些文件包含比其他文件多得多的测试），某些分片可能会运行明显更多的测试，而其他分片可能运行更少甚至没有。

**关键要点：**
- **使用** `fullyParallel: true`：测试在单个测试级别分割，导致更平衡的分片执行。
- **不使用** `fullyParallel`：测试在文件级别分割，因此为了平衡分片，保持测试文件小且大小均匀很重要。
- 为确保最有效地使用分片，特别是在 CI 环境中，当追求跨分片的平衡分布时，建议使用 `fullyParallel: true`。否则，你可能需要手动组织测试文件以避免不平衡。
- 静态跳过的测试，例如使用 [`test.skip()`](/api/class-test#test-skip) 或 [`test.fixme()`](/api/class-test#test-fixme)，在平衡分片时不计入，因为它们不运行。

## 合并来自多个分片的报告

在前面的示例中，每个测试分片都有自己的测试报告。如果你想要一个显示所有分片的所有测试结果的合并报告，你可以合并它们。

首先在 CI 上运行时向配置添加 `blob` 报告器：

::: code-group

```js [playwright.config.ts]
export default defineConfig({
  testDir: './tests',
  reporter: process.env.CI ? 'blob' : 'html',
});
```

:::

Blob 报告包含有关所有运行的测试及其结果的信息，以及所有测试附件，如跟踪和截图差异。Blob 报告可以合并并转换为任何其他 Playwright 报告。默认情况下，blob 报告将生成到 `blob-report` 目录中。你可以在[这里了解 blob 报告选项](./test-reporters.md#blob-reporter)。

要合并来自多个分片的报告，请将 blob 报告文件放入单个目录，例如 `all-blob-reports`。Blob 报告名称包含分片编号，因此它们不会冲突。

之后，运行 `npx playwright merge-reports` 命令：

```bash
npx playwright merge-reports --reporter html ./all-blob-reports
```

这将在 `playwright-report` 目录中生成标准的 HTML 报告。

## GitHub Actions 示例

GitHub Actions 支持使用 [`jobs.<job_id>.strategy.matrix`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) 选项[在多个作业之间分片测试](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)。`matrix` 选项将为提供的选项的每个可能组合运行单独的作业。

以下示例向你展示如何配置作业以在四台机器上并行运行测试，然后将报告合并为单个报告。不要忘记像上面的示例一样在 `playwright.config.ts` 文件中添加 `reporter: process.env.CI ? 'blob' : 'html',`。
1. 首先，我们向作业配置添加一个 `matrix` 选项，其中 `shardTotal: [4]` 选项包含我们要创建的分片总数，`shardIndex: [1, 2, 3, 4]` 包含分片编号数组。
1. 然后我们使用 `--shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}` 选项运行 Playwright 测试。这将为每个分片运行我们的测试命令。
1. 最后，我们将 blob 报告上传到 GitHub Actions Artifacts。这将使 blob 报告可供工作流中的其他作业使用。

::: code-group

```yaml [.github/workflows/playwright.yml]
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-node@v6
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright browsers
      run: npx playwright install --with-deps

    - name: Run Playwright tests
      run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

    - name: Upload blob report to GitHub Actions Artifacts
      if: ${{ !cancelled() }}
      uses: actions/upload-artifact@v5
      with:
        name: blob-report-${{ matrix.shardIndex }}
        path: blob-report
        retention-days: 1
```

:::
1. 在所有分片完成后，你可以运行一个单独的作业来合并报告并生成一个合并的 [HTML 报告](./test-reporters.md#html-reporter)。为确保执行顺序，我们通过添加 `needs: [playwright-tests]` 使 `merge-reports` 作业[依赖](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow#defining-prerequisite-jobs)于分片的 `playwright-tests` 作业。

::: code-group

```yaml [.github/workflows/playwright.yml]
jobs:
...
  merge-reports:
    # 在 playwright-tests 之后合并报告，即使某些分片失败
    if: ${{ !cancelled() }}
    needs: [playwright-tests]

    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-node@v6
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci

    - name: Download blob reports from GitHub Actions Artifacts
      uses: actions/download-artifact@v5
      with:
        path: all-blob-reports
        pattern: blob-report-*
        merge-multiple: true

    - name: Merge into HTML Report
      run: npx playwright merge-reports --reporter html ./all-blob-reports

    - name: Upload HTML report
      uses: actions/upload-artifact@v5
      with:
        name: html-report--attempt-${{ github.run_attempt }}
        path: playwright-report
        retention-days: 14
```

:::

现在你可以看到报告已被合并，合并的 HTML 报告可在 GitHub Actions Artifacts 选项卡中获得。

<img height="1610" width="1750" alt="image" src="https://github.com/microsoft/playwright/assets/9798949/b69dac59-fc19-4b98-8f49-814b1c29ca02" />

## 合并来自多个环境的报告

如果你想在多个环境中运行相同的测试（而不是将测试分片到多台机器），你需要区分这些环境。

在这种情况下，指定 [`testConfig.tag`](/api/class-testconfig#test-config-tag) 属性很有用，可以用环境名称标记所有测试。此标签将被 blob 报告自动获取，之后被合并工具获取。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: process.env.CI ? 'blob' : 'html',
  tag: process.env.CI_ENVIRONMENT_NAME,  // 例如 "@APIv2"
});
```

:::

## Merge-reports CLI

`npx playwright merge-reports path/to/blob-reports-dir` 读取传递目录中的所有 blob 报告并将它们合并为单个报告。

当合并来自不同操作系统的报告时，你需要提供明确的合并配置来消除应该将哪个目录用作测试根目录的歧义。

支持的选项：
- `--reporter reporter-to-use`
  
  生成哪种报告。可以是多个报告器，用逗号分隔。
  
  示例：
  
  ```bash
  npx playwright merge-reports --reporter=html,github ./blob-reports
  ```
- `--config path/to/config/file`
  
  指定带有输出报告器的 Playwright 配置文件。使用此选项向输出报告器传递额外配置。此配置文件可以与创建 blob 报告时使用的配置文件不同。
  
  示例：
  
  ```bash
  npx playwright merge-reports --config=merge.config.ts ./blob-reports
  ```
  
  ::: code-group
  
  ```js [merge.config.ts]
  export default {
    testDir: 'e2e',
    reporter: [['html', { open: 'never' }]],
  };
  ```
  
  :::
