---
title: "最佳实践"
---

# 最佳实践

## 简介

本指南应帮助您确保遵循我们的最佳实践并编写更具弹性的测试。

## 测试理念

### 测试用户可见的行为

自动化测试应验证应用程序代码对最终用户有效，并避免依赖实现细节，例如用户通常不会使用、看到甚至不知道的东西，如函数名称、某物是否是数组或某个元素的 CSS 类。最终用户将看到或与页面上呈现的内容交互，因此您的测试通常应该只看到/与相同的呈现输出交互。

### 使测试尽可能隔离

每个测试应该与其他测试完全隔离，并独立运行，拥有自己的本地存储、会话存储、数据、cookies 等。[测试隔离](./browser-contexts.md)提高了可重现性，使调试更容易，并防止级联测试失败。

为了避免测试特定部分的重复，您可以使用[前置和后置钩子](/api/class-test.md)。在测试文件中添加前置钩子以在每个测试之前运行测试的一部分，例如转到特定 URL 或登录到应用程序的某个部分。这使您的测试保持隔离，因为没有测试依赖于另一个测试。但是，当测试足够简单时，有一点重复也是可以的，特别是如果它使您的测试更清晰、更易于阅读和维护。

```js
import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // 在每个测试之前运行并登录每个页面。
  await page.goto('https://github.com/login');
  await page.getByLabel('用户名或电子邮件地址').fill('username');
  await page.getByLabel('密码').fill('password');
  await page.getByRole('button', { name: '登录' }).click();
});

test('第一个测试', async ({ page }) => {
  // 页面已登录。
});

test('第二个测试', async ({ page }) => {
  // 页面已登录。
});
```

