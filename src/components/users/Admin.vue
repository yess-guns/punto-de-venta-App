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
        <v-tab href="#tab-Home" @click="drawer = !drawer">
          Inicio
        </v-tab>
        <v-divider></v-divider>
        <v-tab href="#tab-Insumos" @click="drawer = !drawer">
          Insumos
        </v-tab>
        <v-divider></v-divider>
        <v-tab href="#tab-Productos" @click="drawer = !drawer">
          Productos
        </v-tab>
        <v-divider></v-divider>
        <v-tab href="#tab-Ventas" @click="drawer = !drawer">
          Ventas
        </v-tab>
        <v-divider></v-divider>
        <v-tab href="#tab-Reporte-Ventas" @click="drawer = !drawer">
          Reporte Ventas
        </v-tab>
        <v-divider></v-divider>
        <v-tab href="#tab-Usuarios" @click="drawer = !drawer">
          Usuarios
        </v-tab>
        <v-divider></v-divider>
        <v-tab href="#tab-Empleados" @click="drawer = !drawer">
          Empleados
        </v-tab>
        <v-divider></v-divider>
      </v-tabs>

      <v-footer fixed>
        <v-col class="text-center" cols="12">
          Footer
        </v-col>
      </v-footer>
    </v-navigation-drawer>
    <!--Elementos del menú-->
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-Home">
        <v-card flat>
          <v-card-text>
            Inicio
          </v-card-text>
        </v-card>
      </v-tab-item>
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
            <IndexIProductos />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-Ventas">
        <v-card flat>
          <v-card-text>
            <IndexVentas />
          </v-card-text>
        </v-card>
      </v-tab-item>
      
      <v-tab-item value="tab-Reporte-Ventas">
        <v-card flat>
          <v-card-text>
            <ReporteVentas />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-Usuarios">
        <v-card flat>
          <v-card-text>
            <Usuarios />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-Empleados">
        <v-card flat>
          <v-card-text>
            <Empleados />
          </v-card-text>
        </v-card>
      </v-tab-item>

    </v-tabs-items> 
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import IndexInsumos from '@/views/admin/insumos/Index';
import IndexIProductos from '@/views/admin/productos/Index';
import IndexVentas from '@/views/admin/ventas/Index';
import ReporteVentas from '@/views/admin/ventas/ReporteVentas';
import Usuarios from '../../views/admin/usuarios/Index';
import Empleados from '../../views/admin/empleados/Index';
export default {
  name: "Admin",
  components: {
    IndexInsumos,
    IndexIProductos,
    IndexVentas,
    ReporteVentas,
    Usuarios,
    Empleados
  },
  data: () => ({
    tab: null,
    drawer: true
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
<style scoped>
  .v-tab {
    justify-content: left;
  }
</style>