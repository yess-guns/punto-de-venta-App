<template>
  <v-btn  @click="logout()" block color="success">
      Cerrar Sesion
  </v-btn>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: "Home",

  methods: {
    ...mapMutations(["validarSesion"]),
    logout() {
      localStorage.clear();
      this.validarSesion();
    },
  },

}
</script>

<style>

</style>