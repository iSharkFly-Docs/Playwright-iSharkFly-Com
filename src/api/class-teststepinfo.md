---
title: TestStepInfo
outline: 2
---

# TestStepInfo

<Badge type="info" text="Added in: v1.51" />

`TestStepInfo` contains information about currently running test step. It is passed as an argument to the step function. `TestStepInfo` provides utilities to control test step execution.

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page, browserName }) => {
  await test.step('check some behavior', async step => {
    step.skip(browserName === 'webkit', 'The feature is not available in WebKit');
    // ... rest of the step code
  });
});
```

## Methods

### testStepInfo.attach() {#test-step-info-attach}

<Badge type="info" text="Added in: v1.51" /> <Badge type="tip" text="async" />

Attach a value or a file from disk to the current test step. Some reporters show test step attachments. Either [`path`](/api/class-teststepinfo#test-step-info-attach-option-path) or [`body`](/api/class-teststepinfo#test-step-info-attach-option-body) must be specified, but not both. Calling this method will attribute the attachment to the step, as opposed to [`testInfo.attach()`](/api/class-testinfo#test-info-attach) which stores all attachments at the test level.

For example, you can attach a screenshot to the test step:

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

Or you can attach files returned by your APIs:

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
[`testStepInfo.attach()`](/api/class-teststepinfo#test-step-info-attach) automatically takes care of copying attached files to a
location that is accessible to reporters. You can safely remove the attachment
after awaiting the attach call.
:::

**Arguments**

- <a id="test-step-info-attach-option-name"></a>`name` `string`

  Attachment name. The name will also be sanitized and used as the prefix of file name
  when saving to disk.
- <a id="test-step-info-attach-option-options"></a>`options` `Object` *(optional)*

  - <a id="test-step-info-attach-option-body"></a>`body` `string | Buffer` *(optional)*

    Attachment body. Mutually exclusive with [`path`](/api/class-teststepinfo#test-step-info-attach-option-path).
  - <a id="test-step-info-attach-option-content-type"></a>`contentType` `string` *(optional)*

    Content type of this attachment to properly present in the report, for example `'application/json'` or `'image/png'`. If omitted, content type is inferred based on the [`path`](/api/class-teststepinfo#test-step-info-attach-option-path), or defaults to `text/plain` for [string] attachments and `application/octet-stream` for [Buffer] attachments.
  - <a id="test-step-info-attach-option-path"></a>`path` `string` *(optional)*

    Path on the filesystem to the attached file. Mutually exclusive with [`body`](/api/class-teststepinfo#test-step-info-attach-option-body).


### testStepInfo.skip() {#test-step-info-skip-1}

<Badge type="info" text="Added in: v1.51" />

Abort the currently running step and mark it as skipped. Useful for steps that are currently failing and planned for a near-term fix.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await test.step('check expectations', async step => {
    step.skip();
    // step body below will not run
    // ...
  });
});
```


### testStepInfo.skip() {#test-step-info-skip-2}

<Badge type="info" text="Added in: v1.51" />

Conditionally abort the currently running step and mark it as skipped with an optional description. Useful for steps that should not be executed in some cases.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('my test', async ({ page, isMobile }) => {
  await test.step('check desktop expectations', async step => {
    step.skip(isMobile, 'not present in the mobile layout');
    // step body below will not run
    // ...
  });
});
```

**Arguments**

- <a id="test-step-info-skip-2-option-condition"></a>`condition` `boolean`

  A skip condition. Test step is skipped when the condition is `true`.
- <a id="test-step-info-skip-2-option-description"></a>`description` `string` *(optional)*

  Optional description that will be reflected in a test report.


## Properties

### testStepInfo.annotations {#test-step-info-annotations}

<Badge type="info" text="Added in: v1.58" />

The list of annotations applicable to the current test step.

**Type**

- `Array<Object>`


### testStepInfo.titlePath {#test-step-info-title-path}

<Badge type="info" text="Added in: v1.55" />

The full title path starting with the test file name, including the step titles. See also [`testInfo.titlePath`](/api/class-testinfo#test-info-title-path).

**Type**

- `Array<string>`

