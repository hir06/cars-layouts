const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');


const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);
server.use(favicon(__dirname + '/public/favicon.png'));
// the __dirname is the current directory from where the script is running
server.use(express.static(__dirname));
// send the user to index html page inspite of the url
server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

server.listen(port);