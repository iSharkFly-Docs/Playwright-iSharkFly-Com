---
title: Logger
outline: 2
---

# Logger

<Badge type="info" text="Added in: v1.8" />

Playwright generates a lot of logs and they are accessible via the pluggable logger sink.

```js
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
  const browser = await chromium.launch({
    logger: {
      isEnabled: (name, severity) => name === 'api',
      log: (name, severity, message, args) => console.log(`${name} ${message}`)
    }
  });
  // ...
})();
```

## Methods

### logger.isEnabled() {#logger-is-enabled}

<Badge type="info" text="Added in: v1.8" />

Determines whether sink is interested in the logger with the given name and severity.

**Arguments**

- <a id="logger-is-enabled-option-name"></a>`name` `string`

  logger name
- <a id="logger-is-enabled-option-severity"></a>`severity` `"verbose" | "info" | "warning" | "error"`

**Returns**

- `boolean`


### logger.log() {#logger-log}

<Badge type="info" text="Added in: v1.8" />

**Arguments**

- <a id="logger-log-option-name"></a>`name` `string`

  logger name
- <a id="logger-log-option-severity"></a>`severity` `"verbose" | "info" | "warning" | "error"`
- <a id="logger-log-option-message"></a>`message` `string | Error`

  log message format
- <a id="logger-log-option-args"></a>`args` `Array<Object>`

  message arguments
- <a id="logger-log-option-hints"></a>`hints` `Object`

  optional formatting hints

  - `color` `string` *(optional)*

    Optional preferred logger color.

