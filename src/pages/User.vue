<template>
    <q-page>
        <template v-if="ready && currentEnrichedUser !== null">
            <div class="q-pa-md">                
                <q-card class="my-card">
                    <q-card-section v-ripple>
                        <div class="info-container">
                            <div class="info-container__avatar">
                                <q-avatar size="10rem">
                                    <q-img :src="imageSource !== null ? imageSource : computedAvatar" :ratio="1" @click="selectImage" v-ripple />
                                    <input type="file" accept="image/*" style="display: none" ref="image_picker" @change="imageSelected">
                                </q-avatar>
                            </div>
                            <div class="info-container__text">
                                <div class="text-h6">Nickname:</div>
                                <div>{{ currentUser.nickname }}</div>
                                <br>
                                <div class="text-h6">Signed:</div>
                                <div>{{ new Date(currentUser.creationDate).toLocaleString('en-GB') }}</div>
                            </div>
                        </div>
                    </q-card-section>

                    <div v-if="isLoggedUser">
                        <q-separator />
                        <q-card-actions align="around">
                            <q-btn flat @click="saveImage" v-if="imageSource !== null">Save Avatar</q-btn>
                            <q-btn flat @click="onLogout">Logout</q-btn>
                        </q-card-actions>
                    </div>
                </q-card>
                
                <q-card class="my-card q-my-md">
                    <q-card-section v-ripple>
                        <div class="stat-section stat-section__games">
                            <div class="text-h6">Games statistics</div>
                            <div>played: {{ currentEnrichedUser.played }}</div>
                            <div>won: {{ currentEnrichedUser.won }}</div>
                            <div>lost: {{ currentEnrichedUser.lost }}</div>
                            <q-badge floating>Win rate: {{ currentEnrichedUser.winRate }}</q-badge>
                        </div>
                    </q-card-section>
                        
                    <q-separator inset />

                    <q-card-section v-ripple>
                        <div class="stat-section stat-section__games">
                            <div class="text-h6">Goals statistics</div>
                            <div>done: {{ currentEnrichedUser.goalDone }}</div>
                            <div>received: {{ currentEnrichedUser.goalReceived }}</div>
                            <div>autogoals done: {{ currentEnrichedUser.autogoalDone }}</div>
                            <q-badge floating>Difference: {{ currentEnrichedUser.goalDone - currentEnrichedUser.goalReceived }}</q-badge>
                        </div>
                    </q-card-section>
                        
                    <q-separator inset />

                    <q-card-section v-ripple>
                        <div class="stat-section stat-section__goalkeeper">
                            <div class="text-h6">Goalkeeper statistics</div>
                            <div>played: {{ currentEnrichedUser.playedGoalkeeper }}</div>
                            <div>won: {{ currentEnrichedUser.wonGoalkeeper }}</div>
                            <div>lost: {{ currentEnrichedUser.lostGoalkeeper }}</div>
                            <q-badge floating>Win rate: {{ currentEnrichedUser.winRateGoalkeeper }}</q-badge>
                        </div>
                    </q-card-section>
                    
                    <q-separator inset />
                    
                    <q-card-section v-ripple>
                        <div class="stat-section stat-section__games">
                            <div class="text-h6">Striker statistics</div>
                            <div>played: {{ currentEnrichedUser.playedStriker }}</div>
                            <div>won: {{ currentEnrichedUser.wonStriker }}</div>
                            <div>lost: {{ currentEnrichedUser.lostStriker }}</div>
                            <q-badge floating>Win rate: {{ currentEnrichedUser.winRateStriker }}</q-badge>
                        </div>
                    </q-card-section>
                </q-card>
            </div>


        </template>
    </q-page>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { enrichUser } from "../models/ranking/RankingBuilder"
import EditableAvatar from "../mixins/EditableAvatar"

const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88";

export default {
    components: {
        
    },
    mixins: [EditableAvatar],
    data() {
        return {
            ready: false,
            imageSource: null
        }
    },
    computed: {
        ...mapGetters('User', ['user', 'selectedUser']),
        ...mapGetters('Game', ['allGames']),

        isLoggedUser() {
            return this.ready && 
                   this.user && 
                   this.user.id === this.selectedUser.id
        },

        currentUser() {
            return this.selectedUser ? this.selectedUser : {}
        },

        currentEnrichedUser() {
            return this.selectedUser ? enrichUser(this.selectedUser, this.allGames) : null
        },

        computedAvatar() {
            return this.selectedUser ? this.selectedUser.avatar : defaultAvatar
        }
    },

    methods: {
        ...mapMutations('User', ['setSelectedUser']),
        ...mapActions('User', ['getUser', 'logout', 'saveAvatar']),
        ...mapActions('Global', ['setLoading']),

        async onLogout() {
            this.setLoading(true)
            this.ready = false
            try {
                await this.logout()
            } catch(e) {
                console.error(e);
            }
            this.setLoading(false)
            this.$router.push('/')
        },

        async saveImage() {
            await this.saveAvatar({
                userId: this.user.id, 
                image: this.image
            })
        },
        
        /**
         * Open up the image picker on the device by triggering a click into an input[type="file"]
         */
        selectImage() {
            if(this.selectedUser.id === this.user.id) {
                // ok, I'm watching my profile, I can change my own avatar
                this.$refs["image_picker"].click()
            }
        }
    },

    created() {
        if(this.selectedUser === null) {
            this.setLoading(true)
            const userId = this.$route.params.id
            this.getUser(userId).then((firebaseUser) => {
                this.setSelectedUser(firebaseUser);
                this.ready = true
                this.setLoading(false)
            })
        } else {
            this.ready = true
        }
    },

    beforeDestroy() {
        this.setSelectedUser(null)
    }
}
</script>

<style lang="stylus">

.info-container__avatar
    width: 50%
    display: inline-block
    vertical-align: top

.info-container__text
    width: calc(49% - 1rem)
    display: inline-flex
    flex-direction: column
    margin-left: 1rem;

.stat-section
    position: relative

</style>


