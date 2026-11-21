---
title: Credentials
outline: 2
---

# Credentials

<Badge type="info" text="Added in: v1.61" />

`Credentials` is a virtual WebAuthn authenticator scoped to a [BrowserContext](/java/api/class-browsercontext). It lets tests
register passkeys and answer `navigator.credentials.create()` / `navigator.credentials.get()`
ceremonies in the page, without a real authenticator or hardware security key.

There are three common ways to use it:

**Usage: seed a known credential**

```java
BrowserContext context = browser.newContext();

// A passkey your backend already provisioned for a test user.
context.credentials().create("example.com", new Credentials.CreateOptions()
    .setId(knownCredentialId) // base64url
    .setUserHandle(knownUserHandle) // base64url
    .setPrivateKey(knownPrivateKey) // base64url PKCS#8 (DER)
    .setPublicKey(knownPublicKey)); // base64url SPKI (DER)
context.credentials().install();

Page page = context.newPage();
page.navigate("https://example.com/login");
// The page's navigator.credentials.get() is answered with the seeded passkey.
```

**Usage: capture a credential, then reuse it**

```java
// setup test: let the app register a passkey, then save it.
BrowserContext context = browser.newContext();
context.credentials().install();

Page page = context.newPage();
page.navigate("https://example.com/register");
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Create a passkey")).click();

// Read back the passkey the page registered — it includes the private key.
VirtualCredential credential = context.credentials().get(
    new Credentials.GetOptions().setRpId("example.com")).get(0);
Files.writeString(Paths.get("playwright/.auth/passkey.json"), new Gson().toJson(credential));
```

```java
// later test: seed the captured passkey so the app starts already enrolled.
VirtualCredential credential = new Gson().fromJson(
    Files.readString(Paths.get("playwright/.auth/passkey.json")), VirtualCredential.class);
BrowserContext context = browser.newContext();
context.credentials().create(credential.rpId, new Credentials.CreateOptions()
    .setId(credential.id)
    .setUserHandle(credential.userHandle)
    .setPrivateKey(credential.privateKey)
    .setPublicKey(credential.publicKey)
    .setSignCount(credential.signCount));
context.credentials().install();

Page page = context.newPage();
page.navigate("https://example.com/login");
// navigator.credentials.get() resolves the captured passkey — already signed in.
```

**Usage: save credentials in the storage state, restore later**

See [authentication guide](../auth.md) for examples of using saving and restoring the storage state.

**Defaults**

## Methods

### credentials.create() {#credentials-create}

<Badge type="info" text="Added in: v1.61" />

Seeds a virtual WebAuthn credential and returns it.

With only [`rpId`](/java/api/class-credentials#credentials-create-option-rp-id), generates a fresh **ECDSA P-256** keypair, credential id and user handle. The
seeded credential is discoverable (resident), so the page can resolve it from both
username-then-passkey and usernameless passkey flows. The returned object carries the private and public keys, so it can be persisted to disk and re-seeded in a later test.

To **import a known credential**, supply all four of [`id`](/java/api/class-credentials#credentials-create-option-id), [`userHandle`](/java/api/class-credentials#credentials-create-option-user-handle), [`privateKey`](/java/api/class-credentials#credentials-create-option-private-key) and
[`publicKey`](/java/api/class-credentials#credentials-create-option-public-key) together. Pass [`signCount`](/java/api/class-credentials#credentials-create-option-sign-count) as well to continue from the
signature counter the relying party has already seen.

Call [`credentials.install()`](/java/api/class-credentials#credentials-install) before navigating to a page that uses WebAuthn.

**Arguments**

- <a id="credentials-create-option-rp-id"></a>`rpId` `string`

  Relying party id (typically the site's effective domain).
- <a id="credentials-create-option-options"></a>`options` `Object` *(optional)*

  - <a id="credentials-create-option-id"></a>`id` `string` *(optional)*

    Base64url-encoded credential id. Auto-generated if omitted.
  - <a id="credentials-create-option-private-key"></a>`privateKey` `string` *(optional)*

    Base64url-encoded PKCS#8 (DER) private key. Auto-generated if omitted.
  - <a id="credentials-create-option-public-key"></a>`publicKey` `string` *(optional)*

    Base64url-encoded SPKI (DER) public key. Auto-generated if omitted.
  - <a id="credentials-create-option-sign-count"></a>`signCount` `int` *(optional)* <Badge type="info" text="Added in: v1.64" />

    Initial value of the [signature counter](https://www.w3.org/TR/webauthn-2/#signature-counter). The counter is incremented by one on
    every successful `navigator.credentials.get()` assertion, so the first assertion reports `signCount + 1`. Defaults to `0`.
  - <a id="credentials-create-option-user-handle"></a>`userHandle` `string` *(optional)*

    Base64url-encoded user handle. Auto-generated if omitted.

**Returns**

- `Object`


### credentials.delete() {#credentials-delete}

<Badge type="info" text="Added in: v1.61" />

Removes a credential from the authenticator by its id. Works for any credential currently held —
both those seeded with [`credentials.create()`](/java/api/class-credentials#credentials-create) and those the page registered itself by
calling `navigator.credentials.create()`.

**Arguments**

- <a id="credentials-delete-option-id"></a>`id` `string`

  Base64url-encoded credential id.


### credentials.get() {#credentials-get}

<Badge type="info" text="Added in: v1.61" />

Returns every credential currently held by the authenticator, optionally filtered by [`rpId`](/java/api/class-credentials#credentials-get-option-rp-id) or
[`id`](/java/api/class-credentials#credentials-get-option-id). This includes both credentials seeded with [`credentials.create()`](/java/api/class-credentials#credentials-create) and credentials
the page registered itself by calling `navigator.credentials.create()`.

Each returned credential includes its private and public keys and the current signature counter, so a passkey the app just
registered can be saved and re-seeded into a later test with [`credentials.create()`](/java/api/class-credentials#credentials-create) — see the second example in the class overview.

**Arguments**

- <a id="credentials-get-option-options"></a>`options` `Object` *(optional)*

  - <a id="credentials-get-option-id"></a>`id` `string` *(optional)*

    Only return the credential with this base64url-encoded id.
  - <a id="credentials-get-option-rp-id"></a>`rpId` `string` *(optional)*

    Only return credentials for this relying party id.

**Returns**

- `Array<Object>`


### credentials.install() {#credentials-install}

<Badge type="info" text="Added in: v1.61" />

Installs the virtual WebAuthn authenticator into the context, overriding
`navigator.credentials.create()` and `navigator.credentials.get()` in all current
and future pages. Call this before the page first touches `navigator.credentials`.

Required: until [`credentials.install()`](/java/api/class-credentials#credentials-install) is called, no interception is in place and the page sees
the platform's native (or absent) WebAuthn behaviour. Seeding credentials with
[`credentials.create()`](/java/api/class-credentials#credentials-create) without installing populates the authenticator, but the
page will never see those credentials.

