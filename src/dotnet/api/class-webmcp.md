---
title: WebMCP
outline: 2
---

# WebMCP

<Badge type="info" text="Added in: v1.64" />

[WebMCP](/dotnet/api/class-webmcp) exposes the tools that a frame registers through the experimental [WebMCP](https://webmachinelearning.github.io/webmcp/) browser API, `navigator.modelContext`. It lists the tools and calls them.

Instances are accessed through [`Frame.Webmcp`](/dotnet/api/class-frame#frame-webmcp). [`Page.Webmcp`](/dotnet/api/class-page#page-webmcp) is the instance of the main frame.

::: info
WebMCP is an experimental browser feature. Chromium enables it with the `--enable-features=WebMCP` launch argument, Firefox with the `dom.modelcontext.enabled` and `dom.modelcontext.testing.enabled` preferences. WebKit does not implement it.
:::

Tool names, descriptions, input schemas and results are provided by the page, so treat them as untrusted input.

## Methods

### WebMCP.CallToolAsync() {#web-mcp-call-tool}

<Badge type="info" text="Added in: v1.64" />

Calls a tool registered by the frame and returns its result. The result is whatever the tool's `execute` function resolved to, typically an object with a `content` array. A result with `isError: true` is returned as is. The method throws when the tool is not registered or its `execute` function throws.

**Arguments**

- <a id="web-mcp-call-tool-option-name"></a>`name` `string`

  Name of the tool, as reported by [`WebMCP.ToolsAsync()`](/dotnet/api/class-webmcp#web-mcp-tools).
- <a id="web-mcp-call-tool-option-input"></a>`input` `Serializable` *(optional)*

  Input for the tool, matching its `inputSchema`. Defaults to an empty object.
- <a id="web-mcp-call-tool-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-mcp-call-tool-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Serializable`


### WebMCP.ToolsAsync() {#web-mcp-tools}

<Badge type="info" text="Added in: v1.64" />

Returns the tools currently registered by the frame. Throws if the browser was launched without WebMCP support, see the note above for the launch options that enable it.

[`Page.Webmcp`](/dotnet/api/class-page#page-webmcp) covers the main frame only, child frames list their tools through their own [`Frame.Webmcp`](/dotnet/api/class-frame#frame-webmcp).

**Arguments**

- <a id="web-mcp-tools-option-options"></a>`options` `Object` *(optional)*

  - <a id="web-mcp-tools-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Array<Object>`

