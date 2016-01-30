'use strict';

var _ = require('lodash');

class RoomManager {
    constructor(roomsNo, usersInRoomNo) {
        this.roomsNumber = roomsNo;
        this.maxUsersInRoom= usersInRoomNo;
        this.initRooms();
    }
    
    get roomsNo() {
        return this.roomsNumber;
    }

    initRooms() {
        this.rooms = {};
        _.each(this.roomsNumber, (i) => {
            this.rooms[i] = [];
        });
    }
    
    joinRoom(roomId, clientId) {
        if(this.rooms[roomId].length == this.maxUsersInRoom){
            return false;
        } else {
            this.rooms[roomId].push(clientId);
        }
    }
    
    leaveRoom(roomId, clientId) {
        _.pull(this.rooms[roomId], clientId);
    }
    
    usersInRoomCount(roomId) {
        return this.rooms[roomId].length;
    }   
}

module.exports = RoomManager;