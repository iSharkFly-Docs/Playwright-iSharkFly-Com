---
title: "API 测试"
---

# API 测试

## 简介

Playwright 可用于访问应用程序的 [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API。

有时您可能想直接从 Node.js 向服务器发送请求，而不需要加载页面并在其中运行 js 代码。以下是一些可能用到的场景：
- 测试您的服务器 API。
- 在测试中访问 Web 应用程序之前准备服务器端状态。
- 在浏览器中执行某些操作后验证服务器端后置条件。

所有这些都可以通过 [APIRequestContext](/api/class-apirequestcontext) 方法实现。

## 编写 API 测试

[APIRequestContext](/api/class-apirequestcontext) 可以通过网络发送各种 HTTP(S) 请求。

以下示例演示如何使用 Playwright 通过 [GitHub API](https://docs.github.com/en/rest) 测试 issue 创建。测试套件将执行以下操作：
- 在运行测试之前创建一个新仓库。
- 创建几个 issue 并验证服务器状态。
- 在运行测试之后删除仓库。

### 配置

GitHub API 需要授权，因此我们将为所有测试配置一次令牌。同时，我们还将设置 `baseURL` 以简化测试。您可以将它们放在配置文件中，或者使用 `test.use()` 放在测试文件中。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    // 我们发送的所有请求都发往此 API 端点。
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      // 我们根据 GitHub 指南设置此头。
      'Accept': 'application/vnd.github.v3+json',
      // 为所有请求添加授权令牌。
      // 假设个人访问令牌在环境中可用。
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  }
});
```

:::

**代理配置**

如果您的测试需要在代理后面运行，您可以在配置中指定，`request` fixture 会自动使用它：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    proxy: {
      server: 'http://my-proxy:8080',
      username: 'user',
      password: 'secret'
    },
  }
});
```

:::

### 编写测试

Playwright Test 带有内置的 `request` fixture，它遵循我们指定的配置选项，如 `baseURL` 或 `extraHTTPHeaders`，并准备好发送请求。

现在我们可以添加一些将在仓库中创建新 issue 的测试。

```js
const REPO = 'test-repo-1';
const USER = 'github-username';

test('should create a bug report', async ({ request }) => {
  const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
    data: {
      title: '[Bug] report 1',
      body: 'Bug description',
    }
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Bug] report 1',
    body: 'Bug description'
  }));
});

test('should create a feature request', async ({ request }) => {
  const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
    data: {
      title: '[Feature] request 1',
      body: 'Feature description',
    }
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Feature] request 1',
    body: 'Feature description'
  }));
});
```

### 设置和清理

这些测试假设仓库存在。您可能想在运行测试之前创建一个新仓库，并在之后删除它。使用 `beforeAll` 和 `afterAll` 钩子来实现。

```js
test.beforeAll(async ({ request }) => {
  // 创建一个新仓库
  const response = await request.post('/user/repos', {
    data: {
      name: REPO
    }
  });
  expect(response.ok()).toBeTruthy();
});

test.afterAll(async ({ request }) => {
  // 删除仓库
  const response = await request.delete(`/repos/${USER}/${REPO}`);
  expect(response.ok()).toBeTruthy();
});
```

## 使用请求上下文

