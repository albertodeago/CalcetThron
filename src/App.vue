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
      
    }
  },

  computed: {
    ...mapGetters('Global', [ 'isLoading', 'errorMessage' ]),
    ...mapGetters('Seasons', ['selectedSeason'])
  },

  methods: {
    ...mapActions('Global', [ 'setErrorMessage', 'setLoading' ]),
    ...mapActions('User', ['subscribeToUsers', 'getAllUsers']),
    ...mapActions('Seasons', ['getSeasons']),
    ...mapActions('Rankings', ['getRankings', 'subscribeToRankings']),

    dismissMessage() {
      // TODO: add transition to banner enter and exit
      this.setErrorMessage("")
    }
  },

  watch: {
    /**
     * When the user select a season, we get the rankings of that season and subscribe to it's changes.
     */
    selectedSeason(season) {
      this.getRankings().then(() => {
        this.subscribeToRankings()
      })
    }
  },
  
  async created() {

    firebase.auth().onAuthStateChanged(user => {
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
    this.getAllUsers();
    this.getSeasons();
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
