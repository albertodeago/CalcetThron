import Config from "src/Config"

export default {
    namespaced: true,

    state: {
        rankings: null,
        rankingsArray: [],
        collectionName: Config.devMode ? "DEV_rankings" : "rankings",
        rankingListener: null
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

        emptyRankings(state) {
            state.allRankings = {}
            state.allRankingsArray = []
        },

        updateRanking(state, rank) {
            // update object state
            let rankInObj = state.rankings[rank.id]
            if (rankInObj) {
                Object.assign(rankInObj, rank)
            }

            // update array state
            let rankInArray = state.rankingsArray.find(r => r.id === rank.id)
            if (rankInArray) {
                Object.assign(rankInArray, rank)
            }
        },

        setSeason(state, season) {
            if (Config.devMode) {
                if (season.number === 0) {
                    state.collectionName = "DEV_rankings"
                } else {
                    state.collectionName = "DEV_seasons/season_" + season.number + "/DEV_rankings";
                }
            } else {
                if (season.number === 0) {
                    state.collectionName = "rankings"
                } else {
                    state.collectionName = "seasons/season_" + season.number + "/rankings";
                }
            }
        },
        
        setRankingsListener(state, listener) {
            if (state.rankingListener) {
                state.rankingListener()
                state.rankingListener = null
            }
            state.rankingListener = listener
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

        subscribeToRankings({ commit, state }) {
            const db = firebase.firestore()
            const rankingsCollection = db.collection(state.collectionName)
            let listener = rankingsCollection.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "modified") {
                        const modifiedRank = {
                            id: change.doc.id,
                            ...change.doc.data()
                        }
                        commit("updateRanking", modifiedRank)
                    }
                })
            })
            commit("setRankingsListener", listener)
        },

        selectSeason({ commit }, season) {
            commit("setSeason", season)
            commit("emptyRankings")
        }
    }
}