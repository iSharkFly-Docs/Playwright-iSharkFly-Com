---
title: "Authentication"
---

# Authentication

## Introduction

Playwright executes tests in isolated environments called [browser contexts](./browser-contexts.md). This isolation model improves reproducibility and prevents cascading test failures. Tests can load existing authenticated state. This eliminates the need to authenticate in every test and speeds up test execution.

## Core concepts

Regardless of the authentication strategy you choose, you are likely to store authenticated browser state on the file system.

We recommend to create `playwright/.auth` directory and add it to your `.gitignore`. Your authentication routine will produce authenticated browser state and save it to a file in this `playwright/.auth` directory. Later on, tests will reuse this state and start already authenticated.

::: danger
The browser state file may contain sensitive cookies and headers that could be used to impersonate you or your test account.
We strongly discourage checking them into private or public repositories.
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

## Signing in before each test

The Playwright API can [automate interaction](./input.md) with a login form.

The following example logs into GitHub. Once these steps are executed,
the browser context will be authenticated.

```java
Page page = context.newPage();
page.navigate("https://github.com/login");
// Interact with login form
page.getByLabel("Username or email address").fill("username");
page.getByLabel("Password").fill("password");
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign in"))
    .click();
// Continue with the test
```

Redoing login for every test can slow down test execution. To mitigate that, reuse
existing authentication state instead.

## Reusing signed in state

Playwright provides a way to reuse the signed-in state in the tests. That way you can log
in only once and then skip the log in step for all of the tests.

Web apps use cookie-based or token-based authentication, where authenticated state is stored as [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), in [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage), in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), or as passkeys ([WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) credentials). Playwright provides [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state) method that can be used to retrieve storage state from authenticated contexts and then create new contexts with prepopulated state.

Cookies, local storage, IndexedDB and virtual WebAuthn credentials (passkeys) can be used across different browsers. They depend on your application's authentication model which may require some combination of cookies, local storage, IndexedDB or passkeys.

The following code snippet retrieves state from an authenticated context and creates a new context with that state. If your application stores authentication tokens in IndexedDB, such as Firebase Authentication, enable [`indexedDB`](/java/api/class-browsercontext#browser-context-storage-state-option-indexed-db) when saving the state. IndexedDB is not included in the snapshot by default.

```java
// Save storage state into the file.
context.storageState(new BrowserContext.StorageStateOptions().setPath(Paths.get("state.json")));

// Create a new context with the saved storage state.
BrowserContext context = browser.newContext(
  new Browser.NewContextOptions().setStorageStatePath(Paths.get("state.json")));
```

## Advanced scenarios

### Session storage

Reusing authenticated state covers [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) and passkey ([WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)) based authentication. Rarely, [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) is used for storing information associated with the signed-in state. Session storage is specific to a particular domain and is not persisted across page loads. Playwright does not provide API to persist session storage, but the following snippet can be used to save/load session storage.

```java
// Get session storage and store as env variable
String sessionStorage = (String) page.evaluate("JSON.stringify(sessionStorage)");
System.getenv().put("SESSION_STORAGE", sessionStorage);

// Set session storage in a new context
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
