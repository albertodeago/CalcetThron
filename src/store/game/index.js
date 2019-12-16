import { Game } from "src/models"
import Config from "src/Config"


export default {
    namespaced: true,
    state: {
        collectionName: Config.devMode ? "DEV_games" : "games",
        games: null,
        gamesArray: [],
        currentGame: null,
        gameListener: null,
        myHistory: null
    },

    getters: {
        games: state => state.games,
        gamesArray: state => state.gamesArray,
        currentGame: state => state.currentGame
    },
    mutations: {

        addGames(state, games) {
            if (!state.games)
                state.games = {}

            Object.values(games).forEach(game => {
                state.games[game.id] = game

                if (!state.gamesArray.find(g => g.id === game.id))
                    state.gamesArray.push(game)
            })
        },

        addGame(state, game) {
            if (!state.games)
                state.games = {}

            state.games[game.id] = game

            if (!state.gamesArray.find(g => g.id === game.id))
                state.gamesArray.push(game)
        },

        emptyGames(state) {
            state.gamesArray = []
            state.games = {}
        },

        setCurrentGame(state, game) {
            state.currentGame = game
        },

        updateGame(state, game) {
            // update object state
            const gameInObj = state.games[game.id]
            if (gameInObj) {
                gameInObj.exchangedELO = game.exchangedELO
            }

            // update array state
            const gameInArray = state.gamesArray.find(g => g.id === game.id)
            if (gameInArray) {
                gameInArray.exchangedELO = game.exchangedELO
            }

            // If we selected this game, update that reference too!
            if (state.currentGame && state.currentGame.id === game.id) {
                state.currentGame.exchangedELO = game.exchangedELO
            }
        },

        setSeason(state, season) {
            if (Config.devMode) {
                if (season.number === 0) {
                    state.collectionName = "DEV_games"
                } else {
                    state.collectionName = "DEV_seasons/season_" + season.number + "/DEV_games";
                }
            } else {
                if (season.number === 0) {
                    state.collectionName = "games"
                } else {
                    state.collectionName = "seasons/season_" + season.number + "/games";
                }
            }
        },

        setGameListener(state, listener) {
            if (state.gameListener) {
                state.gameListener()
                state.gameListener = null
            }
            state.gameListener = listener
        },

        myHistory(state, history) {
            state.myHistory = history
        }
    },
    actions: {

        async getGames({ commit, state }, offset = 0, amount = 5) {
            const db = firebase.firestore()
            const gamesCollection = db.collection(state.collectionName)

            const gamesSnapshot = await gamesCollection.orderBy("creationDate", "desc").limit(offset + amount).get()
            const games = {}
            gamesSnapshot.forEach(game => {
                const data = game.data()
                games[game.id] = new Game({ id: game.id, ...data })
            })

            commit("addGames", games)
            return games
        },

        async saveGame({ commit, dispatch, state }, gameObj) {
            const db = firebase.firestore()
            const gamesCollection = Config.devMode ? db.collection("DEV_games") : db.collection("games")

            try {
                const docRef = await gamesCollection.add(gameObj)
                const newGameObj = await docRef.get()
                var newGame = new Game({
                    id: docRef.id,
                    ...newGameObj.data()
                })
                commit("addGames", [newGame])
                return newGame
            } catch (error) {
                console.error(error)
                dispatch("Global/setErrorMessage", error.message, { root: true })
                return error.message
            }
        },

        selectSeason({ commit, dispatch }, season) {
            commit("setSeason", season)
            commit("emptyGames")
        },

        subscribeToGames({ commit, dispatch, state }) {
            const db = firebase.firestore()
            const gamesCollection = db.collection(state.collectionName)
            
            let listener = gamesCollection.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    // if (change.type === "added") {
                    //     // Added a new game, we have to push into allGames
                    //     // console.log("New game: ", change.doc.data(), change.doc.id)
                    //     const newGame = new Game({ id: change.doc.id, ...change.doc.data() })
                    //     commit("addGame", newGame)
                    // }
                    if (change.type === "modified") {
                        // a modified game means that the Cloud Function have stored the exchanged ELO. Update the game
                        const modifiedGame = new Game({
                            id: change.doc.id,
                            ...change.doc.data()
                        })
                        commit("updateGame", modifiedGame)
                    }
                    // if (change.type === "removed") {        // the app doesn't allow this action yet
                    // A game was removed, we should remove from allGames
                    // }
                })
            })
            commit("setGameListener", listener)
        },

        /**
         * This is just a "debug / export" thing
         */
        async getAllSeasonGames({state, rootState, commit}) {
            // const db = firebase.firestore()
            // const gamesCollection = db.collection(state.collectionName)
            // const allGames = await gamesCollection.get()
            // window.allGames = []
            // allGames.forEach(game => {
            //     const data = game.data()

            //     window.allGames.push(data)
            // })
            // console.log("all gameS", window.allGames)


            const games = await import("../../../scripts/season_3_games")
            const allGames = games.default;
            window.allGames = []
            const pushUnique = (arr, val) => {
                if (!arr.find(u => u.id === val.id))
                    arr.push(val)
            }
            const toMyDate = (ts) => {
                const now = new Date(ts)
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const day = (now.getDate() + "").padStart(2, "0");
                return `${year}_${month}_${day}`; // e.g. 2019_12_07
            }
            const activePlayers = []
            allGames.forEach(game => {
                const data = game
                const redStrikerId = data.redTeam.striker
                const redKeeperId = data.redTeam.keeper
                const blueStrikerId = data.blueTeam.striker
                const blueKeeperId = data.blueTeam.keeper 
                const redStrikerNick = rootState.User.allUsers[redStrikerId].nickname
                const redKeeperNick = rootState.User.allUsers[redKeeperId].nickname
                const blueStrikerNick = rootState.User.allUsers[blueStrikerId].nickname
                const blueKeeperNick = rootState.User.allUsers[blueKeeperId].nickname
                data.redTeam.striker = redStrikerNick
                data.redTeam.keeper = redKeeperNick
                data.blueTeam.striker = blueStrikerNick
                data.blueTeam.keeper = blueKeeperNick
                pushUnique(activePlayers, rootState.User.allUsers[redStrikerId])
                pushUnique(activePlayers, rootState.User.allUsers[redKeeperId])
                pushUnique(activePlayers, rootState.User.allUsers[blueStrikerId])
                pushUnique(activePlayers, rootState.User.allUsers[blueKeeperId])
                data.myDate = toMyDate(data.creationDate)
                window.allGames.push(data)
            })
            console.log("all games", window.allGames, activePlayers)
            console.log(activePlayers.map(a => a.nickname))

            const history = [];
            const firstDate = "2019_11_01"
            history[firstDate] = {}
            activePlayers.forEach(u => history[firstDate][u.nickname] = {
                nickname: u.nickname,
                avatar: u.avatar,
                ELO: 1000
            })
            console.log(history[firstDate])

            function groupBy(list, keyGetter) {
                const map = {};
                list.forEach((item) => {
                    const key = keyGetter(item);
                    const collection = map[key];
                    if (!collection) {
                        map[key] = [item];
                    } else {
                        collection.push(item);
                    }
                });
                return map;
            }

            const groupedBy = groupBy(window.allGames, game => game.myDate)

            const keys = ["2019_11_00", 
                          "2019_11_01", "2019_11_02", "2019_11_03", "2019_11_04", "2019_11_05", 
                          "2019_11_06", "2019_11_07", "2019_11_08", "2019_11_09", "2019_11_10", 
                          "2019_11_11", "2019_11_12", "2019_11_13", "2019_11_14", "2019_11_15", 
                          "2019_11_16", "2019_11_17", "2019_11_18", "2019_11_19", "2019_11_20", 
                          "2019_11_21", "2019_11_22", "2019_11_23", "2019_11_24", "2019_11_25", 
                          "2019_11_26", "2019_11_27", "2019_11_28", "2019_11_29", "2019_11_30", 
                          "2019_12_01", "2019_12_02", "2019_12_03", "2019_12_04", "2019_12_05", 
                          "2019_12_06", "2019_12_07", "2019_12_08", "2019_12_09", "2019_12_10", 
                          "2019_12_11", "2019_12_12", "2019_12_13", "2019_12_14", "2019_12_15", 
                          "2019_12_16", "2019_12_17" 
            ];

            for (var i = 1; i < keys.length ; ++i) {
                const date = keys[i]
                const prevDate = keys[i-1]
                if (!history[date]) {
                    history[date] = {}
                }
                if (groupedBy[date]) {
                    groupedBy[date].forEach(game => {
                        const winner = game.result.blue === 7 ? "blueTeam" : "redTeam"
                        const loser = game.result.blue === 7 ? "redTeam" : "blueTeam"
                        const elo = game.exchangedELO

                        const winnerStriker = game[winner].striker
                        const winnerKeeper = game[winner].keeper
                        const loserStriker = game[loser].striker
                        const loserKeeper = game[loser].keeper
                        if (!history[date][winnerStriker]) {
                            history[date][winnerStriker] = {
                                nickname: winnerStriker,
                                ELO: history[prevDate][winnerStriker].ELO + elo
                            }
                        } else {
                            history[date][winnerStriker].ELO = history[date][winnerStriker].ELO + elo
                        }
                        if (!history[date][winnerKeeper]) {
                            history[date][winnerKeeper] = {
                                nickname: winnerKeeper,
                                ELO: history[prevDate][winnerKeeper].ELO + elo
                            }
                        } else {
                            history[date][winnerKeeper].ELO = history[date][winnerKeeper].ELO + elo
                        }
                        if (!history[date][loserStriker]) {
                            history[date][loserStriker] = {
                                nickname: loserStriker,
                                ELO: history[prevDate][loserStriker].ELO - elo
                            }
                        } else {
                            history[date][loserStriker].ELO = history[date][loserStriker].ELO - elo
                        }
                        if (!history[date][loserKeeper]) {
                            history[date][loserKeeper] = {
                                nickname: loserKeeper,
                                ELO: history[prevDate][loserKeeper].ELO - elo
                            }
                        } else {
                            history[date][loserKeeper].ELO = history[date][loserKeeper].ELO - elo
                        }
                    })
                }
                activePlayers.forEach(p => {
                    if (!history[date][p.nickname]) {
                        history[date][p.nickname] = history[prevDate][p.nickname]
                    }
                })
            }

            console.log(history)
            commit("myHistory", history);
        }
    }
}
