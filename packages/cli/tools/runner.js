import path from "node:path";
import { log, makeList } from "@bubu-cli/utils";
import { dirname } from "dirname-filename-esm";
import fse from "fs-extra";
import chalk from "chalk";
import { execa, execaCommand } from "execa";

import { detect } from "./detech.js";
import { agents } from "./agents.js";

const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = fse.readJSONSync(pkgPath);
const DEBUG_SIGN = ["--d", "--debug"];
// 通用的前置逻辑
export async function runCli(fn, args) {
  const debug = args.filter((_) => DEBUG_SIGN.indexOf(_) !== -1).length;
  console.log("args", args[0], debug);
  if (debug > 0) {
    DEBUG_SIGN.forEach((_) => remove(args, _));
  }
  let cwd = process.cwd();
  // -c 改变目录
  if (args[0]?.toLowerCase() === "-c") {
    cwd = path.resolve(cwd, args[1]);
    args.splice(0, 2);
  }

  if (
    (args.length === 1 && args[0]?.toLowerCase() === "-v") ||
    args[0]?.toLowerCase() === "--version"
  ) {
    const agent = await detect({ cwd });
    const agentVersion = await getV(agent);
    console.log("agentPromise", agent);

    // 输出脚手架版本号， node版本，npm版本，使用工具版本
    console.log(`@bubu/cli     ${chalk.green(pkg.version)}`);
    console.log(`node          ${chalk.green(await getV("node"))}`);
    console.log(`npm           ${chalk.green(await getV("npm"))}`);
    if (agent) {
      console.log(`${agent.padEnd(13)} ${chalk.green(agentVersion)}`);
    } else {
      console.log("agent      no lock file");
    }
  }

  if (args.length === 1 && ["-h", "--help"].includes(args[0])) {
    console.log(
      chalk.green(chalk.bold("yeshaojun/bubu-cli")) +
        chalk.dim(` use the right package manager v${pkg.version}\n`)
    );
    console.log(`ni        install`);
    console.log(`nr        run`);
    console.log(`nlx       execute`);
    console.log(`nu        upgrade`);
    console.log(`nun       uninstall`);
    console.log(`nci       clean install`);
    console.log(`na        agent alias`);
    console.log(`ni -v     show used agent`);
    console.log(
      chalk.yellow(
        "\ncheck https://github.com/yeshaojun/bubu-cli for more documentation."
      )
    );
    return;
  }

  // // 命令处理
  let command = await getCliCommand(fn, args, cwd);
  if (!command) return;
  if (!!debug) {
    console.log(command);
    return;
  }
  await execaCommand(command, { stdio: "inherit", encoding: "utf-8", cwd });
}

export async function getCliCommand(fn, args, cwd) {
  const isGlobal = args.includes("-g");
  if (isGlobal) {
    // 一会回过头再看看
    return await fn(await getGlobalAgent(), args);
  }

  let agent = await detect({ cwd });
  if (!agent) {
    agent = await makeList({
      name: "agent",
      message: "Choose the agent",
      choices: agents
        .filter((i) => !i.includes("@"))
        .map((value) => ({ title: value, value })),
    });
    if (!agent) return;
  }

  return await fn(agent, args, {
    programmatic: false,
    hasLock: Boolean(agent),
    cwd,
  });
}

export function remove(arr, v) {
  const index = arr.indexOf(v);
  if (index >= 0) arr.splice(index, 1);

  return arr;
}

export async function getV(name) {
  try {
    const { stdout, stderr } = await execa(name, ["-v"]);
    return stdout;
  } catch (error) {
    return `${name} -v 出错了`;
  }
}
