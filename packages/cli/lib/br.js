#!/usr/bin/env node

import { runCli } from "../tools/runner.js";
import { getPackageJSON } from "../tools/utils.js";
import { makeList } from "@bubu-cli/utils";
import { parseBr } from "../tools/parse.js";
import chalk from "chalk";
const args = process.argv.slice(2);

runCli(async (agent, args, ctx) => {
  // nr - 可以执行上一次的命令（暂不实现）
  if (args.length === 0 && !ctx?.programmatic) {
    // 给提示一下，具体有哪些脚本
    // console.log("hahah");
    const pkg = getPackageJSON(ctx);
    const scripts = pkg?.scripts || {};
    const scriptsInfo = pkg["scripts-info"] || {};
    const names = Object.entries(scripts);
    if (!names.length) {
      console.log("未匹配到脚本");
      return;
    }

    const raw = names
      .filter((i) => !i[0].startsWith("?"))
      .map(([key, cmd]) => ({
        key,
        cmd,
        description: scriptsInfo[key] || scripts[`?${key}`] || cmd,
      }));
    const terminalColumns = process.stdout?.columns || 80;
    function limitText(text, maxWidth) {
      if (text.length <= maxWidth) return text;
      return `${text.slice(0, maxWidth)}`;
    }
    const choices = raw.map(({ key, description }) => ({
      title: key,
      value:
        key + " - " + chalk.gray(limitText(description, terminalColumns - 15)),
    }));
    try {
      const fn = await makeList({
        name: "fn",
        message: "请选择需要执行的命令",
        choices,
      });
      if (!fn) {
        return;
      }
      args.push(fn.split("-")[0].trim());
    } catch (error) {
      process.exit(1);
    }
  }
  return parseBr(agent, args);
}, args);
