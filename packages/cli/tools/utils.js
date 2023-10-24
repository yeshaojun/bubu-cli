import which from "which";
import { resolve } from "node:path";
import fs from "node:fs";

export function cmdExists(cmd) {
  return which.sync(cmd, { nothrow: true }) !== null;
}

export function exclude(arr, v) {
  return arr.slice().filter((item) => item !== v);
}

export function getPackageJSON(ctx) {
  const cwd = ctx.cwd ?? process.cwd();
  const path = resolve(cwd, "package.json");
  if (fs.existsSync(path)) {
    try {
      const raw = fs.readFileSync(path, "utf-8");
      const data = JSON.parse(raw);
      return data;
    } catch (e) {
      if (!ctx?.programmatic) {
        console.warn("Failed to parse package.json");
        process.exit(1);
      }

      throw e;
    }
  }
}
