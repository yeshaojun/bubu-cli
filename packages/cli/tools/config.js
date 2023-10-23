import fs from "node:fs";
const customRcPath = process.env.BI_CONFIG_FILE;

const home =
  process.platform === "win32" ? process.env.USERPROFILE : process.env.HOME;

const defaultRcPath = path.join(home || "~/", ".nirc");

const rcPath = customRcPath || defaultRcPath;

const defaultConfig = {
  defaultAgent: "prompt",
  globalAgent: "npm",
};

let config = null;
export async function getConfig() {
  if (!config) {
    const result = (await findUp("package.json")) || "";
    let packageManager = "";
    if (result) {
      packageManager =
        JSON.parse(fs.readFileSync(result, "utf8")).packageManager ?? "";
    }
    const [, agent, version] =
      packageManager.match(
        new RegExp(`^(${Object.values(LOCKS).join("|")})@(\\d).*?$`)
      ) || [];
    if (agent) {
      config = Object.assign({}, defaultConfig, {
        defaultAgent:
          agent === "yarn" && Number.parseInt(version) > 1
            ? "yarn@berry"
            : agent,
      });
    } else if (!fs.existsSync(rcPath)) {
      config = defaultConfig;
    } else {
      config = Object.assign(
        {},
        defaultConfig,
        ini.parse(fs.readFileSync(rcPath, "utf-8"))
      );
    }
  }
  return config;
}

export async function getGlobalAgent() {
  const { globalAgent } = await getConfig();
  return globalAgent;
}
