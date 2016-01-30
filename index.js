'use strict';

var SocketServer = require('./app/socketServer.js');
var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
module.exports.http = http;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

http.listen(port, '0.0.0.0', () => {
    console.log('listening on *:' + port);
    SocketServer.init(http);
});
