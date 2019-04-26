export const enrichUser = function(user, allGames) {
    const games = Object.values(allGames || {})

    const enrichedUser = {
        ...user,
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
        autogoalDone: 0
    };
    games.forEach(game => {
        let userPlayed = false
        let team
        let role

        if (game.blueTeam.striker === user.id) {
            enrichedUser.played += 1
            enrichedUser.playedStriker += 1
            userPlayed = true
            role = "striker"
            team = "blue"
        } else if (game.blueTeam.keeper === user.id) {
            enrichedUser.played += 1
            enrichedUser.playedGoalkeeper += 1
            userPlayed = true
            role = "goalkeeper"
            team = "blue"
        } else if (game.redTeam.striker === user.id) {
            enrichedUser.played += 1
            enrichedUser.playedStriker += 1
            userPlayed = true
            role = "striker"
            team = "red"
        } else if (game.redTeam.keeper === user.id) {
            enrichedUser.played += 1
            enrichedUser.playedGoalkeeper += 1
            userPlayed = true
            role = "goalkeeper"
            team = "red"
        }

        if (userPlayed) {
            let won
            if (team === "red") {
                if (game.result.red == 7) {
                    enrichedUser.won += 1
                    won = true
                } else {
                    enrichedUser.lost += 1
                    won = false
                }
            } else {
                if (game.result.blue == 7) {
                    enrichedUser.won += 1
                    won = true
                } else {
                    enrichedUser.lost += 1
                    won = false
                }
            }
            enrichedUser.winRate = enrichedUser.played === 0 ? "0%" : (enrichedUser.won / enrichedUser.played * 100) + "%"

            if (won) {
                if (role === "striker") {
                    enrichedUser.wonStriker += 1
                } else {
                    enrichedUser.wonGoalkeeper += 1
                }
            } else {
                if (role === "striker") {
                    enrichedUser.lostStriker += 1
                } else {
                    enrichedUser.lostGoalkeeper += 1
                }
            }

            enrichedUser.winRateStriker = enrichedUser.playedStriker === 0 ? "0%" : (enrichedUser.wonStriker / enrichedUser.playedStriker * 100) + "%"
            enrichedUser.winRateGoalkeeper = enrichedUser.playedGoalkeeper === 0 ? "0%" : (enrichedUser.wonGoalkeeper / enrichedUser.playedGoalkeeper * 100) + "%"

            // get goals
            const _role = role === "striker" ? "Striker" : "Keeper"
            const goalsDone = game[team + _role + "Goals"]
            const autogoalsDone = game[team + _role + "Autogoals"]
            const goalsReceived = team === "red" ? game.result.blue : game.result.red

            enrichedUser.goalDone += goalsDone
            enrichedUser.autogoalDone += autogoalsDone
            enrichedUser.goalReceived += goalsReceived
        }
    })

    return enrichedUser
}

export const RankingBuilder = function(allUsers, allGames) {
    const users = Object.values(allUsers || {})
    const games = Object.values(allGames || {})
    let _enrichedUsers = {}

    users.forEach(user => {
        _enrichedUsers[user.id] = enrichUser(user, games)
    })

    const sortedUsers = Object.values(_enrichedUsers)
    sortedUsers.sort(function(a, b) {
        return parseInt(b.winRate.slice(0, -1)) - parseInt(a.winRate.slice(0, -1));
    });
    return sortedUsers
}