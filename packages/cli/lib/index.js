import path from "node:path";
import { program } from "commander";
import semver from "semver";
import chalk from "chalk";
import fse from "fs-extra";
import createInitCommand from "@bubu/init";
import { isDebug } from "@bubu/utils";
import { dirname } from "dirname-filename-esm";
// import pkg from "../package.json";
const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = fse.readJSONSync(pkgPath);

const name = Object.keys(pkg.bin)[0];
const LOWEST_NODE_VERSION = "18.0.0";

function checkNodeVersion() {
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(chalk.red(`需要安装${LOWEST_NODE_VERSION}以上版本的node`));
  }
}

function preAction() {
  checkNodeVersion();
}

process.on("uncaughtException", (e) => {
  if (isDebug()) {
    console.log(e);
  } else {
    console.log(e.message);
  }
});

export default function (args) {
  program
    .name(name)
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d", "--debug", "是否开启调试模式", false);

  program.hook("preAction", preAction);
  createInitCommand(program);
  // program
  //   .command("init [name]")
  //   .description("init project")
  //   .option("-f", "--force", "是否强制更新", false)
  //   .action((name, option) => {
  //     console.log("init...", name, option);
  //   });

  program.parse(process.argv);
}
