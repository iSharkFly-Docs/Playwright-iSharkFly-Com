---
title: "身份认证"
---

# 身份认证

## 简介

Playwright 在称为[浏览器上下文](./browser-contexts.md)的隔离环境中执行测试。这种隔离模型提高了可重复性并防止测试失败的级联效应。测试可以加载现有的已认证状态。这消除了在每个测试中进行认证的需要，并加快了测试执行速度。

## 核心概念

无论您选择哪种认证策略，您可能都会在文件系统上存储已认证的浏览器状态。

我们建议创建 `playwright/.auth` 目录并将其添加到 `.gitignore`。您的认证例程将生成已认证的浏览器状态并将其保存到此 `playwright/.auth` 目录中的文件。之后，测试将重用此状态并在已认证的情况下启动。

::: danger
浏览器状态文件可能包含敏感的 cookie 和头信息，可用于冒充您或您的测试账户。
我们强烈建议不要将它们签入私有或公共仓库。
:::

::: code-group

```bash [Bash]
mkdir -p playwright/.auth
echo $'\nplaywright/.auth' >> .gitignore
```

```bat [Batch]
md playwright\.auth
echo. >> .gitignore
echo "playwright/.auth" >> .gitignore
```

```powershell [PowerShell]
New-Item -ItemType Directory -Force -Path playwright\.auth
Add-Content -path .gitignore "`r`nplaywright/.auth"
```

:::

## 基础：在所有测试中共享账户

这是**没有服务器端状态**的测试的**推荐**方法。在 **setup 项目**中认证一次，保存认证状态，然后重用它来引导每个测试，使其以已认证的状态启动。

**何时使用**
- 当您可以想象所有测试同时使用同一账户运行，而不会相互影响时。

**何时不使用**
- 您的测试会修改服务器端状态。例如，一个测试检查设置页面的渲染，而另一个测试正在更改设置，并且您并行运行测试。在这种情况下，测试必须使用不同的账户。
- 您的认证是特定于浏览器的。

**详情**

创建 `tests/auth.setup.ts`，它将为所有其他测试准备已认证的浏览器状态。

::: code-group

```js [tests/auth.setup.ts]
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // 执行认证步骤。用您自己的操作替换这些。
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  // 等待页面接收 cookie。
  //
  // 有时登录流程会在多次重定向过程中设置 cookie。
  // 等待最终 URL 以确保 cookie 确实已设置。
  await page.waitForURL('https://github.com/');
  // 或者，您可以等待页面达到所有 cookie 都已设置的状态。
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // 认证步骤结束。

  await page.context().storageState({ path: authFile });
});
```

:::

