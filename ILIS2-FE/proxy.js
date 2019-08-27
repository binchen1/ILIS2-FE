// 配置代理

// 开发人员机器
var host = {
  // 本地服务
  default: "http://localhost:8080",

  // 开发环境
  dev: "http://192.168.2.4:8080",

  dengyy: "http://192.168.2.158:8080",

  chenlm: "http://192.168.2.129:8080",

  zhanghong: "http://192.168.2.227:8088"
}

var target = host.zhanghong;

proxy = {
    '/': {
      target: target,
      // pathRewrite: {'^/api' : ''},
      changeOrigin: true,
      secure: false
    }
}

module.exports = proxy;