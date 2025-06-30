const { defineConfig } = require('@vue/cli-service');

const path = require('path');

// 获取 node 子进程
const { execSync } = require('child_process'); 
// 时间戳 标记当前版本更新时间
const dayjs = require('dayjs');

// 构建时间
process.env.VUE_APP_BUILD_TIME = dayjs().format('YYYY-MM-DD HH:mm:ss');

// 最后一次 提交 commit id
process.env.VUE_APP_GIT_VERSION = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();

// 分支名称: [ process.env.GIT_BRANCH 为 jenkins 传递 ]
process.env.VUE_APP_GIT_BRANCH = process.env.GIT_BRANCH ? process.env.GIT_BRANCH : execSync('git symbolic-ref --short -q HEAD', { encoding: 'utf8'  }).trim();

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// vue-cli3本身有安装插件，不做package依赖安装
const TerserPlugin = require('terser-webpack-plugin');

// 定义需要gzip压缩的文件类型
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

// 代理地址
const proxyIP = "http://localhost:3000";

// 代理列表
const proxyList = [{
    name: process.env.VUE_APP_DATA_DISASTER_RECOVERY_HOST,
    ip: proxyIP
}, {
    // Mock 服务器 代理
    name: process.env.VUE_APP_MOCK_HOST,
    // Mock ip
    ip: "http://localhost:3000"
}];

// 设置 代理路径
let proxyObj = {};

// setting
proxyList.forEach(item => {
    // --
    const prefix = item.prefix ? item.prefix : item.name;
    // --
    proxyObj[item.name] = {
        target: item.ip,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            ['^' + item.name]: prefix
        }
    };
});

// 添加灾备切换API代理
proxyObj['/api/disaster-switch'] = {
    target: 'http://localhost:3001',
    ws: true,
    changeOrigin: true,
    pathRewrite: {
        '^/api/disaster-switch': '/api/disaster-switch'
    }
};

const isProduction = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
    publicPath: isProduction ? './' : '/',
    chainWebpack: config => {
        // --
        config.optimization.merge({
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'all',
                        test: /node_modules/,
                        name: 'vendor',
                        minChunks: 1,
                        minChunks: 1,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 100
                    }
                }
            }
        });

        if (isProduction) {
            // 重写 js 文件名 为模块名称
            config.output.filename('js/[name].js').chunkFilename('js/[name].js');
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                "store@":  path.resolve(__dirname, "src/store"),
                "javascript@": path.resolve(__dirname, 'src/javascript')
            }
        },
        output: {
            // 微应用的包名，这里与主应用中注册的微应用名称一致
            library: "Vue2MicroApp",
            // 将你的 library 暴露为所有的模块定义下都可运行的方式
            libraryTarget: 'umd'
        },
        plugins: [
            ...(isProduction ? [
                // css合并
                new OptimizeCSSAssetsPlugin({
                    assetNameRegExp: /\.css$/g,
                    cssProcessor: require('cssnano'),
                    cssProcessorPluginOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: {
                                    removeAll: true
                                },
                                normalizeUnicode: false
                            }
                        ]
                    },
                    canPrint: true
                }),
                // 去掉debugger console.log
                new TerserPlugin({
                    parallel: 3,
                    exclude: /node_modules/,
                    terserOptions: {
                        compress: {
                            warnings: false,
                            drop_console: false,
                            drop_debugger: true,
                            pure_funcs: ['console.log']
                        }
                    }
                }),
                // gzip压缩
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    // 是否删除原文件
                    deleteOriginalAssets: false,
                    // 匹配的文件规则
                    test: productionGzipExtensions,
                    // 10K以上的进行压缩
                    threshold: 10240,
                    minRatio: 0.8
                })
            ] : [])
        ]
    },
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: isProduction ? true : false,
        // 开启 CSS source maps? 生产环境 关闭
        sourceMap: isProduction ? false : true,
        // less是用javascript
        loaderOptions: {
            // 向 CSS 相关的 loader 传递选项
            less: {
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        // 监听端口
        port: 10100,
        // 关闭主机检查，使微应用可以被 fetch
        historyApiFallback: true,
        allowedHosts: "all",
        // 配置跨域请求头，解决开发环境的跨域问题
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        open: true,
        // 反向代理配置
        proxy: proxyObj
    }
});
