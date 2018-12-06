inject-html-webpack-plugin [![Build Status](https://travis-ci.org/ethikz/inject-html-webpack-plugin.svg?branch=master)](https://travis-ci.org/ethikz/inject-html-webpack-plugin) [![npm version](https://badge.fury.io/js/%40ethikz%2Finject-html-webpack-plugin.svg)](https://badge.fury.io/js/%40ethikz%2Finject-html-webpack-plugin)
===
[![NPM](https://nodei.co/npm/@ethikz/inject-html-webpack-plugin.png?compact=true)](https://nodei.co/npm/@ethikz/inject-html-webpack-plugin/)

Inspired by [inject-html-webpack-plugin](https://github.com/ali322/inject-html-webpack-plugin), this is a simple and efficient webpack plugin that injects script and style tags into your HTML.

Install
===

```javascript
npm install '@ethikz/inject-html-webpack-plugin' --save--dev
```

Usage
===

add the plugin in your webpack config

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

then add below placeholders into HTML file

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

- **transducer**: apply transducer to injected file's URL, accept prepended string or function that receives a file path as an argument and returns URL string as a result
- **filename**: HTML file path or array of paths to be injected
  + if injecting into a single file, just pass it as a string
    ```
    filename: './index.html'
    ```
  + if you want the plugin to inject into multiple files you can pass it an array
    ```
    filename: [
      './file.html',
      './file1.html',
      './file2.html',
      './file3.html'
    ]

    // or you can define a constant as an array and pass it in
    filename: arrayConst
    ```
- **chunks**: injected array of chunks
- **startJS**: start identifier where to inject script tag, *( eg: `<!-- start:js -->` )*
- **endJS**: end identifier where to inject script tag, *( eg: `<!-- end:js -->` )*
- **startCSS**: start identifier where to inject style tag, *( eg: `<!-- start:css -->` )*
- **endCSS**: end identifier where to inject style tag, *( eg: `<!-- end:css -->` )*
- **custom**: array of custom inject, like bundle time, accept objects contains below key/values,
    + start: inject start identifier
    + end: inject end identifier
    + content: injected content

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
