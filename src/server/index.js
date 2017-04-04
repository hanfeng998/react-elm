var express = require('express');
var proxyMiddleware = require('http-proxy-middleware')
var config = require('./config')

var server = express()
var context = config.dev.context
var proxypath = config.dev.proxypath

var options = {
    target: proxypath,
    changeOrigin: true,
}

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

if (context.length) {
    server.use(proxyMiddleware(context, options))
}



server.use(proxyMiddleware('/payapi', {
    target: 'https://pay.ele.me',
    changeOrigin: true,
}))
server.use(proxyMiddleware('/m.ele.me@json', {
    target: 'https://crayfish.elemecdn.com',
    changeOrigin: true,
}))

server.listen("8000", function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://192.168.1.103:' + 8000
    console.log('Listening at ' + uri + '\n')
})
