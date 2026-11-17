# Organon

[Français](./README.md) · [English](./README.en.md) · [简体中文](./README.zh-CN.md)

Organon 是法语维基百科生物学专题的工具。它使用 GBIF、ITIS、WoRMS、Catalogue of Life、EOL 和 NCBI 等外部分类数据库的数据，为各个分类单元生成维基百科条目草稿。

## 架构

- `organon/core/` — 包含数据模型、模块注册表、维基文本渲染引擎、页面分类规则，以及语法和分类阶元相关数据。该部分独立于用户界面。
- `organon/modules/` — 每个外部数据库对应一个适配器。`adapter.py` 负责发送 HTTP 请求和解析响应，`module.py` 负责实现模块逻辑并接入模块注册表。
- `organon/api/` — 使用 FastAPI 实现的后端，API 路径前缀为 `/api/v1`。执行 `npm run build` 后，后端也会提供构建后的前端静态文件（`web-app/dist/`）。按 Toolforge 的部署要求，API 和用户界面由同一个进程提供服务。
- `web-app/` — 使用 Vite 构建的 React 前端，通过 HTTP 调用上述 API。本地开发说明见[前端 README](./web-app/README.md)。

## API

调用外部服务的路由都需要 OAuth 会话。`/auth/login` 登录流程会设置会话 Cookie，这些路由还会按 IP 地址限制请求频率，详见 [`organon/api/rate_limit.py`](./organon/api/rate_limit.py)。目录、版本信息和身份验证等本地路由无需已有会话即可访问。

| 路由 | 用途 | 需要会话 |
|---|---|---|
| `POST /generate`、`GET /generate?taxon=` | 生成完整的条目草稿 | 是 |
| `POST /generate/stream` | 通过服务器发送事件（SSE）生成条目草稿，每个模块发送一个事件 | 是 |
| `GET /search?q=` | 按学名、俗名或 QID 进行模糊搜索 | 是 |
| `POST /taxobox/refresh` | 通过机器人账号更新生物分类信息框 | 是 |
| `GET /commons-images?taxon=` | 推荐维基共享资源中的图片 | 是 |
| `POST /subtaxa-merge` | 合并来自多个来源的下级分类单元 | 是 |
| `POST /update/diagnose`、`POST /update/export` | 检查 Wikidata 与源数据库之间的差异，并导出 QuickStatements | 是 |
| `GET /modules`、`/domains`、`/sources`、`/version` | 提供目录和版本信息 | 否 |
| `GET /auth/login`、`/auth/callback`、`/auth/me`、`POST /auth/logout` | Wikimedia OAuth 身份验证流程 | 否 |
| `GET /healthz`（位于 API 路径前缀之外） | 健康检查 | 否 |

Organon 没有命令行界面。生成条目草稿需要 OAuth 会话，命令行客户端无法获取该会话，旧版命令行界面也需要手动重复定义 `GenerateOptions` 中的选项。

## 开发

在本地启动后端：

```bash
pip install -e ".[dev]"
ORGANON_DEV=1 uvicorn organon.api.app:app --port 8123
```

`ORGANON_DEV=1` 用于模拟会话，仅限本地开发使用。前端启动说明见[前端 README](./web-app/README.md)。

## 许可证

Organon 采用 GPL-3.0-or-later 许可证，详见 [`LICENSE`](./LICENSE)。

## 报告问题

如果遇到条目草稿生成错误、模块运行失败或维基文本渲染错误，请到[法语维基百科生物学专题的 Organon 讨论页](https://fr.wikipedia.org/wiki/Discussion_Projet:Biologie/Organon)报告。
