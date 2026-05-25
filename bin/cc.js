#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import { convertToCommand } from '../lib/index.js';

program
  .name('cc')
  .description('将自然语言转换为Bash命令')
  .version('1.0.0')
  .argument('<description>', '自然语言描述你想要的操作')
  .option('-y, --yes', '自动确认执行，不询问')
  .option('-d, --dry-run', '只显示生成的命令，不执行')
  .option('-s, --safe', '安全模式（在沙箱中模拟执行）')
  .action(async (description, options) => {
    try {
      await convertToCommand(description, options);
    } catch (error) {
      console.error(chalk.red('❌ 错误:'), error.message);
      process.exit(1);
    }
  });

program.parse();