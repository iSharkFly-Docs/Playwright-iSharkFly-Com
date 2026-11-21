---
title: "身份认证"
---

# 身份认证

## 简介

Playwright 在称为[浏览器上下文](./browser-contexts.md)的隔离环境中执行测试。这种隔离模型提高了可重现性并防止级联测试失败。测试可以加载现有的已认证状态。这消除了在每个测试中进行身份认证的需要，并加快了测试执行速度。

## 核心概念

无论你选择哪种身份认证策略，你可能都会在文件系统上存储已认证的浏览器状态。

我们建议创建 `playwright/.auth` 目录并将其添加到你的 `.gitignore`。你的身份认证例程将生成已认证的浏览器状态并将其保存到此 `playwright/.auth` 目录中的文件。之后，测试将重用此状态并在已认证的状态下启动。

::: danger
浏览器状态文件可能包含敏感的 cookie 和头信息，可用于冒充你或你的测试账户。
我们强烈建议不要将它们提交到私有或公共仓库。
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

## 每次测试前登录

Playwright API 可以[自动与登录表单交互](./input.md)。

以下示例登录 GitHub。一旦这些步骤执行完毕，浏览器上下文将被认证。

::: code-group

```python [Async]
page = await context.new_page()
await page.goto('https://github.com/login')

# 与登录表单交互
await page.get_by_label("Username or email address").fill("username")
await page.get_by_label("Password").fill("password")
await page.get_by_role("button", name="Sign in").click()
# 继续测试
```

```python [Sync]
page = context.new_page()
page.goto('https://github.com/login')

# 与登录表单交互
page.get_by_label("Username or email address").fill("username")
page.get_by_label("Password").fill("password")
page.get_by_role("button", name="Sign in").click()
# 继续测试
```

:::

为每个测试重新登录会减慢测试执行速度。为了缓解这个问题，请重用现有的身份认证状态。

## 重用已登录状态

Playwright 提供了一种在测试中重用已登录状态的方法。这样你只需登录一次，然后在所有测试中跳过登录步骤。

Web 应用程序使用基于 cookie 或基于令牌的身份认证，其中已认证的状态存储为 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、在 [本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Storage)、在 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 或作为密钥（[WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) 凭据）。Playwright 提供 [`browser_context.storage_state()`](/python/api/class-browsercontext#browser-context-storage-state) 方法，可用于从已认证的上下文检索存储状态，然后创建预填充状态的新上下文。

Cookie、本地存储、IndexedDB 和虚拟 WebAuthn 凭据（密钥）可以跨不同浏览器使用。它们取决于你的应用程序的身份认证模型，可能需要 cookie、本地存储、IndexedDB 或密钥的某种组合。

以下代码片段从已认证的上下文检索状态并创建具有该状态的新上下文。如果你的应用程序在 IndexedDB 中存储身份认证令牌，例如 Firebase 身份认证，请在保存状态时启用 [`indexed_db`](/python/api/class-browsercontext#browser-context-storage-state-option-indexed-db)。默认情况下，IndexedDB 不包含在快照中。

::: code-group

```python [Async]
# 将存储状态保存到文件。
storage = await context.storage_state(path="state.json")

# 使用保存的存储状态创建新上下文。
context = await browser.new_context(storage_state="state.json")
```

```python [Sync]
# 将存储状态保存到文件。
storage = context.storage_state(path="state.json")

# 使用保存的存储状态创建新上下文。
context = browser.new_context(storage_state="state.json")
```

:::

## 高级场景

### 会话存储

重用已认证状态涵盖了基于 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Storage)、[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 和密钥（[WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)）的身份认证。很少情况下，[会话存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)用于存储与已登录状态相关的信息。会话存储特定于特定域，并且不会跨页面加载持久化。Playwright 不提供 API 来持久化会话存储，但以下代码片段可用于保存/加载会话存储。

::: code-group

```python [Async]
import os
# 获取会话存储并存储为环境变量
session_storage = await page.evaluate("() => JSON.stringify(sessionStorage)")
os.environ["SESSION_STORAGE"] = session_storage

# 在新上下文中设置会话存储
session_storage = os.environ["SESSION_STORAGE"]
escaped_session_storage = session_storage.replace("\\", "\\\\").replace("'", "\\'")
await context.add_init_script("""(storage => {
  if (window.location.hostname === 'example.com') {
    const entries = JSON.parse(storage)
    for (const [key, value] of Object.entries(entries)) {
      window.sessionStorage.setItem(key, value)
    }
  }
})('""" + escaped_session_storage + "')")
```

```python [Sync]
import os
# 获取会话存储并存储为环境变量
session_storage = page.evaluate("() => JSON.stringify(sessionStorage)")
os.environ["SESSION_STORAGE"] = session_storage

# 在新上下文中设置会话存储
session_storage = os.environ["SESSION_STORAGE"]
escaped_session_storage = session_storage.replace("\\", "\\\\").replace("'", "\\'")
context.add_init_script("""(storage => {
  if (window.location.hostname === 'example.com') {
    const entries = JSON.parse(storage)
    for (const [key, value] of Object.entries(entries)) {
      window.sessionStorage.setItem(key, value)
    }
  }
})('""" + escaped_session_storage + "')")
```

:::
