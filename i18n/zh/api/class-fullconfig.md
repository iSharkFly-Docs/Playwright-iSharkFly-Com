---
title: FullConfig
outline: 2
---

# FullConfig

<Badge type="info" text="Added in: v1.10" />

已解析的配置，可通过 [`testInfo.config`](/api/class-testinfo#test-info-config) 访问，并传递给测试报告器。要查看 Playwright 配置文件的格式，请参阅 [TestConfig](/api/class-testconfig)。

## 属性

### fullConfig.argv {#full-config-argv}

<Badge type="info" text="Added in: v1.61" />

在运行器进程中捕获的 [`process.argv`](https://nodejs.org/api/process.html#processargv) 快照。用于读取自定义命令行参数 - 例如，在 `--` 分隔符之后提供的参数（`npx playwright test -- --build-path=./out`）。Playwright 不会解析这些参数；使用者需要使用任何参数解析库自行切片和解释它们。

**类型**

- `Array<string>`


### fullConfig.configFile {#full-config-config-file}

<Badge type="info" text="Added in: v1.20" />

用于运行测试的配置文件路径。如果未使用配置文件，则值为空字符串。

**类型**

- `string`


### fullConfig.failOnFlakyTests {#full-config-fail-on-flaky-tests}

<Badge type="info" text="Added in: v1.61" />

参见 [`testConfig.failOnFlakyTests`](/api/class-testconfig#test-config-fail-on-flaky-tests)。

**类型**

- `boolean`


### fullConfig.filteredProjects {#full-config-filtered-projects}

<Badge type="info" text="Added in: v1.64" />

应用 `--project` 命令行过滤器后选择运行的项目列表。未指定过滤器时，这与 [`fullConfig.projects`](/api/class-fullconfig#full-config-projects) 相同。

**类型**

- `Array<FullProject>`


### fullConfig.forbidOnly {#full-config-forbid-only}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.forbidOnly`](/api/class-testconfig#test-config-forbid-only)。

**类型**

- `boolean`


### fullConfig.fullyParallel {#full-config-fully-parallel}

<Badge type="info" text="Added in: v1.20" />

参见 [`testConfig.fullyParallel`](/api/class-testconfig#test-config-fully-parallel)。

**类型**

- `boolean`


### fullConfig.globalSetup {#full-config-global-setup}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.globalSetup`](/api/class-testconfig#test-config-global-setup)。

**类型**

- `null | string`


### fullConfig.globalTeardown {#full-config-global-teardown}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.globalTeardown`](/api/class-testconfig#test-config-global-teardown)。

**类型**

- `null | string`


### fullConfig.globalTimeout {#full-config-global-timeout}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.globalTimeout`](/api/class-testconfig#test-config-global-timeout)。

**类型**

- `int`


### fullConfig.grep {#full-config-grep}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.grep`](/api/class-testconfig#test-config-grep)。

**类型**

- `RegExp | Array<RegExp>`


### fullConfig.grepInvert {#full-config-grep-invert}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.grepInvert`](/api/class-testconfig#test-config-grep-invert)。

**类型**

- `null | RegExp | Array<RegExp>`


### fullConfig.maxFailures {#full-config-max-failures}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.maxFailures`](/api/class-testconfig#test-config-max-failures)。

**类型**

- `int`


### fullConfig.metadata {#full-config-metadata}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.metadata`](/api/class-testconfig#test-config-metadata)。

**类型**

- `Metadata`


### fullConfig.preserveOutput {#full-config-preserve-output}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.preserveOutput`](/api/class-testconfig#test-config-preserve-output)。

**类型**

- `"always" | "never" | "failures-only"`


### fullConfig.projects {#full-config-projects}

<Badge type="info" text="Added in: v1.10" />

已解析项目的列表。

**类型**

- `Array<FullProject>`


### fullConfig.quiet {#full-config-quiet}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.quiet`](/api/class-testconfig#test-config-quiet)。

**类型**

- `boolean`


### fullConfig.reporter {#full-config-reporter}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.reporter`](/api/class-testconfig#test-config-reporter)。

**类型**

- `string | Array<Object> | "list" | "dot" | "failures" | "line" | "github" | "json" | "junit" | "null" | "html" | "blob" | "perfetto"`


### fullConfig.reportSlowTests {#full-config-report-slow-tests}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.reportSlowTests`](/api/class-testconfig#test-config-report-slow-tests)。

**类型**

- `null | Object`


### fullConfig.rootDir {#full-config-root-dir}

<Badge type="info" text="Added in: v1.20" />

报告器中所有相对路径的基础目录。

**类型**

- `string`


### fullConfig.shard {#full-config-shard}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.shard`](/api/class-testconfig#test-config-shard)。

**类型**

- `null | Object`


### fullConfig.tags {#full-config-tags}

<Badge type="info" text="Added in: v1.57" />

已解析的全局标签。参见 [`testConfig.tag`](/api/class-testconfig#test-config-tag)。

**类型**

- `Array<string>`


### fullConfig.updateSnapshots {#full-config-update-snapshots}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.updateSnapshots`](/api/class-testconfig#test-config-update-snapshots)。

**类型**

- `"all" | "changed" | "missing" | "none" | "default"`


### fullConfig.updateSourceMethod {#full-config-update-source-method}

<Badge type="info" text="Added in: v1.50" />

参见 [`testConfig.updateSourceMethod`](/api/class-testconfig#test-config-update-source-method)。

**类型**

- `"overwrite" | "3way" | "patch"`


### fullConfig.version {#full-config-version}

<Badge type="info" text="Added in: v1.20" />

Playwright 版本。

**类型**

- `string`


### fullConfig.webServer {#full-config-web-server}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.webServer`](/api/class-testconfig#test-config-web-server)。
此属性在合并报告中为 `null`，因为服务器配置不会被序列化。

**类型**

- `null | Object`


### fullConfig.workers {#full-config-workers}

<Badge type="info" text="Added in: v1.10" />

参见 [`testConfig.workers`](/api/class-testconfig#test-config-workers)。

**类型**

- `int`
