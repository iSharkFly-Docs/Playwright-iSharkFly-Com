---
title: "夹具"
---

# 夹具

## 简介

Playwright Test 基于测试夹具的概念。测试夹具用于为每个测试建立环境，为测试提供所需的一切，仅此而已。测试夹具在测试之间是隔离的。使用夹具，你可以根据测试的含义而不是它们的公共设置来对测试进行分组。

### 内置夹具

你已经在第一个测试中使用了测试夹具。

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page).toHaveTitle(/Playwright/);
});
```

`{ page }` 参数告诉 Playwright Test 设置 `page` 夹具并将其提供给你的测试函数。

以下是你最常使用的预定义夹具列表：

|夹具    |类型               |描述                      |
|:----------|:------------------|:--------------------------------|
|page       |[Page](/api/class-page)             |此测试运行的隔离页面。|
|context    |[BrowserContext](/api/class-browsercontext)   |此测试运行的隔离上下文。`page` 夹具也属于此上下文。了解如何[配置上下文](./test-configuration.md)。|
|browser    |[Browser](/api/class-browser)          |浏览器在测试之间共享以优化资源。了解如何[配置浏览器](./test-configuration.md)。|
|browserName|[string]           |当前运行测试的浏览器名称。是 `chromium`、`firefox` 或 `webkit` 之一。|
|request    |[APIRequestContext](/api/class-apirequestcontext)|此测试运行的隔离 [APIRequestContext](./api/class-apirequestcontext.md) 实例。|

### 不使用夹具

以下是传统测试风格和基于夹具的测试风格之间典型测试环境设置的区别。

`TodoPage` 是一个帮助我们与 Web 应用的"待办事项列表"页面交互的类，遵循[页面对象模型](./pom.md)模式。它在内部使用 Playwright 的 `page`。

<details>

<summary>点击展开 <code>TodoPage</code> 的代码</summary>

<div>

::: code-group

```js [todo-page.ts]
import type { Page, Locator } from '@playwright/test';

export class TodoPage {
  private readonly inputBox: Locator;
  private readonly todoItems: Locator;

  constructor(public readonly page: Page) {
    this.inputBox = this.page.locator('input.new-todo');
    this.todoItems = this.page.getByTestId('todo-item');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addToDo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press('Enter');
  }

  async remove(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.getByLabel('Delete').click();
  }

  async removeAll() {
    while ((await this.todoItems.count()) > 0) {
      await this.todoItems.first().hover();
      await this.todoItems.getByLabel('Delete').first().click();
    }
  }
}
```

:::

</div>

</details>

::: code-group

```js [todo.spec.ts]
const { test } = require('@playwright/test');
const { TodoPage } = require('./todo-page');

test.describe('todo tests', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo('item1');
    await todoPage.addToDo('item2');
  });

  test.afterEach(async () => {
    await todoPage.removeAll();
  });

  test('should add an item', async () => {
    await todoPage.addToDo('my item');
    // ...
  });

  test('should remove an item', async () => {
    await todoPage.remove('item1');
    // ...
  });
});
```

:::

### 使用夹具

与 before/after 钩子相比，夹具有许多优势：
- 夹具将设置和清理**封装**在同一个地方，因此更容易编写。所以如果你有一个清理 before 钩子中创建内容的 after 钩子，考虑将它们转换为夹具。
- 夹具在测试文件之间是**可复用的** - 你可以定义一次并在所有测试中使用。这就是 Playwright 内置 `page` 夹具的工作方式。所以如果你有一个在多个测试中使用的辅助函数，考虑将其转换为夹具。
- 夹具是**按需的** - 你可以定义任意多的夹具，Playwright Test 只会设置测试需要的那些，其他的不会设置。
- 夹具是**可组合的** - 它们可以相互依赖以提供复杂的行为。
- 夹具是**灵活的**。测试可以使用任何夹具组合来精确定制他们需要的环境，而不影响其他测试。
- 夹具简化了**分组**。你不再需要将测试包装在设置环境的 `describe` 中，可以自由地根据测试的含义对测试进行分组。

<details>

<summary>点击展开 <code>TodoPage</code> 的代码</summary>

<div>

::: code-group

```js [todo-page.ts]
import type { Page, Locator } from '@playwright/test';

export class TodoPage {
  private readonly inputBox: Locator;
  private readonly todoItems: Locator;

