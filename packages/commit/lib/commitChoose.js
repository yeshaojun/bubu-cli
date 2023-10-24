import {
  makeList,
  makeInput,
  makeConfirm,
  makeCheckBox,
  log,
} from "@bubu-cli/utils";
import chalk from "chalk";
import { simpleGit } from "simple-git";
import { checkGitStatus } from "./preCheck.js";
import ora from "ora";
const git = simpleGit(process.cwd());

async function commit(answer, change) {
  try {
    await git.add(".");
    await git.commit(`${answer}: ${change}`);
    console.log("");
    console.log(chalk.green.bold("----------------------------------"));
    console.log(chalk.green.bold(" 本地commit成功！  "));
    console.log(chalk.green.bold("----------------------------------"));
    console.log("");
  } catch (error) {
    log.error("提交失败，请手动提交！", error.message);
    throw new Error(error);
  }
}

async function isNeedPush() {
  const isPush = await makeConfirm({
    name: "push",
    message: "是否推送到远程仓库",
    default: true,
  });
  return isPush;
}

async function checkPull() {
  try {
    const pullResult = await git.pull(null, null, { "--rebase": "false" }); // 拉取远程更改
    if (pullResult.failed) {
      log.error("合并失败");
    }
    if (pullResult.files.length > 0) {
      log.info("git pull file change", pullResult.files.join(","));
    } else {
      log.info("git pull no file change");
    }
  } catch (error) {
    log.error(error.message);
    throw new Error(error);
  }
}

export default async function commitChoose() {
  const answer = await makeList({
    message: "请选择commti类型",
    name: "type",
    choices: [
      {
        name: chalk.blue("✨feat:       新功能"),
        value: "feat",
      },
      {
        name: chalk.blue("🐛fix:        修复bug"),
        value: "fix",
      },
      {
        name: chalk.blue("📚docs:       文档更新"),
        value: "docs",
      },
      {
        name: chalk.blue("💎style:      代码风格"),
        value: "style",
      },
      {
        name: chalk.blue("📦refactor:   代码重构"),
        value: "refactor",
      },
      {
        name: chalk.blue("🚀perf:       性能提升"),
        value: "perf",
      },
      {
        name: chalk.blue("🚨test:       测试文件"),
        value: "test",
      },
      {
        name: chalk.blue("🛠buildr:      构建系统"),
        value: "refactor",
      },
      {
        name: chalk.blue("⚙️ci:          配置修改"),
        value: "ci",
      },
      {
        name: chalk.blue("🗑revert:      恢复以前的提交"),
        value: "revert",
      },
    ],
  });
  if (answer) {
    const change = await makeInput({
      message: "请输入提交说明",
      name: "subject",
      validate(v) {
        if (v.length > 2) {
          return true;
        } else {
          return chalk.red("提交说明必须为2个字符以上");
        }
      },
    });
    try {
      await commit(answer, change);
      let remotes = await git.getRemotes(true); // 获取远程信息
      const hasRemote = remotes.length > 0;
      const branchSummary = await git.branchLocal(); // 获取本地分支信息
      const currentBranch = branchSummary.current; //

      if (!hasRemote) {
        const url = await makeInput({
          message: "您还未关联远程仓库，请输入仓库地址？(仓库名默认origin):",
          name: "remote",
          validate(v) {
            if (v.length > 0) {
              return true;
            } else {
              return chalk.red("仓库地址不能为空！");
            }
          },
        });
        try {
          await git.raw(["remote", "add", "origin", url]);
          const result = await git.branch([
            "--set-upstream-to",
            `origin/${currentBranch}`,
            currentBranch,
          ]);
          remotes = [
            {
              name: "origin",
            },
          ];
          // await git.raw(["push", "origin", `${branch}:${branch}`]);
        } catch (error) {
          log.error("远程绑定失败，请手动绑定！", error.message);
        }
      }
      // 要做pull
      await checkPull();

      const status = await checkGitStatus();
      if (status) {
        log.info("您的本地代码与仓库代码有冲突，请解决后重试！");
        return;
      }
      // 是否需要加tag
      const needPush = await isNeedPush();
      if (!needPush) {
        return;
      }
      let chooseRemote = [];
      if (remotes.length > 1) {
        chooseRemote = await makeCheckBox({
          message: "选择提交的仓库(可多选)",
          name: "remote",
          choices: remotes.map((_) => _.name),
          defaultValue: remotes.map((_) => _.name),
        });
      } else {
        chooseRemote = remotes.map((_) => _.name);
      }

      remotes.forEach(async (_) => {
        if (chooseRemote.indexOf(_.name) !== -1) {
          await git.raw(["push", _.name, `${currentBranch}:${currentBranch}`]);
          console.log("");
          console.log(chalk.green.bold("----------------------------------"));
          console.log(
            chalk.green.bold(
              ` 推送${currentBranch}分支到远程${_.name}仓库成功！  `
            )
          );
          console.log(chalk.green.bold("----------------------------------"));
          console.log("");
        }
      });
    } catch (error) {
      log.error(error.message);
    }
  }
}
