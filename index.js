'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var connectedUsers;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', socket => {
    console.log('a user connected');
    connectedUsers++;
    io.emit('users', connectedUsers);
    socket.on('disconnect', function () {
        console.log('user disconnected');
        connectedUsers--;
        io.emit('users', connectedUsers);
    });
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    connectedUsers = 0;
    console.log('listening on *:' + port);
});
