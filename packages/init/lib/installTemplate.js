import fse from "fs-extra";
import path from "node:path";
import { log } from "@bubu/utils";
import { pathExistsSync } from "path-exists";
import ora from "ora";
import { glob } from "glob";
import ejs from "ejs";

function getCacheFilePath(targetPath, template) {
  return path.resolve(targetPath, "node_modules", template.npmName, "template");
}

function getPluginFilePath(targetPath, template) {
  return path.resolve(
    targetPath,
    "node_modules",
    template.npmName,
    "plugin/index.js"
  );
}

function copyFile(targetPath, template, installDir) {
  const originFile = getCacheFilePath(targetPath, template);
  const fileList = fse.readdirSync(originFile);
  const spinner = ora("正在拷贝模板文件").start();
  fileList.forEach((file) => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`);
  });
  spinner.stop();
  log.info("模板拷贝成功！");
}

async function ejsRender(installDir, template, name) {
  const files = await glob("**", {
    cwd: installDir,
    nodir: true,
    ignore: ["**/publish/**", "**/node_modules/**"],
  });

  let data = {};
  // 执行插件
  const pluginPath = getPluginFilePath(targetPath, template);
  if (pathExistsSync(pluginPath)) {
    const pluginFn = await import(pluginPath).default;
    data = pluginFn();
  }
  console.log("files", files);
  files.map((file) => {
    const filePath = path.join(installDir, file);
    ejs.renderFile(
      filePath,
      {
        data: {
          name,
          ...data,
        },
      },
      (err, result) => {
        if (!err) {
          fse.writeFileSync(filePath, result);
        } else {
          log.error(err);
        }
      }
    );
  });
}

export default function installTemplate(selectTemplate, opts) {
  const { force = false } = opts;
  console.log("force", force);
  const { targetPath, name, template } = selectTemplate;
  const rootDir = process.cwd();
  fse.ensureDirSync(targetPath);
  const installDir = path.resolve(`${rootDir}/${name}`);
  if (pathExistsSync(installDir)) {
    if (force) {
      fse.removeSync(installDir);
      fse.ensureDirSync(installDir);
    } else {
      log.error("目录已存在");
    }
  } else {
    fse.ensureDirSync(installDir);
  }
  copyFile(targetPath, template, installDir);
  ejsRender(installDir, template, name);
}
