import fse from "fs-extra";
import path from "node:path";
import { execa } from "execa";
import chalk from "chalk";
import { ADD_TYPE_NODE } from "./config.js";
import { log } from "@bubu-cli/utils";
export default async function initGit(selectTemplate) {
  const { name, template, nodeFramework } = selectTemplate;
  const rootDir = process.cwd();
  const installDir = path.resolve(`${rootDir}/${name}`);
  const installCommand = "git";
  const installArgs = ["init"];
  await execa(installCommand, installArgs, { cwd: installDir });
  const ignoreContent = `node_modules
dist
build
  `;
  fse.writeFileSync(
    path.resolve(`${installDir}/.gitignore`),
    ignoreContent,
    "utf-8"
  );
  console.log("");
  console.log("");
  console.log(chalk.green.bold("----------------------------------"));
  console.log(chalk.green.bold("  安装成功!  "));
  console.log(chalk.green.bold("----------------------------------"));
  console.log("");
  console.log(chalk.white("tip: 试试用bubu commit提交代码吧!"));
  console.log("");
  log.info(`cd ${name}`);
  log.info(`npm run install`);
  log.info(
    `npm run ${
      selectTemplate.type === ADD_TYPE_NODE
        ? (nodeFramework === 'nest' ? 'start': 'serve')
        : template.value === "vue-template"
        ? "dev"
        : "start"
    }`
  );
}
