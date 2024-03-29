import path from "node:path";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import { printErrorLog, log } from "@bubu-cli/utils";
import ora from "ora";
import { execa } from "execa";

function getCacheDir(targetPath) {
  return path.resolve(targetPath, "node_modules");
}

// 在主目录的node_modules下创建目录
function makeCecheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath);
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir);
  }
}

// 下载模板
async function downloadAddTemplate(targetPath, selectTemplate) {
  const { npmName, version } = selectTemplate;
  const installCommand = "npm";
  const installArgs = ["install", `${npmName}@${version}`];
  await execa(installCommand, installArgs, { cwd: targetPath });
}

async function downloadTemplate(selectTemplate) {
  const { template, targetPath } = selectTemplate;
  makeCecheDir(targetPath);
  const spinner = ora("正在下载模板....").start();
  try {
    await downloadAddTemplate(targetPath, template);
    spinner.stop();
    log.info("下载成功！");
  } catch (error) {
    spinner.stop();
    printErrorLog(error);
  }
}

export default downloadTemplate;
