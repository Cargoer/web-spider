module.exports = {
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
    }
  }
}