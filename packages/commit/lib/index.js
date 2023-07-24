import Command from "@bubu-cli/command";

class CommitCommand extends Command {
  get command() {
    return "commit";
  }
  get description() {
    return "git commit";
  }
  get options() {
    return [
      ["--f,--force", "是否强制更新", false],
      ["--d,--debug", "调试模式", false],
    ];
  }

  async action([name, option]) {
    console.log("commit");
  }
}

function Commit(instance) {
  return new CommitCommand(instance);
}

export default Commit;
