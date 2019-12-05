<template>
    <div class="">
        <template  v-if="!isLoading">
            <h3>giocatori scartati per poche partite:</h3>
            <div v-for="player in lowGamePlayers" :key="player.id">{{ player.nickname }}</div>

            <h3>Best autogollers</h3>
            <div v-for="player in bestAutogoller" :key="player.id">{{ player.nickname }}: {{ player.autogoalAverage }} autogoals every 10 games</div>

            <h3>Most effective strikers</h3>
            <div v-for="player in mostEffectiveStriker" :key="player.id">{{ player.nickname }}: {{ player.goalDoneAsStriker }} goals every 10 games</div>

            <h3>Most effective goalkeeper</h3>
            <div v-for="player in mostEffectiveGoalkeeper" :key="player.id">{{ player.nickname }}: {{ player.goalDoneAsGoalkeeper }} goals every 10 games</div>

            <h3>Best offense overall</h3>
            giocatore con goaldoneaverage più alto in generale
            
            <h3>Best defence overall</h3>
            giocatore con goalreceivedaverage più basso in generale
            
            <h3>Most effective player overall (highest win ratio)</h3>
            <!-- <div v-for="player in mostEffectiveOverall" :key="player.id">{{ player.nickname }} - {{ player.winRatio }}</div> -->
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data() {
        return {
            minGame: 15,
            enrichedUsers: [],
            sortBy: "winRate",
        }
    },
    
    filters: {
        tierize(value) {
            return value > 100 ? "100+": ""+value
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),
        ...mapGetters('Seasons', ['selectedSeason']),

        /**
         * Players with less than the minimum amount of game to be considered
         */
        lowGamePlayers() {
            const lgp = this.allRankingsArray.filter(a => a.played <= this.minGame);
            console.log(lgp);
            return lgp;
        },

        /**
         * Players considered active (played enough games)
         */
        activePlayers() {
            const actives = this.allRankingsArray.filter(a => a.played > this.minGame)
            console.log(actives);
            return actives;
        },
        
        /**
         * Top 4 players with the most highest ratio of autogoals per game
         */
        bestAutogoller() {
            console.log("EFFECTIVE AUTOGOLLERS")
            const boh = this.activePlayers.slice().filter(rank => rank.autogoalDone > 0).map(rank => {
                const perTenGames = ((rank.autogoalDone / rank.played) * 10).toFixed(2);
                console.log(`${rank.nickname} - played: ${rank.played} autogoals: ${rank.autogoalDone} per 10 games: ${perTenGames}`);
                return {
                    played: rank.played,
                    autogoalAverage: perTenGames,
                    nickname: rank.nickname
                }
            }).sort((a, b) => b.autogoalAverage - a.autogoalAverage).slice(0, 4);
            console.log("autogollers", boh);
            return boh;
        },

        /**
         * Players with the most amount of goal per game as striker
         */
        mostEffectiveStriker() {
            console.log("EFFECTIVE STRIKERS")
            const boh = this.activePlayers.slice().filter(rank => rank.goalDoneAsStriker > 0).map(rank => {
                const perTenGames = ((rank.goalDoneAsStriker / rank.played) * 10).toFixed(2);
                console.log(`${rank.nickname} - played: ${rank.played} goalAsStriker: ${rank.goalDoneAsStriker} per 10 games: ${perTenGames}`);
                return {
                    played: rank.played,
                    goalDoneAsStriker: ((rank.goalDoneAsStriker / rank.played) * 10).toFixed(2),
                    nickname: rank.nickname
                }
            }).sort((a, b) => b.goalDoneAsStriker - a.goalDoneAsStriker).slice(0, 4);
            console.log("effective strikers", boh);
            return boh;
        },

        /**
         * Players with the most amount of goal per game as goalkeeper
         */
        mostEffectiveGoalkeeper() {
            console.log("EFFECTIVE GOALKEEPERS")
            const boh = this.activePlayers.slice().filter(rank => rank.goalDoneAsGoalkeeper > 0).map(rank => {
                const perTenGames = ((rank.goalDoneAsGoalkeeper / rank.played) * 10).toFixed(2);
                console.log(`${rank.nickname} - played: ${rank.played} goalAsKeeper: ${rank.goalDoneAsGoalkeeper} per 10 games: ${perTenGames}`);
                return {
                    played: rank.played,
                    goalDoneAsGoalkeeper: perTenGames,
                    nickname: rank.nickname
                }
            }).sort((a, b) => b.goalDoneAsGoalkeeper - a.goalDoneAsGoalkeeper)//.slice(0, 4);
            console.log("effective goalkeepers", boh);
            return boh;
        },

        mostEffectiveOverall() {

        },

            /*
                ELO: 1134
                autogoalDone: 15
                avatar: "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88"
                creationDate: 1572012490216
                disable: false
                email: "alessandro.ferlin@thron.com"
                gameManager: false
                goalDone: 130
                goalReceived: 211
                id: "19yb8dZXQTQgxFunzwuBE85lmZE2"
                label: "Ferla"
                lastLogin: 1572012490216
                lastUpdate: 1572012490216
                lost: 18
                lostGoalkeeper: 0
                lostStriker: 18
                nickname: "Ferla"
                password: "MTIzMTIz"
                played: 39
                playedGoalkeeper: 1
                playedStriker: 38
                value: "19yb8dZXQTQgxFunzwuBE85lmZE2"
                winRate: "54%"
                winRateGoalkeeper: "100%"
                winRateStriker: "53%"
                won: 21
                wonGoalkeeper: 1
                wonStriker: 20
            */
    }
}
</script>

<style lang="stylus">

</style>


