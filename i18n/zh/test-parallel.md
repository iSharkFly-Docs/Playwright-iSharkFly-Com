---
title: "并行执行"
---

# 并行执行

## 简介

Playwright Test 并行运行测试。为了实现这一点，它会同时运行多个工作进程。默认情况下，**测试文件**是并行运行的。单个文件中的测试按顺序在同一个工作进程中运行。
- 你可以使用 [`test.describe.configure`](#在单个文件中并行化测试) 配置测试，使**单个文件中的测试**并行运行。
- 你可以使用 [`testProject.fullyParallel`](/api/class-testproject#test-project-fully-parallel) 或 [`testConfig.fullyParallel`](/api/class-testconfig#test-config-fully-parallel) 将**整个项目**配置为所有文件中的所有测试并行运行。
- 要**禁用**并行执行，将[工作进程数限制为一个](#禁用并行执行)。

你可以控制[并行工作进程数](#限制工作进程数)并[限制失败次数](#限制失败次数和快速失败)以提高整个测试套件的效率。

## 工作进程

所有测试都在工作进程中运行。这些进程是操作系统进程，独立运行，由测试运行器协调。所有工作进程具有相同的环境，每个进程都启动自己的浏览器。

工作进程之间不能通信。Playwright Test 会尽可能重用单个工作进程以加快测试速度，因此多个测试文件通常会在单个工作进程中依次运行。

工作进程在[测试失败](./test-retries.md#失败)后总是会关闭，以确保后续测试有一个干净的环境。

## 限制工作进程数

你可以通过[命令行](./test-cli.md)或[配置文件](./test-configuration.md)控制最大并行工作进程数。

从命令行：

```bash
npx playwright test --workers 4
```

在配置文件中：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 在 CI 上限制工作进程数，本地使用默认值
  workers: process.env.CI ? 2 : undefined,
});
```

:::

## 禁用并行执行

你可以通过只允许一个工作进程来禁用任何并行执行。可以在配置文件中设置 `workers: 1` 选项，或在命令行传递 `--workers=1`。

```bash
npx playwright test --workers=1
```

## 在单个文件中并行化测试

默认情况下，单个文件中的测试按顺序运行。如果你在单个文件中有许多独立的测试，你可能希望使用 [`test.describe.configure()`](/api/class-test#test-describe-configure) 使它们并行运行。

请注意，并行测试在单独的工作进程中执行，不能共享任何状态或全局变量。每个测试只为自己执行所有相关的钩子函数，包括 `beforeAll` 和 `afterAll`。

```js
import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('并行运行 1', async ({ page }) => { /* ... */ });
test('并行运行 2', async ({ page }) => { /* ... */ });
```

或者，你可以在配置文件中将所有测试都设置为完全并行模式：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
});
```

:::

你也可以只为某些项目启用完全并行模式：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 在特定项目中并行运行所有文件中的所有测试
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: true,
    },
  ]
});
```

:::

## 串行模式

你可以将相互依赖的测试标注为串行。如果其中一个串行测试失败，所有后续测试都会被跳过。组中的所有测试会一起重试。

::: info
不建议使用串行模式。通常最好让你的测试保持隔离，这样它们可以独立运行。
:::

```js
import { test, type Page } from '@playwright/test';

// 将整个文件标注为串行。
test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('首先运行', async () => {
  await page.goto('https://playwright.dev/');
});

test('其次运行', async () => {
  await page.getByText('Get Started').click();
});
```

## 测试锁

你的测试套件中可能有一些测试需要访问不支持并发访问的共享资源，例如外部服务或全局账户设置。你可以在这些测试上声明命名锁，这样共享锁名的测试永远不会同时运行，而所有其他测试继续并行运行。锁跨文件、工作进程和[项目](./test-projects.md)工作。

::: code-group

```js [settings.spec.ts]
import { test, expect } from '@playwright/test';

test('更新用户设置', { lock: 'user-settings' }, async ({ page }) => {
  // ...
});
```

:::

::: code-group

```js [profile.spec.ts]
import { test, expect } from '@playwright/test';

