<template>
  <div class="q-pa-md">
    <q-list bordered padding>
        <template v-for="(enrichedUser, index) in enrichedUsers">
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
    </q-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { RankingBuilder } from "../models"
import EnrichedUsersMixin from "../mixins/EnrichedUsers"

export default {
    data() {
        return {
            enrichedUsers: []
        }
    },

    mixins: [EnrichedUsersMixin],

    methods: {
        openUser(enrichedUser) {
            this.$router.push(`user/${enrichedUser.id}`)
        }
    }
}
</script>

<style lang="stylus">

</style>


