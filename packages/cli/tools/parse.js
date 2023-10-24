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

export const parseBr = (agent, args) => {
  if (args.length === 0) args.push("start");

  if (args.includes("--if-present")) {
    args = exclude(args, "--if-present");
    args[0] = `--if-present ${args[0]}`;
  }

  return getCommand(agent, "run", args);
};

export const parseBu = (agent, args) => {
  if (args.includes("-i"))
    return getCommand(agent, "upgrade-interactive", exclude(args, "-i"));

  return getCommand(agent, "upgrade", args);
};

export const parseBun = (agent, args) => {
  if (args.includes("-g"))
    return getCommand(agent, "global_uninstall", exclude(args, "-g"));
  return getCommand(agent, "uninstall", args);
};

export const parseBlx = (agent, args) => {
  return getCommand(agent, "execute", args);
};

export const parseBa = (agent, args) => {
  return getCommand(agent, "agent", args);
};
