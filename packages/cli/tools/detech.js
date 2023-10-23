import { findUp } from "find-up";
import path from "node:path";
import fs from "node:fs";
import terminalLink from "terminal-link";
import { makeConfirm } from "@bubu-cli/utils";
import { LOCKS, INSTALL_PAGE } from "./agents.js";
import { cmdExists } from "./utils.js";
export async function detect({
  autoInstall, // 默认为falas
  programmatic, // 默认为falas
  cwd,
}) {
  let agent = null;
  let version = null;
  const lockPath = await findUp(Object.keys(LOCKS), { cwd });
  let packageJsonPath = null;

  if (lockPath) {
    packageJsonPath = path.resolve(lockPath, "../package.json");
  } else {
    packageJsonPath = await findUp("package.json", { cwd });
  }

  // 判断package文件里面是否指定了packageManager，如果是，则以packageManager为准
  if (packageJsonPath && fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      if (typeof pkg.packageManager === "string") {
        const [name, ver] = pkg.packageManager.split("@");
        version = ver;
        if (name === "yarn" && Number.parseInt(ver) > 1) agent = "yarn@berry";
        else if (name === "pnpm" && Number.parseInt(ver) < 7) agent = "pnpm@6";
        else if (name in AGENTS) agent = name;
        else if (!programmatic)
          console.warn("[ni] Unknown packageManager:", pkg.packageManager);
      }
    } catch {}
  }

  // 以lock文件为准
  if (!agent && lockPath) {
    agent = LOCKS[path.basename(lockPath)];
  }
  // auto install
  if (agent && !cmdExists(agent.split("@")[0]) && !programmatic) {
    if (!autoInstall) {
      console.warn(`已匹配${agent}, 但并未监测到安装\n`);

      //  退出脚手架环境
      if (process.env.CI) process.exit(1);

      // 在终端上显示链接
      const link = terminalLink(agent, INSTALL_PAGE[agent]);

      const tryInstall = await makeConfirm({
        name: "autoInstall",
        message: `Would you like to globally install ${link}?`,
        default: true,
      });
      console.log("tryInstall", tryInstall);
      if (!tryInstall) {
        process.exit(1);
      }
    }

    await execaCommand(`npm i -g ${agent}${version ? `@${version}` : ""}`, {
      stdio: "inherit",
      cwd,
    });
  }
  return agent;
}
