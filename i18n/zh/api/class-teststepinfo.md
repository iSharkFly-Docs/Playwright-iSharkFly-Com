---
title: TestStepInfo
outline: 2
---

# TestStepInfo

<Badge type="info" text="Added in: v1.51" />

`TestStepInfo` 包含有关当前运行的测试步骤的信息。它作为参数传递给步骤函数。`TestStepInfo` 提供控制测试步骤执行的实用程序。

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page, browserName }) => {
  await test.step('check some behavior', async step => {
    step.skip(browserName === 'webkit', 'The feature is not available in WebKit');
    // ... 步骤代码的其余部分
  });
});
```

## 方法

### testStepInfo.attach() {#test-step-info-attach}

<Badge type="info" text="Added in: v1.51" /> <Badge type="tip" text="async" />

将值或磁盘上的文件附加到当前测试步骤。某些报告器会显示测试步骤附件。必须指定 [`path`](/api/class-teststepinfo#test-step-info-attach-option-path) 或 [`body`](/api/class-teststepinfo#test-step-info-attach-option-body) 之一，但不能同时指定两者。调用此方法会将附件归属于该步骤，而 [`testInfo.attach()`](/api/class-testinfo#test-info-attach) 将所有附件存储在测试级别。

例如，您可以将截图附加到测试步骤：

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await test.step('check page rendering', async step => {
    const screenshot = await page.screenshot();
    await step.attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });
});
```

或者您可以附加 API 返回的文件：

```js
import { test, expect } from '@playwright/test';
import { download } from './my-custom-helpers';

test('basic test', async ({}) => {
  await test.step('check download behavior', async step => {
    const tmpPath = await download('a');
    await step.attach('downloaded', { path: tmpPath });
  });
});
```

::: info
[`testStepInfo.attach()`](/api/class-teststepinfo#test-step-info-attach) 会自动将附加的文件复制到报告器可以访问的位置。您可以在等待 attach 调用后安全地删除附件。
:::

**参数**

- <a id="test-step-info-attach-option-name"></a>`name` `string`

  附件名称。该名称也会被清理并用作保存到磁盘时的文件名前缀。
- <a id="test-step-info-attach-option-options"></a>`options` `Object` *(可选)*

  - <a id="test-step-info-attach-option-body"></a>`body` `string | Buffer` *(可选)*

    附件内容。与 [`path`](/api/class-teststepinfo#test-step-info-attach-option-path) 互斥。
  - <a id="test-step-info-attach-option-content-type"></a>`contentType` `string` *(可选)*

    此附件的内容类型，以便在报告中正确显示，例如 `'application/json'` 或 `'image/png'`。如果省略，则根据 [`path`](/api/class-teststepinfo#test-step-info-attach-option-path) 推断内容类型，或者对于 [string] 附件默认为 `text/plain`，对于 [Buffer] 附件默认为 `application/octet-stream`。
  - <a id="test-step-info-attach-option-path"></a>`path` `string` *(可选)*

    文件系统上附加文件的路径。与 [`body`](/api/class-teststepinfo#test-step-info-attach-option-body) 互斥。


### testStepInfo.skip() {#test-step-info-skip-1}

<Badge type="info" text="Added in: v1.51" />

中止当前运行的步骤并将其标记为跳过。适用于当前失败且计划近期修复的步骤。

**用法**

```js
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await test.step('check expectations', async step => {
    step.skip();
    // 下面的步骤主体不会运行
    // ...
  });
});
```


### testStepInfo.skip() {#test-step-info-skip-2}

<Badge type="info" text="Added in: v1.51" />

有条件地中止当前运行的步骤并将其标记为跳过，可选地添加描述。适用于在某些情况下不应执行的步骤。

**用法**

```js
import { test, expect } from '@playwright/test';

test('my test', async ({ page, isMobile }) => {
  await test.step('check desktop expectations', async step => {
    step.skip(isMobile, 'not present in the mobile layout');
    // 下面的步骤主体不会运行
    // ...
  });
});
```

**参数**

- <a id="test-step-info-skip-2-option-condition"></a>`condition` `boolean`

  跳过条件。当条件为 `true` 时跳过测试步骤。
- <a id="test-step-info-skip-2-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


## 属性

### testStepInfo.annotations {#test-step-info-annotations}

<Badge type="info" text="Added in: v1.58" />

适用于当前测试步骤的注解列表。

**类型**

- `Array<Object>`


### testStepInfo.titlePath {#test-step-info-title-path}

<Badge type="info" text="Added in: v1.55" />

从测试文件名开始的完整标题路径，包括步骤标题。另请参阅 [`testInfo.titlePath`](/api/class-testinfo#test-info-title-path)。

**类型**

- `Array<string>`
