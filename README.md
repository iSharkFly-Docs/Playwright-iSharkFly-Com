# iSharkFly - Playwright 中欢迎来到鲨鱼君的文档和手册的空间

Playwright 端到端测试框架的简体中文翻译文档。

- 在线地址：[https://playwright.isharkfly.com/](https://playwright.isharkfly.com/)
- 源码仓库：[https://src.sharkdat.com/iSharkFly-Docs/playwright-isharkfly-com](https://src.sharkdat.com/iSharkFly-Docs/playwright-isharkfly-com)

[联系我们](CONTACT.md ':include')

## 项目结构

```
src/           # 英文原文（由 pnpm run generate 生成）
i18n/zh/       # 简体中文翻译
site/          # VitePress srcDir（构建时自动生成，已被 git 忽略）
scripts/       # 构建脚本
.vitepress/    # VitePress 配置
```

## 中英双语

站点默认语言为简体中文（根路径 `/`），英文版在 `/en/` 下。导航栏的语言菜单可以切换阅读语言和编程语言（Node.js / Python / Java / .NET）。

- 中文翻译放在 `i18n/zh/` 下，路径与 `src/` 中的英文页面一一对应
- 没有翻译的页面会显示英文原文，并在页面顶部提示"本页尚未翻译"

## 本地开发

### 环境要求

- Node.js 22+（见 `.node-version`）
- pnpm 12.4.1+

### 安装依赖

```bash
pnpm install
```

### 生成英文原文

首次运行或更新 Playwright 官方文档时需要执行：

```bash
pnpm run generate
```

### 启动开发服务器

```bash
pnpm run docs:dev
```

访问 http://localhost:5173/ 查看文档。

### 构建生产版本

```bash
pnpm run docs:build
```

构建输出在 `.vitepress/dist/` 目录。构建需要较多内存，已将 Node 堆内存设置为 8 GB。

### 预览构建结果

```bash
pnpm run docs:preview
```

## 部署

项目使用 Cloudflare Workers Static Assets 托管，配置见 `wrangler.jsonc`。

```bash
# 部署到 production 环境
npx wrangler deploy --env production
```

## 参与翻译

1. 在 `i18n/zh/` 下创建对应英文页面路径的文件
2. 翻译内容，保留链接的英文写法（如 `/intro.md`）
3. 运行 `pnpm run docs:dev` 预览效果
4. 提交 PR

## 相关链接

| 名称 | 地址 |
|------|------|
| Playwright 官方文档 | https://playwright.dev/ |
| Playwright GitHub | https://github.com/microsoft/playwright |
| iSharkFly 文档站 | https://docs.isharkfly.com/ |

[联系我们](CONTACT.md ':include')

## 许可证

本项目基于 [Apache License 2.0](LICENSE) 许可证开源。
