import { simpleGit } from "simple-git";
import { log, makeList } from "@bubu-cli/utils";
import chalk from "chalk";
const git = simpleGit(process.cwd());

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

async function checkIdentity() {
  const config = await git.listConfig();
  // 判断是否存在用户和邮箱配置
  const hasUserConfig = config["user.name"] !== undefined;
  const hasEmailConfig = config["user.email"] !== undefined;
  return hasUserConfig && hasUserConfig;
}

export default async function preCheck() {
  try {
    return new Promise((resolve, reject) => {
      git.checkIsRepo(async (error, isRepo) => {
        if (error) {
          log.error("您暂未初始化仓库，请先初始化！");
          resolve(false);
        }

        if (!checkIdentity()) {
          log.error("您未配置用户身份！");
          console.log("请执行");
          console.log(
            chalk.cyan.bold(` git config --global user.emial "you@example.com"`)
          );
          console.log(
            chalk.cyan.bold(` git config --global user.name "your name`)
          );
          console.log("");
          resolve(false);
        }

        if (isRepo) {
          try {
            const status = await checkGitStatus();
            if (!status) {
              console.log(chalk.blue("你的代码很干净，不需要提交!!!"));
              resolve(false);
            }
            resolve(true);
          } catch (error) {
            log.error("git status error:" + error.message);
            throw new Error(error);
          }
        }
      });
    });
  } catch (error) {
    console.log("catch", error);
  }
}
