// import { mapGetters } from "vuex"
// import { RankingBuilder } from "../models"

// export default {
//     computed: {
//         ...mapGetters('Game', ['allGames']),
//         ...mapGetters('User', ['allUsers'])
//     },

//     watch: {
//         allUsers(val) {
//             this.enrichedUsers = RankingBuilder(val, this.allGames)
//         },
//         allGames(val) {
//             this.enrichedUsers = RankingBuilder(this.allUsers, val)
//         }
//     },

//     mounted() {
//         if (this.enrichedUsers.length === 0)
//             this.enrichedUsers = RankingBuilder(this.allUsers, this.allGames)
//     }
// }