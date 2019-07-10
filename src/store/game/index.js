import { Game } from "src/models"

// const collectionName = "games";
// const collectionName = "seasons/season_2/games";

export default {
    namespaced: true,
    state: {
        collectionName: "games",
        games: null,
        gamesArray: [],
        currentGame: null
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
        setSeason(state, season) {
            if (season.number === 0) {
                state.collectionName = "games"
            } else {
                state.collectionName = "seasons/season_" + season.number + "/games";
            }
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
            const gamesCollection = db.collection("games")

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
        }

        // async subscribeToGames({ commit, dispatch, state }) {
        //     const db = firebase.firestore()
        //     const gamesCollection = db.collection(state.collectionName)

        //     gamesCollection.onSnapshot(snapshot => {
        //         snapshot.docChanges().forEach(change => {
        //             if (change.type === "added") {
        //                 // Added a new game, we have to push into allGames
        //                 // console.log("New game: ", change.doc.data(), change.doc.id)
        //                 const newGame = new Game({ id: change.doc.id, ...change.doc.data() })
        //                 commit("addGame", newGame)
        //             }
        //             // if (change.type === "modified") {    // the app doesn't allow this action yet
        //             //     // A game was modified, we should update the allGames right index
        //             // }
        //             // if (change.type === "removed") {        // the app doesn't allow this action yet
        //             // A game was removed, we should remove from allGames
        //             // }
        //         })
        //     })
        // }
    }
}