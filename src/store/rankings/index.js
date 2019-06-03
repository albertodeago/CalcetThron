export default {
    namespaced: true,

    state: {
        rankings: null,
        rankingsArray: []
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
        }
    },
    actions: {
        async getRankings({ commit, rootState }) {
            const db = firebase.firestore()
            const rankingsCollection = db.collection("rankings")

            const rankingsSnapshot = await rankingsCollection.get()
            const rankings = {}
            rankingsSnapshot.forEach(function(doc) {
                rankings[doc.id] = doc.data();
            });

            commit("setRankings", { rankings, users: rootState.User.allUsers })
        }
    }
}