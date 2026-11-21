---
title: "参数化测试"
---

# 参数化测试

## 简介

你可以在测试级别或项目级别对测试进行参数化。

## 参数化测试

::: code-group

```js [example.spec.ts]
[
  { name: 'Alice', expected: 'Hello, Alice!' },
  { name: 'Bob', expected: 'Hello, Bob!' },
  { name: 'Charlie', expected: 'Hello, Charlie!' },
].forEach(({ name, expected }) => {
  // 你也可以使用 test.describe() 或多个测试，只要测试名称唯一即可。
  test(`使用 ${name} 进行测试`, async ({ page }) => {
    await page.goto(`https://example.com/greet?name=${name}`);
    await expect(page.getByRole('heading')).toHaveText(expected);
  });
});
```

:::

### 前置和后置钩子

大多数情况下，你应该将 `beforeEach`、`beforeAll`、`afterEach` 和 `afterAll` 钩子放在 `forEach` 外部，这样钩子只执行一次：

::: code-group

```js [example.spec.ts]
test.beforeEach(async ({ page }) => {
  // ...
});

test.afterEach(async ({ page }) => {
  // ...
});

[
  { name: 'Alice', expected: 'Hello, Alice!' },
  { name: 'Bob', expected: 'Hello, Bob!' },
  { name: 'Charlie', expected: 'Hello, Charlie!' },
].forEach(({ name, expected }) => {
  test(`使用 ${name} 进行测试`, async ({ page }) => {
    await page.goto(`https://example.com/greet?name=${name}`);
    await expect(page.getByRole('heading')).toHaveText(expected);
  });
});
```

:::

如果你想为每个测试都有钩子，可以将它们放在 `describe()` 内部 - 这样它们会为每次迭代/每个单独的测试执行：

::: code-group

```js [example.spec.ts]
[
  { name: 'Alice', expected: 'Hello, Alice!' },
  { name: 'Bob', expected: 'Hello, Bob!' },
  { name: 'Charlie', expected: 'Hello, Charlie!' },
].forEach(({ name, expected }) => {
  test.describe(() => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`https://example.com/greet?name=${name}`);
    });
    test(`使用 ${expected} 进行测试`, async ({ page }) => {
      await expect(page.getByRole('heading')).toHaveText(expected);
    });
  });
});
```

:::

## 参数化项目

Playwright Test 支持同时运行多个测试项目。在下面的示例中，我们将使用不同的选项运行两个项目。

我们声明选项 `person` 并在配置中设置值。第一个项目使用值 `Alice` 运行，第二个使用值 `Bob` 运行。

::: code-group

```js [JavaScript]
const base = require('@playwright/test');

exports.test = base.test.extend({
  // 定义一个选项并提供默认值。
  // 我们可以稍后在配置中覆盖它。
  person: ['John', { option: true }],
});
```

```js [TypeScript]
import { test as base } from '@playwright/test';

export type TestOptions = {
  person: string;
};

export const test = base.extend<TestOptions>({
  // 定义一个选项并提供默认值。
  // 我们可以稍后在配置中覆盖它。
  person: ['John', { option: true }],
});
```

:::

我们可以在测试中使用这个选项，类似于[夹具](./test-fixtures.md)。

::: code-group

```js [example.spec.ts]
import { test } from './my-test';

test('测试 1', async ({ page, person }) => {
  await page.goto(`/index.html`);
  await expect(page.locator('#node')).toContainText(person);
  // ...
});
```

:::

现在，我们可以通过使用项目在多个配置中运行测试。

::: code-group

```js [JavaScript]
// @ts-check

module.exports = defineConfig({
  projects: [
    {
      name: 'alice',
      use: { person: 'Alice' },
    },
    {
      name: 'bob',
      use: { person: 'Bob' },
    },
  ]
});
```

```js [TypeScript]
import { defineConfig } from '@playwright/test';
import type { TestOptions } from './my-test';

export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'alice',
      use: { person: 'Alice' },
    },
    {
      name: 'bob',
      use: { person: 'Bob' },
    },
  ]
});
```

:::

我们也可以在夹具中使用该选项。了解更多关于[夹具](./test-fixtures.md)的内容。

::: code-group

```js [JavaScript]
const base = require('@playwright/test');