在幕后，[`request` fixture](./api/class-fixtures#fixtures-request) 实际上会调用 [`apiRequest.newContext()`](/api/class-apirequest#api-request-new-context)。如果您想要更多控制，可以随时手动执行此操作。下面是一个独立脚本，执行与上面的 `beforeAll` 和 `afterAll` 相同的操作。

```js
import { request } from '@playwright/test';
const REPO = 'test-repo-1';
const USER = 'github-username';

(async () => {
  // 创建一个将发出 http 请求的上下文。
  const context = await request.newContext({
    baseURL: 'https://api.github.com',
  });

  // 创建一个仓库。
  await context.post('/user/repos', {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // 添加 GitHub 个人访问令牌。
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
    data: {
      name: REPO
    }
  });

  // 删除一个仓库。
  await context.delete(`/repos/${USER}/${REPO}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // 添加 GitHub 个人访问令牌。
      'Authorization': `token ${process.env.API_TOKEN}`,
    }
  });
})();
```

## 从 UI 测试发送 API 请求

在浏览器中运行测试时，您可能想调用应用程序的 HTTP API。如果您需要在运行测试之前准备服务器状态，或者在浏览器中执行某些操作后检查服务器上的某些后置条件，这可能会很有帮助。所有这些都可以通过 [APIRequestContext](/api/class-apirequestcontext) 方法实现。

### 建立前置条件

以下测试通过 API 创建一个新 issue，然后导航到项目中所有 issue 的列表，检查它是否出现在列表顶部。

```js
import { test, expect } from '@playwright/test';

const REPO = 'test-repo-1';
const USER = 'github-username';

// 请求上下文被文件中的所有测试重用。
let apiContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    // 我们发送的所有请求都发往此 API 端点。
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      // 我们根据 GitHub 指南设置此头。
      'Accept': 'application/vnd.github.v3+json',
      // 为所有请求添加授权令牌。
      // 假设个人访问令牌在环境中可用。
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  });
});

test.afterAll(async ({ }) => {
  // 处理所有响应。
  await apiContext.dispose();
});

test('last created issue should be first in the list', async ({ page }) => {
  const newIssue = await apiContext.post(`/repos/${USER}/${REPO}/issues`, {
    data: {
      title: '[Feature] request 1',
    }
  });
  expect(newIssue.ok()).toBeTruthy();

  await page.goto(`https://github.com/${USER}/${REPO}/issues`);
  const firstIssue = page.locator(`a[data-hovercard-type='issue']`).first();
  await expect(firstIssue).toHaveText('[Feature] request 1');
});
```

### 验证后置条件

以下测试通过浏览器中的用户界面创建一个新 issue，然后使用 API 检查它是否已创建：

```js
import { test, expect } from '@playwright/test';

const REPO = 'test-repo-1';
const USER = 'github-username';

// 请求上下文被文件中的所有测试重用。
let apiContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    // 我们发送的所有请求都发往此 API 端点。
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      // 我们根据 GitHub 指南设置此头。
      'Accept': 'application/vnd.github.v3+json',
      // 为所有请求添加授权令牌。
      // 假设个人访问令牌在环境中可用。
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  });
});

test.afterAll(async ({ }) => {
  // 处理所有响应。
  await apiContext.dispose();
});

test('last created issue should be on the server', async ({ page }) => {
  await page.goto(`https://github.com/${USER}/${REPO}/issues`);
  await page.getByText('New Issue').click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Bug report 1');
  await page.getByRole('textbox', { name: 'Comment body' }).fill('Bug description');
  await page.getByText('Submit new issue').click();
  const issueId = new URL(page.url()).pathname.split('/').pop();

  const newIssue = await apiContext.get(
      `https://api.github.com/repos/${USER}/${REPO}/issues/${issueId}`
  );
  expect(newIssue.ok()).toBeTruthy();
  expect(await newIssue.json()).toEqual(expect.objectContaining({
    title: 'Bug report 1'
  }));
});
```

## 重用认证状态

Web 应用程序使用基于 cookie 或基于令牌的认证，其中已认证状态存储为 [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)。
Playwright 提供 [`apiRequestContext.storageState()`](/api/class-apirequestcontext#api-request-context-storage-state) 方法，可用于从已认证的上下文中检索存储状态，然后使用该状态创建新的上下文。

存储状态在 [BrowserContext](/api/class-browsercontext) 和 [APIRequestContext](/api/class-apirequestcontext) 之间是可互换的。您可以使用它通过 API 调用登录，然后创建一个已经包含 cookie 的新上下文。
以下代码片段从已认证的 [APIRequestContext](/api/class-apirequestcontext) 检索状态，并使用该状态创建一个新的 [BrowserContext](/api/class-browsercontext)。

```js
const requestContext = await request.newContext({
  httpCredentials: {
    username: 'user',
    password: 'passwd'
  }
});
await requestContext.get(`https://api.example.com/login`);
// 将存储状态保存到文件中。
await requestContext.storageState({ path: 'state.json' });

