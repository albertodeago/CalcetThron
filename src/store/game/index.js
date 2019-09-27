import { Game } from "src/models"
import Config from "src/Config"


export default {
    namespaced: true,
    state: {
        collectionName: Config.devMode ? "DEV_games" : "games",
        games: null,
        gamesArray: [],
        currentGame: null,
        gameListener: null
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
            console.log("setting listener")
            if (state.gameListener) {
                state.gameListener()
                state.gameListener = null
                console.log("detach listener")
            }
            console.log("set listener")
            state.gameListener = listener
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
                        console.log("Game modified", modifiedGame)
                        commit("updateGame", modifiedGame)
                    }
                    // if (change.type === "removed") {        // the app doesn't allow this action yet
                    // A game was removed, we should remove from allGames
                    // }
                })
            })
            commit("setGameListener", listener)
        }
    }
}
