const path = require('path')
const webpack = require('webpack')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); //删除dist文件
module.exports = {
    mode: 'development', //development开发环境

    entry: {
        vue: ['vue', 'vue-router'],
        vant:['vant'],
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '_dll_[name].js',
        library: '_dll_[name]', //变量接收返回值 @优化
        // libraryTarget: 'var'
    },

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dist/vendor', '[name]-manifest.json'), //生成的文件清单(任务清单)
            name: '_dll_[name]', //name一定要等于library == 找到文件对应关系 
            // context: __dirname,    //必填，不然在web网页中找不到 '_dll_[name]'，会报错
        }),

    ]
}