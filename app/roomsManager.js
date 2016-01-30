'use strict';

var _ = require('lodash');

class RoomManager {
    constructor(roomsNo, usersInRoomNo) {
        this.roomsNumber = roomsNo;
        this.maxUsersInRoom= usersInRoomNo;
        this.rooms = this.initRooms();
    }
    
    get roomsNo() {
        return this.roomsNumber;
    }
    
    get roomsList() {
        let result = []
        _.each(this.rooms, room => {
            result.push({
                name: room.name,
                id: room.id,
                usersCount: room.users.length,
                maxUsers: this.maxUsersInRoom
            });
        });
        return result;
    }
    
    initRooms() {
        var rooms = [];
        _.times(this.roomsNumber, (i) => {
            rooms.push({
                id: i,
                name: 'Room'+i,
                users: []
            });
        });
        return rooms;
    }
    
    joinRoom(roomId, clientId) {
        if(this.rooms[roomId].users.length == this.maxUsersInRoom){
            return false;
        } else {
            this.rooms[roomId].users.push(clientId);
        }
    }
    
    leaveRoom(roomId, clientId) {
        _.pull(this.rooms[roomId].users, clientId);
    }
    
    usersInRoomCount(roomId) {
        return this.rooms[roomId].users.length;
    }   
}

module.exports = RoomManager;