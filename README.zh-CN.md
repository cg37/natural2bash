# natural2bash

将自然语言转换为 Bash 命令的 CLI 工具，基于 DeepSeek AI。

[English](README.md)

# 配置

首次使用需要设置 DeepSeek API Key：

```bash
ncb config set sk-你的API密钥
```

也可以使用环境变量：

```bash
export DEEPSEEK_API_KEY="sk-你的API密钥"
```

查看当前配置：

```bash
ncb config get
ncb config path
```

# 安装

```bash
npm i -g natural2bash
```

或

```bash
pnpm add -g natural2bash
```

本地开发：

```bash
git clone https://github.com/cg37/natural2bash.git
cd natural2bash
npm link
```

# 使用

```bash
ncb 列出所有文件
ncb 创建README.md并用code打开
ncb -d 找出所有大于100MB的日志文件
```

# 选项

- `-y`, `--yes` — 自动确认执行，不询问
- `-d`, `--dry-run` — 只显示生成的命令，不执行
- `-s`, `--safe` — 安全模式（沙箱模拟执行，开发中）
- `-h`, `--help` — 显示帮助
- `-V`, `--version` — 显示版本号

# 交互流程

运行 `ncb` 后，工具会：

1. 调用 DeepSeek AI 分析你的自然语言描述
2. 生成对应的 Bash 命令
3. 显示命令并询问是否执行（`y` / `e` / 其他）
4. 确认后自动执行并显示输出

选择 `e` 可以用编辑器修改命令后再执行。

# 许可证

MIT
