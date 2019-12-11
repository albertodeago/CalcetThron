<template>
    <div class="">
        <template  v-if="!isLoading">
            <q-list bordered padding>
                <template v-for="(enrichedUser, index) in enrichedForStatistics">
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
                            <q-item-label caption>Average per game: {{ enrichedUser.goalsDonePerGame }}</q-item-label>
                            <q-item-label caption>Goals received: {{ enrichedUser.goalReceived }}</q-item-label>
                            <q-item-label caption>Average per game: {{ enrichedUser.goalsReceivedPerGame }}</q-item-label>
                            <q-item-label caption>Autogoals done: {{ enrichedUser.autogoalDone }}</q-item-label>
                            <q-item-label caption>Average per game: {{ enrichedUser.autogoalsDonePerGame }}</q-item-label>
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
    
    // filters: {
    //     tierize(value) {
    //         return value > 100 ? "100+": ""+value
    //     }
    // },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),
        ...mapGetters('Seasons', ['selectedSeason']),

        sortedRankings() {
            return this.allRankingsArray.slice().sort((a, b) => parseInt(b[this.sortBy].slice(0, -1)) - parseInt(a[this.sortBy].slice(0, -1)))
        },

        enrichedForStatistics() {
            return this.sortedRankings.map(rank => {
                return {
                    ...rank,
                    goalsDonePerGame: (rank.goalDone / rank.played).toFixed(2),
                    goalsReceivedPerGame: (rank.goalReceived / rank.played).toFixed(2),
                    autogoalsDonePerGame: (rank.autogoalDone / rank.played).toFixed(2),
                }
            })
        }
    },

    methods: {
        openUser(enrichedUser) {
            this.$router.push(`user/${enrichedUser.id}`)
        }
    }
}
</script>

<style lang="stylus">

</style>


