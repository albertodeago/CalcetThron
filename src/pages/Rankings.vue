<template>
    <div class="">
        <template v-if="!isLoading">
            <q-tab-panels v-model="activeRankingSystem"
                          animated
                          swipeable
                          infinite>
                <q-tab-panel name="trueskill">
                    <q-list bordered padding>
                        <template v-for="(enrichedUser, i) in rankingsToShow">
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
                                <q-item-label class="text-body1 text-weight-bold">
                                    {{ enrichedUser.rankValue }}
                                </q-item-label>   
                                <q-popup-proxy>
                                    <q-banner>
                                        <template v-slot:avatar>
                                            <q-icon name="info" color="primary" />
                                        </template>
                                        Raw points {{ enrichedUser.rawRank }} - {{ enrichedUser.sigma * trueskillData.sigmaCorrectionFactor }} Indecision
                                    </q-banner>
                                </q-popup-proxy>
                            </q-item-section>
                        </q-item>
                        <q-separator spaced inset="item" :key="enrichedUser.id + 'sep'"/>
                        </template>
                    </q-list>
                </q-tab-panel>

                <q-tab-panel name="ELO">
                    <q-list bordered padding>
                        <template v-for="(enrichedUser, i) in rankingsToShow">
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

                            <q-item-section @click="onUserELOPoints(enrichedUser)" side>
                                <q-item-label class="text-body1 text-weight-bold">
                                    {{ enrichedUser.rankValue }} <!-- TODO: fischietto flavio al click su flavio, COLPA di edo al click su edo -->
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator spaced inset="item" :key="enrichedUser.id + 'sep'"/>
                        </template>
                    </q-list>
                </q-tab-panel>
            </q-tab-panels>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data() {
        return {
            activeRankingSystem: "trueskill",
            trueskillData: {
                sigmaCorrectionFactor: 2, // correction factor for trueSkill rating system
                seasonStartForTrueSkill: 4, // season start number for trueSkill rating system
            },

            numberOfGamesToEnterRanks: 5
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),
        ...mapGetters('Seasons', ['selectedSeason']),

        /**
         * Rankings with "rankValue" property set using trueSkill rating system
         */
        trueSkillRankings() {
            return this.allRankingsArray.slice().filter(r => r.trueSkill).map(r => {
                return {
                    rankValue: (r.trueSkill.mu - this.trueskillData.sigmaCorrectionFactor * r.trueSkill.sigma).toFixed(0),
                    rawRank: r.trueSkill.mu.toFixed(0),
                    sigma: r.trueSkill.sigma.toFixed(0),
                    ...r
                }
            })
        },

        /**
         * Rankings with "rankValue" property set using ELO rating system
         */
        ELORankings() {
            return this.allRankingsArray.slice().map(r => {
                return {
                    rankValue: r.ELO,
                    ...r
                }
            })
        },

        /**
         * Rankings to show on the interface
         */
        rankingsToShow() {
            const shouldSeeELO = this.selectedSeason.number < this.trueskillData.seasonStartForTrueSkill || this.activeRankingSystem === "ELO"
            return (shouldSeeELO ? this.ELORankings : this.trueSkillRankings).filter(rank => rank.played >= this.numberOfGamesToEnterRanks).sort((a,b) => b.rankValue - a.rankValue)
        }
    },

    methods: {

        onUserELOPoints(enrichedUser) {
            if (enrichedUser.nickname === "Edo") {
                const speech = new SpeechSynthesisUtterance("Colpa di Edo!");
                window.speechSynthesis.speak(speech);
            }
            if (enrichedUser.nickname === "Flavio") {
                var audio = new Audio('https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/others%2FFischiettoFlavio_1.mp3?alt=media&token=bde553cb-5417-45ca-bb45-0f86d9a1786a');
                audio.play();
            }
        },
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


