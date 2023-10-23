import { makeConfirm, makeList, makeCheckBox } from "@bubu-cli/utils";
import { execa } from "execa";

async function installVueRouter() {
  const r = await makeConfirm({
    name: "router",
    message: "是否安装router?",
    default: false,
  });
  // 结果统一等文件下载之后再处理
  return r;
}

async function installVuePinia() {
  const p = await makeConfirm({
    name: "pinia",
    message: "是否安装pinia?",
    default: false,
  });
  // 结果统一等文件下载之后再处理
  return p;
}

async function installTailWindCss() {
  const t = await makeConfirm({
    name: "tailwindcss",
    message: "是否安装tailwindcss?",
    default: false,
  });
  // 结果统一等文件下载之后再处理
  return t;
}

async function installDb() {
  const d = await makeList({
    name: "db",
    message: "请选择数据库类型?",
    choices: ["mySql", "mongo"],
  });
  // 结果统一等文件下载之后再处理
  return d;
}

async function installUiLib() {
  const u = await makeCheckBox({
    name: "ui",
    message: "请选择需要安装的ui库",
    choices: ["element-plus", "vant"],
  });
  return u;
}

export default async function installLib(selectTemplate) {
  const { type, template, targetPath } = selectTemplate;
  if (type === "project") {
    if (template.value === "vue-template") {
      // 是否安装路由
      const isRouter = await installVueRouter();
      // 是否安装pinia
      const isPinia = await installVuePinia();
      // 是否安装tailwindcss
      const isTailWindCss = await installTailWindCss();
      // 选择ui库
      const ui = await installUiLib();
      return {
        isRouter,
        isPinia,
        isTailWindCss,
        // isVueuse,
        ui,
      };
    } else {
      return {
        isRouter: true,
        isPinia: true,
      };
    }
  } else {
    // node 选数据库
    const db = await installDb();
    return db;
  }
}
