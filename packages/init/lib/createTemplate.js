import { log, makeList, makeInput } from "@bubu/utils";
const ADD_TYPE_PROJECT = "project";
const ADD_TYPE_PAGE = "page";

const ADD_TEMPLATE = [
  {
    name: "vue3项目模板",
    npmName: "@imooc.com/template-vue3",
    version: "1.0.1",
  },
  {
    name: "react18项目模板",
    npmName: "@imooc.com/template-react18",
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
  });
}

export default async function createTemplate(name, opts) {
  const addType = await getAddType();
  if (addType === ADD_TYPE_PROJECT) {
    const addName = await getAddName();
    log.info("addName", addName);
  }
}
