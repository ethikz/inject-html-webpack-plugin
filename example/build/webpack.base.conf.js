/* eslint-disable global-require */

const path = require( 'path' );
const StylelintPlugin = require( 'stylelint-webpack-plugin' );
const utils = require( './utils' );

function resolve( dir ) {
  return path.join( __dirname, '..', dir );
}

const createLintingRule = () => ({
  test: /\.(js)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [
    resolve( './src' )
  ],
  options: {
    formatter: require( 'eslint-friendly-formatter' ),
    emitWarning: true,
    configFile: resolve( '../.eslintrc.js' )
  }
});

module.exports = {
  context: path.resolve( __dirname, '../' ),
  entry: {
    main: resolve( './src/js/main.js' ),
    styles: resolve( './src/styles/main.scss' )
  },
  output: {
    path: resolve( './dist' ),
    filename: '[name].js',
    publicPath: ''
  },
  resolveLoader: {
    modules: [
      resolve( './node_modules' ),
      resolve( '../node_modules' )
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.scss'
    ],
    modules: [
      resolve( './node_modules' ),
      resolve( '../node_modules' )
    ]
  },
  module: {
    rules: [
      ...( [createLintingRule()] ),
      {
        test: /\.js?$/,
        loader: [
          'babel-loader'
        ],
        include: [
          resolve( './src' )
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath( 'img/[name].[hash:7].[ext]' )
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath( 'media/[name].[hash:7].[ext]' )
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath( 'fonts/[name].[hash:7].[ext]' )
        }
      }
    ]
  },
  plugins: [
    new StylelintPlugin({
      configFile: resolve( '../.stylelintrc.js' ),
      files: [
        'src/**/*.scss'
      ],
      maxWarnings: 0,
      syntax: 'scss'
    })
  ]
};
