---
title: "认证"
---

# 认证

## 简介

Playwright 在称为[浏览器上下文](./browser-contexts.md)的隔离环境中执行测试。这种隔离模型提高了可重现性并防止级联测试失败。测试可以加载现有的已认证状态。这消除了在每个测试中进行认证的需要，并加速了测试执行。

## 核心概念

无论你选择哪种认证策略，你都可能将已认证的浏览器状态存储在文件系统中。

我们建议创建 `playwright/.auth` 目录并将其添加到 `.gitignore` 中。你的认证例程将生成已认证的浏览器状态并将其保存到此 `playwright/.auth` 目录中的文件中。稍后，测试将重用此状态并以已认证状态启动。

::: danger
浏览器状态文件可能包含敏感的 cookie 和头信息，可用于冒充你或你的测试帐户。
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

## 在每个测试之前登录

Playwright API 可以[自动化与登录表单的交互](./input.md)。

以下示例登录 GitHub。一旦执行这些步骤，浏览器上下文将被认证。

```csharp
var page = await context.NewPageAsync();
await page.GotoAsync("https://github.com/login");
// 与登录表单交互
await page.GetByLabel("Username or email address").FillAsync("username");
await page.GetByLabel("Password").FillAsync("password");
await page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();
// 继续测试
```

为每个测试重复登录可能会减慢测试执行速度。为了缓解这个问题，请重用现有的认证状态。

## 重用已登录状态

Playwright 提供了一种在测试中重用已登录状态的方法。这样你只需登录一次，然后在所有测试中跳过登录步骤。

Web 应用程序使用基于 cookie 或基于令牌的认证，其中已认证状态存储为 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、在[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Storage)中、在 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 中，或作为密钥（[WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) 凭据）。Playwright 提供 [`BrowserContext.StorageStateAsync()`](/dotnet/api/class-browsercontext#browser-context-storage-state) 方法，可用于从已认证的上下文中检索存储状态，然后创建具有预填充状态的新上下文。

Cookie、本地存储、IndexedDB 和虚拟 WebAuthn 凭据（密钥）可以跨不同浏览器使用。它们取决于你的应用程序的认证模型，可能需要 cookie、本地存储、IndexedDB 或密钥的某种组合。

以下代码片段从已认证的上下文中检索状态并创建具有该状态的新上下文。如果你的应用程序将认证令牌存储在 IndexedDB 中（如 Firebase Authentication），请在保存状态时启用 [`indexedDB`](/dotnet/api/class-browsercontext#browser-context-storage-state-option-indexed-db)。默认情况下，IndexedDB 不包含在快照中。

```csharp
// 将存储状态保存到文件中。
// 测试在 <TestProject>\bin\Debug\netX.0\ 中执行，因此使用相对路径来引用在项目根目录中创建的 playwright/.auth
await context.StorageStateAsync(new()
{
    Path = "../../../playwright/.auth/state.json"
});

// 使用保存的存储状态创建新上下文。
var context = await browser.NewContextAsync(new()
{
    StorageStatePath = "../../../playwright/.auth/state.json"
});
```

## 高级场景

### 会话存储

重用已认证状态涵盖 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Storage)、[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 和密钥（[WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)）基于的认证。很少情况下，[会话存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)用于存储与已登录状态相关的信息。会话存储特定于特定域，不会在页面加载之间持久化。Playwright 不提供持久化会话存储的 API，但可以使用以下代码片段来保存/加载会话存储。

```csharp
// 获取会话存储并存储为环境变量
var sessionStorage = await page.EvaluateAsync<string>("() => JSON.stringify(sessionStorage)");
Environment.SetEnvironmentVariable("SESSION_STORAGE", sessionStorage);

// 在新上下文中设置会话存储
var loadedSessionStorage = Environment.GetEnvironmentVariable("SESSION_STORAGE");
var escapedSessionStorage = loadedSessionStorage.Replace("\\", "\\\\").Replace("'", "\\'");
await context.AddInitScriptAsync(@"(storage => {
    if (window.location.hostname === 'example.com') {
      const entries = JSON.parse(storage);
      for (const [key, value] of Object.entries(entries)) {
        window.sessionStorage.setItem(key, value);
      }
    }
  })('" + escapedSessionStorage + "')");
```
