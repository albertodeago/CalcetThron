<template>
  <div id="q-app">

    <!-- Loader -->
    <!-- TODO: add a transition to spinner -->
    <div class="loader-wrapper" v-if="isLoading" >
      <q-spinner color="primary" size="3em"/>
    </div>

    <!-- Message banner -->
    <div class="banner-wrapper">
      <q-banner inline-actions class="text-white bg-red" v-if="errorMessage">
        {{ errorMessage }}
        <template v-slot:action>
          <q-btn flat color="white" label="Dismiss" @click="dismissMessage"/>
        </template>
      </q-banner>
    </div>

    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'App',

  data() {
    return {
      ready: false
    }
  },

  computed: {
    ...mapGetters('Global', [ 'isLoading', 'errorMessage' ])
  },

  methods: {
    ...mapActions('Global', [ 'setErrorMessage', 'setLoading' ]),
    ...mapActions('Game', ['subscribeToGames']),
    ...mapActions('User', ['subscribeToUsers']),

    dismissMessage() {
      // TODO: add transition to banner enter and exit
      this.setErrorMessage("")
    }
  },
  
  async created() {

    firebase.auth().onAuthStateChanged(user => {
      console.log("USER LOGGED", user.uid)
      if (user) {
        this.$store.dispatch('User/getUser', user.uid).then(_user => {
          this.$store.commit('User/setUser', _user)
        }).catch(error => {
          console.error(error);
        })
      } else {
        // used logged out
      }
    })

    // download all useful informations (users, games.... )    
    try {
      // const gamesPromise = this.getAllGames()
      // const usersPromise = this.getAllUsers()

      // subscribe to realtime changes
      this.subscribeToGames()
      this.subscribeToUsers()

      await Promise.all(gamesPromise, usersPromise)
    } catch(e) {}

    this.ready = true
    this.setLoading(false)
  },

  mounted() {
    if(!this.ready){
      this.setLoading(true) // TODO: seems like this is not working as intended
    }
  }
}
</script>

<style>

.loader-wrapper {
  z-index: 9999;
  opacity: 0.5;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.banner-wrapper {
    position: absolute;
    top: 55px;
    left: 0;
    right: 0;
    z-index: 10;
}
</style>
