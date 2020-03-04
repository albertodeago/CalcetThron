<template>
    <div class="">
        <template v-if="isReady">
            <template v-if="notEnoughData">
                <span class="text-h6">Not enough data, check this tab in some days</span>
            </template>
            <template v-else>
                <q-card class="my-card q-mb-md">
                    <q-card-section>
                        <div class="text-h6">Best autogoller</div>
                        <div class="text-subtitle2">Players with the highest number of autogoal per game</div>
                        <div class="text-body2">The average number of autogoals per game is shown</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-list>
                            <q-item>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <q-img :src="bestAutogoller[0].avatar" :ratio="1" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label>{{bestAutogoller[0].nickname}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label>{{bestAutogoller[0].autogoalAverage}}</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-expansion-item expand-separator label="Honorable mentions" >
                                <q-item v-for="player in bestAutogoller.slice(1, 4)" :key="player.id">
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <q-img :src="player.avatar" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{player.nickname}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>{{player.autogoalAverage}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                </q-card>

                <q-card class="my-card q-mb-md">
                    <q-card-section>
                        <div class="text-h6">Most effective strikers</div>
                        <div class="text-subtitle2">Players with the highest goals done as striker per game</div>
                        <div class="text-body2">The average number of goals per game as striker is shown</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-list>
                            <q-item>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <q-img :src="mostEffectiveStriker[0].avatar" :ratio="1" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label>{{mostEffectiveStriker[0].nickname}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label>{{mostEffectiveStriker[0].goalDoneAsStriker}}</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-expansion-item expand-separator label="Honorable mentions" >
                                <q-item v-for="player in mostEffectiveStriker.slice(1, 4)" :key="player.id">
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <q-img :src="player.avatar" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{player.nickname}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>{{player.goalDoneAsStriker}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                </q-card>

                <q-card class="my-card q-mb-md">
                    <q-card-section>
                        <div class="text-h6">Most effective goalkeepers</div>
                        <div class="text-subtitle2">Players with the highest goals done as goalkeeper per game</div>
                        <div class="text-body2">The average number of goals as goalkeeper per game is shown</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-list>
                            <q-item>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <q-img :src="mostEffectiveGoalkeeper[0].avatar" :ratio="1" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label>{{mostEffectiveGoalkeeper[0].nickname}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label>{{mostEffectiveGoalkeeper[0].goalDoneAsGoalkeeper}}</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-expansion-item expand-separator label="Honorable mentions" >
                                <q-item v-for="player in mostEffectiveGoalkeeper.slice(1, 4)" :key="player.id">
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <q-img :src="player.avatar" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{player.nickname}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>{{player.goalDoneAsGoalkeeper}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                </q-card>

                <q-card class="my-card q-mb-md">
                    <q-card-section>
                        <div class="text-h6">Best offensive player overall</div>
                        <div class="text-subtitle2">Players with the highest goals done per game, no matter the role</div>
                        <div class="text-body2">The average number of goals per game is shown</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-list>
                            <q-item>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <q-img :src="bestOffensiveOverall[0].avatar" :ratio="1" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label>{{bestOffensiveOverall[0].nickname}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label>{{bestOffensiveOverall[0].goalDone}}</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-expansion-item expand-separator label="Honorable mentions" >
                                <q-item v-for="player in bestOffensiveOverall.slice(1, 4)" :key="player.id">
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <q-img :src="player.avatar" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{player.nickname}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>{{player.goalDone}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                </q-card>

                <q-card class="my-card q-mb-md">
                    <q-card-section>
                        <div class="text-h6">Best defensive player overall</div>
                        <div class="text-subtitle2">Players with the lowest goals received per game, no matter the role</div>
                        <div class="text-body2">The average number of goals taken per game is shown</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-list>
                            <q-item>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <q-img :src="bestDefensiveOverall[0].avatar" :ratio="1" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label>{{bestDefensiveOverall[0].nickname}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label>{{bestDefensiveOverall[0].goalReceived}}</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-expansion-item expand-separator label="Honorable mentions" >
                                <q-item v-for="player in bestDefensiveOverall.slice(1, 4)" :key="player.id">
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <q-img :src="player.avatar" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{player.nickname}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>{{player.goalReceived}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                </q-card>

                <q-card class="my-card q-mb-md">
                    <q-card-section>
                        <div class="text-h6">Most effective player overall</div>
                        <div class="text-subtitle2">Players with the highest win rate, no matter the role</div>
                        <div class="text-body2">The win rate is shown</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-list>
                            <q-item>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <q-img :src="mostEffectiveOverall[0].avatar" :ratio="1" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label>{{mostEffectiveOverall[0].nickname}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label>{{mostEffectiveOverall[0].winRateLabel}}</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-expansion-item expand-separator label="Honorable mentions" >
                                <q-item v-for="player in mostEffectiveOverall.slice(1, 4)" :key="player.id">
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <q-img :src="player.avatar" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{player.nickname}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>{{player.winRateLabel}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                </q-card>

                <q-card class="my-card q-mb-md">
                    <q-card-section>
                        <div class="text-h6">Player with less than {{minGame}} games</div>
                        <div class="text-subtitle2">Those played are not taken in consideration in the above awards</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-list>
                            <q-expansion-item expand-separator label="Show players" >
                                <q-item v-for="player in lowGamePlayers" :key="player.id">
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <q-img :src="player.avatar" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{player.nickname}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>{{player.played}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-expansion-item>
                        </q-list>
                    </q-card-section>
                </q-card>
            </template>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data() {
        return {
            minGame: 10,      // number of games that users have to do to be taken in account in awards
            nGamesPerAward: 1 // set this to 10 if you want to show statistics for 10 games (e.g. goals done every 10 games)
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),
        ...mapGetters('Seasons', ['selectedSeason']),

        isReady() {
            return !this.isLoading && this.allRankingsArray.length
        },

        notEnoughData() {
            return this.activePlayers.length < 3
        },

        /**
         * Players with less than the minimum amount of game to be considered
         */
        lowGamePlayers() {
            const lgp = this.allRankingsArray.filter(a => a.played < this.minGame).sort((a, b) => b.played - a.played);
            // console.log(lgp);
            return lgp;
        },

        /**
         * Players considered active (played enough games)
         */
        activePlayers() {
            const actives = this.allRankingsArray.filter(a => a.played >= this.minGame)
            // console.log(actives);
            return actives;
        },
        
        /**
         * Top 4 players with the most highest ratio of autogoals per game
         */
        bestAutogoller() {
            // console.log("EFFECTIVE AUTOGOLLERS")
            const boh = this.activePlayers.filter(rank => rank.autogoalDone > 0).map(rank => {
                const perGame = ((rank.autogoalDone / rank.played) * this.nGamesPerAward).toFixed(2);
                // console.log(`${rank.nickname} - played: ${rank.played} autogoals: ${rank.autogoalDone} per game: ${perGame}`);
                return {
                    played: rank.played,
                    autogoalAverage: perGame,
                    nickname: rank.nickname,
                    avatar: rank.avatar
                }
            }).sort((a, b) => b.autogoalAverage - a.autogoalAverage).slice(0, 4);
            // console.log("autogollers", boh);
            return boh;
        },

        /**
         * Players with the most amount of goal per game as striker
         */
        mostEffectiveStriker() {
            // console.log("EFFECTIVE STRIKERS")
            const boh = this.activePlayers.filter(rank => rank.goalDoneAsStriker > 0).map(rank => {
                const perGame = ((rank.goalDoneAsStriker / rank.played) * this.nGamesPerAward).toFixed(2);
                // console.log(`${rank.nickname} - played: ${rank.played} goalAsStriker: ${rank.goalDoneAsStriker} per game: ${perGame}`);
                return {
                    played: rank.played,
                    goalDoneAsStriker: perGame,
                    nickname: rank.nickname,
                    avatar: rank.avatar
                }
            }).sort((a, b) => b.goalDoneAsStriker - a.goalDoneAsStriker).slice(0, 4);
            // console.log("effective strikers", boh);
            return boh;
        },

        /**
         * Players with the most amount of goal per game as goalkeeper
         */
        mostEffectiveGoalkeeper() {
            // console.log("EFFECTIVE GOALKEEPERS")
            const boh = this.activePlayers.filter(rank => rank.goalDoneAsGoalkeeper > 0).map(rank => {
                const perGame = ((rank.goalDoneAsGoalkeeper / rank.played) * this.nGamesPerAward).toFixed(2);
                // console.log(`${rank.nickname} - played: ${rank.played} goalAsKeeper: ${rank.goalDoneAsGoalkeeper} per game: ${perGame}`);
                return {
                    played: rank.played,
                    goalDoneAsGoalkeeper: perGame,
                    nickname: rank.nickname,
                    avatar: rank.avatar
                }
            }).sort((a, b) => b.goalDoneAsGoalkeeper - a.goalDoneAsGoalkeeper).slice(0, 4);
            // console.log("effective goalkeepers", boh);
            return boh;
        },

        /**
         * Players with the highest percentage of goals done per game (both goalkeepers and strikers)
         */
        bestOffensiveOverall() {
            // console.log("BEST OFFENSIVE OVERALL")
            const boh = this.activePlayers.filter(rank => rank.goalDone > 0).map(rank => {
                const perGame = ((rank.goalDone / rank.played) * this.nGamesPerAward).toFixed(2);
                // console.log(`${rank.nickname} - played: ${rank.played} goalDone: ${rank.goalDone} per game: ${perGame}`);
                return {
                    played: rank.played,
                    goalDone: perGame,
                    nickname: rank.nickname,
                    avatar: rank.avatar
                }
            }).sort((a, b) => b.goalDone - a.goalDone).slice(0, 4);
            // console.log("best offensive overall", boh);
            return boh;
        },

        /**
         * Players with the lowest percentage of goals received per game (both goalkeepers and strikers)
         */
        bestDefensiveOverall() {
            // console.log("BEST DEFENSIVE OVERALL")
            const boh = this.activePlayers.map(rank => {
                const perGame = ((rank.goalReceived / rank.played) * this.nGamesPerAward).toFixed(2);
                // console.log(`${rank.nickname} - played: ${rank.played} goalReceived: ${rank.goalReceived} per game: ${perGame}`);
                return {
                    played: rank.played,
                    goalReceived: perGame,
                    nickname: rank.nickname,
                    avatar: rank.avatar
                }
            }).sort((a, b) => a.goalReceived - b.goalReceived).slice(0, 4);
            // console.log("best defensive overall", boh);
            return boh;
        },

        /**
         * Players with the highest win rate
         */
        mostEffectiveOverall() {
            // console.log("BEST EFFECTIVE OVERALL")
            const boh = this.activePlayers.map(rank => {
                const winRate = parseInt(rank.winRate)
                // console.log(`${rank.nickname} - played: ${rank.played} winRate: ${rank.winRate}`);
                return {
                    played: rank.played,
                    winRate: winRate,
                    winRateLabel: `${winRate}%`,
                    nickname: rank.nickname,
                    avatar: rank.avatar
                }
            }).sort((a, b) => b.winRate - a.winRate).slice(0, 4);
            // console.log("most effective overall", boh);
            return boh;
        }
    }
}
</script>

<style lang="stylus">

</style>


