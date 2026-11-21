---
title: "Release notes"
---

# Release notes

import LiteYouTube from '@site/src/components/LiteYouTube';

## Version 1.65

### 🧾 Locator code in C#

A locator from [`Locator.NormalizeAsync()`](/dotnet/api/class-locator#locator-normalize) now converts to a string as C# code. Use it with [`Page.GetByRef()`](/dotnet/api/class-page#page-get-by-ref) to turn an element that an agent picks from a [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) in the `"ai"` mode into code for your test:

```csharp
var normalized = await page.GetByRef("e2").NormalizeAsync();
Console.WriteLine(normalized.ToString());
// GetByRole(AriaRole.Button, new() { Name = "Submit" })
```

### New APIs
- New option [`timeout`](/dotnet/api/class-cdpsession#cdp-session-send-option-timeout) in [`CdpSession.SendAsync()`](/dotnet/api/class-cdpsession#cdp-session-send).
- New [PlaywrightAssertionException](/dotnet/api/class-playwrightassertionexception) is thrown when a Playwright assertion is not met. It extends [PlaywrightException](/dotnet/api/class-playwrightexception), so `catch (PlaywrightException)` blocks catch it as well.
- New `ActionTimeout` and `NavigationTimeout` run settings set the default timeouts of every context that the NUnit, MSTest, xUnit and xUnit v3 base classes create. Set them in the [`.runsettings` file](./test-runners.md#using-the-runsettings-file) or on the command line:
  
  ```xml
  <RunSettings>
    <Playwright>
      <ActionTimeout>10000</ActionTimeout>
      <NavigationTimeout>60000</NavigationTimeout>
    </Playwright>
  </RunSettings>
  ```
  
  ```bash
  dotnet test -- Playwright.ActionTimeout=10000 Playwright.NavigationTimeout=60000
  ```

### Breaking Changes ⚠️
- Actions such as [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click), [`Locator.CheckAsync()`](/dotnet/api/class-locator#locator-check), [`Locator.TapAsync()`](/dotnet/api/class-locator#locator-tap), [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill), [`Locator.ClearAsync()`](/dotnet/api/class-locator#locator-clear) and [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) now wait for the element to be [not inert](./actionability.md#not-inert). An action on an element with the `inert` attribute, or inside such an element, now times out if the element stays inert.
- Cookie matching now follows RFC 6265. With a URL, [`BrowserContext.CookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-cookies) and [`ApiRequestContext.CookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-cookies) no longer return host-only cookies for subdomains or `Path=/api` cookies for `/apiv2`, and a `Path=/foo/` cookie does not match `/foo`. [APIRequestContext](/dotnet/api/class-apirequestcontext) sends a cookie without a name as `Cookie: x` instead of `Cookie: =x`, and stores `Set-Cookie: token` as a cookie without a name.
- Proxy credentials are no longer sent to websites. The credentials in the [`proxy`](/dotnet/api/class-browsertype#browser-type-launch-option-proxy) option now answer only proxy challenges. To authenticate on a website, use [`httpCredentials`](/dotnet/api/class-browser#browser-new-context-option-http-credentials).
- Text that the browser does not render, such as text that is not assigned to a slot or text directly inside a closed `<details>`, is no longer part of accessible names and aria snapshots. This can change the results of [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) with a name, [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot) and [`LocatorAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot).
- The `ParamsString` option in [APIRequestContext](/dotnet/api/class-apirequestcontext) requests is now appended to the query that the URL already has, instead of replacing it.

### Announcements
* ⚠️ Playwright for .NET now bundles Node.js 26 instead of Node.js 24. On Linux, Node.js 26 needs the `libatomic1` library.

### Browser Versions
- Chromium 158.0.8127.18
- Mozilla Firefox 159.0
- WebKit 27.2

This version was also tested against the following stable channels:
- Google Chrome 157
- Microsoft Edge 156

## Version 1.64

### 🧰 WebMCP

New [`Page.Webmcp`](/dotnet/api/class-page#page-webmcp) and [`Frame.Webmcp`](/dotnet/api/class-frame#frame-webmcp) give access to the tools that a page registers through
the experimental [WebMCP](https://webmachinelearning.github.io/webmcp/) browser API, so you can test them like
any other part of your app:

```csharp
var browser = await playwright.Chromium.LaunchAsync(new() { Args = new[] { "--enable-features=WebMCP" } });
var page = await browser.NewPageAsync();
await page.GotoAsync("https://example.com");

foreach (var tool in await page.Webmcp.ToolsAsync())
    Console.WriteLine($"{tool.Name}: {tool.Description}");

var result = await page.Webmcp.CallToolAsync("add", new { a = 2, b = 40 });
Console.WriteLine(result?.GetProperty("content")[0].GetProperty("text")); // "42"
```

[Playwright MCP](https://playwright.dev/mcp/introduction) also supports WebMCP by default, with page-defined tools offered to the agent as `webmcp_<tool>`. Pass `--no-webmcp` to opt out.

[`playwright-cli`](https://playwright.dev/agent-cli/introduction) exposes them as well:

```bash
playwright-cli webmcp-list
playwright-cli webmcp-call search_catalog --params '{"query":"cats"}'
```

### 🎬 Better videos

Videos can now be recorded at a custom frame rate, and the decorations for actions are styled with plain CSS:

```csharp
await page.Screencast.StartAsync(new()
{
    Path = "video.webm",
    Size = new() { Width = 1920, Height = 1080 },
    Fps = 60,
});
await page.Screencast.ShowActionsAsync(new()
{
    Style = new()
    {
        Point = "width: 20px; height: 20px; border-radius: 50%; background: red",
        Highlight = "outline: 2px solid #333; background: rgba(0, 128, 255, .15)",
        Title = "font-size: 16px",
    },
});
```
- New [`recordVideoFps`](/dotnet/api/class-browser#browser-new-context-option-record-video-fps) option and new [`fps`](/dotnet/api/class-screencast#screencast-start-option-fps) option in
  [`Screencast.StartAsync()`](/dotnet/api/class-screencast#screencast-start). Firefox and WebKit currently capture up to 25 frames per second.
- New [`style`](/dotnet/api/class-screencast#screencast-show-actions-option-style) option takes CSS declarations for the `point` marker, the target
  `highlight` and the action `title`. It replaces the `FontSize` option, which is now deprecated.
- The cursor stays visible at the last action point, survives navigations and travels along a natural, eased path.
- Videos are encoded with VP9 instead of VP8, which takes less CPU and produces smaller files of the same or better
  quality.
- All video options are also available in [Playwright MCP](https://playwright.dev/mcp/introduction) and [`playwright-cli`](https://playwright.dev/agent-cli/introduction).

### 🪆 Locator.within()

New [`Locator.Within()`](/dotnet/api/class-locator#locator-within) combines two locators that you already have, reading in the natural order —
"this button, within that dialog":

```csharp
var saveButton = page.GetByRole(AriaRole.Button, new() { Name = "Save" });
var dialog = page.GetByTestId("settings-dialog");

await saveButton.Within(dialog).ClickAsync();
```

Relative locators such as [`Locator.Nth()`](/dotnet/api/class-locator#locator-nth) or [`Locator.First()`](/dotnet/api/class-locator#locator-first) are resolved inside each parent
separately, which makes column-like queries straightforward:

```csharp
// The third cell of every row, not the third cell in the table.
var thirdColumn = page.GetByRole(AriaRole.Cell).Nth(2).Within(page.GetByRole(AriaRole.Row));
await Expect(thirdColumn).ToHaveTextAsync(new[] { "Apple", "Banana", "Cherry" });
```

### New APIs
- New [`Page.GetByRef()`](/dotnet/api/class-page#page-get-by-ref) locates an element by its aria ref, such as `e2`, reported by [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) in the `"ai"` mode.
- New option [`includeShadow`](/dotnet/api/class-page#page-content-option-include-shadow) in [`Page.ContentAsync()`](/dotnet/api/class-page#page-content) and [`Frame.ContentAsync()`](/dotnet/api/class-frame#frame-content) serializes open shadow roots as [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html).
- New option [`signCount`](/dotnet/api/class-credentials#credentials-create-option-sign-count) sets the initial signature counter of a virtual credential. [`Credentials.CreateAsync()`](/dotnet/api/class-credentials#credentials-create) and [`Credentials.GetAsync()`](/dotnet/api/class-credentials#credentials-get) return the current `SignCount`, and it is saved and restored together with the credentials in the storage state.
- New [`ApiRequestContext.AddCookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-add-cookies), [`ApiRequestContext.CookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-cookies) and [`ApiRequestContext.ClearCookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-clear-cookies) manage cookies of a request context, mirroring the [BrowserContext](/dotnet/api/class-browsercontext) methods:
  
  ```csharp
  await request.AddCookiesAsync(new[]
  {
      new Cookie { Name = "session-id", Value = "42", Url = "https://example.com" },
  });
  Console.WriteLine(await request.CookiesAsync("https://example.com"));
  await request.ClearCookiesAsync(new() { Name = "session-id" });
  ```

### Breaking Changes ⚠️
- Elements inside hidden iframes are considered hidden. Elements inside an iframe that is not visible, for example with `visibility: hidden`, are now considered hidden by actions, [`Locator.IsVisibleAsync()`](/dotnet/api/class-locator#locator-is-visible) and [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible).

### Browser Versions
- Chromium 156.0.8078.4
- Mozilla Firefox 157.0
- WebKit 27.2

This version was also tested against the following stable channels:
- Google Chrome 155
- Microsoft Edge 155

## Version 1.63

### 🪟 Locate across frames

[`Page.FrameLocator()`](/dotnet/api/class-page#page-frame-locator) and [`Frame.FrameLocator()`](/dotnet/api/class-frame#frame-frame-locator) called without a selector search in any frame of the
subtree, so you no longer need to locate the iframe first:

```csharp
// Finds the button in any frame on the page.
await page.FrameLocator().GetByRole(AriaRole.Button).ClickAsync();
```

The rest of the locator resolves inside a single frame, just like a regular locator, and an error is thrown when it
matches elements in several frames.

### 👁️ Visible-only locators

New [`Locator.Visible()`](/dotnet/api/class-locator#locator-visible) returns a locator that matches only visible elements. It is the recommended
replacement for the `:visible` CSS pseudo-class:

```csharp
await page.Locator("button").Visible.ClickAsync();
```

### 🖼️ Aria and screen snapshots in traces

New [`ariaSnapshots`](/dotnet/api/class-tracing#tracing-start-option-aria-snapshots) and [`screenSnapshots`](/dotnet/api/class-tracing#tracing-start-option-screen-snapshots) options of
[`Tracing.StartAsync()`](/dotnet/api/class-tracing#tracing-start) capture an aria snapshot and a screenshot of the page on every action:

```csharp
await context.Tracing.StartAsync(new()
{
  Snapshots = true,
  AriaSnapshots = true,
  ScreenSnapshots = true
});
```

With aria and screen snapshots recorded, the new **Display Aria** mode in the trace viewer shows the action screenshot
side by side with the aria snapshot, and hovering an aria node highlights it on the screenshot.

### New APIs

#### Browser and Context
- [`httpCredentials`](/dotnet/api/class-browser#browser-new-context-option-http-credentials) now also accepts an array of credentials. The first entry matching the request origin is used, and entries without an origin match any request.
- New option [`opfs`](/dotnet/api/class-browsercontext#browser-context-storage-state-option-opfs) includes the [origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) in the storage state, so it can be persisted and restored into later contexts.
- New events [`Page.DialogClosed`](/dotnet/api/class-page#page-event-dialog-closed) and [`BrowserContext.DialogClosed`](/dotnet/api/class-browsercontext#browser-context-event-dialog-closed) are emitted when a JavaScript dialog is accepted, dismissed or closed by the user.

#### Command line
- `pwsh bin/Debug/netX/playwright.ps1 install --no-remove` keeps the browsers of other Playwright installations instead of removing them.
- `pwsh bin/Debug/netX/playwright.ps1 codegen --http-credentials` records against pages behind HTTP authentication.

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

[`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot) and [`Locator.ScreenshotAsync()`](/dotnet/api/class-locator#locator-screenshot) can now capture screenshots in the WebP format — Playwright infers the format from a `.webp` file extension, or you can set the `type` explicitly. Quality `100` (the default) is lossless, while lower values use lossy compression:

```csharp
await page.ScreenshotAsync(new() { Path = "homepage.webp", Quality = 50 });
```

### New APIs
- New `scroll` option (`"auto"` | `"none"`) on actions to opt out of Playwright's automatic scroll-into-view.
- New [`Locator.WaitForFunctionAsync()`](/dotnet/api/class-locator#locator-wait-for-function) waits until a function — called with the matching element — returns a truthy value.
- New [`ApiResponse.Timing()`](/dotnet/api/class-apiresponse#api-response-timing) returns resource timing information for an API response.

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

New [Credentials](/dotnet/api/class-credentials) virtual authenticator, available via [`BrowserContext.Credentials`](/dotnet/api/class-browsercontext#browser-context-credentials), lets tests register passkeys and answer `navigator.credentials.create()` / `navigator.credentials.get()` ceremonies in the page — no real hardware key required, works in all browsers:

```csharp
var context = await browser.NewContextAsync();

// Seed a passkey your backend provisioned for a test user.
await context.Credentials.CreateAsync("example.com", new()
{
    Id = credentialId,
    UserHandle = userHandle,
    PrivateKey = privateKey,
    PublicKey = publicKey,
});
await context.Credentials.InstallAsync();

var page = await context.NewPageAsync();
await page.GotoAsync("https://example.com/login");
// The page's navigator.credentials.get() is answered with the seeded passkey.
```

You can also let the app register a passkey once in a setup test, read it back with [`Credentials.GetAsync()`](/dotnet/api/class-credentials#credentials-get), and seed it into later tests — see [Credentials](/dotnet/api/class-credentials) for details.

### 🗃️ Web Storage

New [WebStorage](/dotnet/api/class-webstorage) API, available via [`Page.LocalStorage`](/dotnet/api/class-page#page-local-storage) and [`Page.SessionStorage`](/dotnet/api/class-page#page-session-storage), reads and writes the page's storage for the current origin:

```csharp
await page.LocalStorage.SetItemAsync("token", "abc");
var token = await page.LocalStorage.GetItemAsync("token");
var items = await page.SessionStorage.ItemsAsync();
```

### New APIs
- [`ApiResponse.SecurityDetailsAsync()`](/dotnet/api/class-apiresponse#api-response-security-details) and [`ApiResponse.ServerAddrAsync()`](/dotnet/api/class-apiresponse#api-response-server-addr) mirror the browser-side [`Response.SecurityDetailsAsync()`](/dotnet/api/class-response#response-security-details) and [`Response.ServerAddrAsync()`](/dotnet/api/class-response#response-server-addr).
- New option `ArtifactsDir` in [`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) controls where artifacts such as traces and downloads are stored when attached to an existing browser.
- New option `Cursor` in [`Screencast.ShowActionsAsync()`](/dotnet/api/class-screencast#screencast-show-actions) controls the cursor decoration rendered for pointer actions.
- The `OnFrame` callback in [`Screencast.StartAsync()`](/dotnet/api/class-screencast#screencast-start) now receives a `Timestamp` of when the frame was presented by the browser.

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

[`Tracing.StartHarAsync()`](/dotnet/api/class-tracing#tracing-start-har) / [`Tracing.StopHarAsync()`](/dotnet/api/class-tracing#tracing-stop-har) expose HAR recording as a first-class tracing API, with the same `Content`, `Mode` and `UrlFilter` options as `RecordHar`:

```csharp
await context.Tracing.StartHarAsync("trace.har");
var page = await context.NewPageAsync();
await page.GotoAsync("https://playwright.dev");
await context.Tracing.StopHarAsync();
```

### 🪝 Drop API

New [`Locator.DropAsync()`](/dotnet/api/class-locator#locator-drop) simulates an external drag-and-drop of files or clipboard-like data onto an element. Playwright dispatches `dragenter`, `dragover`, and `drop` with a synthetic [DataTransfer] in the page context — works cross-browser and is great for testing upload zones:

```csharp
await page.Locator("#dropzone").DropAsync(new() {
    Files = new FilePayload() {
        Name = "note.txt",
        MimeType = "text/plain",
        Buffer = Encoding.UTF8.GetBytes("hello"),
    },
});

await page.Locator("#dropzone").DropAsync(new() {
    Data = new Dictionary<string, string> {
        ["text/plain"] = "hello world",
        ["text/uri-list"] = "https://example.com",
    },
});
```

### 🎯 Aria snapshots
- [`PageAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-match-aria-snapshot) now works on a [Page](/dotnet/api/class-page), in addition to a [Locator](/dotnet/api/class-locator) — equivalent to asserting against `Page.Locator("body")`.
- New `Boxes` option on [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot) / [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) appends each element's bounding box as `[box=x,y,width,height]`, useful for AI consumption.

### New APIs

#### Browser, Context and Page
- Event [`Browser.Context`](/dotnet/api/class-browser#browser-event-context) — fired when a new context is created on the browser.
- [BrowserContext](/dotnet/api/class-browsercontext) now mirrors lifecycle events from its pages: [`BrowserContext.Download`](/dotnet/api/class-browsercontext#browser-context-event-download), [`BrowserContext.FrameAttached`](/dotnet/api/class-browsercontext#browser-context-event-frame-attached), [`BrowserContext.FrameDetached`](/dotnet/api/class-browsercontext#browser-context-event-frame-detached), [`BrowserContext.FrameNavigated`](/dotnet/api/class-browsercontext#browser-context-event-frame-navigated), [`BrowserContext.PageClose`](/dotnet/api/class-browsercontext#browser-context-event-page-close), [`BrowserContext.PageLoad`](/dotnet/api/class-browsercontext#browser-context-event-page-load).

#### Locators and Assertions
- New option `Description` in [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) / [`Locator.GetByRole()`](/dotnet/api/class-locator#locator-get-by-role) / [`Frame.GetByRole()`](/dotnet/api/class-frame#frame-get-by-role) / [`FrameLocator.GetByRole()`](/dotnet/api/class-framelocator#frame-locator-get-by-role) for matching the [accessible description](https://www.w3.org/TR/wai-aria-1.2/#dfn-accessible-description).
- New option `Pseudo` in [`LocatorAssertions.ToHaveCSSAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-css) reads computed styles from `::before` or `::after`.
- New option `Style` in [`Locator.HighlightAsync()`](/dotnet/api/class-locator#locator-highlight) applies extra inline CSS to the highlight overlay, plus new [`Page.HideHighlightAsync()`](/dotnet/api/class-page#page-hide-highlight) to clear all highlights.

#### Network
- [`WebSocketRoute.Protocols()`](/dotnet/api/class-websocketroute#web-socket-route-protocols) returns the WebSocket subprotocols requested by the page.
- New option `NoDefaults` in [`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) disables Playwright's default overrides on the default context (download behavior, focus emulation, media emulation), so attaching to a user's daily-driver browser doesn't disturb its state.

#### Errors
- New [`WebError.Location()`](/dotnet/api/class-weberror#web-error-location) mirrors [`ConsoleMessage.Location()`](/dotnet/api/class-consolemessage#console-message-location).

### 🛠️ Other improvements
- Trace Viewer adds a pretty-print toggle for JSON / form request and response bodies in the network details panel.

### Breaking Changes ⚠️
- Removed long-deprecated `Handle` option on `BrowserContext.ExposeBindingAsync` and `Page.ExposeBindingAsync`.

### Browser Versions
- Chromium 148.0.7778.96
- Mozilla Firefox 150.0.2
- WebKit 26.4

This version was also tested against the following stable channels:
- Google Chrome 147
- Microsoft Edge 147

## Version 1.59

### 🎬 Screencast

New [`Page.Screencast`](/dotnet/api/class-page#page-screencast) API provides a unified interface for capturing page content with:
- Screencast recordings
- Action annotations
- Visual overlays
- Real-time frame capture
- Agentic video receipts

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-screencast-demo.gif" alt="Demo" width="500" height="313" />

</center>

**Screencast recording** — record video with precise start/stop control, as an alternative to the [`recordVideoDir`](/dotnet/api/class-browser#browser-new-context-option-record-video-dir) option:

```csharp
await page.Screencast.StartAsync(new() { Path = "video.webm" });
// ... perform actions ...
await page.Screencast.StopAsync();
```

**Action annotations** — enable built-in visual annotations that highlight interacted elements and display action titles during recording:

```csharp
await page.Screencast.ShowActionsAsync(new() { Position = "top-right" });
```

`ShowActionsAsync` accepts `Position` (`"top-left"`, `"top"`, `"top-right"`, `"bottom-left"`, `"bottom"`, `"bottom-right"`), `Duration` (ms per annotation), and `FontSize` (px). Returns a disposable to stop showing actions.

**Visual overlays** — add chapter titles and custom HTML overlays on top of the page for richer narration:

```csharp
await page.Screencast.ShowChapterAsync("Adding TODOs", new() {
    Description = "Type and press enter for each TODO",
    Duration = 1000,
});

await page.Screencast.ShowOverlayAsync("<div style=\"color: red\">Recording</div>");
```

**Real-time frame capture** — stream JPEG-encoded frames for custom processing like thumbnails, live previews, AI vision, and more:

```csharp
await page.Screencast.StartAsync(new() {
    OnFrame = frame => SendToVisionModel(frame.Data),
});
```

**Agentic video receipts** — coding agents can produce video evidence of their work. After completing a task, an agent can record a walkthrough video with rich annotations for human review:

```csharp
await page.Screencast.StartAsync(new() { Path = "receipt.webm" });
await page.Screencast.ShowActionsAsync(new() { Position = "top-right" });

await page.Screencast.ShowChapterAsync("Verifying checkout flow", new() {
    Description = "Added coupon code support per ticket #1234",
});

// Agent performs the verification steps...
await page.Locator("#coupon").FillAsync("SAVE20");
await page.Locator("#apply-coupon").ClickAsync();
await Expect(page.Locator(".discount")).ToContainTextAsync("20%");

await page.Screencast.ShowChapterAsync("Done", new() {
    Description = "Coupon applied, discount reflected in total",
});

await page.Screencast.StopAsync();
```

The resulting video serves as a receipt: chapter titles provide context, action annotations highlight each interaction, and the visual walkthrough is faster to review than text logs.

### 🔍 Snapshots and Locators
- Method [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) to capture the aria snapshot of the page — equivalent to `Page.Locator("body").AriaSnapshotAsync()`.
- Options `Depth` and `Mode` in [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot).
- Method [`Locator.NormalizeAsync()`](/dotnet/api/class-locator#locator-normalize) converts a locator to follow best practices like test ids and aria roles.
- Method [`Page.PickLocatorAsync()`](/dotnet/api/class-page#page-pick-locator) enters an interactive mode where hovering over elements highlights them and shows the corresponding locator. Click an element to get its [Locator](/dotnet/api/class-locator) back. Use [`Page.CancelPickLocatorAsync()`](/dotnet/api/class-page#page-cancel-pick-locator) to cancel.

### New APIs

#### Screencast
- [`Page.Screencast`](/dotnet/api/class-page#page-screencast) provides video recording, real-time frame streaming, and overlay management.
- Methods [`Screencast.StartAsync()`](/dotnet/api/class-screencast#screencast-start) and [`Screencast.StopAsync()`](/dotnet/api/class-screencast#screencast-stop) for recording and frame capture.
- Methods [`Screencast.ShowActionsAsync()`](/dotnet/api/class-screencast#screencast-show-actions) and [`Screencast.HideActionsAsync()`](/dotnet/api/class-screencast#screencast-hide-actions) for action annotations.
- Methods [`Screencast.ShowChapterAsync()`](/dotnet/api/class-screencast#screencast-show-chapter) and [`Screencast.ShowOverlayAsync()`](/dotnet/api/class-screencast#screencast-show-overlay) for visual overlays.
- Methods [`Screencast.ShowOverlaysAsync()`](/dotnet/api/class-screencast#screencast-show-overlays) and [`Screencast.HideOverlaysAsync()`](/dotnet/api/class-screencast#screencast-hide-overlays) for overlay visibility control.

#### Storage, Console and Errors
- Method [`BrowserContext.SetStorageStateAsync()`](/dotnet/api/class-browsercontext#browser-context-set-storage-state) clears existing cookies, local storage, and IndexedDB for all origins and sets a new storage state — no need to create a new context.
- Methods [`Page.ClearConsoleMessagesAsync()`](/dotnet/api/class-page#page-clear-console-messages) and [`Page.ClearPageErrorsAsync()`](/dotnet/api/class-page#page-clear-page-errors) to clear stored messages and errors.
- Option `Filter` in [`Page.ConsoleMessagesAsync()`](/dotnet/api/class-page#page-console-messages) and [`Page.PageErrorsAsync()`](/dotnet/api/class-page#page-page-errors) controls which messages are returned.
- Method [`ConsoleMessage.Timestamp()`](/dotnet/api/class-consolemessage#console-message-timestamp).

#### Miscellaneous
- [`BrowserContext.Debugger`](/dotnet/api/class-browsercontext#browser-context-debugger) provides programmatic control over the Playwright debugger.
- Method [`BrowserContext.IsClosed()`](/dotnet/api/class-browsercontext#browser-context-is-closed).
- Method [`Request.ExistingResponse()`](/dotnet/api/class-request#request-existing-response) returns the response without waiting.
- Method [`Response.HttpVersionAsync()`](/dotnet/api/class-response#response-http-version) returns the HTTP version used by the response.
- Option `Live` in [`Tracing.StartAsync()`](/dotnet/api/class-tracing#tracing-start) for real-time trace updates.
- Option `ArtifactsDir` in [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch) to configure the artifacts directory.

### 🔗 Interoperability

New [`Browser.BindAsync()`](/dotnet/api/class-browser#browser-bind) API makes a launched browser available for `playwright-cli`, `@playwright/mcp`, and other clients to connect to.

**Bind a browser** — start a browser and bind it so others can connect:

```csharp
var serverInfo = await browser.BindAsync("my-session", new() {
    WorkspaceDir = "/my/project",
});
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

```csharp
var browser = await chromium.ConnectAsync(serverInfo.Endpoint);
```

Pass `Host` and `Port` options to bind over WebSocket instead of a named pipe:

```csharp
var serverInfo = await browser.BindAsync("my-session", new() {
    Host = "localhost",
    Port = 0,
});
// serverInfo.Endpoint is a ws:// URL
```

Call [`Browser.UnbindAsync()`](/dotnet/api/class-browser#browser-unbind) to stop accepting new connections.

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

[`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) now accepts an `IsLocal` option. When set to `true`, it tells Playwright that it runs on the same host as the CDP server, enabling file system optimizations.

### Breaking Changes ⚠️
- Removed `_react` and `_vue` selectors. See [locators guide](./locators.md) for alternatives.
- Removed `:light` selector engine suffix. Use standard CSS selectors instead.
- Option `Devtools` from [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch) has been removed. Use `Args = new[] { "--auto-open-devtools-for-tabs" }` instead.
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

After 3 years of being deprecated, we removed `Page.Accessibility` from our API. Please use other libraries such as [Axe](https://www.deque.com/axe/) if you need to test page accessibility. See our Node.js [guide](https://playwright.dev/docs/accessibility-testing) for integration with Axe.

### New APIs
- [`Worker.Console`](/dotnet/api/class-worker#worker-event-console) event is emitted when JavaScript within the worker calls one of console API methods, e.g. console.log or console.dir.
- [`Locator.Description()`](/dotnet/api/class-locator#locator-description) returns locator description previously set with [`Locator.Describe()`](/dotnet/api/class-locator#locator-describe).
- New option [`steps`](/dotnet/api/class-locator#locator-click-option-steps) in [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) and [`Locator.DragToAsync()`](/dotnet/api/class-locator#locator-drag-to) that configures the number of `mousemove` events emitted while moving the mouse pointer to the target element.

### Browser Versions
- Chromium 143.0.7499.4
- Mozilla Firefox 144.0.2
- WebKit 26.0

## Version 1.56

### New APIs
- New methods [`Page.ConsoleMessagesAsync()`](/dotnet/api/class-page#page-console-messages) and [`Page.PageErrorsAsync()`](/dotnet/api/class-page#page-page-errors) for retrieving the most recent console messages from the page
- New method [`Page.RequestsAsync()`](/dotnet/api/class-page#page-requests) for retrieving the most recent network requests from the page

### Breaking Changes
- Event [`BrowserContext.BackgroundPage`](/dotnet/api/class-browsercontext#browser-context-event-background-page) has been deprecated and will not be emitted. Method [`BrowserContext.BackgroundPages()`](/dotnet/api/class-browsercontext#browser-context-background-pages) will return an empty list

### Miscellaneous
- Aria snapshots render and compare `input` `placeholder`

### Browser Versions
- Chromium 141.0.7390.37
- Mozilla Firefox 142.0.1
- WebKit 26.0

## Version 1.55

### Codegen
- Automatic `ToBeVisibleAsync()` assertions: Codegen can now generate automatic `ToBeVisibleAsync()` assertions for common UI interactions. This feature can be enabled in the Codegen settings UI.

### Breaking Changes
- ⚠️ Dropped support for Chromium extension manifest v2.

### Miscellaneous
- Added support for Debian 13 "Trixie".
- Added support for Xunit v3 as part of [`Microsoft.Playwright.Xunit.v3`](https://www.nuget.org/packages/Microsoft.Playwright.Xunit.v3)
- Added support for MSTest v4 as part of [`Microsoft.Playwright.MSTest.v4`](https://www.nuget.org/packages/Microsoft.Playwright.MSTest.v4)

### Browser Versions
- Chromium 140.0.7339.16
- Mozilla Firefox 141.0
- WebKit 26.0

This version was also tested against the following stable channels:
- Google Chrome 139
- Microsoft Edge 139

## Version 1.54

### Highlights
- New cookie property `PartitionKey` in [`BrowserContext.CookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-cookies) and [`BrowserContext.AddCookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-add-cookies). This property allows to save and restore partitioned cookies. See [CHIPS MDN article](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies) for more information. Note that browsers have different support and defaults for cookie partitioning.
- New option `--user-data-dir` in multiple commands. You can specify the same user data dir to reuse browsing state, like authentication, between sessions.
  
  ```bash
  pwsh bin/Debug/netX/playwright.ps1 codegen --user-data-dir=./user-data
  ```
- `pwsh bin/Debug/netX/playwright.ps1 open` does not open the test recorder anymore. Use `pwsh bin/Debug/netX/playwright.ps1 codegen` instead.

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
- New method [`Locator.Describe()`](/dotnet/api/class-locator#locator-describe) to describe a locator. Used for trace viewer.
  
  ```csharp
  var button = Page.GetByTestId("btn-sub").Describe("Subscribe button");
  await button.ClickAsync();
  ```
- `pwsh bin/Debug/netX/playwright.ps1 install --list` will now list all installed browsers, versions and locations.

### Browser Versions
- Chromium 138.0.7204.4
- Mozilla Firefox 139.0
- WebKit 18.5

This version was also tested against the following stable channels:
- Google Chrome 137
- Microsoft Edge 137

## Version 1.52

### Highlights
- New method [`LocatorAssertions.ToContainClassAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-class) to ergonomically assert individual class names on the element.
  
  ```csharp
    await Expect(Page.GetByRole(AriaRole.Listitem, new() { Name = "Ship v1.52" })).ToContainClassAsync("done");
  ```
- [Aria Snapshots](./aria-snapshots.md) got two new properties: [`/children`](./aria-snapshots.md#strict-matching) for strict matching and [`/url`](./aria-snapshots.md#links) for links.
  
  ```csharp
  await Expect(locator).ToMatchAriaSnapshotAsync(@"
    - list
      - /children: equal
      - listitem: Feature A
      - listitem:
        - link ""Feature B"":
          - /url: ""https://playwright.dev""
  ");
  ```

### Miscellaneous
- New option [`maxRedirects`](/dotnet/api/class-apirequest#api-request-new-context-option-max-redirects) in [`ApiRequest.NewContextAsync()`](/dotnet/api/class-apirequest#api-request-new-context) to control the maximum number of redirects.

### Breaking Changes
- Glob URL patterns in methods like [`Page.RouteAsync()`](/dotnet/api/class-page#page-route) do not support `?` and `[]` anymore. We recommend using regular expressions instead.
- Method [`Route.ContinueAsync()`](/dotnet/api/class-route#route-continue) does not allow to override the `Cookie` header anymore. If a `Cookie` header is provided, it will be ignored, and the cookie will be loaded from the browser's cookie store. To set custom cookies, use [`BrowserContext.AddCookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-add-cookies).
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
* New option [`indexedDB`](/dotnet/api/class-browsercontext#browser-context-storage-state-option-indexed-db) for [`BrowserContext.StorageStateAsync()`](/dotnet/api/class-browsercontext#browser-context-storage-state) allows to save and restore IndexedDB contents. Useful when your application uses [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to store authentication tokens, like Firebase Authentication.
  
  Here is an example following the [authentication guide](./auth.md#reusing-signed-in-state):
  
  ```csharp
  // Save storage state into the file. Make sure to include IndexedDB.
  await context.StorageStateAsync(new()
  {
      Path = "../../../playwright/.auth/state.json",
      IndexedDB = true
  });
  
  // Create a new context with the saved storage state.
  var context = await browser.NewContextAsync(new()
  {
      StorageStatePath = "../../../playwright/.auth/state.json"
  });
  ```
* New option [`visible`](/dotnet/api/class-locator#locator-filter-option-visible) for [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) allows matching only visible elements.
  
  ```csharp
  // Ignore invisible todo items.
  var todoItems = Page.GetByTestId("todo-item").Filter(new() { Visible = true });
  // Check there are exactly 3 visible ones.
  await Expect(todoItems).ToHaveCountAsync(3);
  ```
* New option `Contrast` for methods [`Page.EmulateMediaAsync()`](/dotnet/api/class-page#page-emulate-media) and [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) allows to emulate the `prefers-contrast` media feature.
* New option [`failOnStatusCode`](/dotnet/api/class-apirequest#api-request-new-context-option-fail-on-status-code) makes all fetch requests made through the [APIRequestContext](/dotnet/api/class-apirequestcontext) throw on response codes other than 2xx and 3xx.

### Browser Versions
* Chromium 134.0.6998.35
* Mozilla Firefox 135.0
* WebKit 18.4

This version was also tested against the following stable channels:
* Google Chrome 133
* Microsoft Edge 133

## Version 1.50

### Support for Xunit
* Support for xUnit 2.8+ via [Microsoft.Playwright.Xunit](https://www.nuget.org/packages/Microsoft.Playwright.Xunit). Follow our [Getting Started](./intro.md) guide to learn more.

### Miscellaneous
* Added method [`LocatorAssertions.ToHaveAccessibleErrorMessageAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message) to assert the Locator points to an element with a given [aria errormessage](https://w3c.github.io/aria/#aria-errormessage).

### UI updates
* New button in Codegen for picking elements to produce aria snapshots.
* Additional details (such as keys pressed) are now displayed alongside action API calls in traces.
* Display of `canvas` content in traces is error-prone. Display is now disabled by default, and can be enabled via the `Display canvas content` UI setting.
* `Call` and `Network` panels now display additional time information.

### Breaking
* [`LocatorAssertions.ToBeEditableAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-editable) and [`Locator.IsEditableAsync()`](/dotnet/api/class-locator#locator-is-editable) now throw if the target element is not `<input>`, `<select>`, or a number of other editable elements.

### Browser Versions
* Chromium 133.0.6943.16
* Mozilla Firefox 134.0
* WebKit 18.2

This version was also tested against the following stable channels:
* Google Chrome 132
* Microsoft Edge 132

## Version 1.49

### Aria snapshots

New assertion [`LocatorAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) verifies page structure by comparing to an expected accessibility tree, represented as YAML.

```csharp
await page.GotoAsync("https://playwright.dev");
await Expect(page.Locator("body")).ToMatchAriaSnapshotAsync(@"
  - banner:
    - heading /Playwright enables reliable/ [level=1]
    - link ""Get started""
    - link ""Star microsoft/playwright on GitHub""
  - main:
    - img ""Browsers (Chromium, Firefox, WebKit)""
    - heading ""Any browser • Any platform • One API""
");
```

You can generate this assertion with [Test Generator](./codegen) or by calling [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot).

Learn more in the [aria snapshots guide](./aria-snapshots).

### Tracing groups

New method [`Tracing.GroupAsync()`](/dotnet/api/class-tracing#tracing-group) allows you to visually group actions in the trace viewer.

```csharp
// All actions between GroupAsync and GroupEndAsync
// will be shown in the trace viewer as a group.
await Page.Context.Tracing.GroupAsync("Open Playwright.dev > API");
await Page.GotoAsync("https://playwright.dev/");
await Page.GetByRole(AriaRole.Link, new() { Name = "API" }).ClickAsync();
await Page.Context.Tracing.GroupEndAsync();
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

::: code-group

```xml [runsettings.xml]
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <LaunchOptions>
      <Channel>chromium</Channel>
    </LaunchOptions>
  </Playwright>
</RunSettings>
```

:::

```bash
dotnet test -- Playwright.BrowserName=chromium Playwright.LaunchOptions.Channel=chromium
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

New methods [`Page.RouteWebSocketAsync()`](/dotnet/api/class-page#page-route-web-socket) and [`BrowserContext.RouteWebSocketAsync()`](/dotnet/api/class-browsercontext#browser-context-route-web-socket) allow to intercept, modify and mock WebSocket connections initiated in the page. Below is a simple example that mocks WebSocket communication by responding to a `"request"` with a `"response"`.

```csharp
await page.RouteWebSocketAsync("/ws", ws => {
  ws.OnMessage(frame => {
    if (frame.Text == "request")
      ws.Send("response");
  });
});
```

See [WebSocketRoute](/dotnet/api/class-websocketroute) for more details.

### UI updates
- New "copy" buttons for annotations and test location in the HTML report.
- Route method calls like [`Route.FulfillAsync()`](/dotnet/api/class-route#route-fulfill) are not shown in the report and trace viewer anymore. You can see which network requests were routed in the network tab instead.
- New "Copy as cURL" and "Copy as fetch" buttons for requests in the network tab.

### Miscellaneous
- New method [`Page.RequestGCAsync()`](/dotnet/api/class-page#page-request-gc) may help detect memory leaks.
- Requests made by [APIRequestContext](/dotnet/api/class-apirequestcontext) now record detailed timing and security information in the HAR.

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
- The `mcr.microsoft.com/playwright/dotnet:v1.47.0` now serves a Playwright image based on Ubuntu 24.04 Noble.
  To use the 22.04 jammy-based image, please use `mcr.microsoft.com/playwright/dotnet:v1.47.0-jammy` instead.
- The `:latest`/`:focal`/`:jammy` tag for Playwright Docker images is no longer being published. Pin to a specific version for better stability and reproducibility.
- TLS client certificates can now be passed from memory by passing [`clientCertificates.cert`](/dotnet/api/class-browser#browser-new-context-option-client-certificates) and [`clientCertificates.key`](/dotnet/api/class-browser#browser-new-context-option-client-certificates) as byte arrays instead of file paths.
- [`noWaitAfter`](/dotnet/api/class-locator#locator-select-option-option-no-wait-after) in [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) was deprecated.
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

You can provide client certificates as a parameter of [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) and [`ApiRequest.NewContextAsync()`](/dotnet/api/class-apirequest#api-request-new-context). The following snippet sets up a client certificate for `https://example.com`:

```csharp
var context = await Browser.NewContextAsync(new() {
  ClientCertificates = [
    new() {
      Origin = "https://example.com",
      CertPath = "client-certificates/cert.pem",
      KeyPath = "client-certificates/key.pem",
    }
  ]
});
```

### Trace Viewer Updates
- Content of text attachments is now rendered inline in the attachments pane.
- New setting to show/hide routing actions like [`Route.ContinueAsync()`](/dotnet/api/class-route#route-continue).
- Request method and status are shown in the network details tab.
- New button to copy source file location to clipboard.
- Metadata pane now displays the `BaseURL`.

### Miscellaneous
- New `maxRetries` option in [`ApiRequestContext.FetchAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-fetch) which retries on the `ECONNRESET` network error.

### Browser Versions
- Chromium 128.0.6613.18
- Mozilla Firefox 128.0
- WebKit 18.0

This version was also tested against the following stable channels:
- Google Chrome 127
- Microsoft Edge 127

## Version 1.45

### Clock

Utilizing the new [Clock](/dotnet/api/class-clock) API allows to manipulate and control time within tests to verify time-related behavior. This API covers many common scenarios, including:
* testing with predefined time;
* keeping consistent time and timers;
* monitoring inactivity;
* ticking through time manually.

```csharp
// Initialize clock with some time before the test time and let the page load naturally.
// `Date.now` will progress as the timers fire.
await Page.Clock.InstallAsync(new()
{
  TimeDate = new DateTime(2024, 2, 2, 8, 0, 0)
});
await Page.GotoAsync("http://localhost:3333");

// Pretend that the user closed the laptop lid and opened it again at 10am.
// Pause the time once reached that point.
await Page.Clock.PauseAtAsync(new DateTime(2024, 2, 2, 10, 0, 0));

// Assert the page state.
await Expect(Page.GetByTestId("current-time")).ToHaveTextAsync("2/2/2024, 10:00:00 AM");

// Close the laptop lid again and open it at 10:30am.
await Page.Clock.FastForwardAsync("30:00");
await Expect(Page.GetByTestId("current-time")).ToHaveTextAsync("2/2/2024, 10:30:00 AM");
```

See [the clock guide](./clock.md) for more details.

### Miscellaneous
- Method [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) now supports uploading a directory for `<input type=file webkitdirectory>` elements.
  
  ```csharp
  await page.GetByLabel("Upload directory").SetInputFilesAsync("mydir");
  ```
- Multiple methods like [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) or [`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) now support a `ControlOrMeta` modifier key. This key maps to `Meta` on macOS and maps to `Control` on Windows and Linux.
  
  ```csharp
  // Press the common keyboard shortcut Control+S or Meta+S to trigger a "Save" operation.
  await page.Keyboard.PressAsync("ControlOrMeta+S");
  ```
- New property `httpCredentials.send` in [`ApiRequest.NewContextAsync()`](/dotnet/api/class-apirequest#api-request-new-context) that allows to either always send the `Authorization` header or only send it in response to `401 Unauthorized`.
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
- [`LocatorAssertions.ToHaveAccessibleNameAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-name) checks if the element has the specified accessible name:
  
  ```csharp
  var locator = Page.GetByRole(AriaRole.Button);
  await Expect(locator).ToHaveAccessibleNameAsync("Submit");
  ```
- [`LocatorAssertions.ToHaveAccessibleDescriptionAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-description) checks if the element has the specified accessible description:
  
  ```csharp
  var locator = Page.GetByRole(AriaRole.Button);
  await Expect(locator).ToHaveAccessibleDescriptionAsync("Upload a photo");
  ```
- [`LocatorAssertions.ToHaveRoleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-role) checks if the element has the specified ARIA role:
  
  ```csharp
  var locator = Page.GetByTestId("save-button");
  await Expect(locator).ToHaveRoleAsync(AriaRole.Button);
  ```

**Locator handler**
- After executing the handler added with [`Page.AddLocatorHandlerAsync()`](/dotnet/api/class-page#page-add-locator-handler), Playwright will now wait until the overlay that triggered the handler is not visible anymore. You can opt-out of this behavior with the new `NoWaitAfter` option.
- You can use new `Times` option in [`Page.AddLocatorHandlerAsync()`](/dotnet/api/class-page#page-add-locator-handler) to specify maximum number of times the handler should be run.
- The handler in [`Page.AddLocatorHandlerAsync()`](/dotnet/api/class-page#page-add-locator-handler) now accepts the locator as argument.
- New [`Page.RemoveLocatorHandlerAsync()`](/dotnet/api/class-page#page-remove-locator-handler) method for removing previously added locator handlers.

```csharp
var locator = Page.GetByText("This interstitial covers the button");
await Page.AddLocatorHandlerAsync(locator, async (overlay) =>
{
    await overlay.Locator("#close").ClickAsync();
}, new() { Times = 3, NoWaitAfter = true });
// Run your tests that can be interrupted by the overlay.
// ...
await Page.RemoveLocatorHandlerAsync(locator);
```

**Miscellaneous options**
- New method [`FormData.Append()`](/dotnet/api/class-formdata#form-data-append) allows to specify repeating fields with the same name in [`Multipart`](./api/class-apirequestcontext#api-request-context-fetch-option-multipart) option in `APIRequestContext.FetchAsync()`:
  
  ```csharp
  var formData = Context.APIRequest.CreateFormData();
  formData.Append("file", new FilePayload()
  {
      Name = "f1.js",
      MimeType = "text/javascript",
      Buffer = System.Text.Encoding.UTF8.GetBytes("var x = 2024;")
  });
  formData.Append("file", new FilePayload()
  {
      Name = "f2.txt",
      MimeType = "text/plain",
      Buffer = System.Text.Encoding.UTF8.GetBytes("hello")
  });
  var response = await Context.APIRequest.PostAsync("https://example.com/uploadFiles", new() { Multipart = formData });
  ```
- [`PageAssertions.ToHaveURLAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-url) now supports `IgnoreCase` [option](./api/class-pageassertions#page-assertions-to-have-url-option-ignore-case).

### Browser Versions
* Chromium 125.0.6422.14
* Mozilla Firefox 125.0.1
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 124
* Microsoft Edge 124

## Version 1.43

### New APIs
- Method [`BrowserContext.ClearCookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-clear-cookies) now supports filters to remove only some cookies.
  
  ```csharp
  // Clear all cookies.
  await Context.ClearCookiesAsync();
  // New: clear cookies with a particular name.
  await Context.ClearCookiesAsync(new() { Name = "session-id" });
  // New: clear cookies for a particular domain.
  await Context.ClearCookiesAsync(new() { Domain = "my-origin.com" });
  ```
- New property [`Locator.ContentFrame()`](/dotnet/api/class-locator#locator-content-frame) converts a [Locator](/dotnet/api/class-locator) object to a [FrameLocator](/dotnet/api/class-framelocator). This can be useful when you have a [Locator](/dotnet/api/class-locator) object obtained somewhere, and later on would like to interact with the content inside the frame.
  
  ```csharp
  var locator = Page.Locator("iframe[name='embedded']");
  // ...
  var frameLocator = locator.ContentFrame;
  await frameLocator.GetByRole(AriaRole.Button).ClickAsync();
  ```
- New property [`FrameLocator.Owner()`](/dotnet/api/class-framelocator#frame-locator-owner) converts a [FrameLocator](/dotnet/api/class-framelocator) object to a [Locator](/dotnet/api/class-locator). This can be useful when you have a [FrameLocator](/dotnet/api/class-framelocator) object obtained somewhere, and later on would like to interact with the `iframe` element.
  
  ```csharp
  var frameLocator = page.FrameLocator("iframe[name='embedded']");
  // ...
  var locator = frameLocator.Owner;
  await Expect(locator).ToBeVisibleAsync();
  ```

### Browser Versions
* Chromium 124.0.6367.8
* Mozilla Firefox 124.0
* WebKit 17.4

This version was also tested against the following stable channels:
* Google Chrome 123
* Microsoft Edge 123

## Version 1.42

### New Locator Handler

New method [`Page.AddLocatorHandlerAsync()`](/dotnet/api/class-page#page-add-locator-handler) registers a callback that will be invoked when specified element becomes visible and may block Playwright actions. The callback can get rid of the overlay. Here is an example that closes a cookie dialog when it appears.

```csharp
// Setup the handler.
await Page.AddLocatorHandlerAsync(
    Page.GetByRole(AriaRole.Heading, new() { Name = "Hej! You are in control of your cookies." }),
    async () =>
    {
        await Page.GetByRole(AriaRole.Button, new() { Name = "Accept all" }).ClickAsync();
    });
// Write the test as usual.
await Page.GotoAsync("https://www.ikea.com/");
await Page.GetByRole(AriaRole.Link, new() { Name = "Collection of blue and white" }).ClickAsync();
await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Light and easy" })).ToBeVisibleAsync();
```

### New APIs
- [`Page.PdfAsync()`](/dotnet/api/class-page#page-pdf) accepts two new options [`tagged`](/dotnet/api/class-page#page-pdf-option-tagged) and [`outline`](/dotnet/api/class-page#page-pdf-option-outline).

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
- New method [`Page.UnrouteAllAsync()`](/dotnet/api/class-page#page-unroute-all) removes all routes registered by [`Page.RouteAsync()`](/dotnet/api/class-page#page-route) and [`Page.RouteFromHARAsync()`](/dotnet/api/class-page#page-route-from-har). Optionally allows to wait for ongoing routes to finish, or ignore any errors from them.
- New method [`BrowserContext.UnrouteAllAsync()`](/dotnet/api/class-browsercontext#browser-context-unroute-all) removes all routes registered by [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route) and [`BrowserContext.RouteFromHARAsync()`](/dotnet/api/class-browsercontext#browser-context-route-from-har). Optionally allows to wait for ongoing routes to finish, or ignore any errors from them.
- New options [`style`](/dotnet/api/class-page#page-screenshot-option-style) in [`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot) and [`style`](/dotnet/api/class-locator#locator-screenshot-option-style) in [`Locator.ScreenshotAsync()`](/dotnet/api/class-locator#locator-screenshot) to add custom CSS to the page before taking a screenshot.

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
- "Assert visibility" tool generates [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible).
- "Assert value" tool generates [`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value).
- "Assert text" tool generates [`LocatorAssertions.ToContainTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text).

Here is an example of a generated test with assertions:

```csharp
await Page.GotoAsync("https://playwright.dev/");
await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();
await Expect(Page.GetByLabel("Breadcrumbs").GetByRole(AriaRole.List)).ToContainTextAsync("Installation");
await Expect(Page.GetByLabel("Search")).ToBeVisibleAsync();
await Page.GetByLabel("Search").ClickAsync();
await Page.GetByPlaceholder("Search docs").FillAsync("locator");
await Expect(Page.GetByPlaceholder("Search docs")).ToHaveValueAsync("locator");
```

### New APIs
- Options [`reason`](/dotnet/api/class-page#page-close-option-reason) in [`Page.CloseAsync()`](/dotnet/api/class-page#page-close), [`reason`](/dotnet/api/class-browsercontext#browser-context-close-option-reason) in [`BrowserContext.CloseAsync()`](/dotnet/api/class-browsercontext#browser-context-close) and [`reason`](/dotnet/api/class-browser#browser-close-option-reason) in [`Browser.CloseAsync()`](/dotnet/api/class-browser#browser-close). Close reason is reported for all operations interrupted by the closure.
- Option [`firefoxUserPrefs`](/dotnet/api/class-browsertype#browser-type-launch-persistent-context-option-firefox-user-prefs) in [`BrowserType.LaunchPersistentContextAsync()`](/dotnet/api/class-browsertype#browser-type-launch-persistent-context).

### Other Changes
- Methods [`Download.PathAsync()`](/dotnet/api/class-download#download-path) and [`Download.CreateReadStreamAsync()`](/dotnet/api/class-download#download-create-read-stream) throw an error for failed and cancelled downloads.
- Playwright [docker image](./docker.md) now comes with .NET 8 (new LTS).

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
- [`BrowserContext.WebError`](/dotnet/api/class-browsercontext#browser-context-event-web-error)
- [`Locator.PressSequentiallyAsync()`](/dotnet/api/class-locator#locator-press-sequentially)

### Deprecations
* The following methods were deprecated: [`Page.TypeAsync()`](/dotnet/api/class-page#page-type), [`Frame.TypeAsync()`](/dotnet/api/class-frame#frame-type),
  [`Locator.TypeAsync()`](/dotnet/api/class-locator#locator-type) and [`ElementHandle.TypeAsync()`](/dotnet/api/class-elementhandle#element-handle-type).
  Please use [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) instead which is much faster. Use
  [`Locator.PressSequentiallyAsync()`](/dotnet/api/class-locator#locator-press-sequentially) only if there is a special keyboard
  handling on the page, and you need to press keys one-by-one.

### Browser Versions
* Chromium 117.0.5938.62
* Mozilla Firefox 117.0
* WebKit 17.0

This version was also tested against the following stable channels:
* Google Chrome 116
* Microsoft Edge 116

## Version 1.37

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
* New option `MaskColor` for methods [`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot) and [`Locator.ScreenshotAsync()`](/dotnet/api/class-locator#locator-screenshot) to change default masking color.
* New `uninstall` CLI command to uninstall browser binaries:
  
  ```bash
  $ pwsh bin/Debug/netX/playwright.ps1 uninstall # remove browsers installed by this installation
  $ pwsh bin/Debug/netX/playwright.ps1 uninstall --all # remove all ever-install Playwright browsers
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
* New [`Locator.And()`](/dotnet/api/class-locator#locator-and) to create a locator that matches both locators.
  
  ```csharp
  var button = page.GetByRole(AriaRole.BUTTON).And(page.GetByTitle("Subscribe"));
  ```
* New events [`BrowserContext.Console`](/dotnet/api/class-browsercontext#browser-context-event-console) and [`BrowserContext.Dialog`](/dotnet/api/class-browsercontext#browser-context-event-dialog) to subscribe to any dialogs
  and console messages from any page from the given browser context. Use the new methods [`ConsoleMessage.Page()`](/dotnet/api/class-consolemessage#console-message-page)
  and [`Dialog.Page()`](/dotnet/api/class-dialog#dialog-page) to pin-point event source.

### Browser Versions
* Chromium 114.0.5735.26
* Mozilla Firefox 113.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 113
* Microsoft Edge 113

## Version 1.33

### Locators Update
* Use [`Locator.Or()`](/dotnet/api/class-locator#locator-or) to create a locator that matches either of the two locators.
  Consider a scenario where   you'd like to click on a "New email" button, but sometimes a security settings dialog shows up instead.
  In this case, you can wait for either a "New email" button, or a dialog and act accordingly:
  
  ```csharp
  var newEmail = Page.GetByRole(AriaRole.Button, new() { Name = "New email" });
  var dialog = Page.GetByText("Confirm security settings");
  await Expect(newEmail.Or(dialog)).ToBeVisibleAsync();
  if (await dialog.IsVisibleAsync())
    await Page.GetByRole(AriaRole.Button, new() { Name = "Dismiss" }).ClickAsync();
  await newEmail.ClickAsync();
  ```
* Use new options [`hasNot`](/dotnet/api/class-locator#locator-filter-option-has-not) and [`hasNotText`](/dotnet/api/class-locator#locator-filter-option-has-not-text) in [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter)
  to find elements that **do not match** certain conditions.
  
  ```csharp
  var rowLocator = Page.Locator("tr");
  await rowLocator
      .Filter(new() { HasNotText = "text in column 1" })
      .Filter(new() { HasNot = Page.GetByRole(AriaRole.Button, new() { Name = "column 2 button" })})
      .ScreenshotAsync();
  ```
* Use new web-first assertion [`LocatorAssertions.ToBeAttachedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-attached) to ensure that the element
  is present in the page's DOM. Do not confuse with the [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) that ensures that
  element is both attached & visible.

### New APIs
- [`Locator.Or()`](/dotnet/api/class-locator#locator-or)
- New option [`hasNot`](/dotnet/api/class-locator#locator-filter-option-has-not) in [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter)
- New option [`hasNotText`](/dotnet/api/class-locator#locator-filter-option-has-not-text) in [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter)
- [`LocatorAssertions.ToBeAttachedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-attached)
- New option [`timeout`](/dotnet/api/class-route#route-fetch-option-timeout) in [`Route.FetchAsync()`](/dotnet/api/class-route#route-fetch)

### ⚠️ Breaking change
* The `mcr.microsoft.com/playwright/dotnet:v1.33.0` now serves a Playwright image based on Ubuntu Jammy.
  To use the focal-based image, please use `mcr.microsoft.com/playwright/dotnet:v1.33.0-focal` instead.

### Browser Versions
* Chromium 113.0.5672.53
* Mozilla Firefox 112.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 112
* Microsoft Edge 112

## Version 1.32

### New APIs
- New options [`updateMode`](/dotnet/api/class-page#page-route-from-har-option-update-mode) and [`updateContent`](/dotnet/api/class-page#page-route-from-har-option-update-content) in [`Page.RouteFromHARAsync()`](/dotnet/api/class-page#page-route-from-har) and [`BrowserContext.RouteFromHARAsync()`](/dotnet/api/class-browsercontext#browser-context-route-from-har).
- Chaining existing locator objects, see [locator docs](./locators.md#matching-inside-a-locator) for details.
- New option [`name`](/dotnet/api/class-tracing#tracing-start-chunk-option-name) in method [`Tracing.StartChunkAsync()`](/dotnet/api/class-tracing#tracing-start-chunk).

### Browser Versions
* Chromium 112.0.5615.29
* Mozilla Firefox 111.0
* WebKit 16.4

This version was also tested against the following stable channels:
* Google Chrome 111
* Microsoft Edge 111

## Version 1.31

### New APIs
- New assertion [`LocatorAssertions.ToBeInViewportAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-in-viewport) ensures that locator points to an element that intersects viewport, according to the [intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
  
  ```csharp
  var locator = Page.GetByRole(AriaRole.Button);
  
  // Make sure at least some part of element intersects viewport.
  await Expect(locator).ToBeInViewportAsync();
  
  // Make sure element is fully outside of viewport.
  await Expect(locator).Not.ToBeInViewportAsync();
  
  // Make sure that at least half of the element intersects viewport.
  await Expect(locator).ToBeInViewportAsync(new() { Ratio = 0.5 });
  ```
- New methods [`BrowserContext.NewCDPSessionAsync()`](/dotnet/api/class-browsercontext#browser-context-new-cdp-session) and [`Browser.NewBrowserCDPSessionAsync()`](/dotnet/api/class-browser#browser-new-browser-cdp-session) create a [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) session for the page and browser respectively.

### Miscellaneous
- DOM snapshots in trace viewer can be now opened in a separate window.
- New option [`maxRedirects`](/dotnet/api/class-route#route-fetch-option-max-redirects) for method [`Route.FetchAsync()`](/dotnet/api/class-route#route-fetch).
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
- New method [`Route.FetchAsync()`](/dotnet/api/class-route#route-fetch) and new option `Json` for [`Route.FulfillAsync()`](/dotnet/api/class-route#route-fulfill):
  
  ```csharp
  await Page.RouteAsync("**/api/settings", async route => {
    // Fetch original settings.
    var response = await route.FetchAsync();
  
    // Force settings theme to a predefined value.
    var json = await response.JsonAsync<MyDataType>();
    json.Theme = "Solarized";
  
    // Fulfill with modified data.
    await route.FulfillAsync(new() {
      Json = json
    });
  });
  ```
- New method [`Locator.AllAsync()`](/dotnet/api/class-locator#locator-all) to iterate over all matching elements:
  
  ```csharp
  // Check all checkboxes!
  var checkboxes = Page.GetByRole(AriaRole.Checkbox);
  foreach (var checkbox in await checkboxes.AllAsync())
    await checkbox.CheckAsync();
  ```
- [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) matches now by value or label:
  
  ```html
  <select multiple>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
  </select>
  ```
  
  ```csharp
  await element.SelectOptionAsync("Red");
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

<img src="https://user-images.githubusercontent.com/9798949/202293757-2e3ec0ac-1feb-4d6f-9935-73e08658b76d.png" alt="Locator Explorer" width="1650" height="1096" />

### New APIs
- [`Locator.BlurAsync()`](/dotnet/api/class-locator#locator-blur)
- [`Locator.ClearAsync()`](/dotnet/api/class-locator#locator-clear)

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
- [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) to locate by text content.
- [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) to locate by [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
- [`Page.GetByLabel()`](/dotnet/api/class-page#page-get-by-label) to locate a form control by associated label's text.
- [`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id) to locate an element based on its `data-testid` attribute (other attribute can be configured).
- [`Page.GetByPlaceholder()`](/dotnet/api/class-page#page-get-by-placeholder) to locate an input by placeholder.
- [`Page.GetByAltText()`](/dotnet/api/class-page#page-get-by-alt-text) to locate an element, usually image, by its text alternative.
- [`Page.GetByTitle()`](/dotnet/api/class-page#page-get-by-title) to locate an element by its title.

```csharp
await page.GetByLabel("User Name").FillAsync("John");

await page.GetByLabel("Password").FillAsync("secret-password");

await page.GetByRole(AriaRole.Button, new() { NameString = "Sign in" }).ClickAsync();

await Expect(Page.GetByText("Welcome, John!")).ToBeVisibleAsync();
```

All the same methods are also available on [Locator](/dotnet/api/class-locator), [FrameLocator](/dotnet/api/class-framelocator) and [Frame](/dotnet/api/class-frame) classes.

### Other highlights
- As announced in v1.25, Ubuntu 18 will not be supported as of Dec 2022. In addition to that, there will be no WebKit updates on Ubuntu 18 starting from the next Playwright release.

### Behavior Changes
- [`LocatorAssertions.ToHaveAttributeAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-attribute) with an empty value does not match missing attribute anymore. For example, the following snippet will succeed when `button` **does not** have a `disabled` attribute.
  
  ```csharp
  await Expect(Page.GetByRole(AriaRole.Button)).ToHaveAttributeAsync("disabled", "");
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
- New option `Enabled` for [`LocatorAssertions.ToBeEnabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-enabled).
- [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) now pierces open shadow roots.
- New option `Editable` for [`LocatorAssertions.ToBeEditableAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-editable).
- New option `Visible` for [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible).
- [`ApiResponseAssertions.ToBeOKAsync()`](/dotnet/api/class-apiresponseassertions#api-response-assertions-to-be-ok) is now available.

### Other highlights
- New option `MaxRedirects` for [`ApiRequestContext.GetAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-get) and others to limit redirect count.
- Codegen now supports MSTest and NUnit frameworks.
- ASP .NET is now supported.

### Behavior Change

A bunch of Playwright APIs already support the `WaitUntil: WaitUntilState.DOMContentLoaded` option.
For example:

```csharp
await Page.GotoAsync("https://playwright.dev", new() { WaitUntil = WaitUntilState.DOMContentLoaded });
```

Prior to 1.26, this would wait for all iframes to fire the `DOMContentLoaded`
event.

To align with web specification, the `WaitUntilState.DOMContentLoaded` value only waits for
the target frame to fire the `'DOMContentLoaded'` event. Use `WaitUntil: WaitUntilState.Load` to wait for all iframes.

### Browser Versions
* Chromium 106.0.5249.30
* Mozilla Firefox 104.0
* WebKit 16.0

This version was also tested against the following stable channels:
* Google Chrome 105
* Microsoft Edge 105

## Version 1.25

### New .runsettings file support

`Microsoft.Playwright.NUnit` and `Microsoft.Playwright.MSTest` will now consider the `.runsettings` file and passed settings via the CLI when running end-to-end tests. See in the [documentation](./test-runners) for a full list of supported settings.

The following does now work:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- Playwright -->
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <ExpectTimeout>5000</ExpectTimeout>
    <LaunchOptions>
      <Headless>true</Headless>
      <Channel>msedge</Channel>
    </LaunchOptions>
  </Playwright>
  <!-- General run configuration -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- For debugging selectors, it's recommend to set the following environment variable -->
      <DEBUG>pw:api</DEBUG>
    </EnvironmentVariables>
  </RunConfiguration>
</RunSettings>
```

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

### New introduction docs

We rewrote our Getting Started docs to be more end-to-end testing focused. Check them out on [playwright.dev](./intro).

## Version 1.23

### API Testing

Playwright for .NET 1.23 introduces new [API Testing](./api/class-apirequestcontext) that lets you send requests to the server directly from .NET!
Now you can:
- test your server API
- prepare server side state before visiting the web application in a test
- validate server side post-conditions after running some actions in the browser

To do a request on behalf of Playwright's Page, use **new [`Page.APIRequest`](/dotnet/api/class-page#page-request) API**:

```csharp
// Do a GET request on behalf of page
var response = await Page.APIRequest.GetAsync("http://example.com/foo.json");
Console.WriteLine(response.Status);
Console.WriteLine(response.StatusText);
Console.WriteLine(response.Ok);
Console.WriteLine(response.Headers["Content-Type"]);
Console.WriteLine(await response.TextAsync());
Console.WriteLine((await response.JsonAsync())?.GetProperty("foo").GetString());
```

Read more about it in our [API testing guide](./api-testing).

### Network Replay

Now you can record network traffic into a HAR file and re-use this traffic in your tests.

To record network into HAR file:

```bash
pwsh bin/Debug/netX/playwright.ps1 open --save-har=example.har --save-har-glob="**/api/**" https://example.com
```

Alternatively, you can record HAR programmatically:

```csharp
var context = await browser.NewContextAsync(new()
{
  RecordHarPath = harPath,
  RecordHarUrlFilterString = "**/api/**",
});

// ... Perform actions ...

// Close context to ensure HAR is saved to disk.
context.CloseAsync();
```

Use the new methods [`Page.RouteFromHARAsync()`](/dotnet/api/class-page#page-route-from-har) or [`BrowserContext.RouteFromHARAsync()`](/dotnet/api/class-browsercontext#browser-context-route-from-har) to serve matching responses from the [HAR](http://www.softwareishard.com/blog/har-12-spec/) file:

```csharp
await context.RouteFromHARAsync("example.har");
```

Read more in [our documentation](./mock.md#mocking-with-har-files).

### Advanced Routing

You can now use [`Route.FallbackAsync()`](/dotnet/api/class-route#route-fallback) to defer routing to other handlers.

Consider the following example:

```csharp
// Remove a header from all requests.
await page.RouteAsync("**/*", async route =>
{
    var headers = route.Request.Headers;
    headers.Remove("X-Secret");
    await route.ContinueAsync(new() { Headers = headers });
});

// Abort all images.
await page.RouteAsync("**/*", async route =>
{
    if (route.Request.ResourceType == "image")
    {
        await route.AbortAsync();
    }
    else
    {
        await route.FallbackAsync();
    }
});
```

Note that the new methods [`Page.RouteFromHARAsync()`](/dotnet/api/class-page#page-route-from-har) and [`BrowserContext.RouteFromHARAsync()`](/dotnet/api/class-browsercontext#browser-context-route-from-har) also participate in routing and could be deferred to.

### Web-First Assertions Update
* New method [`LocatorAssertions.ToHaveValuesAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-values) that asserts all selected values of `<select multiple>` element.
* Methods [`LocatorAssertions.ToContainTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text) and [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) now accept `ignoreCase` option.

### Miscellaneous
* If there's a service worker that's in your way, you can now easily disable it with a new context option `serviceWorkers`:
  
  ```csharp
  var context = await Browser.NewContextAsync(new()
  {
      ServiceWorkers = ServiceWorkerPolicy.Block
  });
  ```
* Using `.zip` path for `recordHar` context option automatically zips the resulting HAR:
  
  ```csharp
  var context = await Browser.NewContextAsync(new() { RecordHarPath = "example.har.zip" });
  ```
* If you intend to edit HAR by hand, consider using the `"minimal"` HAR recording mode
  that only records information that is essential for replaying:
  
  ```csharp
  var context = await Browser.NewContextAsync(new() { RecordHarPath = "example.har", RecordHarMode = HarMode.Minimal });
  ```
* Playwright now runs on Ubuntu 22 amd64 and Ubuntu 22 arm64.
* Playwright for .NET now supports **linux-arm64** and provides a **arm64 Ubuntu 20.04 Docker image** for it.

## Version 1.22

### Highlights
- Role selectors that allow selecting elements by their [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  
  ```csharp
  // Click a button with accessible name "log in"
  await page.Locator("role=button[name='log in']").ClickAsync();
  ```
  
  Read more in [our documentation](./locators.md#locate-by-role).
- New [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) API to filter an existing locator
  
  ```csharp
  var buttons = page.Locator("role=button");
  // ...
  var submitLocator = buttons.Filter(new() { HasText = "Sign up" });
  await submitLocator.ClickAsync();
  ```

## Version 1.21

### Highlights
- New role selectors that allow selecting elements by their [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  
  ```csharp
  // Click a button with accessible name "log in"
  await page.Locator("role=button[name='log in']").ClickAsync();
  ```
  
  Read more in [our documentation](./locators.md#locate-by-role).
- New `scale` option in [`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot) for smaller sized screenshots.
- New `caret` option in [`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot) to control text caret. Defaults to `"hide"`.
- We now ship a designated .NET docker image `mcr.microsoft.com/playwright/dotnet`. Read more in [our documentation](./docker).

### Behavior Changes
- Playwright now supports large file uploads (100s of MBs) via [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) API.

### Browser Versions
- Chromium 101.0.4951.26
- Mozilla Firefox 98.0.2
- WebKit 15.4

This version was also tested against the following stable channels:
- Google Chrome 100
- Microsoft Edge 100

## Version 1.20

### Web-First Assertions

Playwright for .NET 1.20 introduces [Web-First Assertions](./test-assertions).

Consider the following example:

```csharp
using System.Threading.Tasks;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[TestFixture]
public class ExampleTests : PageTest
{
    [Test]
    public async Task StatusBecomesSubmitted()
    {
        await Expect(Page.Locator(".status")).ToHaveTextAsync("Submitted");
    }
}
```

Playwright will be re-testing the node with the selector `.status` until
fetched Node has the `"Submitted"` text. It will be re-fetching the node and
checking it over and over, until the condition is met or until the timeout is
reached. You can pass this timeout as an option.

Read more in [our documentation](./test-assertions).

### Other Updates
- New options for methods [`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot), [`Locator.ScreenshotAsync()`](/dotnet/api/class-locator#locator-screenshot) and [`ElementHandle.ScreenshotAsync()`](/dotnet/api/class-elementhandle#element-handle-screenshot):
  * Option `ScreenshotAnimations.Disabled` rewinds all CSS animations and transitions to a consistent state
  * Option `mask: Locator[]` masks given elements, overlaying them with pink `#FF00FF` boxes.
- [`Locator.HighlightAsync()`](/dotnet/api/class-locator#locator-highlight) visually reveals element(s) for easier debugging.

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
  
  ```csharp
  await Page.Locator("article", new() { Has = Page.Locator(".highlight") }).ClickAsync();
  ```
  
  Read more in [locator documentation](./api/class-locator#locator-locator)
- New [`Locator.Page()`](/dotnet/api/class-locator#locator-page)
- [`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot) and [`Locator.ScreenshotAsync()`](/dotnet/api/class-locator#locator-screenshot) now automatically hide blinking caret
- Playwright Codegen now generates locators and frame locators

### Browser Versions
- Chromium 100.0.4863.0
- Mozilla Firefox 96.0.1
- WebKit 15.4

This version was also tested against the following stable channels:
- Google Chrome 98
- Microsoft Edge 98

## Version 1.18

### Locator Improvements
- [`Locator.DragToAsync()`](/dotnet/api/class-locator#locator-drag-to)
- Each locator can now be optionally filtered by the text it contains:
  
  ```csharp
  await Page.Locator("li", new() { HasTextString = "My Item" })
            .Locator("button").click();
  ```
  
  Read more in [locator documentation](./api/class-locator#locator-locator)

### New APIs & changes
- [`AcceptDownloads`](./api/class-browser#browser-new-context-option-accept-downloads) option now defaults to `true`.
- [`Sources`](./api/class-tracing#tracing-start-option-sources) option to embed sources into traces.

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

Frame locators can be created with either [`Page.FrameLocator()`](/dotnet/api/class-page#page-frame-locator) or [`Locator.FrameLocator()`](/dotnet/api/class-locator#locator-frame-locator) method.

```csharp
var locator = page.FrameLocator("#my-frame").Locator("text=Submit");
await locator.ClickAsync();
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
  pwsh bin/Debug/netX/playwright.ps1 install msedge
  ```

### New APIs
- Tracing now supports a [`'title'`](./api/class-tracing#tracing-start-option-title) option
- Page navigations support a new [`'commit'`](./api/class-page#page-goto) waiting option

## Version 1.16

### 🎭 Playwright Library

#### Locator.WaitForAsync

Wait for a locator to resolve to a single element with a given state.
Defaults to the `state: 'visible'`.

```csharp
var orderSent = page.Locator("#order-sent");
orderSent.WaitForAsync();
```

Read more about [`Locator.WaitForAsync()`](/dotnet/api/class-locator#locator-wait-for).

### 🎭 Playwright Trace Viewer
- run trace viewer with `pwsh bin/Debug/netX/playwright.ps1 show-trace` and drop trace files to the trace viewer PWA
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

By using [`Mouse.WheelAsync()`](/dotnet/api/class-mouse#mouse-wheel) you are now able to scroll vertically or horizontally.

### 📜 New Headers API

Previously it was not possible to get multiple header values of a response. This is now possible and additional helper functions are available:
- [`Request.AllHeadersAsync()`](/dotnet/api/class-request#request-all-headers)
- [`Request.HeadersArrayAsync()`](/dotnet/api/class-request#request-headers-array)
- [`Request.HeaderValueAsync()`](/dotnet/api/class-request#request-header-value)
- [`Response.AllHeadersAsync()`](/dotnet/api/class-response#response-all-headers)
- [`Response.HeadersArrayAsync()`](/dotnet/api/class-response#response-headers-array)
- [`Response.HeaderValueAsync()`](/dotnet/api/class-response#response-header-value)
- [`Response.HeaderValuesAsync()`](/dotnet/api/class-response#response-header-values)

### 🌈 Forced-Colors emulation

Its now possible to emulate the `forced-colors` CSS media feature by passing it in the [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) or calling [`Page.EmulateMediaAsync()`](/dotnet/api/class-page#page-emulate-media).

### New APIs
- [`Page.RouteAsync()`](/dotnet/api/class-page#page-route) accepts new `times` option to specify how many times this route should be matched.
- [`Page.SetCheckedAsync()`](/dotnet/api/class-page#page-set-checked) and [`Locator.SetCheckedAsync()`](/dotnet/api/class-locator#locator-set-checked) were introduced to set the checked state of a checkbox.
- [`Request.SizesAsync()`](/dotnet/api/class-request#request-sizes) Returns resource size information for given http request.
- [`Tracing.StartChunkAsync()`](/dotnet/api/class-tracing#tracing-start-chunk) - Start a new trace chunk.
- [`Tracing.StopChunkAsync()`](/dotnet/api/class-tracing#tracing-stop-chunk) - Stops a new trace chunk.

### Important ⚠
* ⬆ .NET Core Apps 2.1 are **no longer** supported for our CLI tooling. As of August 31st, 2021, .NET Core 2.1 is no [longer supported](https://devblogs.microsoft.com/dotnet/net-core-2-1-will-reach-end-of-support-on-august-21-2021/) and will not receive any security updates. We've decided to move the CLI forward and require .NET Core 3.1 as a minimum.

### Browser Versions
- Chromium 96.0.4641.0
- Mozilla Firefox 92.0
- WebKit 15.0

## Version 1.14

#### ⚡️ New "strict" mode

Selector ambiguity is a common problem in automation testing. **"strict" mode**
ensures that your selector points to a single element and throws otherwise.

Set `setStrict(true)` in your action calls to opt in.

```csharp
// This will throw if you have more than one button!
await page.Locator("button", new() { Strict = true });
```

#### 📍 New [**Locators API**](./api/class-locator)

Locator represents a view to the element(s) on the page. It captures the logic sufficient to retrieve the element at any given moment.

The difference between the [Locator](./api/class-locator) and [ElementHandle](./api/class-elementhandle) is that the latter points to a particular element, while [Locator](./api/class-locator) captures the logic of how to retrieve that element.

Also, locators are **"strict" by default**!

```csharp
var locator = page.Locator("button");
await locator.ClickAsync();
```

Learn more in the [documentation](./api/class-locator).

#### 🧩 Experimental [**React**](./other-locators.md) and [**Vue**](./other-locators.md) selector engines

React and Vue selectors allow selecting elements by its component name and/or property values. The syntax is very similar to [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) and supports all attribute selector operators.

```csharp
await page.Locator("_react=SubmitButton[enabled=true]").ClickAsync();
await page.Locator("_vue=submit-button[enabled=true]").ClickAsync();
```

Learn more in the [react selectors documentation](./other-locators.md) and the [vue selectors documentation](./other-locators.md).

#### ✨ New [**`nth`**](./other-locators.md#n-th-element-locator) and [**`visible`**](./other-locators.md#css-matching-only-visible-elements) selector engines
- [`nth`](./other-locators.md#n-th-element-locator) selector engine is equivalent to the `:nth-match` pseudo class, but could be combined with other selector engines.
- [`visible`](./other-locators.md#css-matching-only-visible-elements) selector engine is equivalent to the `:visible` pseudo class, but could be combined with other selector engines.

```csharp
// select the first button among all buttons
await button.ClickAsync("button >> nth=0");
// or if you are using locators, you can use First, Nth() and Last
await page.Locator("button").First.ClickAsync();

// click a visible button
await button.ClickAsync("button >> visible=true");
```

### Browser Versions
- Chromium 94.0.4595.0
- Mozilla Firefox 91.0
- WebKit 15.0

## Version 1.13

#### Playwright
- **🖖 Programmatic drag-and-drop support** via the [`Page.DragAndDropAsync()`](/dotnet/api/class-page#page-drag-and-drop) API.
- **🔎 Enhanced HAR** with body sizes for requests and responses. Use via `recordHar` option in [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context).

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
- new `baseURL` option in [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) and [`Browser.NewPageAsync()`](/dotnet/api/class-browser#browser-new-page)
- [`Response.SecurityDetailsAsync()`](/dotnet/api/class-response#response-security-details) and [`Response.ServerAddrAsync()`](/dotnet/api/class-response#response-server-addr)
- [`Page.DragAndDropAsync()`](/dotnet/api/class-page#page-drag-and-drop) and [`Frame.DragAndDropAsync()`](/dotnet/api/class-frame#frame-drag-and-drop)
- [`Download.CancelAsync()`](/dotnet/api/class-download#download-cancel)
- [`Page.InputValueAsync()`](/dotnet/api/class-page#page-input-value), [`Frame.InputValueAsync()`](/dotnet/api/class-frame#frame-input-value) and [`ElementHandle.InputValueAsync()`](/dotnet/api/class-elementhandle#element-handle-input-value)
- new `force` option in [`Page.FillAsync()`](/dotnet/api/class-page#page-fill), [`Frame.FillAsync()`](/dotnet/api/class-frame#frame-fill), and [`ElementHandle.FillAsync()`](/dotnet/api/class-elementhandle#element-handle-fill)
- new `force` option in [`Page.SelectOptionAsync()`](/dotnet/api/class-page#page-select-option), [`Frame.SelectOptionAsync()`](/dotnet/api/class-frame#frame-select-option), and [`ElementHandle.SelectOptionAsync()`](/dotnet/api/class-elementhandle#element-handle-select-option)

## Version 1.12

#### Highlights
- Playwright for .NET v1.12 is now stable!
- Ships with the [codegen](./codegen.md) and [trace viewer](./trace-viewer.md) tools out-of-the-box

#### Browser Versions
- Chromium 93.0.4530.0
- Mozilla Firefox 89.0
- WebKit 14.2

This version of Playwright was also tested against the following stable channels:
- Google Chrome 91
- Microsoft Edge 91
