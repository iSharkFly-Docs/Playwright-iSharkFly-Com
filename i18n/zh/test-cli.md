---
title: "命令行"
---

# 命令行

Playwright 提供了强大的命令行接口，用于运行测试、生成代码、调试等功能。你可以随时通过 `npx playwright --help` 获取 CLI 上最新的命令和参数列表。

## 基本命令

### 运行测试

运行 Playwright 测试。[了解更多关于运行测试的内容](./running-tests.md)。

#### 语法

```bash
npx playwright test [options] [test-filter...]
```

#### 示例

```bash
# 运行所有测试
npx playwright test

# 运行单个测试文件
npx playwright test tests/todo-page.spec.ts

# 运行一组测试文件
npx playwright test tests/todo-page/ tests/landing-page/

# 运行特定行的测试
npx playwright test my-spec.ts:42

# 按标题运行测试
npx playwright test -g "add a todo item"

# 在有界面的浏览器中运行测试
npx playwright test --headed

# 为特定项目运行测试
npx playwright test --project=chromium

# 获取帮助
npx playwright test --help
```

**禁用[并行化](./test-parallel.md)**

```bash
npx playwright test --workers=1
```

**使用 [Playwright Inspector](./debug.md) 在调试模式下运行**

```bash
npx playwright test --debug
```

**在交互式 [UI 模式](./test-ui-mode.md)下运行测试**

```bash
npx playwright test --ui
```

#### 常用选项

| 选项 | 描述 |
| :--- | :--- |
| `--debug [mode]` | 使用 Playwright Inspector 运行测试。是 `PWDEBUG=1` 环境变量和 `--timeout=0 --max-failures=1 --headed --workers=1` 选项的快捷方式。可选的模式是 "inspector"（默认）或 "cli" —— "cli" 允许通过命令行附加和调试。 |
| `--headed` | 在有界面的浏览器中运行测试（默认：无界面）。 |
| `-g <grep>` 或 `--grep <grep>` | 仅运行匹配此正则表达式的测试（默认：".*"）。 |
| `--project <project-name...>` | 仅运行指定项目列表中的测试，支持 '*' 通配符（默认：运行所有项目）。 |
| `--ui` | 在交互式 UI 模式下运行测试。 |
| `-j <workers>` 或 `--workers <workers>` | 并发工作进程数量或逻辑 CPU 核心的百分比，使用 1 表示单工作进程运行（默认：50%）。 |

#### 所有选项

