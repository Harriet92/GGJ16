'use strict';

var RoomManager = require('./roomsManager.js');
var GamesManager = require('./gamesManager.js');
var _ = require('lodash');

var roomsCount = 5;
var usersPerRoom = 12;
var maxScore = 100;

var io;
var roomManager = new RoomManager(roomsCount, usersPerRoom);
var gamesManager = new GamesManager(roomsCount, maxScore);
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
        });

        socket.on('ready', () => {
            onReady(socket);
        });

        socket.on('change score', msg => {
            onChangeScore(socket, msg);
        });
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
    io.to(socket.id).emit('game init', gamesManager.getGame(id));
    socket.broadcast.to(id).emit('joined room', socket.username);
    io.emit('update rooms', roomManager.roomsList);
}

var onLeaveRoom = (socket) => {
    roomManager.leaveRoom(socket.channel, socket.id);
    socket.broadcast.to(socket.channel).emit('user left', socket.username);
    socket.channel = lobbyChannel;
    io.emit('update rooms', roomManager.roomsList);
}

var onReady = socket => {
    if (roomManager.setAsReady(socket.channel, socket.id)) {
        io.to(socket.channel).emit('start game');
    } else {
        io.to(socket.channel).emit('team update', {
            users: roomManager.getUsers(socket.channel),
            id: socket.id
        }); 
    }
}

var onChangeScore = (socket, msg) => {
    gamesManager.addScore(socket.channel, msg.score,
        _.find(roomManager.getUsers(socket.channel).team));
    if (gamesManager.gameEnd(socket.channel)) {
        io.to(socket.channel).emit('end game');
        gamesManager.createGame(socket.channel);
    }
}
