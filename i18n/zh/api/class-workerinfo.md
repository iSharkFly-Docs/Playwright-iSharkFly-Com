---
title: WorkerInfo
outline: 2
---

# WorkerInfo

<Badge type="info" text="新增于: v1.10" />

`WorkerInfo` 包含有关正在运行测试的 worker 的信息，可用于 worker 作用域的 fixtures。`WorkerInfo` 是 [TestInfo](/api/class-testinfo) 的子集，在许多其他地方也可使用。

## 属性

### workerInfo.config {#worker-info-config}

<Badge type="info" text="新增于: v1.10" />

来自[配置文件](../test-configuration.md)的已处理配置。

**类型**

- `FullConfig`


### workerInfo.parallelIndex {#worker-info-parallel-index}

<Badge type="info" text="新增于: v1.10" />

worker 的索引，范围在 `0` 和 `workers - 1` 之间。保证同时运行的 worker 具有不同的 `parallelIndex`。当 worker 重新启动时（例如在失败后），新的 worker 进程具有相同的 `parallelIndex`。

也可以通过 `process.env.TEST_PARALLEL_INDEX` 获取。了解更多关于 Playwright Test 的[并行和分片](../test-parallel.md)。

**类型**

- `int`


### workerInfo.project {#worker-info-project}

<Badge type="info" text="新增于: v1.10" />

来自[配置文件](../test-configuration.md)的已处理项目配置。

**类型**

- `FullProject`


### workerInfo.workerIndex {#worker-info-worker-index}

<Badge type="info" text="新增于: v1.10" />

正在运行测试的 worker 进程的唯一索引。当 worker 重新启动时（例如在失败后），新的 worker 进程会获得一个新的唯一 `workerIndex`。

也可以通过 `process.env.TEST_WORKER_INDEX` 获取。了解更多关于 Playwright Test 的[并行和分片](../test-parallel.md)。

**类型**

- `int`
