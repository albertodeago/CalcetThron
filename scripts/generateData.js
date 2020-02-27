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


const users = Object.values(usersMap).map(u => ({
    id: u.id,
    nickname: u.nickname,
    totalPlayed: 0,
    played6a6: 0,
    won6A6: 0,
    percentage6a6: 0
}));


const isSeiASei = (game) => ((game.result.blue === 7 && game.result.red === 6) || (game.result.blue === 6 && game.result.red === 7))
const isPlayerInGame = (userId, game) => [game.blueTeam.keeper, game.blueTeam.striker, game.redTeam.keeper, game.redTeam.striker].indexOf(userId) !== -1

// find the number of 6a6 for each player
const getNumOf6a6 = () => {
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
    fs.writeFileSync('6a6annunciato-stats.json', JSON.stringify({"totalGames": seasonGames.length, "stats": users}, null, 2))
}


const getCoupleWithRolesStats = () => {
    const users = Object.values(usersMap).map(u => ({
        id: u.id,
        nickname: u.nickname
    }));
    const couplesWithRoles = {};

    seasonGames.forEach(game => {
        
        const redTeamCouple = game.redTeam.keeper + "_" + game.redTeam.striker;
        const blueTeamCouple = game.blueTeam.keeper + "_" + game.blueTeam.striker;

        const defaultObj = {
            totalPlayed: 0,
            won: 0,
            percentageWon: 0,
            total6a6: 0,
            won6a6: 0,
            percentageWon6a6: 0,
            percentage6a6: 0,
            nicknames: ""
        }
        if (!couplesWithRoles[redTeamCouple]) {
            couplesWithRoles[redTeamCouple] = Object.assign({}, defaultObj);
        }
        if (!couplesWithRoles[blueTeamCouple]) {
            couplesWithRoles[blueTeamCouple] = Object.assign({}, defaultObj);
        }
        
        const redCouple = couplesWithRoles[redTeamCouple]
        const blueCouple = couplesWithRoles[blueTeamCouple]

        const redK = users.find(u => u.id === game.redTeam.keeper)
        const redS = users.find(u => u.id === game.redTeam.striker)
        const blueK = users.find(u => u.id === game.blueTeam.keeper)
        const blueS = users.find(u => u.id === game.blueTeam.striker)
        redCouple.nicknames = redK.nickname + "_" + redS.nickname
        blueCouple.nicknames = blueK.nickname + "_" + blueS.nickname

        redCouple.totalPlayed += 1
        blueCouple.totalPlayed += 1

        if (game.result.red === 7) {
            redCouple.won += 1

            if (isSeiASei(game)) {
                redCouple.total6a6 += 1
                blueCouple.total6a6 += 1

                redCouple.won6a6 += 1
            }
        } else {
            blueCouple.won += 1

            if (isSeiASei(game)) {
                redCouple.total6a6 += 1
                blueCouple.total6a6 += 1

                blueCouple.won6a6 += 1
            }
        }

        redCouple.percentageWon = parseFloat((redCouple.won / redCouple.totalPlayed).toFixed(2))
        blueCouple.percentageWon = parseFloat((blueCouple.won / blueCouple.totalPlayed).toFixed(2))

        redCouple.percentage6a6 = parseFloat((redCouple.total6a6 / redCouple.totalPlayed).toFixed(2))
        redCouple.percentageWon6a6 = redCouple.total6a6 === 0 ? 0 : parseFloat((redCouple.won6a6 / redCouple.total6a6).toFixed(2))

        blueCouple.percentage6a6 = parseFloat((blueCouple.total6a6 / blueCouple.totalPlayed).toFixed(2))
        blueCouple.percentageWon6a6 = blueCouple.total6a6 === 0 ? 0 : parseFloat((blueCouple.won6a6 / blueCouple.total6a6).toFixed(2))
    });
    
    // trasform result in array and remove the couple with less than 5 games)
    const arrayResult = Object.values(couplesWithRoles).filter(i => i.totalPlayed >= 5)

    const findMax = (data, key) => data.reduce((prev, current) => (prev[key] > current[key]) ? prev : current)
    // const findMin = (data, key) => data.reduce((prev, current) => (prev[key] > current[key]) ? prev : current)
    
    // couple with the highest amount of games
    const highestPlayedCouple = findMax(arrayResult, "totalPlayed")
    // couple with the highest win rate
    const highestWinRateCouple = findMax(arrayResult, "percentageWon")
    // couple with the highest amount of 6a6
    const highest6a6Couple = findMax(arrayResult, "total6a6")
    // couple with the highest winRate of 6a6
    const highest6a6WinRateCouple = findMax(arrayResult, "percentageWon6a6")
    // couple with the highest percentage of 6a6 (win or not)
    const highest6a6PercentageCouple = findMax(arrayResult, "percentage6a6")

    fs.writeFileSync('couple-with-roles-stats.json', JSON.stringify({
        "totalGames": seasonGames.length, 
        "highestPlayedCouple": highestPlayedCouple,
        "highestWinRateCouple": highestWinRateCouple,
        "highest6a6Couple": highest6a6Couple,
        "highest6a6WinRateCouple": highest6a6WinRateCouple,
        "highest6a6PercentageCouple": highest6a6PercentageCouple,
        "stats": arrayResult
    }, null, 2));
}
// getCoupleWithRolesStats();


// get the game with the most aomunt of autogoals, the most onesided etc...
getSpecialGames = () => {
    let gameWithMostAutogoals = seasonGames[0]
    let mostOneSidedGame = seasonGames[0]
    const games7a0 = []

    const getAmountOfAutogoals = game => (game.blueKeeperAutogoals + game.blueStrikerAutogoals + game.redKeeperAutogoals + game.redStrikerAutogoals)

    const is7a0 = game => (game.result.red && game.result.blue === 0 || game.result.red === 0 && game.result.blue === 7)

    seasonGames.forEach(game => {
        
        const redK = users.find(u => u.id === game.redTeam.keeper)
        const redS = users.find(u => u.id === game.redTeam.striker)
        const blueK = users.find(u => u.id === game.blueTeam.keeper)
        const blueS = users.find(u => u.id === game.blueTeam.striker)
        game.redTeam.keeperNickname = redK.nickname
        game.redTeam.strikerNickname = redS.nickname
        game.blueTeam.keeperNickname = blueK.nickname
        game.blueTeam.strikerNickname = blueS.nickname

        if (getAmountOfAutogoals(game) > getAmountOfAutogoals(gameWithMostAutogoals)) {
            gameWithMostAutogoals = game
        }
        if (is7a0(game)) {
            games7a0.push(game)
        }
    });

    fs.writeFileSync('special-games.json', JSON.stringify({
        "totalGames": seasonGames.length, 
        "gameWithMostAutogoals": gameWithMostAutogoals,
        "games7a0": games7a0
    }, null, 2));
}
getSpecialGames();

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


