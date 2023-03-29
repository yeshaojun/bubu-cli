import Command from "@bubu/command";

class InitCommand extends Command {
  get command() {
    return "init [name]";
  }

  get description() {
    return "init project";
  }

  get options() {
    return [
      ["-f", "--force", "是否强制更新", false],
      ["--d", "--debug", "调试模式", false],
    ];
  }

  action([name, option]) {
    console.log("params", name, option);
  }
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;
