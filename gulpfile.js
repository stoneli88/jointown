var fs = require('fs');
var npath = require('path')
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var runSequence = require('run-sequence');
var webpackConfig = require('./webpack.config.js');
var webpackProdConfig = require('./webpack.prod.config.js');
var WebpackDevServer = require('webpack-dev-server');

// gulp plugins.
var handlebars = require('gulp-compile-handlebars');

// create a handlebars helper to look up
// fingerprinted asset by non-fingerprinted name
var handlebarOpts = {
    helpers: {
        assetPath: function (path, context) {
            var filePath = context.data.root[path];
            var extName = npath.extname(filePath);
            var baseName = npath.basename(filePath);
            var realPath = "";

            if (extName === '.js') {
                realPath = ['../assets/js', baseName].join('/');
            } else if (extName === '.css') {
                realPath = ['../assets/styles', baseName].join('/')
            }

            gutil.log('compileHBS: output ', gutil.colors.green(realPath));

            return realPath;
        }
    }
};

// Generate index.html during build
gulp.task('assets:makeHtml', function () {
    // read in our manifest file
    var manifest = JSON.parse(fs.readFileSync('./public/assets/js/manifest.json', 'utf8'));

    // read in our handlebars template, compile it using
    // our manifest, and output it to index.html
    return gulp.src(['./app/modules/**/*.html'])
        .pipe(handlebars(manifest, handlebarOpts))
        .pipe(gulp.dest('./public'));
});

// 加载webpack任务.
gulp.task('webpack:develop', function (callback) {
    webpack(webpackConfig).run(onBuild(callback));
});

// 加载生产环境webpack任务.
gulp.task('webpack:production', function (callback) {
    webpack(webpackProdConfig).run(onBuild(callback));
});

// webpack dev server task.
gulp.task('webpack:devSever', function (c) {
    var myConfig = Object.create(webpackConfig);

    myConfig.devtool = 'eval';
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        stats: {
            colors: true
        }
    }).listen(8090, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:8090/login/login.html');
    });
});

gulp.task('dev', function() {
    runSequence('webpack:develop', 'assets:makeHtml', 'webpack:devSever');
});

gulp.task('prod', function(){
    runSequence('webpack:production', 'assets:makeHtml')
});

// 处理编译过程中的问题.
function onBuild(done) {
    return function(err, stats) {
        if (err) {
            gutil.log('Error', err);
            if (done) {
                done();
            }
        } else {
            Object.keys(stats.compilation.assets).forEach(function(key) {
                gutil.log('Webpack: output ', gutil.colors.green(key));
            });
            gutil.log('Webpack: ', gutil.colors.blue('finished ', 'webpack:build'));
            if (done) {
                done();
            }
        }
    };
}