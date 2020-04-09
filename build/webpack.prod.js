const webpack = require('webpack')
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const baseConf = require('./webpack.base')

const src = path.join(__dirname, '../src')

const conf = {
  mode: 'production',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'assets/js/[name]_[chunkhash:8].js',
    chunkFilename: 'assets/js/[name].[chunkhash:8].js', // 异步js import('./jqueyr.js')
    publicPath: process.env.NODE_PUBLIC_PATH || '/',  // cdn
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        include: src,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name]_[hash:8].[ext]',
              limit: 10240,
              esModule: false,
            }
          },
          {
            loader: 'image-webpack-loader',
          },
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        include: src,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name]_[hash:8].[ext]'
            }
          },
        ]
      }
    ],
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),  // 基于postcss压缩
    }),
    new HardSourceWebpackPlugin(),
    new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'echarts',
            entry: 'https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js',
            global: 'echarts',
          },
        ]
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/](moment|)[\\/]/,
          name: 'commons',
          chunks: 'all',
          minChunks: 1,  // 超过1次调用提取到commons.js
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true
      })
    ]
  },
}

module.exports = merge(baseConf, conf)