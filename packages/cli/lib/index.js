import createInitCommand from "@bubu/init";
import "./exception.js";
import createCLI from "./createCli.js";

export default function (args) {
  const program = createCLI();
  createInitCommand(program);
  program.parse(process.argv);
}
