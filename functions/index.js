// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


const updateRankings = async function(snap, context, season) {
    // Get an object representing the document
    const newGame = snap.data();
    console.log("update rankings for new game " + snap.id + " with season " + season);

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
        autogoalDone: 0,
        ELO: 1000
    }

    // get ranking of the game players
    const db = admin.firestore()
    const rankingsCollection = season ? db.collection("seasons2").doc(season).collection("rankings") : db.collection("rankings2")

    const blueKeeperPromise = rankingsCollection.doc(newGame.blueTeam.keeper).get();
    const blueStrikerPromise = rankingsCollection.doc(newGame.blueTeam.striker).get();
    const redKeeperPromise = rankingsCollection.doc(newGame.redTeam.keeper).get();
    const redStrikerPromise = rankingsCollection.doc(newGame.redTeam.striker).get();

    console.log("Getting ranking of players " + newGame.blueTeam.keeper + " " + newGame.blueTeam.striker + " " + newGame.redTeam.keeper + " " + newGame.redTeam.striker);
    const results = await Promise.all([blueKeeperPromise, blueStrikerPromise, redKeeperPromise, redStrikerPromise]);

    // log something to have some more info in dashboard logs
    if (results[0].data())
        console.log("blueKeeper had already a ranking reference");
    else
        console.log("blueKeeper is new for rankings");
    if (results[1].data())
        console.log("blueStriker had already a ranking reference");
    else
        console.log("blueStriker is new for rankings");
    if (results[2].data())
        console.log("redKeeper had already a ranking reference");
    else
        console.log("redKeeper is new for rankings");
    if (results[3].data())
        console.log("redStriker had already a ranking reference");
    else
        console.log("redStriker is new for rankings");

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

    let updateGamesPromise = null;
    if (season) {
        // calculate new ELO for players
        const blueTeamELO = blueKeeper.ELO + blueStriker.ELO;
        const redTeamELO = redKeeper.ELO + redStriker.ELO;
        let amountELO;
        if (newGame.result.blue === 7) {
            // blue team won
            amountELO = Math.min(Math.max(25 - Math.round(((blueTeamELO - redTeamELO) * 2) / 25), 2), 40); // min 2 max 40
            console.log("Blue won, amount of ELO exchanged is " + amountELO);
            blueKeeper.ELO += amountELO;
            blueStriker.ELO += amountELO;
            redKeeper.ELO -= amountELO;
            redStriker.ELO -= amountELO
        } else {
            // red team won
            amountELO = Math.min(Math.max(25 - Math.round(((redTeamELO - blueTeamELO) * 2) / 25), 2), 40); // min 2 max 40
            console.log("Red won, amount of ELO exchanged is " + amountELO);
            blueKeeper.ELO -= amountELO;
            blueStriker.ELO -= amountELO;
            redKeeper.ELO += amountELO;
            redStriker.ELO += amountELO;
        }

        // Update the game doc with the ELO
        const updateGamePromise = snap.ref.update({
            "exchangedELO": amountELO
        });
        const updateGameCopyPromise = db.collection("seasons2").doc(season).collection("games").doc(snap.id).update({
            "exchangedELO": amountELO
        });
        updateGamesPromise = Promise.all([updateGamePromise, updateGameCopyPromise]);
    } else {
        updateGamesPromise = new Promise((resolve, reject) => resolve());
    }

    console.log("Done calculating, now write back on DB");
    // actually update the values on DB
    const _blueKeeperPromise = rankingsCollection.doc(newGame.blueTeam.keeper).set(blueKeeper);
    const _blueStrikerPromise = rankingsCollection.doc(newGame.blueTeam.striker).set(blueStriker);
    const _redKeeperPromise = rankingsCollection.doc(newGame.redTeam.keeper).set(redKeeper);
    const _redStrikerPromise = rankingsCollection.doc(newGame.redTeam.striker).set(redStriker);

    const _results = await Promise.all([_blueKeeperPromise, _blueStrikerPromise, _redKeeperPromise, _redStrikerPromise, updateGamePromise]);
    console.log("Everything is done!");
    return true;
}

/**
 * When a match is inserted, update the rankings value of players.
 */
exports.updateRankings = functions.firestore
    .document('games/{gameId}')
    .onCreate(updateRankings);

exports.updateSeason = functions.firestore
    .document('games2/{gameId}')
    .onCreate(async(snap, context) => {
        // Get an object representing the document
        const newGame = snap.data();
        console.log("[season] updateSeason new Game " + newGame.creationDate);

        // Understand what season is it. the first season starts on 1° june 2019 TODO: write down the right 1° season date
        // A season is 2 month long
        const startSeasonYear = 2019;
        const seasonOffset = 3; // because we started seasons not in january TODO: when deciding when actually the season will start update this value

        const gameDate = new Date(newGame.creationDate);
        let gameSeasonNumber = 1;

        gameSeasonNumber = gameSeasonNumber + (Math.max(0, (gameDate.getFullYear() - startSeasonYear) * 6)); // every year is 6 seasons
        gameSeasonNumber += Math.max(0, Math.floor(gameDate.getMonth() / 2)); // seasons are 2 month long
        gameSeasonNumber -= seasonOffset; // shift back of the offset amount
        console.log("[season] the game inserted with date " + gameDate + " belongs to season " + gameSeasonNumber);

        // gameSeasonNumber is now correct, just write the game on the games collection of the right season 
        // and then update also the ranking collection of that season

        const db = admin.firestore()
        const seasonsCollection = db.collection("seasons2");
        let seasonDoc = await seasonsCollection.doc("season_" + gameSeasonNumber).get();
        if (seasonDoc.exists) {
            // season already created, read it
            const season = seasonDoc.data();

            // update the games subcollection adding the new game
            const seasonGamesCollection = seasonDoc.ref.collection("games");
            await seasonGamesCollection.doc(snap.id).set(newGame);

            // update the rankings subscollection for the season
            await updateRankings(snap, context, "season_" + gameSeasonNumber);
        } else {
            // season has to be initialized
            await seasonDoc.ref.set({
                number: gameSeasonNumber,
                animalName: "Cat" // TODO: we should fetch a random animal from somewhere
            });

            // create the games subcollection then add the new game
            const seasonGamesCollection = seasonDoc.ref.collection("games");
            await seasonGamesCollection.doc(snap.id).set(newGame);

            // update the rankings subcollection for the season
            await updateRankings(snap, context, "season_" + gameSeasonNumber);
        }

        return true;
    });