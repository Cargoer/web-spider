module.exports = {
  publicPath: './',
  devServer: {
    host: "0.0.0.0",
    port: "8080",
    open: true,
    proxy: {
      '/wiki': {
        target: 'https://justdance.fandom.com',
        ws: false,
        changeOrigin: true,
      },
      '/weiyinfu': {
        target: 'https://github.com',
        ws: false,
        changeOrigin: true,
      },
      '/justdance': {
        target: 'https://static.wikia.nocookie.net',
        ws: false,
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:8085/api/',
        // ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}