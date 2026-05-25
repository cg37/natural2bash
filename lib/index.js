import readline from 'readline';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import { generateCommand } from './api.js';
import ora from 'ora';

const execAsync = promisify(exec);

function getApiKey() {
  // 支持多种环境变量名称
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.DS_API_KEY;
  if (!apiKey) {
    throw new Error('请设置环境变量 DEEPSEEK_API_KEY\n  export DEEPSEEK_API_KEY="你的API密钥"');
  }
  return apiKey;
}

function askConfirmation(command) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    console.log(chalk.cyan('\n📝 将执行以下命令:'));
    console.log(chalk.yellow('----------------------------------------'));
    console.log(chalk.white(command));
    console.log(chalk.yellow('----------------------------------------'));
    
    rl.question(chalk.cyan('是否执行？[y/N/edit]: '), (answer) => {
      rl.close();
      
      if (answer.toLowerCase() === 'y') {
        resolve('execute');
      } else if (answer.toLowerCase() === 'e') {
        resolve('edit');
      } else {
        resolve('cancel');
      }
    });
  });
}

function editCommand(command) {
  return new Promise((resolve) => {
    const editor = process.env.EDITOR || 'vi';
    const tempFile = '/tmp/cc_command_temp';
    const fs = require('fs');
    
    fs.writeFileSync(tempFile, command);
    
    const { spawn } = require('child_process');
    const child = spawn(editor, [tempFile], { stdio: 'inherit' });
    
    child.on('exit', () => {
      const editedCommand = fs.readFileSync(tempFile, 'utf8').trim();
      fs.unlinkSync(tempFile);
      resolve(editedCommand);
    });
  });
}

async function executeCommand(command, options) {
  if (options.dryRun) {
    console.log(chalk.cyan('\n🔍 Dry-run模式，未实际执行'));
    return;
  }
  
  if (options.safe) {
    console.log(chalk.yellow('\n⚠️ 安全模式: 将在Docker沙箱中模拟执行'));
    // 这里可以添加Docker沙箱逻辑
    console.log(chalk.gray('安全模式开发中...'));
    return;
  }
  
  const spinner = ora(chalk.blue('🚀 执行中...')).start();
  
  try {
    const { stdout, stderr } = await execAsync(command);
    spinner.succeed(chalk.green('✅ 执行完成'));
    
    if (stdout) {
      console.log(chalk.gray('\n输出:'));
      console.log(stdout);
    }
    if (stderr) {
      console.log(chalk.yellow('\n警告:'));
      console.log(stderr);
    }
  } catch (error) {
    spinner.fail(chalk.red('执行失败'));
    console.error(chalk.red(error.message));
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
  }
}

export async function convertToCommand(description, options) {
  console.log(chalk.bold.cyan('\n🎯 CC - 自然语言转Bash命令\n'));
  
  const apiKey = getApiKey();
  let command = await generateCommand(description, apiKey);
  
  if (options.yes) {
    await executeCommand(command, options);
    return;
  }
  
  const action = await askConfirmation(command);
  
  if (action === 'execute') {
    await executeCommand(command, options);
  } else if (action === 'edit') {
    const editedCommand = await editCommand(command);
    console.log(chalk.cyan('\n修改后的命令:'));
    console.log(chalk.white(editedCommand));
    const confirmEdit = await askConfirmation(editedCommand);
    if (confirmEdit === 'execute') {
      await executeCommand(editedCommand, options);
    } else {
      console.log(chalk.gray('❌ 已取消'));
    }
  } else {
    console.log(chalk.gray('❌ 已取消'));
  }
}