| 选项 | 描述 |
| :--- | :--- |
| 非选项参数 | 每个参数被视为与完整测试文件路径匹配的正则表达式。只有来自匹配模式的文件的测试才会被执行。特殊符号如 `$` 或 `*` 应该用 `\` 转义。在许多 shell/终端中，你可能需要对参数加引号。 |
| `--add-reporter <reporter>` | 在配置文件中已配置的报告器之上添加报告器，逗号分隔。可以是内置报告器名称或自定义报告器文件的路径。与 `--reporter` 不同，这会保留已配置的报告器而不是替换它们。 |
| `-c <file>` 或 `--config <file>` | 配置文件，或带有可选 "playwright.config.&#123;m,c&#125;?&#123;js,ts&#125;" 的测试目录。默认为当前目录中的 `playwright.config.ts` 或 `playwright.config.js`。 |
| `--debug [mode]` | 使用 Playwright Inspector 运行测试。是 `PWDEBUG=1` 环境变量和 `--timeout=0 --max-failures=1 --headed --workers=1` 选项的快捷方式。可选的模式是 "inspector"（默认）或 "cli" —— "cli" 允许通过命令行附加和调试。 |
| `--fail-on-flaky-tests` | 如果任何测试被标记为不稳定则失败（默认：false）。 |
| `--forbid-only` | 如果调用了 `test.only` 则失败（默认：false）。在 CI 中很有用。 |
| `--fully-parallel` | 并行运行所有测试（默认：false）。 |
| `--global-timeout <timeout>` | 此测试套件可以运行的最长时间（毫秒）（默认：无限制）。 |
| `-g <grep>` 或 `--grep <grep>` | 仅运行匹配此正则表达式的测试（默认：".*"）。 |
| `-G <grep>` 或 `--grep-invert <grep>` | 仅运行不匹配此正则表达式的测试。 |
| `--headed` | 在有界面的浏览器中运行测试（默认：无界面）。 |
| `--ignore-snapshots` | 忽略截图和快照预期。 |
| `-j <workers>` 或 `--workers <workers>` | 并发工作进程数量或逻辑 CPU 核心的百分比，使用 1 表示单工作进程运行（默认：50%）。 |
| `--last-failed` | 仅重新运行失败的测试。 |
| `--last-failed-file <file>` | 覆盖 `--last-failed` 的默认上次运行 JSON 路径（默认：`<outputDir>/.last-run.json`）。与 `PLAYWRIGHT_LAST_RUN_OUTPUT_FILE` 环境变量相同。 |
| `--list` | 收集所有测试并报告它们，但不运行。 |
| `--max-failures <N>` 或 `-x` | 在前 `N` 次失败后停止。传递 `-x` 表示在第一次失败后停止。 |
| `--no-deps` | 不运行项目依赖。 |
| `--output <dir>` | 输出产物的文件夹（默认："test-results"）。 |
| `--only-changed [ref]` | 仅运行在 'HEAD' 和 'ref' 之间已更改的测试文件。默认运行所有未提交的更改。仅支持 Git。 |
| `--pass-with-no-tests` | 即使没有找到测试也使测试运行成功。 |
| `--project <project-name...>` | 仅运行指定项目列表中的测试，支持 '*' 通配符（默认：运行所有项目）。 |
| `--quiet` | 抑制标准输出。 |
| `--repeat-each <N>` | 每个测试运行 `N` 次（默认：1）。 |
| `--reporter <reporter>` | 要使用的报告器，逗号分隔，可以是 "dot"、"line"、"list"、"failures" 或其他（默认：本地 "list"，CI 上 "dot"）。你也可以传递自定义报告器文件的路径。 |
| `--retries <retries>` | 不稳定测试的最大重试次数，零表示不重试（默认：不重试）。 |
| `--run-agents <mode>` | 运行代理来为 `page.perform` 生成代码。可能的值是 "missing"、"all" 和 "none"（默认："none"）。参见 [test-agents](./test-agents.md)。 |
| `--shard <shard>` | 分片测试并仅执行选定的分片，以 "current/all" 形式指定，从 1 开始，例如 "3/5"。 |
| `--shuffle [seed]` | 以随机顺序调度测试：测试文件被打乱，[并行模式](./test-parallel.md)下的单个测试也是如此。必须一起运行的测试（例如在串行套件中）保持其顺序。种子在运行开始时打印，传递它以重现相同的顺序。 |
| `--test-list <file>` | 包含要运行的测试列表的文件路径。详见[测试列表](#测试列表)。 |
| `--test-list-invert <file>` | 包含要跳过的测试列表的文件路径。详见[测试列表](#测试列表)。 |
| `--timeout <timeout>` | 以毫秒为单位指定测试超时阈值，零表示无限制（默认：30 秒）。 |
| `--trace <mode>` | 强制跟踪模式，可以是 `on`、`off`、`on-first-retry`、`on-all-retries`、`retain-on-failure`、`retain-on-first-failure`、`retain-on-failure-and-retries`。 |
| `--tsconfig <path>` | 适用于所有导入文件的单个 tsconfig 路径（默认：为每个导入文件单独查找 tsconfig）。 |
| `--ui` | 在交互式 UI 模式下运行测试。 |
| `--ui-host <host>` | 提供 UI 服务的主机；指定此选项会在浏览器标签页中打开 UI。 |
| `--ui-port <port>` | 提供 UI 服务的端口，0 表示任何空闲端口；指定此选项会在浏览器标签页中打开 UI。 |
| `-u` 或 `--update-snapshots [mode]` | 用实际结果更新快照。可能的值是 "all"、"changed"、"missing"、"none" 和 "default"。不带标志运行测试默认为 "default"；带标志但不带值运行测试默认为 "changed"。 |
| `--update-source-method <method>` | 选择更新源代码的方式。可能的值是 "patch"（默认）、"3way" 和 "overwrite"。"Patch" 创建一个统一差异文件，可用于稍后更新源代码。"3way" 在源代码中生成合并冲突标记。"Overwrite" 用新的快照值覆盖源代码。 |
| `-x` | 在第一次失败后停止。 |

#### 测试列表

选项 `--test-list` 和 `--test-list-invert` 接受测试列表文件的路径。此文件应以类似于 `--list` 模式输出的格式列出测试。

```txt
# 这是一个测试列表文件。
# 它可以包含注释和空行。

# 运行文件中的所有测试：
path/to/example.spec.ts

# 为特定项目运行文件中的所有测试：
[chromium] › path/to/example.spec.ts

# 运行特定组/套件中的所有测试：
path/to/example.spec.ts › suite name

# 运行嵌套组中的所有测试：
path/to/example.spec.ts › outer suite › inner suite

# 带项目的完全限定测试：
[chromium] › path/to/example.spec.ts:3:9 › suite › nested suite › example test

# 此测试包含在所有项目中：
path/to/example.spec.ts:3:9 › example test

# 使用 "›" 或 ">" 作为分隔符：
[firefox] > example.spec.ts > suite > nested suite > example test

# 行/列号完全被忽略，你可以省略它们。
# 下面三个条目指的是同一个测试：
example.spec.ts › example test
example.spec.ts:15 › example test
example.spec.ts:42:42 › example test
```

### 显示报告

显示上次测试运行的 HTML 报告。[了解更多关于 HTML 报告器的内容](./test-reporters#html-reporter)。

#### 语法

```bash
npx playwright show-report [report] [options]
```

#### 示例

```bash
# 显示最新的测试报告
npx playwright show-report