exports.test = base.test.extend({
  // 定义一个选项并提供默认值。
  // 我们可以稍后在配置中覆盖它。
  person: ['John', { option: true }],

  // 覆盖默认的 "page" 夹具。
  page: async ({ page, person }, use) => {
    await page.goto('/chat');
    // 我们使用 "person" 参数作为聊天室的 "name"。
    await page.getByLabel('User Name').fill(person);
    await page.getByText('Enter chat room').click();
    // 每个测试都会获得一个已经设置了人员名称的 "page"。
    await use(page);
  },
});
```

```js [TypeScript]
import { test as base } from '@playwright/test';

export type TestOptions = {
  person: string;
};

export const test = base.extend<TestOptions>({
  // 定义一个选项并提供默认值。
  // 我们可以稍后在配置中覆盖它。
  person: ['John', { option: true }],

  // 覆盖默认的 "page" 夹具。
  page: async ({ page, person }, use) => {
    await page.goto('/chat');
    // 我们使用 "person" 参数作为聊天室的 "name"。
    await page.getByLabel('User Name').fill(person);
    await page.getByText('Enter chat room').click();
    // 每个测试都会获得一个已经设置了人员名称的 "page"。
    await use(page);
  },
});
```

:::

::: info
参数化项目的行为在 1.18 版本中有所改变。[了解更多](./release-notes#breaking-change-custom-config-options)。
:::

## 传递环境变量

你可以使用环境变量从命令行配置测试。

例如，考虑以下需要用户名和密码的测试文件。通常不建议将秘密信息存储在源代码中，因此我们需要一种从外部传递秘密信息的方法。

::: code-group

```js [example.spec.ts]
test(`示例测试`, async ({ page }) => {
  // ...
  await page.getByLabel('User Name').fill(process.env.USER_NAME);
  await page.getByLabel('Password').fill(process.env.PASSWORD);
});
```

:::

你可以在命令行中设置秘密的用户名和密码来运行此测试。

::: code-group

```bash [Bash]
USER_NAME=me PASSWORD=secret npx playwright test
```

```bat [Batch]
set USER_NAME=me
set PASSWORD=secret
npx playwright test
```

```powershell [PowerShell]
$env:USER_NAME=me
$env:PASSWORD=secret
npx playwright test
```

:::

同样，配置文件也可以读取通过命令行传递的环境变量。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.STAGING === '1' ? 'http://staging.example.test/' : 'http://example.test/',
  }
});
```

:::

现在，你可以针对预发布或生产环境运行测试：

::: code-group

```bash [Bash]
STAGING=1 npx playwright test
```

```bat [Batch]
set STAGING=1
npx playwright test
```

```powershell [PowerShell]
$env:STAGING=1
npx playwright test
```

:::

### .env 文件

为了更方便地管理环境变量，可以考虑使用 `.env` 文件。这是一个使用 [`dotenv`](https://www.npmjs.com/package/dotenv) 包在配置文件中直接读取环境变量的示例。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// 从 ".env" 文件读取。
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 或者，从 "../my.env" 文件读取。
dotenv.config({ path: path.resolve(__dirname, '..', 'my.env') });

export default defineConfig({
  use: {
    baseURL: process.env.STAGING === '1' ? 'http://staging.example.test/' : 'http://example.test/',
  }
});
```

:::

现在，你只需编辑 `.env` 文件来设置任何你想要的变量。

```bash
# .env 文件
STAGING=0
USER_NAME=me
PASSWORD=secret
```

像往常一样运行测试，你的环境变量应该会被读取。

```bash
npx playwright test
```

## 通过 CSV 文件创建测试

Playwright 测试运行器在 Node.js 中运行，这意味着你可以直接从文件系统读取文件，并使用你喜欢的 CSV 库解析它们。

例如，查看这个 CSV 文件，在我们的示例中是 `input.csv`：

```txt
"test_case","some_value","some_other_value"
"value 1","value 11","foobar1"
"value 2","value 22","foobar21"
"value 3","value 33","foobar321"
"value 4","value 44","foobar4321"
```

基于此，我们将使用 NPM 的 [csv-parse](https://www.npmjs.com/package/csv-parse) 库生成一些测试：

::: code-group

```js [test.spec.ts]
import fs from 'fs';
import path from 'path';
import { test } from '@playwright/test';
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, 'input.csv')), {
  columns: true,
  skip_empty_lines: true
});

for (const record of records) {
  test(`foo: ${record.test_case}`, async ({ page }) => {
    console.log(record.test_case, record.some_value, record.some_other_value);
  });
}
```

:::
