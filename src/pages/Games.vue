<template>
    <div class="q-pa-md row items-start q-gutter-md text-white">
        <q-card class="my-card" v-for="game in allGames" :key="game.id">
            <!-- {{ game }} -->
            <q-card-section v-ripple>
                <div class="game">
                    <div class="game__back game__back--red"></div>
                    <div class="game__back game__back--blue"></div>

                    <div class="game__team game__team--red">
                        <div class="game__team__top">
                            <div class="game__team__top__player game__team__player">
                                <q-item>
                                    <q-item-section top avatar>
                                        <q-avatar>
                                            <q-img :src="getAvatar(game.redTeam.striker)" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getUsername(game.redTeam.striker) }}</q-item-label>
                                        <q-item-label caption lines="1" class="text-white">Striker</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>

                        <div class="game__team__mid text-h3">{{ game.result.red }}</div>

                        <div class="game__team__bottom">
                            <div class="game__team__bottom__player game__team__player">
                                <q-item>
                                    <q-item-section top avatar>
                                        <q-avatar>
                                            <q-img :src="getAvatar(game.redTeam.keeper)" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ getUsername(game.redTeam.keeper) }}</q-item-label>
                                        <q-item-label caption lines="1" class="text-white">Goalkeeper</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                    </div>
                    <div class="game__team game__team--blue">
                        <div class="game__team__top">
                            <div class="game__team__top__player game__team__player">
                                <q-item>
                                    <q-item-section>
                                        <q-item-label>{{ getUsername(game.blueTeam.striker) }}</q-item-label>
                                        <q-item-label caption lines="1" class="text-white">Striker</q-item-label>
                                    </q-item-section>
                                    <q-item-section top avatar>
                                        <q-avatar>
                                            <q-img :src="getAvatar(game.blueTeam.striker)" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>

                        <div class="game__team__mid text-h3">{{ game.result.blue }}</div>

                        <div class="game__team__bottom">
                            <div class="game__team__bottom__player game__team__player">
                                <q-item>
                                    <q-item-section>
                                        <q-item-label>{{ getUsername(game.blueTeam.keeper) }}</q-item-label>
                                        <q-item-label caption lines="1" class="text-white">Goalkeeper</q-item-label>
                                    </q-item-section>
                                    <q-item-section top avatar>
                                        <q-avatar>
                                            <q-img :src="getAvatar(game.blueTeam.keeper)" :ratio="1" />
                                        </q-avatar>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                    </div>

                </div>
            </q-card-section>
        </q-card>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="secondary" @click="openModal" />
        </q-page-sticky>

        <q-dialog v-model="showModal" persistent maximized transition-show="slide-up" transition-hide="slide-down">
            <q-card>
                <q-bar>
                    <q-space />
                    <q-btn flat icon="close" @click="closeModal"></q-btn>
                </q-bar>

                <q-card-section>
                    <div class="text-h4">Add a game</div>
                </q-card-section>

                <q-card-section>
                    <!-- <q-stepper v-model="step" ref="stepper" contracted color="primary" animated> -->
                        <!-- <q-step :name="1" title="Insert players" icon="face" :done="step > 1"> -->
                        <template v-if="step === 1">
                            <div class="text-h6">Insert the players of the game</div>
                            
                            <q-select class="q-my-md" filled v-model="redGoalKeeper" :options="usersArray" label="Red goalkeeper">
                                <template v-slot:option="user">
                                    <q-item v-bind="user.itemProps" v-on="user.itemEvents">
                                        <q-item-section avatar>
                                            <q-avatar>
                                                <q-img :src="user.opt.avatar" :ratio="1" />
                                            </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label v-html="user.opt.nickname" />
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            
                            <q-select class="q-my-md" filled v-model="redStriker" :options="usersArray" label="Red striker">
                                <template v-slot:option="user">
                                    <q-item v-bind="user.itemProps" v-on="user.itemEvents">
                                        <q-item-section avatar>
                                            <q-avatar>
                                                <q-img :src="user.opt.avatar" :ratio="1" />
                                            </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label v-html="user.opt.nickname" />
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            
                            <q-select class="q-my-md" filled v-model="blueGoalKeeper" :options="usersArray" label="Blue goalkeeper">
                                <template v-slot:option="user">
                                    <q-item v-bind="user.itemProps" v-on="user.itemEvents">
                                        <q-item-section avatar>
                                            <q-avatar>
                                                <q-img :src="user.opt.avatar" :ratio="1" />
                                            </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label v-html="user.opt.nickname" />
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            
                            <q-select class="q-my-md" filled v-model="blueStriker" :options="usersArray" label="Blue striker">
                                <template v-slot:option="user">
                                    <q-item v-bind="user.itemProps" v-on="user.itemEvents">
                                        <q-item-section avatar>
                                            <q-avatar>
                                                <q-img :src="user.opt.avatar" :ratio="1" />
                                            </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label v-html="user.opt.nickname" />
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </template>
                        <!-- </q-step> -->

                        <!-- <q-step :name="2" title="Insert scores" icon="accessible" :done="step > 2"> -->
                            <template v-if="step === 2">
                                <div class="text-h6">Insert the scores of the match</div>
                                <q-input v-model="redGoalKeeperGoals"       type="number" :label="'Goals made by ' + redGoalKeeper.nickname" />
                                <q-input v-model="redStrikerGoals"          type="number" :label="'Goals made by ' + redStriker.nickname" />
                                <q-input v-model="redGoalKeeperAutogoals"   type="number" :label="'Autogoals made by ' + redGoalKeeper.nickname" />
                                <q-input v-model="redStrikerAutogoals"      type="number" :label="'Autogoals made by ' + redStriker.nickname" />
                                
                                <q-input v-model="blueGoalKeeperGoals"      type="number" :label="'Goals made by ' + blueGoalKeeper.nickname" />
                                <q-input v-model="blueStrikerGoals"         type="number" :label="'Goals made by ' + blueStriker.nickname" />
                                <q-input v-model="blueGoalKeeperAutogoals"  type="number" :label="'Autogoals made by ' + blueGoalKeeper.nickname" />
                                <q-input v-model="blueStrikerAutogoals"     type="number" :label="'Autogoals made by ' + blueStriker.nickname" />
                            </template>
                        <!-- </q-step> -->

                        <!-- <q-step :name="3" title="Create an ad" icon="add_comment"> -->
                            <template v-if="step === 3">
                                <div class="text-h6">Confirm data</div>
                                <div class="text-subtitle1">Red team</div>
                                <div>{{ redGoalKeeper.nickname }} - {{ redStriker.nickname }}</div>
                                <div>Goals: {{ parseInt(redGoalKeeperGoals) + parseInt(redStrikerGoals) }}</div>
                                
                                <div class="text-subtitle1">Blue team</div>
                                <div>{{ blueGoalKeeper.nickname }} - {{ blueStriker.nickname }}</div>
                                <div>Goals: {{ (parseInt(blueGoalKeeperGoals) || 0) + (parseInt(blueStrikerGoals) || 0) }}</div>
                            </template>

                        <!-- </q-step> -->

                        <!-- <template v-slot:navigation>
                            <q-stepper-navigation> -->
                            <q-separator style="margin: 20px 0" />
                            <template>
                                <q-btn @click="nextStep()" color="primary" :disable="nextStepDisabled" :label="step === 3 ? 'Save' : 'Continue'" />
                                <q-btn v-if="step > 1" flat color="primary" @click="previousStep()" label="Back" class="q-ml-sm" />
                            </template>
                            <!-- </q-stepper-navigation> -->
                        <!-- </template> -->
                    <!-- </q-stepper> -->
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { Game } from "../models"

