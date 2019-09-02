// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const updateRankings = require('./updateRankings');
const updateSeason = require('./updateSeason');

/**
 * When a match is inserted, update the rankings value of players.
 */
exports.updateRankings = functions.firestore
    .document('games/{gameId}')
    .onCreate(updateRankings);

exports.DEV_updateRankings = functions.firestore
    .document('DEV_games/{gameId}')
    .onCreate((snap, context) => {
        return updateRankings(snap, context, undefined, true);
    });


exports.updateSeason = functions.firestore
    .document('games/{gameId}')
    .onCreate(updateSeason);
    
exports.DEV_updateSeason = functions.firestore
    .document('DEV_games/{gameId}')
    .onCreate((snap, context) => {
        return updateSeason(snap, context, true);
    });