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

        socket.on('chat message', msg => {
            onChatMessage(socket, msg);
        });

        socket.on('join room', id => {
            onJoinRoom(id, socket);
        });

        socket.on('leave room', () => {
            onLeaveRoom(socket);
        })

        socket.on('ready', () => {
            onReady(socket);
        })
    });
}


var connectUser = () => {
    console.log('a user connected');
    connectedUsers++;
    io.emit('users', connectedUsers);
}

var onLogIn = (socket, username) => {
    if (!socket.username) {
        console.log('User logged in: ' + username);
        socket.username = username;
        socket.join(lobbyChannel);
        socket.channel = lobbyChannel;
        io.to(socket.id).emit('update rooms', roomManager.roomsList);
        io.to(lobbyChannel).emit('join lobby', username);
    }
}

var onDisconnect = (socket) => {
    console.log('user disconnected');
    connectedUsers--;
    io.to(socket.channel).emit('leave lobby', socket.username);
}

var onChatMessage = (socket, msg) => {
    console.log(socket.username + ': ' + msg + ' from: ' + socket.channel);
    socket.broadcast.to(socket.channel).emit('chat message', {
        nickname: socket.username,
        text: msg
    });
}

var onJoinRoom = (id, socket) => {
    let res = roomManager.joinRoom(id, socket.id, socket.username);
    socket.join(id);
    socket.channel = id;
    io.to(socket.id).emit('game init', res || 'Connected successfully');
    socket.broadcast.to(id).emit('joined room', socket.username);
    io.emit('update rooms', roomManager.roomsList);
    // TODO: collect game data and send it back    
}

var onLeaveRoom = (socket) => {
    roomManager.leaveRoom(socket.channel, socket.id);
    socket.broadcast.to(socket.channel).emit('user left', socket.username);
    socket.channel = lobbyChannel;
    io.emit('update rooms', roomManager.roomsList);
}

var onReady = socket => {
    
}