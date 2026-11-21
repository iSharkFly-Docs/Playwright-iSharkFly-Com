---
title: FullConfig
outline: 2
---

# FullConfig

<Badge type="info" text="Added in: v1.10" />

Resolved configuration which is accessible via [`testInfo.config`](/api/class-testinfo#test-info-config) and is passed to the test reporters. To see the format of Playwright configuration file, please see [TestConfig](/api/class-testconfig) instead.

## Properties

### fullConfig.argv {#full-config-argv}

<Badge type="info" text="Added in: v1.61" />

Snapshot of [`process.argv`](https://nodejs.org/api/process.html#processargv)
captured in the runner process. Useful for reading custom command-line
arguments — for example, args supplied after the `--` separator
(`npx playwright test -- --build-path=./out`). Playwright does not parse
these; consumers are responsible for slicing and interpreting them with
any argument-parsing library.

**Type**

- `Array<string>`


### fullConfig.configFile {#full-config-config-file}

<Badge type="info" text="Added in: v1.20" />

Path to the configuration file used to run the tests. The value is an empty string if no config file was used.

**Type**

- `string`


### fullConfig.failOnFlakyTests {#full-config-fail-on-flaky-tests}

<Badge type="info" text="Added in: v1.61" />

See [`testConfig.failOnFlakyTests`](/api/class-testconfig#test-config-fail-on-flaky-tests).

**Type**

- `boolean`


### fullConfig.filteredProjects {#full-config-filtered-projects}

<Badge type="info" text="Added in: v1.64" />

List of projects that were selected to run, after applying the `--project` command line filter. When no filter is specified, this is the same as [`fullConfig.projects`](/api/class-fullconfig#full-config-projects).

**Type**

- `Array<FullProject>`


### fullConfig.forbidOnly {#full-config-forbid-only}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.forbidOnly`](/api/class-testconfig#test-config-forbid-only).

**Type**

- `boolean`


### fullConfig.fullyParallel {#full-config-fully-parallel}

<Badge type="info" text="Added in: v1.20" />

See [`testConfig.fullyParallel`](/api/class-testconfig#test-config-fully-parallel).

**Type**

- `boolean`


### fullConfig.globalSetup {#full-config-global-setup}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.globalSetup`](/api/class-testconfig#test-config-global-setup).

**Type**

- `null | string`


### fullConfig.globalTeardown {#full-config-global-teardown}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.globalTeardown`](/api/class-testconfig#test-config-global-teardown).

**Type**

- `null | string`


### fullConfig.globalTimeout {#full-config-global-timeout}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.globalTimeout`](/api/class-testconfig#test-config-global-timeout).

**Type**

- `int`


### fullConfig.grep {#full-config-grep}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.grep`](/api/class-testconfig#test-config-grep).

**Type**

- `RegExp | Array<RegExp>`


### fullConfig.grepInvert {#full-config-grep-invert}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.grepInvert`](/api/class-testconfig#test-config-grep-invert).

**Type**

- `null | RegExp | Array<RegExp>`


### fullConfig.maxFailures {#full-config-max-failures}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.maxFailures`](/api/class-testconfig#test-config-max-failures).

**Type**

- `int`


### fullConfig.metadata {#full-config-metadata}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.metadata`](/api/class-testconfig#test-config-metadata).

**Type**

- `Metadata`


### fullConfig.preserveOutput {#full-config-preserve-output}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.preserveOutput`](/api/class-testconfig#test-config-preserve-output).

**Type**

- `"always" | "never" | "failures-only"`


### fullConfig.projects {#full-config-projects}

<Badge type="info" text="Added in: v1.10" />

List of resolved projects.

**Type**

- `Array<FullProject>`


### fullConfig.quiet {#full-config-quiet}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.quiet`](/api/class-testconfig#test-config-quiet).

**Type**

- `boolean`


### fullConfig.reporter {#full-config-reporter}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.reporter`](/api/class-testconfig#test-config-reporter).

**Type**

- `string | Array<Object> | "list" | "dot" | "failures" | "line" | "github" | "json" | "junit" | "null" | "html" | "blob" | "perfetto"`


### fullConfig.reportSlowTests {#full-config-report-slow-tests}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.reportSlowTests`](/api/class-testconfig#test-config-report-slow-tests).

**Type**

- `null | Object`


### fullConfig.rootDir {#full-config-root-dir}

<Badge type="info" text="Added in: v1.20" />

Base directory for all relative paths used in the reporters.

**Type**

- `string`


### fullConfig.shard {#full-config-shard}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.shard`](/api/class-testconfig#test-config-shard).

**Type**

- `null | Object`


### fullConfig.tags {#full-config-tags}

<Badge type="info" text="Added in: v1.57" />

Resolved global tags. See [`testConfig.tag`](/api/class-testconfig#test-config-tag).

**Type**

- `Array<string>`


### fullConfig.updateSnapshots {#full-config-update-snapshots}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.updateSnapshots`](/api/class-testconfig#test-config-update-snapshots).

**Type**

- `"all" | "changed" | "missing" | "none" | "default"`


### fullConfig.updateSourceMethod {#full-config-update-source-method}

<Badge type="info" text="Added in: v1.50" />

See [`testConfig.updateSourceMethod`](/api/class-testconfig#test-config-update-source-method).

**Type**

- `"overwrite" | "3way" | "patch"`


### fullConfig.version {#full-config-version}

<Badge type="info" text="Added in: v1.20" />

Playwright version.

**Type**

- `string`


### fullConfig.webServer {#full-config-web-server}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.webServer`](/api/class-testconfig#test-config-web-server).
This property is `null` in merged reports because server configuration is not serialized.

**Type**

- `null | Object`


### fullConfig.workers {#full-config-workers}

<Badge type="info" text="Added in: v1.10" />

See [`testConfig.workers`](/api/class-testconfig#test-config-workers).

**Type**

- `int`

