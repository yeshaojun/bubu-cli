#!/usr/bin/env node

import { runCli } from "../tools/runner.js";
const args = process.argv.slice(2);

runCli(async (agent, args, ctx) => {
  // nr - 可以执行上一次的命令（暂不实现）

  if (args.length === 0 && !ctx?.programmatic) {
    // 给提示一下，具体有哪些脚本
    console.log("hahah");
  }
}, args);
