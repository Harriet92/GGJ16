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

        socket.on('disconnect', () => {
            onDisconnect(socket);
        });

        socket.on('chat message', msg =>{
             onChatMessage(socket, msg);
        })
    });

    var connectUser = () => {
        console.log('a user connected');
        connectedUsers++;
        io.emit('users', connectedUsers);
    }

    var onLogIn = (socket, username) => {
        console.log('User logged in: ' + username);
        socket.username = username;
        socket.join(lobbyChannel);
        io.to(socket.id).emit('update rooms', roomManager.roomsList);
        io.to(lobbyChannel).emit('join lobby', username);
    }

    var onDisconnect = (socket) => {
        console.log('user disconnected');
        connectedUsers--;
        io.to(lobbyChannel).emit('leave lobby', socket.username);
    }

    var onChatMessage = (socket, msg) => {
        console.log('message: ' + msg);
        console.log({
            username: socket.username,
            text: msg
        })
        io.to(lobbyChannel).emit('chat message', {
            nickname: socket.username,
            text: msg
        });
    }
}

