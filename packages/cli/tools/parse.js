import { AGENTS } from "./agents.js";
import { exclude } from "./utils.js";

export class UnsupportedCommand extends Error {
  constructor({ agent, command }) {
    super(`Command "${command}" is not support by agent "${agent}"`);
  }
}

export function getCommand(agent, command, args) {
  if (!(agent in AGENTS)) throw new Error(`Unsupported agent "${agent}"`);

  const c = AGENTS[agent][command];

  if (typeof c === "function") return c(args);

  if (!c) throw new UnsupportedCommand({ agent, command });

  const quote = (arg) =>
    !arg.startsWith("--") && arg.includes(" ") ? JSON.stringify(arg) : arg;
  return c.replace("{0}", args.map(quote).join(" ")).trim();
}

export const parseBi = (agent, args, ctx) => {
  // bun use `-d` instead of `-D`, #90
  if (agent === "bun") args = args.map((i) => (i === "-D" ? "-d" : i));

  if (args.includes("-g"))
    return getCommand(agent, "global", exclude(args, "-g"));
  console.log("args", args, ctx);
  if (args.includes("--frozen-if-present")) {
    args = exclude(args, "--frozen-if-present");
    return getCommand(agent, ctx?.hasLock ? "frozen" : "install", args);
  }

  if (args.includes("--frozen"))
    return getCommand(agent, "frozen", exclude(args, "--frozen"));

  if (args.length === 0 || args.every((i) => i.startsWith("-")))
    return getCommand(agent, "install", args);

  return getCommand(agent, "add", args);
};
