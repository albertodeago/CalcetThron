<template>
    <q-page>
        <template v-if="!isLoading">
            <q-select filled
                    v-model="selectedUsers"
                    multiple
                    :options="selectableUsers"
                    use-chips
                    stack-label
                    label="Select users to compare them"
            />
            
            <apexchart :type="type" :options="chartOptions" :series="series"></apexchart>
        </template>
    </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    data() {
        return {
            chartOptions: {
                plotOptions: {
                    radialBar: {
                        offsetY: -10,
                        startAngle: 0,
                        endAngle: 270,
                        hollow: {
                            margin: 5,
                            size: '30%',
                            background: 'transparent',
                            image: undefined,
                        },
                        dataLabels: {
                            name: {
                                show: true
                            },
                            value: {
                                show: true
                            },
                            total: {
                                show: true,
                                label: "Total",
                                // formatter: function (w) {
                                //     return 249
                                // }
                            }
                        }
                    }
                },
                labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
                legend: {
                    show: true,
                    floating: true,
                    fontSize: '14px',
                    position: 'left',
                    offsetX: 40,
                    offsetY: 10,
                    labels: {
                        useSeriesColors: true,
                    },
                    markers: {
                        size: 0
                    },
                    formatter: function(seriesName, opts) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                    },
                    itemMargin: {
                        horizontal: 1,
                    }
                }
            },
            series: [1, 2, 3, 4],
            type: "radialBar",

            selectedUsers: []
        }
    },
    
    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters("Rankings", ["allRankingsArray"]),
        ...mapGetters("User", ["allUsersArray"]),

        selectableUsers() {
            return this.allUsersArray.map(a => a.nickname)
        }
    },

    watch: {
        selectedUsers(newVal) {
            const usersToDrawOnChart = []
            newVal.forEach(nick => usersToDrawOnChart.push(this.allRankingsArray.find(rank => rank.nickname === nick)))
            this.series = usersToDrawOnChart.map(u => u.played)
            this.chartOptions.labels.splice(0, this.chartOptions.labels.length)
            this.chartOptions.labels.push.apply(this.chartOptions.labels, usersToDrawOnChart.map(u => u.nickname))
            console.log(this.series, this.chartOptions)
        }
    },
    
    methods: {
        ...mapActions('Global', ['setLoading' ]),
        ...mapActions('Rankings', ['getRankings']),
    },
   
    async created() {
        this.setLoading(true)
        await this.getRankings()
        this.setLoading(false)
    },

    mounted() {
        // TODO: select 3 random users
    }
}

</script>

<style lang="stylus">

</style>


