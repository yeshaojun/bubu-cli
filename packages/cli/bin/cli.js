#!/usr/bin/env node

import importLocal from "import-local";
import { log } from "@bubu/utils";
import enrty from "../lib/index.js";
import { filename } from "dirname-filename-esm";

const __filename = filename(import.meta);
if (importLocal(__filename)) {
  log.info("cli", "使用本地@bubu/cli版本");
} else {
  enrty(process.argv.slice(2));
}