// 永远不会与上面的"更新用户设置"同时运行，
// 即使在不同的项目中也是如此。
test('重命名用户', { lock: 'user-settings' }, async ({ page }) => {
  // ...
});
```

:::

一个测试可以声明多个锁，只有当所有锁都可用时才会运行。你也可以使用 [`test.describe()`](/api/class-test#test-describe) 在测试组上声明锁，将其应用于组内的每个测试。

```js
test('重置数据库', { lock: ['database', 'external-api'] }, async () => {
  // ...
});
```

你也可以使用 [`test.describe.configure()`](/api/class-test#test-describe-configure) 将锁添加到包含的文件或 describe 组。重复调用会添加锁而不移除现有的锁。

```js
test.describe.configure({ lock: 'user-settings' });
```

Playwright 在测试开始前获取测试的所有锁，并在测试完成时释放它们。

内置的 `-exclusive-` 锁使测试独立运行：它仅在没有其他测试运行时才开始，并且在它完成之前不会启动其他测试。所有其他测试继续相互并行运行。这对于一些对任何并发活动敏感的测试很有用，例如测量性能或重启共享服务的测试。

```js
test('重启服务器', { lock: '-exclusive-' }, async () => {
  // 当这个测试运行时，不会有其他测试运行。
});
```

::: info
在默认模式和[串行](#串行模式)模式下，文件中的所有测试按顺序一起运行，因此在任何测试上声明的锁在整个文件期间都会被持有。
:::

## 退出完全并行模式

如果你的配置使用 [`testConfig.fullyParallel`](/api/class-testconfig#test-config-fully-parallel) 为所有测试应用了并行模式，你可能仍然希望某些测试使用默认设置运行。你可以按 describe 覆盖模式：

```js
test.describe('与其他 describe 并行运行', () => {
  test.describe.configure({ mode: 'default' });
  test('按顺序 1', async ({ page }) => {});
  test('按顺序 2', async ({ page }) => {});
});
```

## 避免并行测试中的共享状态

Playwright 在单独的工作进程中运行测试，每个进程都有其隔离的 [BrowserContext](/api/class-browsercontext)，因此 cookie、存储和内存中的全局变量已经是隔离的。不稳定性来自于存在于单个测试*之外*的状态。以下是常见情况的解决方案。

### 为每个测试提供自己的后端数据

两个创建或编辑同一记录的测试会相互竞争。从 [`testInfo.testId`](/api/class-testinfo#test-info-test-id) 派生一个唯一标识符，这样并行测试就永远不会冲突：

```js
import { test, expect } from '@playwright/test';

test('创建订单', async ({ page }, testInfo) => {
  const orderId = `order-${testInfo.testId}`;
  await page.goto(`/orders/new?id=${orderId}`);
  await expect(page.getByText(orderId)).toBeVisible();
});
```

如果许多测试可以共享一个数据集，可以为每个工作进程创建一次 —— 参见[在并行工作进程之间隔离测试数据](#在并行工作进程之间隔离测试数据)。

### 写入唯一的文件路径

多个测试写入同一路径会相互覆盖。[`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path) 返回一个限定于当前测试的路径：

```js
import { test } from '@playwright/test';
import fs from 'fs';

test('导出 CSV', async ({ page }, testInfo) => {
  const file = testInfo.outputPath('export.csv');
  await fs.promises.writeFile(file, 'a,b,c', 'utf8');
});
```

### 保持测试独立

