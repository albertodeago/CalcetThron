<template>
    <div class="">
        <template  v-if="!isLoading">
            <div v-for="(users, day) in getHistory" :key="day">
                <h3>{{day}}</h3>
                <div v-for="(rank, id) in users" :key="id">
                    {{allUsers[id].nickname}} - {{rank.ELO}}
                </div>
            </div>
            <div>------------------------------------------</div>
            <canvas ref="canvas"></canvas>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Chart from "chart.js"

export default {
    data() {
        return {
            
        }
    },

    computed: {
        ...mapGetters("Global", ["isLoading"]),
        ...mapGetters('User', ['allUsers']),
        ...mapGetters("History", ["getHistory"]),
    },

    methods: {
        ...mapActions('Global', ['setLoading' ])
    },

    mounted() {
        setTimeout(() => {
            console.log("creating graph")
            var ctx = this.$refs.canvas;
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'My First dataset',
                        borderColor: "#ff0000",
                        backgroundColor: "#ff0000",
                        fill: false,
                        data: [
                            1,2,3,4,5,6,7
                        ],
                        yAxisID: 'y-axis-1',
                    }, {
                        label: 'My Second dataset',
                        borderColor: "#0000ff",
                        backgroundColor: "#0000ff",
                        fill: false,
                        data: [
                            0,2,5,3,1,9,5
                        ],
                        yAxisID: 'y-axis-2'
                    }]
                },
                options: {
                    responsive: true,
                    hoverMode: 'index',
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart - Multi Axis'
                    },
                    scales: {
                        yAxes: [{
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: 'left',
                            id: 'y-axis-1',
                        }, {
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: 'right',
                            id: 'y-axis-2',

                            // grid line settings
                            gridLines: {
                                drawOnChartArea: false, // only want the grid lines for one axis to show up
                            },
                        }],
                    }
                }
            });
        }, 2500)
    }
}
</script>

<style lang="stylus" scoped>

</style>


