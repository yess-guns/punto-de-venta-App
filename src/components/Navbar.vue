<template>
  <div>
    <v-sheet class="overflow-hidden" >
        <v-toolbar dark flat color="blue lighten-1">
          <v-toolbar-title>Los Candiles</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn cflat icon @click="logout()">
            <v-icon large>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar>
    </v-sheet>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: "Navbar",
  data: () => ({
    drawer: null, 
  }),
  props: ["user"],
  computed: {},
  methods: {
    ...mapMutations(["validarSesion"]),
    logout() {
      localStorage.clear();
      this.validarSesion();
    },
  },
};
</script>

<style>
#lateral .v-btn--example {
  bottom: 0;
  position: absolute;
  margin: 0 0 16px 16px;
}
</style>