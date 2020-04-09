const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const baseConf = require('./webpack.base')

const src = path.join(__dirname, '../src')

const conf = {
  mode: 'development',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        include: src,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              esModule: false,
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        include: src,
        use: 'file-loader',
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    function() {},
  ],
  devServer: {
    hot: true,
    stats: 'errors-only',
    contentBase: path.resolve(__dirname, '../src/'),
    port: 7001,
    host: '0.0.0.0',
    before(app, server, compiler) {  // html 热更新
      const watchFiles = ['.html']
      compiler.hooks.done.tap('done', () => {
        const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes)
        if (
          this.hot &&
          changedFiles.some(filePath => watchFiles.includes(path.parse(filePath).ext))
        ) {
          server.sockWrite(server.sockets, 'content-changed')
        }
      })
    },
    proxy: {
      '/api/**': {
        target: 'http://fk.tuqiangol.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  devtool: 'source-map',
}

module.exports = merge(baseConf, conf)