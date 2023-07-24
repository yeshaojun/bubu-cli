import createInitCommand from "@bubu-cli/init";
import createCommitCommand from "@bubu-cli/commit";
import "./exception.js";
import createCLI from "./createCli.js";

export default function (args) {
  const program = createCLI();
  createInitCommand(program);
  createCommitCommand(program);
  program.parse(process.argv);
}
