---
title: "组件测试"
---

# 组件测试

## 简介

Playwright Test 可以单独测试 Web 应用程序的组件。组件测试是一个常规的 Playwright 端到端测试，它针对由您自己的开发服务器提供的小型 **story gallery** 页面运行。没有专用的组件测试运行时，没有打包器集成，也没有额外的 npm 包——`@playwright/test` 内置的 [`fixtures.mount()`](/api/class-fixtures#fixtures-mount) fixture 驱动一切。

```js
import { test, expect } from '@playwright/test';

test('点击应该展开', async ({ mount }) => {
  const component = await mount('components/Expandable/Stateful');
  await component.getByRole('button').click();
  await expect(component.getByTestId('expanded')).toHaveValue('true');
});
```

测试在 Node.js 中运行，而组件在真实浏览器中运行：触发真实的点击，执行真实的布局，可以进行视觉回归测试。同时，测试可以获得 Playwright Test 提供的所有功能：并行化、参数化、重试和事后追踪。

::: info
实验性的 `@playwright/experimental-ct-react`、`-ct-react17` 和 `-ct-vue` 包已被移除，不再发布。如果您仍在使用它们，请保持使用 Playwright 1.62，直到您按照下面的[迁移指南](#从实验性包迁移)完成迁移。
:::

## 为什么采用与框架无关的方法

`@playwright/experimental-ct-*` 包允许测试内联编写 JSX——`mount(<Button onClick={spy} />)`。为了实现这一点，Playwright 必须控制整个流程：扫描测试中的组件，使用自己的 Vite 副本和配置编译打包，从自己的服务器提供服务，并在 Node.js/浏览器边界之间传递 props 和回调。

这种设计使得这些包永远处于实验阶段：
- **只有当您的设置与我们的匹配时才能工作。** 路径别名、插件和 CSS 处理必须手动镜像到 `ctViteConfig` 中。使用 webpack、Next.js 或自定义流程的项目根本无法使用自己的构建。每个框架都需要自己的包和运行时粘合代码，每个新框架意味着又一个包。
- **Node.js/浏览器边界会泄漏。** 测试中编写的 JSX 在 Node.js 中编译，然后在浏览器中重新组装。活动对象无法跨越边界，回调只能通过传递部分工作，模块模拟默默不生效。

替代方案反转了控制：
- **您拥有流程。** 组件由您自己的开发服务器使用您的插件、别名和 CSS 构建和提供。Playwright 不编译或提供任何东西——它只是导航到页面，就像任何其他测试一样。
- **与框架无关。** 唯一特定于框架的部分是 gallery 页面——一个您拥有的小模块。React、Vue、Svelte、Solid 或其他任何框架：如果您的开发服务器可以渲染它，Playwright 就可以测试它。
- **它是稳定的。** 测试从普通的 `@playwright/test` 导入 `test` 和 `expect`，[`fixtures.mount()`](/api/class-fixtures#fixtures-mount) 是一个文档化的内置 fixture。没有需要依赖的实验性包，也没有单独的配置方言。

## 工作原理

三个概念构成了整个模型：
- **story** 是一个微小的包装组件，将被测组件嵌入到一个特定场景中：硬编码的 props、模拟数据、提供者、录制的回调。Stories 与组件一起放在 `*.story.tsx`（或 `.ts`/`.jsx`/`.js`/`.vue`）文件中；每个命名导出就是一个 story。
- **gallery** 是一个由您的开发服务器提供的单一页面，它暴露 `window.mount(params)` 和 `window.unmount()` 函数，将从您的 story 文件解析的 story 渲染到 `#root` 元素中。它特定于框架，由您拥有。
- [`fixtures.mount()`](/api/class-fixtures#fixtures-mount) fixture 导航到 gallery（[`testOptions.baseURL`](/api/class-testoptions#test-options-base-url)），使用 story id 和 props 调用 `window.mount()`，并返回 gallery 根的 [Locator](/api/class-locator)。从它开始进行查询：`component.getByRole('button').click()`。

组件需要的一切都在 *story 内部* 设置，它在浏览器中运行。测试断言的一切都可以通过 *页面* 观察：DOM、URL、网络。

## 快速入门

### 步骤 1：将您的编码代理指向技能

gallery 是应用程序代码——它属于您，而不是 Playwright。获取 gallery 的最快方法是不自己编写它：Playwright 将整个方法作为代理技能提供。安装技能并让您的编码代理（Claude Code、GitHub Copilot 或类似工具）进行设置：

```bash
npx playwright init-skills
```

```txt
使用 playwright-component-testing 技能设置组件测试。
```

代理检测您的框架和打包器，为您的技术栈实现 gallery，将 Playwright 项目添加到配置中，并编写第一个 story 和 spec。

gallery 履行的契约很小，值得了解，即使您从不打开该文件：
- 它是 `playwright/gallery/` 下的单一页面，由**您自己的开发服务器**提供——Vite 应用程序使用它们已经运行的开发服务器提供；其他设置在应用程序旁边运行一个小的独立 Vite 服务器。
- 它发现您的 `*.story.*` 文件并暴露两个函数：`window.mount({ story, props })` 将具有给定 id 的 story 渲染到 `#root` 元素中，`window.unmount()` 将其拆除。未知的 story 或渲染错误会拒绝，这在测试的 `mount()` 调用中表现为抛出异常。
- 它在调用之间重用渲染根，因此 `component.update(props)` 会协调而不是重新挂载，组件状态会保留。
- 它以与应用程序入口相同的方式导入您的全局 CSS，`window.mount` 的主体是进行应用程序范围设置的自然位置——相当于旧的 `beforeMount`/`afterMount` 钩子。

如果您更喜欢手动编写 gallery，已安装的技能在 `references/gallery-spec.md` 中包含完整规范以及 React 和 Vue 的示例——整个页面只有几十行。

### 步骤 2：配置 Playwright

在您的 `playwright.config.ts` 中添加一个项目，并将 `baseURL` 指向 gallery：

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'components',
      testDir: './tests/components',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173/playwright/gallery/index.html',
        serviceWorkers: 'block',
        reuseContext: true,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173/playwright/gallery/index.html',
    reuseExistingServer: !process.env.CI,
  },
});
```

:::

`mount` 导航到 `baseURL`，因此它必须指向 gallery。`serviceWorkers: 'block'` 防止应用程序自己的 service worker 提供会覆盖您的 `page.route()` 模拟的缓存响应。`reuseContext: true` 在工作器中的测试之间重用浏览器上下文——这对组件套件来说是一个很大的加速，与实验性包隐式应用的优化相同。

### 步骤 3：编写 story

Stories 与它们测试的组件放在一起。每个命名导出就是一个场景：

::: code-group

```js [src/components/Button.story.tsx]
import { Button } from './Button';

export const Primary = () => <Button title='提交' />;

export const Disabled = () => <Button title='提交' disabled />;
```

:::

### 步骤 4：编写测试

::: code-group

```js [tests/components/button.spec.ts]
import { test, expect } from '@playwright/test';

test('渲染主按钮', async ({ mount }) => {
  const component = await mount('components/Button/Primary');
  await expect(component.getByRole('button')).toHaveText('提交');
});

test('禁用按钮已禁用', async ({ mount }) => {
  const component = await mount('components/Button/Disabled');
  await expect(component.getByRole('button')).toBeDisabled();
});
```

:::

### 步骤 5：运行

```sh
npx playwright test --project=components
```

## Stories 作为一种方法论

Stories 不仅仅是测试的变通方法——它们是组件状态的可搜索、可审查的文档，约定使它们保持这种状态：
- **每个场景一个导出。** 优先创建新的 story 导出，而不是参数化现有的。`Button.story.tsx` 导出 `Primary`、`Disabled`、`WithLongTitle` 读起来就像组件的规范。
- **Stories 与组件放在一起。** `src/components/Button.story.tsx` 记录 `src/components/Button.tsx`。重命名和重构时两者一起修改。
- **Story id 从文件路径派生**：`src/` 下的路径去掉 `.story.*` 扩展名，加上导出名——`components/Button/Primary`。任何唯一的后缀也可以：`mount('Button/Primary')`。
- **story 拥有组件需要的一切**：提供者、模拟数据、状态、回调。测试只拥有交互和断言。

因为每个 story 都是一个命名的、可寻址的页面状态，gallery 可以兼作活的目录：在浏览器中打开 gallery URL 并渲染任何 story 以便目视检查。

## 测试模式

### 记录状态用于断言

组件接受回调；测试想要断言它们被触发。不要在 Node.js 和浏览器之间传递回调，**story 拥有状态并提供回调**——并将可观察的结果记录到组件旁边的隐藏表单中：

<Tabs group-id="js-framework" default-value="react" :tabs='[{"label":"React","value":"react"},{"label":"Vue","value":"vue"}]'>

<TabItem value="react">

::: code-group

```js [src/components/Expandable.story.tsx]
import { useState } from 'react';
import { Expandable } from './Expandable';

export const Stateful = () => {
  const [expanded, setExpanded] = useState(false);
  return <>
    <Expandable expanded={expanded} setExpanded={setExpanded} title='标题'>详情</Expandable>
    <form hidden><input data-testid='expanded' readOnly value={String(expanded)} /></form>
  </>;
};
```

:::

</TabItem>

<TabItem value="vue">

::: code-group

```js [src/components/Expandable.story.ts]
import { defineComponent, h, ref } from 'vue';
import Expandable from './Expandable.vue';

export const Stateful = defineComponent(() => {
  const expanded = ref(false);
  return () => h('div', [
    h(Expandable, {
      'expanded': expanded.value,
      'onUpdate:expanded': (value: boolean) => expanded.value = value,
      'title': '标题',
    }),
    h('form', { hidden: true }, [
      h('input', { 'data-testid': 'expanded', 'readonly': true, 'value': String(expanded.value) }),
    ]),
  ]);
});
```

:::

</TabItem>

</Tabs>

::: code-group

```js [tests/components/expandable.spec.ts]
test('点击应该展开', async ({ mount }) => {
  const component = await mount('components/Expandable/Stateful');
  await component.getByRole('button').click();
  await expect(component.getByTestId('expanded')).toHaveValue('true');
});
```

:::

这种模式是该方法的核心：
- 整个场景在浏览器中运行——没有回调传递，没有 Node.js/浏览器边界泄漏。
- `toHaveValue()` 是 Web 优先断言：它会重试直到状态到达，因此不需要手动等待或轮询。
- 将每个观察到的值记录在自己的 `data-testid` 输入中——标量使用 `String(...)`，负载使用 `JSON.stringify(...)`。反向操作同样有效：执行操作，然后断言值**没有**改变。
- 记录的状态*在您在 gallery 中打开 story 时可见*。手动点击组件并观察值变化——story 可以作为自动化测试覆盖的确切场景的手动测试页面。保持表单 `hidden` 以获得干净的截图基线，或者在开发时删除 `hidden` 属性以在组件旁边看到实时状态。

### 每个测试的 props

当场景受益于参数化时，将普通的可序列化 props 作为 `mount` 的第二个参数传递。gallery 将它们作为 props 传递给 story：

::: code-group

```js [src/components/Button.story.tsx]
import { Button } from './Button';

export const WithTitle = ({ title = '默认' }: { title?: string }) =>
  <Button title={title} />;
```

:::

::: code-group

```js [tests/components/button.spec.ts]
import type { WithTitle } from '../../src/components/Button.story';

const component = await mount<typeof WithTitle>('Button/WithTitle', { title: '你好' });
```

:::

`mount` 对 story 是泛型的：将 story 类型作为模板参数传递，props（和 `update()`）将根据 story 签名进行类型检查。保持 props 为普通的可序列化数据——回调属于 story 内部。

### 使用 `update()` 进行 Props 转换

要测试组件如何响应 prop 更改**而不重新挂载**——状态保留——调用 `component.update(newProps)`。它在现有根上使用新 props 重新渲染相同的 story：

```js
const component = await mount('components/Counter/Default', { value: 1 });
await expect(component.getByTestId('value')).toHaveText('1');
await component.update({ value: 2 });
await expect(component.getByTestId('value')).toHaveText('2');
```

### 多状态和视觉比较

每个 `mount()` 都是全新的导航，因此测试是完全隔离的，在一个测试中挂载多个 stories 很便宜：

```js
await expect(await mount('Button/Primary')).toHaveScreenshot('primary.png');
await expect(await mount('Button/Disabled')).toHaveScreenshot('disabled.png');
```

截图返回的根定位器，而不是页面，以避免断言您可能放在 gallery 中的任何额外内容。

### 处理网络请求

像往常一样使用 [`page.route()`](/api/class-page#page-route)——在 `mount()` 之前注册路由，因为挂载会导航：

```js
test('渲染错误状态', async ({ page, mount }) => {
  await page.route('**/api/items', route => route.fulfill({ status: 500 }));
  const component = await mount('components/ItemList/Default');
  await expect(component.getByRole('alert')).toContainText('出错了');
});
```

配置中的 `serviceWorkers: 'block'` 选项防止应用程序自己的 service worker 提供会覆盖路由的缓存响应。使用 [MSW](https://mswjs.io/) 处理程序库的团队可以在 story 或装饰器内部启动 worker。

### 调试 stories

在浏览器中打开 gallery URL，并从 DevTools 控制台调用 `await window.mount({ story: 'components/Button/Primary' })`——这正是 `mount` fixture 所做的。未知的 story 或渲染错误会拒绝 `window.mount`，这在测试的 `mount()` 中表现为抛出带有真实堆栈的异常。要在不使用控制台的情况下浏览，请给您的 gallery 一个可选的索引页面，列出所有发现的 stories。

## 从实验性包迁移

实验性包在测试文件中编译 JSX 并将其传递到浏览器。gallery 模式将场景移到一个在浏览器中原生运行的 story 导出中。以下是概念的对应关系：

| `@playwright/experimental-ct-*` | Story gallery |
|---|---|
| `mount(<Button onClick={spy} />)` | 有状态 story：story 提供 `onClick` 并将效果记录到隐藏输入中；测试使用 `toHaveValue()` 断言 |
| 来自测试的普通数据 props | 本质上不变：`mount(id, props)` |
| 来自测试的 JSX 子元素 / 插槽 | 每个组合一个 story 导出（Vue：对于插槽较多的场景使用 `.story.vue` 文件） |
| `component.update(<Button count={2} />)` | `component.update({ count: 2 })` |
| `component.unmount()` | `component.unmount()` |
| `beforeMount` / `afterMount` 钩子 | gallery 的 `window.mount` 主体（全局），或 story 装饰器（每个 story） |
| `hooksConfig` 每个测试的变化 | Props：`mount('App/Routing', { route: '/dashboard' })`，由 story 解释 |
| `router` fixture / Node.js 中的 MSW 处理程序 | 测试中的 [`page.route()`](/api/class-page#page-route)，或 story 内部的 MSW `setupWorker` |
| `playwright/index.html`（样式、主题） | gallery 的 `index.html` 和入口模块导入 |
| `ctViteConfig`、`ctPort`、`ctTemplateDir` | 已消失——gallery 通过您自己的开发服务器运行；端口在 `webServer` 和 `baseURL` 中 |
| ct 包中的 `defineConfig` | `@playwright/test` 中的普通 `defineConfig` |

典型的 spec 迁移如下：

::: code-group

```js [之前: button.spec.tsx]
import { test, expect } from '@playwright/experimental-ct-react';
import Button from '../src/components/Button';

test('计数点击', async ({ mount }) => {
  let clicks = 0;
  const component = await mount(<Button title='提交' onClick={() => ++clicks} />);
  await component.getByRole('button').click();
  expect(clicks).toBe(1);
});
```

:::

::: code-group

```js [之后: src/components/Button.story.tsx]
import { useState } from 'react';
import { Button } from './Button';

export const CountsClicks = () => {
  const [clicks, setClicks] = useState(0);
  return <>
    <Button title='提交' onClick={() => setClicks(count => count + 1)} />
    <form hidden><input data-testid='click-count' readOnly value={String(clicks)} /></form>
  </>;
};
```

:::

::: code-group

```js [之后: tests/components/button.spec.ts]
import { test, expect } from '@playwright/test';

test('计数点击', async ({ mount }) => {
  const component = await mount('components/Button/CountsClicks');
  await component.getByRole('button').click();
  await expect(component.getByTestId('click-count')).toHaveValue('1');
});
```

:::

渐进式迁移：在固定使用 Playwright 1.62 的情况下，在旧的 CT 项目旁边设置 gallery 和 `components` 项目，逐个迁移 spec，然后删除 `@playwright/experimental-ct-*` 依赖以及 `playwright/index.html`、`playwright/index.ts` 和 `playwright/.cache` 并升级。

需要注意的事项：
- **Story id 是字符串。** 重命名或移动 story 会在运行时破坏 spec，而不是编译时。使用 `mount<typeof Story>` 至少可以在编译时将 props 与 story 关联。
- **每个测试的 JSX 不再有。** 每个测试构建不同 JSX 树的测试变成每个组合一个 story 导出——这正是重点：每个值得测试的组合都值得命名和审查。

## 常见问题

### 如何访问组件的方法或实例？

不建议也不支持在测试代码中访问组件的内部方法或实例。相反，专注于从用户的角度观察和与组件交互——点击它，查看页面，并通过 story 将内部效果记录到 DOM 中。当测试避免实现细节时，它们变得不那么脆弱，更有价值。如果从用户角度运行的测试失败，这很可能意味着自动化测试发现了一个真正的 bug。

### 我可以继续使用我的打包器插件、别名和 CSS 设置吗？

是的——这是设计的核心。gallery 由您自己的开发服务器提供，因此您的应用程序可以渲染的任何东西，您的 stories 也可以渲染。没有需要保持同步的第二个打包器配置。

### 除了 React 和 Vue 之外的框架呢？

让您的编码代理为您的框架实现 gallery 契约：将 story id 解析为组件，渲染到 `#root`，在调用之间重用根以便 `update()` 保留状态。`mount` fixture 不知道也不关心另一端是哪个框架。
