const fs = require('fs');
const {getAllSeasonGames, analyzeGames} = require("./getAllGames");
// const {buildHistory} = require("./getHistory");
const usersMap = require("./users");

// let rawGames = fs.readFileSync('allgames.json');
// let allGames = JSON.parse(rawGames);

let rawSeasonGames = fs.readFileSync('season-4-all-games.json');
let seasonGames = JSON.parse(rawSeasonGames);

// let rawHistory = fs.readFileSync('history.json');
// let fullHistory = JSON.parse(rawHistory);

//getAllSeasonGames(4).then(games => fs.writeFileSync('season-4-all-games.json', JSON.stringify(games, null, 2)));

// buildHistory(4).then(histories => {
//     fs.writeFileSync('history-for-video-ELO.json', JSON.stringify(histories.ELO));
//     fs.writeFileSync('history-for-video-TS.json', JSON.stringify(histories.TS));
// });

// find the number of 6a6 for each player
const isSeiASei = (game) => ((game.result.blue === 7 && game.result.red === 6) || (game.result.blue === 6 && game.result.red === 7))
const isPlayerInGame = (userId, game) => [game.blueTeam.keeper, game.blueTeam.striker, game.redTeam.keeper, game.redTeam.striker].indexOf(userId) !== -1
const users = Object.values(usersMap).map(u => ({
    id: u.id,
    nickname: u.nickname,
    totalPlayed: 0,
    played6a6: 0,
    won6A6: 0,
    percentage6a6: 0
}));
seasonGames.forEach(game => {
    users.forEach(u => {
        if (isPlayerInGame(u.id, game)) {
            u.totalPlayed += 1;
        }
    })

    if (isSeiASei(game)) {
        const redK = users.find(u => u.id === game.redTeam.keeper)
        const redS = users.find(u => u.id === game.redTeam.striker)
        const blueK = users.find(u => u.id === game.blueTeam.keeper)
        const blueS = users.find(u => u.id === game.blueTeam.striker)

        redK.played6a6 += 1
        redS.played6a6 += 1
        blueK.played6a6 += 1
        blueS.played6a6 += 1

        if (game.result.red === 7) {
            redK.won6A6 += 1
            redS.won6A6 += 1
        } else {
            blueK.won6A6 += 1
            blueS.won6A6 += 1
        }

        redK.percentage6a6 = redK.totalPlayed === 0 ? 0 : parseFloat((redK.played6a6 / redK.totalPlayed).toFixed(2))
        redS.percentage6a6 = redS.totalPlayed === 0 ? 0 : parseFloat((redS.played6a6 / redS.totalPlayed).toFixed(2))
        blueK.percentage6a6 = blueK.totalPlayed === 0 ? 0 : parseFloat((blueK.played6a6 / blueK.totalPlayed).toFixed(2))
        blueS.percentage6a6 = blueS.totalPlayed === 0 ? 0 : parseFloat((blueS.played6a6 / blueS.totalPlayed).toFixed(2))
    }


});
fs.writeFileSync('6a6annunciato-stats.json', JSON.stringify({"totalGames": seasonGames.length, "stats": users}, null, 2));

/*
blueKeeperAutogoals:0
blueKeeperGoals:0
blueStrikerAutogoals:0
blueStrikerGoals:3
blueTeam: {
    keeper:"YNuC8d8XuEcvTl2BB79CW34PAX43"
    striker:"MQm6ViHQNIYF3iR0P6cF5mb2Ym33"
}
creationDate:1582729983383
exchangedELO:12
id:"0j25lICFrnRJZgU48B9j"
redKeeperAutogoals:0
redKeeperGoals:1
redStrikerAutogoals:0
redStrikerGoals:6
redTeam: {
    keeper:"YNuC8d8XuEcvTl2BB79CW34PAX43"
    striker:"MQm6ViHQNIYF3iR0P6cF5mb2Ym33"
}
keeper:"VtNCubYBh9MlAz8uLlak582OkyP2"
striker:"3jdMMXoRcyMwe80ldjy9TGd2Ri33"
result: {
    blue:3
    red:7
}
trueSkillChanges:Object
*/


