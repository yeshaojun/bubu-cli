import urlJoin from "url-join";
import axios from "axios";
import log from "./log.js";
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
export function getLatestVersion(npmName) {
  return getNpmInfo(npmName).then((data) => {
    if (!data["dist-tags"] || !data["dist-tags"].latest) {
      log.error("没有latest版本号");
      return Promise.reject(new Error("没有latest版本号"));
    } else {
      return data["dist-tags"].latest;
    }
  });
}