  constructor(public readonly page: Page) {
    this.inputBox = this.page.locator('input.new-todo');
    this.todoItems = this.page.getByTestId('todo-item');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addToDo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press('Enter');
  }

  async remove(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.getByLabel('Delete').click();
  }

  async removeAll() {
    while ((await this.todoItems.count()) > 0) {
      await this.todoItems.first().hover();
      await this.todoItems.getByLabel('Delete').first().click();
    }
  }
}
```

:::

</div>

</details>

::: code-group

```js [example.spec.ts]
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';

// 通过提供 "todoPage" 夹具来扩展基本测试。
const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo('item1');
    await todoPage.addToDo('item2');
    await use(todoPage);
    await todoPage.removeAll();
  },
});

test('should add an item', async ({ todoPage }) => {
  await todoPage.addToDo('my item');
  // ...
});

test('should remove an item', async ({ todoPage }) => {
  await todoPage.remove('item1');
  // ...
});
```

:::

## 创建夹具

要创建自己的夹具，使用 [`test.extend()`](/api/class-test#test-extend) 创建一个包含它的新 `test` 对象。

下面我们创建两个遵循[页面对象模型](./pom.md)模式的夹具 `todoPage` 和 `settingsPage`。

<details>

<summary>点击展开 <code>TodoPage</code> 和 <code>SettingsPage</code> 的代码</summary>

<div>

::: code-group

```js [todo-page.ts]
import type { Page, Locator } from '@playwright/test';

export class TodoPage {
  private readonly inputBox: Locator;
  private readonly todoItems: Locator;

  constructor(public readonly page: Page) {
    this.inputBox = this.page.locator('input.new-todo');
    this.todoItems = this.page.getByTestId('todo-item');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addToDo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press('Enter');
  }

  async remove(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.getByLabel('Delete').click();
  }

  async removeAll() {
    while ((await this.todoItems.count()) > 0) {
      await this.todoItems.first().hover();
      await this.todoItems.getByLabel('Delete').first().click();
    }
  }
}
```

:::

SettingsPage 类似：

::: code-group

```js [settings-page.ts]
import type { Page } from '@playwright/test';

export class SettingsPage {
  constructor(public readonly page: Page) {
  }

  async switchToDarkMode() {
    // ...
  }
}
```

:::

</div>

</details>

::: code-group

```js [my-test.ts]
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';
import { SettingsPage } from './settings-page';

// 声明夹具的类型。
type MyFixtures = {
  todoPage: TodoPage;
  settingsPage: SettingsPage;
};

// 通过提供 "todoPage" 和 "settingsPage" 来扩展基本测试。
// 这个新的 "test" 可以在多个测试文件中使用，每个文件都会获得这些夹具。
export const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    // 设置夹具。
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo('item1');
    await todoPage.addToDo('item2');

    // 在测试中使用夹具值。
    await use(todoPage);

    // 清理夹具。
    await todoPage.removeAll();
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
});
export { expect } from '@playwright/test';
```

:::

::: info
自定义夹具名称应以字母或下划线开头，只能包含字母、数字和下划线。
:::

## 使用夹具

只需在测试函数参数中提及夹具，测试运行器就会处理它。夹具在钩子和其他夹具中也可用。如果你使用 TypeScript，夹具将是类型安全的。

下面我们使用上面定义的 `todoPage` 和 `settingsPage` 夹具。

```js
import { test, expect } from './my-test';

test.beforeEach(async ({ settingsPage }) => {
  await settingsPage.switchToDarkMode();
});

test('basic test', async ({ todoPage, page }) => {
  await todoPage.addToDo('something nice');
  await expect(page.getByTestId('todo-title')).toContainText(['something nice']);
});
```

## 覆盖夹具

除了创建自己的夹具，你还可以覆盖现有夹具以适应你的需求。考虑以下示例，它通过自动导航到 `baseURL` 来覆盖 `page` 夹具：

```js
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    await page.goto(baseURL);
    await use(page);
  },
});
```

注意，在这个示例中，`page` 夹具能够依赖其他内置夹具，如 [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url)。我们现在可以在配置文件中配置 `baseURL`，或者使用 [`test.use()`](/api/class-test#test-use) 在测试文件中本地配置。

::: code-group

```js [example.spec.ts]

test.use({ baseURL: 'https://playwright.dev' });
```

:::

夹具也可以被覆盖，导致基本夹具被完全替换为不同的东西。例如，我们可以覆盖 [`testOptions.storageState`](/api/class-testoptions#test-options-storage-state) 夹具来提供我们自己的数据。

```js
import { test as base } from '@playwright/test';