您还可以使用[设置项目](./auth.md#basic-shared-account-in-all-tests)在测试中重用已登录状态。这样您只需登录一次，然后跳过所有测试的登录步骤。

### 避免测试第三方依赖

只测试您能控制的东西。不要尝试测试您无法控制的外部站点或第三方服务器的链接。这不仅耗时且可能会减慢您的测试速度，而且您无法控制您链接到的页面内容，或者是否存在 cookie 横幅或覆盖页面或任何其他可能导致测试失败的内容。

相反，使用 [Playwright 网络 API](/network.md#handle-requests) 并保证所需的响应。

```js
await page.route('**/api/fetch_data_third_party_dependency', route => route.fulfill({
  status: 200,
  body: testData,
}));
await page.goto('https://example.com');
```

### 使用数据库测试

如果使用数据库，请确保您控制数据。针对暂存环境进行测试，并确保它不会更改。对于视觉回归测试，请确保操作系统和浏览器版本相同。

## 最佳实践

### 使用定位器

为了编写端到端测试，我们需要首先在网页上找到元素。我们可以使用 Playwright 内置的[定位器](./locators.md)来做到这一点。定位器具有自动等待和重试能力。自动等待意味着 Playwright 会对元素执行一系列可操作性检查，例如确保元素在执行点击之前可见且已启用。为了使测试具有弹性，我们建议优先使用面向用户的属性和显式契约。

```js
// 👍
page.getByRole('button', { name: 'submit' });
```

#### 使用链式和过滤

定位器可以[链式调用](./locators.md#matching-inside-a-locator)以将搜索范围缩小到页面的特定部分。

```js
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });
```

您还可以通过文本或其他定位器[过滤定位器](./locators.md#filtering-locators)。

```js
await page
    .getByRole('listitem')
    .filter({ hasText: 'Product 2' })
    .getByRole('button', { name: '添加到购物车' })
    .click();
```

#### 优先使用面向用户的属性而非 XPath 或 CSS 选择器

您的 DOM 可能很容易更改，因此让测试依赖于 DOM 结构可能导致测试失败。例如，考虑通过 CSS 类选择此按钮。如果设计师更改了某些内容，则类可能会更改，从而破坏您的测试。

```js
// 👎
page.locator('button.buttonIcon.episode-actions-later');
```

使用对 DOM 变化具有弹性的定位器。

```js
// 👍
page.getByRole('button', { name: 'submit' });
```

### 生成定位器

Playwright 有一个[测试生成器](./codegen.md)，可以为您生成测试并选取定位器。它会查看您的页面并找出最佳定位器，优先使用角色、文本和测试 ID 定位器。如果生成器发现多个元素匹配定位器，它会改进定位器使其具有弹性并唯一标识目标元素，因此您不必担心由于定位器而导致测试失败。

#### 使用 `codegen` 生成定位器

要选取定位器，请运行 `codegen` 命令，后面跟上您想要从中选取定位器的 URL。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright codegen playwright.dev
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright codegen playwright.dev
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright codegen playwright.dev
```

</TabItem>

</Tabs>

这将打开一个新的浏览器窗口以及 Playwright inspector。要选取定位器，首先点击"Record"按钮停止录制。默认情况下，当您运行 `codegen` 命令时，它会开始新的录制。停止录制后，"Pick Locator"按钮将可点击。

然后，您可以将鼠标悬停在浏览器窗口中的任何元素上，查看光标下方高亮显示的定位器。点击元素会将定位器添加到 Playwright inspector 中。您可以将定位器复制并粘贴到测试文件中，或通过在 Playwright Inspector 中编辑它继续探索定位器，例如修改文本，并在浏览器窗口中查看结果。

<img height="1274" width="2788" alt="使用 codegen 生成定位器" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212103268-e7d8ee8b-d307-4cba-be13-831f3fbb1f40.png" />

#### 使用 VS Code 扩展生成定位器

您还可以使用 [VS Code 扩展](./getting-started-vscode.md)来生成定位器以及录制测试。VS Code 扩展还在编写、运行和调试测试时提供出色的开发者体验。

<img height="1684" width="2788" alt="在 VS Code 中使用 codegen 生成定位器" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212269873-aca04043-16ce-4627-906f-7351d09740ab.png" />

### 使用 Web 优先断言

断言是验证预期结果和实际结果是否匹配的方法。通过使用 [Web 优先断言](./test-assertions.md)，Playwright 将等待直到满足预期条件。例如，在测试警报消息时，测试会点击一个使消息出现的按钮并检查警报消息是否存在。如果警报消息需要半秒钟才能出现，`toBeVisible()` 等断言将等待并在需要时重试。

```js
// 👍
await expect(page.getByText('欢迎')).toBeVisible();

// 👎
expect(await page.getByText('欢迎').isVisible()).toBe(true);
```

#### 不要使用手动断言

不要使用未等待 expect 的手动断言。在下面的代码中，await 在 expect 内部而不是在它之前。当使用 `isVisible()` 等断言时，测试不会等待一秒钟，它只会检查定位器是否存在并立即返回。

```js
// 👎
expect(await page.getByText('欢迎').isVisible()).toBe(true);
```

改用 `toBeVisible()` 等 Web 优先断言。

```js
// 👍
await expect(page.getByText('欢迎')).toBeVisible();
```

### 配置调试

#### 本地调试

对于本地调试，我们建议您通过安装 [VS Code 扩展](./getting-started-vscode.md)来[在 VS Code 中实时调试测试](./getting-started-vscode.md#debugging-your-tests)。您可以通过右键点击要运行的测试旁边的行以调试模式运行测试，这将打开浏览器窗口并在设置断点的位置暂停。

<img height="1240" width="2676" alt="在 VS Code 中调试测试" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212274675-5c6e1647-2aab-40fd-9804-8680c1ac2d16.png" />

您可以通过在 VS Code 中点击或编辑测试中的定位器来实时调试测试，这将在浏览器窗口中高亮显示此定位器，并向您显示页面上找到的任何其他匹配定位器。

<img height="1404" width="2788" alt="在 VS Code 中实时调试定位器" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212273189-da271dc4-0f59-4138-92a8-10e719066cbe.png" />

您还可以使用 `--debug` 标志运行测试以使用 Playwright inspector 调试测试。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright test --debug
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright test --debug
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright test --debug
```

</TabItem>

</Tabs>

然后，您可以逐步执行测试、查看可操作性日志并实时编辑定位器并在浏览器窗口中查看其高亮显示。这将向您显示哪些定位器匹配以及它们有多少个。

<img height="1736" width="2700" alt="使用 Playwright inspector 调试" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212276296-4f5b18e7-2bd7-4766-9aa5-783517bd4aa2.png" />

要调试特定测试，请添加测试文件名和测试行号，后跟 `--debug` 标志。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright test example.spec.ts:9 --debug
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright test example.spec.ts:9 --debug
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright test example.spec.ts:9 --debug
```

</TabItem>

</Tabs>

#### 在 CI 上调试

对于 CI 失败，使用 Playwright [跟踪查看器](./trace-viewer.md)而不是视频和截图。跟踪查看器为您提供测试的完整跟踪，作为本地渐进式 Web 应用 (PWA)，可以轻松共享。使用跟踪查看器，您可以查看时间线、检查每个操作的 DOM 快照、查看网络请求等。

<img height="1920" width="3032" alt="Playwright 的跟踪查看器" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212277895-c63d94c2-bd06-4881-864e-62790a072ca3.png" />

跟踪在 Playwright 配置文件中配置，并设置为在 CI 上对失败测试的首次重试时运行。我们不建议将其设置为 `on`，以便在每个测试上运行跟踪，因为这非常耗费性能。但是，您可以在开发时使用 `--trace` 标志在本地运行跟踪。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright test --trace on
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright test --trace on
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright test --trace on
```

</TabItem>

</Tabs>

运行此命令后，您的跟踪将为每个测试记录，并可直接从 HTML 报告中查看。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright show-report
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright show-report
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright show-report
```

</TabItem>

</Tabs>

<img height="1920" width="3032" alt="Playwright 的 HTML 报告" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212279022-d929d4c0-2271-486a-a75f-166ac231d25f.png" />

可以通过点击测试文件名旁边的图标或打开每个测试报告并滚动到跟踪部分来打开跟踪。

<img height="2242" width="3032" alt="截图 2023-01-13 09:58:34" loading="lazy" src="https://user-images.githubusercontent.com/13063165/212279699-c9eb134f-4f4e-4f19-805c-37596d3272a6.png" />

### 使用 Playwright 的工具

Playwright 配备了一系列工具来帮助您编写测试。
- [VS Code 扩展](./getting-started-vscode.md)在编写、运行和调试测试时提供出色的开发者体验。
- [测试生成器](./codegen.md)可以为您生成测试并选取定位器。
- [跟踪查看器](./trace-viewer.md)为您提供测试的完整跟踪，作为本地 PWA，可以轻松共享。使用跟踪查看器，您可以查看时间线、检查每个操作的 DOM 快照、查看网络请求等。
- [UI 模式](./test-ui-mode)让您可以探索、运行和调试测试，具有时间旅行体验和观察模式。所有测试文件都加载到测试侧边栏中，您可以展开每个文件和描述块以单独运行、查看、观察和调试每个测试。
- Playwright 中的 [TypeScript](./test-typescript) 开箱即用，为您提供更好的 IDE 集成。您的 IDE 将显示您可以做的所有事情，并在您做错时高亮显示。不需要 TypeScript 经验，也不必将代码写成 TypeScript，您只需要使用 `.ts` 扩展名创建测试。

### 跨所有浏览器测试

Playwright 可以轻松地在所有[浏览器](./test-projects.md#configure-projects-for-multiple-browsers)上测试您的站点，无论您在什么平台上。跨所有浏览器测试可确保您的应用程序适用于所有用户。在您的配置文件中，您可以设置项目，添加名称以及要使用的浏览器或设备。

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

:::

### 保持 Playwright 依赖项最新

通过保持 Playwright 版本最新，您将能够在最新的浏览器版本上测试您的应用程序，并在最新的浏览器版本向公众发布之前捕获故障。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npm install -D @playwright/test@latest
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add --dev @playwright/test@latest
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm install --save-dev @playwright/test@latest
```

</TabItem>

</Tabs>

查看[发布说明](./release-notes.md)了解最新版本是什么以及发布了哪些更改。

您可以通过运行以下命令查看您拥有的 Playwright 版本。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright --version
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright --version
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright --version
```

</TabItem>

</Tabs>

### 在 CI 上运行测试

设置 CI/CD 并频繁运行测试。运行测试的次数越多越好。理想情况下，您应该在每次提交和拉取请求时运行测试。Playwright 配备了 [GitHub actions 工作流](/ci-intro.md)，因此测试将在 CI 上为您运行，无需设置。Playwright 也可以在您选择的 [CI 环境](/ci.md)上设置。

在 CI 上运行测试时使用 Linux，因为它更便宜。开发人员可以在本地运行时使用任何环境，但在 CI 上使用 Linux。考虑设置[分片](./test-sharding.md)以加快 CI 速度。

#### 优化 CI 上的浏览器下载

只安装您实际需要的浏览器，特别是在 CI 上。例如，如果您只使用 Chromium 进行测试，只安装 Chromium。

::: code-group

```bash [.github/workflows/playwright.yml]
# 而不是安装所有浏览器
npx playwright install --with-deps

# 只安装 Chromium
npx playwright install chromium --with-deps
```

:::

这可以节省 CI 机器上的下载时间和磁盘空间。

### 对测试进行 Lint

我们建议为测试使用 TypeScript 和 ESLint 进行 lint 以尽早捕获错误。使用 [`@typescript-eslint/no-floating-promises`](https://typescript-eslint.io/rules/no-floating-promises/) [ESLint](https://eslint.org) 规则确保在调用 Playwright API 的异步调用之前没有遗漏 await。在您的 CI 上，您可以运行 `tsc --noEmit` 以确保使用正确的签名调用函数。

### 使用并行和分片

Playwright 默认[并行](./test-parallel.md)运行测试。单个文件中的测试按顺序在同一工作进程中运行。如果您在单个文件中有许多独立的测试，您可能希望并行运行它们

```js
import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('并行运行 1', async ({ page }) => { /* ... */ });
test('并行运行 2', async ({ page }) => { /* ... */ });
```

Playwright 可以[分片](./test-parallel.md#shard-tests-between-multiple-machines)测试套件，以便可以在多台机器上执行。

<Tabs group-id="js-package-manager" default-value="npm" :tabs='[{"label":"npm","value":"npm"},{"label":"yarn","value":"yarn"},{"label":"pnpm","value":"pnpm"}]'>

<TabItem value="npm">

```bash
npx playwright test --shard=1/3
```

</TabItem>

<TabItem value="yarn">

```bash
yarn playwright test --shard=1/3
```

</TabItem>

<TabItem value="pnpm">

```bash
pnpm exec playwright test --shard=1/3
```

</TabItem>

</Tabs>

## 生产力提示

### 使用软断言

如果您的测试失败，Playwright 将给您一条错误消息，显示测试的哪个部分失败，您可以在 VS Code、终端、HTML 报告或跟踪查看器中看到。但是，您也可以使用[软断言](/test-assertions.md#soft-assertions)。这些不会立即终止测试执行，而是在测试结束后编译并显示失败断言的列表。

```js
// 进行一些不会在失败时停止测试的检查...
await expect.soft(page.getByTestId('status')).toHaveText('成功');

// ... 并继续测试以检查更多内容。
await page.getByRole('link', { name: '下一页' }).click();
```
