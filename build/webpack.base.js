const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

// 多页面打包入口
const { entry, outputHtml } = (function MPA() {
  const entry = {}
  const outputHtml = []
  const files = glob.sync(path.join(__dirname, '../src/pages/*/index.ts'))

  files.forEach(file => {
    const match = file.match(/\/src\/pages\/(.*)\/index\.ts/)
    const entryName = match && match[1]
    if (!entryName) return
    entry[entryName] = file
    const cfg = {
      template: path.join(__dirname, `../src/pages/${entryName}/index.html`),
      filename: `${entryName}.html`,
      chunks: isProd ? ['commons', entryName] : [entryName],
      inject: true,
      inlineSource: '.css$',
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }
    outputHtml.push(new HtmlWebpackPlugin(cfg))
  })

  if (isProd) {
    outputHtml.push(new MiniCssExtractPlugin({
      filename: 'assets/style/[name]_[contenthash:8].css',
    }))
  }

  return { entry, outputHtml }
})()

const src = path.join(__dirname, '../src')

module.exports = {
  entry,
  resolve: {
    extensions: ['.min.js', '.js', '.ts',],  // 优先找.min.js压缩版本（自己组建或者三方组件）
    alias: {
      utils: path.resolve(__dirname, '../src/utils/'),
      config: path.resolve(__dirname, '../src/config/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: src,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        include: src,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        include: src,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',   // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')()
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 62, // 1rem=多少像素
              remPrecision: 8,  // 转换保留几位小数
            }
          },
          'sass-loader',  // 将 Sass 编译成 CSS
        ]
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/static'),
        to: path.resolve(__dirname, '../dist/static')
      }
    ]),
    //忽略 moment 下的 ./locale 目录
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    ...outputHtml,
  ]
}