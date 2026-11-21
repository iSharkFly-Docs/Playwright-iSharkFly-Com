---
title: "版本发布说明"
---

# 版本发布说明

import LiteYouTube from '@site/src/components/LiteYouTube';

## 版本 1.65

### 🥟 使用 Bun 运行测试

测试运行器现在可以在 [Bun](https://bun.com) 下运行。Bun 会自行转译您的 TypeScript 测试文件，因此 Playwright 不使用 Babel 或其编译缓存。传递 `--bun` 标志，因为不传递它 `bunx playwright test` 会在 Node.js 上运行：

```bash
bunx --bun playwright test
```

我们的 CI 在 Linux 上使用 Bun 1.4.3 运行测试运行器测试。在 Bun 下某些功能的工作方式不同：
- 没有监视模式。UI 模式在文件更改时不会重新运行测试，`--only-changed` 不跟踪导入。
- Bun 自己加载模块，因此 `--tsconfig` 和 `tsconfig.json` 中的 JSX 选项无效，不支持自定义 ESM 加载器。
- 堆栈跟踪不包含异步帧，API 名称不包含类名：是 `click` 而不是 `locator.click`。这会改变某些步骤位置、步骤标题和错误消息。
- 测试的控制台输出不会进入追踪和 UI 模式。

### 🚨 仅包含失败的报告

新的 [`failures`](./test-reporters.md#failures-reporter) 报告器会在发生时打印失败和成功的重试，然后是摘要，不输出进度。

HTML、JSON 和 JUnit 报告器的新 `onlyFailures` 选项[仅保留](./test-reporters.md#report-only-failures)具有意外结果的测试、不稳定的测试和被中断的测试：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['failures'],
    ['html', { onlyFailures: true }],
  ],
});
```

:::

### 🎯 测试运行器
- 新的内置 `-exclusive-` [测试锁](./test-parallel.md#test-locks) 仅在没有其他测试运行时运行测试。所有其他测试继续彼此并行运行：
  
  ```js
  test('重启服务器', { lock: '-exclusive-' }, async () => {
    // 当此测试运行时，没有其他测试运行。
  });
  ```
- [`test.skip()`](/api/class-test#test-skip)、[`test.fixme()`](/api/class-test#test-fixme)、[`test.fail()`](/api/class-test#test-fail) 和 [`test.slow()`](/api/class-test#test-slow) 现在只接受描述。它记录在测试注解中：
  
  ```js
  test('上传文件', async ({ page }) => {
    test.skip('尚未实现');
  });
  ```
- 新的 `PLAYWRIGHT_TRANSFORM_CACHE_DIR` 环境变量设置转译测试文件的目录，例如在与其他用户共享的 Linux 机器上。

### 新 API
- [`cdpSession.send()`](/api/class-cdpsession#cdp-session-send) 中的新选项 [`timeout`](/api/class-cdpsession#cdp-session-send-option-timeout) 和 [`signal`](/api/class-cdpsession#cdp-session-send-option-signal)。
- 新的 [`testRun.mode()`](/api/class-testrun#test-run-mode) 在 [`reporter.preprocess()`](/api/class-reporter#reporter-preprocess) 期间返回套件的执行模式。

### 破坏性变更 ⚠️
- TypeScript 类字段现在遵循您 `tsconfig.json` 中的 [`useDefineForClassFields`](./test-typescript.md#tsconfig-class-fields)，与 `tsc` 相同。对于 `ES2022` 及更高版本的目标，以及未指定 `target` 时启用。读取构造函数参数属性的字段初始化器现在会失败，因为初始化器先运行：
  
  ```js
  class LoginPage {
    // TypeError: Cannot read properties of undefined (reading 'getByRole')
    readonly submit = this.page.getByRole('button', { name: 'Submit' });
  
    constructor(private readonly page: Page) {}
  }
  ```
  
  将初始化移到构造函数中，或在您的 `tsconfig.json` 中设置 `"useDefineForClassFields": false`。
- [`locator.click()`](/api/class-locator#locator-click)、[`locator.check()`](/api/class-locator#locator-check)、[`locator.tap()`](/api/class-locator#locator-tap)、[`locator.fill()`](/api/class-locator#locator-fill)、[`locator.clear()`](/api/class-locator#locator-clear) 和 [`locator.selectOption()`](/api/class-locator#locator-select-option) 等操作现在等待元素 [不惰性](./actionability.md#not-inert)。对具有 `inert` 属性的元素或此类元素内部的元素执行操作，如果元素保持惰性则会超时。
- 分片运行现在在所有分片中没有测试匹配时会因"未找到测试"而失败。传递 `--pass-with-no-tests` 以允许这种情况。当其他分片有测试时，空分片仍然通过。
- Cookie 匹配现在遵循 RFC 6265。

### 公告
* ⚠️ Playwright 不再在 Node.js 20 上测试。请使用 Node.js 22、24 或 26，如[系统要求](./intro.md#system-requirements)中所列。
* 🐳 [Docker 镜像](./docker.md) 现在包含 Node.js 26 而不是 Node.js 24，以及同一分支上 Chromium 的最新补丁。

### 浏览器版本
- Chromium 158.0.8127.18
- Mozilla Firefox 159.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 157
- Microsoft Edge 156

## 版本 1.64

### 🧰 WebMCP

新的 [`page.webmcp`](/api/class-page#page-webmcp) 和 [`frame.webmcp`](/api/class-frame#frame-webmcp) 提供对页面通过实验性 [WebMCP](https://webmachinelearning.github.io/webmcp/) 浏览器 API 注册的工具的访问，因此您可以像测试应用程序的任何其他部分一样测试它们：

```js
const browser = await chromium.launch({ args: ['--enable-features=WebMCP'] });
const page = await browser.newPage();
await page.goto('https://example.com');

