import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        syncing: false,
        syncProps: null,

    },
    mutations: {
        sync(state, value) {
            state.syncing = true;
            state.syncProps = value;
        
        },
        syncing(state, value) {
            state.syncing = value;
        }
        
    },
    actions: {
        // sync1(context, value) {
            
        // }
    }
})
