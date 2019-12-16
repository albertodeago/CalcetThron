<template>
    <div class="">
        <template v-if="!isLoading">
            empty view
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
        // ...mapGetters('User', ['allUsers', 'allUsersArray']),
        // ...mapGetters("History", ["getHistory", "getActiveUsers"]),

        historyReady() {
            return false;
            // return this.getHistory !== null
        }
    },

    methods: {
        ...mapActions("History", ["getMyHistory"])
    },

    mounted() {
        this.getMyHistory()
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


