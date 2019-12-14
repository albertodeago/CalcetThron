<template>
    <div class="">
        <template v-if="!isLoading">
            <div style="height: 100vh; width100vw; position: relative">
                <canvas ref="canvas" id="canvas"></canvas>
            </div>
            <!-- <div v-for="(users, day) in getHistory" :key="day">
                <h3>{{day}}</h3>
                <div v-for="(rank, id) in users" :key="id">
                    {{allUsers[id].nickname}} - {{rank.ELO}}
                </div>
            </div> -->
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Utils from "../Utils"
import Chart from "chart.js"

export default {
    data() {
        return {
            
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters('User', ['allUsers', 'allUsersArray']),
        ...mapGetters("History", ["getHistory", "getActiveUsers"]),

        historyReady() {
            return this.getHistory !== null
        }
    },

    watch: {
        historyReady(val) {
            if (val) 
                // this.createHistoryGraph()
                this.createHistogram()
        }
    },

    methods: {
        ...mapActions('Global', ['setLoading' ]),

        createHistogram() {
            const history = this.getHistory
            const days = Object.keys(history)
            console.log(history)
            
            const getRandomColor = () => {
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            const datasets = [{
                label: "Players",
                fill: false,
                backgroundColor: "#f00",
                borderColor: "#f00",
                borderWidth: 1,
                data: this.getActiveUsers.map(user => history[days[days.length -1]][user.id].ELO)
            }]

            var ctx = this.$refs.canvas;
            var myChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: this.getActiveUsers.map(u => u.nickname),
                    datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    hoverMode: 'index',
                    stacked: false,
                    title: {
                        display: false,
                        text: 'Do we set a name?'
                    },
                    legend: {
                        display: false
                    }
                    // scales: {
                    //     xAxes: [{
                    //         type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    //         display: true,
                    //         position: 'left',
                    //         id: 'x-axis',
                    //     }],
                    // }
                }
            });
        }

        // createHistoryGraph() {
        //     const history = this.getHistory
        //     const days = Object.keys(history)
        //     console.log(history)
            
        //     const getRandomColor = () => {
        //         var letters = '0123456789ABCDEF'.split('');
        //         var color = '#';
        //         for (var i = 0; i < 6; i++ ) {
        //             color += letters[Math.floor(Math.random() * 16)];
        //         }
        //         return color;
        //     }

        //     const randomUsers = Utils.shuffle(this.getActiveUsers.slice())
        //     const datasets = randomUsers.slice(0,3).map(user => {
        //         const userHistory = days.map(day => history[day][user.id].ELO)
        //         const userColor = getRandomColor()
        //         return {
        //             label: user.nickname,
        //             fill: false,
        //             backgroundColor: userColor,
        //             borderColor: userColor,
        //             data: userHistory
        //         }
        //     })

        //     var ctx = this.$refs.canvas;
        //     var myChart = new Chart(ctx, {
        //         type: 'line',
        //         data: {
        //             labels: days,
        //             datasets
        //         },
        //         options: {
        //             responsive: false,
        //             maintainAspectRatio: false,
        //             hoverMode: 'index',
        //             stacked: false,
        //             title: {
        //                 display: false,
        //                 text: 'Do we set a name?'
        //             },
        //             scales: {
        //                 yAxes: [{
        //                     type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        //                     display: true,
        //                     position: 'left',
        //                     id: 'y-axis-1',
        //                 }],
        //             }
        //         }
        //     });
        // }
    },

    mounted() {
        if (this.historyReady) 
            // this.createHistoryGraph()
            this.createHistogram()
    }
}
</script>

<style lang="stylus" scoped>

#canvas {
    position absolute;
    left:0;
    right: 0;
    bottom:0;
    top: 0;
}
</style>


