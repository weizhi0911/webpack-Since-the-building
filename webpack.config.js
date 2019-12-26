/**
* @优化 exclude|include|noParse|IgnorePlugin|DllPlugin|optimization
* @懒加载 如创键一个按钮,点击按钮在该函数中function(){
   jsonp实现动态加载文件
   import('文件夹路径').then(data=>{
     加载完毕执行。。。
     data.default为导出值
        console.log(data)
     }) 
    }
 * 
 */





const path = require("path")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = process.env.NODE_ENV === "development" //process.env获取变量名  isDev判断是否为true
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); //删除dist文件
const {
    entry
} = require("./webpack.dll.config.js");
const ExtractPlugin = require('extract-text-webpack-plugin'); //使css代码外部引入
const HappyPack = require('happypack'); //多线程打包
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
// output的publicPath是用来给生成的静态资源路径添加前缀的；
// devServer中的publicPath是用来本地服务拦截带publicPath开头的请求的；
// contentBase是用来dev指定被访问html页面所在目录的；
const config = {
    mode: 'development', //development开发环境
    target: "web", //运行在web平台（编译目标）
    // entry: path.join(__dirname, "src/index.js"), //入口
    entry: {
        index: ["babel-polyfill", './src/index.js'],
        common: ['./src/assese/js/common.js']
    },
    output: { //出口
        filename: 'main/[name].js',
        // path: path.join(__dirname, "dist")
        path: path.resolve(__dirname, "dist"),
        // publicPath: "./",
        chunkFilename: '[name].js', //模块分包输出文件名，如：group-news/group-news.js
    },
    externals: {
        // 'vueX':'Vuex',
        // '$common':'$common',
    },
    module: { //加载器S
        noParse: /jquery/, //@优化 不去解析jquery中的依赖关系（jquery中没有依赖关系）
        rules: [{
                test: /.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /.js$/,

                loader: 'happypack/loader?id=js', //多线程打包js,(css等loader同理) @优化
                exclude: /node_modules/, //排除该文件中的js @优化
                include: path.resolve('src') //包含该文件js @优化
            },
            {
                test: /.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                // use: ,
                use: ExtractPlugin.extract({ //配合打包使css为外部引入文件
                    fallback: "style-loader",
                    use: 'happypack/loader?id=css'
                })
            },

            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.styl$/,
                use: ['style-loader', 'css-loader',
                    { //此配置因为style-loader会生成sourceMap,postcss-loader会使用前面的sourceMap,编译的效率会变快
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        }
                    }, 'stylus-loader'
                ],
            },
            {
                test: /\.(gif|png|jpg|jpeg|svg)$/,
                use: [{
                        loader: 'url-loader', //url-loader要依赖file-loader,也要安装
                        options: {
                            limit: 1024, //超过1024大小将会转成bess64编码
                            name: "[name].[ext]" //图片的名字为进来时的名字
                        }
                    }

                ]
            }
        ]
    },
    plugins: [ //插件
        // 请确保引入这个插件来施展魔法
        new VueLoaderPlugin()
        //将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
        , new HtmlWebpackPlugin({
            template: "./src/index.template.html",
            filename: "index.html",
            minify: {
                removeAttributeQuotes: true, //去除双引号
            },
            hash: true,
        }),
        new webpack.DefinePlugin({ //项目js中可以使用环境变量判断
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"', //单双引号注意加，否则会出现调用错误（process.env.NODE_ENV=development）development应是字符
            }
        }),
        new webpack.HotModuleReplacementPlugin(), //此插件用来配合hot热模块替换使用
        new webpack.HashedModuleIdsPlugin(),
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        // //IgnorePlugin忽略某些内容，可正则，该是忽略moment时间插件中的locale文件引用,需要使用时import手动引入,这时不会增加打包后的大小 @优化
        ...Object.keys(entry).map(name => {
            return new webpack.DllReferencePlugin({
                // context: __dirname,
                manifest: path.resolve(__dirname, 'dist/vendor', `${name}-manifest.json`)

            });
        }),
        new ExtractPlugin({ // 在plugins中配置属性
            filename: 'css/[name].css' // 配置提取出来的css名称
        }),
        new HappyPack({
            id: 'js',
            loaders: [{
                loader: 'babel-loader',
            }],
            //允许 HappyPack 输出日志
            // verbose: true,
            //共享进程池
            threadPool: happyThreadPool,
        }),

        new HappyPack({
            id: 'css',
            loaders: [{
                loader: "css-loader"
            }],
            //允许 HappyPack 输出日志
            // verbose: true,
            //共享进程池
            threadPool: happyThreadPool,
        })

    ],

    optimization: { //抽离公共代码(多次import引用) @重要
        splitChunks: { //分割代码块
            cacheGroups: { //缓存组(运行是从上到下,priority 增加权重执行)
                common: { //抽离
                    name: "js/common", //
                    chunks: "initial", //刚开始开始抽离（除此还有个异步方法抽离，未写）
                    minSize: 0, //大于多少字节开始抽离
                    minChunks: 2, //引用多少次抽离
                },
                vendor: { //(第三方的意思)
                    priority: 1,
                    name: "js/vendor",
                    test: /node_modules/, //只要引用第三方模块(比如jquery)，就抽离
                    chunks: "initial", //刚开始开始抽离（除此还有个异步方法抽离，未写）
                    minSize: 0, //大于多少字节开始抽离
                    minChunks: 2, //引用多少次抽离
                }
            },

        }
    }
}
if (isDev) {
    console.log("devdeddddddddddddddddddddd")
    config.devtool = '#cheap-module-eval-source-map', //完整的编译代码与编译之后显示代码的关系
        config.devServer = {
            port: 8000, //端口号
            // host: '127.0.0.1', //监听localhost
            progress: true, //打包进度条
            contentBase: "./dist", //运行后开始访问的目录
            overlay: {
                error: true, //webpack编译过程会显示在页面
            },
            hot: true, //改变组件代码时不会刷新整个页面，只会刷新当前组件
            inline: true, // 用来支持dev-server自动刷新的配置
            // open:true,//启动项目自动打开浏览器
            // historyFallback:true,//页面任意报错映射index.html地址
            //   proxy: {//跨域
            //       '/api': {
            //           target: 'http://10.95.74.152:2222/',
            //           pathRewrite: {
            //               '^/api': ''
            //           },
            //           changeOrigin: true, // target是域名的话，需要这个参数，
            //           secure: false, // 设置支持https协议的代理
            //       },

            //   }
        }
} else {

    config.devtool = '#cheap-module-eval-source-map',
        config.plugins.push(

        )
}
// config.plugins=(config.plugins||[]).concat([//另一种合并plugins的方法(concat)
//     new webpack.DllPlugin({
//         path: path.join(__dirname, 'src/dll', 'manifest.json'),
//         name:'index.[hash:8]'
//       }),
// ])
// console.log(config)
module.exports = config