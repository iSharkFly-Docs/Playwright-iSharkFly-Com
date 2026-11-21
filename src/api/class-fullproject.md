---
title: FullProject
outline: 2
---

# FullProject

<Badge type="info" text="Added in: v1.10" />

Runtime representation of the test project configuration. It is accessible in the tests via [`testInfo.project`](/api/class-testinfo#test-info-project) and [`workerInfo.project`](/api/class-workerinfo#worker-info-project) and is passed to the test reporters. To see the format of the project in the Playwright configuration file please see [TestProject](/api/class-testproject) instead.

## Properties

### fullProject.dependencies {#full-project-dependencies}

<Badge type="info" text="Added in: v1.31" />

See [`testProject.dependencies`](/api/class-testproject#test-project-dependencies).

**Type**

- `Array<string>`


### fullProject.grep {#full-project-grep}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.grep`](/api/class-testproject#test-project-grep).

**Type**

- `RegExp | Array<RegExp>`


### fullProject.grepInvert {#full-project-grep-invert}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.grepInvert`](/api/class-testproject#test-project-grep-invert).

**Type**

- `null | RegExp | Array<RegExp>`


### fullProject.ignoreSnapshots {#full-project-ignore-snapshots}

<Badge type="info" text="Added in: v1.59" />

See [`testProject.ignoreSnapshots`](/api/class-testproject#test-project-ignore-snapshots).

**Type**

- `boolean`


### fullProject.metadata {#full-project-metadata}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.metadata`](/api/class-testproject#test-project-metadata).

**Type**

- `Metadata`


### fullProject.name {#full-project-name}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.name`](/api/class-testproject#test-project-name).

**Type**

- `string`


### fullProject.outputDir {#full-project-output-dir}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.outputDir`](/api/class-testproject#test-project-output-dir).

**Type**

- `string`


### fullProject.repeatEach {#full-project-repeat-each}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.repeatEach`](/api/class-testproject#test-project-repeat-each).

**Type**

- `int`


### fullProject.retries {#full-project-retries}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.retries`](/api/class-testproject#test-project-retries). When retries are configured as a list, this is the largest `count` in the list.

**Type**

- `int`


### fullProject.snapshotDir {#full-project-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.snapshotDir`](/api/class-testproject#test-project-snapshot-dir).

**Type**

- `string`


### fullProject.teardown {#full-project-teardown}

<Badge type="info" text="Added in: v1.34" />

See [`testProject.teardown`](/api/class-testproject#test-project-teardown).

**Type**

- `string`


### fullProject.testDir {#full-project-test-dir}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.testDir`](/api/class-testproject#test-project-test-dir).

**Type**

- `string`


### fullProject.testIgnore {#full-project-test-ignore}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.testIgnore`](/api/class-testproject#test-project-test-ignore).

**Type**

- `string | RegExp | Array<string | RegExp>`


### fullProject.testMatch {#full-project-test-match}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.testMatch`](/api/class-testproject#test-project-test-match).

**Type**

- `string | RegExp | Array<string | RegExp>`


### fullProject.timeout {#full-project-timeout}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.timeout`](/api/class-testproject#test-project-timeout).

**Type**

- `int`


### fullProject.use {#full-project-use}

<Badge type="info" text="Added in: v1.10" />

See [`testProject.use`](/api/class-testproject#test-project-use).

**Type**

- `Fixtures`


### fullProject.webServer {#full-project-web-server}

<Badge type="info" text="Added in: v1.66" />

The servers configured in [`testProject.webServer`](/api/class-testproject#test-project-web-server), normalized to an array.
Does not include top-level servers.
This property is an empty array in merged reports because server configuration is not serialized.

**Type**

- `Array<Object>`