// 使用保存的存储状态创建新上下文。
const context = await browser.newContext({ storageState: 'state.json' });
```

## 上下文请求与全局请求

有两种类型的 [APIRequestContext](/api/class-apirequestcontext)：
* 与 [BrowserContext](/api/class-browsercontext) 关联的
* 通过 [`apiRequest.newContext()`](/api/class-apirequest#api-request-new-context) 创建的独立实例

主要区别在于，通过 [`browserContext.request`](/api/class-browsercontext#browser-context-request) 和 [`page.request`](/api/class-page#page-request) 访问的 [APIRequestContext](/api/class-apirequestcontext) 将从浏览器上下文填充请求的 `Cookie` 头，并且如果 [APIResponse](/api/class-apiresponse) 有 `Set-Cookie` 头，它将自动更新浏览器 cookie：

```js
test('context request will share cookie storage with its browser context', async ({
  page,
  context,
}) => {
  await context.route('https://www.github.com/', async route => {
    // 发送一个与浏览器上下文共享 cookie 存储的 API 请求。
    const response = await context.request.fetch(route.request());
    const responseHeaders = response.headers();

    // 响应将有 'Set-Cookie' 头。
    const responseCookies = new Map(responseHeaders['set-cookie']
        .split('\n')
        .map(c => c.split(';', 2)[0].split('=')));
    // 响应将在 'Set-Cookie' 头中有 3 个 cookie。
    expect(responseCookies.size).toBe(3);
    const contextCookies = await context.cookies();
    // 浏览器上下文已经包含来自 API 响应的所有 cookie。
    expect(new Map(contextCookies.map(({ name, value }) =>
      [name, value])
    )).toEqual(responseCookies);

    await route.fulfill({
      response,
      headers: { ...responseHeaders, foo: 'bar' },
    });
  });
  await page.goto('https://www.github.com/');
});
```

如果您不想让 [APIRequestContext](/api/class-apirequestcontext) 使用和更新浏览器上下文中的 cookie，您可以手动创建一个新的 [APIRequestContext](/api/class-apirequestcontext) 实例，它将拥有自己独立的 cookie：

```js
test('global context request has isolated cookie storage', async ({
  page,
  context,
  browser,
  playwright
}) => {
  // 创建一个具有独立 cookie 存储的 APIRequestContext 新实例。
  const request = await playwright.request.newContext();
  await context.route('https://www.github.com/', async route => {
    const response = await request.fetch(route.request());
    const responseHeaders = response.headers();

    const responseCookies = new Map(responseHeaders['set-cookie']
        .split('\n')
        .map(c => c.split(';', 2)[0].split('=')));
    // 响应将在 'Set-Cookie' 头中有 3 个 cookie。
    expect(responseCookies.size).toBe(3);
    const contextCookies = await context.cookies();
    // 浏览器上下文不会有来自独立 API 请求的任何 cookie。
    expect(contextCookies.length).toBe(0);

    // 手动导出 cookie 存储。
    const storageState = await request.storageState();
    // 创建一个新上下文并使用来自全局请求的 cookie 初始化它。
    const browserContext2 = await browser.newContext({ storageState });
    const contextCookies2 = await browserContext2.cookies();
    // 新的浏览器上下文已经包含来自 API 响应的所有 cookie。
    expect(
        new Map(contextCookies2.map(({ name, value }) => [name, value]))
    ).toEqual(responseCookies);

    await route.fulfill({
      response,
      headers: { ...responseHeaders, foo: 'bar' },
    });
  });
  await page.goto('https://www.github.com/');
  await request.dispose();
});
```
