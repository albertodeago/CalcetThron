import Config from "src/Config"
import Utils from "src/Utils"


export default {
    namespaced: true,
    state: {
        collectionName: null,
        history: null,
        activeUsers: []
    },

    getters: {
        getHistory: (state) => state.history,
        getActiveUsers: (state) => state.activeUsers
    },
    mutations: {

        setSeason(state, season) {
            if (Config.devMode) {
                state.collectionName = season.number === 0 ? null : "DEV_seasons/season_" + season.number + "/DEV_history"
            } else {
                state.collectionName = season.number === 0 ? null : "seasons/season_" + season.number + "/history"
            }
        },

        setHistory(state, history) {
            state.history = history
        },

        setActiveUsers(state, users) {
            state.activeUsers = users
        }

    },
    actions: {

        async getHistory({ state, commit, rootState }) {
            if (!rootState.Seasons.selectedSeason || !state.collectionName || !rootState.User.allUsersArray.length) {
                console.warn("season or users not ready to build the history!")
                return
            }

            const db = firebase.firestore()
            const historyCollection = db.collection(state.collectionName)

            const historySnapshot = await historyCollection.get()
            const daysHistory = {}
            historySnapshot.forEach(snap => daysHistory[snap.id] = snap.data())


            // prepare history by skipping empty days and filling missing ranks when a player don't play or has never played
            const days = Object.keys(daysHistory) // days are in pattern yyyy_mm_dd
            const firstDayWithDash = days[0].split("_").join("-")
            const lastDayWithDash = days[days.length -1].split("_").join("-")
            const date = new Date(firstDayWithDash)
            const lastDate  = new Date(lastDayWithDash)

            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = (date.getDate() + "").padStart(2, "0");
                return `${year}_${month}_${day}`; // e.g. 2019_12_07
            }

            const fullHistory = {}
            const initialRank = {
                id: null,
                nickname: "",
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
                goalDoneAsStriker: 0,
                goalDoneAsGoalkeeper: 0,
                goalReceived: 0,
                autogoalDone: 0,
                ELO: 1000
            }
            let previousHistoryday = {}

            // find users that have played this season
            const activeIds = []
            days.forEach(day => {
                const ids = Object.keys(daysHistory[day])
                ids.forEach(id => Utils.pushUnique(activeIds, id))
            })
            const activeUsers = rootState.User.allUsersArray.filter(u => activeIds.indexOf(u.id) > -1)
            console.log("active players for this season", activeUsers.map(u => u.nickname))
            activeUsers.forEach(user => previousHistoryday[user.id] = Object.assign({}, initialRank, {id: user.id, nickname: user.nickname}))
            console.log("starting from: ", previousHistoryday)

            while (date.getTime() <= lastDate.getTime()) {
                // if the history don't have this day, we skip the day
                if (daysHistory[formatDate(date)]) {       
                    fullHistory[formatDate(date)] = {}

                    // for each user we set the rank of the day either taking it form DB or from taking the previous value
                    // if a player never played he will have always the same object as initialRank
                    activeUsers.forEach(user => {
                        if (daysHistory[formatDate(date)][user.id]) {
                            fullHistory[formatDate(date)][user.id] = daysHistory[formatDate(date)][user.id]
                        } else {
                            fullHistory[formatDate(date)][user.id] = previousHistoryday[user.id]
                        }
                    })
                }
                date.setDate(date.getDate() + 1) // increment 1 day
            }

            commit("setActiveUsers", activeUsers)
            commit("setHistory", fullHistory)
        },

        selectSeason({ commit }, season) {
            commit("setSeason", season)
            // commit("emptyGames")
        }
    }
}
