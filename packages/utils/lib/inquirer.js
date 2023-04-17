import inquirer from "inquirer";

function make({
  choices,
  defaultValue,
  message = "请选择",
  type = "list",
  require = true,
  mask = "*",
  validate,
  pageSize,
  loop,
}) {
  const option = {
    name: "name",
    choices,
    default: defaultValue,
    message,
    type,
    require,
    mask,
    validate,
    pageSize,
    loop,
  };
  if (type === "list") {
    option.choices = choices;
  }
  return inquirer.prompt(option).then((answer) => answer.name);
}

export function makeList(params) {
  return make({ ...params });
}

export function makeInput(params) {
  return make({
    type: "input",
    ...params,
  });
}
