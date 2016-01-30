'use strict';

var _ = require('lodash');

class RoomManager {
    constructor(roomsNo, usersInRoomNo) {
        this.roomsNumber = roomsNo;
        this.maxUsersInRoom = usersInRoomNo;
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
                name: 'Room' + i,
                users: []
            });
        });
        return rooms;
    }

    joinRoom(roomId, clientId, username) {
        if (roomId < 0 || roomId >= this.roomsNo)
            return 'Wrong room id!';
        if (this.rooms[roomId].users.length == this.maxUsersInRoom) {
            return 'Room is full!';
        } else {
            this.rooms[roomId].users.push({
                username: username,
                id: clientId,
                isReady: true
            });
            return null;
        }
    }

    leaveRoom(roomId, clientId) {
        _.remove(this.rooms[roomId].users, { id: clientId});
    }

    usersInRoomCount(roomId) {
        return this.rooms[roomId].users.length;
    }
    
    roomIsReady(roomId) {
        return _.every(this.roomsList[roomId].users, { isReady: true});
    }
    
    setAsReady(roomId, clientId) {
        var user = _.find(this.roomsList[roomId].users, { id: clientId});
        if(user){
            user.isReady = true;
        }
    }
}

module.exports = RoomManager;