/* eslint-disable no-undef */

import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import {
  expect
} from 'chai';
import InjectHtmlPlugin from '..';

const OUTPUT_PATH = path.join( __dirname, 'fixtures', 'dist' );

function createWebpack( INJECT_HTML, done ) {
  const compiler = webpack({
    entry: {
      main: path.join( __dirname, 'fixtures', 'entry.js' )
    },
    output: {
      path: OUTPUT_PATH,
      filename: '[name].min.js'
    },
    plugins: [
      new InjectHtmlPlugin({
        filename: INJECT_HTML,
        chunks: ['main']
      })
    ]
  }, ( err ) => {
    let html;
    let index;

    expect( err ).to.equal( null );

    if ( INJECT_HTML.constructor === Array ) {
      INJECT_HTML.forEach( ( file ) => {
        html = fs.readFileSync( file, 'utf8' );
        index = html.indexOf( '<script src="main.min.js"></script>' );
        expect( index ).to.be.above( 0 );
      });
    } else {
      html = fs.readFileSync( INJECT_HTML, 'utf8' );
      index = html.indexOf( '<script src="main.min.js"></script>' );
      expect( index ).to.be.above( 0 );
    }

    done();
  });

  return compiler;
}

describe( 'Inject Html Plugin', () => {
  it( 'should inject single html file correctly', ( done ) => {
    const INJECT_HTML = path.join( __dirname, 'fixtures', 'test.html' );

    createWebpack( INJECT_HTML, done() );
  });

  it( 'should inject multiple html files correctly', ( done ) => {
    const INJECT_HTML = [
      path.join( __dirname, 'fixtures', 'test.html' ),
      path.join( __dirname, 'fixtures', 'test1.html' )
    ];

    createWebpack( INJECT_HTML, done() );
  });
});