最重要的是，[保持测试相互隔离](./writing-tests.md#test-isolation)。通过模块级变量泄漏状态或依赖另一个测试副作用的测试，在测试按顺序运行时可以工作，但在它们并行运行或以不同顺序运行时就会失败。在测试中或在[夹具](./test-fixtures.md#creating-a-fixture)中设置测试所需的一切，永远不要依赖另一个测试先运行。

## 在多台机器之间分片测试

Playwright Test 可以分片测试套件，以便在多台机器上执行。
有关更多详细信息，请参阅[分片指南](./test-sharding.md)。

```bash
npx playwright test --shard=2/3
```

## 限制失败次数和快速失败

你可以通过设置 `maxFailures` 配置选项或传递 `--max-failures` 命令行标志来限制整个测试套件中失败测试的数量。

当设置了"最大失败次数"运行时，Playwright Test 将在达到此失败测试数后停止，并跳过任何尚未执行的测试。这对于避免在损坏的测试套件上浪费资源很有用。

传递命令行选项：

```bash
npx playwright test --max-failures=10
```

在配置文件中设置：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 在 CI 上限制失败次数以节省资源
  maxFailures: process.env.CI ? 10 : undefined,
});
```

:::

## 工作进程索引和并行索引

每个工作进程被分配两个 ID：一个从 0 开始的唯一工作进程索引，和一个在 `0` 到 `workers - 1` 之间的并行索引。当工作进程重启时，例如在失败后，新的工作进程具有相同的 `parallelIndex` 和一个新的 `workerIndex`。

你可以从环境变量 `process.env.TEST_WORKER_INDEX` 和 `process.env.TEST_PARALLEL_INDEX` 读取索引，或通过 [`testInfo.workerIndex`](/api/class-testinfo#test-info-worker-index) 和 [`testInfo.parallelIndex`](/api/class-testinfo#test-info-parallel-index) 访问它们。

### 在并行工作进程之间隔离测试数据

你可以利用上面提到的 `process.env.TEST_WORKER_INDEX` 或 [`testInfo.workerIndex`](/api/class-testinfo#test-info-worker-index) 来隔离在不同工作进程上运行的测试之间的数据库用户数据。工作进程运行的所有测试都重用同一个用户。

创建 `playwright/fixtures.ts` 文件，它将[创建 `dbUserName` 夹具](./test-fixtures#creating-a-fixture)并在测试数据库中初始化一个新用户。使用 [`testInfo.workerIndex`](/api/class-testinfo#test-info-worker-index) 来区分不同的工作进程。

::: code-group

```js [playwright/fixtures.ts]
import { test as baseTest, expect } from '@playwright/test';
// 导入用于管理测试数据库中用户的项目工具。
import { createUserInTestDatabase, deleteUserFromTestDatabase } from './my-db-utils';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { dbUserName: string }>({
  // 返回该工作进程唯一的数据库用户名。
  dbUserName: [async ({ }, use) => {
    // 使用 workerIndex 作为每个工作进程的唯一标识符。
    const userName = `user-${test.info().workerIndex}`;
    // 在数据库中初始化用户。
    await createUserInTestDatabase(userName);
    await use(userName);
    // 测试完成后清理。
    await deleteUserFromTestDatabase(userName);
  }, { scope: 'worker' }],
});
```

:::

现在，每个测试文件应该从我们的 fixtures 文件而不是 `@playwright/test` 导入 `test`。

::: code-group

```js [tests/example.spec.ts]
// 重要：导入我们的 fixtures。
import { test, expect } from '../playwright/fixtures';

test('测试', async ({ dbUserName }) => {
  // 在测试中使用用户名。
});
```

:::

## 控制测试顺序

Playwright Test 按声明顺序运行单个文件中的测试，除非你[在单个文件中并行化测试](#在单个文件中并行化测试)。

不保证跨文件的测试执行顺序，因为 Playwright Test 默认并行运行测试文件。但是，如果你[禁用并行执行](#禁用并行执行)，你可以通过按字母顺序命名文件或使用"测试列表"文件来控制测试顺序。

### 按字母顺序排序测试文件

当你**禁用并行测试执行**时，Playwright Test 按字母顺序运行测试文件。你可以使用一些命名约定来控制测试顺序，例如 `001-user-signin-flow.spec.ts`、`002-create-new-document.spec.ts` 等。

### 使用"测试列表"文件

::: warning
不建议使用测试列表，仅作为尽力而为的支持。某些功能如 VS Code 扩展和跟踪可能无法与测试列表正常工作。
:::

你可以将测试放在多个文件的辅助函数中。考虑以下示例，其中测试不是直接在文件中定义的，而是在包装函数中。

::: code-group

```js [feature-a.spec.ts]
import { test, expect } from '@playwright/test';

export default function createTests() {
  test('feature-a 示例测试', async ({ page }) => {
    // ... 测试代码在这里
  });
}

```

:::

::: code-group

```js [feature-b.spec.ts]
import { test, expect } from '@playwright/test';

export default function createTests() {
  test.use({ viewport: { width: 500, height: 500 } });

  test('feature-b 示例测试', async ({ page }) => {
    // ... 测试代码在这里
  });
}
```

:::

你可以创建一个测试列表文件来控制测试顺序 —— 首先运行 `feature-b` 测试，然后运行 `feature-a` 测试。注意每个测试文件都被包装在一个调用定义测试的函数的 `test.describe()` 块中。这样 `test.use()` 调用只影响单个文件的测试。

::: code-group

```js [test.list.ts]
import { test } from '@playwright/test';
import featureBTests from './feature-b.spec.ts';
import featureATests from './feature-a.spec.ts';

test.describe(featureBTests);
test.describe(featureATests);
```

:::

现在通过将 workers 设置为一个来**禁用并行执行**，并指定你的测试列表文件。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 1,
  testMatch: 'test.list.ts',
});
```

:::

::: info
不要直接在辅助文件中定义测试。这可能会导致意外结果，因为你的测试现在依赖于 `import`/`require` 语句的顺序。相反，将测试包装在一个函数中，该函数将被测试列表文件显式调用，如上面的示例所示。
:::
