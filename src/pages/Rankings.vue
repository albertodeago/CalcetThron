<template>
    <div class="">
        <template  v-if="!isLoading">
            <div class="background"></div>
            <q-list bordered padding>
                <template v-for="enrichedUser in sortedRankings">
                <q-item :key="enrichedUser.id">
                    <q-item-section avatar>
                        <q-avatar>
                            <q-img :src="enrichedUser.avatar" :ratio="1" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label class="text-white">{{ enrichedUser.nickname }}</q-item-label>    
                    </q-item-section>

                    <q-item-section side>
                        <q-item-label class="text-white">{{ enrichedUser.ELO }}</q-item-label>   
                    </q-item-section>
                </q-item>
                <q-separator spaced inset="item" :key="enrichedUser.id + 'sep'"/>
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
            
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),

        sortedRankings() {
            return this.allRankingsArray.slice().sort((a, b) => parseInt(b.ELO) - parseInt(a.ELO))
        }
    },

    methods: {
        ...mapActions('Global', ['setLoading' ]),
        ...mapActions('Rankings', ['getRankings', 'subscribeToRankings']),

        openUser(enrichedUser) {
            this.$router.push(`user/${enrichedUser.id}`)
        }
    },

    async created() {
        this.setLoading(true)
        await this.getRankings()
        this.setLoading(false)
        this.subscribeToRankings()
    }
}
</script>

<style lang="stylus" scoped>

.background
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: -moz-linear-gradient(top,  rgba(25,55,224,1) 0%, rgba(43,51,203,0.5) 10%, rgba(186,20,37,0.5) 90%, rgba(204,16,16,1) 100%) /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  rgba(25,55,224,1) 0%,rgba(43,51,203,0.5) 10%,rgba(186,20,37,0.5) 90%,rgba(204,16,16,1) 100%) /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  rgba(25,55,224,1) 0%,rgba(43,51,203,0.5) 10%,rgba(186,20,37,0.5) 90%,rgba(204,16,16,1) 100%) /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

</style>


