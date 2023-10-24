#!/usr/bin/env node

import { runCli } from "../tools/runner.js";
import { parseBu } from "../tools/parse.js";

(function () {
  const args = process.argv.slice(2);
  runCli(parseBu, args);
})();
