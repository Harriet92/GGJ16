'use strict';

var RoomManager = require('./roomsManager.js');

var io;
var roomManager = new RoomManager(5, 12);
var connectedUsers = 0;
var lobbyChannel = 'lobby';

module.exports.init = (http) => {
    io = require('socket.io')(http);

    io.on('connection', socket => {
        connectUser();

        socket.on('log in', username => {
            onLogIn(socket, username);
        });

        socket.on('disconnect', onDisconnect);

        socket.on('chat message', onChatMessage);



    });
}


var connectUser = () => {
    console.log('a user connected');
    connectedUsers++;
    io.emit('users', connectedUsers);
}

var onLogIn = (socket, username) => {
    socket.username = username;
    socket.join(lobbyChannel);
    io.broadcast.to(lobbyChannel).emit('join lobby', {
        username: username,
        id: socket.id
    });
}

var onDisconnect = () => {
    console.log('user disconnected');
    connectedUsers--;
    io.emit('users', connectedUsers);
}

var onChatMessage = (msg) => {
    console.log('message: ' + msg);
    io.broadcast.to(lobbyChannel).emit('chat message', msg);
}