export const test = base.extend({
  storageState: async ({}, use) => {
    const cookie = await getAuthCookie();
    await use({ cookies: [cookie] });
  },
});
```

## 工作进程作用域的夹具

Playwright Test 使用[工作进程](./test-parallel.md)来运行测试文件。与为每个测试运行设置测试夹具类似，工作进程夹具是为每个工作进程设置的。你可以在那里设置服务、运行服务器等。Playwright Test 将尽可能多地为测试文件重用工作进程，前提是它们的工作进程夹具匹配，因此环境相同。

下面我们将创建一个 `account` 夹具，它将被同一工作进程中的所有测试共享，并覆盖 `page` 夹具以为每个测试登录此帐户。为了生成唯一的帐户，我们将使用任何测试或夹具都可用的 [`workerInfo.workerIndex`](/api/class-workerinfo#worker-info-worker-index)。注意工作进程夹具的元组语法 - 我们必须传递 `{scope: 'worker'}` 以便测试运行器为每个工作进程设置此夹具一次。

除了每个工作进程只运行一次外，工作进程作用域的夹具还有一个单独的超时，等于默认测试超时。你可以通过传递 `timeout` 选项来更改它。有关更多详情，请参阅[夹具超时](#夹具超时)。

::: code-group

```js [my-test.ts]
import { test as base } from '@playwright/test';

type Account = {
  username: string;
  password: string;
};

// 注意，我们将工作进程夹具类型作为第二个模板参数传递。
export const test = base.extend<{}, { account: Account }>({
  account: [async ({ browser }, use, workerInfo) => {
    // 唯一用户名。
    const username = 'user' + workerInfo.workerIndex;
    const password = 'verysecure';

    // 使用 Playwright 创建帐户。
    const page = await browser.newPage();
    await page.goto('/signup');
    await page.getByLabel('User Name').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByText('Sign up').click();
    // 确保一切正常。
    await expect(page.getByTestId('result')).toHaveText('Success');
    // 不要忘记清理。
    await page.close();

    // 使用帐户值。
    await use({ username, password });
  }, { scope: 'worker' }],

  page: async ({ page, account }, use) => {
    // 用我们的帐户登录。
    const { username, password } = account;
    await page.goto('/signin');
    await page.getByLabel('User Name').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByText('Sign in').click();
    await expect(page.getByTestId('userinfo')).toHaveText(username);

    // 在测试中使用已登录的页面。
    await use(page);
  },
});
export { expect } from '@playwright/test';
```

:::

## 自动夹具

自动夹具为每个测试/工作进程设置，即使测试没有直接列出它们。要创建自动夹具，使用元组语法并传递 `{ auto: true }`。

这是一个示例夹具，当测试失败时自动附加调试日志，以便我们稍后在报告器中查看日志。注意它如何使用每个测试/夹具中可用的 [TestInfo](/api/class-testinfo) 对象来检索关于正在运行的测试的元数据。

::: code-group

```js [my-test.ts]
import debug from 'debug';
import fs from 'fs';
import { test as base } from '@playwright/test';

export const test = base.extend<{ saveLogs: void }>({
  saveLogs: [async ({}, use, testInfo) => {
    // 在测试期间收集日志。
    const logs = [];
    debug.log = (...args) => logs.push(args.map(String).join(''));
    debug.enable('myserver');

    await use();

    // 测试后我们可以检查测试是否通过或失败。
    if (testInfo.status !== testInfo.expectedStatus) {
      // outputPath() API 保证唯一的文件名。
      const logFile = testInfo.outputPath('logs.txt');
      await fs.promises.writeFile(logFile, logs.join('\n'), 'utf8');
      testInfo.attachments.push({ name: 'logs', contentType: 'text/plain', path: logFile });
    }
  }, { auto: true }],
});
export { expect } from '@playwright/test';
```

:::

## 夹具超时

夹具被视为测试的一部分，因此其设置和清理运行时间计入测试超时。因此，慢速夹具可能会导致测试超时。你可以为这样的夹具设置一个单独的更大的超时，并保持整体测试超时较小。

```js
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ slowFixture: string }>({
  slowFixture: [async ({}, use) => {
    // ... 执行慢速操作 ...
    await use('hello');
  }, { timeout: 60000 }]
});

