var path = require('path');
var webpack = require("webpack");

// css pre process.
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var assets = require('postcss-assets');

// webpack plugins.
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var Purify = require("purifycss-webpack-plugin");

var libsDir = __dirname + '/app/libs';

// 本平台的共有组件.
var sharedAssetsUrl = '/commons/';

// 分为2种不同的方式处理问题.
var extractCSS = new ExtractTextPlugin('../styles/[name].[chunkhash].css');
var extractLESS = new ExtractTextPlugin('../styles/[name].[chunkhash].less');

// 区分开发或是生产环境
var env = process.argv.slice(-1).pop();

// 需要加载的插件
var plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: "commons.js",
        minChunks: 2
    }),
    new CopyWebpackPlugin([
        { from: libsDir + '/kendoui/css/kendo.common-material.min.css', to: '../styles' },
        { from: libsDir + '/kendoui/css/kendo.material.min.css', to: '../styles' }
    ]),
    extractCSS,
    extractLESS
];

// webpack编译文件的PATH配置.
var output = {
    path: './public/assets/js',
    publicPath: './public',
    filename: '[name].js'
};

// 生产环境打包需要minimize.
if (env === '--production') {
    plugins.push(new UglifyJsPlugin({
        minimize: true,
        beautify: true,
        compress: {
            warnings: false
        },
        mangle: {
            except: ['$super', '$', 'exports', 'require']
        }
    }));

    // 清理已经编译的文件.
    plugins.push(new CleanWebpackPlugin(['./public/assets/js', './public/assets/images', './public/assets/styles'], {
        verbose: true,
        dry: false
    }));

    // generate hash json file.
    plugins.push(new ManifestPlugin());

    // chunkhash.
    plugins.push(new ChunkManifestPlugin({
        filename: "chunk-manifest.json",
        manifestVariable: "webpackManifest"
    }));

    // optimization for stylesheets.
    new Purify({
        basePath: __dirname,
        paths: [
            "public/*.html",
            "public/pages/*.html"
        ]
    })

    plugins.push(new webpack.optimize.OccurenceOrderPlugin());

    // Don’t use [chunkhash] in development since this will increase compilation time
    output.filename = '[name].[chunkhash].js';
}

// webpack的核心配置.
var config = {
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
        this.module.noParse.push(new RegExp(path));
    },
    cache: true,
    debug: true,
    entry: {
        login: './app/modules/login/main.js',
        empoly: './app/modules/empoly/main.js'
    },
    output: output,
    devtool: "inline-source-map",
    plugins: plugins,
    module: {
        loaders: [
            { test: /\.svg/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=../fonts/[name].[ext]' },
            { test: /\.woff/, loader: 'url?limit=65000&mimetype=application/font-woff&name=../fonts/[name].[ext]' },
            { test: /\.woff2/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=../fonts/[name].[ext]' },
            { test: /\.[ot]tf/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=../fonts/[name].[ext]' },
            { test: /\.eot/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=../fonts/[name].[ext]' },
            { test: /\.json$/, loader: 'json' },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=../images/[name].[ext]',
                    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            },
            {
                test: /\.js$|\.jsx$/,
                exclude: /(node_modules|bower_components|kendoui)/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                loader: extractLESS.extract(['css', 'less'])
            },
            {
                test: /\.scss$/,
                loader: extractCSS.extract(['css', 'sass?sourceMap'])
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: "css-loader"
                })
            }
        ],
        noParse: []
    },
    resolve: {
        extensions: ['', '.js', '.json', '.min.js'],
        root: [
            path.resolve('.'),
            path.resolve('app/libs/kendoui/js')
        ],
        alias: []
    },
    postcss: function () {
        return [
            precss,
            autoprefixer,
            assets({
                basePath: 'public/',
                loadPaths: ['assets/', 'assets/images']
            })
        ];
    },
    devServer: {
        contentBase: './public',
        hot: true
    }
};

// 添加第三方库
config.addVendor('jqBackstretch', libsDir + '/jquery.backstretch.min.js');

module.exports = config;