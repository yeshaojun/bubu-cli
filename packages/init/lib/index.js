import Command from "@bubu-cli/command";
import createTemplate from "./createTemplate.js";
import downloadTemplate from "./downloadTemplate.js";
import installTemplate from "./installTemplate.js";
import initGit from "./initGIt.js";
import installLib from "./installLib.js";
import cloneNode from "./clone.js";
import { makeConfirm } from "@bubu-cli/utils";
import { ADD_TYPE_PROJECT, ADD_TYPE_NODE } from "./config.js";
class InitCommand extends Command {
  get command() {
    return "init [name]";
  }

  get description() {
    return "init project";
  }

  get options() {
    return [
      ["--f,--force", "是否强制更新", false],
      ["--d,--debug", "调试模式", false],
    ];
  }

  async action([name, option]) {
    console.log("template", option);
    // 1.选择项目模板，生成项目
    const selectTemplate = await createTemplate(name, option);
    // 2. 自定义选择需要安装的依赖
    const result = await installLib(selectTemplate);
    if (selectTemplate?.type === ADD_TYPE_NODE) {
      await cloneNode(result, selectTemplate.name, option);
    } else if (selectTemplate?.type === ADD_TYPE_PROJECT) {
      // web
      // 3.下载项目到缓存目录
      await downloadTemplate(selectTemplate);
      // 4，安装项目模板到项目目录
      await installTemplate(selectTemplate, option, result);
    }
    // 5. git init .gitignore文件创建
    initGit(selectTemplate);
  }
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;
