<template>
  <v-app>
    <v-main>
      <Home v-if="auth" />
      <Login v-else />
    </v-main>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';
import Login from './components/Login';
import Home from './components/Home';
import { mapState, mapMutations } from "vuex";

export default {
  name: 'App',
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapMutations(["validarSesion"])
  },
  created(){
    this.validarSesion();
  },
  components: {
    Login,
    Home
  },

  data: () => ({
    //
  }),
};
</script>
