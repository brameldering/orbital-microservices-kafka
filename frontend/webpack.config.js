const path = require('path');
var CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  // entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    // the following fixes the error in Chrome DevTools Javascript source map
    devtoolModuleFilenameTemplate: (info) =>
      'file:///' + path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  /** "target"
   * setting "node" as target app (server side), and setting it as "web" is
   * for browser (client side). Default is "web"
   */
  target: 'web',
  devServer: {
    port: 3000,
    /** "static"
     * This property tells Webpack what static file it should serve
     */
    static: ['./dist'],
    /** "open"
     * opens the browser after server is successfully started
     */
    open: true,
    /** "hot"
     * enabling and disabling HMR. takes "true", "false" and "only".
     * "only" is used if enable Hot Module Replacement without page
     * refresh as a fallback in case of build failures
     */
    hot: true,
    /** "liveReload"
     * disable live reload on the browser. "hot" must be set to false for this to work
     */
    liveReload: true,
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')],
  },
  resolve: {
    /** "extensions"
     * If multiple files share the same name but have different extensions, webpack will
     * resolve the one with the extension listed first in the array and skip the rest.
     * This is what enables users to leave off the extension when importing
     */
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    modules: [path.join(__dirname, 'node_modules')],
  },
  module: {
    /** "rules"
     * This says - "Hey webpack compiler, when you come across a path that resolves to a '.js or .jsx'
     * file inside of a require()/import statement, use the babel-loader to transform it before you
     * add it to the bundle. And in this process, kindly make sure to exclude node_modules folder from
     * being searched"
     */
    rules: [
      {
        test: /\.(js|jsx)$/, //kind of file extension this rule should look for and apply in test
        exclude: /node_modules/, //folder to be excluded
        // use:  'babel-loader' //loader which we are going to use
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        use: ['file-loader?name=[name].[ext]'],
      },
    ],
  },
  plugins: [
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // favicon: './public/favicon.ico', // this is not needed when favicon.ico in index.html is /favicon.ico
      filename: 'index.html',
    }),
    new WebpackManifestPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
