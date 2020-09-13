
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://192.168.1.80:9090',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  // target:'http://127.0.0.1:9099',
  // target:'http://192.168.1.80:9090',
  // publicPath:'./',
  // outputDir:'dist',
  // indexPath:'index2.html',
  // lintOnSave:false,
  // productionSourceMap:true,
  // chainWebpack:(config)=>{
  //   config.plugins.delete('prefetch');
  // }

}