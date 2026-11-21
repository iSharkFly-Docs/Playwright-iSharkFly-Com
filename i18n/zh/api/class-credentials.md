---
title: Credentials
outline: 2
---

# Credentials

<Badge type="info" text="添加于: v1.61" />

`Credentials` 是一个作用域为 [BrowserContext](/api/class-browsercontext) 的虚拟 WebAuthn 认证器。它允许测试注册通行密钥（passkeys）并响应页面中的 `navigator.credentials.create()` / `navigator.credentials.get()` 仪式，无需真实的认证器或硬件安全密钥。

有三种常见的使用方式：

**用法：预置已知凭据**

```js
const context = await browser.newContext();

// 后端已为测试用户预配的通行密钥。
await context.credentials.create('example.com', {
  id: knownCredentialId, // base64url
  userHandle: knownUserHandle, // base64url
  privateKey: knownPrivateKey, // base64url PKCS#8 (DER)
  publicKey: knownPublicKey, // base64url SPKI (DER)
});
await context.credentials.install();

const page = await context.newPage();
await page.goto('https://example.com/login');
// 页面的 navigator.credentials.get() 会使用预置的通行密钥进行响应。
```

**用法：捕获凭据，然后复用**

```js
// 设置测试：让应用注册一个通行密钥，然后保存包含它的存储状态。
const context = await browser.newContext();
await context.credentials.install();

const page = await context.newPage();
await page.goto('https://example.com/register');
await page.getByRole('button', { name: 'Create a passkey' }).click();

// 读回页面注册的通行密钥 — 它包含私钥。
const [credential] = await context.credentials.get({ rpId: 'example.com' });
fs.writeFileSync('playwright/.auth/passkey.json', JSON.stringify(credential));
```

```js
// 后续测试：预置捕获的通行密钥，这样应用启动时就已经注册好了。
const credential = JSON.parse(fs.readFileSync('playwright/.auth/passkey.json', 'utf8'));
const context = await browser.newContext();
await context.credentials.create(credential.rpId, credential);
await context.credentials.install();

const page = await context.newPage();
await page.goto('https://example.com/login');
// navigator.credentials.get() 解析捕获的通行密钥 — 已经登录。
```

**用法：在存储状态中保存凭据，稍后恢复**

有关保存和恢复存储状态的示例，请参阅[认证指南](../auth.md)。

**默认值**

## 方法

### credentials.create() {#credentials-create}

<Badge type="info" text="添加于: v1.61" /> <Badge type="tip" text="异步" />

预置一个虚拟 WebAuthn 凭据并返回它。

仅提供 [`rpId`](/api/class-credentials#credentials-create-option-rp-id) 时，会生成一个新的 **ECDSA P-256** 密钥对、凭据 id 和用户句柄。预置的凭据是可发现的（驻留式），因此页面可以在先输入用户名再使用通行密钥和无用户名通行密钥两种流程中解析它。返回的对象携带私钥和公钥，因此可以持久化到磁盘并在后续测试中重新预置。

要**导入已知凭据**，请同时提供 [`id`](/api/class-credentials#credentials-create-option-id)、[`userHandle`](/api/class-credentials#credentials-create-option-user-handle)、[`privateKey`](/api/class-credentials#credentials-create-option-private-key) 和 [`publicKey`](/api/class-credentials#credentials-create-option-public-key)。同时传递 [`signCount`](/api/class-credentials#credentials-create-option-sign-count) 以从依赖方已经看到的签名计数器继续。

在导航到使用 WebAuthn 的页面之前调用 [`credentials.install()`](/api/class-credentials#credentials-install)。

**参数**

- <a id="credentials-create-option-rp-id"></a>`rpId` `string`

  依赖方 id（通常是站点的有效域名）。
- <a id="credentials-create-option-options"></a>`options` `Object` *(可选)*

  - <a id="credentials-create-option-id"></a>`id` `string` *(可选)*

    Base64url 编码的凭据 id。如果省略则自动生成。
  - <a id="credentials-create-option-private-key"></a>`privateKey` `string` *(可选)*

    Base64url 编码的 PKCS#8 (DER) 私钥。如果省略则自动生成。
  - <a id="credentials-create-option-public-key"></a>`publicKey` `string` *(可选)*

    Base64url 编码的 SPKI (DER) 公钥。如果省略则自动生成。
  - <a id="credentials-create-option-sign-count"></a>`signCount` `int` *(可选)* <Badge type="info" text="添加于: v1.64" />

    [签名计数器](https://www.w3.org/TR/webauthn-2/#signature-counter)的初始值。每次成功的 `navigator.credentials.get()` 断言时计数器加一，因此第一次断言报告 `signCount + 1`。默认为 `0`。
  - <a id="credentials-create-option-user-handle"></a>`userHandle` `string` *(可选)*

    Base64url 编码的用户句柄。如果省略则自动生成。

**返回值**

- `Promise<Object>`


### credentials.delete() {#credentials-delete}

<Badge type="info" text="添加于: v1.61" /> <Badge type="tip" text="异步" />

通过凭据 id 从认证器中删除凭据。适用于当前持有的任何凭据 — 包括通过 [`credentials.create()`](/api/class-credentials#credentials-create) 预置的凭据和页面通过调用 `navigator.credentials.create()` 自己注册的凭据。

**参数**

- <a id="credentials-delete-option-id"></a>`id` `string`

  Base64url 编码的凭据 id。


### credentials.get() {#credentials-get}

<Badge type="info" text="添加于: v1.61" /> <Badge type="tip" text="异步" />

返回认证器当前持有的所有凭据，可选择按 [`rpId`](/api/class-credentials#credentials-get-option-rp-id) 或 [`id`](/api/class-credentials#credentials-get-option-id) 过滤。这包括通过 [`credentials.create()`](/api/class-credentials#credentials-create) 预置的凭据和页面通过调用 `navigator.credentials.create()` 自己注册的凭据。

每个返回的凭据包含其私钥、公钥和当前签名计数器，因此应用刚刚注册的通行密钥可以被保存并通过 [`credentials.create()`](/api/class-credentials#credentials-create) 重新预置到后续测试中 — 请参阅类概述中的第二个示例。

**参数**

- <a id="credentials-get-option-options"></a>`options` `Object` *(可选)*

  - <a id="credentials-get-option-id"></a>`id` `string` *(可选)*

    仅返回具有此 base64url 编码 id 的凭据。
  - <a id="credentials-get-option-rp-id"></a>`rpId` `string` *(可选)*

    仅返回此依赖方 id 的凭据。

**返回值**

- `Promise<Array<Object>>`


### credentials.install() {#credentials-install}

<Badge type="info" text="添加于: v1.61" /> <Badge type="tip" text="异步" />

将虚拟 WebAuthn 认证器安装到上下文中，覆盖所有当前和未来页面中的 `navigator.credentials.create()` 和 `navigator.credentials.get()`。在页面首次接触 `navigator.credentials` 之前调用此方法。

必需：在调用 [`credentials.install()`](/api/class-credentials#credentials-install) 之前，不会进行任何拦截，页面会看到平台的原生（或缺失的）WebAuthn 行为。使用 [`credentials.create()`](/api/class-credentials#credentials-create) 预置凭据但不安装会填充认证器，但页面永远不会看到这些凭据。
