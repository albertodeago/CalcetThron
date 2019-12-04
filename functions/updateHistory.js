const { database } = require('./admin');

/**
 * TODO: documentation
 */
exports.default = async function(snap, context, season, devMode = false) {
    // Get an object representing the document
    const newGame = snap.data();
    console.log(`[updateHistory] devMode: ${devMode} - gameId: ${snap.id} - season: ${season}`);

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

    const db = database;
    let historyCollection;

    if (devMode) {
        historyCollection = db.collection("DEV_seasons").doc(season).collection("DEV_history");
    } else {
        historyCollection = db.collection("seasons").doc(season).collection("history");
    }

    /**
     * Utility function to get the week of the month
     * @param {Date} date 
     */
    function getWeekOfMonth(date) {
        const startWeekDayIndex = 1; // 1 MonthDay 0 Sundays
        const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDay = firstDate.getDay();
    
        let weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
        if (startWeekDayIndex === 1) {
            if (date.getDay() === 0 && date.getDate() > 1) {
                weekNumber -= 1;
            }

            if (firstDate.getDate() === 1 && firstDay === 0 && date.getDate() > 1) {
                weekNumber += 1;
            }
        }
        return weekNumber;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    const dayKey = `${year}_${month}_${day}`; // this is like 2019_11_4 (11 is december)
    const weekKey = `${year}_${mont}_${getWeekOfMonth(now)}`;

    // create colleciton and docs if it doesn't exists
    let dailyCollection;
    let weeklyCollection;

    if (devMode) {
        dailyCollection = db.collection("DEV_seasons").doc(season).collection("DEV_daily");
        weeklyCollection = db.collection("DEV_seasons").doc(season).collection("DEV_weekly");
    } else {
        dailyCollection = db.collection("seasons").doc(season).collection("daily");
        weeklyCollection = db.collection("seasons").doc(season).collection("weekly");
    }

    /*  TODO: 
        1: add or update daily of 4 users
        2: add or update weekly of 4 users
    */

    /* TODO:
        We also should "get the previous day/week" data. And if previous day 
        have no data we should go back two days ago ecc... until we reach day 1 
        of the month
     */

    let dailyDoc = await dailyCollection.doc(dayKey).get();
    if (dailyDoc.exists) {
        console.log("[updateHistory] - Daily doc already existed, update it");
        // dailyDoc already eixsts, read it
        const daily = dailyDoc.data();

        // TODO: update users in this daily and then re-save it
    } else {
        // daily doc must be created
        console.log("[updateHistory] - Daily doc doesnt exists, create it");
        
    }
}