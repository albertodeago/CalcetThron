const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/firestore");

const config = require("./firebase");
firebase.initializeApp(config);

const db = firebase.firestore()


/**
 * Get all users
 */
const getAllUsers = async function() {
    const usersCollection = db.collection("users");
    let users = [];

    const usersSnapshot = await usersCollection.get();
    usersSnapshot.forEach(doc => users.push(doc.data()));
    return users;
}


/**
 * Get the history of a specific season
 * @param {Number} seasonNumber 
 */
const getSeasonHistory = async function(seasonNumber) {
    const historyCollection = db.collection("seasons/season_" + seasonNumber + "/history");
    const result = {};

    const history = await historyCollection.get();
    history.forEach(doc => {
        const day = {};
        result[doc.id] = doc.data();
    });
    return result;
}
// getSeasonHistory(3).then(u => console.log(u))


/**
 * Build the history to create the "ELO race" of a specific season
 * @param {Number} seasonNumber 
 * 
 * The json output must follow the pattern:
 * [{
 *   "nickname": "user1",
 *   "avatar": "urk-to-image",
 *   "date-1":  1,
 *   "date-2":  2,
 *   "date-3":  3,
 * },{
 *   "nickname": "user2",
 *   "avatar": "urk-to-image",
 *   "date-1":  1,
 *   "date-2":  5,
 *   "date-3":  7
 * },{
 *   "nickname": "user3",
 *   "avatar": "urk-to-image",
 *   "date-1":  10,
 *   "date-2":  20,
 *   "date-3":  3,
 * }]
 */
const buildHistory = function(seasonNumber) {
    return new Promise(resolve => {
        getAllUsers().then(users => {
            getSeasonHistory(seasonNumber).then(history => {
                const activeUserIds = [];
                Object.values(history).forEach(ranks => {
                    Object.keys(ranks).forEach(userId => {
                        if (activeUserIds.indexOf(userId) === -1)
                            activeUserIds.push(userId);
                    })
                });
                console.log(activeUserIds, activeUserIds.length)
        
                // filter out users that have never played this season
                users = users.filter(user => activeUserIds.indexOf(user.id) !== -1);
        
                const result = [];
                let prevDay = Object.keys(history)[0]; // save the previous day (initially is the first day)

                // initialize the "initial" ELO for each users
                users.forEach(user => {
                    const userObj = {
                        nickname: user.nickname,
                        avatar: user.avatar
                    }
                    userObj[prevDay] = 1000;
                    result.push(userObj);
                });
                // console.log("init", result);

                // now calculate the real "history". If we don't find a user someday we look back at the previous day.
                users.forEach((user, index) => {
                    const userObj = {
                        nickname: user.nickname,
                        avatar: user.avatar
                    };
                    Object.keys(history).forEach(day => {
                        if (history[day][user.id]) {
                            // the user played this day... he has an entry in history
                            userObj[day] = history[day][user.id].ELO;
                        } else {
                            // get the previous day value if the player didn't played today, 1000 fallback for the first day.
                            userObj[day] = userObj[prevDay] || 1000;
                        }
                        prevDay = day;
                    });
                    result.push(userObj);
                    prevDay = Object.keys(history)[0];
                });
        
                resolve(result)
            });
        });
    })
};
// buildHistory(3).then(h => console.log(h));

module.exports = {
    getAllUsers,
    getSeasonHistory,
    buildHistory
};