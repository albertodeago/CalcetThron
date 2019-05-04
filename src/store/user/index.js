import { User } from "src/models"
import Utils from "src/Utils"

const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88";

export default {
    namespaced: true,
    state: {
        user: null,
        selectedUser: null,
        allUsers: null
    },

    getters: {
        user: state => state.user,
        selectedUser: state => state.selectedUser,
        allUsers: state => state.allUsers
    },
    mutations: {
        setUser(state, user) {
            state.user = (!user || user instanceof User) ? user : new User(user)
        },

        setSelectedUser(state, user) {
            state.selectedUser = (!user || user instanceof User) ? user : new User(user)
        },

        setAllUsers(state, users) {
            state.allUsers = users
        },

        addUser(state, user) {
            if (!state.allUsers)
                state.allUsers = {}

            state.allUsers[user.id] = user
        }
    },
    actions: {

        // Never used
        // async getAllUsers({ commit, dispatch }) {
        //     const db = firebase.firestore()
        //     const usersCollection = db.collection("users")

        //     try {
        //         let users = {}
        //         const usersSnapshot = await usersCollection.get()
        //         usersSnapshot.forEach(doc => users[doc.id] = new User(doc.data()))
        //         commit('setAllUsers', users)

        //         return users
        //     } catch (error) {
        //         console.error(error)
        //         dispatch("Global/setErrorMessage", error.message, { root: true })
        //         return error.message
        //     }
        // },

        async register({ commit, dispatch }, { email, password, nickname, image }) {
            const db = firebase.firestore()
            const usersCollection = db.collection("users")

            try {
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
                const userId = response.user.uid
                const creationDate = new Date().getTime()

                const user = new User({
                    id: userId,
                    nickname,
                    email,
                    password: Utils.b64EncodeUnicode(password),
                    creationDate,
                    lastUpdate: creationDate,
                    lastLogin: creationDate,
                })
                if (!image) {
                    user.avatar = defaultAvatar
                } else {
                    // Upload the image, get the url and then add the user
                    try {
                        const storageRef = firebase.storage().ref();
                        const imageRef = storageRef.child("avatars/" + userId + ".jpg")

                        const imageSnapshot = await imageRef.put(image)
                        user.avatar = await imageSnapshot.ref.getDownloadURL()
                    } catch (error) {
                        console.error(error)
                        dispatch("Global/setErrorMessage", error.message, { root: true })
                            // we show the error but continue to try to create the user
                    }
                }
                await usersCollection.doc(userId).set(user.toJSON())
                commit("setUser", user)

                return user
            } catch (error) {
                console.error(error)
                dispatch("Global/setErrorMessage", error.message, { root: true })
                return error.message
            }
        },

        async saveAvatar({}, { userId, image }) {
            const db = firebase.firestore()
            const usersCollection = db.collection("users")
            const storageRef = firebase.storage().ref()
            const imageRef = storageRef.child("avatars/" + userId + ".jpg")

            try {
                const imageSnapshot = await imageRef.put(image)
                const avatarUrl = await imageSnapshot.ref.getDownloadURL()
                await usersCollection.doc(userId).update({
                    avatar: avatarUrl
                })

                return true
            } catch (error) {
                console.error(error)
                dispatch("Global/setErrorMessage", error.message, { root: true })
                return error.message
            }
        },

        async login({ commit, dispatch }, { email, password }) {
            try {
                const response = await firebase.auth().signInWithEmailAndPassword(email, password)
                const user = await dispatch('getUser', response.user.uid)
                commit('setUser', user)
                    // TODO: the user logged in, we should update the lastLogin property

                return user
            } catch (error) {
                console.error(error);
                dispatch("Global/setErrorMessage", error.message, { root: true })
                return error.message
            }
        },

        async logout({ commit, dispatch }) {
            try {
                await firebase.auth().signOut()
                commit('setUser', null);

                return null
            } catch (error) {
                console.error(error);
                dispatch('Global/setErrorMessage', error.message)
                return error.message
            }
        },

        async getUser({ commit, rootState, dispatch }, firebaseUserUid) {
            const db = firebase.firestore();
            const usersCollection = db.collection('users');

            try {
                const snapshot = await usersCollection.doc(firebaseUserUid).get()
                const user = snapshot.data();

                return user
            } catch (error) {
                console.error(error);
                dispatch('Global/setErrorMessage', error.message)
                return error.message
            }
        },

        async subscribeToUsers({ commit, dispatch }) {
            const db = firebase.firestore()
            const usersCollection = db.collection("users")

            usersCollection.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        // Added a new user, we have to push into allUsers
                        // console.log("New user: ", change.doc.data(), change.doc.id)
                        const newUser = new User(change.doc.data())
                        commit("addUser", newUser)
                    }
                    // if (change.type === "modified") {    // the app doesn't allow this action yet
                    //      // An user was modified, we should update the allGames right index
                    // }
                    // if (change.type === "removed") {        // the app doesn't allow this action yet
                    // An user was removed, we should remove from allGames
                    // }
                })
            })
        }
    }
}