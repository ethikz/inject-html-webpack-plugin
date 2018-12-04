/* eslint-disable no-empty-function, no-param-reassign, prefer-destructuring,
  no-shadow, no-unused-expressions, consistent-return */

const fs = require( 'fs-extra' );
const filter = require( 'lodash/filter' );
const includes = require( 'lodash/includes' );
const isString = require( 'lodash/isString' );
const isFunction = require( 'lodash/isFunction' );
const {
  extname
} = require( 'path' );

function leadingWhitespace( str ) {
  return str.match( /^\s*/ )[0];
}

function assetsOfChunks( chunks, selected ) {
  const assets = {
    js: [],
    css: []
  };

  filter( chunks, chunk => includes( selected, chunk.name ) ).forEach( ( chunk ) => {
    chunk.files.forEach( ( file ) => {
      const ext = extname( file ).replace( '.', '' );

      assets[ext] && assets[ext].push( file );
    });
  });

  return assets;
}

function injectWithinByIndentifier(
  html,
  startIdentifier,
  endIdentifier,
  content,
  purified
) {
  const start = html.indexOf( startIdentifier );
  const end = html.indexOf( endIdentifier );

  if ( start < 0 || end < 0 ) {
    return html;
  }

  const previousInnerContent = html.substring( start + startIdentifier.length, end );
  let indent = leadingWhitespace( previousInnerContent );

  indent = indent.replace( /(\n[\s|\t]*\r*\n)/g, '\n' );

  const injected = Array.isArray( content ) ? content.slice() : [content];

  purified
    ? injected.unshift( html.substr( 0, start ) )
    : injected.unshift( html.substr( 0, start + startIdentifier.length ) );

  purified
    ? injected.push( html.substr( end + endIdentifier.length ) )
    : injected.push( html.substr( end ) );

  return injected.join( indent );
}

function injectWithin( html, content, head = true ) {
  const before = head ? html.indexOf( '</head>' ) : html.indexOf( '</body>' );

  if ( before < 0 ) {
    return html;
  }

  const injected = Array.isArray( content ) ? content.slice() : [content];

  injected.unshift( html.substr( 0, before ) );
  injected.push( html.substr( before ) );

  return injected.join( '\n' );
}

function applyTransducer( originURL, transducer ) {
  let url = originURL;

  if ( typeof transducer === 'string' ) {
    url = transducer + originURL;
  } else if ( typeof transducer === 'function' ) {
    typeof transducer( originURL ) === 'string' && ( url = transducer( originURL ) );
  }

  return url;
}

class InjectHtmlWebpackPlugin {
  constructor( options ) {
    this.options = options;
    options.chunks = options.chunks || [];
    options.more = options.more || {};
    options.auto = options.auto || false;
    options.startJS = options.startJS || '<!-- start:js -->';
    options.endJS = options.endJS || '<!-- end:js -->';
    options.startCSS = options.startCSS || '<!-- start:css -->';
    options.endCSS = options.endCSS || '<!-- end:css -->';
    options.transducer = options.transducer || '';
    options.custom = options.custom || [];

    this.running = false;
  }

  apply( compiler ) {
    const that = this;
    const options = that.options;
    let filename = options.filename;
    const output = isString( options.output ) || isFunction( options.output )
      ? options.output
      : false;
    const purified = !!output;
    const selected = options.chunks;
    const more = options.more;
    const transducer = options.transducer;
    const autoInject = options.auto;
    const startInjectJS = options.startJS;
    const endInjectJS = options.endJS;
    const startInjectCSS = options.startCSS;
    const endInjectCSS = options.endCSS;
    const customInject = options.custom;
    const emit = ( compilation, callback = () => {}) => {
      const chunks = compilation.chunks;
      let html;

      if ( that.running || !options.filename ) {
        callback();

        return;
      }

      const assets = assetsOfChunks( chunks, selected );

      const jsLabel = assets.js.map( v => `<script src="${applyTransducer( v, transducer )}"></script>` );

      const cssLabel = assets.css.map( v => `<link rel="stylesheet" href="${applyTransducer( v, transducer )}"/>` );

      if ( more ) {
        if ( Array.isArray( more.js ) ) {
          for ( let i = 0; i < more.js.length; i += 1 ) {
            jsLabel.unshift( `<script src="${more.js[i]}"></script>` );
          }
        }

        if ( Array.isArray( more.css ) ) {
          for ( let j = 0; j < more.css.length; j += 1 ) {
            cssLabel.unshift(
              `<link rel="stylesheet" href="${more.css[j]}"/>`
            );
          }
        }
      }

      if ( isString( output ) && output ) {
        try {
          fs.copySync( filename, output );

          filename = output;
        } catch ( e ) {
          compilation.errors.push(
            new Error( 'InjectHtmlWebpackPlugin copy filename to output failed' )
          );
        }
      }

      function injector( filename ) {
        try {
          html = fs.readFileSync( filename, 'utf8' );
        } catch ( e ) {
          compilation.errors.push(
            new Error( 'InjectHtmlWebpackPlugin read filename failed' )
          );

          callback();

          return;
        }

        if ( autoInject ) {
          html = injectWithin( html, jsLabel, false );
          html = injectWithin( html, cssLabel );
        } else {
          html = injectWithinByIndentifier(
            html,
            startInjectJS,
            endInjectJS,
            jsLabel,
            purified
          );

          html = injectWithinByIndentifier(
            html,
            startInjectCSS,
            endInjectCSS,
            cssLabel,
            purified
          );
        }

        customInject.forEach( ( inject ) => {
          const startIdentifier = inject.start;
          const endIdentifier = inject.end;
          const content = inject.content;

          if ( !startIdentifier || !endIdentifier ) {
            return;
          }

          html = injectWithinByIndentifier(
            html,
            startIdentifier,
            endIdentifier,
            content,
            purified
          );
        });

        return html;
      }

      if ( isFunction( output ) ) {
        output( filename, injector );
      } else if ( filename.constructor === Array ) {
        filename.forEach( ( file ) => {
          fs.writeFileSync( file.toString(), injector( file.toString() ) );
        });
      } else {
        fs.writeFileSync( filename, injector( filename ) );
      }

      that.running = true;

      callback();
    };

    if ( compiler.hooks ) {
      compiler.hooks.emit.tap( 'InjectHtmlWebpackPlugin', emit );
    } else {
      compiler.plugin( 'emit', emit );
    }
  }
}

module.exports = InjectHtmlWebpackPlugin;
