/* eslint-disable no-console, no-shadow */

require( './check-versions' )();

const ora = require( 'ora' );
const rm = require( 'rimraf' );
const path = require( 'path' );
const chalk = require( 'chalk' );
const webpack = require( 'webpack' );
const webpackConfig = require( './webpack.prod.conf' );

const spinner = ora( 'building for production...' );

spinner.start();

rm( path.join( './dist', '' ), ( err ) => {
  if ( err ) {
    throw err;
  }

  webpack( webpackConfig, ( err, stats ) => {
    spinner.stop();

    if ( err ) {
      throw err;
    }

    process.stdout.write( `${stats.toString({
      colors: true,
      modules: false,
      // if you are using ts-loader, setting this to true will make typescript
      // errors show up during build
      children: false,
      chunks: false,
      chunkModules: false
    })}\n\n` );

    if ( stats.hasErrors() ) {
      console.log( chalk.red( '  Build failed with errors.\n' ) );
      process.exit( 1 );
    }

    console.log( chalk.cyan( '  Build complete.\n' ) );
    console.log( chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ) );
  });
});
