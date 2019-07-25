<template>
    <div class="">
        <template  v-if="!isLoading">
            <q-list bordered padding>
                <template v-for="(enrichedUser, index) in sortedRankings">
                    <q-item :key="enrichedUser.id" clickable @click="openUser(enrichedUser)">
                        <q-item-section top avatar>
                            <q-avatar>
                                <q-img :src="enrichedUser.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>{{ enrichedUser.nickname }}</q-item-label>
                            <q-item-label caption>Played games: {{ enrichedUser.played | tierize }}</q-item-label>
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
            </q-list>
        </template>
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
    
    filters: {
        tierize(value) {
            return value > 200 ? "200+": ""+value
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),
        ...mapGetters('Seasons', ['selectedSeason']),

        sortedRankings() {
            return this.allRankingsArray.slice().sort((a, b) => parseInt(b[this.sortBy].slice(0, -1)) - parseInt(a[this.sortBy].slice(0, -1)))
        }
    },

    watch: {
        async selectedSeason() {
            console.log("selected season watcher - rankings")
            this.setLoading(true)
            await this.getRankings()
            this.setLoading(false)
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


