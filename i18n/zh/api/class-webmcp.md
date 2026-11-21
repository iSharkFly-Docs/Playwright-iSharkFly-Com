---
title: WebMCP
outline: 2
---

# WebMCP

<Badge type="info" text="新增于: v1.64" />

[WebMCP](/api/class-webmcp) 暴露了框架通过实验性的 [WebMCP](https://webmachinelearning.github.io/webmcp/) 浏览器 API `navigator.modelContext` 注册的工具。它可以列出工具并调用它们。

实例通过 [`frame.webmcp`](/api/class-frame#frame-webmcp) 访问。[`page.webmcp`](/api/class-page#page-webmcp) 是主框架的实例。

::: info
WebMCP 是一个实验性的浏览器功能。Chromium 通过 `--enable-features=WebMCP` 启动参数启用它，Firefox 通过 `dom.modelcontext.enabled` 和 `dom.modelcontext.testing.enabled` 偏好设置启用。WebKit 未实现此功能。
:::

工具名称、描述、输入模式和结果由页面提供，因此应将它们视为不可信的输入。

```js
const browser = await chromium.launch({ args: ['--enable-features=WebMCP'] });
const page = await browser.newPage();
await page.goto('https://example.com');

for (const tool of await page.webmcp.tools())
  console.log(tool.name, tool.description);

const result = await page.webmcp.callTool('add', { a: 2, b: 40 });
```

## 方法

### webMCP.callTool() {#web-mcp-call-tool}

<Badge type="info" text="新增于: v1.64" /> <Badge type="tip" text="async" />

调用由框架注册的工具并返回其结果。结果是工具的 `execute` 函数解析后的值，通常是一个带有 `content` 数组的对象。带有 `isError: true` 的结果将按原样返回。当工具未注册或其 `execute` 函数抛出异常时，此方法会抛出错误。

```js
const result = await page.webmcp.callTool('add', { a: 2, b: 40 });
console.log(result.content[0].text); // "42"
```

**参数**

- <a id="web-mcp-call-tool-option-name"></a>`name` `string`

  工具的名称，如 [`webMCP.tools()`](/api/class-webmcp#web-mcp-tools) 所报告的。
- <a id="web-mcp-call-tool-option-input"></a>`input` `Serializable` *(可选)*

  工具的输入，需匹配其 `inputSchema`。默认为空对象。
- <a id="web-mcp-call-tool-option-options"></a>`options` `Object` *(可选)*

  - <a id="web-mcp-call-tool-option-timeout"></a>`timeout` `float` *(可选)*

    最大等待时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项更改默认值，或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改。

**返回值**

- `Promise<Serializable>`


### webMCP.tools() {#web-mcp-tools}

<Badge type="info" text="新增于: v1.64" /> <Badge type="tip" text="async" />

返回当前由框架注册的工具。如果浏览器启动时未启用 WebMCP 支持，则会抛出错误，请参阅上述启用它的启动选项。

[`page.webmcp`](/api/class-page#page-webmcp) 仅涵盖主框架，子框架通过各自的 [`frame.webmcp`](/api/class-frame#frame-webmcp) 列出其工具。

**参数**

- <a id="web-mcp-tools-option-options"></a>`options` `Object` *(可选)*

  - <a id="web-mcp-tools-option-timeout"></a>`timeout` `float` *(可选)*

    最大等待时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项更改默认值，或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改。

**返回值**

- `Promise<Array<Object>>`
