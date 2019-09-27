<template>
    <div class="">
        <transition-group enter-active-class="animated slideInRight" tag="div"
                          class="transition-container row items-start q-gutter-md text-white"
        >   
            <q-card class="my-card" v-for="game in renderedGames" :key="game.id" @click="openGameDetails(game)" :class="{'without-elo': game.exchangedELO === null}">
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

                            <!-- <div class="game__team__elo" v-if="game.exchangedELO">{{ game.exchangedELO }}</div> -->
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

                            <!-- <div class="game__team__elo" v-if="game.exchangedELO">{{ game.exchangedELO }}</div> -->
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
        </transition-group>

        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="user && user.gameManager">
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

                    <template v-if="step === 2">
                        <div class="text-h6">Insert the scores of the match</div>
                        <q-input v-model="redGoalKeeperGoals"           class="q-mb-xs" filled type="number" :label="'Goals made by ' + redGoalKeeper.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="redGoalKeeperGoals = Math.min(redGoalKeeperGoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="redGoalKeeperGoals = Math.max(redGoalKeeperGoals -1, 0)" />
                            </template>
                        </q-input>
                        <q-input v-model="redStrikerGoals"              class="q-mb-sm" filled type="number" :label="'Goals made by ' + redStriker.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="redStrikerGoals = Math.min(redStrikerGoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="redStrikerGoals = Math.max(redStrikerGoals -1, 0)" />
                            </template>
                        </q-input>
                        <q-input v-model="redGoalKeeperAutogoals"       class="q-mb-xs" filled type="number" :label="'Autogoals made by ' + redGoalKeeper.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="redGoalKeeperAutogoals = Math.min(redGoalKeeperAutogoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="redGoalKeeperAutogoals = Math.max(redGoalKeeperAutogoals -1, 0)" />
                            </template>
                        </q-input>
                        <q-input v-model="redStrikerAutogoals"          class="q-mb-md" filled type="number" :label="'Autogoals made by ' + redStriker.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="redStrikerAutogoals = Math.min(redStrikerAutogoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="redStrikerAutogoals = Math.max(redStrikerAutogoals -1, 0)" />
                            </template>
                        </q-input>
                        
                        <q-input v-model="blueGoalKeeperGoals"          class="q-mb-xs" filled type="number" :label="'Goals made by ' + blueGoalKeeper.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="blueGoalKeeperGoals = Math.min(blueGoalKeeperGoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="blueGoalKeeperGoals = Math.max(blueGoalKeeperGoals -1, 0)" />
                            </template>
                        </q-input>
                        <q-input v-model="blueStrikerGoals"             class="q-mb-sm" filled type="number" :label="'Goals made by ' + blueStriker.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="blueStrikerGoals = Math.min(blueStrikerGoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="blueStrikerGoals = Math.max(blueStrikerGoals -1, 0)" />
                            </template>
                        </q-input>
                        <q-input v-model="blueGoalKeeperAutogoals"      class="q-mb-xs" filled type="number" :label="'Autogoals made by ' + blueGoalKeeper.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="blueGoalKeeperAutogoals = Math.min(blueGoalKeeperAutogoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="blueGoalKeeperAutogoals = Math.max(blueGoalKeeperAutogoals -1, 0)" />
                            </template>
                        </q-input>
                        <q-input v-model="blueStrikerAutogoals"         class="q-mb-sm" filled type="number" :label="'Autogoals made by ' + blueStriker.nickname" >
                            <template v-slot:append>
                                <q-btn round dense flat icon="add"      @click="blueStrikerAutogoals = Math.min(blueStrikerAutogoals + 1, 7)" />
                                <q-btn round dense flat icon="remove"   @click="blueStrikerAutogoals = Math.max(blueStrikerAutogoals -1, 0)" />
                            </template>
                        </q-input>
                    </template>

                    <template v-if="step === 3">
                        <div class="text-h6">Confirm data</div>
                        <div class="text-subtitle1">Red team</div>
                        <div>{{ redGoalKeeper.nickname }} - {{ redStriker.nickname }}</div>
                        <div>Goals: {{ (parseInt(redGoalKeeperGoals) || 0) + (parseInt(redStrikerGoals) || 0) + (parseInt(blueGoalKeeperAutogoals) || 0) + (parseInt(blueStrikerAutogoals) || 0) }}</div>
                        
                        <div class="text-subtitle1">Blue team</div>
                        <div>{{ blueGoalKeeper.nickname }} - {{ blueStriker.nickname }}</div>
                        <div>Goals: {{ (parseInt(blueGoalKeeperGoals) || 0) + (parseInt(blueStrikerGoals) || 0) + (parseInt(redGoalKeeperAutogoals) || 0) + (parseInt(redStrikerAutogoals) || 0) }}</div>
                    </template>
                            
                    <q-separator style="margin: 20px 0" />
                    <template>
                        <q-btn @click="nextStep()" color="primary" :disable="nextStepDisabled" :label="step === 3 ? 'Save' : 'Continue'" />
                        <q-btn v-if="step > 1" flat color="primary" @click="previousStep()" label="Back" class="q-ml-sm" />
                    </template>
                </q-card-section>
            </q-card>
        </q-dialog>
        
        <q-dialog v-model="showGameDetail" full-width>
            <q-card v-if="selectedGame">
                <q-toolbar class="bg-primary glossy text-white">
                    <q-toolbar-title>Game details</q-toolbar-title>
                    <q-btn flat round dense icon="close" @click="closeGameDetails" />
                </q-toolbar>

                <q-card-section>
                    <div class="text-subtitle1" style="display: flex; align-items: center; justify-content: space-between">
                        <div v-if="selectedGame.exchangedELO === null">
                            Game not elaborated yet, wait
                        </div>
                        <template v-else>
                            <span v-if="selectedGame.result.blue === 7">Blue team won</span>
                            <span v-else>Red team won</span>
                            <span class="text-bold">{{ selectedGame.exchangedELO }} points</span>
                        </template>
                    </div>
                    <div class="text-subtitle2">Played: {{ selectedGame.creationDate | prettyDate }}</div>
                    <br>

                    <div class="text-bold">Blue goalkeeper</div>
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar>
                                <q-img :src="selecteGameBlueKeeper.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selecteGameBlueKeeper.nickname" />
                        </q-item-section>
                        <q-item-section side top>
                            <q-item-label caption>goals done: {{ selectedGame.blueKeeperGoals }}</q-item-label>
                            <q-item-label caption>autogoals done {{ selectedGame.blueKeeperAutogoals }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    
                    <br>
                    <div class="text-bold">Blue striker</div>
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar>
                                <q-img :src="selecteGameBlueStriker.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selecteGameBlueStriker.nickname" />
                        </q-item-section>
                        <q-item-section side top>
                            <q-item-label caption>goals done: {{ selectedGame.blueStrikerGoals }}</q-item-label>
                            <q-item-label caption>autogoals done {{ selectedGame.blueStrikerAutogoals }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <br>
                    <div class="text-bold">Red goalkeeper</div>
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar>
                                <q-img :src="selecteGameRedKeeper.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selecteGameRedKeeper.nickname" />
                        </q-item-section>
                        <q-item-section side top>
                            <q-item-label caption>goals done: {{ selectedGame.redKeeperGoals }}</q-item-label>
                            <q-item-label caption>autogoals done {{ selectedGame.redKeeperAutogoals }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    
                    <br>
                    <div class="text-bold">Red striker</div>
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar>
                                <q-img :src="selecteGameRedStriker.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selecteGameRedStriker.nickname" />
                        </q-item-section>
                        <q-item-section side top>
                            <q-item-label caption>goals done: {{ selectedGame.redStrikerGoals }}</q-item-label>
                            <q-item-label caption>autogoals done {{ selectedGame.redStrikerAutogoals }}</q-item-label>
                        </q-item-section>
                    </q-item>

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
            firstTime: null,
            gameList: [],
            renderedGames: [],
            loadingItems: false,

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

            showGameDetail: false,
            selectedGame: null
        }
    },

    filters: {
        prettyDate(date) {
            return new Date(date).toLocaleString()
        }
    },

    computed: {
        ...mapGetters('Game', ['gamesArray']),
        ...mapGetters('User', ['allUsersArray', 'allUsers', 'user']),
        ...mapGetters('Seasons', ['selectedSeason']),

        usersArray() {
            return this.allUsersArray.map(u => {
                u.value = u.id,
                u.label = u.nickname,
                u.avatar = u.avatar,
                u.disable = this.alreadySelectedUsers.indexOf(u.id) !== -1
                return u
            }).sort((a,b) => {
                const nickA = a.nickname.toLowerCase()
                const nickB = b.nickname.toLowerCase()
                if (nickA < nickB) //sort string ascending
                    return -1;
                if (nickA > nickB)
                    return 1;
                return 0;
            })
        },

        selecteGameBlueKeeper() {
            if (!this.selectedGame) return null  
            return this.allUsers[this.selectedGame.blueTeam.keeper]
        },
        
        selecteGameBlueStriker() {
            if (!this.selectedGame) return null  
            return this.allUsers[this.selectedGame.blueTeam.striker]
        },
        
        selecteGameRedKeeper() {
            if (!this.selectedGame) return null  
            return this.allUsers[this.selectedGame.redTeam.keeper]
        },
        
        selecteGameRedStriker() {
            if (!this.selectedGame) return null  
            return this.allUsers[this.selectedGame.redTeam.striker]
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

    watch: {
        async selectedSeason() {
            this.renderedGames = []
            await this.loadMoreGames()
            this.subscribeToGames()
        }
    },

    methods: {
        ...mapActions('Game', ['saveGame', 'getGames', 'subscribeToGames']),
        ...mapActions('Global', ['setLoading']),

        getUsername(id) {
            return this.allUsers === null ? "Loading" : this.allUsers[id].nickname
        },
        getAvatar(id) {
            return this.allUsers === null ? defaultAvatar : this.allUsers[id].avatar
        },

        pushWithoutDuplication(game) {
            if(!this.renderedGames.find(g => g.id === game.id)) 
                this.renderedGames.push(game)
        },

        pushGames() {
            const timeBetweenAnimation = 200
            this.gamesArray.slice(this.renderedGames.length).forEach((game, index) => {
                setTimeout(() => {
                    this.pushWithoutDuplication(game)
                }, index * timeBetweenAnimation)
            })
        },

        async loadMoreGames() {
            await this.getGames(this.gamesArray.length)
            this.pushGames()
            return true
        },

        openGameDetails(game) {
            this.selectedGame = game
            this.showGameDetail = true
            console.log("selected game", game)
        },
        
        closeGameDetails() {
            this.showGameDetail = false
            this.selectedGame = null
        },

        resetGameInputs() {
            this.redGoalKeeper = null;
            this.redStriker = null;
            this.blueGoalKeeper = null;
            this.blueStriker = null;
            this.redGoalKeeperGoals = null;
            this.redStrikerGoals = null;
            this.redGoalKeeperAutogoals = null;
            this.redStrikerAutogoals = null;
            this.blueGoalKeeperGoals = null;
            this.blueStrikerGoals = null;
            this.blueGoalKeeperAutogoals = null;
            this.blueStrikerAutogoals = null;
        },

        openModal() {
            this.showModal = true
            this.step = 1
        },
        closeModal() {
            this.showModal = false
            this.step = 1
            this.resetGameInputs()
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
                    creationDate: new Date().getTime(),
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
                    const newGame = await this.saveGame(gameObj)
                    this.renderedGames.unshift(newGame)
                } catch(e) {}

                this.closeModal()
            }
        },

        async onWindowScroll() {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 250 && !this.loadingItems) {
                this.loadingItems = true
                await this.loadMoreGames()
                setTimeout(() => this.loadingItems = false, 200)
            }
        }
    },

    async created() {
        this.setLoading(true)
        this.loadingItems = true
        const games = await this.getGames()
        this.setLoading(false)
        this.pushGames()
        this.loadingItems = false
        this.subscribeToGames()
    },

    mounted() {
        window.addEventListener("scroll", this.onWindowScroll)
    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.onWindowScroll)
    }
}
</script>

<style lang="stylus">
@import "../css/quasar.variables.styl"

.transition-container 
    width: 100%

.my-card 
    width: 100%
    position: relative
    filter: grayscale(0) drop-shadow(2px 4px 6px black)
    transition: filter .3s

    &.without-elo
        filter: grayscale(1) drop-shadow(2px 4px 6px black)

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
            text-align: right
            margin-right: 15%
        .game__team__elo
            position: absolute
            top: 47%
            left: 13%

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
            .game__team__elo
                position: absolute
                top: 47%
                right: 17%

</style>
