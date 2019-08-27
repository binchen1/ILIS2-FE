const webpack = require("webpack");
const base = require("./webpack.base.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const proxy = require("../proxy");
const merge= require('webpack-merge');

const isDev = process.env.NODE_ENV === "development";

var devConfig = {};

if(isDev){
    devConfig = {
        module:{
            rules:[
                {
                    test:/\.css$/,
                    use:[
                      "style-loader",
                      "css-loader"
                    ]
                },
                {
                    test:/\.less$/,
                    use:[
                      "style-loader",
                      "css-loader",
                      "less-loader"
                    ]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer:{
            host:"localhost",
            port:"8888",
            // open:true,
            hot:true,
            compress:true,
            proxy: proxy
        }
    }
}else{
    devConfig = {
        mode:"development",
        module:{
            rules:[
                {
                    test:/\.css$/,
                    use:[
                      "style-loader",
                      MiniCssExtractPlugin.loader,
                      "css-loader"
                    ]
                },
                {
                    test:/\.less$/,
                    use:[
                      "style-loader",
                      MiniCssExtractPlugin.loader,
                      "css-loader",
                      "less-loader"
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[hash:8].css',
                chunkFilename: '[id].[hash:8].css',
            })
        ]
    }
}


module.exports = merge(base, devConfig);