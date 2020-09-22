const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  productionSourceMap: false, // 不需要生产环境的 source map（减小dist文件大小，加速构建）
  devServer: {
    open: true,  // npm run serve后自动打开页面
    host: '0.0.0.0',  // 匹配本机IP地址(默认是0.0.0.0)
    port: 8081, // 开发服务器运行端口号
    proxy: {
      '/api': {
        target: 'http://192.168.1.80:9090', // 代理接口地址
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
        }
      }
    }
  },
  chainWebpack: (config) => {
    // 移除 prefetch 插件(针对生产环境首屏请求数进行优化)
    config.plugins.delete('prefetch')
    // 移除 preload 插件(针对生产环境首屏请求数进行优化)   preload 插件的用途：https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
    config.plugins.delete('preload')
    // 第1个参数：别名，第2个参数：路径  （设置路径别名）
    config.resolve.alias
      .set('@pages', resolve('./src/page'))
      .set('@router', resolve('./src/router'))
      .set('@store', resolve('./src/store'))
      .set('@utils', resolve('./src/utils'))
  },
  // 配置打包 js、css文件为.gz格式，优化加载速度  （参考：https://blog.csdn.net/qq_31677507/article/details/102742196）
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {

        performance: { // 生产环境构建代码文件超出以下配置大小会在命令行中显示警告
          hints: 'warning',
          // 入口起点的最大体积 整数类型（以字节为单位,默认值是：250000 (bytes)）
          maxEntrypointSize: 5000000,
          // 生成文件的最大体积 整数类型（以字节为单位,默认值是：250000 (bytes)）
          maxAssetSize: 3000000
          // // 只给出 js 文件的性能提示
          // assetFilter: function (assetFilename) {
          //   return assetFilename.endsWith('.js')
          // }
        }
      }
    }
  }
}