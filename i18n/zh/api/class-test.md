---
title: Test
outline: 2
---

# Test

<Badge type="info" text="Added in: v1.10" />

Playwright Test 提供了 `test` 函数来声明测试，以及 `expect` 函数来编写断言。

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const name = await page.innerText('.navbar__title');
  expect(name).toBe('Playwright');
});
```

## 方法

### test.(call)() {#test-call}

<Badge type="info" text="Added in: v1.10" />

声明一个测试。
* `test(title, body)`
* `test(title, details, body)`

**用法**

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

**标签**

你可以通过提供额外的测试详情来为测试添加标签。或者，你也可以在测试标题中包含标签。注意每个标签必须以 `@` 符号开头。

```js
import { test, expect } from '@playwright/test';

test('basic test', {
  tag: '@smoke',
}, async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});

test('another test @smoke', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

测试标签会显示在测试报告中，并且可以通过 `TestCase.tags` 属性在自定义报告器中使用。

你还可以在测试执行期间按标签过滤测试：
* 在[命令行](../test-cli.md#all-options)中；
* 在配置中使用 [`testConfig.grep`](/api/class-testconfig#test-config-grep) 和 [`testProject.grep`](/api/class-testproject#test-project-grep)；

了解更多关于[标签](../test-annotations.md#tag-tests)的信息。

**注解**

你可以通过提供额外的测试详情来为测试添加注解。

```js
import { test, expect } from '@playwright/test';

test('basic test', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
}, async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

测试注解会显示在测试报告中，并且可以通过 `TestCase.annotations` 属性在自定义报告器中使用。

你还可以在运行时通过操作 [`testInfo.annotations`](/api/class-testinfo#test-info-annotations) 来添加注解。

了解更多关于[测试注解](../test-annotations.md)的信息。

**锁**

你可以声明命名锁来防止特定测试同时运行，而所有其他测试继续并行运行。共享锁名称的测试永远不会并发运行，即使它们声明在不同的文件中或属于不同的[项目](../test-projects.md)。当少数测试访问不支持并发访问的共享资源时，这非常有用。

```js
import { test, expect } from '@playwright/test';

test('update user settings', {
  lock: 'user-settings',
}, async ({ page }) => {
  // 此测试永远不会与声明了 'user-settings' 锁的
  // 其他测试并发运行。
});
```

内置的 `-exclusive-` 锁会在没有其他测试运行时才运行该测试。

了解更多关于[测试锁](../test-parallel.md#test-locks)的信息。

**参数**

- <a id="test-call-option-title"></a>`title` `string`

  测试标题。
- <a id="test-call-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  额外的测试详情。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />

      注解类型，例如 `'issue'`。
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />

      可选的注解描述，例如问题 URL。
  - `lock` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-call-option-body"></a>`body` `function(Fixtures, TestInfo)`

  测试体，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。


### test.abort() {#test-abort}

<Badge type="info" text="Added in: v1.60" />

通过抛出错误来中止当前运行的测试。测试会立即被标记为失败并停止执行。当你在 fixture 或路由处理程序中检测到不可恢复的误用并希望立即使测试失败时，这非常有用。

**用法**

```js
import { test, expect } from '@playwright/test';

test('does not publish to shared page', async ({ page }) => {
  await page.route('**/publish', route => {
    test.abort('Tests must not publish to the shared page. Use the `clone` option.');
    return route.abort();
  });
  // ...
});
```

**参数**

- <a id="test-abort-option-message"></a>`message` `string` *(可选)*

  描述中止原因的可选消息。它将包含在失败错误中。


### test.afterAll() {#test-after-all}

<Badge type="info" text="Added in: v1.10" />

声明一个 `afterAll` 钩子，它在每个 worker 的所有测试之后执行一次。

当在测试文件的作用域中调用时，在文件中的所有测试之后运行。当在 [`test.describe()`](/api/class-test#test-describe) 组内调用时，在组中的所有测试之后运行。

**详情**

当添加多个 `afterAll` 钩子时，它们将按照注册顺序运行。

注意，worker 进程会在测试失败时重启，`afterAll` 钩子会在新 worker 中再次运行。了解更多关于 [workers 和失败](../test-retries.md)的信息。

即使某些钩子失败，Playwright 也会继续运行所有适用的钩子。
* `test.afterAll(hookFunction)`
* `test.afterAll(title, hookFunction)`

**用法**

```js
test.afterAll(async () => {
  console.log('Done with tests');
  // ...
});
```

或者，你可以声明一个**带标题**的钩子。

```js
test.afterAll('Teardown', async () => {
  console.log('Done with tests');
  // ...
});
```

**参数**

- <a id="test-after-all-option-title"></a>`title` `string` *(可选)* <Badge type="info" text="Added in: v1.38" />

  钩子标题。
- <a id="test-after-all-option-hook-function"></a>`hookFunction` `function(Fixtures, TestInfo)`

  钩子函数，接受一个或两个参数：一个包含 worker fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。


### test.afterEach() {#test-after-each}

<Badge type="info" text="Added in: v1.10" />

声明一个 `afterEach` 钩子，它在每个测试之后执行。

当在测试文件的作用域中调用时，在文件中的每个测试之后运行。当在 [`test.describe()`](/api/class-test#test-describe) 组内调用时，在组中的每个测试之后运行。

你可以访问与测试体本身相同的所有 [Fixtures](/api/class-fixtures)，以及提供大量有用信息的 [TestInfo](/api/class-testinfo) 对象。例如，你可以检查测试是成功还是失败。
* `test.afterEach(hookFunction)`
* `test.afterEach(title, hookFunction)`

**详情**

当添加多个 `afterEach` 钩子时，它们将按照注册顺序运行。

即使某些钩子失败，Playwright 也会继续运行所有适用的钩子。

**用法**

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => {
  console.log(`Finished ${test.info().title} with status ${test.info().status}`);

  if (test.info().status !== test.info().expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test('my test', async ({ page }) => {
  // ...
});
```

:::

或者，你可以声明一个**带标题**的钩子。

::: code-group

```js [example.spec.ts]
test.afterEach('Status check', async ({ page }) => {
  if (test.info().status !== test.info().expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});
```

:::

**参数**

- <a id="test-after-each-option-title"></a>`title` `string` *(可选)* <Badge type="info" text="Added in: v1.38" />

  钩子标题。
- <a id="test-after-each-option-hook-function"></a>`hookFunction` `function(Fixtures, TestInfo)`

  钩子函数，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。


### test.beforeAll() {#test-before-all}

<Badge type="info" text="Added in: v1.10" />

声明一个 `beforeAll` 钩子，它在每个 worker 进程的所有测试之前执行一次。

当在测试文件的作用域中调用时，在文件中的所有测试之前运行。当在 [`test.describe()`](/api/class-test#test-describe) 组内调用时，在组中的所有测试之前运行。

你可以使用 [`test.afterAll()`](/api/class-test#test-after-all) 来清理在 `beforeAll` 中设置的任何资源。
* `test.beforeAll(hookFunction)`
* `test.beforeAll(title, hookFunction)`

**详情**

当添加多个 `beforeAll` 钩子时，它们将按照注册顺序运行。

注意，worker 进程会在测试失败时重启，`beforeAll` 钩子会在新 worker 中再次运行。了解更多关于 [workers 和失败](../test-retries.md)的信息。

即使某些钩子失败，Playwright 也会继续运行所有适用的钩子。

**用法**

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  console.log('Before tests');
});

test.afterAll(async () => {
  console.log('After tests');
});

test('my test', async ({ page }) => {
  // ...
});
```

:::

或者，你可以声明一个**带标题**的钩子。

::: code-group

```js [example.spec.ts]
test.beforeAll('Setup', async () => {
  console.log('Before tests');
});
```

:::

**参数**

- <a id="test-before-all-option-title"></a>`title` `string` *(可选)* <Badge type="info" text="Added in: v1.38" />

  钩子标题。
- <a id="test-before-all-option-hook-function"></a>`hookFunction` `function(Fixtures, TestInfo)`

  钩子函数，接受一个或两个参数：一个包含 worker fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。


### test.beforeEach() {#test-before-each}

<Badge type="info" text="Added in: v1.10" />

声明一个 `beforeEach` 钩子，它在每个测试之前执行。

当在测试文件的作用域中调用时，在文件中的每个测试之前运行。当在 [`test.describe()`](/api/class-test#test-describe) 组内调用时，在组中的每个测试之前运行。

你可以访问与测试体本身相同的所有 [Fixtures](/api/class-fixtures)，以及提供大量有用信息的 [TestInfo](/api/class-testinfo) 对象。例如，你可以在开始测试之前导航页面。

你可以使用 [`test.afterEach()`](/api/class-test#test-after-each) 来清理在 `beforeEach` 中设置的任何资源。
* `test.beforeEach(hookFunction)`
* `test.beforeEach(title, hookFunction)`

**详情**

当添加多个 `beforeEach` 钩子时，它们将按照注册顺序运行。

即使某些钩子失败，Playwright 也会继续运行所有适用的钩子。

**用法**

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);
  await page.goto('https://my.start.url/');
});

test('my test', async ({ page }) => {
  expect(page.url()).toBe('https://my.start.url/');
});
```

:::

或者，你可以声明一个**带标题**的钩子。

::: code-group

```js [example.spec.ts]
test.beforeEach('Open start URL', async ({ page }) => {
  console.log(`Running ${test.info().title}`);
  await page.goto('https://my.start.url/');
});
```

:::

**参数**

- <a id="test-before-each-option-title"></a>`title` `string` *(可选)* <Badge type="info" text="Added in: v1.38" />

  钩子标题。
- <a id="test-before-each-option-hook-function"></a>`hookFunction` `function(Fixtures, TestInfo)`

  钩子函数，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。


### test.describe() {#test-describe}

<Badge type="info" text="Added in: v1.10" />

声明一组测试。
* `test.describe(title, callback)`
* `test.describe(callback)`
* `test.describe(title, details, callback)`

**用法**

你可以声明一个带标题的测试组。标题将作为每个测试标题的一部分显示在测试报告中。

```js
test.describe('two tests', () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

**匿名组**

你也可以声明一个没有标题的测试组。这便于使用 [`test.use()`](/api/class-test#test-use) 为一组测试设置共同的选项。

```js
test.describe(() => {
  test.use({ colorScheme: 'dark' });

  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

**标签**

你可以通过提供额外的详情来为组中的所有测试添加标签。注意每个标签必须以 `@` 符号开头。

```js
import { test, expect } from '@playwright/test';

test.describe('two tagged tests', {
  tag: '@smoke',
}, () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

了解更多关于[标签](../test-annotations.md#tag-tests)的信息。

**注解**

你可以通过提供额外的详情来为组中的所有测试添加注解。

```js
import { test, expect } from '@playwright/test';

test.describe('two annotated tests', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
}, () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

了解更多关于[测试注解](../test-annotations.md)的信息。

**锁**

你可以通过提供额外的详情为组中的所有测试声明命名锁。共享锁名称的测试永远不会并发运行。了解更多关于[测试锁](../test-parallel.md#test-locks)的信息。

```js
import { test, expect } from '@playwright/test';

test.describe('two tests with a lock', {
  lock: 'user-settings',
}, () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

**参数**

- <a id="test-describe-option-title"></a>`title` `string` *(可选)*

  组标题。
- <a id="test-describe-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  组中所有测试的额外详情。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `lock` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-option-callback"></a>`callback` `function()`

  调用 [`test.describe()`](/api/class-test#test-describe) 时立即运行的回调。在此回调中声明的任何测试都将属于该组。


### test.describe.configure() {#test-describe-configure}

<Badge type="info" text="Added in: v1.10" />

配置封闭的作用域。可以在顶层或 describe 内部执行。配置适用于整个作用域，无论它是在测试声明之前还是之后运行。

在[这里](../test-parallel.md)了解更多关于执行模式的信息。

**用法**
* 并行运行测试。
  
  ```js
  // 使用并行 workers 并发运行文件中的所有测试。
  test.describe.configure({ mode: 'parallel' });
  test('runs in parallel 1', async ({ page }) => {});
  test('runs in parallel 2', async ({ page }) => {});
  ```
* 按顺序运行测试，独立重试每个失败的测试。
  
  这是默认模式。显式设置它可以覆盖使用 `fullyParallel` 的项目配置。
  
  ```js
  // 此文件中的测试按顺序运行。重试（如果有）独立运行。
  test.describe.configure({ mode: 'default' });
  test('runs first', async ({ page }) => {});
  test('runs second', async ({ page }) => {});
  ```
* 串行运行测试，从头开始重试。如果其中一个串行测试失败，所有后续测试都将被跳过。
  
  ::: info
  不建议串行运行。通常最好使你的测试隔离，这样它们可以独立运行。
  :::
  
  ```js
  // 将测试标注为相互依赖。
  test.describe.configure({ mode: 'serial' });
  test('runs first', async ({ page }) => {});
  test('runs second', async ({ page }) => {});
  ```
* 为每个测试配置重试次数和超时时间。
  
  ```js
  // 文件中的每个测试将重试两次，超时时间为 20 秒。
  test.describe.configure({ retries: 2, timeout: 20_000 });
  test('runs first', async ({ page }) => {});
  test('runs second', async ({ page }) => {});
  ```
* 为作用域中的所有测试声明锁。
  
  ```js
  test.describe.configure({ lock: 'user-settings' });
  test('update user settings', async ({ page }) => {});
  test('reset user settings', async ({ page }) => {});
  ```
* 并行运行多个 describe，但每个 describe 内的测试按顺序运行。
  
  ```js
  test.describe.configure({ mode: 'parallel' });

  test.describe('A, runs in parallel with B', () => {
    test.describe.configure({ mode: 'default' });
    test('in order A1', async ({ page }) => {});
    test('in order A2', async ({ page }) => {});
  });

  test.describe('B, runs in parallel with A', () => {
    test.describe.configure({ mode: 'default' });
    test('in order B1', async ({ page }) => {});
    test('in order B2', async ({ page }) => {});
  });
  ```

**参数**

- <a id="test-describe-configure-option-options"></a>`options` `Object` *(可选)*

  - <a id="test-describe-configure-option-lock"></a>`lock` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.64" />

    封闭作用域中所有测试（包括嵌套组）的额外命名锁。锁会添加到 [`test.describe()`](/api/class-test#test-describe) 详情和之前对 [`test.describe.configure()`](/api/class-test#test-describe-configure) 调用中声明的锁之上。
  - <a id="test-describe-configure-option-mode"></a>`mode` `"default" | "parallel" | "serial"` *(可选)*

    执行模式。在[这里](../test-parallel.md)了解更多关于执行模式的信息。
  - <a id="test-describe-configure-option-retries"></a>`retries` `int | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.28" />

    每个测试的重试次数。设置为列表可使重试次数取决于错误，参见 [`testConfig.retries`](/api/class-testconfig#test-config-retries)。

    - `count` `int` <Badge type="info" text="Added in: v1.28" />

      当此条目适用时给予失败测试的最大重试次数。
    - `condition` `RegExp` *(可选)* <Badge type="info" text="Added in: v1.28" />

      与失败尝试的错误消息匹配的正则表达式。没有条件的条目始终适用。
  - <a id="test-describe-configure-option-timeout"></a>`timeout` `int` *(可选)* <Badge type="info" text="Added in: v1.28" />

    每个测试的超时时间（毫秒）。覆盖 [`testProject.timeout`](/api/class-testproject#test-project-timeout) 和 [`testConfig.timeout`](/api/class-testconfig#test-config-timeout)。


### test.describe.fixme() {#test-describe-fixme}

<Badge type="info" text="Added in: v1.25" />

类似于 [`test.describe()`](/api/class-test#test-describe) 声明一个测试组。此组中的测试被标记为 "fixme" 并且不会被执行。
* `test.describe.fixme(title, callback)`
* `test.describe.fixme(callback)`
* `test.describe.fixme(title, details, callback)`

**用法**

```js
test.describe.fixme('broken tests that should be fixed', () => {
  test('example', async ({ page }) => {
    // 此测试不会运行
  });
});
```

你也可以省略标题。

```js
test.describe.fixme(() => {
  // ...
});
```

**参数**

- <a id="test-describe-fixme-option-title"></a>`title` `string` *(可选)*

  组标题。
- <a id="test-describe-fixme-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-fixme-option-callback"></a>`callback` `function()`

  调用 [`test.describe.fixme()`](/api/class-test#test-describe-fixme) 时立即运行的回调。在此回调中添加的任何测试都将属于该组，并且不会运行。


### test.describe.only() {#test-describe-only}

<Badge type="info" text="Added in: v1.10" />

声明一个聚焦的测试组。如果有一些聚焦的测试或套件，它们都将运行，但其他的不会运行。
* `test.describe.only(title, callback)`
* `test.describe.only(callback)`
* `test.describe.only(title, details, callback)`

**用法**

```js
test.describe.only('focused group', () => {
  test('in the focused group', async ({ page }) => {
    // 此测试会运行
  });
});
test('not in the focused group', async ({ page }) => {
  // 此测试不会运行
});
```

你也可以省略标题。

```js
test.describe.only(() => {
  // ...
});
```

**参数**

- <a id="test-describe-only-option-title"></a>`title` `string` *(可选)*

  组标题。
- <a id="test-describe-only-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-only-option-callback"></a>`callback` `function()`

  调用 [`test.describe.only()`](/api/class-test#test-describe-only) 时立即运行的回调。在此回调中添加的任何测试都将属于该组。


### test.describe.parallel() {#test-describe-parallel}

<Badge type="info" text="Added in: v1.10" />

::: warning 不推荐
有关配置执行模式的首选方式，请参阅 [`test.describe.configure()`](/api/class-test#test-describe-configure)。
:::

声明一组可以并行运行的测试。默认情况下，单个测试文件中的测试一个接一个运行，但使用 [`test.describe.parallel()`](/api/class-test#test-describe-parallel) 允许它们并行运行。
* `test.describe.parallel(title, callback)`
* `test.describe.parallel(callback)`
* `test.describe.parallel(title, details, callback)`

**用法**

```js
test.describe.parallel('group', () => {
  test('runs in parallel 1', async ({ page }) => {});
  test('runs in parallel 2', async ({ page }) => {});
});
```

注意，并行测试在单独的进程中执行，不能共享任何状态或全局变量。每个并行测试都会执行所有相关的钩子。

你也可以省略标题。

```js
test.describe.parallel(() => {
  // ...
});
```

**参数**

- <a id="test-describe-parallel-option-title"></a>`title` `string` *(可选)*

  组标题。
- <a id="test-describe-parallel-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-parallel-option-callback"></a>`callback` `function()`

  调用 [`test.describe.parallel()`](/api/class-test#test-describe-parallel) 时立即运行的回调。在此回调中添加的任何测试都将属于该组。


### test.describe.parallel.only() {#test-describe-parallel-only}

<Badge type="info" text="Added in: v1.10" />

::: warning 不推荐
有关配置执行模式的首选方式，请参阅 [`test.describe.configure()`](/api/class-test#test-describe-configure)。
:::

声明一个聚焦的、可以并行运行的测试组。这类似于 [`test.describe.parallel()`](/api/class-test#test-describe-parallel)，但会聚焦该组。如果有一些聚焦的测试或套件，它们都将运行，但其他的不会运行。
* `test.describe.parallel.only(title, callback)`
* `test.describe.parallel.only(callback)`
* `test.describe.parallel.only(title, details, callback)`

**用法**

```js
test.describe.parallel.only('group', () => {
  test('runs in parallel 1', async ({ page }) => {});
  test('runs in parallel 2', async ({ page }) => {});
});
```

你也可以省略标题。

```js
test.describe.parallel.only(() => {
  // ...
});
```

**参数**

- <a id="test-describe-parallel-only-option-title"></a>`title` `string` *(可选)*

  组标题。
- <a id="test-describe-parallel-only-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-parallel-only-option-callback"></a>`callback` `function()`

  调用 [`test.describe.parallel.only()`](/api/class-test#test-describe-parallel-only) 时立即运行的回调。在此回调中添加的任何测试都将属于该组。


### test.describe.serial() {#test-describe-serial}

<Badge type="info" text="Added in: v1.10" />

::: warning 不推荐
有关配置执行模式的首选方式，请参阅 [`test.describe.configure()`](/api/class-test#test-describe-configure)。
:::

声明一组应该始终串行运行的测试。如果其中一个测试失败，所有后续测试都将被跳过。组中的所有测试会一起重试。

::: info
不建议使用串行。通常最好使你的测试隔离，这样它们可以独立运行。
:::

* `test.describe.serial(title, callback)`
* `test.describe.serial(title)`
* `test.describe.serial(title, details, callback)`

**用法**

```js
test.describe.serial('group', () => {
  test('runs first', async ({ page }) => {});
  test('runs second', async ({ page }) => {});
});
```

你也可以省略标题。

```js
test.describe.serial(() => {
  // ...
});
```

**参数**

- <a id="test-describe-serial-option-title"></a>`title` `string` *(可选)*

  组标题。
- <a id="test-describe-serial-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-serial-option-callback"></a>`callback` `function()`

  调用 [`test.describe.serial()`](/api/class-test#test-describe-serial) 时立即运行的回调。在此回调中添加的任何测试都将属于该组。


### test.describe.serial.only() {#test-describe-serial-only}

<Badge type="info" text="Added in: v1.10" />

::: warning 不推荐
有关配置执行模式的首选方式，请参阅 [`test.describe.configure()`](/api/class-test#test-describe-configure)。
:::

声明一个聚焦的、应该始终串行运行的测试组。如果其中一个测试失败，所有后续测试都将被跳过。组中的所有测试会一起重试。如果有一些聚焦的测试或套件，它们都将运行，但其他的不会运行。

::: info
不建议使用串行。通常最好使你的测试隔离，这样它们可以独立运行。
:::

* `test.describe.serial.only(title, callback)`
* `test.describe.serial.only(title)`
* `test.describe.serial.only(title, details, callback)`

**用法**

```js
test.describe.serial.only('group', () => {
  test('runs first', async ({ page }) => {
  });
  test('runs second', async ({ page }) => {
  });
});
```

你也可以省略标题。

```js
test.describe.serial.only(() => {
  // ...
});
```

**参数**

- <a id="test-describe-serial-only-option-title"></a>`title` `string`

  组标题。
- <a id="test-describe-serial-only-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-serial-only-option-callback"></a>`callback` `function()`

  调用 [`test.describe.serial.only()`](/api/class-test#test-describe-serial-only) 时立即运行的回调。在此回调中添加的任何测试都将属于该组。


### test.describe.skip() {#test-describe-skip}

<Badge type="info" text="Added in: v1.10" />

类似于 [`test.describe()`](/api/class-test#test-describe) 声明一个跳过的测试组。跳过的组中的测试永远不会运行。
* `test.describe.skip(title, callback)`
* `test.describe.skip(title)`
* `test.describe.skip(title, details, callback)`

**用法**

```js
test.describe.skip('skipped group', () => {
  test('example', async ({ page }) => {
    // 此测试不会运行
  });
});
```

你也可以省略标题。

```js
test.describe.skip(() => {
  // ...
});
```

**参数**

- <a id="test-describe-skip-option-title"></a>`title` `string`

  组标题。
- <a id="test-describe-skip-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-describe-skip-option-callback"></a>`callback` `function()`

  调用 [`test.describe.skip()`](/api/class-test#test-describe-skip) 时立即运行的回调。在此回调中添加的任何测试都将属于该组，并且不会运行。


### test.extend() {#test-extend}

<Badge type="info" text="Added in: v1.10" />

通过定义可以在测试中使用的 fixtures 和/或选项来扩展 `test` 对象。

**用法**

首先定义一个 fixture 和/或一个选项。

::: code-group

```js [JavaScript]
const base = require('@playwright/test');
const { TodoPage } = require('./todo-page');

// 通过提供 "defaultItem" 选项和 "todoPage" fixture 来扩展基本测试。
exports.test = base.test.extend({
  // 定义一个选项并提供默认值。
  // 我们稍后可以在配置中覆盖它。
  defaultItem: ['Do stuff', { option: true }],

  // 定义一个 fixture。注意它可以使用内置的 fixture "page"
  // 和新的选项 "defaultItem"。
  todoPage: async ({ page, defaultItem }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo(defaultItem);
    await use(todoPage);
    await todoPage.removeAll();
  },
});
```

```js [TypeScript]
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';

export type Options = { defaultItem: string };

// 通过提供 "defaultItem" 选项和 "todoPage" fixture 来扩展基本测试。
export const test = base.extend<Options & { todoPage: TodoPage }>({
  // 定义一个选项并提供默认值。
  // 我们稍后可以在配置中覆盖它。
  defaultItem: ['Do stuff', { option: true }],

  // 定义一个 fixture。注意它可以使用内置的 fixture "page"
  // 和新的选项 "defaultItem"。
  todoPage: async ({ page, defaultItem }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo(defaultItem);
    await use(todoPage);
    await todoPage.removeAll();
  },
});
```

:::

然后在测试中使用 fixture。

::: code-group

```js [example.spec.ts]
import { test } from './my-test';

test('test 1', async ({ todoPage }) => {
  await todoPage.addToDo('my todo');
  // ...
});
```

:::

在配置文件中配置选项。

::: code-group

```js [JavaScript]
// @ts-check

module.exports = defineConfig({
  projects: [
    {
      name: 'shopping',
      use: { defaultItem: 'Buy milk' },
    },
    {
      name: 'wellbeing',
      use: { defaultItem: 'Exercise!' },
    },
  ]
});
```

```js [TypeScript]
import { defineConfig } from '@playwright/test';
import type { Options } from './my-test';

export default defineConfig<Options>({
  projects: [
    {
      name: 'shopping',
      use: { defaultItem: 'Buy milk' },
    },
    {
      name: 'wellbeing',
      use: { defaultItem: 'Exercise!' },
    },
  ]
});
```

:::

了解更多关于 [fixtures](../test-fixtures.md) 和[参数化测试](../test-parameterize.md)的信息。

**参数**

- <a id="test-extend-option-fixtures"></a>`fixtures` `Object`

  包含 fixtures 和/或选项的对象。了解更多关于 [fixtures 格式](../test-fixtures.md)的信息。

**返回值**

- `Test`


### test.fail() {#test-fail}

<Badge type="info" text="Added in: v1.10" />

将测试标记为"应该失败"。Playwright 会运行此测试并确保它实际失败。这对于文档目的很有用，可以承认某些功能在修复之前是损坏的。

声明一个"失败"测试：
* `test.fail(title, body)`
* `test.fail(title, details, body)`

在运行时将测试标注为"失败"：
* `test.fail(condition, description)`
* `test.fail(callback, description)`
* `test.fail()`
* `test.fail(description)`

**用法**

你可以声明一个预期失败的测试，这样 Playwright 会确保它实际失败。

```js
import { test, expect } from '@playwright/test';

test.fail('not yet ready', async ({ page }) => {
  // ...
});
```

如果你的测试在某些配置中失败但不是全部，你可以根据某些条件在测试体内将测试标记为失败。在这种情况下，我们建议传递一个 `description` 参数。

```js
import { test, expect } from '@playwright/test';

test('fail in WebKit', async ({ page, browserName }) => {
  test.fail(browserName === 'webkit', 'This feature is not implemented for Mac yet');
  // ...
});
```

你可以使用单个 `test.fail(callback, description)` 调用，根据某些条件将文件或 [`test.describe()`](/api/class-test#test-describe) 组中的所有测试标记为"应该失败"。

```js
import { test, expect } from '@playwright/test';

test.fail(({ browserName }) => browserName === 'webkit', 'not implemented yet');

test('fail in WebKit 1', async ({ page }) => {
  // ...
});
test('fail in WebKit 2', async ({ page }) => {
  // ...
});
```

你也可以在测试体内不带条件地调用 `test.fail()` 来始终将测试标记为失败，可选地带有 `description`。我们建议使用 `test.fail(title, body)` 来声明失败的测试��

```js
import { test, expect } from '@playwright/test';

test('less readable', async ({ page }) => {
  test.fail();
  // ...
});
```

**参数**

- <a id="test-fail-option-title"></a>`title` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />

  测试标题。
- <a id="test-fail-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  测试详情描述参见 [`test.(call)()`](/api/class-test#test-call)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-fail-option-body"></a>`body` `function(Fixtures, TestInfo)` *(可选)* <Badge type="info" text="Added in: v1.42" />

  测试体，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。
- <a id="test-fail-option-condition"></a>`condition` `boolean` *(可选)*

  当条件为 `true` 时，测试被标记为"应该失败"。
- <a id="test-fail-option-callback"></a>`callback` `function(Fixtures): boolean` *(可选)*

  根据测试 fixtures 返回是否标记为"应该失败"的函数。当返回值为 `true` 时，测试被标记为"应该失败"。
- <a id="test-fail-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### test.fail.only() {#test-fail-only}

<Badge type="info" text="Added in: v1.49" />

你可以使用 `test.fail.only` 聚焦于预期失败的特定测试。这在调试失败的测试或处理特定问题时特别有用。

声明一个聚焦的"失败"测试：
* `test.fail.only(title, body)`
* `test.fail.only(title, details, body)`

**用法**

你可以声明一个聚焦的失败测试，这样 Playwright 只运行此测试并确保它实际失败。

```js
import { test, expect } from '@playwright/test';

test.fail.only('focused failing test', async ({ page }) => {
  // 此测试预期失败
});
test('not in the focused group', async ({ page }) => {
  // 此测试不会运行
});
```

**参数**

- <a id="test-fail-only-option-title"></a>`title` `string` *(可选)*

  测试标题。
- <a id="test-fail-only-option-details"></a>`details` `Object` *(可选)*

  测试详情描述参见 [`test.describe()`](/api/class-test#test-describe)。

  - `tag` `string | Array<string>` *(可选)*
  - `annotation` `Object | Array<Object>` *(可选)*

    - `type` `string`
    - `description` `string` *(可选)*
- <a id="test-fail-only-option-body"></a>`body` `function(Fixtures, TestInfo)` *(可选)*

  测试体，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。


### test.fixme() {#test-fixme}

<Badge type="info" text="Added in: v1.10" />

将测试标记为 "fixme"，意图是稍后修复它。Playwright 不会运行 `test.fixme()` 调用之后的测试。

声明一个 "fixme" 测试：
* `test.fixme(title, body)`
* `test.fixme(title, details, body)`

在运行时将测试标注为 "fixme"：
* `test.fixme(condition, description)`
* `test.fixme(callback, description)`
* `test.fixme()`
* `test.fixme(description)`

**用法**

你可以声明一个待修复的测试，Playwright 不会运行它。

```js
import { test, expect } from '@playwright/test';

test.fixme('to be fixed', async ({ page }) => {
  // ...
});
```

如果你的测试应该在某些配置中修复但不是全部，你可以根据某些条件在测试体内将测试标记为 "fixme"。在这种情况下，我们建议传递一个 `description` 参数。Playwright 会运行测试，但在 `test.fixme` 调用后立即中止它。

```js
import { test, expect } from '@playwright/test';

test('to be fixed in Safari', async ({ page, browserName }) => {
  test.fixme(browserName === 'webkit', 'This feature breaks in Safari for some reason');
  // ...
});
```

你可以使用单个 `test.fixme(callback, description)` 调用，根据某些条件将文件或 [`test.describe()`](/api/class-test#test-describe) 组中的所有测试标记为 "fixme"。

```js
import { test, expect } from '@playwright/test';

test.fixme(({ browserName }) => browserName === 'webkit', 'Should figure out the issue');

test('to be fixed in Safari 1', async ({ page }) => {
  // ...
});
test('to be fixed in Safari 2', async ({ page }) => {
  // ...
});
```

你也可以在测试体内不带条件地调用 `test.fixme()` 来始终将测试标记为 "fixme"，可选地带有 `description`。我们建议使用 `test.fixme(title, body)`。

```js
import { test, expect } from '@playwright/test';

test('less readable', async ({ page }) => {
  test.fixme();
  // ...
});
```

**参数**

- <a id="test-fixme-option-title"></a>`title` `string` *(可选)*

  测试标题。
- <a id="test-fixme-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  测试详情描述参见 [`test.(call)()`](/api/class-test#test-call)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-fixme-option-body"></a>`body` `function(Fixtures, TestInfo)` *(可选)*

  测试体，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。
- <a id="test-fixme-option-condition"></a>`condition` `boolean` *(可选)*

  当条件为 `true` 时，测试被标记为 "fixme"。
- <a id="test-fixme-option-callback"></a>`callback` `function(Fixtures): boolean` *(可选)*

  根据测试 fixtures 返回是否标记为 "fixme" 的函数。当返回值为 `true` 时，测试被标记为 "fixme"。
- <a id="test-fixme-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### test.info() {#test-info}

<Badge type="info" text="Added in: v1.10" />

返回当前运行测试的信息。此方法只能在测试执行期间调用，否则会抛出错误。

**用法**

```js
test('example test', async ({ page }) => {
  // ...
  await test.info().attach('screenshot', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
```

**返回值**

- `TestInfo`


### test.only() {#test-only}

<Badge type="info" text="Added in: v1.10" />

声明一个聚焦的测试。如果有一些聚焦的测试或套件，它们都将运行，但其他的不会运行。
* `test.only(title, body)`
* `test.only(title, details, body)`

**用法**

```js
test.only('focus this test', async ({ page }) => {
  // 只运行整个项目中聚焦的测试。
});
```

**参数**

- <a id="test-only-option-title"></a>`title` `string`

  测试标题。
- <a id="test-only-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  测试详情描述参见 [`test.(call)()`](/api/class-test#test-call)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-only-option-body"></a>`body` `function(Fixtures, TestInfo)`

  测试体，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。


### test.setTimeout() {#test-set-timeout}

<Badge type="info" text="Added in: v1.10" />

更改测试的超时时间。零表示无超时。了解更多关于[各种超时](../test-timeouts.md)的信息。

当前运行测试的超时时间可通过 [`testInfo.timeout`](/api/class-testinfo#test-info-timeout) 获取。

**用法**
* 更改测试超时时间。
  
  ```js
  test('very slow test', async ({ page }) => {
    test.setTimeout(120000);
    // ...
  });
  ```
* 从慢速 `beforeEach` 钩子更改超时时间。注意这会影响与 `beforeEach` 钩子共享的测试超时时间。
  
  ```js
  test.beforeEach(async ({ page }, testInfo) => {
    // 将运行此钩子的所有测试的超时时间延长 30 秒。
    test.setTimeout(testInfo.timeout + 30000);
  });
  ```
* 更改 `beforeAll` 或 `afterAll` 钩子的超时时间。注意这会影响钩子的超时时间，而不是测试超时时间。
  
  ```js
  test.beforeAll(async () => {
    // 设置此钩子的超时时间。
    test.setTimeout(60000);
  });
  ```
* 更改 [`test.describe()`](/api/class-test#test-describe) 组中所有测试的超时时间。
  
  ```js
  test.describe('group', () => {
    // 应用于此组中的所有测试。
    test.describe.configure({ timeout: 60000 });

    test('test one', async () => { /* ... */ });
    test('test two', async () => { /* ... */ });
    test('test three', async () => { /* ... */ });
  });
  ```

**参数**

- <a id="test-set-timeout-option-timeout"></a>`timeout` `int`

  超时时间（毫秒）。


### test.skip() {#test-skip}

<Badge type="info" text="Added in: v1.10" />

跳过一个测试。Playwright 不会运行 `test.skip()` 调用之后的测试。

跳过的测试不应该被运行。如果你打算修复测试，请改用 [`test.fixme()`](/api/class-test#test-fixme)。

声明一个跳过的测试：
* `test.skip(title, body)`
* `test.skip(title, details, body)`

在运行时跳过测试：
* `test.skip(condition, description)`
* `test.skip(callback, description)`
* `test.skip()`
* `test.skip(description)`

**用法**

你可以声明一个跳过的测试，Playwright 不会运行它。

```js
import { test, expect } from '@playwright/test';

test.skip('never run', async ({ page }) => {
  // ...
});
```

如果你的测试应该在某些配置中跳过但不是全部，你可以根据某些条件在测试体内跳过测试。在这种情况下，我们建议传递一个 `description` 参数。Playwright 会运行测试，但在 `test.skip` 调用后立即中止它。

```js
import { test, expect } from '@playwright/test';

test('Safari-only test', async ({ page, browserName }) => {
  test.skip(browserName !== 'webkit', 'This feature is Safari-only');
  // ...
});
```

你可以使用单个 `test.skip(callback, description)` 调用，根据某些条件跳过文件或 [`test.describe()`](/api/class-test#test-describe) 组中的所有测试。

```js
import { test, expect } from '@playwright/test';

test.skip(({ browserName }) => browserName !== 'webkit', 'Safari-only');

test('Safari-only test 1', async ({ page }) => {
  // ...
});
test('Safari-only test 2', async ({ page }) => {
  // ...
});
```

你也可以在测试体内不带条件地调用 `test.skip()` 来始终跳过测试，可选地带有 `description`。但是，我们建议使用 `test.skip(title, body)`。

```js
import { test, expect } from '@playwright/test';

test('less readable', async ({ page }) => {
  test.skip('Not implemented yet');
  // ...
});
```

**参数**

- <a id="test-skip-option-title"></a>`title` `string` *(可选)*

  测试标题。
- <a id="test-skip-option-details"></a>`details` `Object` *(可选)* <Badge type="info" text="Added in: v1.42" />

  测试详情描述参见 [`test.(call)()`](/api/class-test#test-call)。

  - `tag` `string | Array<string>` *(可选)* <Badge type="info" text="Added in: v1.42" />
  - `annotation` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.42" />

    - `type` `string` <Badge type="info" text="Added in: v1.42" />
    - `description` `string` *(可选)* <Badge type="info" text="Added in: v1.42" />
- <a id="test-skip-option-body"></a>`body` `function(Fixtures, TestInfo)` *(可选)*

  测试体，接受一个或两个参数：一个包含 fixtures 的对象和可选的 [TestInfo](/api/class-testinfo)。
- <a id="test-skip-option-condition"></a>`condition` `boolean` *(可选)*

  当条件为 `true` 时，测试被标记为"跳过"。
- <a id="test-skip-option-callback"></a>`callback` `function(Fixtures): boolean` *(可选)*

  根据测试 fixtures 返回是否标记为"跳过"的函数。当返回值为 `true` 时，测试被标记为"跳过"。
- <a id="test-skip-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### test.slow() {#test-slow}

<Badge type="info" text="Added in: v1.10" />

将测试标记为"慢速"。慢速测试将获得三倍的默认超时时间。

注意 [`test.slow()`](/api/class-test#test-slow) 不能在 `beforeAll` 或 `afterAll` 钩子中使用。请改用 [`test.setTimeout()`](/api/class-test#test-set-timeout)。
* `test.slow()`
* `test.slow(description)`
* `test.slow(condition, description)`
* `test.slow(callback, description)`

**用法**

你可以通过在测试体内调用 `test.slow()` 来将测试标记为慢速。

```js
import { test, expect } from '@playwright/test';

test('slow test', async ({ page }) => {
  test.slow();
  // ...
});
```

如果你的测试在某些配置中很慢但不是全部，你可以根据条件将其标记为慢速。在这种情况下，我们建议传递一个 `description` 参数。

```js
import { test, expect } from '@playwright/test';

test('slow in Safari', async ({ page, browserName }) => {
  test.slow(browserName === 'webkit', 'This feature is slow in Safari');
  // ...
});
```

你可以通过传递回调，根据某些条件将文件或 [`test.describe()`](/api/class-test#test-describe) 组中的所有测试标记为"慢速"。

```js
import { test, expect } from '@playwright/test';

test.slow(({ browserName }) => browserName === 'webkit', 'all tests are slow in Safari');

test('slow in Safari 1', async ({ page }) => {
  // ...
});
test('fail in Safari 2', async ({ page }) => {
  // ...
});
```

**参数**

- <a id="test-slow-option-condition"></a>`condition` `boolean` *(可选)*

  当条件为 `true` 时，测试被标记为"慢速"。
- <a id="test-slow-option-callback"></a>`callback` `function(Fixtures): boolean` *(可选)*

  根据测试 fixtures 返回是否标记为"慢速"的函数。当返回值为 `true` 时，测试被标记为"慢速"。
- <a id="test-slow-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### test.step() {#test-step}

<Badge type="info" text="Added in: v1.10" /> <Badge type="tip" text="async" />

声明一个显示在报告中的测试步骤。

**用法**

```js
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await test.step('Log in', async () => {
    // ...
  });

  await test.step('Outer step', async () => {
    // ...
    // 你可以在步骤内部嵌套步骤。
    await test.step('Inner step', async () => {
      // ...
    });
  });
});
```

**详情**

该方法返回步骤回调返回的值。

```js
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  const user = await test.step('Log in', async () => {
    // ...
    return 'john';
  });
  expect(user).toBe('john');
});
```

**装饰器**

你可以使用 TypeScript 方法装饰器将方法转换为步骤。
对装饰方法的每次调用都将作为报告中的一个步骤显示。

```js
function step(target: Function, context: ClassMethodDecoratorContext) {
  return function replacementMethod(...args: any) {
    const name = this.constructor.name + '.' + (context.name as string);
    return test.step(name, async () => {
      return await target.call(this, ...args);
    }, { box: true });
  };
}

class LoginPage {
  constructor(readonly page: Page) {}

  @step
  async login() {
    const account = { username: 'Alice', password: 's3cr3t' };
    await this.page.getByLabel('Username or email address').fill(account.username);
    await this.page.getByLabel('Password').fill(account.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await expect(this.page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  }
}

test('example', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
});
```

**Boxing**

当步骤内部出现错误时，你通常会看到错误指向实际失败的操作。例如，考虑以下登录步骤：

```js
async function login(page) {
  await test.step('login', async () => {
    const account = { username: 'Alice', password: 's3cr3t' };
    await page.getByLabel('Username or email address').fill(account.username);
    await page.getByLabel('Password').fill(account.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  });
}

test('example', async ({ page }) => {
  await page.goto('https://github.com/login');
  await login(page);
});
```

```txt
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  ... error details omitted ...

   8 |     await page.getByRole('button', { name: 'Sign in' }).click();
>  9 |     await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
     |                                                                               ^
  10 |   });
```

如上所示，测试可能会因为步骤内部的错误而失败。如果你希望错误突出显示"login"步骤而不是其内部，请使用 `box` 选项。盒装步骤内的错误指向步骤调用位置。

```js
async function login(page) {
  await test.step('login', async () => {
    // ...
  }, { box: true });  // 注意这里的 "box" 选项。
}
```

```txt
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  ... error details omitted ...

  14 |   await page.goto('https://github.com/login');
> 15 |   await login(page);
     |         ^
  16 | });
```

你也可以为盒装步骤创建 TypeScript 装饰器，类似于上面的常规步骤装饰器：

```js
function boxedStep(target: Function, context: ClassMethodDecoratorContext) {
  return function replacementMethod(...args: any) {
    const name = this.constructor.name + '.' + (context.name as string);
    return test.step(name, async () => {
      return await target.call(this, ...args);
    }, { box: true });  // 注意这里的 "box" 选项。
  };
}

class LoginPage {
  constructor(readonly page: Page) {}

  @boxedStep
  async login() {
    // ....
  }
}

test('example', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();  // <-- 错误将在此行报告。
});
```

**参数**

- <a id="test-step-option-title"></a>`title` `string`

  步骤名称。
- <a id="test-step-option-body"></a>`body` `function(TestStepInfo): Promise<any>`

  步骤体。
- <a id="test-step-option-options"></a>`options` `Object` *(可选)*

  - <a id="test-step-option-box"></a>`box` `boolean` *(可选)* <Badge type="info" text="Added in: v1.39" />

    是否在报告中将步骤盒装。默认为 `false`。当步骤被盒装时，步骤内部抛出的错误指向步骤调用位置。有关更多详情，请参见下文。
  - <a id="test-step-option-location"></a>`location` `Location` *(可选)* <Badge type="info" text="Added in: v1.48" />

    指定步骤在测试报告和跟踪查看器中显示的自定义位置。默认显示 [`test.step()`](/api/class-test#test-step) 调用的位置。
  - <a id="test-step-option-params"></a>`params` `Object<string, any>` *(可选)* <Badge type="info" text="Added in: v1.63" />

    描述步骤的任意可序列化参数。它们作为 `testStep.params` 报告给报告器，并显示在跟踪查看器中。
  - <a id="test-step-option-subtitle"></a>`subtitle` `string` *(可选)* <Badge type="info" text="Added in: v1.63" />

    补充标题的步骤副标题，例如步骤的目标。它作为 `testStep.subtitle` 报告给报告器，并在测试报告和跟踪查看器中显示在标题旁边。
  - <a id="test-step-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.50" />

    步骤完成允许的最大时间（毫秒）。如果步骤未在指定超时内完成，[`test.step()`](/api/class-test#test-step) 方法将抛出 [TimeoutError](/api/class-timeouterror)。默认为 `0`（无超时）。

**返回值**

- `Promise<any>`


### test.step.skip() {#test-step-skip}

<Badge type="info" text="Added in: v1.50" /> <Badge type="tip" text="async" />

将测试步骤标记为 "skip" 以临时禁用其执行，适用于当前失败且计划近期修复的步骤。Playwright 不会运行该步骤。另请参见 [`testStepInfo.skip()`](/api/class-teststepinfo#test-step-info-skip-2)。

我们建议使用 [`testStepInfo.skip()`](/api/class-teststepinfo#test-step-info-skip-1)。

**用法**

你可以声明一个跳过的步骤，Playwright 不会运行它。

```js
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  // ...
  await test.step.skip('not yet ready', async () => {
    // ...
  });
});
```

**参数**

- <a id="test-step-skip-option-title"></a>`title` `string`

  步骤名称。
- <a id="test-step-skip-option-body"></a>`body` `function(): Promise<any>`

  步骤体。
- <a id="test-step-skip-option-options"></a>`options` `Object` *(可选)*

  - <a id="test-step-skip-option-box"></a>`box` `boolean` *(可选)*

    是否在报告中将步骤盒装。默认为 `false`。当步骤被盒装时，步骤内部抛出的错误指向步骤调用位置。有关更多详情，请参见下文。
  - <a id="test-step-skip-option-location"></a>`location` `Location` *(可选)*

    指定步骤在测试报告和跟踪查看器中显示的自定义位置。默认显示 [`test.step()`](/api/class-test#test-step) 调用的位置。
  - <a id="test-step-skip-option-params"></a>`params` `Object<string, any>` *(可选)* <Badge type="info" text="Added in: v1.63" />

    描述步骤的任意可序列化参数。它们作为 `testStep.params` 报告给报告器，并显示在跟踪查看器中。
  - <a id="test-step-skip-option-subtitle"></a>`subtitle` `string` *(可选)* <Badge type="info" text="Added in: v1.63" />

    补充标题的步骤副标题，例如步骤的目标。它作为 `testStep.subtitle` 报告给报告器，并在测试报告和跟踪查看器中显示在标题旁边。
  - <a id="test-step-skip-option-timeout"></a>`timeout` `float` *(可选)*

    步骤完成的最大时间（毫秒）。默认为 `0`（无超时）。


### test.use() {#test-use}

<Badge type="info" text="Added in: v1.10" />

指定在单个测试文件或 [`test.describe()`](/api/class-test#test-describe) 组中使用的选项或 fixtures。最常用于设置选项，例如设置 `locale` 来配置 `context` fixture。

**用法**

```js
import { test, expect } from '@playwright/test';

test.use({ locale: 'en-US' });

test('test with locale', async ({ page }) => {
  // 默认的 context 和 page 具有指定的 locale
});
```

**详情**

`test.use` 可以在全局作用域或 `test.describe` 内部调用。在 `beforeEach` 或 `beforeAll` 内部调用它是错误的。

也可以通过提供函数来覆盖 fixture。

```js
import { test, expect } from '@playwright/test';

test.use({
  locale: async ({}, use) => {
    // 从某个配置文件读取 locale。
    const locale = await fs.promises.readFile('test-locale', 'utf-8');
    await use(locale);
  },
});

test('test with locale', async ({ page }) => {
  // 默认的 context 和 page 具有指定的 locale
});
```

**参数**

- <a id="test-use-option-fixtures"></a>`options` `TestOptions`

  包含本地选项的对象。


## 属性

### test.expect {#test-expect}

<Badge type="info" text="Added in: v1.10" />

`expect` 函数可用于创建测试断言。阅读更多关于[测试断言](../test-assertions.md)的信息。

**用法**

```js
test('example', async ({ page }) => {
  await test.expect(page).toHaveTitle('Title');
});
```

**类型**

- `Object`
