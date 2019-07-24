<template>
    <div class="">
        <canvas class="background" ref="canvas"></canvas>
        <template  v-if="!isLoading">
            <q-list bordered padding>
                <template v-for="enrichedUser in sortedRankings">
                <q-item :key="enrichedUser.id">
                    <q-item-section avatar>
                        <q-avatar>
                            <q-img :src="enrichedUser.avatar" :ratio="1" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{ enrichedUser.nickname }}</q-item-label>    
                    </q-item-section>

                    <q-item-section side>
                        <q-item-label>{{ enrichedUser.ELO }}</q-item-label>   
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
        ...mapActions('Rankings', ['getRankings']),

        openUser(enrichedUser) {
            this.$router.push(`user/${enrichedUser.id}`)
        }
    },

    async created() {
        this.setLoading(true)
        await this.getRankings()
        this.setLoading(false)

        this.$nextTick(() => {
            const canvas = this.$refs.canvas
            const panelEl = document.querySelector(".q-tab-panel")
            canvas.height = panelEl.clientHeight
            canvas.width = panelEl.clientWidth

            Particles.init({
                selector: '.background',
                color: ['#1937e0', '#cc1010'],
                connectParticles: false,
                maxParticles: 225,
                sizeVariations: 7
            });
        })
    }
}
</script>

<style lang="stylus">

.background
    position: absolute
    display: block 
    top: 0
    left: 0
    z-index: 0

</style>