for (const tool of await page.webmcp.tools())
  console.log(tool.name, tool.description);

const result = await page.webmcp.callTool('add', { a: 2, b: 40 });
console.log(result.content[0].text); // "42"
```

[Playwright MCP](https://playwright.dev/mcp/introduction) 默认也支持 WebMCP，页面定义的工具作为 `webmcp_<tool>` 提供给代理。传递 `--no-webmcp` 以选择退出。

[`playwright-cli`](https://playwright.dev/agent-cli/introduction) 也暴露它们：

```bash
playwright-cli webmcp-list
playwright-cli webmcp-call search_catalog --params '{"query":"cats"}'
```

### 🎬 更好的视频

视频现在可以以自定义帧率录制，操作的装饰使用纯 CSS 样式：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
      fps: 60,
      show: {
        actions: {
          style: {
            point: 'width: 20px; height: 20px; border-radius: 50%; background: red',
            highlight: 'outline: 2px solid #333; background: rgba(0, 128, 255, .15)',
            title: 'font-size: 16px',
          },
        },
      },
    },
  },
});
```

:::
- [`testOptions.video`](/api/class-testoptions#test-options-video)、[`recordVideo`](/api/class-browser#browser-new-context-option-record-video) 和 [`screencast.start()`](/api/class-screencast#screencast-start) 中的新 `fps` 选项。Firefox 和 WebKit 目前每秒最多捕获 25 帧。
- 新的 [`style`](/api/class-screencast#screencast-show-actions-option-style) 选项接受 `point` 标记、目标 `highlight` 和操作 `title` 的 CSS 声明。它替换了现已弃用的 `fontSize` 选项。
- 光标在最后一个操作点保持可见，在导航中存活，并沿着自然的、缓动的路径移动。
- 视频使用 VP9 而不是 VP8 编码，CPU 使用更少，生成相同或更好质量的更小文件。
- 所有视频选项在 [Playwright MCP](https://playwright.dev/mcp/introduction) 和 [`playwright-cli`](https://playwright.dev/agent-cli/introduction) 中也可用。

### 🎯 测试运行器
- 新的 [`testProject.default`](/api/class-testproject#test-project-default) 选项将项目保留在配置中但默认不运行。您可以配置您关心的每个浏览器，让普通的 `npx playwright test` 只运行您喜欢的那个：
  
  ::: code-group
  
  ```js [playwright.config.ts]
  import { defineConfig, devices } from '@playwright/test';
  
  export default defineConfig({
    projects: [
      { name: 'chromium', use: devices['Desktop Chrome'] },
      { name: 'firefox', use: devices['Desktop Firefox'], default: false },
      { name: 'webkit', use: devices['Desktop Safari'], default: false },
    ],
  });
  ```
  
  :::
  
  ```bash
  npx playwright test                     # 仅运行 chromium
  npx playwright test --project=firefox   # 运行 firefox
  npx playwright test --project="*"       # 运行所有三个，例如在 CI 上
  ```
- 新的 `--shuffle` 命令行选项以随机顺序调度测试，这有助于找到意外相互依赖的测试。
  
  ```bash
  npx playwright test --shuffle
  # 使用 4 个工作器运行 42 个测试，shuffle seed 271828182
  # ...
  
  # 传递 seed 以重现相同顺序。
  npx playwright test --shuffle 271828182
  ```

### 🪆 Locator.within()

新的 [`locator.within()`](/api/class-locator#locator-within) 组合您已有的两个定位器，按自然顺序读取——"这个按钮，在那个对话框内"：

```js
const saveButton = page.getByRole('button', { name: '保存' });
const dialog = page.getByTestId('settings-dialog');

await saveButton.within(dialog).click();
```

相对定位器如 [`locator.nth()`](/api/class-locator#locator-nth) 或 [`locator.first()`](/api/class-locator#locator-first) 在每个父元素内部单独解析，这使得列式查询变得简单：

```js
// 每行的第三个单元格，而不是表格中的第三个单元格。
const thirdColumn = page.getByRole('cell').nth(2).within(page.getByRole('row'));
await expect(thirdColumn).toHaveText(['苹果', '香蕉', '樱桃']);
```

### 浏览器版本
- Chromium 156.0.8078.4
- Mozilla Firefox 157.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 155
- Microsoft Edge 155

## 版本 1.63

### 🔒 测试锁

访问共享资源的测试——外部服务、全局账户设置——现在可以声明命名的 `lock`。共享锁名的测试永远不会跨文件、工作器和[项目](./test-projects.md)并发运行，而其他所有测试继续并行运行：

```js
test('更新用户设置', { lock: 'user-settings' }, async ({ page }) => {
  // 永远不会与持有 'user-settings' 的其他测试同时运行
});
```

一个测试可以持有多个锁，[`test.describe()`](/api/class-test#test-describe) 接受整个组的 `lock`。了解更多关于[测试锁](./test-parallel.md#test-locks)。

### 🪟 跨帧定位

[`page.frameLocator()`](/api/class-page#page-frame-locator) 和 [`frame.frameLocator()`](/api/class-frame#frame-frame-locator) 在不带选择器调用时在子树的任何帧中搜索，因此您不再需要先定位 iframe：

```js
// 在页面上的任何帧中找到按钮。
await page.frameLocator().getByRole('button').click();
```

定位器的其余部分在单个帧内解析，就像常规定位器一样，当它匹配多个帧中的元素时会抛出错误。

### 👁️ 仅可见定位器

新的 [`locator.visible()`](/api/class-locator#locator-visible) 返回只匹配可见元素的定位器。它是 `:visible` CSS 伪类的推荐替代：

```js
await page.locator('button').visible().click();
```

### 浏览器版本
- Chromium 153.0.8010.12
- Mozilla Firefox 155.0
- WebKit 26.6

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 153
- Microsoft Edge 153

## 版本 1.62

### 🧱 新的组件测试模型

[组件测试](./test-components.md) 转向 **stories 和 galleries** 模型。**story** 将您的组件包装在一个特定场景中——硬编码的 props、模拟数据、提供者——**gallery** 页面按需渲染 stories。新的 [`fixtures.mount()`](/api/class-fixtures#fixtures-mount) fixture 导航到 gallery，通过 id 挂载 story，并返回作用域为 story 根元素的 [Locator](/api/class-locator)：

```js
test('点击应该展开', async ({ mount }) => {
  const component = await mount('components/Expandable/Stateful');
  await component.getByRole('button').click();
  await expect(component.getByTestId('expanded')).toHaveValue('true');
});
```

### 🛑 使用 AbortSignal 取消操作

大多数操作和 Web 优先断言现在接受 `signal` 选项，接受 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，让您可以取消长时间运行的操作、导航、等待和断言：

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

await page.getByRole('button', { name: '提交' }).click({ signal: controller.signal });
await expect(page.getByText('完成')).toBeVisible({ signal: controller.signal });
```

### 🖼️ WebP 截图

[`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1) 和 [`locatorAssertions.toHaveScreenshot()`](/api/class-locatorassertions#locator-assertions-to-have-screenshot-1) 现在可以以 WebP 格式存储快照——只需给快照一个 `.webp` 名称：

```js
// 视觉比较将黄金快照存储为无损 WebP。
await expect(page).toHaveScreenshot('homepage.webp');

// 独立截图可以用有损 WebP 换取质量以减小大小。
await page.screenshot({ path: 'homepage.webp', quality: 50 });
```

### 浏览器版本
- Chromium 151.0.7922.34
- Mozilla Firefox 153.0
- WebKit 26.5

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 151
- Microsoft Edge 151

## 版本 1.61

### 🔑 WebAuthn 密钥

新的 [Credentials](/api/class-credentials) 虚拟认证器，可通过 [`browserContext.credentials`](/api/class-browsercontext#browser-context-credentials) 获得，让测试注册密钥并在页面中响应 `navigator.credentials.create()` / `navigator.credentials.get()` 仪式——不需要真实的硬件密钥，在所有浏览器中都能工作：

```js
const context = await browser.newContext();

// 为测试用户预置您后端配置的密钥。
await context.credentials.create('example.com', {
  id: credentialId,
  userHandle,
  privateKey,
  publicKey,
});
await context.credentials.install();

const page = await context.newPage();
await page.goto('https://example.com/login');
// 页面的 navigator.credentials.get() 使用预置的密钥响应。
```

### 🗃️ Web 存储

新的 [WebStorage](/api/class-webstorage) API，可通过 [`page.localStorage`](/api/class-page#page-local-storage) 和 [`page.sessionStorage`](/api/class-page#page-session-storage) 获得，读取和写入当前来源的页面存储：

```js
await page.localStorage.setItem('token', 'abc');
const token = await page.localStorage.getItem('token');
const items = await page.sessionStorage.items();
```

### 浏览器版本
- Chromium 149.0.7827.55
- Mozilla Firefox 151.0
- WebKit 26.5

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 149
- Microsoft Edge 149

## 版本 1.60

### 🌐 追踪上的 HAR 录制

[`tracing.startHar()`](/api/class-tracing#tracing-start-har) / [`tracing.stopHar()`](/api/class-tracing#tracing-stop-har) 将 HAR 录制作为一流的追踪 API 暴露，具有与 `recordHar` 相同的 `content`、`mode` 和 `urlFilter` 选项。

### 🪝 Drop API

新的 [`locator.drop()`](/api/class-locator#locator-drop) 模拟将文件或类似剪贴板数据的外部拖放到元素上。Playwright 在页面上下文中分发带有合成 [DataTransfer] 的 `dragenter`、`dragover` 和 `drop`——跨浏览器工作，非常适合测试上传区域：

```js
await page.locator('#dropzone').drop({
  files: { name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
});
```

### 浏览器版本
- Chromium 148.0.7778.96
- Mozilla Firefox 150.0.2
- WebKit 26.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 147
- Microsoft Edge 147

## 版本 1.59

### 🎬 屏幕录制

新的 [`page.screencast`](/api/class-page#page-screencast) API 提供统一的页面内容捕获接口：
- 屏幕录制
- 操作注解
- 视觉叠加层
- 实时帧捕获
- 代理视频收据

**屏幕录制** — 使用精确的开始/停止控制录制视频，作为 [`recordVideo`](/api/class-browser#browser-new-context-option-record-video) 选项的替代：

```js
await page.screencast.start({ path: 'video.webm' });
// ... 执行操作 ...
await page.screencast.stop();
```

**操作注解** — 启用内置视觉注解，在录制期间高亮显示交互的元素并显示操作标题：

```js
await page.screencast.showActions({ position: 'top-right' });
```

### 浏览器版本
- Chromium 147.0.7727.15
- Mozilla Firefox 148.0.2
- WebKit 26.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 146
- Microsoft Edge 146

## 版本 1.58

### 时间线

如果您使用[合并报告](./test-sharding.md#merging-reports-from-multiple-environments)，HTML 报告 Speedboard 标签现在显示时间线：

![HTML 报告中的时间线图](/images/timeline.png)

### UI 模式和追踪查看器改进
- 新的'系统'主题选项跟随您的操作系统深色/浅色模式偏好
- 代码编辑器中现在可以使用搜索功能（Cmd/Ctrl+F）
- 网络详情面板已重新组织以提高可用性
- JSON 响应现在自动格式化以提高可读性

### 浏览器版本
- Chromium 145.0.7632.6
- Mozilla Firefox 146.0.1
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 144
- Microsoft Edge 144

## 版本 1.57

### Speedboard

在 HTML 报告器中，有一个新标签我们称为"Speedboard"：

![Speedboard](/images/speedboard.png)

它按速度排序显示所有已执行的测试，可以帮助您了解测试套件在哪里花费的时间比预期长。看看您的——也许您会发现一些测试等待的时间比应该的更长！

### Chrome for Testing

Playwright 现在运行在 [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/) 构建上而不是 Chromium。有头模式使用 `chrome`；无头模式使用 `chrome-headless-shell`。升级到 v1.57 后现有测试应该继续通过。

### 浏览器版本
- Chromium 143.0.7499.4
- Mozilla Firefox 144.0.2
- WebKit 26.0

## 版本 1.56

<LiteYouTube
id="_AifxZGxwuk"
title="Playwright 1.56 - 介绍 Playwright 测试代理"
/>

### Playwright 测试代理

介绍 Playwright 测试代理，三个自定义代理定义，旨在引导 LLM 完成构建 Playwright 测试的核心流程：
* **🎭 planner** 探索应用并生成 Markdown 测试计划
* **🎭 generator** 将 Markdown 计划转换为 Playwright Test 文件
* **🎭 healer** 执行测试套件并自动修复失败的测试

使用您选择的客户端运行 `npx playwright init-agents` 以生成最新的代理定义：

```bash
# 为每个代理循环生成代理文件
# Visual Studio Code
npx playwright init-agents --loop=vscode
# Claude Code
npx playwright init-agents --loop=claude
# opencode
npx playwright init-agents --loop=opencode
```

[了解更多关于 Playwright 测试代理](./test-agents.md)

### 浏览器版本
- Chromium 141.0.7390.37
- Mozilla Firefox 142.0.1
- WebKit 26.0

## 版本 1.55

### 新 API
- 新属性 [`testStepInfo.titlePath`](/api/class-teststepinfo#test-step-info-title-path) 返回从测试文件开始的完整标题路径，包括测试和步骤标题。

### Codegen
- 自动 `toBeVisible()` 断言：Codegen 现在可以为常见的 UI 交互生成自动 `toBeVisible()` 断言。此功能可以在 Codegen 设置 UI 中启用。

### 浏览器版本
- Chromium 140.0.7339.16
- Mozilla Firefox 141.0
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 139
- Microsoft Edge 139

## 版本 1.54

### 亮点
- [`browserContext.cookies()`](/api/class-browsercontext#browser-context-cookies) 和 [`browserContext.addCookies()`](/api/class-browsercontext#browser-context-add-cookies) 中的新 cookie 属性 `partitionKey`。此属性允许保存和恢复分区 cookie。
- HTML 报告的新 `noSnippets` 选项以禁用代码片段。

### 浏览器版本
- Chromium 139.0.7258.5
- Mozilla Firefox 140.0.2
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 140
- Microsoft Edge 140

## 版本 1.53

### 追踪查看器和 HTML 报告器更新
- 追踪查看器和 HTML 报告器中的新步骤
- `'html'` 报告器中的新选项用于设置特定测试运行的标题

### 浏览器版本
- Chromium 138.0.7204.4
- Mozilla Firefox 139.0
- WebKit 18.5

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 137
- Microsoft Edge 137

## 版本 1.52

### 亮点
- 新方法 [`locatorAssertions.toContainClass()`](/api/class-locatorassertions#locator-assertions-to-contain-class) 用于符合人体工程学地断言元素上的单个类名。
  
  ```ts
  await expect(page.getByRole('listitem', { name: '发布 v1.52' })).toContainClass('done');
  ```

### 浏览器版本
- Chromium 136.0.7103.25
- Mozilla Firefox 137.0
- WebKit 18.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 135
- Microsoft Edge 135

## 版本 1.51

### IndexedDB 的 StorageState
* [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 的新 [`indexedDB`](/api/class-browsercontext#browser-context-storage-state-option-indexed-db) 选项允许保存和恢复 IndexedDB 内容。当您的应用程序使用 [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 存储认证令牌时很有用，如 Firebase Authentication。

### 复制为提示

HTML 报告、追踪查看器和 UI 模式中错误上的新"复制提示"按钮。点击以复制预填充的 LLM 提示，其中包含错误消息和修复错误的有用上下文。

### 浏览器版本
* Chromium 134.0.6998.35
* Mozilla Firefox 135.0
* WebKit 18.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 133
* Microsoft Edge 133

## 版本 1.50

### 测试运行器
* 新选项 [`timeout`](/api/class-test#test-step-option-timeout) 允许为单个测试步骤指定最大运行时间。超时的步骤将导致测试执行失败。
  
  ```js
  test('某个测试', async ({ page }) => {
    await test.step('一个步骤', async () => {
      // 此步骤可以独立于测试超时
    }, { timeout: 1000 });
  });
  ```

### 浏览器版本
* Chromium 133.0.6943.16
* Mozilla Firefox 134.0
* WebKit 18.2

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 132
* Microsoft Edge 132

## 版本 1.49

<LiteYouTube
id="S5wCft-ImKk"
title="Playwright 1.49"
/>

### Aria 快照

新断言 [`locatorAssertions.toMatchAriaSnapshot()`](/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 通过与预期的可访问性树（表示为 YAML）进行比较来验证页面结构。

```js
await page.goto('https://playwright.dev');
await expect(page.locator('body')).toMatchAriaSnapshot(`
  - banner:
    - heading /Playwright enables reliable/ [level=1]
    - link "Get started"
    - link "Star microsoft/playwright on GitHub"
  - main:
    - img "Browsers (Chromium, Firefox, WebKit)"
    - heading "Any browser • Any platform • One API"
`);
```

### 浏览器版本
* Chromium 131.0.6778.33
* Mozilla Firefox 132.0
* WebKit 18.2

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 130
* Microsoft Edge 130

## 版本 1.48

<LiteYouTube
id="VGlkSBkMVCQ"
title="Playwright 1.48"
/>

### WebSocket 路由

新方法 [`page.routeWebSocket()`](/api/class-page#page-route-web-socket) 和 [`browserContext.routeWebSocket()`](/api/class-browsercontext#browser-context-route-web-socket) 允许拦截、修改和模拟页面中发起的 WebSocket 连接。

```js
await page.routeWebSocket('/ws', ws => {
  ws.onMessage(message => {
    if (message === 'request')
      ws.send('response');
  });
});
```

### 浏览器版本
* Chromium 130.0.6723.19
* Mozilla Firefox 130.0
* WebKit 18.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 129
* Microsoft Edge 129

## 版本 1.47

### 网络标签改进

UI 模式和追踪查看器中的网络标签有几个不错的改进：
- 按资产类型和 URL 过滤
- 更好地显示查询字符串参数
- 预览字体资产

### 浏览器版本
* Chromium 129.0.6668.29
* Mozilla Firefox 130.0
* WebKit 18.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 128
* Microsoft Edge 128

## 版本 1.46

<LiteYouTube
id="tQo7w-QQBsI"
title="Playwright 1.46"
/>

### TLS 客户端证书

Playwright 现在允许您提供客户端证书，以便服务器可以验证它们，如 TLS 客户端认证所规定。

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    clientCertificates: [{
      origin: 'https://example.com',
      certPath: './cert.pem',
      keyPath: './key.pem',
      passphrase: 'mysecretpassword',
    }],
  },
});
```

### 浏览器版本
* Chromium 128.0.6613.18
* Mozilla Firefox 128.0
* WebKit 18.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 127
* Microsoft Edge 127

## 版本 1.45

<LiteYouTube
id="54_aC-rVKHg"
title="Playwright 1.45"
/>

### 时钟

利用新的 [Clock](/api/class-clock) API 允许在测试中操纵和控制时间以验证与时间相关的行为。

```js
// 初始化时钟并让页面自然加载。
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.goto('http://localhost:3333');

// 假装用户合上笔记本电脑盖子并在上午 10 点再次打开，
// 到达该时间点后暂停时间。
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));

// 断言页面状态。
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');
```

### 浏览器版本
* Chromium 127.0.6533.5
* Mozilla Firefox 127.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 126
* Microsoft Edge 126

## 版本 1.44

<LiteYouTube
id="avjSahFWdCI"
title="Playwright 1.44"
/>

### 新 API

**可访问性断言**
- [`locatorAssertions.toHaveAccessibleName()`](/api/class-locatorassertions#locator-assertions-to-have-accessible-name) 检查元素是否具有指定的可访问名称
- [`locatorAssertions.toHaveAccessibleDescription()`](/api/class-locatorassertions#locator-assertions-to-have-accessible-description) 检查元素是否具有指定的可访问描述
- [`locatorAssertions.toHaveRole()`](/api/class-locatorassertions#locator-assertions-to-have-role) 检查元素是否具有指定的 ARIA 角色

### 浏览器版本
* Chromium 125.0.6422.14
* Mozilla Firefox 125.0.1
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 124
* Microsoft Edge 124

## 版本 1.43

### 新 API
- 方法 [`browserContext.clearCookies()`](/api/class-browsercontext#browser-context-clear-cookies) 现在支持过滤器以仅删除某些 cookie。
- [`testOptions.trace`](/api/class-testoptions#test-options-trace) 的新模式 `retain-on-first-failure`。
- 新属性 [`testInfo.tags`](/api/class-testinfo#test-info-tags) 在测试执行期间暴露测试标签。
- 新方法 [`locator.contentFrame()`](/api/class-locator#locator-content-frame) 将 [Locator](/api/class-locator) 对象转换为 [FrameLocator](/api/class-framelocator)。
- 新方法 [`frameLocator.owner()`](/api/class-framelocator#frame-locator-owner) 将 [FrameLocator](/api/class-framelocator) 对象转换为 [Locator](/api/class-locator)。

### 浏览器版本
* Chromium 124.0.6367.8
* Mozilla Firefox 124.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 123
* Microsoft Edge 123

## 版本 1.42

<LiteYouTube
id="KjSaIQLlgns"
title="Playwright 1.41 & 1.42"
/>

### 新 API
- 新方法 [`page.addLocatorHandler()`](/api/class-page#page-add-locator-handler) 注册一个回调，当指定的元素变得可见并可能阻止 Playwright 操作时将被调用。

### 浏览器版本
* Chromium 123.0.6312.4
* Mozilla Firefox 123.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 122
* Microsoft Edge 123

## 版本 1.41

### 新 API
- 新方法 [`page.unrouteAll()`](/api/class-page#page-unroute-all) 删除所有通过 [`page.route()`](/api/class-page#page-route) 注册的路由。
- 新方法 [`browserContext.unrouteAll()`](/api/class-browsercontext#browser-context-unroute-all) 删除所有通过 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 注册的路由。

### 浏览器版本
* Chromium 121.0.6167.57
* Mozilla Firefox 121.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 120
* Microsoft Edge 120

## 版本 1.40

<LiteYouTube
id="mn892dV81_8"
title="Playwright 1.40"
/>

### 测试生成器更新

新的断言生成工具：
- "断言可见性"工具生成 [`locatorAssertions.toBeVisible()`](/api/class-locatorassertions#locator-assertions-to-be-visible)。
- "断言值"工具生成 [`locatorAssertions.toHaveValue()`](/api/class-locatorassertions#locator-assertions-to-have-value)。
- "断言文本"工具生成 [`locatorAssertions.toContainText()`](/api/class-locatorassertions#locator-assertions-to-contain-text)。

### 浏览器版本
* Chromium 120.0.6099.28
* Mozilla Firefox 119.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 119
* Microsoft Edge 119

## 版本 1.39

<LiteYouTube
id="KqVuRAlOkm0"
title="Playwright 1.39"
/>

### 向 expect 添加自定义匹配器

您可以通过提供自定义匹配器来扩展 Playwright 断言。这些匹配器将在 expect 对象上可用。

### 浏览器版本
* Chromium 119.0.6045.9
* Mozilla Firefox 118.0.1
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 118
* Microsoft Edge 118

## 版本 1.38

<LiteYouTube
id="YGJTeXaZDTM"
title="Playwright 1.38"
/>

### UI 模式更新

1. 放大时间范围。
2. 网络面板重新设计。

### 浏览器版本
* Chromium 117.0.5938.62
* Mozilla Firefox 117.0
* WebKit 17.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 116
* Microsoft Edge 116

## 版本 1.37

<LiteYouTube
id="cEd4SH_Xf5U"
title="Playwright 1.36 & 1.37"
/>

### 新的 `npx playwright merge-reports` 工具

如果您在多个分片上运行测试，现在可以使用新的 `merge-reports` CLI 工具将所有报告合并到单个 HTML 报告（或任何其他报告）中。

### 浏览器版本
* Chromium 116.0.5845.82
* Mozilla Firefox 115.0
* WebKit 17.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 115
* Microsoft Edge 115

## 版本 1.36

🏝️ 夏季维护版本。

### 浏览器版本
* Chromium 115.0.5790.75
* Mozilla Firefox 115.0
* WebKit 17.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 114
* Microsoft Edge 114

## 版本 1.35

<LiteYouTube
id="pJiirfyJwcA"
title="Playwright 1.35"
/>

### 亮点
* UI 模式现在可以通过新的"显示追踪查看器"按钮在 VSCode Playwright 扩展中使用
* UI 模式和追踪查看器标记使用 [`page.route()`](/api/class-page#page-route) 和 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 处理程序处理的网络请求
* 新的 `maskColor` 选项用于截图方法
* 新的 `uninstall` CLI 命令用于卸载浏览器二进制文件

### 浏览器版本
* Chromium 115.0.5790.13
* Mozilla Firefox 113.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 114
* Microsoft Edge 114

## 版本 1.34

<LiteYouTube
id="JeFD6rqDbBo"
title="Playwright 1.34"
/>

### 亮点
* UI 模式现在显示步骤、fixtures 和附件
* 新属性 [`testProject.teardown`](/api/class-testproject#test-project-teardown) 用于指定在此项目和所有依赖项目完成后需要运行的项目
* 新方法 [`expect.configure`](./test-assertions.md#expectconfigure) 用于创建具有自己默认值（如 `timeout` 和 `soft`）的预配置 expect 实例

### 浏览器版本
* Chromium 114.0.5735.26
* Mozilla Firefox 113.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 113
* Microsoft Edge 113

## 版本 1.33

<LiteYouTube
id="JeFD6rqDbBo"
title="Playwright 1.33"
/>

### 定位器更新
* 使用 [`locator.or()`](/api/class-locator#locator-or) 创建匹配两个定位器之一的定位器。
* 在 [`locator.filter()`](/api/class-locator#locator-filter) 中使用新选项 [`hasNot`](/api/class-locator#locator-filter-option-has-not) 和 [`hasNotText`](/api/class-locator#locator-filter-option-has-not-text) 查找**不匹配**某些条件的元素。
* 使用新的 Web 优先断言 [`locatorAssertions.toBeAttached()`](/api/class-locatorassertions#locator-assertions-to-be-attached) 确保元素存在于页面的 DOM 中。

### 浏览器版本
* Chromium 113.0.5672.53
* Mozilla Firefox 112.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 112
* Microsoft Edge 112

## 版本 1.32

<LiteYouTube
id="jF0yA-JLQW0"
title="Playwright 1.32"
/>

### 介绍 UI 模式（预览）

新的 [UI 模式](./test-ui-mode.md) 让您可以探索、运行和调试测试。带有内置的监视模式。

使用新标志 `--ui` 启动：

```sh
npx playwright test --ui
```

### 浏览器版本
* Chromium 112.0.5615.29
* Mozilla Firefox 111.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 111
* Microsoft Edge 111

## 版本 1.31

<LiteYouTube
id="PI50YAPTAs4"
title="Playwright 1.31"
/>

### 新 API
- 新属性 [`testProject.dependencies`](/api/class-testproject#test-project-dependencies) 用于配置项目之间的依赖关系。
- 新断言 [`locatorAssertions.toBeInViewport()`](/api/class-locatorassertions#locator-assertions-to-be-in-viewport) 确保定位器指向与视口相交的元素。

### 浏览器版本
* Chromium 111.0.5563.19
* Mozilla Firefox 109.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 110
* Microsoft Edge 110

## 版本 1.30

### 浏览器版本
* Chromium 110.0.5481.38
* Mozilla Firefox 108.0.2
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 109
* Microsoft Edge 109

## 版本 1.29

<LiteYouTube
id="VbVlz61VtNo"
title="Playwright 1.29"
/>

### 新 API
- 新方法 [`route.fetch()`](/api/class-route#route-fetch) 和 [`route.fulfill()`](/api/class-route#route-fulfill) 的新选项 `json`
- 新方法 [`locator.all()`](/api/class-locator#locator-all) 用于遍历所有匹配的元素
- [`locator.selectOption()`](/api/class-locator#locator-select-option) 现在按值或标签匹配

### 浏览器版本
* Chromium 109.0.5414.46
* Mozilla Firefox 107.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 108
* Microsoft Edge 108

## 版本 1.28

<LiteYouTube
id="tVSq-0n-TY4"
title="Playwright 1.28"
/>

### Playwright 工具
* **在 VSCode 中在光标处录制。** 您可以运行测试，将光标定位在测试末尾并继续生成测试。
* **VSCode 中的实时定位器。** 您可以在 VSCode 中悬停和编辑定位器，以在打开的浏览器中高亮显示它们。

### 浏览器版本
* Chromium 108.0.5359.29
* Mozilla Firefox 106.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 107
* Microsoft Edge 107

## 版本 1.27

<LiteYouTube
id="b84eqab3kwc"
title="Playwright 1.27"
/>

### 定位器

使用这些新 API 编写定位器是一种乐趣：
- [`page.getByText()`](/api/class-page#page-get-by-text) 通过文本内容定位。
- [`page.getByRole()`](/api/class-page#page-get-by-role) 通过 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) 和 [可访问名称](https://w3c.github.io/accname/#dfn-accessible-name) 定位。
- [`page.getByLabel()`](/api/class-page#page-get-by-label) 通过关联标签的文本定位表单控件。
- [`page.getByTestId()`](/api/class-page#page-get-by-test-id) 基于其 `data-testid` 属性定位元素。
- [`page.getByPlaceholder()`](/api/class-page#page-get-by-placeholder) 通过占位符定位输入框。
- [`page.getByAltText()`](/api/class-page#page-get-by-alt-text) 通过其替代文本定位元素，通常是图片。
- [`page.getByTitle()`](/api/class-page#page-get-by-title) 通过其标题定位元素。

```js
await page.getByLabel('用户名').fill('John');
await page.getByLabel('密码').fill('secret-password');
await page.getByRole('button', { name: '登录' }).click();
await expect(page.getByText('欢迎，John！')).toBeVisible();
```

### 浏览器版本
* Chromium 107.0.5304.18
* Mozilla Firefox 105.0.1
* WebKit 16.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 106
* Microsoft Edge 106
