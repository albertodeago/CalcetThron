const fs = require('fs');
// const {getAllSeasonGames, analyzeGames} = require("./getAllGames");
const {buildHistory} = require("./getHistory");
const usersMap = require("./users");

let rawGames = fs.readFileSync('allgames.json');
let allGames = JSON.parse(rawGames);

let rawHistory = fs.readFileSync('history.json');
// let fullHistory = JSON.parse(rawHistory);

buildHistory(4).then(histories => {
    fs.writeFileSync('history-for-video-ELO.json', JSON.stringify(histories.ELO));
    fs.writeFileSync('history-for-video-TS.json', JSON.stringify(histories.TS));
});


