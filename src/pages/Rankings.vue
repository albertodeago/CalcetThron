<template>
    <div class="">
        <template  v-if="!isLoading">
            <q-list bordered padding>
                <template v-for="(enrichedUser, i) in sortedRankings">
                <q-item :key="enrichedUser.id">
                    <q-item-section avatar>
                        <q-avatar>
                            <q-img :src="enrichedUser.avatar" :ratio="1" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label class="nickname">
                            <span class="text-body1">{{ enrichedUser.nickname }}</span>
                            <q-icon class="q-ml-sm medal medal--gold" name="star" v-if="i === 0"/>
                            <q-icon class="q-ml-sm medal medal--silver" name="star" v-if="i === 1"/>
                            <q-icon class="q-ml-sm medal medal--bronze" name="star" v-if="i === 2"/>
                        </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-item-label class="text-body1">{{ enrichedUser.ELO }}</q-item-label>   
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
        ...mapGetters('Seasons', ['selectedSeason']),

        sortedRankings() {
            return this.allRankingsArray.slice().sort((a, b) => parseInt(b.ELO) - parseInt(a.ELO))
        }
    },

    methods: {
        ...mapActions('Global', ['setLoading' ]),

        openUser(enrichedUser) {
            this.$router.push(`user/${enrichedUser.id}`)
        }
    }
}
</script>

<style lang="stylus" scoped>

.nickname
    display: inline-flex;
    align-items: center;

.medal--gold 
    background: linear-gradient(#8f6B29, #FDE08D, #DF9F28)
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

.medal--silver
    background: linear-gradient(#262626,#eaeaea,#262626)
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

.medal--bronze
    // background: linear-gradient(-72deg, #ca7345, #ffdeca 16%, #ca7345 21%, #ffdeca 24%, #a14521 27%, #ca7345 36%, #ffdeca 45%, #ffdeca 60%, #ca7345 72%, #ffdeca 80%, #ca7345 84%, #732100)
    background: linear-gradient(#ca7345, #ffdeca 45%, #732100)
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

.medal
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2rem;

</style>