const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88"

export default {
    data() {
        return {
            showModal: false,
            step: 1,

            /* values to add a game */
            // players
            redGoalKeeper: null,
            redStriker: null,
            blueGoalKeeper: null,
            blueStriker: null,
            // scores
            redGoalKeeperGoals: null,
            redStrikerGoals: null,
            redGoalKeeperAutogoals: null,
            redStrikerAutogoals: null,
            blueGoalKeeperGoals: null,
            blueStrikerGoals: null,
            blueGoalKeeperAutogoals: null,
            blueStrikerAutogoals: null,
            /* end values to add a game */
        }
    },
    computed: {
        ...mapGetters('Game', ['allGames']),
        ...mapGetters('User', ['allUsers']),

        usersArray() {
            if(this.allUsers === null) 
                return []

            const usersArray = Object.values(this.allUsers)
            usersArray.forEach(u => {
                u.value = u.id,
                u.label = u.nickname,
                u.avatar = u.avatar,
                u.disable = this.alreadySelectedUsers.indexOf(u.id) !== -1
            })
            return usersArray
        },

        alreadySelectedUsers() {
            const res = []
            this.redGoalKeeper && res.push(this.redGoalKeeper.id)
            this.redStriker && res.push(this.redStriker.id)
            this.blueGoalKeeper && res.push(this.blueGoalKeeper.id)
            this.blueStriker && res.push(this.blueStriker.id)
            return res
        },

        nextStepDisabled() {
            if (this.step === 1)
                return !this.redGoalKeeper || !this.redStriker || !this.blueGoalKeeper || !this.blueStriker
            else if(this.step === 2) {
                const _redGoalKeeperGoals = parseInt(this.redGoalKeeperGoals) || 0
                const _redStrikerGoals = parseInt(this.redStrikerGoals) || 0
                const _redGoalKeeperAutogoals = parseInt(this.redGoalKeeperAutogoals) || 0
                const _redStrikerAutogoals = parseInt(this.redStrikerAutogoals) || 0
                const _blueGoalKeeperGoals = parseInt(this.blueGoalKeeperGoals) || 0
                const _blueStrikerGoals = parseInt(this.blueStrikerGoals) || 0
                const _blueGoalKeeperAutogoals = parseInt(this.blueGoalKeeperAutogoals) || 0
                const _blueStrikerAutogoals = parseInt(this.blueStrikerAutogoals) || 0

                // Too many red team goals
                if(_redGoalKeeperGoals + _redStrikerGoals + _blueGoalKeeperAutogoals + _blueStrikerAutogoals > 7)
                    return true
                // Too many blue team goals
                if(_blueGoalKeeperGoals + _blueStrikerGoals + _redGoalKeeperAutogoals + _redStrikerAutogoals > 7)
                    return true
                // Both at 7
                if( _redGoalKeeperGoals + _redStrikerGoals + _blueGoalKeeperAutogoals + _blueStrikerAutogoals === 7 
                    &&
                    _blueGoalKeeperGoals + _blueStrikerGoals + _redGoalKeeperAutogoals + _redStrikerAutogoals === 7)
                    return true
                // Noone at 7
                if( _redGoalKeeperGoals + _redStrikerGoals + _blueGoalKeeperAutogoals + _blueStrikerAutogoals < 7 
                    &&
                    _blueGoalKeeperGoals + _blueStrikerGoals + _redGoalKeeperAutogoals + _redStrikerAutogoals < 7)
                    return true

            }

            return false
        }
    },
    methods: {
        ...mapActions('Game', ['saveGame']),

        getUsername(id) {
            return this.allUsers === null ? "Loading" : this.allUsers[id].nickname
        },
        getAvatar(id) {
            return this.allUsers === null ? defaultAvatar : this.allUsers[id].avatar
        },

        openModal() {
            this.showModal = true
            this.step = 1
        },
        closeModal() {
            this.showModal = false
            this.step = 1
        },

        previousStep() {
            this.step--
        },

        async nextStep() {
            if(this.step < 3)
                // this.$refs.stepper.next()
                this.step++
            else {
                const _redGoalKeeperGoals = parseInt(this.redGoalKeeperGoals) || 0
                const _redStrikerGoals = parseInt(this.redStrikerGoals) || 0
                const _redGoalKeeperAutogoals = parseInt(this.redGoalKeeperAutogoals) || 0
                const _redStrikerAutogoals = parseInt(this.redStrikerAutogoals) || 0
                const _blueGoalKeeperGoals = parseInt(this.blueGoalKeeperGoals) || 0
                const _blueStrikerGoals = parseInt(this.blueStrikerGoals) || 0
                const _blueGoalKeeperAutogoals = parseInt(this.blueGoalKeeperAutogoals) || 0
                const _blueStrikerAutogoals = parseInt(this.blueStrikerAutogoals) || 0

                // prepare data to save on DB
                const gameObj = {
                    redTeam: {
                        striker: this.redStriker.id,
                        keeper: this.redGoalKeeper.id
                    },
                    blueTeam: {
                        striker: this.blueStriker.id,
                        keeper: this.blueGoalKeeper.id
                    },
                    result: {
                        blue: _blueStrikerGoals + _blueGoalKeeperGoals + _redStrikerAutogoals + _redGoalKeeperAutogoals,
                        red: _redStrikerGoals + _redGoalKeeperGoals + _blueStrikerAutogoals + _blueGoalKeeperAutogoals
                    },
                    redKeeperGoals: _redGoalKeeperGoals,
                    redKeeperAutogoals: _redGoalKeeperAutogoals,
                    redStrikerGoals: _redStrikerGoals,
                    redStrikerAutogoals: _redStrikerAutogoals,
                    blueKeeperGoals: _blueGoalKeeperGoals,
                    blueKeeperAutogoals: _blueGoalKeeperAutogoals,
                    blueStrikerGoals: _blueStrikerGoals,
                    blueStrikerAutogoals: _blueStrikerAutogoals
                }

                // Save the game to DB and close modal
                try {
                    await this.saveGame(gameObj)
                } catch(e) {}

                this.closeModal()
            }
        }
    }
}
</script>

<style lang="stylus">
@import "../css/quasar.variables.styl"

.my-card 
    width: 100%
    position: relative

.game
    &__back
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        &--red 
            background-color $secondary
        &--blue
            background-color $primary
            clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%)

    &__team
        &--red 
            width: 57%;
            -webkit-clip-path: polygon(0 0, 97% 0, 68% 100%, 0 100%);
            clip-path: polygon(0 0, 100% 0, 73% 100%, 0 100%);
        .game__team__mid 
            text-align: right;
            margin-right: 15%;

        &--blue 
            position: absolute;
            width: 53%;
            top: 16px;
            right: 16px;
            text-align: right;
            -webkit-clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%);
            clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%);
            .game__team__mid 
                text-align: left;
                width: 100%;
                margin-left: 20%;

</style>
