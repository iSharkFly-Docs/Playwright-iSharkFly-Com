---
title: "Web 服务器"
---

# Web 服务器

## 介绍

Playwright 在配置文件中提供了 `webServer` 选项，使你能够在运行测试之前启动本地开发服务器。这对于在开发过程中编写测试以及没有可用的预发布或生产 URL 进行测试时非常理想。

要仅在特定项目运行时启动服务器，请在该项目内部配置
[`testProject.webServer`](/api/class-testproject#test-project-web-server)。无论选择哪些项目，顶级服务器都会启动。将多个项目共享的服务器放在顶级。

## 配置 Web 服务器

在 Playwright 配置中使用 `webServer` 属性在测试期间启动开发 Web 服务器。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 在开始测试之前运行本地开发服务器
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
```

:::

| 属性 | 描述 |
| :- | :- |
| [`testConfig.webServer`](/api/class-testconfig#test-config-web-server) | 在测试期间启动开发 Web 服务器（或多个）。 |
| `command`| 启动应用程序本地开发服务器的 shell 命令。 |
| `cwd` | 生成进程的当前工作目录，默认为配置文件所在的目录。 |
| `env` | 命令的环境变量。默认继承 `process.env` 并添加 `PLAYWRIGHT_TEST=1`。 |
| `gracefulShutdown` | 如何关闭进程。如果未指定，进程组将被强制 `SIGKILL`。如果设置为 `{ signal: 'SIGTERM', timeout: 500 }`，进程组将收到 `SIGTERM` 信号，如果在 500ms 内没有退出则发送 `SIGKILL`。你也可以使用 `SIGINT` 作为信号。`0` 超时意味着不会发送 `SIGKILL`。Windows 不支持 `SIGTERM` 和 `SIGINT` 信号，因此此选项在 Windows 上被忽略。注意关闭 Docker 容器需要 `SIGTERM`。 |
| `ignoreHTTPSErrors` | 获取 `url` 时是否忽略 HTTPS 错误。默认为 `false`。 |
| `name` | 为 Web 服务器指定自定义名称。此名称将作为日志消息的前缀。默认为 `[WebServer]`。 |
| `port` | **已弃用**。请使用 `url` 替代。你的 HTTP 服务器预期出现的端口。它会等待直到接受连接。应指定 `port` 或 `url` 中的一个。 |
| `reuseExistingServer`| 如果为 `true`，当可用时将重用 `port` 或 `url` 上的现有服务器。如果该 `port` 或 `url` 上没有运行的服务器，它将运行命令启动新服务器。如果为 `false`，当有现有进程在 `port` 或 `url` 上监听时将抛出错误。这通常应设置为 `!process.env.CI` 以允许在本地运行测试时使用本地开发服务器。 |
| `stderr` | 是否将命令的 stderr 管道到进程 stderr 或忽略它。默认为 `"pipe"`。 |
| `stdout` | 如果为 `"pipe"`，它将把命令的 stdout 管道到进程 stdout。如果为 `"ignore"`，它将忽略命令的 stdout。默认为 `"ignore"`。 |
| `timeout` | 等待进程启动并可用的时间（毫秒）。默认为 60000。 |
| `url`| 你的 HTTP 服务器的 URL，当服务器准备好接受连接时，预期返回 2xx、3xx、400、401、402 或 403 状态码。应指定 `port` 或 `url` 中的一个。如果同时指定了 `url` 和 `wait`，则当满足至少一个条件时认为服务器已启动。 |
| `wait` | 仅当产生给定输出时才认为命令已启动。接受一个带有可选 `stdout` 和/或 `stderr` 正则表达式的对象。正则表达式中的命名捕获组存储在环境中，例如 `/Listening on port (?<my_server_port>\d+)/` 将把端口号存储在 `process.env['MY_SERVER_PORT']` 中。如果同时指定了 `url` 和 `wait`，则当满足至少一个条件时认为服务器已启动。 |

## 添加服务器超时

Web 服务器有时可能需要更长时间才能启动。在这种情况下，你可以增加等待服务器启动的超时时间。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 其余配置...

  // 在开始测试之前运行本地开发服务器
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

:::

## 添加 baseURL

还建议在配置的 `use: {}` 部分中指定 `baseURL`，这样测试可以使用相对 URL，而不必一遍又一遍地指定完整 URL。

当使用 [`page.goto()`](/api/class-page#page-goto)、[`page.route()`](/api/class-page#page-route)、[`page.waitForURL()`](/api/class-page#page-wait-for-url)、[`page.waitForRequest()`](/api/class-page#page-wait-for-request) 或 [`page.waitForResponse()`](/api/class-page#page-wait-for-response) 时，它会使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数来构建相应的 URL，将基础 URL 纳入考虑。例如，将 baseURL 设置为 `http://localhost:3000` 并在测试中导航到 `/login`，Playwright 将使用 `http://localhost:3000/login` 运行测试。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 其余配置...

  // 在开始测试之前运行本地开发服务器
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

:::

现在你可以在导航页面时使用相对路径：

::: code-group

```js [test.spec.ts]
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  // 这将导航到 http://localhost:3000/login
  await page.goto('./login');
});
```

:::

## 多个 Web 服务器

可以通过提供 `webServer` 配置数组同时启动多个 Web 服务器（或后台进程）。有关更多信息，请参阅 [`testConfig.webServer`](/api/class-testconfig#test-config-web-server)。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      name: 'Frontend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run backend',
      url: 'http://localhost:3333',
      name: 'Backend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    }
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

:::
