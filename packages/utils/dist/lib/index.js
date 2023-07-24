'use strict';

var log = require('npmlog');
var inquirer = require('inquirer');
var urlJoin = require('url-join');
var axios = require('axios');

function isDebug() {
  return process.argv.includes("--debug") || process.argv.includes("--d");
}

if (isDebug()) {
  log.level = "verbose";
} else {
  log.level = "info";
}

log.heading = "@bubu";

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

function makeList(params) {
  return make({ ...params });
}

function makeInput(params) {
  return make({
    type: "input",
    ...params,
  });
}

function getNpmInfo(npmName) {
  const registry = "https://registry.npmjs.org/";
  const url = urlJoin(registry, npmName);
  return axios.get(url).then((res) => {
    try {
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  });
}
function getLatestVersion(npmName) {
  return getNpmInfo(npmName).then((data) => {
    if (!data["dist-tags"] || !data["dist-tags"].latest) {
      log.error("没有latest版本号");
      return Promise.reject(new Error("没有latest版本号"));
    } else {
      return data["dist-tags"].latest;
    }
  });
}

function printErrorLog(e, type) {
  if (isDebug()) {
    log.error(type, e);
  } else {
    log.error(type, e.message);
  }
}

exports.log = log;
exports.getLatestVersion = getLatestVersion;
exports.isDebug = isDebug;
exports.makeInput = makeInput;
exports.makeList = makeList;
exports.printErrorLog = printErrorLog;
