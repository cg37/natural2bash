#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import { convertToCommand } from "../lib/index.js";
import {
    getApiKeyFromConfig,
    setApiKey,
    getConfigPath,
} from "../lib/config.js";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 获取当前文件的目录
const __dirname = dirname(fileURLToPath(import.meta.url));
// 读取 package.json
const pkg = JSON.parse(
    readFileSync(join(__dirname, "../package.json"), "utf8"),
);

program
    .name("ncb")
    .description("将自然语言转换为Bash命令")
    .version(pkg.version, '-v, --version');

// config 子命令: 管理 API Key
const configCmd = program.command("config").description("管理配置");

configCmd
    .command("set <key>")
    .description("设置 API Key")
    .action((key) => {
        setApiKey(key);
        console.log(
            chalk.green("✅ API Key 已保存到:"),
            chalk.cyan(getConfigPath()),
        );
    });

configCmd
    .command("get")
    .description("查看当前 API Key")
    .action(() => {
        const key = getApiKeyFromConfig();
        if (key) {
            console.log(chalk.green("当前 API Key:"), chalk.cyan(key));
        } else {
            console.log(chalk.yellow("⚠️  未设置 API Key"));
        }
        console.log(chalk.gray("配置文件路径:"), getConfigPath());
    });

configCmd
    .command("path")
    .description("显示配置文件路径")
    .action(() => {
        console.log(getConfigPath());
    });

// 默认命令: 自然语言转 Bash
program
    .argument("<description>", "自然语言描述你想要的操作")
    .option("-y, --yes", "自动确认执行，不询问")
    .option("-d, --dry-run", "只显示生成的命令，不执行")
    .option("-s, --safe", "安全模式（在沙箱中模拟执行）")
    .action(async (description, options) => {
        try {
            await convertToCommand(description, options);
        } catch (error) {
            console.error(chalk.red("❌ 错误:"), error.message);
            process.exit(1);
        }
    });

program.parse();
