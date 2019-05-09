import { User, Game } from "src/models"
// import Utils from "src/Utils"

export default {
    namespaced: true,
    state: {
        allGames: null,
        allGamesArray: [],
        currentGame: null
    },

    getters: {
        allGames: state => state.allGames,
        allGamesArray: state => state.allGamesArray,
        currentGame: state => state.currentGame
    },
    mutations: {
        setAllGames(state, games) {
            state.allGames = games
        },
        setCurrentGame(state, game) {
            state.currentGame = game
        },
        addGame(state, game) {
            if (!state.allGames) {
                state.allGames = {}
            }

            state.allGames[game.id] = game

            if (!state.allGamesArray.find(g => g.id === game.id))
                state.allGamesArray.push(game)
        }
    },
    actions: {

        async saveGame({ commit, dispatch }, gameObj) {
            const db = firebase.firestore()
            const gamesCollection = db.collection("games")

            try {
                await gamesCollection.add(gameObj)
            } catch (error) {
                console.error(error)
                dispatch("Global/setErrorMessage", error.message, { root: true })
                return error.message
            }
        },

        async subscribeToGames({ commit, dispatch }) {
            const db = firebase.firestore()
            const gamesCollection = db.collection("games")

            gamesCollection.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        // Added a new game, we have to push into allGames
                        // console.log("New game: ", change.doc.data(), change.doc.id)
                        const newGame = new Game({ id: change.doc.id, ...change.doc.data() })
                        commit("addGame", newGame)
                    }
                    // if (change.type === "modified") {    // the app doesn't allow this action yet
                    //     // A game was modified, we should update the allGames right index
                    // }
                    // if (change.type === "removed") {        // the app doesn't allow this action yet
                    // A game was removed, we should remove from allGames
                    // }
                })
            })
        }
    }
}