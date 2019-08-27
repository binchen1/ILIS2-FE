const base = require("./webpack.base.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge= require('webpack-merge');

var prodConfig = {
    mode:"production",
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
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
            canPrint: true
       })
    ],
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 name: 'commons',
    //                 chunks: 'initial',
    //                 minChunks: 2,
    //                 minSize: 0
    //           }
    //       }
    //   }
    // }
}

module.exports = merge(base, prodConfig);