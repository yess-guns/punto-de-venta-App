<template>
  <div>
    <!--Navbar-->
    <v-sheet class="overflow-hidden" >
      <v-toolbar dark flat color="blue lighten-1">
        <v-icon large @click="drawer = !drawer">mdi-menu</v-icon>
        <v-toolbar-title>Los Candiles</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn cflat icon @click="logout()">
          <v-icon large>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar>
    </v-sheet>
    <!--Menú-->
    <v-navigation-drawer v-model="drawer" fixed temporary
      ><!-- Sidebar -->
      <v-list-item>
        <v-list-item-avatar>
          <span class="group pa-2">
            <v-icon large>mdi-account</v-icon>
          </span>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Admin</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-tabs vertical v-model="tab">
        <v-tab href="#tab-Insumos" @click="drawer = !drawer">
          <v-icon left>
            mdi-account
          </v-icon>
          Insumos
        </v-tab>
        <v-tab href="#tab-Productos" @click="drawer = !drawer">
          <v-icon left>
            mdi-lock
          </v-icon>
          Productos
        </v-tab>
      </v-tabs>

      <v-footer fixed>
        <v-col class="text-center" cols="12">
          Footer
        </v-col>
      </v-footer>
    </v-navigation-drawer>
    <!--Elementos del menú-->
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-Insumos">
        <v-card flat>
          <v-card-text>
            <IndexInsumos />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-Productos">
        <v-card flat>
          <v-card-text>
            Productos
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items> 
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import IndexInsumos from '@/views/admin/insumos/Index';
export default {
  name: "Admin",
  components: {
    IndexInsumos
  },
  data: () => ({
    tab: null,
    drawer: null
  }),
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