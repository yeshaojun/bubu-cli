import fse from "fs-extra";
import path from "node:path";
import { log, makeList, makeInput, makeConfirm } from "@bubu-cli/utils";
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

// 将下载的模板来拷贝到目录
function copyFile(targetPath, template, installDir, result) {
  const originFile = getCacheFilePath(targetPath, template);
  // const fileList = fse.readdirSync(originFile);
  const folderToExclude = [];
  if (result && !result.isRouter) {
    folderToExclude.push("router");
  }
  if (result && !result.isPina) {
    folderToExclude.push("stores");
  }

  if (result && !result.isTailWindCss) {
    folderToExclude.push("tailwind.config.js", "postcss.config.js");
  }

  const spinner = ora("正在拷贝模板文件").start();
  copyFileExclude(originFile, installDir, folderToExclude);
  spinner.stop();
  log.info("模板拷贝成功！");
}

function copyFileExclude(source, destination, folderToExclude = []) {
  const files = fse.readdirSync(source);
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);
    const stat = fse.statSync(sourcePath);
    if (stat.isFile()) {
      fse.copySync(sourcePath, destinationPath);
    } else if (stat.isDirectory() && folderToExclude.indexOf(file) === -1) {
      fse.ensureDirSync(destinationPath);
      copyFileExclude(sourcePath, destinationPath, folderToExclude);
    }
  });
}

// ejs编译
async function ejsRender(targetPath, installDir, template, name, result) {
  const files = await glob("**", {
    cwd: installDir,
    nodir: true,
    ignore: ["**/publish/**", "**/node_modules/**"],
  });

  let data = {
    ...result,
  };

  // 执行插件（插件并不需要拷贝过来）
  const pluginPath = getPluginFilePath(targetPath, template);
  if (pathExistsSync(pluginPath)) {
    const pluginFn = await import(pluginPath).default;
    data = pluginFn({
      makeList,
      makeInput,
      makeConfirm,
    });
  }

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

export default function installTemplate(selectTemplate, opts, result) {
  const { force = false } = opts;
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
  copyFile(targetPath, template, installDir, result);
  ejsRender(targetPath, installDir, template, name, result);
}
