var webpack = require("webpack");
var path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry:{
        index:["./src/index.js"],
        vendor:['vue']
    },
    output: {
        path:__dirname + '/build/',
        publicPath: 'build/',
        filename: '[name].js',
        chunkFilename:'[name].js'
    },
    resolve:{
        modules:[
            path.resolve(__dirname,'src'),
            path.resolve(__dirname,'node_modules')
        ],
        extensions: [".vue",".js",".json"]
    },
     module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: 'vue-style-loader!css-loader!postcss-loader!sass-loader', // <style lang="scss">
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass"> 
                        }
                    }
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/, //node_modules 文件夹除外
            }, {
                test: /\.css$/,//异步加载css模块
                use: ["style-loader/url","file-loader"]
               
            }, {
                test: /\.scss$/, 
                use: ExtractTextPlugin.extract({
                    use: 'css-loader!postcss-loader!sass-loader'
                })
            },{
                test: /\.(png|jpg|gif)$/,
                use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
                ]

            },
        ]
    }
}