<template>
  <div>
    <Navbar />
    <Admin />
  </div>

</template>

<script>
import Navbar from '@/components/Navbar';
import Admin from '@/components/users/Admin';

import { mapMutations } from 'vuex';
export default {
  name: "Home",
  components: {
    Navbar,
    Admin
  },

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