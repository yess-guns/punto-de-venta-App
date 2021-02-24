<template>
  <div>
    <Admin v-if="clave == 111" />
    <Mesero v-if="clave == 444" />
  </div>

</template>

<script>
import Navbar from '@/components/Navbar';
import Admin from '@/components/users/Admin';

import { mapMutations, mapState } from 'vuex';
export default {
  name: "Home",
  components: {
    Navbar,
    Admin
  },
  data: () => ({
    clave: 0,
  }),
  computed:{
    ...mapState(["userData"]),
  },

  methods: {
    ...mapMutations(["validarSesion"]),
    logout() {
      localStorage.clear();
      this.validarSesion();
    },
  },
  created(){
    this.clave = this.userData.tipo.clave;
  },
}
</script>

<style>

</style>