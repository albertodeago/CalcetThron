const { database } = require('./admin');
const ELO = require('./ELO');
const TrueSkill = require("./Trueskill");
const updateHistory = require("./updateHistory").default;

/**
 * Cloud function that given a season (optional) and a new game created it update the 
 * season (optional) relative players and copy the game into the season if defined
 */
exports.default = async function(snap, context, season, devMode = false) {
    // Get an object representing the document
    const newGame = snap.data();
    console.log(`[updateRankings] devMode: ${devMode} - gameId: ${snap.id} - season: ${season}`);

    // create the model to update the db value
    const initialTrueSkill = TrueSkill.getInitial();
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
        goalDoneAsStriker: 0,
        goalDoneAsGoalkeeper: 0,
        goalReceived: 0,
        autogoalDone: 0,
        ELO: 1000,
        trueSkill: {
            mu: initialTrueSkill.mu,
            sigma: initialTrueSkill.sigma
        }
    };

    // get ranking of the game players
    const db = database
    let rankingsCollection;
    if (devMode) {
        if (season) { // dev mode and season defined
            rankingsCollection = db.collection("DEV_seasons").doc(season).collection("DEV_rankings");
        } else { // dev mode but season not defined
            rankingsCollection = db.collection("DEV_rankings");
        }
    } else {
        if (season) { // no dev mode and season defined
            rankingsCollection = db.collection("seasons").doc(season).collection("rankings");
        } else { // no dev mode and no season defined
            rankingsCollection = db.collection("rankings");
        }
    }

    const blueKeeperPromise = rankingsCollection.doc(newGame.blueTeam.keeper).get();
    const blueStrikerPromise = rankingsCollection.doc(newGame.blueTeam.striker).get();
    const redKeeperPromise = rankingsCollection.doc(newGame.redTeam.keeper).get();
    const redStrikerPromise = rankingsCollection.doc(newGame.redTeam.striker).get();

    const results = await Promise.all([blueKeeperPromise, blueStrikerPromise, redKeeperPromise, redStrikerPromise]);

    // log something to have some more info in dashboard logs
    let logMessage = "";
    if (results[0].data())
        logMessage += "BK had already a ranking ref - ";
    else
        logMessage += "BK is new for rankings - ";
    if (results[1].data())
        logMessage += "BS had already a ranking ref - ";
    else
        logMessage += "BS is new for rankings - ";
    if (results[2].data())
        logMessage += "RK had already a ranking ref - ";
    else
        logMessage += "RK is new for rankings - ";
    if (results[3].data())
        logMessage += "RS had already a ranking ref";
    else
        logMessage += "RS is new for rankings";
    console.log("[updateRankings] " + logMessage);

    const blueKeeper = results[0].data() ? Object.assign({}, userRanking, results[0].data()) : Object.assign({}, userRanking, { id: newGame.blueTeam.keeper });
    const blueStriker = results[1].data() ? Object.assign({}, userRanking, results[1].data()) : Object.assign({}, userRanking, { id: newGame.blueTeam.striker });
    const redKeeper = results[2].data() ? Object.assign({}, userRanking, results[2].data()) : Object.assign({}, userRanking, { id: newGame.redTeam.keeper });
    const redStriker = results[3].data() ? Object.assign({}, userRanking, results[3].data()) : Object.assign({}, userRanking, { id: newGame.redTeam.striker });

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

    /* update goals / autogoals */
    blueKeeper.goalDone = blueKeeper.goalDone + newGame.blueKeeperGoals;
    blueKeeper.autogoalDone = blueKeeper.autogoalDone + newGame.blueKeeperAutogoals;
    blueKeeper.goalReceived = blueKeeper.goalReceived + newGame.result.red;
    blueKeeper.goalDoneAsGoalkeeper = blueKeeper.goalDoneAsGoalkeeper + newGame.blueKeeperGoals;
    blueKeeper.goalDoneAsStriker = blueKeeper.goalDoneAsStriker;

    blueStriker.goalDone = blueStriker.goalDone + newGame.blueStrikerGoals;
    blueStriker.autogoalDone = blueStriker.autogoalDone + newGame.blueStrikerAutogoals;
    blueStriker.goalReceived = blueStriker.goalReceived + newGame.result.red;
    blueStriker.goalDoneAsGoalkeeper = blueStriker.goalDoneAsGoalkeeper;
    blueStriker.goalDoneAsStriker = blueStriker.goalDoneAsStriker + newGame.blueStrikerGoals;
    
    redKeeper.goalDone = redKeeper.goalDone + newGame.redKeeperGoals;
    redKeeper.autogoalDone = redKeeper.autogoalDone + newGame.redKeeperAutogoals;
    redKeeper.goalReceived = redKeeper.goalReceived + newGame.result.blue;
    redKeeper.goalDoneAsGoalkeeper = redKeeper.goalDoneAsGoalkeeper + newGame.redKeeperGoals;
    redKeeper.goalDoneAsStriker = redKeeper.goalDoneAsStriker;
    
    redStriker.goalDone = redStriker.goalDone + newGame.redStrikerGoals;
    redStriker.autogoalDone = redStriker.autogoalDone + newGame.redStrikerAutogoals;
    redStriker.goalReceived = redStriker.goalReceived + newGame.result.blue;
    redStriker.goalDoneAsGoalkeeper = redStriker.goalDoneAsGoalkeeper;
    redStriker.goalDoneAsStriker = redStriker.goalDoneAsStriker + newGame.redStrikerGoals;
    /* end update goals / autogoals */

    let updateGamesPromise = null;
    if (season) {
        // calculate new ELO for players
        const blueTeamELO = blueKeeper.ELO + blueStriker.ELO;
        const redTeamELO = redKeeper.ELO + redStriker.ELO;
        let amountELO;
        if (newGame.result.blue === 7) {
            // blue team won
            amountELO = ELO.getExchangedELO(blueTeamELO, redTeamELO);
            console.log("[updateRankings] - Blue won, amount of ELO exchanged is " + amountELO);
            blueKeeper.ELO += amountELO;
            blueStriker.ELO += amountELO;
            redKeeper.ELO -= amountELO;
            redStriker.ELO -= amountELO
        } else {
            // red team won
            amountELO = ELO.getExchangedELO(redTeamELO, blueTeamELO);
            console.log("[updateRankings] - Red won, amount of ELO exchanged is " + amountELO);
            blueKeeper.ELO -= amountELO;
            blueStriker.ELO -= amountELO;
            redKeeper.ELO += amountELO;
            redStriker.ELO += amountELO;
        }

        // calculate new TrueSkill for players
        let newTrueSkillValues;
        let trueSkillChanges = {};

        if (newGame.result.blue === 7) {
            newTrueSkillValues = TrueSkill.getTrueSkill(blueKeeper.trueSkill, blueStriker.trueSkill, redKeeper.trueSkill, redStriker.trueSkill);
            
            trueSkillChanges[blueKeeper.id] = {
                muDifference: newTrueSkillValues[0][0].mu - blueKeeper.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[0][0].sigma - blueKeeper.trueSkill.sigma
            };
            blueKeeper.trueSkill.mu = newTrueSkillValues[0][0].mu;
            blueKeeper.trueSkill.sigma = newTrueSkillValues[0][0].sigma;

            
            trueSkillChanges[blueStriker.id] = {
                muDifference: newTrueSkillValues[0][1].mu - blueStriker.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[0][1].sigma - blueStriker.trueSkill.sigma
            };
            blueStriker.trueSkill.mu = newTrueSkillValues[0][1].mu;
            blueStriker.trueSkill.sigma = newTrueSkillValues[0][1].sigma;
            
            trueSkillChanges[redKeeper.id] = {
                muDifference: newTrueSkillValues[1][0].mu - redKeeper.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[1][0].sigma - redKeeper.trueSkill.sigma
            };
            redKeeper.trueSkill.mu = newTrueSkillValues[1][0].mu;
            redKeeper.trueSkill.sigma = newTrueSkillValues[1][0].sigma;
            
            trueSkillChanges[redStriker.id] = {
                muDifference: newTrueSkillValues[1][1].mu - redStriker.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[1][1].sigma - redStriker.trueSkill.sigma
            };
            redStriker.trueSkill.mu = newTrueSkillValues[1][1].mu;
            redStriker.trueSkill.sigma = newTrueSkillValues[1][1].sigma;
        } else {
            newTrueSkillValues = TrueSkill.getTrueSkill(redKeeper.trueSkill, redStriker.trueSkill, blueKeeper.trueSkill, blueStriker.trueSkill);
            
            trueSkillChanges[redKeeper.id] = {
                muDifference: newTrueSkillValues[0][0].mu - redKeeper.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[0][0].sigma - redKeeper.trueSkill.sigma
            };
            redKeeper.trueSkill.mu = newTrueSkillValues[0][0].mu;
            redKeeper.trueSkill.sigma = newTrueSkillValues[0][0].sigma;
            
            trueSkillChanges[redStriker.id] = {
                muDifference: newTrueSkillValues[0][1].mu - redStriker.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[0][1].sigma - redStriker.trueSkill.sigma
            };
            redStriker.trueSkill.mu = newTrueSkillValues[0][1].mu;
            redStriker.trueSkill.sigma = newTrueSkillValues[0][1].sigma;
            
            trueSkillChanges[blueKeeper.id] = {
                muDifference: newTrueSkillValues[1][0].mu - blueKeeper.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[1][0].sigma - blueKeeper.trueSkill.sigma
            };
            blueKeeper.trueSkill.mu = newTrueSkillValues[1][0].mu;
            blueKeeper.trueSkill.sigma = newTrueSkillValues[1][0].sigma;
            
            trueSkillChanges[blueStriker.id] = {
                muDifference: newTrueSkillValues[1][1].mu - blueStriker.trueSkill.mu,
                sigmaDifference: newTrueSkillValues[1][1].sigma - blueStriker.trueSkill.sigma
            };
            blueStriker.trueSkill.mu = newTrueSkillValues[1][1].mu;
            blueStriker.trueSkill.sigma = newTrueSkillValues[1][1].sigma;
        }
        // done, we now just save it later on db

        // Update the game doc with the ELO and Trueskill differences
        const updateGamePromise = snap.ref.update({
            "exchangedELO": amountELO,
            "trueSkillChanges": trueSkillChanges
        });

        let updateGameCopyPromise;
        if (devMode) {
            updateGameCopyPromise = db.collection("DEV_seasons").doc(season).collection("DEV_games").doc(snap.id).update({
                "exchangedELO": amountELO,
                "trueSkillChanges": trueSkillChanges
            });
        } else {
            updateGameCopyPromise = db.collection("seasons").doc(season).collection("games").doc(snap.id).update({
                "exchangedELO": amountELO,
                "trueSkillChanges": trueSkillChanges
            });
        }

        // wrapper in try catch because if it fails the rest of the operations will continue as usual
        try {
            await updateHistory(blueKeeper, blueStriker, redKeeper, redStriker, newGame, season, devMode);
        } catch(error) {
            console.log("error in update history");
            console.log(error);
        }
        
        updateGamesPromise = Promise.all([updateGamePromise, updateGameCopyPromise]);
    } else {
        updateGamesPromise = new Promise((resolve, reject) => resolve());
    }

    console.log("[updateRankings] - done calculating, now write back on DB");
    // actually update the values on DB
    const _blueKeeperPromise = rankingsCollection.doc(newGame.blueTeam.keeper).set(blueKeeper);
    const _blueStrikerPromise = rankingsCollection.doc(newGame.blueTeam.striker).set(blueStriker);
    const _redKeeperPromise = rankingsCollection.doc(newGame.redTeam.keeper).set(redKeeper);
    const _redStrikerPromise = rankingsCollection.doc(newGame.redTeam.striker).set(redStriker);

    const _results = await Promise.all([_blueKeeperPromise, _blueStrikerPromise, _redKeeperPromise, _redStrikerPromise, updateGamesPromise]);
    console.log("[updateRankings] - Everything is done!");
    return true;
}