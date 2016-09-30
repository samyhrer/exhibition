import React from 'react';

const path = require('path');
const fs = require('fs');
const assets = JSON.parse(
  fs.readFileSync(
    path.resolve('build', 'webpack-assets.json'),
  'utf8'));

class HtmlComponent extends React.Component {
  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          { this.props.head.title.toComponent() }
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <link rel="stylesheet" href={assets.bundle.css}/>
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
          <script src={assets.bundle.js} defer></script>
        </body>
      </html>
    )
  }
}

export default HtmlComponent;