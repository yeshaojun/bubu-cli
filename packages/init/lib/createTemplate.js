import { resolve } from "path";
import { log, makeList, makeInput, getLatestVersion } from "@bubu/utils";
import { homedir } from "node:os";
const ADD_TYPE_PROJECT = "project";
const ADD_TYPE_PAGE = "page";

const ADD_TEMPLATE = [
  {
    name: "vue3项目模板",
    npmName: "@imooc.com/template-vue3",
    value: "template-vue3",
    version: "1.0.1",
  },
  {
    name: "react18项目模板",
    npmName: "@imooc.com/template-react18",
    value: "template-react18",
    version: "1.0.0",
  },
];

const ADD_TYPE = [
  {
    name: "项目",
    value: ADD_TYPE_PROJECT,
  },
  {
    name: "页面",
    value: ADD_TYPE_PAGE,
  },
];

const TEMP_HOME = ".cli-bu";
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
        return "项目名称必须输入";
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
    // 获取最新版本号
    const latestVersion = await getLatestVersion(selectTemplate.npmName);
    selectTemplate.version = latestVersion;
    const targetPath = makeTargetPath();
    return {
      type: addType,
      name: addName,
      template: selectTemplate,
      targetPath,
    };
  }
}
