// 项目打包临时打包到的目录，之后要根据配置对文件结构目录调整
const fileName = "webpackDistFile";

// 项目中引用资源的地址
const publicPath = `webpage/com/hitek/${fileName}/`;

// 打包后的位置
const outPut = `../../src/main/webapp/webpage/com/hitek/${fileName}`;

// 开发时跳转的登陆地址
const loginUrl = "ilis2/loginController.do?login";

exports.fileName = fileName;
exports.publicPath = publicPath;
exports.outPut = outPut;
exports.loginUrl = loginUrl;