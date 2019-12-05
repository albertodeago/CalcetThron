<template>
    <div class="season-container">
        <q-tabs v-model="tab" inline-label class="bg-grey-3" align="justify" narrow-indicator>
            <q-route-tab icon="list" name="games" to="/games" exact />
            <q-route-tab icon="whatshot" name="elo" to="/elo" exact v-if="selectedSeason && selectedSeason.number !== 0"/>
            <q-route-tab icon="emoji_events" name="awards" to="/awards" exact v-if="selectedSeason && selectedSeason.number !== 0"/>
            <q-route-tab icon="bar_chart" name="statistics" to="/statistics" exact />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="games">
                <games></games>
            </q-tab-panel>
            
            <q-tab-panel name="elo">
                <rankings></rankings>
            </q-tab-panel>
            
            <q-tab-panel name="awards">
                <awards></awards>
            </q-tab-panel>

            <q-tab-panel name="statistics">
                <statistics></statistics>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { Game } from "../models"
import GameComponent from "./Games.vue"
import StatisticsComponent from "./Statistics.vue"
import RankingsComponent from "./Rankings.vue"
import AwardsComponent from "./Awards.vue"

const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88"

export default {
    data() {
        return {
            tab: "games"
        }
    },
    components: {
        "games": GameComponent,
        "statistics": StatisticsComponent,
        "rankings": RankingsComponent,
        "awards": AwardsComponent
    },
    computed: {
        ...mapGetters('Game', ['gamesArray']),
        ...mapGetters('User', ['allUsersArray', 'allUsers', 'user']),
        ...mapGetters('Seasons', ['selectedSeason']),
    },

    methods: {
        ...mapActions('Game', ['saveGame', 'getGames']),
        ...mapActions('Global', ['setLoading']),
    },

    watch: {
        selectedSeason(val) {
            if (val.number === 0 && (this.tab === "elo" || this.tab === "awards"))
                this.tab = "games"
        }
    }
}
</script>

<style lang="stylus">

</style>