export default {
  input: ["./lib/index.js"],
  output: [
    {
      //打包格式
      format: "es",
      //配置打包根目录
      dir: "./dist/es",
    },
  ],
};
