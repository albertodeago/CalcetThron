<template>
    <div class="">
        <transition-group enter-active-class="animated slideInRight" tag="div"
                          class="transition-container row items-start q-gutter-md text-white"
        >   
            <q-card class="my-card" v-for="game in renderedGames" :key="game.id" @click="openGameDetails(game)" :class="{'without-elo': (!game.trueSkillChanges && !game.exchangedELO)}">
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
        </transition-group>

        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="user && user.gameManager">
            <q-btn fab icon="add" color="secondary" @click="openModal" />
        </q-page-sticky>

        <q-dialog v-model="showModal" persistent transition-show="slide-up" transition-hide="slide-down" content-class="add-game-modal" full-width full-height>
            <q-card>
                <q-bar>
                    <q-space />
                    <q-btn flat icon="close" @click="closeModal"></q-btn>
                </q-bar>

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

                        <q-separator style="margin: 20px 0" />
                        <div class="chips-container">
                            <q-chip v-for="user in usersChips" :key="user.id" @click="onChipClick(user)" clickable>
                                <q-avatar>
                                    <img :src="user.avatar">
                                </q-avatar>
                                {{ user.nickname }}
                            </q-chip>
                            <div class="text-subtitle" v-if="usersChips.length === 0">
                                No user to suggest
                            </div>
                        </div>
                    </template>

                    <template v-if="step === 2">
                        <div class="text-h6 q-mb-md">Insert the scores of the match</div>

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

                        <q-separator style="margin: 20px 0" />

                        <q-expansion-item dense dense-toggle icon="people" label="Game information">
                            <q-card>
                                <q-card-section>
                                    
                                    <div class="text-weight-bold q-mb-md" v-if="winProbability">Blue win probability: {{winProbability}}%</div>
                                    <div class="text-weight-bold q-mb-md" v-else>Cannot get a win probability</div>

                                    <q-list v-if="trueSkillExchange">
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <q-img :src="redGoalKeeper.avatar" :ratio="1" />
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>{{redGoalKeeper.nickname}}</q-item-label>
                                                <q-item-label caption>
                                                    <span class="color-red" style="margin-right: 1rem">{{trueSkillExchange.redWin[redGoalKeeper.id].diff}}</span>
                                                    <span class="color-blue">{{trueSkillExchange.blueWin[redGoalKeeper.id].diff}}</span>
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <q-img :src="redStriker.avatar" :ratio="1" />
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>{{redStriker.nickname}}</q-item-label>
                                                <q-item-label caption>
                                                    <span class="color-red" style="margin-right: 1rem">{{trueSkillExchange.redWin[redStriker.id].diff}}</span>
                                                    <span class="color-blue">{{trueSkillExchange.blueWin[redStriker.id].diff}}</span>
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <q-img :src="blueGoalKeeper.avatar" :ratio="1" />
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>{{blueGoalKeeper.nickname}}</q-item-label>
                                                <q-item-label caption>
                                                    <span class="color-red" style="margin-right: 1rem">{{trueSkillExchange.redWin[blueGoalKeeper.id].diff}}</span>
                                                    <span class="color-blue">{{trueSkillExchange.blueWin[blueGoalKeeper.id].diff}}</span>
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <q-img :src="blueStriker.avatar" :ratio="1" />
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>{{blueStriker.nickname}}</q-item-label>
                                                <q-item-label caption>
                                                    <span class="color-red" style="margin-right: 1rem">{{trueSkillExchange.redWin[blueStriker.id].diff}}</span>
                                                    <span class="color-blue">{{trueSkillExchange.blueWin[blueStriker.id].diff}}</span>
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                        
                    </template>

                    <template v-if="step === 3">
                        <div class="ELO-exchange-preview text-h6">
                            <span>Confirm data</span>
                        </div>
                        <div class="text-subtitle1">Red team</div>
                        <div>{{ redGoalKeeper.nickname }} - {{ redStriker.nickname }}</div>
                        <div>Goals: {{ redTeamTotalGoals }}</div>
                        
                        <div class="text-subtitle1">Blue team</div>
                        <div>{{ blueGoalKeeper.nickname }} - {{ blueStriker.nickname }}</div>
                        <div>Goals: {{ blueTeamTotalGoals }}</div>
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
                        <div v-if="!selectedGame.trueSkillChanges">
                            Game not elaborated yet, wait
                        </div>
                        <template v-else>
                            <span v-if="selectedGame.result.blue === 7">Blue team won</span>
                            <span v-else>Red team won</span>
                        </template>
                    </div>
                    <div class="text-subtitle2">Played: {{ selectedGame.creationDate | prettyDate }}</div>
                    <br>

                    <div class="text-bold">Blue goalkeeper</div>
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar>
                                <q-img :src="selectedGameBlueKeeper.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selectedGameBlueKeeper.nickname" />
                            <template v-if="selectedGame.trueSkillChanges">
                                <q-item-label caption>
                                    <span class="text-bold">Points: {{ selectedGame.trueSkillChanges[selectedGameBlueKeeper.id].muDifference.toFixed(0) }}</span>
                                </q-item-label>
                            </template>
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
                                <q-img :src="selectedGameBlueStriker.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selectedGameBlueStriker.nickname" />
                            <template v-if="selectedGame.trueSkillChanges">
                                <q-item-label caption>
                                    <span class="text-bold">Points: {{ selectedGame.trueSkillChanges[selectedGameBlueStriker.id].muDifference.toFixed(0) }}</span>
                                </q-item-label>
                            </template>
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
                                <q-img :src="selectedGameRedKeeper.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selectedGameRedKeeper.nickname" />
                            <template v-if="selectedGame.trueSkillChanges">
                                <q-item-label caption>
                                    <span class="text-bold">Points: {{ selectedGame.trueSkillChanges[selectedGameRedKeeper.id].muDifference.toFixed(0) }}</span>
                                </q-item-label>
                            </template>
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
                                <q-img :src="selectedGameRedStriker.avatar" :ratio="1" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label v-html="selectedGameRedStriker.nickname" />
                            <template v-if="selectedGame.trueSkillChanges">
                                <q-item-label caption>
                                    <span class="text-bold">Points: {{ selectedGame.trueSkillChanges[selectedGameRedStriker.id].muDifference.toFixed(0) }}</span>
                                </q-item-label>
                            </template>
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
import { Rating, winProbability, TrueSkill } from "ts-trueskill"
import { mapActions, mapGetters } from "vuex"
import { Game } from "../models"
import ELO from "../../functions/ELO"
import Utils from "../Utils"

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
        ...mapGetters('Rankings', ['allRankings', 'allRankingsArray']),

        usersArray() {
            return this.allUsersArray.map(u => {
                const newUser = Object.assign({}, u)
                newUser.value = u.id
                newUser.label = u.nickname
                newUser.avatar = u.avatar
                newUser.disable = this.alreadySelectedUsers.indexOf(u.id) !== -1
                newUser.played = (this.allRankings && this.allRankings[u.id]) ? this.allRankings[u.id].played : 0 // user can have no rankings
                return newUser
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

        /**
         * The 8 player with the most amount of game in this season
         */
        usersChips() {
            return this.usersArray.slice().filter(a => this.alreadySelectedUsers.indexOf(a.id) === -1).sort((a,b) => b.played - a.played).slice(0,8)
            // this.allRankingsArray.slice().filter(a => this.alreadySelectedUsers.indexOf(a.id) === -1).sort((a,b) => b.played - a.played).slice(0,8)
        },

        selectedGameBlueKeeper() {
            if (!this.selectedGame) return null  
            return this.allUsers[this.selectedGame.blueTeam.keeper]
        },
        
        selectedGameBlueStriker() {
            if (!this.selectedGame) return null  
            return this.allUsers[this.selectedGame.blueTeam.striker]
        },
        
        selectedGameRedKeeper() {
            if (!this.selectedGame) return null  
            return this.allUsers[this.selectedGame.redTeam.keeper]
        },
        
        selectedGameRedStriker() {
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

        redTeamTotalGoals() {
            return (parseInt(this.redGoalKeeperGoals) || 0) + (parseInt(this.redStrikerGoals) || 0) + (parseInt(this.blueGoalKeeperAutogoals) || 0) + (parseInt(this.blueStrikerAutogoals) || 0)
        },

        blueTeamTotalGoals() {
            return (parseInt(this.blueGoalKeeperGoals) || 0) + (parseInt(this.blueStrikerGoals) || 0) + (parseInt(this.redGoalKeeperAutogoals) || 0) + (parseInt(this.redStrikerAutogoals) || 0)
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
        },

        /**
         * Win probability of the blue team
         */
        winProbability() {
            if (!this.redGoalKeeper || !this.redStriker || !this.blueGoalKeeper || !this.blueStriker)
                return null

            const blueKeeperRankings = this.allRankings[this.blueGoalKeeper.id]
            const blueStrikerRankings = this.allRankings[this.blueStriker.id]
            const redKeeperRankings = this.allRankings[this.redGoalKeeper.id]
            const redStrikerRankings = this.allRankings[this.redStriker.id]
            if (!blueKeeperRankings || !blueStrikerRankings || !redKeeperRankings || !redStrikerRankings ||
                !blueKeeperRankings.trueSkill || !blueStrikerRankings.trueSkill || !redKeeperRankings.trueSkill || !redStrikerRankings.trueSkill) {
                return null
            }

            // create Ratings for trueskill system
            const blueKeeperRating = new Rating(blueKeeperRankings.trueSkill.mu, blueKeeperRankings.trueSkill.sigma)
            const blueStrikerRating = new Rating(blueStrikerRankings.trueSkill.mu, blueStrikerRankings.trueSkill.sigma)
            const redKeeperRating = new Rating(redKeeperRankings.trueSkill.mu, redKeeperRankings.trueSkill.sigma)
            const redStrikerRating = new Rating(redStrikerRankings.trueSkill.mu, redStrikerRankings.trueSkill.sigma)

            return (winProbability([blueKeeperRating, blueStrikerRating], [redKeeperRating, redStrikerRating]) * 100).toFixed(0)
        },

        /**
         * TrueSkill value exchange for selected players.
         * Returns null if something prevent the calculation (like an unranked player)
         * Returns an object with redWin and blueWin properties. Each contain all player ids as keys.
         * Each playerId contain oldMu, newMu and diff
         */
        trueSkillExchange() {
            if (!this.redGoalKeeper || !this.redStriker || !this.blueGoalKeeper || !this.blueStriker)
                return null

            // create a model like in the backend
            const initialRating = 1000;
            const calcetThronTrueskill = new TrueSkill(initialRating);
            calcetThronTrueskill.drawProbability = 0; // calcetto games cannot be draws

            // create all current player rankings for our Trueskill model
            const bgkRankings = this.allRankings[this.blueGoalKeeper.id];
            const bsRankings = this.allRankings[this.blueStriker.id];
            const rgkRankings = this.allRankings[this.redGoalKeeper.id];
            const rsRankings = this.allRankings[this.redStriker.id];

            if (!bgkRankings || !bsRankings || !rgkRankings || !rsRankings)
                return null

            const bgk = bgkRankings.trueSkill;
            const bs = bsRankings.trueSkill;
            const rgk = rgkRankings.trueSkill;
            const rs = rsRankings.trueSkill;

            const trueSkillBlueKeeper = new Rating(bgk.mu, bgk.sigma);
            const trueSkillBlueStriker = new Rating(bs.mu, bs.sigma);
            const trueSkillRedKeeper = new Rating(rgk.mu, rgk.sigma);
            const trueSkillRedStriker = new Rating(rs.mu, rs.sigma);
            
            // blue team win case:
            const blueWinRankings = calcetThronTrueskill.rate([
                [
                    trueSkillBlueKeeper,
                    trueSkillBlueStriker,
                ],[
                    trueSkillRedKeeper,
                    trueSkillRedStriker
                ]
            ]);

            // red team win case:
            const redWinRankings = calcetThronTrueskill.rate([
                [
                    trueSkillRedKeeper,
                    trueSkillRedStriker
                ], [
                    trueSkillBlueKeeper,
                    trueSkillBlueStriker,
                ]
            ]);

            return {
                blueWin: {
                    [this.blueGoalKeeper.id]: {
                        oldMu: (bgk.mu).toFixed(0),
                        newMu: (blueWinRankings[0][0].mu).toFixed(0),
                        diff: (blueWinRankings[0][0].mu - bgk.mu).toFixed(0)
                    },
                    [this.blueStriker.id]: {
                        oldMu: (bs.mu).toFixed(0),
                        newMu: (blueWinRankings[0][1].mu).toFixed(0),
                        diff: (blueWinRankings[0][1].mu - bs.mu).toFixed(0)
                    },
                    [this.redGoalKeeper.id]: {
                        oldMu: (rgk.mu).toFixed(0),
                        newMu: (blueWinRankings[1][0].mu).toFixed(0),
                        diff: (blueWinRankings[1][0].mu - rgk.mu).toFixed(0)
                    },
                    [this.redStriker.id]: {
                        oldMu: (rs.mu).toFixed(0),
                        newMu: (blueWinRankings[1][1].mu).toFixed(0),
                        diff: (blueWinRankings[1][1].mu - rs.mu).toFixed(0)
                    },
                },
                redWin: {
                    [this.redGoalKeeper.id]: {
                        oldMu: (rgk.mu).toFixed(0),
                        newMu: (redWinRankings[0][0].mu).toFixed(0),
                        diff: (redWinRankings[0][0].mu - rgk.mu).toFixed(0)
                    },
                    [this.redStriker.id]: {
                        oldMu: (rs.mu).toFixed(0),
                        newMu: (redWinRankings[0][1].mu).toFixed(0),
                        diff: (redWinRankings[0][1].mu - rs.mu).toFixed(0)
                    },
                    [this.blueGoalKeeper.id]: {
                        oldMu: (bgk.mu).toFixed(0),
                        newMu: (redWinRankings[1][0].mu).toFixed(0),
                        diff: (redWinRankings[1][0].mu - bgk.mu).toFixed(0)
                    },
                    [this.blueStriker.id]: {
                        oldMu: (bs.mu).toFixed(0),
                        newMu: (redWinRankings[1][1].mu).toFixed(0),
                        diff: (redWinRankings[1][1].mu - bs.mu).toFixed(0)
                    },
                },
            }
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
        ...mapActions('Game', ['saveGame', 'getGames', 'subscribeToGames', 'getAllGames']),
        ...mapActions('Global', ['setLoading']),
        ...mapActions('History', ['getHistory']),

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
                    blueStrikerAutogoals: _blueStrikerAutogoals,
                    uploaderId: this.user.id, // save who's the one who added this game
                    uploaderNickname: this.user.nickname // save who's the one who added this game
                }

                // Save the game to DB and close modal
                try {
                    this.setLoading(true)
                    const newGame = await this.saveGame(gameObj)
                    this.setLoading(false)
                    this.renderedGames.unshift(newGame)
                } catch(e) {}

                this.closeModal()
            }
        },

        onChipClick(user) {
            if (!this.redGoalKeeper) {
                this.redGoalKeeper = user
            }
            else if (!this.redStriker) {
                this.redStriker = user
            }
            else if (!this.blueGoalKeeper) 
                this.blueGoalKeeper = user
            else if (!this.blueStriker) {
                this.blueStriker = user
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

        // setTimeout(() => this.getAllGames(), 250);
        // setTimeout(() => this.getHistory(), 2500);
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

.chips-container 
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

.color-red 
    color: $secondary

.color-blue
    color: $primary
</style>
