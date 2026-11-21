---
title: Suite
outline: 2
---

# Suite

<Badge type="info" text="Added in: v1.10" />

`Suite` is a group of tests. All tests in Playwright Test form the following hierarchy:
* Root suite has a child suite for each [FullProject](/api/class-fullproject).
  * Project suite #1. Has a child suite for each test file in the project.
    * File suite #1
      * [TestCase](/api/class-testcase) #1
      * [TestCase](/api/class-testcase) #2
      * Suite corresponding to a [`test.describe()`](/api/class-test#test-describe) group
        * [TestCase](/api/class-testcase) #1 in a group
        * [TestCase](/api/class-testcase) #2 in a group
      * < more test cases ... >
    * File suite #2
    * < more file suites ... >
  * Project suite #2
  * < more project suites ... >

Reporter is given a root suite in the [`reporter.onBegin()`](/api/class-reporter#reporter-on-begin) method.

## Methods

### suite.allTests() {#suite-all-tests}

<Badge type="info" text="Added in: v1.10" />

Returns the list of all test cases in this suite and its descendants, as opposite to [`suite.tests`](/api/class-suite#suite-tests).

**Returns**

- `Array<TestCase>`


### suite.entries() {#suite-entries}

<Badge type="info" text="Added in: v1.44" />

Test cases and suites defined directly in this suite. The elements are returned in their declaration order. You can differentiate between various entry types by using [`testCase.type`](/api/class-testcase#test-case-type) and [`suite.type`](/api/class-suite#suite-type).

**Returns**

- `Array<TestCase | Suite>`


### suite.project() {#suite-project}

<Badge type="info" text="Added in: v1.10" />

Configuration of the project this suite belongs to, or [void] for the root suite.

**Returns**

- `FullProject | undefined`


### suite.titlePath() {#suite-title-path}

<Badge type="info" text="Added in: v1.10" />

Returns a list of titles from the root down to this suite.

**Returns**

- `Array<string>`


## Properties

### suite.location {#suite-location}

<Badge type="info" text="Added in: v1.10" />

Location in the source where the suite is defined. Missing for root and project suites.

**Type**

- `Location`


### suite.parent {#suite-parent}

<Badge type="info" text="Added in: v1.10" />

Parent suite, missing for the root suite.

**Type**

- `Suite`


### suite.suites {#suite-suites}

<Badge type="info" text="Added in: v1.10" />

Child suites. See [Suite](/api/class-suite) for the hierarchy of suites.

**Type**

- `Array<Suite>`


### suite.tests {#suite-tests}

<Badge type="info" text="Added in: v1.10" />

Test cases in the suite. Note that only test cases defined directly in this suite are in the list. Any test cases defined in nested [`test.describe()`](/api/class-test#test-describe) groups are listed
in the child [`suite.suites`](/api/class-suite#suite-suites).

**Type**

- `Array<TestCase>`


### suite.title {#suite-title}

<Badge type="info" text="Added in: v1.10" />

Suite title.
* Empty for root suite.
* Project name for project suite.
* File path for file suite.
* Title passed to [`test.describe()`](/api/class-test#test-describe) for a group suite.

**Type**

- `string`


### suite.type {#suite-type}

<Badge type="info" text="Added in: v1.44" />

Returns the type of the suite. The Suites form the following hierarchy:
`root` -> `project` -> `file` -> `describe` -> ...`describe` -> `test`.

**Type**

- `"root" | "project" | "file" | "describe"`

