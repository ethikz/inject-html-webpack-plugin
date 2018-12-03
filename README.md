inject-html-webpack-plugin [![Build Status](https://travis-ci.org/ethikz/inject-html-webpack-plugin.svg?branch=master)](https://travis-ci.org/ethikz/inject-html-webpack-plugin) [![npm version](https://badge.fury.io/js/@ethikz/inject-html-webpack-plugin.svg)](https://badge.fury.io/js/@ethikz/inject-html-webpack-plugin)
===
[![NPM](https://nodei.co/npm/@ethikz/inject-html-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@ethikz/inject-html-webpack-plugin/)

Inspired by [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin), this is a simple and efficient Webpack plugin that injects script and style tags into your html.

Install
===

```javascript
npm install '@ethikz/inject-html-webpack-plugin' --save--dev
```

Usage
===

add plugin in your webpack config

```javascript
import InjectHtmlPlugin from '@ethikz/inject-html-webpack-plugin';

module.exports = {
  entry: {
    main: './index.js'
  },
  module: {
    loaders: [
      ...
    ]
  },
  output: {
    path: './dist',
    filename: '[name].min.js'
  },
  plugins: [
    new InjectHtmlPlugin({
      filename: './index.html',
      chunks:[
        'index'
      ],
      transducer: 'http://cdn.example.com',
      custom: [{
        start: '<!-- start:bundle-time -->',
        end: '<!-- end:bundle-time -->',
        content: Date.now()
      }]
    })
  ]
};
```

then add below placeholders into html file

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!-- start:css -->
    <!-- end:css -->

    <!-- start:bundle-time -->
    <!-- end:bundle-time -->
  </head>

  <body>
    <!-- start:js -->
    <!-- end:js -->
  </body>
</html>
```

Plugin Options
===

- **transducer**: apply transducer to injected file's url, accept prepended string or function that receives file path as argument and returns url string as result
- **filename**: html file path or array of paths to be injected
- **chunks**: injected array of chunks
- **startJS**: start indentifier where to inject script tag, (eg: `<!-- start:js -->` )
- **endJS**: end indentifier where to inject script tag, (eg: `<!-- end:js -->` )
- **startCSS**: start indentifier where to inject style tag, (eg: `<!-- start:css -->` )
- **endCSS**: end indentifier where to inject style tag, (eg: `<!-- end:css -->` )
- **custom**: array of custom inject, like bundle time, accept objects contains below key/values,
    + start: inject start identifier
    + end: inject end identifier
    + content: injected content

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
