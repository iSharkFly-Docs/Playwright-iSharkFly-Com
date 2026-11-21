---
title: Electron
outline: 2
---

# Electron

<Badge type="info" text="Added in: v1.9" />

Playwright has **experimental** support for Electron automation. You can access electron namespace via:

```js
const { _electron } = require('playwright');
```

An example of the Electron automation script would be:

```js
const { _electron: electron } = require('playwright');

(async () => {
  // Launch Electron app.
  const electronApp = await electron.launch({ args: ['main.js'] });

  // Evaluation expression in the Electron context.
  const appPath = await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath();
  });
  console.log(appPath);

  // Get the first window that the app opens, wait if necessary.
  const window = await electronApp.firstWindow();
  // Print the title.
  console.log(await window.title());
  // Capture a screenshot.
  await window.screenshot({ path: 'intro.png' });
  // Direct Electron console to Node terminal.
  window.on('console', console.log);
  // Click button.
  await window.click('text=Click me');
  // Exit app.
  await electronApp.close();
})();
```

**Supported Electron versions are:**
* v21+

**Known issues:**

If you are not able to launch Electron and it will end up in timeouts during launch, try the following:
* Ensure that `nodeCliInspect` ([FuseV1Options.EnableNodeCliInspectArguments](https://www.electronjs.org/docs/latest/tutorial/fuses#nodecliinspect)) fuse is **not** set to `false`.

**Mocking native dialogs:**

Playwright does not intercept the native Electron [dialog](https://www.electronjs.org/docs/latest/api/dialog) API
(`dialog.showOpenDialog`, `dialog.showSaveDialog`, `dialog.showMessageBox`, etc.) because those calls happen in the
Electron main process and go straight to OS APIs. Use [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) to replace the
relevant methods in the main process so tests run deterministically without any OS-level UI:

```js
// Stub the open dialog to always return a fixed path.
await electronApp.evaluate(({ dialog }, filePaths) => {
  dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths });
}, ['/path/to/file.txt']);

// Stub the save dialog.
await electronApp.evaluate(({ dialog }, filePath) => {
  dialog.showSaveDialog = () => Promise.resolve({ canceled: false, filePath });
}, '/path/to/saved.txt');

// Stub showMessageBox to click the first button.
await electronApp.evaluate(({ dialog }) => {
  dialog.showMessageBox = () => Promise.resolve({ response: 0, checkboxChecked: false });
});
```

The replacement persists until the application is closed. Synchronous variants
(`showOpenDialogSync`, `showSaveDialogSync`, `showMessageBoxSync`) can be stubbed the same way — just return the
value directly instead of a `Promise`.

## Methods

### electron.launch() {#electron-launch}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Launches electron application specified with the [`executablePath`](/api/class-electron#electron-launch-option-executable-path).

**Arguments**

- <a id="electron-launch-option-options"></a>`options` `Object` *(optional)*

  - <a id="electron-launch-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="electron-launch-option-args"></a>`args` `Array<string>` *(optional)*

    Additional arguments to pass to the application when launching. You typically pass the main
    script name here.
  - <a id="electron-launch-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)* <Badge type="info" text="Added in: v1.59" />

    If specified, artifacts (traces, videos, downloads, HAR files, etc.) are saved into this directory. The directory is not cleaned up when the browser closes. If not specified, a temporary directory is used and cleaned up when the browser closes.
  - <a id="electron-launch-option-bypass-csp"></a>`bypassCSP` `boolean` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Toggles bypassing page's Content-Security-Policy. Defaults to `false`.
  - <a id="electron-launch-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(optional)* <Badge type="info" text="Added in: v1.59" />

    Enable Chromium sandboxing. Defaults to `false`.
  - <a id="electron-launch-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. See
    [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="electron-launch-option-cwd"></a>`cwd` `string` *(optional)*

    Current working directory to launch application from.
  - <a id="electron-launch-option-env"></a>`env` `Object<string, string>` *(optional)*

    Specifies environment variables that will be visible to Electron. Defaults to `process.env`.
  - <a id="electron-launch-option-executable-path"></a>`executablePath` `string` *(optional)*

    Launches given Electron application. If not specified, launches the default Electron
    executable installed in this package, located at `node_modules/.bin/electron`.
  - <a id="electron-launch-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)* <Badge type="info" text="Added in: v1.12" />

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="electron-launch-option-geolocation"></a>`geolocation` `Object` *(optional)* <Badge type="info" text="Added in: v1.12" />

    - `latitude` `float` <Badge type="info" text="Added in: v1.12" />

      Latitude between -90 and 90.
    - `longitude` `float` <Badge type="info" text="Added in: v1.12" />

      Longitude between -180 and 180.
    - `accuracy` `float` *(optional)* <Badge type="info" text="Added in: v1.12" />

      Non-negative accuracy value. Defaults to `0`.
  - <a id="electron-launch-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
    If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

    Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

    - `username` `string` <Badge type="info" text="Added in: v1.12" />
    - `password` `string` <Badge type="info" text="Added in: v1.12" />
    - `origin` `string` *(optional)* <Badge type="info" text="Added in: v1.12" />

      Restrain sending http credentials on specific origin (scheme://host:port).
    - `send` `"unauthorized" | "always"` *(optional)* <Badge type="info" text="Added in: v1.12" />

      This option only applies to the requests sent from corresponding [APIRequestContext](/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="electron-launch-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="electron-launch-option-locale"></a>`locale` `string` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="electron-launch-option-offline"></a>`offline` `boolean` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="electron-launch-option-record-har"></a>`recordHar` `Object` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Enables [HAR](http://www.softwareishard.com/blog/har-12-spec) recording for all pages into `recordHar.path` file. If not
    specified, the HAR is not recorded. Make sure to await [`browserContext.close()`](/api/class-browsercontext#browser-context-close) for the HAR to be
    saved.

    - `omitContent` `boolean` *(optional)* <Badge type="info" text="Added in: v1.12" />

      Optional setting to control whether to omit request content from the HAR. Defaults to
      `false`. Deprecated, use `content` policy instead.
    - `content` `"omit" | "embed" | "attach"` *(optional)* <Badge type="info" text="Added in: v1.12" />

      Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file as per HAR specification. Defaults to `attach` for `.zip` output files and to `embed` for all other file extensions.
    - `path` `path` <Badge type="info" text="Added in: v1.12" />

      Path on the filesystem to write the HAR file to. If the file name ends with `.zip`, `content: 'attach'` is used by default.
    - `mode` `"full" | "minimal"` *(optional)* <Badge type="info" text="Added in: v1.12" />

      When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
    - `urlFilter` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.12" />

      A glob or regex pattern to filter requests that are stored in the HAR. When a [`baseURL`](/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path, it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor. Defaults to none.
  - <a id="electron-launch-option-record-video"></a>`recordVideo` `Object` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Enables video recording for all pages into `recordVideo.dir` directory. If not specified videos are not recorded. Make
    sure to await [`browserContext.close()`](/api/class-browsercontext#browser-context-close) for videos to be saved.

    - `dir` `path` *(optional)* <Badge type="info" text="Added in: v1.12" />

      Path to the directory to put videos into. If not specified, the videos will be stored in `artifactsDir` (see [`browserType.launch()`](/api/class-browsertype#browser-type-launch) options).
    - `size` `Object` *(optional)* <Badge type="info" text="Added in: v1.12" />

      Optional dimensions of the recorded videos. If not specified the size will be equal to `viewport`
      scaled down to fit into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450.
      Actual picture of each page will be scaled down if necessary to fit the specified size.

      - `width` `int` <Badge type="info" text="Added in: v1.12" />

        Video frame width.
      - `height` `int` <Badge type="info" text="Added in: v1.12" />

        Video frame height.
    - `fps` `int` *(optional)* <Badge type="info" text="Added in: v1.12" />

      Frame rate of the recorded videos in frames per second. Defaults to `25`. Firefox and WebKit currently capture up to 25 frames per second.
    - `showActions` `Object` *(optional)* <Badge type="info" text="Added in: v1.12" />

      If specified, enables visual annotations on interacted elements during video recording.

      - `duration` `float` *(optional)* <Badge type="info" text="Added in: v1.12" />

        How long each annotation is displayed in milliseconds. Defaults to `500`.
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(optional)* <Badge type="info" text="Added in: v1.12" />

        Position of the action title overlay. Defaults to `"top-right"`.
      - `fontSize` `int` *(optional)* <Badge type="info" text="Added in: v1.12" />

        Font size of the action title in pixels. Defaults to `24`. Deprecated, use `style.title` instead.
      - `cursor` `"none" | "pointer"` *(optional)* <Badge type="info" text="Added in: v1.12" />

        Cursor decoration shown for pointer actions. `"pointer"` (the default) renders a mouse pointer that animates from the previous action point to the next one. `"none"` disables the cursor decoration.
      - `style` `Object` *(optional)* <Badge type="info" text="Added in: v1.12" />

        Styles of the action decorations.

        - `point` `string` *(optional)* <Badge type="info" text="Added in: v1.12" />

          CSS declarations for the zero-sized marker centered on the action point. Not shown when omitted.
        - `highlight` `string` *(optional)* <Badge type="info" text="Added in: v1.12" />

          CSS declarations for the box that covers the target element. Not shown when omitted.
        - `title` `string` *(optional)* <Badge type="info" text="Added in: v1.12" />

          CSS declarations for the action title.
  - <a id="electron-launch-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.15" />

    Maximum time in milliseconds to wait for the application to start. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
  - <a id="electron-launch-option-timezone-id"></a>`timezoneId` `string` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="electron-launch-option-traces-dir"></a>`tracesDir` `path` *(optional)* <Badge type="info" text="Added in: v1.36" />

    If specified, traces are saved into this directory.

**Returns**

- `Promise<ElectronApplication>`

