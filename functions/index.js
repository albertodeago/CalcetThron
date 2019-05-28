// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


/* 
    Sample game object
    const game = {
        blueKeeperAutogoals: 0,
        blueKeeperGoals: 1,
        blueStrikerAutogoals: 0,
        blueStrikerGoals: 4,
        *blueTeam: {
        *    keeper: 2,
        *    striker: 2
        *},
        creationDate: 7,
        redKeeperAutogoals: 1,
        redKeeperGoals: 3,
        redStrikerAutogoals: 0,
        redStrikerGoals: 4,
        *redTeam: {
        *    keeper: 2,
        *    striker: 3
        *},
        result: {
            blue: 6,
            red: 7
        }
    }
*/
/*
    This is the kind of object to return (update)
    const enrichedUser = {
        id: id
        played: 0,
        won: 0,
        lost: 0,
        winRate: "0%",
        playedGoalkeeper: 0,
        wonGoalkeeper: 0,
        lostGoalkeeper: 0,
        winRateGoalkeeper: "0%",
        playedStriker: 0,
        wonStriker: 0,
        lostStriker: 0,
        winRateStriker: "0%",
        goalDone: 0,
        goalReceived: 0,
        autogoalDone: 0
    };
*/

/**
 * When a match is inserted, update the rankings value of players.
 */
exports.updateRankings = functions.firestore
    .document('games/{gameId}')
    .onCreate(async(snap, context) => {
        // Get an object representing the document
        const newGame = snap.data();
        console.log("onCreation new Game " + newGame.creationDate)

        // create the model to update the db value
        const userRanking = {
            id: null,
            played: 0,
            won: 0,
            lost: 0,
            winRate: "0%",
            playedGoalkeeper: 0,
            wonGoalkeeper: 0,
            lostGoalkeeper: 0,
            winRateGoalkeeper: "0%",
            playedStriker: 0,
            wonStriker: 0,
            lostStriker: 0,
            winRateStriker: "0%",
            goalDone: 0,
            goalReceived: 0,
            autogoalDone: 0
        }

        // get ranking of the game players
        const db = admin.firestore()
        const rankingsCollection = db.collection("rankings")

        const blueKeeperPromise = rankingsCollection.doc(newGame.blueTeam.keeper).get();
        const blueStrikerPromise = rankingsCollection.doc(newGame.blueTeam.striker).get();
        const redKeeperPromise = rankingsCollection.doc(newGame.redTeam.keeper).get();
        const redStrikerPromise = rankingsCollection.doc(newGame.redTeam.striker).get();

        console.log("Getting ranking of players " + newGame.blueTeam.keeper + " " + newGame.blueTeam.striker + " " + newGame.redTeam.keeper + " " + newGame.redTeam.striker);
        const results = await Promise.all([blueKeeperPromise, blueStrikerPromise, redKeeperPromise, redStrikerPromise]);

        console.log("Got ranking of player " + results.toString());
        const blueKeeper = results[0].data() ? results[0].data() : Object.assign({}, userRanking, { id: newGame.blueTeam.keeper });
        const blueStriker = results[1].data() ? results[1].data() : Object.assign({}, userRanking, { id: newGame.blueTeam.striker });
        const redKeeper = results[2].data() ? results[2].data() : Object.assign({}, userRanking, { id: newGame.redTeam.keeper });
        const redStriker = results[3].data() ? results[3].data() : Object.assign({}, userRanking, { id: newGame.redTeam.striker });

        /* we got the players ranking objects, make the calculation to update values and then save it */

        // first of all, update the amount of game played
        blueKeeper.played += 1;
        blueKeeper.playedGoalkeeper += 1;
        blueStriker.played += 1;
        blueStriker.playedStriker += 1;
        redKeeper.played += 1;
        redKeeper.playedGoalkeeper += 1;
        redStriker.played += 1;
        redStriker.playedStriker += 1;

        // update the amount of win / lost
        if (newGame.result.blue === 7) {
            // blue team won
            blueKeeper.won += 1;
            blueKeeper.wonGoalkeeper += 1;
            blueStriker.won += 1;
            blueStriker.wonStriker += 1;
            redKeeper.lost += 1;
            redKeeper.lostGoalkeeper += 1;
            redStriker.lost += 1;
            redStriker.lostStriker += 1;
        } else {
            // red team won
            redKeeper.won += 1;
            redKeeper.wonGoalkeeper += 1;
            redStriker.won += 1;
            redStriker.wonStriker += 1;
            blueKeeper.lost += 1;
            blueKeeper.lostGoalkeeper += 1;
            blueStriker.lost += 1;
            blueStriker.lostStriker += 1;
        }

        // update win rates
        blueKeeper.winRate = Math.round(blueKeeper.won / blueKeeper.played * 100) + "%"
        blueStriker.winRate = Math.round(blueStriker.won / blueStriker.played * 100) + "%"
        redKeeper.winRate = Math.round(redKeeper.won / redKeeper.played * 100) + "%"
        redStriker.winRate = Math.round(redStriker.won / redStriker.played * 100) + "%"
            // update win rates for specific roles
        blueKeeper.winRateGoalkeeper = Math.round(blueKeeper.wonGoalkeeper / blueKeeper.playedGoalkeeper * 100) + "%"
        blueStriker.winRateStriker = Math.round(blueStriker.wonStriker / blueStriker.playedStriker * 100) + "%"
        redKeeper.winRateGoalkeeper = Math.round(redKeeper.wonGoalkeeper / redKeeper.playedGoalkeeper * 100) + "%"
        redStriker.winRateStriker = Math.round(redStriker.wonStriker / redStriker.playedStriker * 100) + "%"

        // update goals / autogoals
        blueKeeper.goalDone = blueKeeper.goalDone + newGame.blueKeeperGoals;
        blueKeeper.autogoalDone = blueKeeper.autogoalDone + newGame.blueKeeperAutogoals;
        blueKeeper.goalReceived = blueKeeper.goalReceived + newGame.result.red;
        blueStriker.goalDone = blueStriker.goalDone + newGame.blueStrikerGoals;
        blueStriker.autogoalDone = blueStriker.autogoalDone + newGame.blueStrikerAutogoals;
        blueStriker.goalReceived = blueStriker.goalReceived + newGame.result.red;
        redKeeper.goalDone = redKeeper.goalDone + newGame.redKeeperGoals;
        redKeeper.autogoalDone = redKeeper.autogoalDone + newGame.redKeeperAutogoals;
        redKeeper.goalReceived = redKeeper.goalReceived + newGame.result.blue;
        redStriker.goalDone = redStriker.goalDone + newGame.redStrikerGoals;
        redStriker.autogoalDone = redStriker.autogoalDone + newGame.redStrikerAutogoals;
        redStriker.goalReceived = redStriker.goalReceived + newGame.result.blue;

        console.log("Done calculating, now write back on DB");
        // actually update the values on DB
        const _blueKeeperPromise = rankingsCollection.doc(newGame.blueTeam.keeper).set(blueKeeper);
        const _blueStrikerPromise = rankingsCollection.doc(newGame.blueTeam.striker).set(blueStriker);
        const _redKeeperPromise = rankingsCollection.doc(newGame.redTeam.keeper).set(redKeeper);
        const _redStrikerPromise = rankingsCollection.doc(newGame.redTeam.striker).set(redStriker);

        const _results = await Promise.all([_blueKeeperPromise, _blueStrikerPromise, _redKeeperPromise, _redStrikerPromise]);
        console.log("Everything is done!");
        return true;
    });