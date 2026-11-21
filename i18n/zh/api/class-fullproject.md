---
title: FullProject
outline: 2
---

# FullProject

<Badge type="info" text="Added in: v1.10" />

测试项目配置的运行时表示。可以在测试中通过 [`testInfo.project`](/api/class-testinfo#test-info-project) 和 [`workerInfo.project`](/api/class-workerinfo#worker-info-project) 访问，并传递给测试报告器。要查看 Playwright 配置文件中项目的格式，请参阅 [TestProject](/api/class-testproject)。

## 属性

### fullProject.dependencies {#full-project-dependencies}

<Badge type="info" text="Added in: v1.31" />

参见 [`testProject.dependencies`](/api/class-testproject#test-project-dependencies)。

**类型**

- `Array<string>`


### fullProject.grep {#full-project-grep}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.grep`](/api/class-testproject#test-project-grep)。

**类型**

- `RegExp | Array<RegExp>`


### fullProject.grepInvert {#full-project-grep-invert}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.grepInvert`](/api/class-testproject#test-project-grep-invert)。

**类型**

- `null | RegExp | Array<RegExp>`


### fullProject.ignoreSnapshots {#full-project-ignore-snapshots}

<Badge type="info" text="Added in: v1.59" />

参见 [`testProject.ignoreSnapshots`](/api/class-testproject#test-project-ignore-snapshots)。

**类型**

- `boolean`


### fullProject.metadata {#full-project-metadata}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.metadata`](/api/class-testproject#test-project-metadata)。

**类型**

- `Metadata`


### fullProject.name {#full-project-name}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.name`](/api/class-testproject#test-project-name)。

**类型**

- `string`


### fullProject.outputDir {#full-project-output-dir}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.outputDir`](/api/class-testproject#test-project-output-dir)。

**类型**

- `string`


### fullProject.repeatEach {#full-project-repeat-each}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.repeatEach`](/api/class-testproject#test-project-repeat-each)。

**类型**

- `int`


### fullProject.retries {#full-project-retries}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.retries`](/api/class-testproject#test-project-retries)。当重试配置为列表时，这是列表中最大的 `count` 值。

**类型**

- `int`


### fullProject.snapshotDir {#full-project-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.snapshotDir`](/api/class-testproject#test-project-snapshot-dir)。

**类型**

- `string`


### fullProject.teardown {#full-project-teardown}

<Badge type="info" text="Added in: v1.34" />

参见 [`testProject.teardown`](/api/class-testproject#test-project-teardown)。

**类型**

- `string`


### fullProject.testDir {#full-project-test-dir}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.testDir`](/api/class-testproject#test-project-test-dir)。

**类型**

- `string`


### fullProject.testIgnore {#full-project-test-ignore}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.testIgnore`](/api/class-testproject#test-project-test-ignore)。

**类型**

- `string | RegExp | Array<string | RegExp>`


### fullProject.testMatch {#full-project-test-match}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.testMatch`](/api/class-testproject#test-project-test-match)。

**类型**

- `string | RegExp | Array<string | RegExp>`


### fullProject.timeout {#full-project-timeout}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.timeout`](/api/class-testproject#test-project-timeout)。

**类型**

- `int`


### fullProject.use {#full-project-use}

<Badge type="info" text="Added in: v1.10" />

参见 [`testProject.use`](/api/class-testproject#test-project-use)。

**类型**

- `Fixtures`


### fullProject.webServer {#full-project-web-server}

<Badge type="info" text="Added in: v1.66" />

在 [`testProject.webServer`](/api/class-testproject#test-project-web-server) 中配置的服务器，规范化为数组。
不包括顶级服务器。
此属性在合并报告中为空数组，因为服务器配置不会被序列化。

**类型**

- `Array<Object>`
