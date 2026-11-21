---
title: Credentials
outline: 2
---

# Credentials

<Badge type="info" text="Added in: v1.61" />

`Credentials` is a virtual WebAuthn authenticator scoped to a [BrowserContext](/python/api/class-browsercontext). It lets tests
register passkeys and answer `navigator.credentials.create()` / `navigator.credentials.get()`
ceremonies in the page, without a real authenticator or hardware security key.

There are three common ways to use it:

**Usage: seed a known credential**

::: code-group

```python [Async]
context = await browser.new_context()

# A passkey your backend already provisioned for a test user.
await context.credentials.create(
    "example.com",
    id=known_credential_id,  # base64url
    user_handle=known_user_handle,  # base64url
    private_key=known_private_key,  # base64url PKCS#8 (DER)
    public_key=known_public_key,  # base64url SPKI (DER)
)
await context.credentials.install()

page = await context.new_page()
await page.goto("https://example.com/login")
# The page's navigator.credentials.get() is answered with the seeded passkey.
```

```python [Sync]
context = browser.new_context()

# A passkey your backend already provisioned for a test user.
context.credentials.create(
    "example.com",
    id=known_credential_id,  # base64url
    user_handle=known_user_handle,  # base64url
    private_key=known_private_key,  # base64url PKCS#8 (DER)
    public_key=known_public_key,  # base64url SPKI (DER)
)
context.credentials.install()

page = context.new_page()
page.goto("https://example.com/login")
# The page's navigator.credentials.get() is answered with the seeded passkey.
```

:::

**Usage: capture a credential, then reuse it**

::: code-group

```python [Async]
# setup test: let the app register a passkey, then save it.
context = await browser.new_context()
await context.credentials.install()

page = await context.new_page()
await page.goto("https://example.com/register")
await page.get_by_role("button", name="Create a passkey").click()

# Read back the passkey the page registered — it includes the private key.
[credential] = await context.credentials.get(rp_id="example.com")
with open("playwright/.auth/passkey.json", "w") as f:
    json.dump(credential, f)
```

```python [Sync]
# setup test: let the app register a passkey, then save it.
context = browser.new_context()
context.credentials.install()

page = context.new_page()
page.goto("https://example.com/register")
page.get_by_role("button", name="Create a passkey").click()

# Read back the passkey the page registered — it includes the private key.
[credential] = context.credentials.get(rp_id="example.com")
with open("playwright/.auth/passkey.json", "w") as f:
    json.dump(credential, f)
```

:::

::: code-group

```python [Async]
# later test: seed the captured passkey so the app starts already enrolled.
with open("playwright/.auth/passkey.json") as f:
    credential = json.load(f)
context = await browser.new_context()
await context.credentials.create(
    credential["rpId"],
    id=credential["id"],
    user_handle=credential["userHandle"],
    private_key=credential["privateKey"],
    public_key=credential["publicKey"],
    sign_count=credential["signCount"],
)
await context.credentials.install()

page = await context.new_page()
await page.goto("https://example.com/login")
# navigator.credentials.get() resolves the captured passkey — already signed in.
```

```python [Sync]
# later test: seed the captured passkey so the app starts already enrolled.
with open("playwright/.auth/passkey.json") as f:
    credential = json.load(f)
context = browser.new_context()
context.credentials.create(
    credential["rpId"],
    id=credential["id"],
    user_handle=credential["userHandle"],
    private_key=credential["privateKey"],
    public_key=credential["publicKey"],
    sign_count=credential["signCount"],
)
context.credentials.install()

page = context.new_page()
page.goto("https://example.com/login")
# navigator.credentials.get() resolves the captured passkey — already signed in.
```

:::

**Usage: save credentials in the storage state, restore later**

See [authentication guide](../auth.md) for examples of using saving and restoring the storage state.

**Defaults**

## Methods

### credentials.create() {#credentials-create}

<Badge type="info" text="Added in: v1.61" />

Seeds a virtual WebAuthn credential and returns it.

