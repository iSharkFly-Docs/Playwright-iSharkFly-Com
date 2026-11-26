# iSharkFly - Playwright 中欢迎来到鲨鱼君的文档和手册的空间

Playwright 端到端测试框架的简体中文翻译文档。

- 在线地址：[https://playwright.isharkfly.com/](https://playwright.isharkfly.com/)
- 源码仓库：[https://src.sharkdat.com/iSharkFly-Docs/playwright-isharkfly-com](https://src.sharkdat.com/iSharkFly-Docs/playwright-isharkfly-com)

[联系我们](CONTACT.md)

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

<!-- LINKS:START -->
<!-- 本段由 scripts/sync-links.mjs 根据 LINKS.md 自动生成，请勿手动修改 -->

### iSharkFly 文档和手册快速导航

在下面的表格中，我们列出了一些比较有用相关软件开发使用教程的导航，在我们文档的整理中，也参考了一些这些文档。

在这里对原作者表示感谢。

| 网站名称               | URL                                                            | NOTE                      | GitHub                                                                                                                   | 
|--------------------|----------------------------------------------------------------|---------------------------|--------------------------------------------------------------------------------------------------------------------------|
| DOCS.ISHARKFLY.COM | [https://docs.isharkfly.com/#/](https://docs.isharkfly.com/#/) | 本手册的编译版本将会部署在这个链接上        | [https://src.sharkdat.com/iSharkFly-Docs/docs-isharkfly-com](https://src.sharkdat.com/iSharkFly-Docs/docs-isharkfly-com) |
| WWW.CWIKIUS.CN     | [http://www.cwikius.cn/](http://www.cwikius.cn/)               | CWIKIUS.CN 一个有独立思考和温度的清新站 | N/A                                                                                                                      |

#### 前端和 UI

| 网站名称            | URL                                                | NOTE                        |
|-----------------|----------------------------------------------------|-----------------------------|
| iSharkFly - 飞鲨  | https://www.isharkfly.com/c/software-development/5 | 计算机相关的前端框架和讨论               |
| TypeScript 文档手册 | https://typescript.ossez.com/                      | TypeScript 相关技术文档和手册        |
| Angular 技术手册    | https://angular.isharkfly.com/                         | Angular 手册的在线翻译版本，从源代码中进行编译 |
| TypeScript 文档手册 | https://typescript.ossez.com/                      | TypeScript 相关技术文档和手册        |
| Docsify 中文文档手册  | https://docsify.isharkfly.com/                     | Docsify 可以快速帮你生成文档网站        |

#### 后端和数据

| 网站名称                   | URL                               | NOTE                 |
|------------------------|-----------------------------------|----------------------|
| Apache Druid   | https://druid.isharkfly.com/      | Druid 手册的在线翻译版本      |
| Amazon OpenSearch | https://opensearch.isharkfly.com/ | OpenSearch 手册的在线翻译版本 |
| HAPI FHIR              | https://fhir.isharkfly.com/#/     | FHIR 相关技术文档的收集和讨论    |

#### 容器 docker

| 网站名称               | URL                            | NOTE                                                        |
|--------------------|--------------------------------|-------------------------------------------------------------|
| Docker 手册中译在线版     | https://docker.ossez.com/      | 基于 Docker 容器英文手册的翻译版本                                       |
| Docker 手册中译 MD 在线版 | https://docker-docs.ossez.com/ | 因为 Docker 的官方手册进行了渲染，我们推荐你使用上面的链接，这个版本为 docsify 渲染版本，可能会丢格式 |

<!-- LINKS:END -->

## 许可证

本项目基于 [Apache License 2.0](LICENSE) 许可证开源。
