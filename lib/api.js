import axios from "axios";
import chalk from "chalk";
import ora from "ora";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export async function generateCommand(description, apiKey) {
  const spinner = ora(chalk.blue("thinking")).start();

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-v4-pro",
        messages: [
          {
            role: "system",
            content: `你是一个Bash命令专家。用户用自然语言描述需求，你只返回可执行的Bash命令。
              重要规则：
            1. 只返回命令本身，不要有任何解释、markdown格式或额外文字
            2. 如果命令有风险（如rm、dd、sudo等），在命令前用 # CAUTION: 说明风险
            3. 如果是批量操作，优先使用安全的命令（如find配合-ok选项）
            4. 不要生成可能造成无限循环或系统崩溃的命令
            5. 只生成最接近的唯一一条指令`,
          },
          {
            role: "user",
            content: description,
          },
        ],
        thinking: { type: "disabled" },
        temperature: 0,
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    spinner.succeed(chalk.green("命令生成成功"));
    let command = response.data.choices[0].message.content.trim();

    command = command.replace(/```bash\n?/g, "").replace(/```\n?/g, "");

    return command;
  } catch (error) {
    spinner.fail(chalk.red("API调用失败"));
    if (error.response) {
      throw new Error(
        `DeepSeek API错误: ${error.response.data.error?.message || error.response.status}`,
      );
    }
    throw error;
  }
}
