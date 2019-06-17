<template>
    <q-list>

        <!-- avatar and user profile -->
        <!-- <q-item clickable v-ripple tag="a" :href="'#/' + computedHref" @click="onClick"> -->
        <q-item clickable v-ripple @click="openSelf">
          <q-item-section avatar>
            <q-avatar>
              <q-img :src="computedAvatar" :ratio="1" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ username }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />
        
        <q-item clickable v-ripple tag="a" href="#/games" @click="onClick">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Games</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="a" href="#/ranking" @click="onClick">
          <q-item-section avatar>
            <q-icon name="format_list_numbered" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Ranking</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="a" href="#/charts" @click="onClick">
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Charts</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-separator />

        <q-item clickable v-ripple tag="a" href="#/settings" @click="onClick">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>

    </q-list>
</template>

<script>
import Store from "../store"
import {mapGetters, mapActions, mapMutations} from "vuex"

const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88"

export default {
    data() {
        return {

        }
    },
    computed: {
      ...mapGetters('User', [
        'user'
      ]),

      username() {
          return this.user ? this.user.nickname : "Anonymous - login/register"
      },
      
      computedHref() {
        if (this.user !== null) {
          return "user/" + this.user.id
        } else {
          return "login"
        }
      },

      computedAvatar() {
        return this.user !== null ? this.user.avatar : defaultAvatar
      }
    },
    methods: {
      ...mapMutations('User', ['setSelectedUser']),
      ...mapActions('Global', ['setLoading']),

      onClick() {
        this.$emit("navigated");
      },

      openSelf() {
        if(this.user === null) {
          // anonymous user, wants to login
          this.$router.push('login')
        } else {
          // go to page of the current logged user
          this.setSelectedUser(this.user)
          this.$router.push(`user/${this.user.id}`)
        }
      }
    }
}
</script>

<style lang="stylus">

</style>


