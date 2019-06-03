<template>
  <div class="q-pa-md">
    <q-list bordered padding>
        <template  v-if="!isLoading">
            <template v-for="(enrichedUser, index) in sortedRankings">
                <q-item :key="enrichedUser.id" clickable @click="openUser(enrichedUser)">
                    <q-item-section top avatar>
                        <q-avatar>
                            <q-img :src="enrichedUser.avatar" :ratio="1" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{ enrichedUser.nickname }}</q-item-label>
                        <q-item-label caption>Played games: {{ enrichedUser.played }}</q-item-label>
                        <q-item-label caption>Goals done: {{ enrichedUser.goalDone }}</q-item-label>
                        <q-item-label caption>Goals received: {{ enrichedUser.goalReceived }}</q-item-label>
                        <q-item-label caption>Autogoals done: {{ enrichedUser.autogoalDone }}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                        <q-badge :label="'winrate: ' + enrichedUser.winRate" />
                    </q-item-section>

                </q-item>
                <q-separator spaced inset="item" v-if="index !== enrichedUsers.length-1" :key="enrichedUser.id + '_separator'" />
            </template>
        </template>
    </q-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data() {
        return {
            enrichedUsers: [],
            sortBy: "winRate"
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),

        sortedRankings() {
            return this.allRankingsArray.slice().sort((a, b) => parseInt(b[this.sortBy].slice(0, -1)) - parseInt(a[this.sortBy].slice(0, -1)))
        }
    },

    methods: {
        ...mapActions('Global', ['setLoading' ]),
        ...mapActions('Rankings', ['getRankings']),

        openUser(enrichedUser) {
            this.$router.push(`user/${enrichedUser.id}`)
        }
    },

    async created() {
        this.setLoading(true)
        await this.getRankings()
        this.setLoading(false)
    }
}
</script>

<style lang="stylus">

</style>


