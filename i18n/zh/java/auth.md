---
title: "身份认证"
---

# 身份认证

## 简介

Playwright 在称为[浏览器上下文](./browser-contexts.md)的隔离环境中执行测试。这种隔离模型提高了可重复性并防止级联测试失败。测试可以加载现有的已认证状态。这消除了在每个测试中进行身份认证的需要，并加快了测试执行速度。

## 核心概念

无论你选择哪种身份认证策略，你都可能会将已认证的浏览器状态存储在文件系统中。

我们建议创建 `playwright/.auth` 目录并将其添加到 `.gitignore` 中。你的身份认证流程将生成已认证的浏览器状态并将其保存到此 `playwright/.auth` 目录中的文件中。之后，测试将重用此状态并以已认证状态启动。

::: danger
浏览器状态文件可能包含敏感的 cookie 和请求头，可用于冒充你或你的测试账户。
我们强烈建议不要将它们检入私有或公共仓库。
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

## 在每个测试前登录

Playwright API 可以[自动化与登录表单的交互](./input.md)。

以下示例登录 GitHub。一旦执行这些步骤，浏览器上下文将被认证。

```java
Page page = context.newPage();
page.navigate("https://github.com/login");
// 与登录表单交互
page.getByLabel("Username or email address").fill("username");
page.getByLabel("Password").fill("password");
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign in"))
    .click();
// 继续测试
```

为每个测试重新登录可能会减慢测试执行速度。为了缓解这个问题，请重用现有的认证状态。

## 重用已登录状态

Playwright 提供了一种在测试中重用已登录状态的方法。这样你只需登录一次，然后在所有测试中跳过登录步骤。

Web 应用使用基于 cookie 或基于令牌的身份认证，其中已认证状态存储为 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、在 [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) 中、在 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 中，或作为 passkey（[WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) 凭证）。Playwright 提供了 [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state) 方法，可用于从已认证的上下文中检索存储状态，然后使用预填充状态创建新上下文。

Cookie、local storage、IndexedDB 和虚拟 WebAuthn 凭证（passkey）可以跨不同浏览器使用。它们取决于你的应用程序的身份认证模型，可能需要 cookie、local storage、IndexedDB 或 passkey 的某种组合。

以下代码片段从已认证的上下文中检索状态并使用该状态创建新上下文。如果你的应用程序将认证令牌存储在 IndexedDB 中（例如 Firebase Authentication），在保存状态时启用 [`indexedDB`](/java/api/class-browsercontext#browser-context-storage-state-option-indexed-db)。默认情况下，IndexedDB 不包含在快照中。

```java
// 将存储状态保存到文件中。
context.storageState(new BrowserContext.StorageStateOptions().setPath(Paths.get("state.json")));

// 使用保存的存储状态创建新上下文。
BrowserContext context = browser.newContext(
  new Browser.NewContextOptions().setStorageStatePath(Paths.get("state.json")));
```

## 高级场景

### 会话存储

重用已认证状态涵盖了基于 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage)、[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 和 passkey（[WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)）的身份认证。很少情况下，[session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) 用于存储与登录状态相关的信息。Session storage 特定于特定域，并且不会跨页面加载持久化。Playwright 不提供持久化 session storage 的 API，但可以使用以下代码片段来保存/加载 session storage。

```java
// 获取 session storage 并存储为环境变量
String sessionStorage = (String) page.evaluate("JSON.stringify(sessionStorage)");
System.getenv().put("SESSION_STORAGE", sessionStorage);

// 在新上下文中设置 session storage
String sessionStorage = System.getenv("SESSION_STORAGE");
String escapedSessionStorage = sessionStorage.replace("\\", "\\\\").replace("'", "\\'");
context.addInitScript("(storage => {\n" +
  "  if (window.location.hostname === 'example.com') {\n" +
  "    const entries = JSON.parse(storage);\n" +
  "     for (const [key, value] of Object.entries(entries)) {\n" +
  "      window.sessionStorage.setItem(key, value);\n" +
  "    };\n" +
  "  }\n" +
  "})('" + escapedSessionStorage + "')");
```
