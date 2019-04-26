import { User, Game } from "src/models"
// import Utils from "src/Utils"

export default {
    namespaced: true,
    state: {
        allGames: null,
        currentGame: null
    },

    getters: {
        allGames: state => state.allGames,
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
        }
    },
    actions: {
        // Never used
        // async getAllGames({ commit, dispatch }) {
        //     const db = firebase.firestore()
        //     const gamesCollection = db.collection("games")

        //     try {
        //         const gamesSnapshot = await gamesCollection.get()
        //         let games = {}
        //         gamesSnapshot.forEach(function(doc) {
        //             // doc.data() is never undefined for query doc snapshots
        //             games[doc.id] = new Game({ id: doc.id, ...doc.data() })
        //         });
        //         commit("setAllGames", games);

        //         return games;

        //     } catch (error) {
        //         console.error(error)
        //         dispatch("Global/setErrorMessage", error.message, { root: true })
        //         return error.message
        //     }
        // },

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