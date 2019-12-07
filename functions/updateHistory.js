const { database } = require('./admin');

/**
 * Given rankings (calculated from updateRankings cloud function), a game and the season, save
 * the stat of those players in a separate collection organized by date. This will be used in
 * frontend to build an "history" graph or something like that.
 */
exports.default = async function(blueKeeper, blueStriker, redKeeper, redStriker, game, season, devMode) {
    const db = database

    // get history collection
    let historyCollection;
    if (devMode) {
        historyCollection = db.collection("DEV_seasons").doc(season).collection("DEV_history");
    } else {
        historyCollection = db.collection("seasons").doc(season).collection("history");
    }

    // prepare date
    const now = new Date(game.creationDate);
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = (now.getDate() + "").padStart(2, "0");
    const date = `${year}_${month}_${day}`; // e.g. 2019_12_07
    
    const historyDoc = await historyCollection.doc(date).get();
    let historyDay = historyDoc.exists ? historyDoc.data() : {}
    historyDay[blueKeeper.id] = blueKeeper;
    historyDay[blueStriker.id] = blueStriker;
    historyDay[redKeeper.id] = redKeeper;
    historyDay[redStriker.id] = redStriker;

    // update history day doc
    await historyDoc.ref.set(historyDay);
};
