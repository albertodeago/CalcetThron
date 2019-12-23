const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/firestore");

const config = require("./firebase");
firebase.initializeApp(config);

const getAllSeasonGames = async function(seasonNumber) {
    const collectionName = "seasons/season_" + seasonNumber + "/games";
    const db = firebase.firestore();
    const gamesCollection = db.collection(collectionName);
    const allGames = await gamesCollection.get();
    const result = [];
    allGames.forEach(game => {
        const data = game.data();
        result.push(data);
    })
    return result;
}

// getAllSeasonGames(3).then(games => console.log(games.length))

module.exports = getAllSeasonGames;