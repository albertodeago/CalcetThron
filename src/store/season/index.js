const collectionName = "seasons";

export default {
    namespaced: true,
    state: {
        selectedSeason: null,
        seasons: null,
        seasonsArray: []
    },

    getters: {
        selectedSeason: state => state.selectedSeason,
        seasons: state => state.seasons,
        seasonsArray: state => state.seasonsArray
    },
    mutations: {
        addSeasons(state, seasons) {
            if (state.seasons === null)
                state.seasons = {}

            Object.keys(seasons).forEach(key => {
                state.seasons[seasons[key].number] = seasons[key]
                state.seasonsArray.push(seasons[key])
            });
        },
        setSelectedSeason(state, season) {
            state.selectedSeason = season
        }
    },
    actions: {
        async getSeasons({ commit, dispatch }) {
            const db = firebase.firestore()
            const seasonsCollection = db.collection(collectionName)

            const seasons = {}
            const seasonsSnapshot = await seasonsCollection.get()
            seasonsSnapshot.forEach(doc => seasons[doc.id] = doc.data())
            commit('addSeasons', seasons)
            const currentSeasonKey = Object.keys(seasons).reduce((a, b) => seasons[a].number > seasons[b].number ? a : b)
            dispatch('setSeason', seasons[currentSeasonKey])
        },

        setSeason({ commit, dispatch }, season) {
            dispatch("Game/selectSeason", season, { root: true })
            dispatch("Rankings/selectSeason", season, { root: true })
            commit("setSelectedSeason", season)
        }
    }
}