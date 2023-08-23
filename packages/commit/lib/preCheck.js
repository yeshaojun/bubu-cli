import { simpleGit } from "simple-git";
import { log, makeList } from "@bubu-cli/utils";
import chalk from "chalk";

export async function checkGitStatus() {
  const git = simpleGit(process.cwd());
  const status = await git.status();
  if (
    status.not_added.length > 0 ||
    status.created.length > 0 ||
    status.deleted.length > 0 ||
    status.modified.length > 0 ||
    status.renamed.length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

export default async function preCheck() {
  const git = simpleGit(process.cwd());
  try {
    return new Promise((resolve, reject) => {
      git.checkIsRepo(async (error, isRepo) => {
        if (error) {
          log.error("您暂未初始化仓库，请先初始化！");
          resolve(false);
        }
        if (isRepo) {
          const status = await checkGitStatus();
          if (!status) {
            console.log(chalk.blue("你的代码很干净，不需要提交!!!"));
            resolve(false);
          }
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.log("catch", error);
  }
}
