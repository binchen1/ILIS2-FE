import Vue from "vue";
import Vuex from "vuex";
import authStore from "@config/store";

Vue.use(Vuex); 

const state = {
    count: 1
};

const getters = {

};

const mutations = {
    add(state){
        state.count = state.count + 1;
    }
};

const actions = {
    add2(context){
        context.commit("add");
    }
};

export default new Vuex.Store({
    state:{
        ...state,
        ...authStore.state
    },
    getters: {
        ...getters,
        ...authStore.getters
    },
    mutations:{
        ...mutations,
        ...authStore.mutations
    },
    actions:{
        ...actions,
        ...authStore.actions
    }
});