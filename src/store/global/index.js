export default {
    namespaced: true,
    state: {
        isLoading: false,
        errorMessage: '',
    },

    getters: {
        isLoading: state => state.isLoading,
        errorMessage: state => state.errorMessage
    },
    mutations: {
        setLoading(state, isLoading) { state.isLoading = isLoading },
        setErrorMessage(state, message) { state.errorMessage = message }
    },
    actions: {
        setLoading({ commit }, isLoading) {
            commit('setLoading', isLoading)
        },
        setErrorMessage({ commit }, message) {
            commit('setErrorMessage', message)
        }
    }
}