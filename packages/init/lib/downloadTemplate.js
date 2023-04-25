import path from "node:path";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import { printErrorLog, log } from "@bubu/utils";
import ora from "ora";

function getCacheDir(targetPath) {
  return path.resolve(targetPath, "node_modules");
}

function makeCecheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath);
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir);
  }
}

async function downloadAddTemplate(targetPath, selectTemplate) {
  const { npmName, version } = selectTemplate;
}

async function downloadTemplate(selectTemplate) {
  const { template, targetPath } = selectTemplate;
  makeCecheDir(targetPath);
  const spinner = ora("正在下载模板....").start();
  try {
    await downloadAddTemplate(targetPath, selectTemplate);
  } catch (error) {
    spinner.stop();
    printErrorLog(error);
  }
}

export default downloadTemplate;