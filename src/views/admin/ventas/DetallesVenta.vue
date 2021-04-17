<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-toolbar
          dark
          color="#90A4AE"
          class="mb-2"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                dark
                @click="closeDialog"
                v-bind="attrs"
                  v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              </template>
              <span>Cerrar</span>
            </v-tooltip>
          <v-toolbar-title>
            Detalles Venta
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-chip
            class="ma-2"
            :color="statusVentaColor(dataVenta.statusVenta)"
            text-color="white"
          >
            {{ statusVentaTxt(dataVenta.statusVenta) }}
          </v-chip>
        </v-toolbar>
        <v-card-text>
          <v-container>
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
            <v-row class="my-3">
              <v-col cols="4">
                <h3>Comensales: {{ dataVenta.comensales }}</h3> 
              </v-col>
              <v-col cols="4">
                <h3>Hora: {{ dataVenta.hora }}</h3> 
              </v-col>
              <v-col cols="4">
                <h3>Mesero: {{ dataVenta.nombreM + ' ' + dataVenta.apeM }}</h3> 
              </v-col>              
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" class="text-center" v-if="dataPago != null">
                <h2 class="my-5">Datos Pago</h2>
                <v-divider></v-divider>
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">
                          Folio
                        </th>
                        <th class="text-center">
                          $ Total
                        </th>
                        <th class="text-center">
                          $ Efectivo
                        </th>
                        <th class="text-center">
                          $ Tarjeta
                        </th>
                        <th class="text-center">
                          Hora
                        </th>
                        <th class="text-left">
                          Empleado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ dataPago.folio }}</td>
                        <td>$ {{ dataPago.total }}</td>
                        <td>$ {{ dataPago.pagoEf == null ? "0.00" : dataPago.pagoEf.monto }}</td>
                        <td>$ {{ dataPago.pagoTj == null ? "0.00" : dataPago.pagoTj.monto }}</td>
                        <td>{{ dataPago.hora }}</td>
                        <td class="text-left">{{ dataPago.cajero.nombre + ' ' + dataPago.cajero.apellidos }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-title>
                    <h2>Productos</h2>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="ventaDatos"
                      :items-per-page="10"
                      class="elevation-1"
                      :loading="loading"
                    >
                      <template v-slot:[`item.empleado`]="{ item }">
                        {{ `${ item.empleado.nombreEmpleado} ${item.empleado.apellidosEmpleado}` }}
                      </template>
                      <template v-slot:[`item.status`]="{ item }">
                         <v-chip
                          class="ma-2"
                          :color="item.status == 1 ? 'success' : 'error'"
                          text-color="white"
                        >
                          {{ item.status == 1 ? 'OK' : 'Cancelado' }}
                        </v-chip>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
//import DatosVentaC from './DatosVentaC';
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "DetallesVenta",
  components: {
  },
  data: () => ({
    dialog: false,
    loading: false,
    dataVenta: {},
    ventaDatos: [],
    dataPago: null,
    headers: [
      { text: "Comenzal", value: "comenzal" },
      { text: "Producto", value: "nombreProducto" },
      { text: "Empleado", value: "empleado" },
      { text: "Estatus", value: "status" }
    ],
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    showDialog(dataVenta){
      this.dataVenta = dataVenta;
      this.dialog = true;
      this.getDatosVenta(dataVenta.id_venta);
    },
    async getDatosVenta(idVenta) {
      this.loading = true;
      this.ventaDatos = [];
      const path = `${this.BASE_URL}reportes/getDatosVenta/${idVenta}`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (data.status == 'OK') {
          this.ventaDatos = data.res.platillos;
          this.dataPago = data.res.pago;
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
      this.dialog = false;
      this.dataVenta = {};
      this.ventaDatos = [];
      this.dataPago = null;
    },
    statusVentaTxt(status){
      switch (status) {
        case "0":
          return 'Finalizada';
          break;
        case "1":
          return 'Activa';
          break;
        case "2":
          return 'Cancelada';
          break;
      
        default:
          break;
      }
    },
    statusVentaColor(status){
      switch (status) {
        case "0":
          return 'success';
          break;
        case "1":
          return 'primary';
          break;
        case "2":
          return 'error';
          break;
      
        default:
          break;
      }
    },
    alert(title, text, icon, timer){
      swal({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        button: false,
      });
    }
  },

  created(){
  }
};
</script>