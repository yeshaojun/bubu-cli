import { resolve } from "path";
import { log, makeList, makeInput, getLatestVersion } from "@bubu-cli/utils";
import { homedir } from "node:os";
import {
  ADD_TYPE_PROJECT,
  ADD_TYPE_NODE,
  ADD_TEMPLATE,
  ADD_TYPE,
  TEMP_HOME,
} from "./config.js";
// 获取创建类型
function getAddType() {
  return makeList({
    choices: ADD_TYPE,
    message: "请选择初始化类型",
    defaultValue: ADD_TYPE_PROJECT,
  });
}

function getAddName() {
  return makeInput({
    message: "请输入项目名称",
    validate(name) {
      if (name.length) {
        return true;
      } else {
        return "项目名称必须输入:";
      }
    },
  });
}

function getAddTemplate() {
  return makeList({
    choices: ADD_TEMPLATE,
    message: "请选择初始化类型",
  });
}

function makeTargetPath() {
  // console.log("homedir", homedir());
  return resolve(`${homedir()}/${TEMP_HOME}`, "addTemplate");
}

export default async function createTemplate(name, opts) {
  const addType = await getAddType();
  if (addType === ADD_TYPE_PROJECT) {
    const addName = await getAddName();
    const addTemplate = await getAddTemplate();
    const selectTemplate = ADD_TEMPLATE.find((_) => _.value === addTemplate);
    // // 获取最新版本号
    const latestVersion = await getLatestVersion(selectTemplate.npmName);
    selectTemplate.version = latestVersion;
    const targetPath = makeTargetPath();
    return {
      type: addType,
      name: addName,
      template: selectTemplate,
      targetPath,
    };
  } else if (addType === ADD_TYPE_NODE) {
    const addName = await getAddName();
    return {
      type: addType,
      name: addName,
    };
  }
}
