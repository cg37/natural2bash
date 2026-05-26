#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import { convertToCommand } from "../lib/index.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 获取当前文件的目录
const __dirname = dirname(fileURLToPath(import.meta.url));
// 读取 package.json
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));

program
  .name("ncb")
  .description("将自然语言转换为Bash命令")
  .version(pkg.version)
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
