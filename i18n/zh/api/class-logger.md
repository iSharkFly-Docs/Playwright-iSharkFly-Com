---
title: Logger
outline: 2
---

# Logger

<Badge type="info" text="Added in: v1.8" />

Playwright 生成大量日志，这些日志可以通过可插拔的日志接收器访问。

```js
const { chromium } = require('playwright');  // 或 'firefox' 或 'webkit'。

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

## 方法

### logger.isEnabled() {#logger-is-enabled}

<Badge type="info" text="Added in: v1.8" />

确定接收器是否对具有给定名称和严重级别的日志记录器感兴趣。

**参数**

- <a id="logger-is-enabled-option-name"></a>`name` `string`

  日志记录器名称
- <a id="logger-is-enabled-option-severity"></a>`severity` `"verbose" | "info" | "warning" | "error"`

**返回值**

- `boolean`


### logger.log() {#logger-log}

<Badge type="info" text="Added in: v1.8" />

**参数**

- <a id="logger-log-option-name"></a>`name` `string`

  日志记录器名称
- <a id="logger-log-option-severity"></a>`severity` `"verbose" | "info" | "warning" | "error"`
- <a id="logger-log-option-message"></a>`message` `string | Error`

  日志消息格式
- <a id="logger-log-option-args"></a>`args` `Array<Object>`

  消息参数
- <a id="logger-log-option-hints"></a>`hints` `Object`

  可选的格式化提示

  - `color` `string` *(可选)*

    可选的首选日志记录器颜色。
