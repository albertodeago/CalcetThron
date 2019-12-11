import Config from "src/Config"


export default {
    namespaced: true,
    state: {
        collectionName: null,
        history: null,
    },

    getters: {
        getHistory: (state) => state.history
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
        }

    },
    actions: {

        async getHistory({ state, commit, rootState }) {
            if (!rootState.Seasons.selectedSeason || !state.collectionName)
                return

            const db = firebase.firestore()
            const historyCollection = db.collection(state.collectionName)

            const historySnapshot = await historyCollection.get()
            const days = {}
            historySnapshot.forEach(snap => days[snap.id] = snap.data())

            commit("setHistory", days)
        },

        selectSeason({ commit }, season) {
            commit("setSeason", season)
            // commit("emptyGames")
        }
    }
}
