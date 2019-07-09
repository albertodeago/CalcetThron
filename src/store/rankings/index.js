export default {
    namespaced: true,

    state: {
        rankings: null,
        rankingsArray: [],
        collectionName: "rankings"
    },

    getters: {
        allRankings: state => state.rankings,
        allRankingsArray: state => state.rankingsArray
    },
    mutations: {
        setRankings(state, { rankings, users }) {
            const enrichedRankings = {}
            Object.values(rankings).forEach(rank => {
                enrichedRankings[rank.id] = {
                    ...rank,
                    ...users[rank.id]
                }
            })
            state.rankings = enrichedRankings
            state.rankingsArray = Object.values(enrichedRankings)
        },

        setSeason(state, season) {
            if (season.number === 0) {
                state.collectionName = "rankings"
            } else {
                state.collectionName = "seasons/season_" + season.number + "/rankings";
            }
        },

        emptyRankings(state) {
            state.allRankings = {}
            state.allRankingsArray = []
        }
    },
    actions: {
        async getRankings({ commit, state, rootState }) {
            const db = firebase.firestore()
            const rankingsCollection = db.collection(state.collectionName)

            const rankingsSnapshot = await rankingsCollection.get()
            const rankings = {}
            rankingsSnapshot.forEach(function(doc) {
                rankings[doc.id] = doc.data();
            });

            commit("setRankings", { rankings, users: rootState.User.allUsers })
        },

        selectSeason({ commit }, season) {
            commit("setSeason", season)
            commit("emptyRankings")
        }
    }
}