test('example test', async ({ slowFixture }) => {
  // ...
});
```

与常规测试作用域的夹具不同，每个[工作进程作用域](#工作进程作用域的夹具)的夹具都有自己的超时，等于测试超时。你可以以相同的方式更改工作进程作用域夹具的超时。

## 夹具选项

Playwright Test 支持运行可以单独配置的多个测试项目。你可以使用"选项"夹具使你的配置选项具有声明性和类型安全性。了解更多关于[参数化测试](./test-parameterize.md)。

下面我们将在其他示例中的 `todoPage` 夹具之外创建一个 `defaultItem` 选项。此选项将在配置文件中设置。注意元组语法和 `{ option: true }` 参数。

<details>

<summary>点击展开 <code>TodoPage</code> 的代码</summary>

<div>

::: code-group

```js [todo-page.ts]
import type { Page, Locator } from '@playwright/test';

export class TodoPage {
  private readonly inputBox: Locator;
  private readonly todoItems: Locator;

  constructor(public readonly page: Page) {
    this.inputBox = this.page.locator('input.new-todo');
    this.todoItems = this.page.getByTestId('todo-item');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addToDo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press('Enter');
  }

  async remove(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.getByLabel('Delete').click();
  }

  async removeAll() {
    while ((await this.todoItems.count()) > 0) {
      await this.todoItems.first().hover();
      await this.todoItems.getByLabel('Delete').first().click();
    }
  }
}
```

:::

</div>

</details>

::: code-group

```js [my-test.ts]
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';

// 声明你的选项以对配置进行类型检查。
export type MyOptions = {
  defaultItem: string;
};
type MyFixtures = {
  todoPage: TodoPage;
};

// 指定选项和夹具类型。
export const test = base.extend<MyOptions & MyFixtures>({
  // 定义一个选项并提供默认值。
  // 我们稍后可以在配置中覆盖它。
  defaultItem: ['Something nice', { option: true }],

  // 我们的 "todoPage" 夹具依赖于该选项。
  todoPage: async ({ page, defaultItem }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo(defaultItem);
    await use(todoPage);
    await todoPage.removeAll();
  },
});
export { expect } from '@playwright/test';
```

:::

我们现在可以像往常一样使用 `todoPage` 夹具，并在配置文件中设置 `defaultItem` 选项。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
import type { MyOptions } from './my-test';

export default defineConfig<MyOptions>({
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

**数组作为选项值**

如果你的选项值是数组，例如 `[{ name: 'Alice' }, { name: 'Bob' }]`，你需要在提供值时将其包装在额外的数组中。这最好通过示例来说明。

```js
type Person = { name: string };
const test = base.extend<{ persons: Person[] }>({
  // 声明选项，默认值是空数组。
  persons: [[], { option: true }],
});

// 选项值是一个人员数组。
const actualPersons = [{ name: 'Alice' }, { name: 'Bob' }];
test.use({
  // 正确：将值包装在数组中并传递作用域。
  persons: [actualPersons, { scope: 'test' }],
});

test.use({
  // 错误：直接传递数组值不起作用。
  persons: actualPersons,
});
```

**重置选项**

你可以通过将选项设置为 `undefined` 来将其重置为配置文件中定义的值。考虑以下设置 `baseURL` 的配置：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://playwright.dev',
  },
});
```

:::

你现在可以为文件配置 `baseURL`，也可以为单个测试选择退出。

::: code-group

```js [intro.spec.ts]
import { test } from '@playwright/test';

// 为此文件配置 baseURL。
test.use({ baseURL: 'https://playwright.dev/docs/intro' });

test('check intro contents', async ({ page }) => {
  // 此测试将使用上面定义的 "https://playwright.dev/docs/intro" 基础 URL。
});

test.describe(() => {
  // 将值重置为配置中定义的值。
  test.use({ baseURL: undefined });

  test('can navigate to intro from the home page', async ({ page }) => {
    // 此测试将使用配置中定义的 "https://playwright.dev" 基础 URL。
  });
});
```

:::

如果你想将值完全重置为 `undefined`，请使用长格式的夹具表示法。

::: code-group

```js [intro.spec.ts]
import { test } from '@playwright/test';

// 为此文件完全取消设置 baseURL。
test.use({
  baseURL: [async ({}, use) => use(undefined), { scope: 'test' }],
});

test('no base url', async ({ page }) => {
  // 此测试将没有基础 URL。
});
```

:::

## 执行顺序

