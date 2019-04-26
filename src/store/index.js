import Vue from 'vue'
import Vuex from 'vuex'
import User from './user'
import Game from './game'
import Global from './global'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function( /* { ssrContext } */ ) {
    const Store = new Vuex.Store({
        modules: {
            User,
            Global,
            Game
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV
    })

    return Store
}