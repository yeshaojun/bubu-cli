#!/usr/bin/env node

import { runCli } from "../tools/runner.js";
import { parseBun } from "../tools/parse.js";

(function () {
  const args = process.argv.slice(2);
  runCli(parseBun, args);
})();
