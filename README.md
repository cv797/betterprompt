# BetterPrompt

AI 提示词优化引擎 - 让你的 Prompt 更专业、更高效。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzhalice2011%2Fbetter-prompt&env=LLM_BACKEND_URL,LLM_API_KEY,FREE_MODELS,DEFAULT_MODEL&envDescription=LLM%20API%20配置&envLink=https%3A%2F%2Fgithub.com%2Fzhalice2011%2Fbetter-prompt%23配置&project-name=better-prompt&repository-name=better-prompt)

![BetterPrompt Screenshot](docs/screenshot.png)

## 功能特性

- **智能优化**：基于 LLM 分析并优化你的提示词，提供评分、诊断和改进建议
- **双语输出**：同时生成中英文优化版本
- **多种模板**：内置通用优化、文生图、图生图等专业模板
- **流式响应**：实时显示优化过程，体验流畅
- **历史记录**：自动保存优化历史，随时回顾
- **自定义配置**：支持自定义 API 端点和模型

## 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/zhalice2011/better-prompt.git
cd better-prompt

# 安装依赖
npm install
```

### 配置

复制环境变量示例文件并填写配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```bash
# LLM API 端点（可选）
LLM_BACKEND_URL=https://your-llm-api.com/v1

# LLM API Key（可选）
LLM_API_KEY=your-api-key

# 免费模型列表（逗号分隔）
FREE_MODELS=deepseek

# 默认模型
DEFAULT_MODEL=deepseek
```

### 运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

访问 http://localhost:3000

## 部署到 Vercel

### 一键部署

点击下方按钮，即可将项目部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzhalice2011%2Fbetter-prompt&env=LLM_BACKEND_URL,LLM_API_KEY,FREE_MODELS,DEFAULT_MODEL&envDescription=LLM%20API%20配置&envLink=https%3A%2F%2Fgithub.com%2Fzhalice2011%2Fbetter-prompt%23配置&project-name=better-prompt&repository-name=better-prompt)

部署时会提示你配置以下环境变量：

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `LLM_BACKEND_URL` | 否 | LLM API 端点，如 `https://api.openai.com/v1` |
| `LLM_API_KEY` | 否 | LLM API Key |
| `FREE_MODELS` | 否 | 免费模型列表，逗号分隔 |
| `DEFAULT_MODEL` | 否 | 默认使用的模型 |

### 手动部署

1. **Fork 本仓库**到你的 GitHub 账号

2. **登录 Vercel**：访问 [vercel.com](https://vercel.com) 并使用 GitHub 登录

3. **导入项目**：
   - 点击 "Add New Project"
   - 选择你 Fork 的仓库
   - Vercel 会自动检测到这是 Next.js 项目

4. **配置环境变量**：
   - 在 "Environment Variables" 部分添加上述环境变量
   - 也可以部署后在项目设置中添加

5. **部署**：点击 "Deploy"，等待构建完成

6. **完成**：部署成功后会获得一个 `.vercel.app` 域名，也可以绑定自定义域名

### 更新部署

推送代码到 GitHub 后，Vercel 会自动触发重新部署。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: Ant Design 6 + Tailwind CSS 4
- **语言**: TypeScript 5
- **API**: OpenAI SDK (兼容各种 LLM 提供商)

## 项目结构

```
better-prompt-next/
├── app/                    # Next.js App Router
│   ├── api/v1/            # API 路由
│   ├── page.tsx           # 主页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
├── hooks/                 # 状态管理 Hooks
├── services/              # API 服务层
└── types/                 # TypeScript 类型定义
```

## 使用说明

1. **输入提示词**：在左侧面板粘贴你想优化的提示词
2. **选择模板**：根据场景选择合适的优化模板
3. **执行优化**：点击"执行优化"按钮或按 Enter
4. **查看结果**：右侧面板显示评分、诊断和优化后的提示词
5. **复制使用**：切换中英文版本，一键复制

## 安全说明

- 如果你配置了自定义 API Key，它会存储在浏览器的 localStorage 中
- 建议在私人设备上使用，或使用后清除浏览器数据
- 不要在公共设备上保存敏感的 API Key

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT License](LICENSE)
