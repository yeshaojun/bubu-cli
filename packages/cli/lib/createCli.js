import path from "node:path";
import { program } from "commander";
import fse from "fs-extra";
import semver from "semver";
import chalk from "chalk";
import { dirname } from "dirname-filename-esm";
import { log } from "@bubu-cli/utils";

const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = fse.readJSONSync(pkgPath);

const name = Object.keys(pkg.bin)[0];
const LOWEST_NODE_VERSION = "14.0.0";

function checkNodeVersion() {
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(chalk.red(`需要安装${LOWEST_NODE_VERSION}以上版本的node`));
  }
}

function preAction() {
  checkNodeVersion();
}

export default function createCLI() {
  program
    .name(name)
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .hook("preAction", preAction);

  program.on("option:debug", function () {
    if (program.opts().debug) {
      log.verbose("debug", "launch debug mode");
    }
  });

  program.on("command:*", function (obj) {
    log.error("未知的命令:" + obj[0]);
  });
  return program;
}
