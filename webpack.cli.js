const sizeAnalyzer = require('webpack-bundle-size-analyzer')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')


const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: './src/lib/index.ts',
  target: 'node',
  mode: isDev ? 'development' : 'production',
  externals: [nodeExternals()],
  // devtool: 'inline-source-map',
  plugins: [
    new FilterWarningsPlugin({
      exclude: /Critical dependency: the request of a dependency is an expression/
    }),
    new sizeAnalyzer.WebpackBundleSizeAnalyzerPlugin(
      '.webpack.cli.txt'
    ),
    // new webpack.BannerPlugin({
    //   banner: "#!/usr/bin/env node",
    //   raw: true
    // })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compiler: 'ttypescript',
              configFile: 'tsconfig.json'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'geekTimeMongoDb',
    path: path.resolve(__dirname, 'dist'),
  },
};