每个夹具在夹具中的 `await use()` 调用之前和之后都有设置和清理阶段。设置在需要它的测试/钩子运行之前执行，清理在夹具不再被测试/钩子使用时执行。

夹具遵循以下规则来确定执行顺序：
* 当夹具 A 依赖于夹具 B 时：B 总是在 A 之前设置并在 A 之后清理。
* 非自动夹具是延迟执行的，仅在测试/钩子需要它们时才执行。
* 测试作用域的夹具在每个测试后清理，而工作进程作用域的夹具仅在执行测试的工作进程关闭时才清理。

考虑以下示例：

```js
import { test as base } from '@playwright/test';

const test = base.extend<{
  testFixture: string,
  autoTestFixture: string,
  unusedFixture: string,
}, {
  workerFixture: string,
  autoWorkerFixture: string,
}>({
  workerFixture: [async ({ browser }) => {
    // workerFixture 设置...
    await use('workerFixture');
    // workerFixture 清理...
  }, { scope: 'worker' }],

  autoWorkerFixture: [async ({ browser }) => {
    // autoWorkerFixture 设置...
    await use('autoWorkerFixture');
    // autoWorkerFixture 清理...
  }, { scope: 'worker', auto: true }],

  testFixture: [async ({ page, workerFixture }) => {
    // testFixture 设置...
    await use('testFixture');
    // testFixture 清理...
  }, { scope: 'test' }],

  autoTestFixture: [async () => {
    // autoTestFixture 设置...
    await use('autoTestFixture');
    // autoTestFixture 清理...
  }, { scope: 'test', auto: true }],

  unusedFixture: [async ({ page }) => {
    // unusedFixture 设置...
    await use('unusedFixture');
    // unusedFixture 清理...
  }, { scope: 'test' }],
});

test.beforeAll(async () => { /* ... */ });
test.beforeEach(async ({ page }) => { /* ... */ });
test('first test', async ({ page }) => { /* ... */ });
test('second test', async ({ testFixture }) => { /* ... */ });
test.afterEach(async () => { /* ... */ });
test.afterAll(async () => { /* ... */ });
```

通常，如果所有测试都通过且没有抛出错误，执行顺序如下。
* 工作进程设置和 `beforeAll` 部分：
  * `browser` 设置，因为 `autoWorkerFixture` 需要它。
  * `autoWorkerFixture` 设置，因为自动工作进程夹具总是在其他任何东西之前设置。
  * `beforeAll` 运行。
* `first test` 部分：
  * `autoTestFixture` 设置，因为自动测试夹具总是在测试和 `beforeEach` 钩子之前设置。
  * `page` 设置，因为 `beforeEach` 钩子需要它。
  * `beforeEach` 运行。
  * `first test` 运行。
  * `afterEach` 运行。
  * `page` 清理，因为它是测试作用域的夹具，应该在测试完成后清理。
  * `autoTestFixture` 清理，因为它是测试作用域的夹具，应该在测试完成后清理。
* `second test` 部分：
  * `autoTestFixture` 设置，因为自动测试夹具总是在测试和 `beforeEach` 钩子之前设置。
  * `page` 设置，因为 `beforeEach` 钩子需要它。
  * `beforeEach` 运行。
  * `workerFixture` 设置，因为 `second test` 需要的 `testFixture` 需要它。
  * `testFixture` 设置，因为 `second test` 需要它。
  * `second test` 运行。
  * `afterEach` 运行。
  * `testFixture` 清理，因为它是测试作用域的夹具，应该在测试完成后清理。
  * `page` 清理，因为它是测试作用域的夹具，应该在测试完成后清理。
  * `autoTestFixture` 清理，因为它是测试作用域的夹具，应该在测试完成后清理。
* `afterAll` 和工作进程清理部分：
  * `afterAll` 运行。
  * `workerFixture` 清理，因为它是工作进程作用域的夹具，应该在最后清理一次。
  * `autoWorkerFixture` 清理，因为它是工作进程作用域的夹具，应该在最后清理一次。
  * `browser` 清理，因为它是工作进程作用域的夹具，应该在最后清理一次。

一些观察：
* `page` 和 `autoTestFixture` 作为测试作用域的夹具为每个测试设置和清理。
* `unusedFixture` 从未设置，因为没有任何测试/钩子使用它。
* `testFixture` 依赖于 `workerFixture` 并触发其设置。
* `workerFixture` 在第二个测试之前延迟设置，但在工作进程关闭期间清理一次，作为工作进程作用域的夹具。
* `autoWorkerFixture` 为 `beforeAll` 钩子设置，但 `autoTestFixture` 没有。

