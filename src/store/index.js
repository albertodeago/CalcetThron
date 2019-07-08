import Vue from 'vue'
import Vuex from 'vuex'
import User from './user'
import Game from './game'
import Global from './global'
import Rankings from './rankings'
import Seasons from './season'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export default function() {
    const Store = new Vuex.Store({
        modules: {
            User,
            Global,
            Game,
            Rankings,
            Seasons
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV
    })

    return Store
}