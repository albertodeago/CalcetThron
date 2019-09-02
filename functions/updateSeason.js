const { database } = require('./admin');
const updateRankings = require('./updateRankings').default;

/**
 * Cloud function that given a season (optional) and a new game created it update the 
 * season (optional) relative players and copy the game into the season if defined
 */
exports.default = async function(snap, context, devMode = false) {
    // Get an object representing the document
    const newGame = snap.data();
    console.log(`[updateSeason] devMode: ${devMode} - gameId: ${snap.id} - date: ${newGame.creationDate}`);

    // Understand what season is it. the first season starts on 1° june 2019 TODO: write down the right 1° season date
    // A season is 2 month long
    const startSeasonYear = 2019;
    const seasonOffset = 3; // because we started seasons not in january TODO: when deciding when actually the season will start update this value
    const seasonMonthDuration = 2;

    const gameDate = new Date(newGame.creationDate);
    let gameSeasonNumber = 1;

    gameSeasonNumber = gameSeasonNumber + (Math.max(0, (gameDate.getFullYear() - startSeasonYear) * 6)); // every year is 6 seasons
    gameSeasonNumber += Math.max(0, Math.floor(gameDate.getMonth() / seasonMonthDuration)); // seasons are 2 month long
    gameSeasonNumber -= seasonOffset; // shift back of the offset amount
    console.log("[updateSeason] - the game inserted with date " + gameDate + " belongs to season " + gameSeasonNumber);

    // gameSeasonNumber is now correct, just write the game on the games collection of the right season 
    // and then update also the ranking collection of that season

    const db = database
    const seasonsCollection = devMode ? db.collection("DEV_seasons") : db.collection("seasons");
    let seasonDoc = await seasonsCollection.doc("season_" + gameSeasonNumber).get();
    if (seasonDoc.exists) {
        console.log("[updateSeason] - Season document already existed, add game");
        // season already created, read it
        const season = seasonDoc.data();

        // update the games subcollection adding the new game
        const seasonGamesCollection = devMode ? seasonDoc.ref.collection("DEV_games") : seasonDoc.ref.collection("games");
        await seasonGamesCollection.doc(snap.id).set(newGame);

        // update the rankings subscollection for the season
        console.log("[updateSeason] - Update the season rankings");
        await updateRankings(snap, context, "season_" + gameSeasonNumber, devMode);
    } else {
        // season has to be initialized
        console.log("[updateSeason] - Season document not existing, create it")
        await seasonDoc.ref.set({
            number: gameSeasonNumber,
            animalName: "Cat" // TODO: we should fetch a random animal from somewhere
        });

        // create the games subcollection then add the new game
        const seasonGamesCollection = devMode ? seasonDoc.ref.collection("DEV_games") : seasonDoc.ref.collection("games");
        await seasonGamesCollection.doc(snap.id).set(newGame);

        // update the rankings subcollection for the season
        console.log("[updateSeason] - Update the season rankings");
        await updateRankings(snap, context, "season_" + gameSeasonNumber, devMode);
    }

    return true;
}