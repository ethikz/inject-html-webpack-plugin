/* eslint-disable global-require, prefer-destructuring */

const path = require( 'path' );
const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
const CompressionWebpackPlugin = require( 'compression-webpack-plugin' );
const FixStyleOnlyEntriesPlugin = require( 'webpack-fix-style-only-entries' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCSSPlugin = require( 'optimize-css-assets-webpack-plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const InjectHtmlPlugin = require( '../../' );
const baseWebpackConfig = require( './webpack.base.conf' );
const utils = require( './utils' );

const productionGzipExtensions = [
  'js',
  'css',
  'images'
];

function resolve( dir ) {
  return path.join( __dirname, '..', dir );
}

const webpackConfig = merge( baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true,
      usePostCSS: false
    })
  },
  devtool: false,
  output: {
    path: resolve( 'dist' ),
    filename: utils.assetsPath( 'js/[name].[chunkhash].js' ),
    chunkFilename: utils.assetsPath( 'js/[id].[chunkhash].js' )
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': 'production'
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath( 'css/[name].[hash].css' ),
      chunkFilename: utils.assetsPath( 'css/[id].[hash].css' )
    }),
    new OptimizeCSSPlugin({
      cssProcessor: require( 'cssnano' ),
      cssProcessorPluginOptions: {
        preset: [
          'default', {
            discardComments: {
              removeAll: true
            }
          }
        ]
      },
      cssProcessorOptions: {
        safe: true
      }
    }),
    new FixStyleOnlyEntriesPlugin(),
    new InjectHtmlPlugin({
      filename: './main.html',
      chunks: [
        'main',
        'styles'
      ],
      customInject: [{
        start: '<!-- start:bundle-time -->',
        end: '<!-- end:bundle-time -->',
        content: Date.now()
      }, {
        start: '<!-- start:other-script -->',
        end: '<!-- end:other-script -->',
        content: "<script type='text/template'><p>template</p></script>"
      }]
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './main.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        `\\.(${
          productionGzipExtensions.join( '|' )
        })$`
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        'default': {
          chunks: 'async',
          minSize: 30000,
          minChunks: 3,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          reuseExistingChunk: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          minChunks: 2,
          enforce: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
          output: {
            comments: false
          }
        }
      })
    ]
  }
});


if ( process.env.npm_config_report ) {
  const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;

  webpackConfig.plugins.push( new BundleAnalyzerPlugin() );
}

module.exports = webpackConfig;
