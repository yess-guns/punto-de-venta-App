<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            Mesa(s): {{ mesas }}
             ||  
            {{ `${empleado.nombreEmpleado} ${empleado.apellidosEmpleado}` }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-row>
          <v-card :loading="loading">
            <template slot="progress">
              <v-progress-linear
                color="primary"
                height="5"
                indeterminate
              ></v-progress-linear>
              <p class="text-center text--disabled" disabled>Cargando...</p>
            </template>
          </v-card>
        </v-row>

        <v-tabs
          v-model="tab"
          background-color="#1976D2"
          centered
          dark
          icons-and-text
          class="mt-1"
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#pedir">
            Pedir
          </v-tab>
          <v-tab href="#pedido">
            Pedido
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="pedir">
            <v-card>
              <Pedir :mesas="mesas" />
            </v-card>
          </v-tab-item>
          <v-tab-item value="pedido">
            <v-card>
              Pedido
            </v-card>
          </v-tab-item>
        </v-tabs-items>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Pedir from './Pedir'
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "Venta",
  components: {
    Pedir
  },
  data: () => ({
    dialog: false,
    loading: false,
    empleado: {},
    mesas: '',
    tab: null,
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    showDialog(empleado, id_venta){
      this.empleado = {};
      this.empleado = empleado;
      this.dialog = true;
      this.dataVenta(id_venta);
    },
    async dataVenta(id_venta){
      this.loading = true;
      this.mesas = '';
      const path = `${this.BASE_URL}ventas/ventaById/${id_venta}`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          var mesas = res.data.mesas;
          let coma = 0;
          mesas.forEach((mesa, i) =>{
            coma = ((i + 1) == mesas.length) ? '' : ', ';
            this.mesas += `${mesa.numero}${coma}`;
          });
          console.log(this.mesas)
          //this.mesas = data.res;
          this.loading = false;
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.loading = false;
      }
    },
    closeDialog(){
      this.empleado = {};
      this.mesas = '';
      this.dialog = false;
    }
  },

  created(){
  }
};
</script>