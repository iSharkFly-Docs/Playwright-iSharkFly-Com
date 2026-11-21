---
title: Playwright
outline: 2
---

# Playwright

<Badge type="info" text="Added in: v1.8" />

Playwright module provides a method to launch a browser instance. The following is a typical example of using Playwright
to drive automation:

```java
import com.microsoft.playwright.*;

public class Example {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      BrowserType chromium = playwright.chromium();
      Browser browser = chromium.launch();
      Page page = browser.newPage();
      page.navigate("http://example.com");
      // other actions...
      browser.close();
    }
  }
}
```

## Methods

### playwright.close() {#playwright-close}

<Badge type="info" text="Added in: v1.9" />

Terminates this instance of Playwright, will also close all created browsers if they are still running.


### playwright.create() {#playwright-create}

<Badge type="info" text="Added in: v1.10" />

Launches new Playwright driver process and connects to it. [`playwright.close()`](/java/api/class-playwright#playwright-close) should be called when the instance is no longer needed.

```java
Playwright playwright = Playwright.create();
Browser browser = playwright.webkit().launch();
Page page = browser.newPage();
page.navigate("https://www.w3.org/");
playwright.close();
```

**Arguments**

- <a id="playwright-create-option-options"></a>`options` `Object` *(optional)*

  - <a id="playwright-create-option-env"></a>`env` `Object<string, string>` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Additional environment variables that will be passed to the driver process. By default driver
    process inherits environment variables of the Playwright process.

**Returns**

- `Playwright`


## Properties

### playwright.chromium() {#playwright-chromium}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Chromium, returning instances of [Browser](/java/api/class-browser).

**Type**

- `BrowserType`


### playwright.firefox() {#playwright-firefox}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Firefox, returning instances of [Browser](/java/api/class-browser).

**Type**

- `BrowserType`


### playwright.request() {#playwright-request}

<Badge type="info" text="Added in: v1.16" />

Exposes API that can be used for the Web API testing.

**Type**

- `APIRequest`


### playwright.selectors() {#playwright-selectors}

<Badge type="info" text="Added in: v1.8" />

Selectors can be used to install custom selector engines. See
[extensibility](../extensibility.md) for more information.

**Type**

- `Selectors`


### playwright.webkit() {#playwright-webkit}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to WebKit, returning instances of [Browser](/java/api/class-browser).

**Type**

- `BrowserType`

