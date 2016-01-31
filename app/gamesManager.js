'use strict';

var _ = require('lodash');
var teamPositive = 2;
var teamNegative = 1;

class GamesManager {
    construtor(roomsCount, maxPoints) {
        this.games = {}
        this.maxPoints = maxPoints;
        this.initGames(roomsCount);
    }

    static get TeamPositive() {
        return 2;
    }

    static get TeamNegative() {
        return 1;
    }

    getGame(roomId) {
        return this.games[roomId];
    }

    initGames(roomsCount) {
        _.times(roomsCount, i => {
            this.createGame(i);
        });
    }

    createGame(roomId) {
        this.games[roomId] = {
            score: 0,
            seed: (Math.random() * 1000 | 0) + 1,
            bpm: '',
            songId: ''
        }
    }

    addScore(roomId, score, team) {
        this.games[roomId].score += score * (team == teamNegative ? -1 : 1);
    }

    gameEnd(roomId) {
        return this.games[roomId].score >= this.maxPoints || this.games[roomId].score <= -this.maxPoints;
    }

    winningTeam(roomId) {
        if (this.games[roomId].score == 0) {
            return -1;
        } else {
            return this.games[roomId].score < 0 ? teamPositive : teamNegative;
        }
    }

}

module.exports = GamesManager;