With only [`rp_id`](/python/api/class-credentials#credentials-create-option-rp-id), generates a fresh **ECDSA P-256** keypair, credential id and user handle. The
seeded credential is discoverable (resident), so the page can resolve it from both
username-then-passkey and usernameless passkey flows. The returned object carries the private and public keys, so it can be persisted to disk and re-seeded in a later test.

To **import a known credential**, supply all four of [`id`](/python/api/class-credentials#credentials-create-option-id), [`user_handle`](/python/api/class-credentials#credentials-create-option-user-handle), [`private_key`](/python/api/class-credentials#credentials-create-option-private-key) and
[`public_key`](/python/api/class-credentials#credentials-create-option-public-key) together. Pass [`sign_count`](/python/api/class-credentials#credentials-create-option-sign-count) as well to continue from the
signature counter the relying party has already seen.

Call [`credentials.install()`](/python/api/class-credentials#credentials-install) before navigating to a page that uses WebAuthn.

**Arguments**

- <a id="credentials-create-option-rp-id"></a>`rp_id` `string`

  Relying party id (typically the site's effective domain).
- <a id="credentials-create-option-options"></a>`options` `Object` *(optional)*

  - <a id="credentials-create-option-id"></a>`id` `string` *(optional)*

    Base64url-encoded credential id. Auto-generated if omitted.
  - <a id="credentials-create-option-private-key"></a>`private_key` `string` *(optional)*

    Base64url-encoded PKCS#8 (DER) private key. Auto-generated if omitted.
  - <a id="credentials-create-option-public-key"></a>`public_key` `string` *(optional)*

    Base64url-encoded SPKI (DER) public key. Auto-generated if omitted.
  - <a id="credentials-create-option-sign-count"></a>`sign_count` `int` *(optional)* <Badge type="info" text="Added in: v1.64" />

    Initial value of the [signature counter](https://www.w3.org/TR/webauthn-2/#signature-counter). The counter is incremented by one on
    every successful `navigator.credentials.get()` assertion, so the first assertion reports `signCount + 1`. Defaults to `0`.
  - <a id="credentials-create-option-user-handle"></a>`user_handle` `string` *(optional)*

    Base64url-encoded user handle. Auto-generated if omitted.

**Returns**

- `Object`


### credentials.delete() {#credentials-delete}

<Badge type="info" text="Added in: v1.61" />

Removes a credential from the authenticator by its id. Works for any credential currently held —
both those seeded with [`credentials.create()`](/python/api/class-credentials#credentials-create) and those the page registered itself by
calling `navigator.credentials.create()`.

**Arguments**

- <a id="credentials-delete-option-id"></a>`id` `string`

  Base64url-encoded credential id.


### credentials.get() {#credentials-get}

<Badge type="info" text="Added in: v1.61" />

Returns every credential currently held by the authenticator, optionally filtered by [`rp_id`](/python/api/class-credentials#credentials-get-option-rp-id) or
[`id`](/python/api/class-credentials#credentials-get-option-id). This includes both credentials seeded with [`credentials.create()`](/python/api/class-credentials#credentials-create) and credentials
the page registered itself by calling `navigator.credentials.create()`.

Each returned credential includes its private and public keys and the current signature counter, so a passkey the app just
registered can be saved and re-seeded into a later test with [`credentials.create()`](/python/api/class-credentials#credentials-create) — see the second example in the class overview.

**Arguments**

- <a id="credentials-get-option-options"></a>`options` `Object` *(optional)*

  - <a id="credentials-get-option-id"></a>`id` `string` *(optional)*

    Only return the credential with this base64url-encoded id.
  - <a id="credentials-get-option-rp-id"></a>`rp_id` `string` *(optional)*

    Only return credentials for this relying party id.

**Returns**

- `Array<Object>`


### credentials.install() {#credentials-install}

<Badge type="info" text="Added in: v1.61" />

Installs the virtual WebAuthn authenticator into the context, overriding
`navigator.credentials.create()` and `navigator.credentials.get()` in all current
and future pages. Call this before the page first touches `navigator.credentials`.

Required: until [`credentials.install()`](/python/api/class-credentials#credentials-install) is called, no interception is in place and the page sees
the platform's native (or absent) WebAuthn behaviour. Seeding credentials with
[`credentials.create()`](/python/api/class-credentials#credentials-create) without installing populates the authenticator, but the
page will never see those credentials.