在配置中创建一个新的 `setup` 项目，并将其声明为所有测试项目的[依赖](./test-projects.md#dependencies)。此项目将始终运行并在所有测试之前进行认证。所有测试项目应使用已认证的状态作为 `storageState`。

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Setup 项目
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 使用准备好的认证状态。
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // 使用准备好的认证状态。
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

:::

测试在启动时已经是认证状态，因为我们在配置中指定了 `storageState`。

::: info
如果您的应用程序将认证令牌存储在 IndexedDB 中，例如 Firebase Authentication，请在保存状态时启用 [`indexedDB`](/api/class-browsercontext#browser-context-storage-state-option-indexed-db)：`await page.context().storageState({ path: authFile, indexedDB: true })`。默认情况下，IndexedDB 不包含在快照中。
:::

::: code-group

```js [tests/example.spec.ts]
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  // page 已认证
});
```

:::

请注意，当存储的状态过期时，您需要删除它。如果不需要在测试运行之间保留状态，请将浏览器状态写入 [`testProject.outputDir`](/api/class-testproject#test-project-output-dir)，它会在每次测试运行前自动清理。

### 在 UI 模式下认证

UI 模式默认不会运行 `setup` 项目以提高测试速度。我们建议在现有认证过期时，不时手动运行 `auth.setup.ts` 来进行认证。

首先[在过滤器中启用 `setup` 项目](./test-ui-mode#filtering-tests)，然后单击 `auth.setup.ts` 文件旁边的三角形按钮，然后再次在过滤器中禁用 `setup` 项目。

## 中级：每个并行工作进程一个账户

这是**修改服务器端状态**的测试的**推荐**方法。在 Playwright 中，工作进程并行运行。在这种方法中，每个并行工作进程只认证一次。工作进程运行的所有测试都重用相同的认证状态。我们需要多个测试账户，每个并行工作进程一个。

**何时使用**
- 您的测试修改共享的服务器端状态。例如，一个测试检查设置页面的渲染，而另一个测试正在更改设置。

**何时不使用**
- 您的测试不修改任何共享的服务器端状态。在这种情况下，所有测试都可以使用一个共享账户。

**详情**

我们将为每个[工作进程](./test-parallel.md#worker-processes)认证一次，每个使用唯一的账户。

创建 `playwright/fixtures.ts` 文件，它将[覆盖 `storageState` fixture](./test-fixtures.md#overriding-fixtures) 以便为每个工作进程认证一次。使用 [`testInfo.parallelIndex`](/api/class-testinfo#test-info-parallel-index) 来区分工作进程。

::: code-group

```js [playwright/fixtures.ts]
import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // 为此工作进程中的所有测试使用相同的存储状态。
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // 使用工作进程范围的 fixture 为每个工作进程认证一次。
  workerStorageState: [async ({ browser }, use) => {
    // 使用 parallelIndex 作为每个工作进程的唯一标识符。
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      // 如果存在，重用现有的认证状态。
      await use(fileName);
      return;
    }

    // 重要：通过取消设置存储状态，确保我们在干净的环境中认证。
    const page = await browser.newPage({ storageState: undefined });

    // 获取一个唯一账户，例如创建一个新账户。
    // 或者，您可以有一个预创建的测试账户列表。
    // 确保账户是唯一的，以便多个团队成员
    // 可以同时运行测试而不会相互干扰。
    const account = await acquireAccount(id);

    // 执行认证步骤。用您自己的操作替换这些。
    await page.goto('https://github.com/login');
    await page.getByLabel('Username or email address').fill(account.username);
    await page.getByLabel('Password').fill(account.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    // 等待页面接收 cookie。
    //
    // 有时登录流程会在多次重定向过程中设置 cookie。
    // 等待最终 URL 以确保 cookie 确实已设置。
    await page.waitForURL('https://github.com/');
    // 或者，您可以等待页面达到所有 cookie 都已设置的状态。
    await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

    // 认证步骤结束。

    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});
```

:::

现在，每个测试文件应该从我们的 fixtures 文件导入 `test`，而不是从 `@playwright/test` 导入。配置中不需要任何更改。

::: code-group

```js [tests/example.spec.ts]
// 重要：导入我们的 fixtures。
import { test, expect } from '../playwright/fixtures';

test('test', async ({ page }) => {
  // page 已认证
});
```

:::

## 高级场景

### 使用 API 请求进行认证

**何时使用**
- 您的 Web 应用程序支持通过 API 进行认证，这比与应用 UI 交互更简单/更快。

**详情**

我们将使用 [APIRequestContext](/api/class-apirequestcontext) 发送 API 请求，然后像往常一样保存认证状态。

在 [setup 项目](#基础在所有测试中共享账户)中：

::: code-group

```js [tests/auth.setup.ts]
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
  // 发送认证请求。用您自己的替换。
  await request.post('https://github.com/login', {
    form: {
      'user': 'user',
      'password': 'password'
    }
  });
  await request.storageState({ path: authFile });
});
```

:::

或者，在[工作进程 fixture](#中级每个并行工作进程一个账户) 中：

::: code-group

```js [playwright/fixtures.ts]
import { test as baseTest, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // 为此工作进程中的所有测试使用相同的存储状态。
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // 使用工作进程范围的 fixture 为每个工作进程认证一次。
  workerStorageState: [async ({}, use) => {
    // 使用 parallelIndex 作为每个工作进程的唯一标识符。
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      // 如果存在，重用现有的认证状态。
      await use(fileName);
      return;
    }

    // 重要：通过取消设置存储状态，确保我们在干净的环境中认证。
    const context = await request.newContext({ storageState: undefined });

    // 获取一个唯一账户，例如创建一个新账户。
    // 或者，您可以有一个预创建的测试账户列表。
    // 确保账户是唯一的，以便多个团队成员
    // 可以同时运行测试而不会相互干扰。
    const account = await acquireAccount(id);

    // 发送认证请求。用您自己的替换。
    await context.post('https://github.com/login', {
      form: {
        'user': 'user',
        'password': 'password'
      }
    });

    await context.storageState({ path: fileName });
    await context.dispose();
    await use(fileName);
  }, { scope: 'worker' }],
});
```

:::

### 多个登录角色

**何时使用**
- 您的端到端测试中有多个角色，但可以在所有测试中重用账户。

**详情**

我们将在 setup 项目中多次认证。

::: code-group

```js [tests/auth.setup.ts]
import { test as setup, expect } from '@playwright/test';

const adminFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  // 执行认证步骤。用您自己的操作替换这些。
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('admin');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  // 等待页面接收 cookie。
  //
  // 有时登录流程会在多次重定向过程中设置 cookie。
  // 等待最终 URL 以确保 cookie 确实已设置。
  await page.waitForURL('https://github.com/');
  // 或者，您可以等待页面达到所有 cookie 都已设置的状态。
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // 认证步骤结束。

  await page.context().storageState({ path: adminFile });
});

const userFile = 'playwright/.auth/user.json';

setup('authenticate as user', async ({ page }) => {
  // 执行认证步骤。用您自己的操作替换这些。
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  // 等待页面接收 cookie。
  //
  // 有时登录流程会在多次重定向过程中设置 cookie。
  // 等待最终 URL 以确保 cookie 确实已设置。
  await page.waitForURL('https://github.com/');
  // 或者，您可以等待页面达到所有 cookie 都已设置的状态。
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // 认证步骤结束。

  await page.context().storageState({ path: userFile });
});
```

:::

之后，为每个测试文件或测试组指定 `storageState`，**而不是**在配置中设置。

::: code-group

```js [tests/example.spec.ts]
import { test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('admin test', async ({ page }) => {
  // page 以管理员身份认证
});

test.describe(() => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('user test', async ({ page }) => {
    // page 以用户身份认证
  });
});
```

:::

另请参阅[在 UI 模式下认证](#在-ui-模式下认证)。

### 同时测试多个角色

**何时使用**
- 您需要在单个测试中测试多个已认证角色如何交互。

**详情**

在同一测试中使用具有不同存储状态的多个 [BrowserContext](/api/class-browsercontext) 和 [Page](/api/class-page)。

::: code-group

```js [tests/example.spec.ts]
import { test } from '@playwright/test';

test('admin and user', async ({ browser }) => {
  // adminContext 及其中的所有页面，包括 adminPage，都以 "admin" 身份登录。
  const adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
  const adminPage = await adminContext.newPage();

  // userContext 及其中的所有页面，包括 userPage，都以 "user" 身份登录。
  const userContext = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
  const userPage = await userContext.newPage();

  // ... 与 adminPage 和 userPage 交互 ...

  await adminContext.close();
  await userContext.close();
});
```

:::

### 使用 POM fixtures 测试多个角色

**何时使用**
- 您需要在单个测试中测试多个已认证角色如何交互。

**详情**

您可以引入 fixtures 来提供以每个角色认证的页面。

下面是一个[创建 fixtures](./test-fixtures.md#creating-a-fixture) 的示例，为两个[页面对象模型](./pom.md)——admin POM 和 user POM。它假设 `adminStorageState.json` 和 `userStorageState.json` 文件在全局设置中创建。

::: code-group

```js [playwright/fixtures.ts]
import { test as base, type Page, type Locator } from '@playwright/test';

// "admin" 页面的页面对象模型。
// 在这里您可以添加特定于 admin 页面的定位器和辅助方法。
class AdminPage {
  // 以 "admin" 身份登录的页面。
  page: Page;

  // 指向 "Welcome, Admin" 问候语的示例定位器。
  greeting: Locator;

  constructor(page: Page) {
    this.page = page;
    this.greeting = page.locator('#greeting');
  }
}

// "user" 页面的页面对象模型。
// 在这里您可以添加特定于 user 页面的定位器和辅助方法。
class UserPage {
  // 以 "user" 身份登录的页面。
  page: Page;

  // 指向 "Welcome, User" 问候语的示例定位器。
  greeting: Locator;

  constructor(page: Page) {
    this.page = page;
    this.greeting = page.locator('#greeting');
  }
}

// 声明 fixtures 的类型。
type MyFixtures = {
  adminPage: AdminPage;
  userPage: UserPage;
};

export * from '@playwright/test';
export const test = base.extend<MyFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
    const adminPage = new AdminPage(await context.newPage());
    await use(adminPage);
    await context.close();
  },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const userPage = new UserPage(await context.newPage());
    await use(userPage);
    await context.close();
  },
});

```

:::

::: code-group

```js [tests/example.spec.ts]
// 导入带有新 fixtures 的 test。
import { test, expect } from '../playwright/fixtures';

// 在测试中使用 adminPage 和 userPage fixtures。
test('admin and user', async ({ adminPage, userPage }) => {
  // ... 与 adminPage 和 userPage 交互 ...
  await expect(adminPage.greeting).toHaveText('Welcome, Admin');
  await expect(userPage.greeting).toHaveText('Welcome, User');
});
```

:::

### 会话存储

重用已认证状态涵盖 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Storage)、[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 和基于 passkey（[WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)）的认证。很少情况下，[会话存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)用于存储与登录状态相关的信息。会话存储特定于特定域，不会跨页面加载持久化。Playwright 不提供持久化会话存储的 API，但可以使用以下代码片段来保存/加载会话存储。

```js
// 获取会话存储并存储为环境变量
const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
fs.writeFileSync('playwright/.auth/session.json', sessionStorage, 'utf-8');

// 在新上下文中设置会话存储
const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
await context.addInitScript(storage => {
  if (window.location.hostname === 'example.com') {
    for (const [key, value] of Object.entries(storage))
      window.sessionStorage.setItem(key, value);
  }
}, sessionStorage);
```

### 在某些测试中避免认证

您可以在测试文件中重置存储状态以避免为整个项目设置的认证。

::: code-group

```js [not-signed-in.spec.ts]
import { test } from '@playwright/test';

// 为此文件重置存储状态以避免已认证
test.use({ storageState: { cookies: [], origins: [] } });

test('not signed in test', async ({ page }) => {
  // ...
});
```

:::
