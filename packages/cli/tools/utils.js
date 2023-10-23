import which from "which";
export function cmdExists(cmd) {
  return which.sync(cmd, { nothrow: true }) !== null;
}

export function exclude(arr, v) {
  return arr.slice().filter((item) => item !== v);
}
