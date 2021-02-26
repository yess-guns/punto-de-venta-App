import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: {},
    AuthToken: {},
    BASE_URL: 'http://localhost/puntodeventaAPI/',
    auth: false,
    dataFormInsumo: {
      'unidades' : [],
      'medidas' : [],
      'categorias' : [],
    },
    categoriasPro: []
  },
  mutations: {
    validarSesion(state) {
      let dataUser = JSON.parse(localStorage.getItem("Usuario-pdv"))
      if (dataUser != null) { //esta logueado
          state.userData = dataUser
          state.AuthToken = {
              headers: {
                  Authorization: `${dataUser.token}`,
              }
          }
          state.auth = true;
      } else { //no esta logueado
          state.userData = {}
          state.AuthToken = {}
          state.auth = false;
      }
    },
    saveDataFormInsumo(state, payload){
      state.dataFormInsumo[payload[0]] = payload[1];
    },
    saveCategorias(state, payload){
      state.categoriasPro = payload['categorias'];
    }
  },
  actions: {
  },
  modules: {
  }
})