## 从多个模块合并自定义夹具

你可以从多个文件或模块合并测试夹具：

::: code-group

```js [fixtures.ts]
import { mergeTests } from '@playwright/test';
import { test as dbTest } from 'database-test-utils';
import { test as a11yTest } from 'a11y-test-utils';

export const test = mergeTests(dbTest, a11yTest);
```

:::

::: code-group

```js [test.spec.ts]
import { test } from './fixtures';

test('passes', async ({ database, page, a11y }) => {
  // 使用 database 和 a11y 夹具。
});
```

:::

## 盒装夹具

通常，自定义夹具在 UI 模式、Trace Viewer 和各种测试报告中作为单独的步骤报告。它们也出现在测试运行器的错误消息中。对于经常使用的夹具，这可能意味着很多噪音。你可以通过"盒装"它来停止在 UI 中显示夹具步骤。

```js
import { test as base } from '@playwright/test';

export const test = base.extend({
  helperFixture: [async ({}, use, testInfo) => {
    // ...
  }, { box: true }],
});
```

这对于不重要的辅助夹具很有用。例如，设置一些公共数据的[自动](./test-fixtures.md#自动夹具)夹具可以安全地从测试报告中隐藏。

你也可以将夹具标记为 `box: 'self'`，只隐藏该特定夹具，但在测试报告中包含夹具内部的所有步骤。

## 自定义夹具标题

你可以给夹具一个自定义标题，而不是通常的夹具名称，该标题将显示在测试报告和错误消息中。

```js
import { test as base } from '@playwright/test';

export const test = base.extend({
  innerFixture: [async ({}, use, testInfo) => {
    // ...
  }, { title: 'my fixture' }],
});
```

## 添加全局 beforeEach/afterEach 钩子

[`test.beforeEach()`](/api/class-test#test-before-each) 和 [`test.afterEach()`](/api/class-test#test-after-each) 钩子在同一文件和同一 [`test.describe()`](/api/class-test#test-describe) 块（如果有）中声明的每个测试之前/之后运行。如果你想声明全局运行在每个测试之前/之后的钩子，你可以像这样将它们声明为自动夹具：

::: code-group

```js [fixtures.ts]
import { test as base } from '@playwright/test';

export const test = base.extend<{ forEachTest: void }>({
  forEachTest: [async ({ page }, use) => {
    // 此代码在每个测试之前运行。
    await page.goto('http://localhost:8000');
    await use();
    // 此代码在每个测试之后运行。
    console.log('Last URL:', page.url());
  }, { auto: true }],  // 为每个测试自动启动。
});
```

:::

然后在所有测试中导入夹具：

::: code-group

```js [mytest.spec.ts]
import { test } from './fixtures';
import { expect } from '@playwright/test';

test('basic', async ({ page }) => {
  expect(page).toHaveURL('http://localhost:8000');
  await page.goto('https://playwright.dev');
});
```

:::

## 添加全局 beforeAll/afterAll 钩子

[`test.beforeAll()`](/api/class-test#test-before-all) 和 [`test.afterAll()`](/api/class-test#test-after-all) 钩子在同一文件和同一 [`test.describe()`](/api/class-test#test-describe) 块（如果有）中声明的所有测试之前/之后运行，每个工作进程一次。如果你想声明在每个文件中所有测试之前/之后运行的钩子，你可以像这样将它们声明为具有 `scope: 'worker'` 的自动夹具：

::: code-group

```js [fixtures.ts]
import { test as base } from '@playwright/test';

export const test = base.extend<{}, { forEachWorker: void }>({
  forEachWorker: [async ({}, use) => {
    // 此代码在工作进程中的所有测试之前运行。
    console.log(`Starting test worker ${test.info().workerIndex}`);
    await use();
    // 此代码在工作进程中的所有测试之后运行。
    console.log(`Stopping test worker ${test.info().workerIndex}`);
  }, { scope: 'worker', auto: true }],  // 为每个工作进程自动启动。
});
```

:::

然后在所有测试中导入夹具：

::: code-group

```js [mytest.spec.ts]
import { test } from './fixtures';
import { expect } from '@playwright/test';

test('basic', async ({ }) => {
  // ...
});
```

:::

注意，夹具仍将为每个[工作进程](./test-parallel.md#工作进程)运行一次，但你不需要在每个文件中重新声明它们。
