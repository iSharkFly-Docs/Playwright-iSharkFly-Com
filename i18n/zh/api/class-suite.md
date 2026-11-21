---
title: Suite
outline: 2
---

# Suite

<Badge type="info" text="Added in: v1.10" />

`Suite` 是一组测试。Playwright Test 中的所有测试形成以下层次结构：
* 根套件为每个 [FullProject](/api/class-fullproject) 包含一个子套件。
  * 项目套件 #1。为项目中的每个测试文件包含一个子套件。
    * 文件套件 #1
      * [TestCase](/api/class-testcase) #1
      * [TestCase](/api/class-testcase) #2
      * 对应 [`test.describe()`](/api/class-test#test-describe) 组的套件
        * 组中的 [TestCase](/api/class-testcase) #1
        * 组中的 [TestCase](/api/class-testcase) #2
      * < 更多测试用例 ... >
    * 文件套件 #2
    * < 更多文件套件 ... >
  * 项目套件 #2
  * < 更多项目套件 ... >

报告器在 [`reporter.onBegin()`](/api/class-reporter#reporter-on-begin) 方法中接收根套件。

## 方法

### suite.allTests() {#suite-all-tests}

<Badge type="info" text="Added in: v1.10" />

返回此套件及其后代中所有测试用例的列表，与 [`suite.tests`](/api/class-suite#suite-tests) 相对。

**返回值**

- `Array<TestCase>`


### suite.entries() {#suite-entries}

<Badge type="info" text="Added in: v1.44" />

直接在此套件中定义的测试用例和套件。元素按其声明顺序返回。你可以使用 [`testCase.type`](/api/class-testcase#test-case-type) 和 [`suite.type`](/api/class-suite#suite-type) 来区分不同的条目类型。

**返回值**

- `Array<TestCase | Suite>`


### suite.project() {#suite-project}

<Badge type="info" text="Added in: v1.10" />

此套件所属项目的配置，对于根套件为 [void]。

**返回值**

- `FullProject | undefined`


### suite.titlePath() {#suite-title-path}

<Badge type="info" text="Added in: v1.10" />

返回从根到此套件的标题列表。

**返回值**

- `Array<string>`


## 属性

### suite.location {#suite-location}

<Badge type="info" text="Added in: v1.10" />

套件在源代码中定义的位置。根套件和项目套件没有此属性。

**类型**

- `Location`


### suite.parent {#suite-parent}

<Badge type="info" text="Added in: v1.10" />

父套件，根套件没有此属性。

**类型**

- `Suite`


### suite.suites {#suite-suites}

<Badge type="info" text="Added in: v1.10" />

子套件。参见 [Suite](/api/class-suite) 了解套件的层次结构。

**类型**

- `Array<Suite>`


### suite.tests {#suite-tests}

<Badge type="info" text="Added in: v1.10" />

套件中的测试用例。注意只有直接在此套件中定义的测试用例在列表中。任何在嵌套的 [`test.describe()`](/api/class-test#test-describe) 组中定义的测试用例都列在子 [`suite.suites`](/api/class-suite#suite-suites) 中。

**类型**

- `Array<TestCase>`


### suite.title {#suite-title}

<Badge type="info" text="Added in: v1.10" />

套件标题。
* 根套件为空。
* 项目套件为项目名称。
* 文件套件为文件路径。
* 组套件为传递给 [`test.describe()`](/api/class-test#test-describe) 的标题。

**类型**

- `string`


### suite.type {#suite-type}

<Badge type="info" text="Added in: v1.44" />

返回套件的类型。套件形成以下层次结构：
`root` -> `project` -> `file` -> `describe` -> ...`describe` -> `test`。

**类型**

- `"root" | "project" | "file" | "describe"`