# 显示特定报告
npx playwright show-report playwright-report/

# 在自定义端口显示报告
npx playwright show-report --port 8080
```

#### 选项

| 选项 | 描述 |
| :--- | :--- |
| `--host <host>` | 提供报告服务的主机（默认：localhost） |
| `--port <port>` | 提供报告服务的端口（默认：9323） |

### 安装浏览器

安装 Playwright 所需的浏览器。[了解更多关于 Playwright 浏览器支持的内容](./browsers.md)。

#### 语法

```bash
npx playwright install [options] [browser...]
npx playwright install-deps [options] [browser...]
npx playwright uninstall
```

#### 示例

```bash
# 安装所有浏览器
npx playwright install

# 仅安装 Chromium
npx playwright install chromium

# 安装特定浏览器
npx playwright install chromium webkit

# 安装浏览器及其依赖
npx playwright install --with-deps
```

#### 安装选项

| 选项 | 描述 |
| :--- | :--- |
| `--force` | 强制重新安装已安装的浏览器 |
| `--with-deps` | 安装浏览器系统依赖 |
| `--dry-run` | 不执行安装，仅打印信息 |
| `--list` | 打印所有 Playwright 安装的浏览器列表 |
| `--only-shell` | 仅安装 chromium-headless-shell 而不是完整的 Chromium |
| `--no-shell` | 不安装 chromium-headless-shell |
| `--no-progress` | 不显示下载进度条 |
| `--no-remove` | 不移除未使用的浏览器 |

#### 安装依赖选项

| 选项 | 描述 |
| :--- | :--- |
| `--dry-run` | 不修改系统。在 Linux 上，通过 apt-get 模拟安装，如果缺少任何必需的包则以非零代码退出——这对非交互式验证脚本很有用。在 Windows 上，打印安装命令。 |

## 生成和调试工具

### 代码生成

录制操作并为多种语言生成测试。[了解更多关于 Codegen 的内容](./codegen-intro.md)。

#### 语法

```bash
npx playwright codegen [options] [url]
```

#### 示例

```bash
# 使用交互式 UI 开始录制
npx playwright codegen

# 在特定网站上录制
npx playwright codegen https://playwright.dev

# 生成 Python 代码
npx playwright codegen --target=python
```

#### 选项

| 选项 | 描述 |
| :--- | :--- |
| `-b, --browser <name>` | 要使用的浏览器：chromium、firefox 或 webkit（默认：chromium） |
| `-o, --output <file>` | 生成脚本的输出文件 |
| `--target <language>` | 要使用的语言：javascript、playwright-test、python 等。 |
| `--test-id-attribute <attr>` | 用于测试 ID 的属性 |

### 跟踪查看器

分析和查看测试跟踪以进行调试。[了解更多关于跟踪查看器的内容](./trace-viewer.md)。

#### 语法

```bash
npx playwright show-trace [options] [trace]
```

#### 示例

```bash
# 打开跟踪查看器而不指定特定跟踪（可以通过 UI 加载跟踪）
npx playwright show-trace

# 查看跟踪文件
npx playwright show-trace trace.zip

# 从目录查看跟踪
npx playwright show-trace trace/
```

#### 选项

| 选项 | 描述 |
| :--- | :--- |
| `-b, --browser <name>` | 要使用的浏览器：chromium、firefox 或 webkit（默认：chromium） |
| `-h, --host <host>` | 提供跟踪服务的主机 |
| `-p, --port <port>` | 提供跟踪服务的端口 |

当你传递 `--port` 时，你机器上的其他用户可以在该端口上打开跟踪。当你传递 `--host` 时，任何能够访问此地址和端口的人都可以打开跟踪，例如使用 `--host=0.0.0.0` 的网络中的其他机器。

## 专用命令

### 合并报告

读取 [blob](./test-reporters#blob-reporter) 报告并合并它们。[了解更多关于 merge-reports 的内容](./test-sharding.md)。

#### 语法

```bash
npx playwright merge-reports [options] <blob dir>
```

#### 示例

```bash
# 合并测试报告
npx playwright merge-reports ./reports
```

#### 选项

| 选项 | 描述 |
| :--- | :--- |
| `-c, --config <file>` | 配置文件。可用于为输出报告指定额外配置 |
| `--reporter <reporter>` | 要使用的报告器，逗号分隔，可以是 "list"、"line"、"dot"、"failures"、"json"、"junit"、"null"、"github"、"html"、"blob"、"perfetto"（默认：本地 "list"，CI 上 "dot"） |

### 清除缓存

清除所有 Playwright 缓存。

#### 语法

```bash
npx playwright clear-cache
```

Playwright 将转译后的测试文件保存在系统临时目录中。要将它们保存在其他目录中，例如在与其他用户共享的 Linux 机器上，设置 `PLAYWRIGHT_TRANSFORM_CACHE_DIR` 环境变量：

```bash
PLAYWRIGHT_TRANSFORM_CACHE_DIR=~/.cache/playwright-transform npx playwright test
```
