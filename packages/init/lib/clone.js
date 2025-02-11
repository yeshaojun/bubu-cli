import { execa } from "execa";
import ora from "ora";
import { NODE_URL, COLORS } from "./config.js";
import { pathExistsSync } from "path-exists";
import path from "node:path";
import fse from "fs-extra";

async function download(type, name) {
  const rootDir = process.cwd();
  const installCommand = "git";
  const installArgs = [
    "clone",
    "-b",
    NODE_URL[type].branch,
    NODE_URL[type].url,
    name,
  ];
  const spinner = ora("loading").start();
  const timer = setInterval(() => {
    spinner.color = COLORS[parseInt(Math.random(0, 1) * 8)];
    spinner.text = "项目初始化中";
  }, 1000);
  await execa(installCommand, installArgs, { cwd: rootDir });
  clearInterval(timer);
  spinner.stop();
}

export  async function cloneNode(type, name, opt) {
  const rootDir = process.cwd();
  if (pathExistsSync(path.resolve(`${rootDir}/${name}`))) {
    if (opt.force) {
      fse.removeSync(path.resolve(`${rootDir}/${name}`));
      await download(type, name);
    } else {
      log.error("目录已存在");
    }
  } else {
    await download(type, name);
  }
}

export async function cloneNest(name, opt) {
  const rootDir = process.cwd();
  if (pathExistsSync(path.resolve(`${rootDir}/${name}`))) {
    if (opt.force) {
      fse.removeSync(path.resolve(`${rootDir}/${name}`));
      await download('nest', name);
    } else {
      log.error("目录已存在");
    }
  } else {
    await download('nest', name);
  }
}
