import Command from "@bubu/command";
import createTemplate from "./createTemplate.js";
import downloadTemplate from "./downloadTemplate.js";
import installTemplate from "./installTemplate.js";
class InitCommand extends Command {
  get command() {
    return "init [name]";
  }

  get description() {
    return "init project";
  }

  get options() {
    return [
      ["-f,--force", "是否强制更新", false],
      ["--d,--debug", "调试模式", false],
    ];
  }

  async action([name, option]) {
    console.log("template", option);
    // 1.选择项目模板，生成项目
    const selectTemplate = await createTemplate(name, option);
    
    // 2.下载项目到缓存目录
    downloadTemplate(selectTemplate);
    // 3，安装项目模板到项目目录
    installTemplate(selectTemplate, option)
  }
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;
