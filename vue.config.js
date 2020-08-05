
  module.exports = {
    devServer:{
      host:'localhost',
      port:8080,
      proxy:{
        '/api':{
          target:'http://192.168.1.80:9090',
          changeOrigin:true,
          pathRewrite:{
            '/api':''
          }
        }
      }
    },
    // publicPath:'../../',
    // publicPath:'/app',
    // outputDir:'dist',
    // indexPath:'index2.html',
    // lintOnSave:false,
    // productionSourceMap:true,
    // chainWebpack:(config)=>{
    //   config.plugins.delete('prefetch');
    // }
   
  }