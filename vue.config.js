module.exports = {
    
    publicPath: "/",
    runtimeCompiler: true,
      /**
   * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
   *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
   *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
   *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
   * */
    productionSourceMap: false,

    //是否使用eslint
    lintOnSave: false,
    devServer: {
        proxy: {
            // '/api': {
            //     target: 'http://applyrecordadmin.ztbory.com', //接口域名
            //     changeOrigin: true,             //是否跨域
            //     ws: true,                       //是否代理 websockets
            //     secure: true,                   //是否https接口
            //     pathRewrite: {                  //路径重置
            //         '^/api': ''
            //     }
            // }
            '/tiandi':{
                target:'http://t7.tianditu.com/',
                changeOrigin:true,
                ws:true,
                pathRewrite: {
                  '^/tiandi': ''  //请求的时候使用这个api就可以
                }
            }
        }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
        config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
        config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
        }
    },
    configureWebpack:{
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                },
            ]
        }
    }

};