import Command from "@bubu/command";
import createTemplate from "./createTemplate.js";
class InitCommand extends Command {
  get command() {
    return "init [name]";
  }

  get description() {
    return "init project";
  }

  get options() {
    return [
      ["-f", "--force", "是否强制更新", false],
      ["--d", "--debug", "调试模式", false],
    ];
  }

  action([name, option]) {
    // 1.选择项目模板，生成项目
    createTemplate(name, option);
    // 2.下载项目到缓存目录
    // 3，安装项目模板到项目目录
  }
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;
