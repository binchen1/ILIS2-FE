const path = require("path");
const process = require("process");

const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const { AutoWebPlugin } = require('web-webpack-plugin');
const proxy = require("./proxy");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const isDev = process.env.NODE_ENV === "development";
// 针对这个项目设置静态资源的路径
var { publicPath, outPut } = require("./projectConfig/url");
publicPath = isDev ? "" : publicPath;
outPut = isDev ? "" : outPut;

// 使用AutoWebPlugin，自动寻找 pages 目录下的所有目录，把每一个目录看成一个单页应用
const autoWebPlugin = new AutoWebPlugin(path.resolve(__dirname, './src/pages'), {
  template: path.resolve(__dirname, './src/template.html')
});
 
var config = {
  mode:"development",
  // AutoWebPlugin 会找为寻找到的所有单页应用，生成对应的入口配置，
  // autoWebPlugin.entry 方法可以获取到生成入口配置
  entry: autoWebPlugin.entry({
    // 这里可以加入额外需要的 Chunk 入口
  }),
  output: {
    filename: `[name].[hash:8].js`,
    path: path.resolve(__dirname, outPut),
    publicPath: `${publicPath}`
  },
  module:{
    rules:[{
          test: /\.vue$/,
          use: 'vue-loader',
        },{
          test:/\.(jsx|js)$/,
              use:{
              loader:'babel-loader',
              options:{
                  presets:[
                      "es2015"
                  ]
              }
          },
           exclude:/node_modules/
        },{
            test:/\.css$/,
            use:[
              "style-loader",
              // MiniCssExtractPlugin.loader,
              "css-loader"
            ]
        },
        {
            test:/\.less$/,
            use:[
              "style-loader",
              // MiniCssExtractPlugin.loader,
              "css-loader",
              "less-loader"
            ]
        },
        {
            test:/\.(png|jpg|gif)$/,
            use:[{
                loader:'url-loader',
                options:{
                  publicPath: `${publicPath}images/`,
                  outputPath: "images/",
                  limit: 10000
                }
            }]
        },
        {
          test: /\.(eot|woff2?|ttf|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "[name]-[hash:5].min.[ext]",
                limit: 5000,
                publicPath: `${publicPath}fonts/`,
                outputPath: "fonts/"
              }
            }
          ]
        }
    ]
},
resolve:{
    extensions: ['.js', '.vue', '.json'],
    alias:{
        "@components": path.resolve("src/components"),
        "@pages": path.resolve("src/pages"),
        "@assets": path.resolve("src/assets"),
        "@common": path.resolve("src/common"),
        "@projectConfig": path.resolve("./projectConfig"),
        "@libs": path.resolve("src/libs"),
        'vue': 'vue/dist/vue.esm.js'
    }
},
  plugins: [
    // new CleanWebpackPlugin("static/*",{
    //     root:__dirname,
    //     verbose:true,
    //     dry:false
    // }),
    new CleanWebpackPlugin(`${outPut}/*`,{
      root:__dirname,
      verbose:true,
      dry:false
    }),
    new VueLoaderPlugin(),
    autoWebPlugin,
    // new MiniCssExtractPlugin({
    //   filename: '[name].[hash:8].css',
    //   chunkFilename: '[id].[hash:8].css',
    // }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer:{
    host:"localhost",
    port:"8888",
    // open:true,
    hot:true,
    compress:true
  }
};

if(isDev){

  // config.module.rules.push({
  //     test:/\.css$/,
  //     use:[
  //       "style-loader",
  //       "css-loader"
  //     ]
  // },
  // {
  //     test:/\.less$/,
  //     use:[
  //       "style-loader",
  //       "css-loader",
  //       "less-loader"
  //     ]
  // })

  // 配置代理
  config.devServer.proxy = proxy;
// }else{
//   config.module.rules.push({
//       test:/\.css$/,
//       use:[
//         "style-loader",
//         MiniCssExtractPlugin.loader,
//         "css-loader"
//       ]
//   },
//   {
//       test:/\.less$/,
//       use:[
//         "style-loader",
//         MiniCssExtractPlugin.loader,
//         "css-loader",
//         "less-loader"
//       ]
//   })
}

module.exports = config