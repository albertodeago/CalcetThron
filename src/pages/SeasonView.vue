<template>
    <div>
        <q-tabs v-model="tab" inline-label class="bg-grey-3" align="justify" narrow-indicator>
            <q-tab name="games" icon="list" label="Games" />
            <q-tab name="statistics" icon="bar_chart" label="Statistics" />
            <q-tab name="elo" icon="whatshot" label="Elo" v-if="selectedSeason.number !== 0" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="games">
                <games></games>
            </q-tab-panel>

            <q-tab-panel name="statistics">
                <ranking></ranking>
            </q-tab-panel>

            <q-tab-panel name="elo">
                TODO: has to be done yet
                <div v-for="rank in allRankingsArray" :key="rank.id">
                    {{ rank.nickname }} => {{ rank.ELO }}
                </div>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { Game } from "../models"
import GameComponent from "./Games.vue"
import RankingComponent from "./Ranking.vue"

const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88"

export default {
    data() {
        return {
            tab: "games"
        }
    },
    components: {
        "games": GameComponent,
        "ranking": RankingComponent
    },
    computed: {
        ...mapGetters('Game', ['gamesArray']),
        ...mapGetters('User', ['allUsersArray', 'allUsers', 'user']),
        ...mapGetters('Seasons', ['selectedSeason']),
        ...mapGetters("Rankings", ["allRankingsArray"]), // TODO: remove this
    },

    methods: {
        ...mapActions('Game', ['saveGame', 'getGames']),
        ...mapActions('Global', ['setLoading']),
    },

    watch: {
        selectedSeason(val) {
            if (val.number === 0 && this.tab === "elo")
                this.tab = "games"
        }
    },

    created() {

    }
}
</script>

<style lang="stylus">

</style>