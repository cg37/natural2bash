# natural2bash

A CLI tool that converts natural language to Bash commands, powered by DeepSeek AI.

[中文](README.md)

# Configuration

You need a DeepSeek API key before first use:

```bash
ncb config set sk-your-api-key-here
```

You can also set it via environment variable:

```bash
export DEEPSEEK_API_KEY="sk-your-api-key-here"
```

Check current configuration:

```bash
ncb config get
ncb config path
```

# Installation

```bash
npm i -g natural2bash
```

or

```bash
pnpm add -g natural2bash
```

For local development:

```bash
git clone https://github.com/cg37/natural2bash.git
cd natural2bash
npm link
```

# Usage

```bash
ncb list all files
ncb create README.md and open it with code
ncb -d find all log files larger than 100MB
```

# Options

- `-y`, `--yes` — auto-confirm execution
- `-d`, `--dry-run` — show the command only, don't execute
- `-s`, `--safe` — safe mode (sandbox simulation, in development)
- `-h`, `--help` — display help
- `-V`, `--version` — display version number

# Interactive Flow

When you run `ncb`, it:

1. Calls DeepSeek AI to analyze your natural language description
2. Generates the corresponding Bash command
3. Shows the command and asks for confirmation (`y` / `e` / other)
4. Executes the command and shows output if confirmed

Type `e` to edit the command in your editor before execution.

# License

MIT
