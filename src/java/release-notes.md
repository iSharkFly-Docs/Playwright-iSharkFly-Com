---
title: "Release notes"
---

# Release notes

import LiteYouTube from '@site/src/components/LiteYouTube';

## Version 1.65

### 🧾 Locator code in Java

A locator from [`locator.normalize()`](/java/api/class-locator#locator-normalize) now converts to a string as Java code. Use it with [`page.getByRef()`](/java/api/class-page#page-get-by-ref) to turn an element that an agent picks from a [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) in the `"ai"` mode into code for your test:

```java
Locator normalized = page.getByRef("e2").normalize();
System.out.println(normalized.toString());
// getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit"))
```

### New APIs
- New option [`timeout`](/java/api/class-cdpsession#cdp-session-send-option-timeout) in [`cdpSession.send()`](/java/api/class-cdpsession#cdp-session-send).

### Breaking Changes ⚠️
- Actions such as [`locator.click()`](/java/api/class-locator#locator-click), [`locator.check()`](/java/api/class-locator#locator-check), [`locator.tap()`](/java/api/class-locator#locator-tap), [`locator.fill()`](/java/api/class-locator#locator-fill), [`locator.clear()`](/java/api/class-locator#locator-clear) and [`locator.selectOption()`](/java/api/class-locator#locator-select-option) now wait for the element to be [not inert](./actionability.md#not-inert). An action on an element with the `inert` attribute, or inside such an element, now times out if the element stays inert.
- Cookie matching now follows RFC 6265. With a URL, [`browserContext.cookies()`](/java/api/class-browsercontext#browser-context-cookies) and [`apiRequestContext.cookies()`](/java/api/class-apirequestcontext#api-request-context-cookies) no longer return host-only cookies for subdomains or `Path=/api` cookies for `/apiv2`, and a `Path=/foo/` cookie does not match `/foo`. [APIRequestContext](/java/api/class-apirequestcontext) sends a cookie without a name as `Cookie: x` instead of `Cookie: =x`, and stores `Set-Cookie: token` as a cookie without a name.
- Proxy credentials are no longer sent to websites. The credentials in the [`proxy`](/java/api/class-browsertype#browser-type-launch-option-proxy) option now answer only proxy challenges. To authenticate on a website, use [`httpCredentials`](/java/api/class-browser#browser-new-context-option-http-credentials).
- Text that the browser does not render, such as text that is not assigned to a slot or text directly inside a closed `<details>`, is no longer part of accessible names and aria snapshots. This can change the results of [`page.getByRole()`](/java/api/class-page#page-get-by-role) with a name, [`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot) and [`locatorAssertions.matchesAriaSnapshot()`](/java/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot).

### Browser Versions
- Chromium 158.0.8127.18
- Mozilla Firefox 159.0
- WebKit 27.2

This version was also tested against the following stable channels:
- Google Chrome 157
- Microsoft Edge 156

## Version 1.64

### 🧰 WebMCP

New [`page.webmcp()`](/java/api/class-page#page-webmcp) and [`frame.webmcp()`](/java/api/class-frame#frame-webmcp) give access to the tools that a page registers through
the experimental [WebMCP](https://webmachinelearning.github.io/webmcp/) browser API, so you can test them like
any other part of your app:

```java
Browser browser = chromium.launch(new BrowserType.LaunchOptions()
    .setArgs(Arrays.asList("--enable-features=WebMCP")));
Page page = browser.newPage();
page.navigate("https://example.com");

for (WebMCPTool tool : page.webmcp().tools())
  System.out.println(tool.name + ": " + tool.description);

Object result = page.webmcp().callTool("add", Map.of("a", 2, "b", 40));
System.out.println(result); // {content=[{type=text, text=42}]}
```

[Playwright MCP](https://playwright.dev/mcp/introduction) also supports WebMCP by default, with page-defined tools offered to the agent as `webmcp_<tool>`. Pass `--no-webmcp` to opt out.

[`playwright-cli`](https://playwright.dev/agent-cli/introduction) exposes them as well:

```bash
playwright-cli webmcp-list
playwright-cli webmcp-call search_catalog --params '{"query":"cats"}'
```

### 🎬 Better videos

Videos can now be recorded at a custom frame rate, and the decorations for actions are styled with plain CSS:

```java
page.screencast().start(new Screencast.StartOptions()
    .setPath(Paths.get("video.webm"))
    .setSize(1920, 1080)
    .setFps(60));
page.screencast().showActions(new Screencast.ShowActionsOptions()
    .setStyle(new ScreencastActionStyle()
        .setPoint("width: 20px; height: 20px; border-radius: 50%; background: red")
        .setHighlight("outline: 2px solid #333; background: rgba(0, 128, 255, .15)")
        .setTitle("font-size: 16px")));
```
- New [`recordVideoFps`](/java/api/class-browser#browser-new-context-option-record-video-fps) option and new [`fps`](/java/api/class-screencast#screencast-start-option-fps) option in
  [`screencast.start()`](/java/api/class-screencast#screencast-start). Firefox and WebKit currently capture up to 25 frames per second.
- New [`style`](/java/api/class-screencast#screencast-show-actions-option-style) option takes CSS declarations for the `point` marker, the target
  `highlight` and the action `title`. It replaces the `fontSize` option, which is now deprecated.
- The cursor stays visible at the last action point, survives navigations and travels along a natural, eased path.
- Videos are encoded with VP9 instead of VP8, which takes less CPU and produces smaller files of the same or better
  quality.
- All video options are also available in [Playwright MCP](https://playwright.dev/mcp/introduction) and [`playwright-cli`](https://playwright.dev/agent-cli/introduction).

### 🪆 Locator.within()

New [`locator.within()`](/java/api/class-locator#locator-within) combines two locators that you already have, reading in the natural order —
"this button, within that dialog":

```java
Locator saveButton = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Save"));
Locator dialog = page.getByTestId("settings-dialog");

saveButton.within(dialog).click();
```

Relative locators such as [`locator.nth()`](/java/api/class-locator#locator-nth) or [`locator.first()`](/java/api/class-locator#locator-first) are resolved inside each parent
separately, which makes column-like queries straightforward:

```java
// The third cell of every row, not the third cell in the table.
Locator thirdColumn = page.getByRole(AriaRole.CELL).nth(2).within(page.getByRole(AriaRole.ROW));
assertThat(thirdColumn).hasText(new String[] {"Apple", "Banana", "Cherry"});
```

### New APIs
- New [`page.getByRef()`](/java/api/class-page#page-get-by-ref) locates an element by its aria ref, such as `e2`, reported by [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) in the `"ai"` mode.
- New option [`includeShadow`](/java/api/class-page#page-content-option-include-shadow) in [`page.content()`](/java/api/class-page#page-content) and [`frame.content()`](/java/api/class-frame#frame-content) serializes open shadow roots as [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html).
- New option [`signCount`](/java/api/class-credentials#credentials-create-option-sign-count) sets the initial signature counter of a virtual credential. [`credentials.create()`](/java/api/class-credentials#credentials-create) and [`credentials.get()`](/java/api/class-credentials#credentials-get) return the current `signCount`, and it is saved and restored together with the credentials in the storage state.
- New [`apiRequestContext.addCookies()`](/java/api/class-apirequestcontext#api-request-context-add-cookies), [`apiRequestContext.cookies()`](/java/api/class-apirequestcontext#api-request-context-cookies) and [`apiRequestContext.clearCookies()`](/java/api/class-apirequestcontext#api-request-context-clear-cookies) manage cookies of a request context, mirroring the [BrowserContext](/java/api/class-browsercontext) methods:
  
  ```java
  request.addCookies(Arrays.asList(
      new Cookie("session-id", "42").setUrl("https://example.com")));
  System.out.println(request.cookies("https://example.com"));
  request.clearCookies(new APIRequestContext.ClearCookiesOptions().setName("session-id"));
  ```

### Breaking Changes ⚠️
- Elements inside hidden iframes are considered hidden. Elements inside an iframe that is not visible, for example with `visibility: hidden`, are now considered hidden by actions, [`locator.isVisible()`](/java/api/class-locator#locator-is-visible) and [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible).

### Browser Versions
- Chromium 156.0.8078.4
- Mozilla Firefox 157.0
- WebKit 27.2

This version was also tested against the following stable channels:
- Google Chrome 155
- Microsoft Edge 155

## Version 1.63

### 🪟 Locate across frames

[`page.frameLocator()`](/java/api/class-page#page-frame-locator) and [`frame.frameLocator()`](/java/api/class-frame#frame-frame-locator) called without a selector search in any frame of the
subtree, so you no longer need to locate the iframe first:

```java
// Finds the button in any frame on the page.
page.frameLocator().getByRole(AriaRole.BUTTON).click();
```

The rest of the locator resolves inside a single frame, just like a regular locator, and an error is thrown when it
matches elements in several frames.

### 👁️ Visible-only locators

New [`locator.visible()`](/java/api/class-locator#locator-visible) returns a locator that matches only visible elements. It is the recommended
replacement for the `:visible` CSS pseudo-class:

```java
page.locator("button").visible().click();
```

### 🖼️ Aria and screen snapshots in traces

New [`ariaSnapshots`](/java/api/class-tracing#tracing-start-option-aria-snapshots) and [`screenSnapshots`](/java/api/class-tracing#tracing-start-option-screen-snapshots) options of
[`tracing.start()`](/java/api/class-tracing#tracing-start) capture an aria snapshot and a screenshot of the page on every action:

```java
context.tracing().start(new Tracing.StartOptions()
  .setSnapshots(true)
  .setAriaSnapshots(true)
  .setScreenSnapshots(true));
```

With aria and screen snapshots recorded, the new **Display Aria** mode in the trace viewer shows the action screenshot
side by side with the aria snapshot, and hovering an aria node highlights it on the screenshot.

### ☕ Nullability annotations

The public API is now annotated with [JSpecify](https://jspecify.dev) nullability annotations. The
`com.microsoft.playwright`, `com.microsoft.playwright.options` and `com.microsoft.playwright.assertions` packages are
`@NullMarked`, and values that can be absent are marked `@Nullable`, so null-checking tools such as NullAway, as well as
Kotlin code, can catch missing null checks at compile time.

### New APIs

#### Browser and Context
- [`httpCredentials`](/java/api/class-browser#browser-new-context-option-http-credentials) now also accepts an array of credentials. The first entry matching the request origin is used, and entries without an origin match any request.
- New option [`opfs`](/java/api/class-browsercontext#browser-context-storage-state-option-opfs) includes the [origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) in the storage state, so it can be persisted and restored into later contexts.
- New events [`page.onDialogClosed()`](/java/api/class-page#page-event-dialog-closed) and [`browserContext.onDialogClosed()`](/java/api/class-browsercontext#browser-context-event-dialog-closed) are emitted when a JavaScript dialog is accepted, dismissed or closed by the user.

#### Command line
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --no-remove"` keeps the browsers of other Playwright installations instead of removing them.
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --http-credentials"` records against pages behind HTTP authentication.

### Announcements
* ⚠️ Ubuntu 20.04 is not supported anymore.
* 🐧 On Linux arm64, Playwright now downloads the [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing) build of Chromium, the same build used on all other platforms.

### Browser Versions
- Chromium 153.0.8010.12
- Mozilla Firefox 155.0
- WebKit 26.6

This version was also tested against the following stable channels:
- Google Chrome 153
- Microsoft Edge 153

## Version 1.62

### 🖼️ WebP screenshots

[`page.screenshot()`](/java/api/class-page#page-screenshot) and [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) can now capture screenshots in the WebP format — Playwright infers the format from a `.webp` file extension, or you can set the `type` explicitly. Quality `100` (the default) is lossless, while lower values use lossy compression:

```java
page.screenshot(new Page.ScreenshotOptions()
    .setPath(Paths.get("homepage.webp"))
    .setQuality(50));
```

### New APIs
- New `scroll` option (`"auto"` | `"none"`) on actions to opt out of Playwright's automatic scroll-into-view.
- New [`locator.waitForFunction()`](/java/api/class-locator#locator-wait-for-function) waits until a function — called with the matching element — returns a truthy value.
- New [`apiResponse.timing()`](/java/api/class-apiresponse#api-response-timing) returns resource timing information for an API response.

### Announcements
* 📋 The clipboard is now isolated from the operating system in headless mode, so tests that use `navigator.clipboard` no longer read or overwrite the clipboard of the machine running them.
* ⚠️ Debian 11 is not supported anymore.

### Browser Versions
- Chromium 151.0.7922.34
- Mozilla Firefox 153.0
- WebKit 26.5

This version was also tested against the following stable channels:
- Google Chrome 151
- Microsoft Edge 151

## Version 1.61

### 🔑 WebAuthn passkeys

New [Credentials](/java/api/class-credentials) virtual authenticator, available via [`browserContext.credentials()`](/java/api/class-browsercontext#browser-context-credentials), lets tests register passkeys and answer `navigator.credentials.create()` / `navigator.credentials.get()` ceremonies in the page — no real hardware key required, works in all browsers:

```java
BrowserContext context = browser.newContext();

// Seed a passkey your backend provisioned for a test user.
context.credentials().create("example.com", new Credentials.CreateOptions()
    .setId(credentialId)
    .setUserHandle(userHandle)
    .setPrivateKey(privateKey)
    .setPublicKey(publicKey));
context.credentials().install();

Page page = context.newPage();
page.navigate("https://example.com/login");
// The page's navigator.credentials.get() is answered with the seeded passkey.
```

You can also let the app register a passkey once in a setup test, read it back with [`credentials.get()`](/java/api/class-credentials#credentials-get), and seed it into later tests — see [Credentials](/java/api/class-credentials) for details.

### 🗃️ Web Storage

New [WebStorage](/java/api/class-webstorage) API, available via [`page.localStorage()`](/java/api/class-page#page-local-storage) and [`page.sessionStorage()`](/java/api/class-page#page-session-storage), reads and writes the page's storage for the current origin:

```java
page.localStorage().setItem("token", "abc");
String token = page.localStorage().getItem("token");
List<NameValue> items = page.sessionStorage().items();
```

### New APIs
- [`apiResponse.securityDetails()`](/java/api/class-apiresponse#api-response-security-details) and [`apiResponse.serverAddr()`](/java/api/class-apiresponse#api-response-server-addr) mirror the browser-side [`response.securityDetails()`](/java/api/class-response#response-security-details) and [`response.serverAddr()`](/java/api/class-response#response-server-addr).
- New option `artifactsDir` in [`browserType.connectOverCDP()`](/java/api/class-browsertype#browser-type-connect-over-cdp) controls where artifacts such as traces and downloads are stored when attached to an existing browser.
- New option `cursor` in [`screencast.showActions()`](/java/api/class-screencast#screencast-show-actions) controls the cursor decoration rendered for pointer actions.
- The `onFrame` callback in [`screencast.start()`](/java/api/class-screencast#screencast-start) now receives a `timestamp` of when the frame was presented by the browser.

### 🛠️ Other improvements
- Playwright now supports Ubuntu 26.04.
- HAR and trace recordings now include WebSocket requests.

### Browser Versions
- Chromium 149.0.7827.55
- Mozilla Firefox 151.0
- WebKit 26.5

This version was also tested against the following stable channels:
- Google Chrome 149
- Microsoft Edge 149

## Version 1.60

### 🌐 HAR recording on Tracing

[`tracing.startHar()`](/java/api/class-tracing#tracing-start-har) / [`tracing.stopHar()`](/java/api/class-tracing#tracing-stop-har) expose HAR recording as a first-class tracing API, with the same `content`, `mode` and `urlFilter` options as `recordHar`:

```java
context.tracing().startHar(Paths.get("trace.har"));
Page page = context.newPage();
page.navigate("https://playwright.dev");
context.tracing().stopHar();
```

### 🪝 Drop API

New [`locator.drop()`](/java/api/class-locator#locator-drop) simulates an external drag-and-drop of files or clipboard-like data onto an element. Playwright dispatches `dragenter`, `dragover`, and `drop` with a synthetic [DataTransfer] in the page context — works cross-browser and is great for testing upload zones:

```java
page.locator("#dropzone").drop(new Locator.DropPayload()
    .setFiles(new FilePayload("note.txt", "text/plain", "hello".getBytes(StandardCharsets.UTF_8))));

page.locator("#dropzone").drop(new Locator.DropPayload()
    .setData(Map.of(
        "text/plain", "hello world",
        "text/uri-list", "https://example.com")));
```

### 🎯 Aria snapshots
- [`pageAssertions.matchesAriaSnapshot()`](/java/api/class-pageassertions#page-assertions-to-match-aria-snapshot) now works on a [Page](/java/api/class-page), in addition to a [Locator](/java/api/class-locator) — equivalent to asserting against `page.locator("body")`.
- New `boxes` option on [`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot) / [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) appends each element's bounding box as `[box=x,y,width,height]`, useful for AI consumption.

### New APIs

#### Browser, Context and Page
- Event [`browser.onContext()`](/java/api/class-browser#browser-event-context) — fired when a new context is created on the browser.
- [BrowserContext](/java/api/class-browsercontext) now mirrors lifecycle events from its pages: [`browserContext.onDownload()`](/java/api/class-browsercontext#browser-context-event-download), [`browserContext.onFrameAttached()`](/java/api/class-browsercontext#browser-context-event-frame-attached), [`browserContext.onFrameDetached()`](/java/api/class-browsercontext#browser-context-event-frame-detached), [`browserContext.onFrameNavigated()`](/java/api/class-browsercontext#browser-context-event-frame-navigated), [`browserContext.onPageClose()`](/java/api/class-browsercontext#browser-context-event-page-close), [`browserContext.onPageLoad()`](/java/api/class-browsercontext#browser-context-event-page-load).

#### Locators and Assertions
- New option `description` in [`page.getByRole()`](/java/api/class-page#page-get-by-role) / [`locator.getByRole()`](/java/api/class-locator#locator-get-by-role) / [`frame.getByRole()`](/java/api/class-frame#frame-get-by-role) / [`frameLocator.getByRole()`](/java/api/class-framelocator#frame-locator-get-by-role) for matching the [accessible description](https://www.w3.org/TR/wai-aria-1.2/#dfn-accessible-description).
- New option `pseudo` in [`locatorAssertions.hasCSS()`](/java/api/class-locatorassertions#locator-assertions-to-have-css) reads computed styles from `::before` or `::after`.
- New option `style` in [`locator.highlight()`](/java/api/class-locator#locator-highlight) applies extra inline CSS to the highlight overlay, plus new [`page.hideHighlight()`](/java/api/class-page#page-hide-highlight) to clear all highlights.

#### Network
- [`webSocketRoute.protocols()`](/java/api/class-websocketroute#web-socket-route-protocols) returns the WebSocket subprotocols requested by the page.
- New option `noDefaults` in [`browserType.connectOverCDP()`](/java/api/class-browsertype#browser-type-connect-over-cdp) disables Playwright's default overrides on the default context (download behavior, focus emulation, media emulation), so attaching to a user's daily-driver browser doesn't disturb its state.

#### Errors
- New [`webError.location()`](/java/api/class-weberror#web-error-location) mirrors [`consoleMessage.location()`](/java/api/class-consolemessage#console-message-location).

### 🛠️ Other improvements
- Trace Viewer adds a pretty-print toggle for JSON / form request and response bodies in the network details panel.

### Breaking Changes ⚠️
- Removed long-deprecated `handle` option on `BrowserContext.exposeBinding` and `Page.exposeBinding`.

### Browser Versions
- Chromium 148.0.7778.96
- Mozilla Firefox 150.0.2
- WebKit 26.4

This version was also tested against the following stable channels:
- Google Chrome 147
- Microsoft Edge 147

## Version 1.59

### 🎬 Screencast

New [`page.screencast()`](/java/api/class-page#page-screencast) API provides a unified interface for capturing page content with:
- Screencast recordings
- Action annotations
- Visual overlays
- Real-time frame capture
- Agentic video receipts

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-screencast-demo.gif" alt="Demo" width="500" height="313" />

</center>

**Screencast recording** — record video with precise start/stop control, as an alternative to the [`recordVideoDir`](/java/api/class-browser#browser-new-context-option-record-video-dir) option:

```java
page.screencast().start(new Screencast.StartOptions().setPath(Paths.get("video.webm")));
// ... perform actions ...
page.screencast().stop();
```

**Action annotations** — enable built-in visual annotations that highlight interacted elements and display action titles during recording:

```java
page.screencast().showActions(new Screencast.ShowActionsOptions().setPosition("top-right"));
```

[`screencast.showActions()`](/java/api/class-screencast#screencast-show-actions) accepts `position` (`"top-left"`, `"top"`, `"top-right"`, `"bottom-left"`, `"bottom"`, `"bottom-right"`), `duration` (ms per annotation), and `fontSize` (px). Returns a disposable to stop showing actions.

**Visual overlays** — add chapter titles and custom HTML overlays on top of the page for richer narration:

```java
page.screencast().showChapter("Adding TODOs",
    new Screencast.ShowChapterOptions()
        .setDescription("Type and press enter for each TODO")
        .setDuration(1000));

page.screencast().showOverlay("<div style=\"color: red\">Recording</div>");
```

**Real-time frame capture** — stream JPEG-encoded frames for custom processing like thumbnails, live previews, AI vision, and more:

```java
page.screencast().start(new Screencast.StartOptions()
    .setOnFrame(frame -> sendToVisionModel(frame.data)));
```

**Agentic video receipts** — coding agents can produce video evidence of their work. After completing a task, an agent can record a walkthrough video with rich annotations for human review:

```java
page.screencast().start(new Screencast.StartOptions()
    .setPath(Paths.get("receipt.webm")));
page.screencast().showActions(new Screencast.ShowActionsOptions().setPosition("top-right"));

page.screencast().showChapter("Verifying checkout flow",
    new Screencast.ShowChapterOptions()
        .setDescription("Added coupon code support per ticket #1234"));

// Agent performs the verification steps...
page.locator("#coupon").fill("SAVE20");
page.locator("#apply-coupon").click();
assertThat(page.locator(".discount")).containsText("20%");

page.screencast().showChapter("Done",
    new Screencast.ShowChapterOptions()
        .setDescription("Coupon applied, discount reflected in total"));

page.screencast().stop();
```

The resulting video serves as a receipt: chapter titles provide context, action annotations highlight each interaction, and the visual walkthrough is faster to review than text logs.

### 🔍 Snapshots and Locators
- Method [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) to capture the aria snapshot of the page — equivalent to `page.locator("body").ariaSnapshot()`.
- Options `depth` and `mode` in [`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot).
- Method [`locator.normalize()`](/java/api/class-locator#locator-normalize) converts a locator to follow best practices like test ids and aria roles.
- Method [`page.pickLocator()`](/java/api/class-page#page-pick-locator) enters an interactive mode where hovering over elements highlights them and shows the corresponding locator. Click an element to get its [Locator](/java/api/class-locator) back. Use [`page.cancelPickLocator()`](/java/api/class-page#page-cancel-pick-locator) to cancel.

### New APIs

#### Screencast
- [`page.screencast()`](/java/api/class-page#page-screencast) provides video recording, real-time frame streaming, and overlay management.
- Methods [`screencast.start()`](/java/api/class-screencast#screencast-start) and [`screencast.stop()`](/java/api/class-screencast#screencast-stop) for recording and frame capture.
- Methods [`screencast.showActions()`](/java/api/class-screencast#screencast-show-actions) and [`screencast.hideActions()`](/java/api/class-screencast#screencast-hide-actions) for action annotations.
- Methods [`screencast.showChapter()`](/java/api/class-screencast#screencast-show-chapter) and [`screencast.showOverlay()`](/java/api/class-screencast#screencast-show-overlay) for visual overlays.
- Methods [`screencast.showOverlays()`](/java/api/class-screencast#screencast-show-overlays) and [`screencast.hideOverlays()`](/java/api/class-screencast#screencast-hide-overlays) for overlay visibility control.

#### Storage, Console and Errors
- Method [`browserContext.setStorageState()`](/java/api/class-browsercontext#browser-context-set-storage-state) clears existing cookies, local storage, and IndexedDB for all origins and sets a new storage state — no need to create a new context.
- Methods [`page.clearConsoleMessages()`](/java/api/class-page#page-clear-console-messages) and [`page.clearPageErrors()`](/java/api/class-page#page-clear-page-errors) to clear stored messages and errors.
- Option `filter` in [`page.consoleMessages()`](/java/api/class-page#page-console-messages) and [`page.pageErrors()`](/java/api/class-page#page-page-errors) controls which messages are returned.
- Method [`consoleMessage.timestamp()`](/java/api/class-consolemessage#console-message-timestamp).

#### Miscellaneous
- [`browserContext.debugger()`](/java/api/class-browsercontext#browser-context-debugger) provides programmatic control over the Playwright debugger.
- Method [`browserContext.isClosed()`](/java/api/class-browsercontext#browser-context-is-closed).
- Method [`request.existingResponse()`](/java/api/class-request#request-existing-response) returns the response without waiting.
- Method [`response.httpVersion()`](/java/api/class-response#response-http-version) returns the HTTP version used by the response.
- Option `live` in [`tracing.start()`](/java/api/class-tracing#tracing-start) for real-time trace updates.
- Option `artifactsDir` in [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) to configure the artifacts directory.

### 🔗 Interoperability

New [`browser.bind()`](/java/api/class-browser#browser-bind) API makes a launched browser available for `playwright-cli`, `@playwright/mcp`, and other clients to connect to.

**Bind a browser** — start a browser and bind it so others can connect:

```java
Browser.BindResult serverInfo = browser.bind("my-session",
    new Browser.BindOptions().setWorkspaceDir("/my/project"));
```

**Connect from playwright-cli** — connect to the running browser from your favorite coding agent.

```bash
playwright-cli attach my-session
playwright-cli -s my-session snapshot
```

**Connect from @playwright/mcp** — or point your MCP server to the running browser.

```bash
@playwright/mcp --endpoint=my-session
```

**Connect from a Playwright client** — use API to connect to the browser. Multiple clients at a time are supported!

```java
Browser browser = chromium.connect(serverInfo.endpoint);
```

Pass `host` and `port` options to bind over WebSocket instead of a named pipe:

```java
Browser.BindResult serverInfo = browser.bind("my-session",
    new Browser.BindOptions().setHost("localhost").setPort(0));
// serverInfo.endpoint is a ws:// URL
```

Call [`browser.unbind()`](/java/api/class-browser#browser-unbind) to stop accepting new connections.

### 📊 Observability

Run `playwright-cli show` to open the Dashboard that lists all the bound browsers, their statuses, and allows interacting with them:
- See what your agent is doing on the background browsers
- Click into the sessions for manual interventions
- Open DevTools to inspect pages from the background browsers.

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-dashboard.png" alt="Demo" width="1169" height="835" />

</center>
- `playwright-cli` binds all of its browsers automatically, so you can see what your agents are doing.
- Pass `PLAYWRIGHT_DASHBOARD=1` env variable to see all `@playwright/test` browsers in the dashboard.

### Breaking Changes ⚠️
- Removed macOS 14 support for WebKit. We recommend upgrading your macOS version, or keeping an older Playwright version.

### Browser Versions
- Chromium 147.0.7727.15
- Mozilla Firefox 148.0.2
- WebKit 26.4

This version was also tested against the following stable channels:
- Google Chrome 146
- Microsoft Edge 146

## Version 1.58

### UI Mode and Trace Viewer Improvements
- New 'system' theme option follows your OS dark/light mode preference
- Search functionality (Cmd/Ctrl+F) is now available in code editors
- Network details panel has been reorganized for better usability
- JSON responses are now automatically formatted for readability

Thanks to [@cpAdm](https://github.com/cpAdm) for contributing these improvements!

### Miscellaneous

[`browserType.connectOverCDP()`](/java/api/class-browsertype#browser-type-connect-over-cdp) now accepts an `isLocal` option. When set to `true`, it tells Playwright that it runs on the same host as the CDP server, enabling file system optimizations.

### Breaking Changes ⚠️
- Removed `_react` and `_vue` selectors. See [locators guide](./locators.md) for alternatives.
- Removed `:light` selector engine suffix. Use standard CSS selectors instead.
- Option `devtools` from [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) has been removed. Use `setArgs(Arrays.asList("--auto-open-devtools-for-tabs"))` instead.
- Removed macOS 13 support for WebKit. We recommend to upgrade your macOS version, or keep using an older Playwright version.

### Browser Versions
- Chromium 145.0.7632.6
- Mozilla Firefox 146.0.1
- WebKit 26.0

This version was also tested against the following stable channels:
- Google Chrome 144
- Microsoft Edge 144

## Version 1.57

### Chrome for Testing

Playwright now runs on [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/) builds rather than Chromium. Headed mode uses `chrome`; headless mode uses `chrome-headless-shell`. Existing tests should continue to pass after upgrading to v1.57.

We're expecting no functional changes to come from this switch. The biggest change is the new icon and title in your toolbar.

![new and old logo](/images/cft-logo-change.png)

If you still see an unexpected behaviour change, please [file an issue](https://github.com/microsoft/playwright/issues/new).

On Arm64 Linux, Playwright continues to use Chromium.

### Breaking Change

After 3 years of being deprecated, we removed `page.accessibility()` from our API. Please use other libraries such as [Axe](https://www.deque.com/axe/) if you need to test page accessibility. See our Node.js [guide](https://playwright.dev/docs/accessibility-testing) for integration with Axe.

### New APIs
- [`worker.onConsole()`](/java/api/class-worker#worker-event-console) event is emitted when JavaScript within the worker calls one of console API methods, e.g. console.log or console.dir. [`worker.waitForConsoleMessage()`](/java/api/class-worker#worker-wait-for-console-message) can be used to wait for it.
- [`locator.description()`](/java/api/class-locator#locator-description) returns locator description previously set with [`locator.describe()`](/java/api/class-locator#locator-describe).
- New option [`steps`](/java/api/class-locator#locator-click-option-steps) in [`locator.click()`](/java/api/class-locator#locator-click) and [`locator.dragTo()`](/java/api/class-locator#locator-drag-to) that configures the number of `mousemove` events emitted while moving the mouse pointer to the target element.

### Browser Versions
- Chromium 143.0.7499.4
- Mozilla Firefox 144.0.2
- WebKit 26.0

## Version 1.56

### New APIs
- New methods [`page.consoleMessages()`](/java/api/class-page#page-console-messages) and [`page.pageErrors()`](/java/api/class-page#page-page-errors) for retrieving the most recent console messages from the page
- New method [`page.requests()`](/java/api/class-page#page-requests) for retrieving the most recent network requests from the page

### Breaking Changes
- Event [`browserContext.onBackgroundPage()`](/java/api/class-browsercontext#browser-context-event-background-page) has been deprecated and will not be emitted. Method [`browserContext.backgroundPages()`](/java/api/class-browsercontext#browser-context-background-pages) will return an empty list

### Miscellaneous
- Aria snapshots render and compare `input` `placeholder`

### Browser Versions
- Chromium 141.0.7390.37
- Mozilla Firefox 142.0.1
- WebKit 26.0

## Version 1.55

### Codegen
- Automatic `isVisible()` assertions: Codegen can now generate automatic `isVisible()` assertions for common UI interactions. This feature can be enabled in the Codegen settings UI.

### Breaking Changes
- ⚠️ Dropped support for Chromium extension manifest v2.

### Miscellaneous
- Added support for Debian 13 "Trixie".

### Browser Versions
- Chromium 140.0.7339.16
- Mozilla Firefox 141.0
- WebKit 26.0

This version was also tested against the following stable channels:
- Google Chrome 139
- Microsoft Edge 139

## Version 1.54

### Highlights
- New cookie property `partitionKey` in [`browserContext.cookies()`](/java/api/class-browsercontext#browser-context-cookies) and [`browserContext.addCookies()`](/java/api/class-browsercontext#browser-context-add-cookies). This property allows to save and restore partitioned cookies. See [CHIPS MDN article](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies) for more information. Note that browsers have different support and defaults for cookie partitioning.
- New option `--user-data-dir` in multiple commands. You can specify the same user data dir to reuse browsing state, like authentication, between sessions.
  
  ```bash
  mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --user-data-dir=./user-data"
  ```
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args=open` command does not open the test recorder anymore. Use `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args=codegen` instead.

### Browser Versions
- Chromium 139.0.7258.5
- Mozilla Firefox 140.0.2
- WebKit 26.0

This version was also tested against the following stable channels:
- Google Chrome 140
- Microsoft Edge 140

## Version 1.53

### Trace Viewer and HTML Reporter Updates
- New Steps in Trace Viewer:
  
  <img src="https://github.com/user-attachments/assets/1963ff7d-4070-41be-a79b-4333176921a2" alt="New Trace Viewer Steps" width="1562" height="1364" />
- New method [`locator.describe()`](/java/api/class-locator#locator-describe) to describe a locator. Used for trace viewer.
  
  ```java
  Locator button = page.getByTestId("btn-sub").describe("Subscribe button");
  button.click();
  ```
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --list"` will now list all installed browsers, versions and locations.

### Browser Versions
- Chromium 138.0.7204.4
- Mozilla Firefox 139.0
- WebKit 18.5

This version was also tested against the following stable channels:
- Google Chrome 137
- Microsoft Edge 137

## Version 1.52

### Highlights
- New method [`locatorAssertions.containsClass()`](/java/api/class-locatorassertions#locator-assertions-to-contain-class) to ergonomically assert individual class names on the element.
  
  ```java
    assertThat(page.getByRole(AriaRole.LISTITEM, new Page.GetByRoleOptions().setName("Ship v1.52"))).containsClass("done");
  ```
- [Aria Snapshots](./aria-snapshots.md) got two new properties: [`/children`](./aria-snapshots.md#strict-matching) for strict matching and [`/url`](./aria-snapshots.md#links) for links.
  
  ```java
  assertThat(locator).toMatchAriaSnapshot("""
    - list
      - /children: equal
      - listitem: Feature A
      - listitem:
        - link "Feature B":
          - /url: "https://playwright.dev"
  """);
  ```

### Miscellaneous
- New option [`maxRedirects`](/java/api/class-apirequest#api-request-new-context-option-max-redirects) in [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context) to control the maximum number of redirects.

### Breaking Changes
- Glob URL patterns in methods like [`page.route()`](/java/api/class-page#page-route) do not support `?` and `[]` anymore. We recommend using regular expressions instead.
- Method [`route.resume()`](/java/api/class-route#route-continue) does not allow to override the `Cookie` header anymore. If a `Cookie` header is provided, it will be ignored, and the cookie will be loaded from the browser's cookie store. To set custom cookies, use [`browserContext.addCookies()`](/java/api/class-browsercontext#browser-context-add-cookies).
- macOS 13 is now deprecated and will no longer receive WebKit updates. Please upgrade to a more recent macOS version to continue benefiting from the latest WebKit improvements.

### Browser Versions
- Chromium 136.0.7103.25
- Mozilla Firefox 137.0
- WebKit 18.4

This version was also tested against the following stable channels:
- Google Chrome 135
- Microsoft Edge 135

## Version 1.51

### Highlights
* New option [`indexedDB`](/java/api/class-browsercontext#browser-context-storage-state-option-indexed-db) for [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state) allows to save and restore IndexedDB contents. Useful when your application uses [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to store authentication tokens, like Firebase Authentication.
  
  Here is an example following the [authentication guide](./auth.md#reusing-signed-in-state):
  
  ```java
  // Save storage state into the file. Make sure to include IndexedDB.
  context.storageState(new BrowserContext.StorageStateOptions()
      .setPath(Paths.get("state.json"))
      .setIndexedDB(true));
  
  // Create a new context with the saved storage state.
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setStorageStatePath(Paths.get("state.json")));
  ```
* New option [`visible`](/java/api/class-locator#locator-filter-option-visible) for [`locator.filter()`](/java/api/class-locator#locator-filter) allows matching only visible elements.
  
  ```java
  // Ignore invisible todo items.
  Locator todoItems = page.getByTestId("todo-item")
      .filter(new Locator.FilterOptions().setVisible(true));
  // Check there are exactly 3 visible ones.
  assertThat(todoItems).hasCount(3);
  ```
* New option `setContrast` for methods [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) and [`browser.newContext()`](/java/api/class-browser#browser-new-context) allows to emulate the `prefers-contrast` media feature.
* New option [`failOnStatusCode`](/java/api/class-apirequest#api-request-new-context-option-fail-on-status-code) makes all fetch requests made through the [APIRequestContext](/java/api/class-apirequestcontext) throw on response codes other than 2xx and 3xx.

### Browser Versions
* Chromium 134.0.6998.35
* Mozilla Firefox 135.0
* WebKit 18.4

This version was also tested against the following stable channels:
* Google Chrome 133
* Microsoft Edge 133

## Version 1.50

### Miscellaneous
* Added method [`locatorAssertions.hasAccessibleErrorMessage()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message) to assert the Locator points to an element with a given [aria errormessage](https://w3c.github.io/aria/#aria-errormessage).

### UI updates
* New button in Codegen for picking elements to produce aria snapshots.
* Additional details (such as keys pressed) are now displayed alongside action API calls in traces.
* Display of `canvas` content in traces is error-prone. Display is now disabled by default, and can be enabled via the `Display canvas content` UI setting.
* `Call` and `Network` panels now display additional time information.

### Breaking
* [`locatorAssertions.isEditable()`](/java/api/class-locatorassertions#locator-assertions-to-be-editable) and [`locator.isEditable()`](/java/api/class-locator#locator-is-editable) now throw if the target element is not `<input>`, `<select>`, or a number of other editable elements.

### Browser Versions
* Chromium 133.0.6943.16
* Mozilla Firefox 134.0
* WebKit 18.2

This version was also tested against the following stable channels:
* Google Chrome 132
* Microsoft Edge 132

## Version 1.49

### Aria snapshots

New assertion [`locatorAssertions.matchesAriaSnapshot()`](/java/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) verifies page structure by comparing to an expected accessibility tree, represented as YAML.

```java
page.navigate("https://playwright.dev");
assertThat(page.locator("body")).matchesAriaSnapshot("""
  - banner:
    - heading /Playwright enables reliable/ [level=1]
    - link "Get started"
    - link "Star microsoft/playwright on GitHub"
  - main:
    - img "Browsers (Chromium, Firefox, WebKit)"
    - heading "Any browser • Any platform • One API"
""");
```

You can generate this assertion with [Test Generator](./codegen) or by calling [`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot).

Learn more in the [aria snapshots guide](./aria-snapshots).

### Tracing groups

New method [`tracing.group()`](/java/api/class-tracing#tracing-group) allows you to visually group actions in the trace viewer.

```java
// All actions between group and groupEnd
// will be shown in the trace viewer as a group.
page.context().tracing().group("Open Playwright.dev > API");
page.navigate("https://playwright.dev/");
page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("API")).click();
page.context().tracing().groupEnd();
```

### Breaking: `chrome` and `msedge` channels switch to new headless mode

This change affects you if you're using one of the following channels in your `playwright.config.ts`:
- `chrome`, `chrome-dev`, `chrome-beta`, or `chrome-canary`
- `msedge`, `msedge-dev`, `msedge-beta`, or `msedge-canary`

After updating to Playwright v1.49, run your test suite. If it still passes, you're good to go. If not, you will probably need to update your snapshots, and adapt some of your test code around PDF viewers and extensions. See [issue #33566](https://github.com/microsoft/playwright/issues/33566) for more details.

### Try new Chromium headless

You can opt into the new headless mode by using `'chromium'` channel. As [official Chrome documentation puts it](https://developer.chrome.com/blog/chrome-headless-shell):

> New Headless on the other hand is the real Chrome browser, and is thus more authentic, reliable, and offers more features. This makes it more suitable for high-accuracy end-to-end web app testing or browser extension testing.

See [issue #33566](https://github.com/microsoft/playwright/issues/33566) for the list of possible breakages you could encounter and more details on Chromium headless. Please file an issue if you see any problems after opting in.

```java
Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setChannel("chromium"));
```

### Miscellaneous
- There will be no more updates for WebKit on Ubuntu 20.04 and Debian 11. We recommend updating your OS to a later version.
- `<canvas>` elements inside a snapshot now draw a preview.

### Browser Versions
- Chromium 131.0.6778.33
- Mozilla Firefox 132.0
- WebKit 18.2

This version was also tested against the following stable channels:
- Google Chrome 130
- Microsoft Edge 130

## Version 1.48

### WebSocket routing

New methods [`page.routeWebSocket()`](/java/api/class-page#page-route-web-socket) and [`browserContext.routeWebSocket()`](/java/api/class-browsercontext#browser-context-route-web-socket) allow to intercept, modify and mock WebSocket connections initiated in the page. Below is a simple example that mocks WebSocket communication by responding to a `"request"` with a `"response"`.

```java
page.routeWebSocket("/ws", ws -> {
  ws.onMessage(frame -> {
    if ("request".equals(frame.text()))
      ws.send("response");
  });
});
```

See [WebSocketRoute](/java/api/class-websocketroute) for more details.

### UI updates
- New "copy" buttons for annotations and test location in the HTML report.
- Route method calls like [`route.fulfill()`](/java/api/class-route#route-fulfill) are not shown in the report and trace viewer anymore. You can see which network requests were routed in the network tab instead.
- New "Copy as cURL" and "Copy as fetch" buttons for requests in the network tab.

### Miscellaneous
- New method [`page.requestGC()`](/java/api/class-page#page-request-gc) may help detect memory leaks.
- Requests made by [APIRequestContext](/java/api/class-apirequestcontext) now record detailed timing and security information in the HAR.

### Browser Versions
- Chromium 130.0.6723.19
- Mozilla Firefox 130.0
- WebKit 18.0

This version was also tested against the following stable channels:
- Google Chrome 129
- Microsoft Edge 129

## Version 1.47

### Network Tab improvements

The Network tab in the trace viewer has several nice improvements:
- filtering by asset type and URL
- better display of query string parameters
- preview of font assets

<img src="https://github.com/user-attachments/assets/4bd1b67d-90bd-438b-a227-00b9e86872e2" alt="Network tab now has filters" width="1712" height="418" />

### Miscellaneous
- The `mcr.microsoft.com/playwright/java:v1.47.0` now serves a Playwright image based on Ubuntu 24.04 Noble.
  To use the 22.02 jammy-based image, please use `mcr.microsoft.com/playwright/java:v1.47.0-jammy` instead.
- The `:latest`/`:focal`/`:jammy` tag for Playwright Docker images is no longer being published. Pin to a specific version for better stability and reproducibility.
- TLS client certificates can now be passed from memory by passing [`clientCertificates.cert`](/java/api/class-browser#browser-new-context-option-client-certificates) and [`clientCertificates.key`](/java/api/class-browser#browser-new-context-option-client-certificates) as byte arrays instead of file paths.
- [`noWaitAfter`](/java/api/class-locator#locator-select-option-option-no-wait-after) in [`locator.selectOption()`](/java/api/class-locator#locator-select-option) was deprecated.
- We've seen reports of WebGL in Webkit misbehaving on GitHub Actions `macos-13`. We recommend upgrading GitHub Actions to `macos-14`.

### Browser Versions
- Chromium 129.0.6668.29
- Mozilla Firefox 130.0
- WebKit 18.0

This version was also tested against the following stable channels:
- Google Chrome 128
- Microsoft Edge 128

## Version 1.46

### TLS Client Certificates

Playwright now allows to supply client-side certificates, so that server can verify them, as specified by TLS Client Authentication.

You can provide client certificates as a parameter of [`browser.newContext()`](/java/api/class-browser#browser-new-context) and [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context). The following snippet sets up a client certificate for `https://example.com`:

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
    .setClientCertificates(asList(new ClientCertificate("https://example.com")
          .setCertPath(Paths.get("client-certificates/cert.pem"))
          .setKeyPath(Paths.get("client-certificates/key.pem")))));
```

### Trace Viewer Updates
- Content of text attachments is now rendered inline in the attachments pane.
- New setting to show/hide routing actions like [`route.resume()`](/java/api/class-route#route-continue).
- Request method and status are shown in the network details tab.
- New button to copy source file location to clipboard.
- Metadata pane now displays the `baseURL`.

### Miscellaneous
- New `maxRetries` option in [`apiRequestContext.fetch()`](/java/api/class-apirequestcontext#api-request-context-fetch) which retries on the `ECONNRESET` network error.

### Browser Versions
- Chromium 128.0.6613.18
- Mozilla Firefox 128.0
- WebKit 18.0

This version was also tested against the following stable channels:
- Google Chrome 127
- Microsoft Edge 127

## Version 1.45

### Clock

Utilizing the new [Clock](/java/api/class-clock) API allows to manipulate and control time within tests to verify time-related behavior. This API covers many common scenarios, including:
* testing with predefined time;
* keeping consistent time and timers;
* monitoring inactivity;
* ticking through time manually.

```java
// Initialize clock with some time before the test time and let the page load
// naturally. `Date.now` will progress as the timers fire.
page.clock().install(new Clock.InstallOptions().setTime("2024-02-02T08:00:00"));
page.navigate("http://localhost:3333");
Locator locator = page.getByTestId("current-time");

// Pretend that the user closed the laptop lid and opened it again at 10am.
// Pause the time once reached that point.
page.clock().pauseAt("2024-02-02T10:00:00");

// Assert the page state.
assertThat(locator).hasText("2/2/2024, 10:00:00 AM");

// Close the laptop lid again and open it at 10:30am.
page.clock().fastForward("30:00");
assertThat(locator).hasText("2/2/2024, 10:30:00 AM");
```

See [the clock guide](./clock.md) for more details.

### Miscellaneous
- Method [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) now supports uploading a directory for `<input type=file webkitdirectory>` elements.
  
  ```java
  page.getByLabel("Upload directory").setInputFiles(Paths.get("mydir"));
  ```
- Multiple methods like [`locator.click()`](/java/api/class-locator#locator-click) or [`locator.press()`](/java/api/class-locator#locator-press) now support a `ControlOrMeta` modifier key. This key maps to `Meta` on macOS and maps to `Control` on Windows and Linux.
  
  ```java
  // Press the common keyboard shortcut Control+S or Meta+S to trigger a "Save" operation.
  page.keyboard.press("ControlOrMeta+S");
  ```
- New property `httpCredentials.send` in [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context) that allows to either always send the `Authorization` header or only send it in response to `401 Unauthorized`.
- Playwright now supports Chromium, Firefox and WebKit on Ubuntu 24.04.
- v1.45 is the last release to receive WebKit update for macOS 12 Monterey. Please update macOS to keep using the latest WebKit.

### Browser Versions
* Chromium 127.0.6533.5
* Mozilla Firefox 127.0
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 126
* Microsoft Edge 126

## Version 1.44

### New APIs

**Accessibility assertions**
- [`locatorAssertions.hasAccessibleName()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-name) checks if the element has the specified accessible name:
  
  ```java
  Locator locator = page.getByRole(AriaRole.BUTTON);
  assertThat(locator).hasAccessibleName("Submit");
  ```
- [`locatorAssertions.hasAccessibleDescription()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-description) checks if the element has the specified accessible description:
  
  ```java
  Locator locator = page.getByRole(AriaRole.BUTTON);
  assertThat(locator).hasAccessibleDescription("Upload a photo");
  ```
- [`locatorAssertions.hasRole()`](/java/api/class-locatorassertions#locator-assertions-to-have-role) checks if the element has the specified ARIA role:
  
  ```java
  Locator locator = page.getByTestId("save-button");
  assertThat(locator).hasRole(AriaRole.BUTTON);
  ```

**Locator handler**
- After executing the handler added with [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler), Playwright will now wait until the overlay that triggered the handler is not visible anymore. You can opt-out of this behavior with the new `setNoWaitAfter` option.
- You can use new `setTimes` option in [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler) to specify maximum number of times the handler should be run.
- The handler in [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler) now accepts the locator as argument.
- New [`page.removeLocatorHandler()`](/java/api/class-page#page-remove-locator-handler) method for removing previously added locator handlers.

```java
Locator locator = page.getByText("This interstitial covers the button");
page.addLocatorHandler(locator, overlay -> {
  overlay.locator("#close").click();
}, new Page.AddLocatorHandlerOptions().setTimes(3).setNoWaitAfter(true));
// Run your tests that can be interrupted by the overlay.
// ...
page.removeLocatorHandler(locator);
```

**Miscellaneous options**
- New method [`formData.append()`](/java/api/class-formdata#form-data-append) allows to specify repeating fields with the same name in [`setMultipart`](./api/class-requestoptions#request-options-set-multipart) option in `RequestOptions`:
  
  ```java
  FormData formData = FormData.create();
  formData.append("file", new FilePayload("f1.js", "text/javascript",
  "var x = 2024;".getBytes(StandardCharsets.UTF_8)));
  formData.append("file", new FilePayload("f2.txt", "text/plain",
    "hello".getBytes(StandardCharsets.UTF_8)));
  APIResponse response = context.request().post("https://example.com/uploadFile", RequestOptions.create().setMultipart(formData));
  ```
- `expect(page).toHaveURL(url)` now supports `setIgnoreCase` [option](./api/class-pageassertions#page-assertions-to-have-url-option-ignore-case).

### Browser Versions
* Chromium 125.0.6422.14
* Mozilla Firefox 125.0.1
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 124
* Microsoft Edge 124

## Version 1.43

### New APIs
- Method [`browserContext.clearCookies()`](/java/api/class-browsercontext#browser-context-clear-cookies) now supports filters to remove only some cookies.
  
  ```java
  // Clear all cookies.
  context.clearCookies();
  // New: clear cookies with a particular name.
  context.clearCookies(new BrowserContext.ClearCookiesOptions().setName("session-id"));
  // New: clear cookies for a particular domain.
  context.clearCookies(new BrowserContext.ClearCookiesOptions().setDomain("my-origin.com"));
  ```
- New method [`locator.contentFrame()`](/java/api/class-locator#locator-content-frame) converts a [Locator](/java/api/class-locator) object to a [FrameLocator](/java/api/class-framelocator). This can be useful when you have a [Locator](/java/api/class-locator) object obtained somewhere, and later on would like to interact with the content inside the frame.
  
  ```java
  Locator locator = page.locator("iframe[name='embedded']");
  // ...
  FrameLocator frameLocator = locator.contentFrame();
  frameLocator.getByRole(AriaRole.BUTTON).click();
  ```
- New method [`frameLocator.owner()`](/java/api/class-framelocator#frame-locator-owner) converts a [FrameLocator](/java/api/class-framelocator) object to a [Locator](/java/api/class-locator). This can be useful when you have a [FrameLocator](/java/api/class-framelocator) object obtained somewhere, and later on would like to interact with the `iframe` element.
  
  ```java
  FrameLocator frameLocator = page.frameLocator("iframe[name='embedded']");
  // ...
  Locator locator = frameLocator.owner();
  assertThat(locator).isVisible();
  ```

### Browser Versions
* Chromium 124.0.6367.8
* Mozilla Firefox 124.0
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 123
* Microsoft Edge 123

## Version 1.42

### Experimental JUnit integration

Add new [`@UsePlaywright`](./junit.md) annotation to your test classes to start using Playwright
fixtures for [Page](/java/api/class-page), [BrowserContext](/java/api/class-browsercontext), [Browser](/java/api/class-browser), [APIRequestContext](/java/api/class-apirequestcontext) and [Playwright](/java/api/class-playwright) in the
test methods.

```java
package org.example;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.junit.UsePlaywright;
import org.junit.jupiter.api.Test;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@UsePlaywright
public class TestExample {
  void shouldNavigateToInstallationGuide(Page page) {
    page.navigate("https://playwright.dev/java/");
    page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Docs")).click();
    assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Installation"))).isVisible();
  }

  @Test
  void shouldCheckTheBox(Page page) {
    page.setContent("<input id='checkbox' type='checkbox'></input>");
    page.locator("input").check();
    assertEquals(true, page.evaluate("window['checkbox'].checked"));
  }

  @Test
  void shouldSearchWiki(Page page) {
    page.navigate("https://www.wikipedia.org/");
    page.locator("input[name=\"search\"]").click();
    page.locator("input[name=\"search\"]").fill("playwright");
    page.locator("input[name=\"search\"]").press("Enter");
    assertThat(page).hasURL("https://en.wikipedia.org/wiki/Playwright");
  }
}
```

In the example above, all three test methods use the same [Browser](/java/api/class-browser). Each test
uses its own [BrowserContext](/java/api/class-browsercontext) and [Page](/java/api/class-page).

**Custom options**

Implement your own `OptionsFactory` to initialize the fixtures with custom configuration.

```java
import com.microsoft.playwright.junit.Options;
import com.microsoft.playwright.junit.OptionsFactory;
import com.microsoft.playwright.junit.UsePlaywright;

@UsePlaywright(MyTest.CustomOptions.class)
public class MyTest {

  public static class CustomOptions implements OptionsFactory {
    @Override
    public Options getOptions() {
      return new Options()
          .setHeadless(false)
          .setContextOption(new Browser.NewContextOptions()
              .setBaseURL("https://github.com"))
          .setApiRequestOptions(new APIRequest.NewContextOptions()
              .setBaseURL("https://playwright.dev"));
    }
  }

  @Test
  public void testWithCustomOptions(Page page, APIRequestContext request) {
    page.navigate("/");
    assertThat(page).hasURL(Pattern.compile("github"));

    APIResponse response = request.get("/");
    assertTrue(response.text().contains("Playwright"));
  }
}
```

Learn more about the fixtures in our [JUnit guide](./junit.md).

### New Locator Handler

New method [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler) registers a callback that will be invoked when specified element becomes visible and may block Playwright actions. The callback can get rid of the overlay. Here is an example that closes a cookie dialog when it appears.

```java
// Setup the handler.
page.addLocatorHandler(
    page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Hej! You are in control of your cookies.")),
    () -> {
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Accept all")).click();
    });
// Write the test as usual.
page.navigate("https://www.ikea.com/");
page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Collection of blue and white")).click();
assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Light and easy"))).isVisible();
```

### New APIs
- [`page.pdf()`](/java/api/class-page#page-pdf) accepts two new options [`tagged`](/java/api/class-page#page-pdf-option-tagged) and [`outline`](/java/api/class-page#page-pdf-option-outline).

### Announcements
* ⚠️ Ubuntu 18 is not supported anymore.

### Browser Versions
* Chromium 123.0.6312.4
* Mozilla Firefox 123.0
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 122
* Microsoft Edge 123

## Version 1.41

### New APIs
- New method [`page.unrouteAll()`](/java/api/class-page#page-unroute-all) removes all routes registered by [`page.route()`](/java/api/class-page#page-route) and [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har).
- New method [`browserContext.unrouteAll()`](/java/api/class-browsercontext#browser-context-unroute-all) removes all routes registered by [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route) and [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har).
- New options [`style`](/java/api/class-page#page-screenshot-option-style) in [`page.screenshot()`](/java/api/class-page#page-screenshot) and [`style`](/java/api/class-locator#locator-screenshot-option-style) in [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) to add custom CSS to the page before taking a screenshot.

### Browser Versions
* Chromium 121.0.6167.57
* Mozilla Firefox 121.0
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 120
* Microsoft Edge 120

## Version 1.40

### Test Generator Update

<img src="https://github.com/microsoft/playwright/assets/9881434/e8d67e2e-f36d-4301-8631-023948d3e190" alt="Playwright Test Generator" width="2788" height="1824" />

New tools to generate assertions:
- "Assert visibility" tool generates [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible).
- "Assert value" tool generates [`locatorAssertions.hasValue()`](/java/api/class-locatorassertions#locator-assertions-to-have-value).
- "Assert text" tool generates [`locatorAssertions.containsText()`](/java/api/class-locatorassertions#locator-assertions-to-contain-text).

Here is an example of a generated test with assertions:

```java
page.navigate("https://playwright.dev/");
page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Get started")).click();
assertThat(page.getByLabel("Breadcrumbs").getByRole(AriaRole.LIST)).containsText("Installation");
assertThat(page.getByLabel("Search")).isVisible();
page.getByLabel("Search").click();
page.getByPlaceholder("Search docs").fill("locator");
assertThat(page.getByPlaceholder("Search docs")).hasValue("locator");
```

### New APIs
- Options [`reason`](/java/api/class-page#page-close-option-reason) in [`page.close()`](/java/api/class-page#page-close), [`reason`](/java/api/class-browsercontext#browser-context-close-option-reason) in [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) and [`reason`](/java/api/class-browser#browser-close-option-reason) in [`browser.close()`](/java/api/class-browser#browser-close). Close reason is reported for all operations interrupted by the closure.
- Option [`firefoxUserPrefs`](/java/api/class-browsertype#browser-type-launch-persistent-context-option-firefox-user-prefs) in [`browserType.launchPersistentContext()`](/java/api/class-browsertype#browser-type-launch-persistent-context).

### Other Changes
- Methods [`download.path()`](/java/api/class-download#download-path) and [`download.createReadStream()`](/java/api/class-download#download-create-read-stream) throw an error for failed and cancelled downloads.

### Browser Versions
* Chromium 120.0.6099.28
* Mozilla Firefox 119.0
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 119
* Microsoft Edge 119

## Version 1.39

Evergreen browsers update.

### Browser Versions
* Chromium 119.0.6045.9
* Mozilla Firefox 118.0.1
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 118
* Microsoft Edge 118

## Version 1.38

### Trace Viewer Updates

<img src="https://github.com/microsoft/playwright/assets/746130/0c41e20d-c54b-4600-8ca8-1cbb6393ddef" alt="Playwright Trace Viewer" width="1091" height="722" />
1. Zoom into time range.
1. Network panel redesign.

### New APIs
- [`browserContext.onWebError()`](/java/api/class-browsercontext#browser-context-event-web-error)
- [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially)

### Deprecations
* The following methods were deprecated: [`page.type()`](/java/api/class-page#page-type), [`frame.type()`](/java/api/class-frame#frame-type),
  [`locator.type()`](/java/api/class-locator#locator-type) and [`elementHandle.type()`](/java/api/class-elementhandle#element-handle-type).
  Please use [`locator.fill()`](/java/api/class-locator#locator-fill) instead which is much faster. Use
  [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially) only if there is a special keyboard
  handling on the page, and you need to press keys one-by-one.

### Browser Versions
* Chromium 117.0.5938.62
* Mozilla Firefox 117.0
* WebKit 17.0

This version was also tested against the following stable channels:
* Google Chrome 116
* Microsoft Edge 116

## Version 1.37

### New APIs
- New methods [`browserContext.newCDPSession()`](/java/api/class-browsercontext#browser-context-new-cdp-session) and [`browser.newBrowserCDPSession()`](/java/api/class-browser#browser-new-browser-cdp-session) create a [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) session for the page and browser respectively.
  
  ```java
  CDPSession cdpSession = page.context().newCDPSession(page);
  cdpSession.send("Runtime.enable");
  
  JsonObject params = new JsonObject();
  params.addProperty("expression", "window.foo = 'bar'");
  cdpSession.send("Runtime.evaluate", params);
  
  Object foo = page.evaluate("window['foo']");
  assertEquals("bar", foo);
  ```

### 📚 Debian 12 Bookworm Support

Playwright now supports Debian 12 Bookworm on both x86_64 and arm64 for Chromium, Firefox and WebKit.
Let us know if you encounter any issues!

Linux support looks like this:

|          | Ubuntu 20.04 | Ubuntu 22.04 | Debian 11 | Debian 12 |
| :--- | :---: | :---: | :---: | :---: |
| Chromium | ✅ | ✅ | ✅ | ✅ |
| WebKit | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ | ✅ |

### Browser Versions
* Chromium 116.0.5845.82
* Mozilla Firefox 115.0
* WebKit 17.0

This version was also tested against the following stable channels:
* Google Chrome 115
* Microsoft Edge 115

## Version 1.36

🏝️ Summer maintenance release.

### Browser Versions
* Chromium 115.0.5790.75
* Mozilla Firefox 115.0
* WebKit 17.0

This version was also tested against the following stable channels:
* Google Chrome 114
* Microsoft Edge 114

## Version 1.35

### Highlights
* New option `maskColor` for methods [`page.screenshot()`](/java/api/class-page#page-screenshot) and [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) to change default masking color.
* New `uninstall` CLI command to uninstall browser binaries:
  
  ```bash
  $ mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="uninstall" # remove browsers installed by this installation
  $ mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="uninstall --all" # remove all ever-install Playwright browsers
  ```

### Browser Versions
* Chromium 115.0.5790.13
* Mozilla Firefox 113.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 114
* Microsoft Edge 114

## Version 1.34

### Highlights
* New [`locator.and()`](/java/api/class-locator#locator-and) to create a locator that matches both locators.
  
  ```java
  Locator button = page.getByRole(AriaRole.BUTTON).and(page.getByTitle("Subscribe"));
  ```
* New events [`browserContext.onConsoleMessage()`](/java/api/class-browsercontext#browser-context-event-console) and [`browserContext.onDialog()`](/java/api/class-browsercontext#browser-context-event-dialog) to subscribe to any dialogs
  and console messages from any page from the given browser context. Use the new methods [`consoleMessage.page()`](/java/api/class-consolemessage#console-message-page)
  and [`dialog.page()`](/java/api/class-dialog#dialog-page) to pin-point event source.

### Browser Versions
* Chromium 114.0.5735.26
* Mozilla Firefox 113.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 113
* Microsoft Edge 113

## Version 1.33

### Locators Update
* Use [`locator.or()`](/java/api/class-locator#locator-or) to create a locator that matches either of the two locators.
  Consider a scenario where you'd like to click on a "New email" button, but sometimes a security settings dialog shows up instead.
  In this case, you can wait for either a "New email" button, or a dialog and act accordingly:
  
  ```java
  Locator newEmail = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("New email"));
  Locator dialog = page.getByText("Confirm security settings");
  assertThat(newEmail.or(dialog)).isVisible();
  if (dialog.isVisible())
    page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Dismiss")).click();
  newEmail.click();
  ```
* Use new options [`hasNot`](/java/api/class-locator#locator-filter-option-has-not) and [`hasNotText`](/java/api/class-locator#locator-filter-option-has-not-text) in [`locator.filter()`](/java/api/class-locator#locator-filter)
  to find elements that **do not match** certain conditions.
  
  ```java
  Locator rowLocator = page.locator("tr");
  rowLocator
      .filter(new Locator.FilterOptions().setHasNotText("text in column 1"))
      .filter(new Locator.FilterOptions().setHasNot(
        page.getByRole(AriaRole.BUTTON,
          new Page.GetByRoleOptions().setName("column 2 button" ))))
      .screenshot();
  ```
* Use new web-first assertion [`locatorAssertions.isAttached()`](/java/api/class-locatorassertions#locator-assertions-to-be-attached) to ensure that the element
  is present in the page's DOM. Do not confuse with the [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible) that ensures that
  element is both attached & visible.

### New APIs
- [`locator.or()`](/java/api/class-locator#locator-or)
- New option [`hasNot`](/java/api/class-locator#locator-filter-option-has-not) in [`locator.filter()`](/java/api/class-locator#locator-filter)
- New option [`hasNotText`](/java/api/class-locator#locator-filter-option-has-not-text) in [`locator.filter()`](/java/api/class-locator#locator-filter)
- [`locatorAssertions.isAttached()`](/java/api/class-locatorassertions#locator-assertions-to-be-attached)
- New option [`timeout`](/java/api/class-route#route-fetch-option-timeout) in [`route.fetch()`](/java/api/class-route#route-fetch)

### Other highlights
- Native support for Apple Silicon - Playwright now runs without Rosetta
- Added Ubuntu 22.04 (Jammy) Docker image

### ⚠️ Breaking change
* The `mcr.microsoft.com/playwright/java:v1.33.0` now serves a Playwright image based on Ubuntu Jammy.
  To use the focal-based image, please use `mcr.microsoft.com/playwright/java:v1.33.0-focal` instead.

### Browser Versions
* Chromium 113.0.5672.53
* Mozilla Firefox 112.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 112
* Microsoft Edge 112

## Version 1.32

### New APIs
- New options [`updateMode`](/java/api/class-page#page-route-from-har-option-update-mode) and [`updateContent`](/java/api/class-page#page-route-from-har-option-update-content) in [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) and [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har).
- Chaining existing locator objects, see [locator docs](./locators.md#matching-inside-a-locator) for details.
- New option [`name`](/java/api/class-tracing#tracing-start-chunk-option-name) in method [`tracing.startChunk()`](/java/api/class-tracing#tracing-start-chunk).

### Browser Versions
* Chromium 112.0.5615.29
* Mozilla Firefox 111.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 111
* Microsoft Edge 111

## Version 1.31

### New APIs
- New assertion [`locatorAssertions.isInViewport()`](/java/api/class-locatorassertions#locator-assertions-to-be-in-viewport) ensures that locator points to an element that intersects viewport, according to the [intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
  
  ```java
  Locator locator = page.getByRole(AriaRole.BUTTON);
  
  // Make sure at least some part of element intersects viewport.
  assertThat(locator).isInViewport();
  
  // Make sure element is fully outside of viewport.
  assertThat(locator).not().isInViewport();
  
  // Make sure that at least half of the element intersects viewport.
  assertThat(locator).isInViewport(new LocatorAssertions.IsInViewportOptions().setRatio(0.5));
  ```

### Miscellaneous
- DOM snapshots in trace viewer can be now opened in a separate window.
- New option [`maxRedirects`](/java/api/class-route#route-fetch-option-max-redirects) for method [`route.fetch()`](/java/api/class-route#route-fetch).
- Playwright now supports Debian 11 arm64.
- Official [docker images](./docker.md) now include Node 18 instead of Node 16.

### Browser Versions
* Chromium 111.0.5563.19
* Mozilla Firefox 109.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 110
* Microsoft Edge 110

## Version 1.30

### Browser Versions
* Chromium 110.0.5481.38
* Mozilla Firefox 108.0.2
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 109
* Microsoft Edge 109

## Version 1.29

### New APIs
- New method [`route.fetch()`](/java/api/class-route#route-fetch):
  
  ```java
  page.route("**/api/settings", route -> {
    // Fetch original settings.
    APIResponse response = route.fetch();
    // Force settings theme to a predefined value.
    String body = response.text().replace("\"theme\":\"default\"",
      "\"theme\":\"Solorized\"");
    // Fulfill with modified data.
    route.fulfill(new Route.FulfillOptions().setResponse(response).setBody(body));
  });
  ```
- New method [`locator.all()`](/java/api/class-locator#locator-all) to iterate over all matching elements:
  
  ```java
  // Check all checkboxes!
  Locator checkboxes = page.getByRole(AriaRole.CHECKBOX);
  for (Locator checkbox : checkboxes.all())
    checkbox.check();
  ```
- [`locator.selectOption()`](/java/api/class-locator#locator-select-option) matches now by value or label:
  
  ```html
  <select multiple>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
  </select>
  ```
  
  ```java
  element.selectOption("Red");
  ```

### Browser Versions
* Chromium 109.0.5414.46
* Mozilla Firefox 107.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 108
* Microsoft Edge 108

## Version 1.28

### Playwright Tools
* **Live Locators in CodeGen.** Generate a locator for any element on the page using "Explore" tool.

<img src="https://user-images.githubusercontent.com/9798949/202293631-2f402cc2-35fb-4877-8ea1-82265fbbc232.png" alt="Locator Explorer" width="1876" height="1096" />

### New APIs
- [`locator.blur()`](/java/api/class-locator#locator-blur)
- [`locator.clear()`](/java/api/class-locator#locator-clear)

### Browser Versions
* Chromium 108.0.5359.29
* Mozilla Firefox 106.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 107
* Microsoft Edge 107

## Version 1.27

### Locators

With these new APIs writing locators is a joy:
- [`page.getByText()`](/java/api/class-page#page-get-by-text) to locate by text content.
- [`page.getByRole()`](/java/api/class-page#page-get-by-role) to locate by [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
- [`page.getByLabel()`](/java/api/class-page#page-get-by-label) to locate a form control by associated label's text.
- [`page.getByTestId()`](/java/api/class-page#page-get-by-test-id) to locate an element based on its `data-testid` attribute (other attribute can be configured).
- [`page.getByPlaceholder()`](/java/api/class-page#page-get-by-placeholder) to locate an input by placeholder.
- [`page.getByAltText()`](/java/api/class-page#page-get-by-alt-text) to locate an element, usually image, by its text alternative.
- [`page.getByTitle()`](/java/api/class-page#page-get-by-title) to locate an element by its title.

```java
page.getByLabel("User Name").fill("John");

page.getByLabel("Password").fill("secret-password");

page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign in")).click();

assertThat(page.getByText("Welcome, John!")).isVisible();
```

All the same methods are also available on [Locator](/java/api/class-locator), [FrameLocator](/java/api/class-framelocator) and [Frame](/java/api/class-frame) classes.

### Other highlights
- As announced in v1.25, Ubuntu 18 will not be supported as of Dec 2022. In addition to that, there will be no WebKit updates on Ubuntu 18 starting from the next Playwright release.

### Behavior Changes
- [`locatorAssertions.hasAttribute()`](/java/api/class-locatorassertions#locator-assertions-to-have-attribute) with an empty value does not match missing attribute anymore. For example, the following snippet will succeed when `button` **does not** have a `disabled` attribute.
  
  ```java
  assertThat(page.getByRole(AriaRole.BUTTON)).hasAttribute("disabled", "");
  ```

### Browser Versions
* Chromium 107.0.5304.18
* Mozilla Firefox 105.0.1
* WebKit 16.0

This version was also tested against the following stable channels:
* Google Chrome 106
* Microsoft Edge 106

## Version 1.26

### Assertions
- New option `enabled` for [`locatorAssertions.isEnabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-enabled).
- [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) now pierces open shadow roots.
- New option `editable` for [`locatorAssertions.isEditable()`](/java/api/class-locatorassertions#locator-assertions-to-be-editable).
- New option `visible` for [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible).

### Other highlights
- New option `setMaxRedirects` for [`apiRequestContext.get()`](/java/api/class-apirequestcontext#api-request-context-get) and others to limit redirect count.
- Docker images are now using OpenJDK 17.

### Behavior Change

A bunch of Playwright APIs already support the `setWaitUntil(WaitUntilState.DOMCONTENTLOADED)` option.
For example:

```java
page.navigate("https://playwright.dev", new Page.NavigateOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED));
```

Prior to 1.26, this would wait for all iframes to fire the `DOMContentLoaded`
event.

To align with web specification, the `WaitUntilState.DOMCONTENTLOADED` value only waits for
the target frame to fire the `'DOMContentLoaded'` event. Use `setWaitUntil(WaitUntilState.LOAD)` to wait for all iframes.

### Browser Versions
* Chromium 106.0.5249.30
* Mozilla Firefox 104.0
* WebKit 16.0

This version was also tested against the following stable channels:
* Google Chrome 105
* Microsoft Edge 105

## Version 1.25

### New APIs & changes
- Default assertions timeout now can be changed with [`setDefaultAssertionTimeout`](./api/class-playwrightassertions#playwright-assertions-set-default-assertion-timeout).

### Announcements
* 🪦 This is the last release with macOS 10.15 support (deprecated as of 1.21).
* ⚠️ Ubuntu 18 is now deprecated and will not be supported as of Dec 2022.

### Browser Versions
* Chromium 105.0.5195.19
* Mozilla Firefox 103.0
* WebKit 16.0

This version was also tested against the following stable channels:
* Google Chrome 104
* Microsoft Edge 104

## Version 1.24

<LiteYouTube
id="9F05o1shxcY"
title="Playwright 1.24"
/>

### 🐂 Debian 11 Bullseye Support

Playwright now supports Debian 11 Bullseye on x86_64 for Chromium, Firefox and WebKit. Let us know
if you encounter any issues!

Linux support looks like this:

|          | Ubuntu 20.04 | Ubuntu 22.04 | Debian 11
| :--- | :---: | :---: | :---: | :---: |
| Chromium | ✅ | ✅ | ✅ |
| WebKit | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |

## Version 1.23

### Network Replay

Now you can record network traffic into a HAR file and re-use this traffic in your tests.

To record network into HAR file:

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="open --save-har=example.har --save-har-glob='**/api/**' https://example.com"
```

Alternatively, you can record HAR programmatically:

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
    .setRecordHarPath(Paths.get("example.har"))
    .setRecordHarUrlFilter("**/api/**"));

// ... Perform actions ...

// Close context to ensure HAR is saved to disk.
context.close();
```

Use the new methods [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) or [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har) to serve matching responses from the [HAR](http://www.softwareishard.com/blog/har-12-spec/) file:

```java
context.routeFromHAR(Paths.get("example.har"));
```

Read more in [our documentation](./mock.md#mocking-with-har-files).

### Advanced Routing

You can now use [`route.fallback()`](/java/api/class-route#route-fallback) to defer routing to other handlers.

Consider the following example:

```java
// Remove a header from all requests.
page.route("**/*", route -> {
  Map<String, String> headers = new HashMap<>(route.request().headers());
  headers.remove("X-Secret");
  route.resume(new Route.ResumeOptions().setHeaders(headers));
});

// Abort all images.
page.route("**/*", route -> {
  if ("image".equals(route.request().resourceType()))
    route.abort();
  else
    route.fallback();
});
```

Note that the new methods [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) and [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har) also participate in routing and could be deferred to.

### Web-First Assertions Update
* New method [`locatorAssertions.hasValues()`](/java/api/class-locatorassertions#locator-assertions-to-have-values) that asserts all selected values of `<select multiple>` element.
* Methods [`locatorAssertions.containsText()`](/java/api/class-locatorassertions#locator-assertions-to-contain-text) and [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) now accept `ignoreCase` option.

### Miscellaneous
* If there's a service worker that's in your way, you can now easily disable it with a new context option `serviceWorkers`:
  
  ```java
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setServiceWorkers(ServiceWorkerPolicy.BLOCK));
  ```
* Using `.zip` path for `recordHar` context option automatically zips the resulting HAR:
  
  ```java
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setRecordHarPath(Paths.get("example.har.zip")));
  ```
* If you intend to edit HAR by hand, consider using the `"minimal"` HAR recording mode
  that only records information that is essential for replaying:
  
  ```java
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setRecordHarPath(Paths.get("example.har"))
      .setRecordHarMode(HarMode.MINIMAL));
  ```
* Playwright now runs on Ubuntu 22 amd64 and Ubuntu 22 arm64.

## Version 1.22

### Highlights
- Role selectors that allow selecting elements by their [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  
  ```java
  // Click a button with accessible name "log in"
  page.locator("role=button[name='log in']").click();
  ```
  
  Read more in [our documentation](./locators.md#locate-by-role).
- New [`locator.filter()`](/java/api/class-locator#locator-filter) API to filter an existing locator
  
  ```java
  Locator buttonsLocator = page.locator("role=button");
  // ...
  Locator submitButton = buttonsLocator.filter(new Locator.FilterOptions().setHasText("Submit"));
  submitButton.click();
  ```
- Playwright for Java now supports **Ubuntu 20.04 ARM64** and **Apple M1**.
  You can now run Playwright for Java tests on Apple M1, inside Docker on Apple M1, and on Raspberry Pi.

## Version 1.21

### Highlights
- New role selectors that allow selecting elements by their [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  
  ```java
  // Click a button with accessible name "log in"
  page.locator("role=button[name='log in']").click();
  ```
  
  Read more in [our documentation](./locators.md#locate-by-role).
- New `scale` option in [`page.screenshot()`](/java/api/class-page#page-screenshot) for smaller sized screenshots.
- New `caret` option in [`page.screenshot()`](/java/api/class-page#page-screenshot) to control text caret. Defaults to `"hide"`.

### Behavior Changes
- Playwright now supports large file uploads (100s of MBs) via [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) API.

### Browser Versions
- Chromium 101.0.4951.26
- Mozilla Firefox 98.0.2
- WebKit 15.4

This version was also tested against the following stable channels:
- Google Chrome 100
- Microsoft Edge 100

## Version 1.20

### Highlights
- New options for methods [`page.screenshot()`](/java/api/class-page#page-screenshot), [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) and [`elementHandle.screenshot()`](/java/api/class-elementhandle#element-handle-screenshot):
  * Option `ScreenshotAnimations.DISABLED` rewinds all CSS animations and transitions to a consistent state
  * Option `mask: Locator[]` masks given elements, overlaying them with pink `#FF00FF` boxes.
- [Trace Viewer](./trace-viewer) now shows [API testing requests](./api-testing).
- [`locator.highlight()`](/java/api/class-locator#locator-highlight) visually reveals element(s) for easier debugging.

### Announcements
- v1.20 is the last release to receive WebKit update for macOS 10.15 Catalina. Please update macOS to keep using latest & greatest WebKit!

### Browser Versions
- Chromium 101.0.4921.0
- Mozilla Firefox 97.0.1
- WebKit 15.4

This version was also tested against the following stable channels:
- Google Chrome 99
- Microsoft Edge 99

## Version 1.19

### Highlights
- Locator now supports a `has` option that makes sure it contains another locator inside:
  
  ```java
  page.locator("article", new Page.LocatorOptions().setHas(page.locator(".highlight"))).click();
  ```
  
  Read more in [locator documentation](./api/class-locator#locator-locator)
- New [`locator.page()`](/java/api/class-locator#locator-page)
- [`page.screenshot()`](/java/api/class-page#page-screenshot) and [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) now automatically hide blinking caret
- Playwright Codegen now generates locators and frame locators

### Browser Versions
- Chromium 100.0.4863.0
- Mozilla Firefox 96.0.1
- WebKit 15.4

This version was also tested against the following stable channels:
- Google Chrome 98
- Microsoft Edge 98

## Version 1.18

### API Testing

Playwright for Java 1.18 introduces new [API Testing](./api/class-apirequestcontext) that lets you send requests to the server directly from Java!
Now you can:
- test your server API
- prepare server side state before visiting the web application in a test
- validate server side post-conditions after running some actions in the browser

To do a request on behalf of Playwright's Page, use **new [`page.request()`](/java/api/class-page#page-request) API**:

```java
// Do a GET request on behalf of page
APIResponse res = page.request().get("http://example.com/foo.json");
```

Read more about it in our [API testing guide](./api-testing).

### Web-First Assertions

Playwright for Java 1.18 introduces [Web-First Assertions](./test-assertions).

Consider the following example:

```java
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class TestExample {
  @Test
  void statusBecomesSubmitted() {
    // ...
    page.locator("#submit-button").click();
    assertThat(page.locator(".status")).hasText("Submitted");
  }
}
```

Playwright will be re-testing the node with the selector `.status` until
fetched Node has the `"Submitted"` text. It will be re-fetching the node and
checking it over and over, until the condition is met or until the timeout is
reached. You can pass this timeout as an option.

Read more in [our documentation](./test-assertions).

### Locator Improvements
- [`locator.dragTo()`](/java/api/class-locator#locator-drag-to)
- Each locator can now be optionally filtered by the text it contains:
  
  ```java
  page.locator("li", new Page.LocatorOptions().setHasText("my item"))
      .locator("button").click();
  ```
  
  Read more in [locator documentation](./api/class-locator#locator-locator)

### Tracing Improvements

[Tracing](./api/class-tracing.md) now can embed Java sources to recorded
traces, using new [`setSources`](./api/class-tracing#tracing-start-option-sources) option.

<img src="https://user-images.githubusercontent.com/746130/150180856-40a7df71-370c-4597-8665-40c77a5e06ad.png" alt="tracing-java-sources" width="1517" height="856" />

### New APIs & changes
- [`acceptDownloads`](./api/class-browser#browser-new-context-option-accept-downloads) option now defaults to `true`.

### Browser Versions
- Chromium 99.0.4812.0
- Mozilla Firefox 95.0
- WebKit 15.4

This version was also tested against the following stable channels:
- Google Chrome 97
- Microsoft Edge 97

## Version 1.17

### Frame Locators

Playwright 1.17 introduces [frame locators](./api/class-framelocator) - a locator to the iframe on the page. Frame locators capture the logic sufficient to retrieve the `iframe` and then locate elements in that iframe. Frame locators are strict by default, will wait for `iframe` to appear and can be used in Web-First assertions.

<img src="https://user-images.githubusercontent.com/746130/142082759-2170db38-370d-43ec-8d41-5f9941f57d83.png" alt="Graphics" width="600" height="237" />

Frame locators can be created with either [`page.frameLocator()`](/java/api/class-page#page-frame-locator) or [`locator.frameLocator()`](/java/api/class-locator#locator-frame-locator) method.

```java
Locator locator = page.frameLocator("#my-frame").locator("text=Submit");
locator.click();
```

Read more at [our documentation](./api/class-framelocator).

### Trace Viewer Update

Playwright Trace Viewer is now **available online** at https://trace.playwright.dev! Just drag-and-drop your `trace.zip` file to inspect its contents.

> **NOTE**: trace files are not uploaded anywhere; [trace.playwright.dev](https://trace.playwright.dev) is a [progressive web application](https://web.dev/progressive-web-apps/) that processes traces locally.
- Playwright Test traces now include sources by default (these could be turned off with tracing option)
- Trace Viewer now shows test name
- New trace metadata tab with browser details
- Snapshots now have URL bar

<img src="https://user-images.githubusercontent.com/746130/141877831-29e37cd1-e574-4bd9-aab5-b13a463bb4ae.png" alt="image" width="2230" height="1562" />

### HTML Report Update
- HTML report now supports dynamic filtering
- Report is now a **single static HTML file** that could be sent by e-mail or as a slack attachment.

<img src="https://user-images.githubusercontent.com/746130/141877402-e486643d-72c7-4db3-8844-ed2072c5d676.png" alt="image" width="2494" height="1624" />

### Ubuntu ARM64 support + more
- Playwright now supports **Ubuntu 20.04 ARM64**. You can now run Playwright tests inside Docker on Apple M1 and on Raspberry Pi.
- You can now use Playwright to install stable version of Edge on Linux:
  
  ```bash
  mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install msedge"
  ```

### New APIs
- Tracing now supports a [`'title'`](./api/class-tracing#tracing-start-option-title) option
- Page navigations support a new [`'commit'`](./api/class-page#page-goto) waiting option

## Version 1.16

### 🎭 Playwright Library

#### Locator.waitFor

Wait for a locator to resolve to a single element with a given state.
Defaults to the `state: 'visible'`.

```java
Locator orderSent = page.locator("#order-sent");
orderSent.waitFor();
```

Read more about [`locator.waitFor()`](/java/api/class-locator#locator-wait-for).

### 🎭 Playwright Trace Viewer
- run trace viewer with `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="show-trace"` and drop trace files to the trace viewer PWA
- better visual attribution of action targets

Read more about [Trace Viewer](./trace-viewer).

### Browser Versions
- Chromium 97.0.4666.0
- Mozilla Firefox 93.0
- WebKit 15.4

This version of Playwright was also tested against the following stable channels:
- Google Chrome 94
- Microsoft Edge 94

## Version 1.15

### 🖱️ Mouse Wheel

By using [`mouse.wheel()`](/java/api/class-mouse#mouse-wheel) you are now able to scroll vertically or horizontally.

### 📜 New Headers API

Previously it was not possible to get multiple header values of a response. This is now possible and additional helper functions are available:
- [`request.allHeaders()`](/java/api/class-request#request-all-headers)
- [`request.headersArray()`](/java/api/class-request#request-headers-array)
- [`request.headerValue()`](/java/api/class-request#request-header-value)
- [`response.allHeaders()`](/java/api/class-response#response-all-headers)
- [`response.headersArray()`](/java/api/class-response#response-headers-array)
- [`response.headerValue()`](/java/api/class-response#response-header-value)
- [`response.headerValues()`](/java/api/class-response#response-header-values)

### 🌈 Forced-Colors emulation

Its now possible to emulate the `forced-colors` CSS media feature by passing it in the [`browser.newContext()`](/java/api/class-browser#browser-new-context) or calling [`page.emulateMedia()`](/java/api/class-page#page-emulate-media).

### New APIs
- [`page.route()`](/java/api/class-page#page-route) accepts new `times` option to specify how many times this route should be matched.
- [`page.setChecked()`](/java/api/class-page#page-set-checked) and [`locator.setChecked()`](/java/api/class-locator#locator-set-checked) were introduced to set the checked state of a checkbox.
- [`request.sizes()`](/java/api/class-request#request-sizes) Returns resource size information for given http request.
- [`tracing.startChunk()`](/java/api/class-tracing#tracing-start-chunk) - Start a new trace chunk.
- [`tracing.stopChunk()`](/java/api/class-tracing#tracing-stop-chunk) - Stops a new trace chunk.

### Browser Versions
- Chromium 96.0.4641.0
- Mozilla Firefox 92.0
- WebKit 15.0

## Version 1.14

#### ⚡️ New "strict" mode

Selector ambiguity is a common problem in automation testing. **"strict" mode**
ensures that your selector points to a single element and throws otherwise.

Set `setStrict(true)` in your action calls to opt in.

```java
// This will throw if you have more than one button!
page.click("button", new Page.ClickOptions().setStrict(true));
```

#### 📍 New [**Locators API**](./api/class-locator)

Locator represents a view to the element(s) on the page. It captures the logic sufficient to retrieve the element at any given moment.

The difference between the [Locator](./api/class-locator) and [ElementHandle](./api/class-elementhandle) is that the latter points to a particular element, while [Locator](./api/class-locator) captures the logic of how to retrieve that element.

Also, locators are **"strict" by default**!

```java
Locator locator = page.locator("button");
locator.click();
```

Learn more in the [documentation](./api/class-locator).

#### 🧩 Experimental [**React**](./other-locators.md) and [**Vue**](./other-locators.md) selector engines

React and Vue selectors allow selecting elements by its component name and/or property values. The syntax is very similar to [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) and supports all attribute selector operators.

```java
page.locator("_react=SubmitButton[enabled=true]").click();
page.locator("_vue=submit-button[enabled=true]").click();
```

Learn more in the [react selectors documentation](./other-locators.md) and the [vue selectors documentation](./other-locators.md).

#### ✨ New [**`nth`**](./other-locators.md#n-th-element-locator) and [**`visible`**](./other-locators.md#css-matching-only-visible-elements) selector engines
- [`nth`](./other-locators.md#n-th-element-locator) selector engine is equivalent to the `:nth-match` pseudo class, but could be combined with other selector engines.
- [`visible`](./other-locators.md#css-matching-only-visible-elements) selector engine is equivalent to the `:visible` pseudo class, but could be combined with other selector engines.

```java
// select the first button among all buttons
button.click("button >> nth=0");
// or if you are using locators, you can use first(), nth() and last()
page.locator("button").first().click();

// click a visible button
button.click("button >> visible=true");
```

### Browser Versions
- Chromium 94.0.4595.0
- Mozilla Firefox 91.0
- WebKit 15.0

## Version 1.13

#### Playwright
- **🖖 Programmatic drag-and-drop support** via the [`page.dragAndDrop()`](/java/api/class-page#page-drag-and-drop) API.
- **🔎 Enhanced HAR** with body sizes for requests and responses. Use via `recordHar` option in [`browser.newContext()`](/java/api/class-browser#browser-new-context).

#### Tools
- Playwright Trace Viewer now shows parameters, returned values and `console.log()` calls.

#### New and Overhauled Guides
- [Intro](./intro.md)
- [Authentication](./auth.md)

#### Browser Versions
- Chromium 93.0.4576.0
- Mozilla Firefox 90.0
- WebKit 14.2

#### New Playwright APIs
- new `baseURL` option in [`browser.newContext()`](/java/api/class-browser#browser-new-context) and [`browser.newPage()`](/java/api/class-browser#browser-new-page)
- [`response.securityDetails()`](/java/api/class-response#response-security-details) and [`response.serverAddr()`](/java/api/class-response#response-server-addr)
- [`page.dragAndDrop()`](/java/api/class-page#page-drag-and-drop) and [`frame.dragAndDrop()`](/java/api/class-frame#frame-drag-and-drop)
- [`download.cancel()`](/java/api/class-download#download-cancel)
- [`page.inputValue()`](/java/api/class-page#page-input-value), [`frame.inputValue()`](/java/api/class-frame#frame-input-value) and [`elementHandle.inputValue()`](/java/api/class-elementhandle#element-handle-input-value)
- new `force` option in [`page.fill()`](/java/api/class-page#page-fill), [`frame.fill()`](/java/api/class-frame#frame-fill), and [`elementHandle.fill()`](/java/api/class-elementhandle#element-handle-fill)
- new `force` option in [`page.selectOption()`](/java/api/class-page#page-select-option), [`frame.selectOption()`](/java/api/class-frame#frame-select-option), and [`elementHandle.selectOption()`](/java/api/class-elementhandle#element-handle-select-option)

## Version 1.12

#### 🧟‍♂️ Introducing Playwright Trace Viewer

[Playwright Trace Viewer](./trace-viewer.md) is a new GUI tool that helps exploring recorded Playwright traces after the script ran. Playwright traces let you examine:
- page DOM before and after each Playwright action
- page rendering before and after each Playwright action
- browser network during script execution

Traces are recorded using the new [`browserContext.tracing()`](/java/api/class-browsercontext#browser-context-tracing) API:

```java
Browser browser = playwright.chromium().launch();
BrowserContext context = browser.newContext();

// Start tracing before creating / navigating a page.
context.tracing().start(new Tracing.StartOptions()
  .setScreenshots(true)
  .setSnapshots(true));

Page page = context.newPage();
page.navigate("https://playwright.dev");

// Stop tracing and export it into a zip archive.
context.tracing().stop(new Tracing.StopOptions()
  .setPath(Paths.get("trace.zip")));
```

Traces are examined later with the Playwright CLI:

```sh
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="show-trace trace.zip"
```

That will open the following GUI:

<img src="https://user-images.githubusercontent.com/746130/121109654-d66c4480-c7c0-11eb-8d4d-eb70d2b03811.png" alt="image" width="2424" height="1544" />

👉 Read more in [trace viewer documentation](./trace-viewer.md).

#### Browser Versions
- Chromium 93.0.4530.0
- Mozilla Firefox 89.0
- WebKit 14.2

This version of Playwright was also tested against the following stable channels:
- Google Chrome 91
- Microsoft Edge 91

#### New APIs
- `reducedMotion` option in [`page.emulateMedia()`](/java/api/class-page#page-emulate-media), [`browserType.launchPersistentContext()`](/java/api/class-browsertype#browser-type-launch-persistent-context), [`browser.newContext()`](/java/api/class-browser#browser-new-context) and [`browser.newPage()`](/java/api/class-browser#browser-new-page)
- [`browserContext.onRequest()`](/java/api/class-browsercontext#browser-context-event-request)
- [`browserContext.onRequestFailed()`](/java/api/class-browsercontext#browser-context-event-request-failed)
- [`browserContext.onRequestFinished()`](/java/api/class-browsercontext#browser-context-event-request-finished)
- [`browserContext.onResponse()`](/java/api/class-browsercontext#browser-context-event-response)
- `tracesDir` option in [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) and [`browserType.launchPersistentContext()`](/java/api/class-browsertype#browser-type-launch-persistent-context)
- new [`browserContext.tracing()`](/java/api/class-browsercontext#browser-context-tracing) API namespace
- new [`download.page()`](/java/api/class-download#download-page) method

## Version 1.11

🎥  New video: [Playwright: A New Test Automation Framework for the Modern Web](https://youtu.be/_Jla6DyuEu4) ([slides](https://docs.google.com/presentation/d/1xFhZIJrdHkVe2CuMKOrni92HoG2SWslo0DhJJQMR1DI/edit?usp=sharing))
- We talked about Playwright
- Showed engineering work behind the scenes
- Did live demos with new features ✨
- **Special thanks** to [applitools](http://applitools.com/) for hosting the event and inviting us!

#### Browser Versions
- Chromium 92.0.4498.0
- Mozilla Firefox 89.0b6
- WebKit 14.2

#### New APIs
- support for **async predicates** across the API in methods such as [`page.waitForRequest()`](/java/api/class-page#page-wait-for-request) and others
- new **emulation devices**: Galaxy S8, Galaxy S9+, Galaxy Tab S4, Pixel 3, Pixel 4
- new methods:
  * [`page.waitForURL()`](/java/api/class-page#page-wait-for-url) to await navigations to URL
  * [`video.delete()`](/java/api/class-video#video-delete) and [`video.saveAs()`](/java/api/class-video#video-save-as) to manage screen recording
- new options:
  * `screen` option in the [`browser.newContext()`](/java/api/class-browser#browser-new-context) method to emulate `window.screen` dimensions
  * `position` option in [`page.check()`](/java/api/class-page#page-check) and [`page.uncheck()`](/java/api/class-page#page-uncheck) methods
  * `trial` option to dry-run actions in [`page.check()`](/java/api/class-page#page-check), [`page.uncheck()`](/java/api/class-page#page-uncheck), [`page.click()`](/java/api/class-page#page-click), [`page.dblclick()`](/java/api/class-page#page-dblclick), [`page.hover()`](/java/api/class-page#page-hover) and [`page.tap()`](/java/api/class-page#page-tap)

## Version 1.10
- [Playwright for Java v1.10](https://github.com/microsoft/playwright-java) is **now stable**!
- Run Playwright against **Google Chrome** and **Microsoft Edge** stable channels with the [new channels API](./browsers).
- Chromium screenshots are **fast** on Mac & Windows.

#### Bundled Browser Versions
- Chromium 90.0.4430.0
- Mozilla Firefox 87.0b10
- WebKit 14.2

This version of Playwright was also tested against the following stable channels:
- Google Chrome 89
- Microsoft Edge 89

#### New APIs
- [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) now accepts the new `'channel'` option. Read more in [our documentation](./browsers).

## Version 1.9
- [Playwright Inspector](./debug.md) is a **new GUI tool** to author and debug your tests.
  - **Line-by-line debugging** of your Playwright scripts, with play, pause and step-through.
  - Author new scripts by **recording user actions**.
  - **Generate element selectors** for your script by hovering over elements.
  - Set the `PWDEBUG=1` environment variable to launch the Inspector
- **Pause script execution** with [`page.pause()`](/java/api/class-page#page-pause) in headed mode. Pausing the page launches [Playwright Inspector](./debug.md) for debugging.
- **New has-text pseudo-class** for CSS selectors. `:has-text("example")` matches any element containing `"example"` somewhere inside, possibly in a child or a descendant element. See [more examples](./other-locators.md#css-matching-by-text).
- **Page dialogs are now auto-dismissed** during execution, unless a listener for `dialog` event is configured. [Learn more](./dialogs.md) about this.
- [Playwright for Python](https://github.com/microsoft/playwright-python) is **now stable** with an idiomatic snake case API and pre-built [Docker image](./docker.md) to run tests in CI/CD.

#### Browser Versions
- Chromium 90.0.4421.0
- Mozilla Firefox 86.0b10
- WebKit 14.1

#### New APIs
- [`page.pause()`](/java/api/class-page#page-pause).

## Version 1.8
- [Selecting elements based on layout](./other-locators.md#css-matching-elements-based-on-layout) with `:left-of()`, `:right-of()`, `:above()` and `:below()`.
- Playwright now includes command line interface, former playwright-cli.
  
  ```bash
  mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="--help"
  ```
- [`page.selectOption()`](/java/api/class-page#page-select-option) now waits for the options to be present.
- New methods to [assert element state](./actionability#assertions) like [`page.isEditable()`](/java/api/class-page#page-is-editable).

#### New APIs
- [`elementHandle.isChecked()`](/java/api/class-elementhandle#element-handle-is-checked).
- [`elementHandle.isDisabled()`](/java/api/class-elementhandle#element-handle-is-disabled).
- [`elementHandle.isEditable()`](/java/api/class-elementhandle#element-handle-is-editable).
- [`elementHandle.isEnabled()`](/java/api/class-elementhandle#element-handle-is-enabled).
- [`elementHandle.isHidden()`](/java/api/class-elementhandle#element-handle-is-hidden).
- [`elementHandle.isVisible()`](/java/api/class-elementhandle#element-handle-is-visible).
- [`page.isChecked()`](/java/api/class-page#page-is-checked).
- [`page.isDisabled()`](/java/api/class-page#page-is-disabled).
- [`page.isEditable()`](/java/api/class-page#page-is-editable).
- [`page.isEnabled()`](/java/api/class-page#page-is-enabled).
- [`page.isHidden()`](/java/api/class-page#page-is-hidden).
- [`page.isVisible()`](/java/api/class-page#page-is-visible).
- New option `'editable'` in [`elementHandle.waitForElementState()`](/java/api/class-elementhandle#element-handle-wait-for-element-state).

#### Browser Versions
- Chromium 90.0.4392.0
- Mozilla Firefox 85.0b5
- WebKit 14.1

## Version 1.7
- **New Java SDK**: [Playwright for Java](https://github.com/microsoft/playwright-java) is now on par with [JavaScript](https://github.com/microsoft/playwright), [Python](https://github.com/microsoft/playwright-python) and [.NET bindings](https://github.com/microsoft/playwright-dotnet).
- **Browser storage API**: New convenience APIs to save and load browser storage state (cookies, local storage) to simplify automation scenarios with authentication.
- **New CSS selectors**: We heard your feedback for more flexible selectors and have revamped the selectors implementation. Playwright 1.7 introduces [new CSS extensions](./other-locators.md#css-locator) and there's more coming soon.
- **New website**: The docs website at [playwright.dev](https://playwright.dev/) has been updated and is now built with [Docusaurus](https://v2.docusaurus.io/).
- **Support for Apple Silicon**: Playwright browser binaries for WebKit and Chromium are now built for Apple Silicon.

#### New APIs
- [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state) to get current state for later reuse.
- `storageState` option in [`browser.newContext()`](/java/api/class-browser#browser-new-context) and [`browser.newPage()`](/java/api/class-browser#browser-new-page) to setup browser context state.

#### Browser Versions
- Chromium 89.0.4344.0
- Mozilla Firefox 84.0b9
- WebKit 14.1
