export const ADD_TYPE_PROJECT = "project";
export const ADD_TYPE_NODE = "node";
export const ADD_TEMPLATE = [
  {
    name: "vue3项目模板",
    npmName: "@bubu-cli/vue-template",
    value: "vue-template",
    version: "latest",
  },
  {
    name: "react18项目模板",
    npmName: "@bubu-cli/react-template",
    value: "react-template",
    version: "latest",
  },
];
export const ADD_TYPE = [
  {
    name: "前端项目",
    value: ADD_TYPE_PROJECT,
  },
  {
    name: "Node项目",
    value: ADD_TYPE_NODE,
  },
];

export const TEMP_HOME = ".cli-bu";

export const NODE_URL = {
  mySql: {
    url: "https://gitee.com/yeshaojun/koa-service-template.git",
    branch: "main",
  },
  mongo: {
    url: "https://gitee.com/yeshaojun/koa-service-template.git",
    branch: "mongodb",
  },
};

export const COLORS = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray",
];
