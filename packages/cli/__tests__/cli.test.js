import { execa } from "execa";
import path from "node:path";

const CLI = path.join(__dirname, "../bin/cli.js");
const bin =
  () =>
  (...args) =>
    execa(CLI, args);

test("run error command", async () => {
  const { stderr } = await bin()("iii");
  expect(stderr).toContain("未知的命令:iii");
});

// help
test("should not error when use --help", async () => {
  let error = null;
  try {
    await bin()("--help");
  } catch (error) {
    error = error;
  }
  expect(error).toBe(null);
});

test("package version", async () => {
  const { stdout } = await bin()("-V");
  expect(stdout).toContain(require("../package.json").version);
});

test("is start debug", async () => {
  let error = null;
  try {
    await bin()("--debug");
  } catch (e) {
    error = e.message;
  }
  expect(error).toContain("launch debug mode");
});
