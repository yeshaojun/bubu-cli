import Command from "@bubu-cli/command";
import preCheck from "./preCheck.js";
import commitChoose from "./commitChoose.js";
class InitCommand extends Command {
  get command() {
    return "commit";
  }

  get description() {
    return "commit";
  }

  get options() {
    return [
      ["--f,--force", "是否强制更新", false],
      ["--d,--debug", "调试模式", false],
    ];
  }

  async action([name, option]) {
    const needCommit = await preCheck();
    if (needCommit) {
      console.log("使用工具前，请先确保有操作文件的权限，否则脚本可能会无效");
      await commitChoose();
    }
  }
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;
