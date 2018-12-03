/* eslint-disable no-else-return, guard-for-in, func-names, no-param-reassign,
  no-restricted-syntax, global-require, import/no-unresolved */

const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const packageConfig = require( '../../package.json' );

exports.assetsPath = function( _path ) {
  return path.posix.join( '', _path );
};

exports.cssLoaders = function( options ) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };


  function generateLoaders( loader, loaderOptions ) {
    const loaders = options.usePostCSS ? [ cssLoader, postcssLoader ] : [cssLoader];

    if ( loader ) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    return [
      MiniCssExtractPlugin.loader
    ].concat( loaders );
  }

  const sassOptions = {
    includePaths: [
      '../src/styles'
    ],
    data: '@import "main.scss";',
    outputStyle: 'compressed',
    modules: true,
    importLoaders: 2
  };

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders( 'less' ),
    sass: generateLoaders( 'sass', Object.assign({
      indentedSyntax: true
    }, sassOptions ) ),
    scss: generateLoaders( 'sass', sassOptions ),
    stylus: generateLoaders( 'stylus' ),
    styl: generateLoaders( 'stylus' )
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function( options ) {
  const output = [];
  const loaders = exports.cssLoaders( options );

  for ( const extension in loaders ) {
    const loader = loaders[extension];

    output.push({
      test: new RegExp( `\\.${extension}$` ),
      use: loader
    });
  }

  return output;
};

exports.createNotifierCallback = () => {
  const notifier = require( 'node-notifier' );

  return ( severity, errors ) => {
    if ( severity !== 'error' ) {
      return;
    }

    const error = errors[0];
    const filename = error.file && error.file.split( '!' ).pop();

    notifier.notify({
      title: packageConfig.name,
      message: `${severity}: ${error.name}`,
      subtitle: filename || ''
    });
  };
};
