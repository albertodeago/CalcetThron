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


const analyzeGames = function(allGames) {

    const numberOfGames = allGames.length;
    console.log("number of games: " + numberOfGames);
    
    const totalGoals = allGames.reduce((prev, game) => prev + game.result.blue + game.result.red, 0);
    console.log("total goals: " + totalGoals);
    
    const averageGoalsPerGame = (totalGoals / numberOfGames).toFixed(2)
    console.log("average goals per game: " + averageGoalsPerGame)
    
    const isSeiASei = (game) => ((game.result.blue === 7 && game.result.red === 6) || (game.result.blue === 6 && game.result.red === 7))
    const numberOfSeiASeiAnnunciato = allGames.reduce((prev, game) => isSeiASei(game) ? prev + 1 : prev, 0)
    console.log("number of 6a6annungiato: " + numberOfSeiASeiAnnunciato);
    
    const precentageOfSeiASeiAnnunciato = (numberOfSeiASeiAnnunciato / numberOfGames * 100).toFixed(2) + "%"
    console.log("Percentage of 6a6annunciato: " + precentageOfSeiASeiAnnunciato)
    
    const getAutogoals = game => (game.blueStrikerAutogoals + game.blueKeeperAutogoals + game.redKeeperAutogoals + game.redStrikerAutogoals)
    const numberOfAutogoals = allGames.reduce((prev, game) => prev + getAutogoals(game), 0);
    console.log("numer of autogoals: " + numberOfAutogoals);
    
    const autogoalsPerGame = (numberOfAutogoals / numberOfGames).toFixed(2);
    console.log("autogoals per game: " + autogoalsPerGame);
    
    const vittorieBlu = allGames.reduce((prev, game) => game.result.blue === 7 ? prev + 1 : prev, 0);
    console.log("Blue game victories: " + vittorieBlu);
    
    const vittorieRosse = allGames.reduce((prev, game) => game.result.red === 7 ? prev + 1 : prev, 0);
    console.log("Red game victories: " + vittorieRosse);
    
    const vittorieRossePercentuale = (vittorieRosse / numberOfGames * 100).toFixed(2) + "%";
    console.log("Red win percentage of wins: " + vittorieRossePercentuale);
}
// getAllSeasonGames(3).then(games => analyzeGames(games))

module.exports = {
    getAllSeasonGames,
    analyzeGames
};