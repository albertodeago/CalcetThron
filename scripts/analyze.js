'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('allgames.json');
let allGames = JSON.parse(rawdata);

const numberOfGames = allGames.length;
console.log(numberOfGames);

const totalGoals = allGames.reduce((prev, game) => prev + game.result.blue + game.result.red, 0);
console.log(totalGoals);

const averageGoalsPerGame = (totalGoals / numberOfGames).toFixed(2)
console.log(averageGoalsPerGame)

const isSeiASei = (game) => ((game.result.blue === 7 && game.result.red === 6) || (game.result.blue === 6 && game.result.red === 7))
const numberOfSeiASeiAnnunciato = allGames.reduce((prev, game) => isSeiASei(game) ? prev + 1 : prev, 0)
console.log(numberOfSeiASeiAnnunciato);

const precentageOfSeiASeiAnnunciato = (numberOfSeiASeiAnnunciato / numberOfGames * 100).toFixed(2) + "%"
console.log(precentageOfSeiASeiAnnunciato)

const getAutogoals = game => (game.blueStrikerAutogoals + game.blueKeeperAutogoals + game.redKeeperAutogoals + game.redStrikerAutogoals)
const numberOfAutogoals = allGames.reduce((prev, game) => prev + getAutogoals(game), 0);
console.log(numberOfAutogoals);

const autogoalsPerGame = (numberOfAutogoals / numberOfGames).toFixed(2);
console.log(autogoalsPerGame);

const vittorieBlu = allGames.reduce((prev, game) => game.result.blue === 7 ? prev + 1 : prev, 0);
console.log(vittorieBlu);

const vittorieRosse = allGames.reduce((prev, game) => game.result.red === 7 ? prev + 1 : prev, 0);
console.log(vittorieRosse);

const vittorieRossePercentuale = (vittorieRosse / numberOfGames * 100).toFixed(2) + "%";
console.log(vittorieRossePercentuale);
