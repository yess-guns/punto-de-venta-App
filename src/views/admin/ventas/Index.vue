<template>
  <div>
    <v-card>
      <v-card-title @click="getVentas">
        Total Ventas: {{ ventas.length}} <v-spacer></v-spacer> 
        Fecha: {{ spanishDate }} <v-spacer></v-spacer>
        <template> 
          <v-menu
            v-model="calendar"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Buscar día"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @input="calendar = false"
              @change="getVentas"
            ></v-date-picker>
          </v-menu>
        </template>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-data-table
            :headers="headers"
            :items="ventas"
            :items-per-page="10"
            class="elevation-1"
            :loading="loading"
          >
            <template v-slot:[`item.mesero`]="{ item }">
              {{ `${item.nombreM} ${item.apeM}` }}
            </template>
            <template v-slot:[`item.statusVenta`]="{ item }">
              <v-chip
                class="ma-2"
                :color="statusVentaColor(item.statusVenta)"
                text-color="white"
              >
                {{ statusVentaTxt(item.statusVenta) }}
              </v-chip>
            </template>
            <template v-slot:[`item.details`]="{ item }">
              <v-btn
                color="#90A4AE"
                rounded
                small
                @click="showDetails(item)"
              >
                Detalles
              </v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
    </v-card>
    <DetallesVenta ref="dialogDetails" />
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import functionsDate from "../../../helpers/funcionesFechas";
import DetallesVenta from "./DetallesVenta";
export default {
  components: {
    DetallesVenta
  },
  name: "IndexVentas",
  data: () => ({
    ventas: [],
    headers: [
      { text: "IdVenta", value: "id_venta" },
      { text: "Mesero", value: "mesero" },
      { text: "Comensales", value: "comensales" },
      { text: "Hora", value: "hora" },
      { text: "Status", value: "statusVenta" },
      { text: "Detalles", value: "details" }
    ],
    date: '',
    loading: false,
    spanishDate: '',
    calendar: false
  }),
  created(){
    this.date = functionsDate.fechaHoy();
    this.getVentas();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    async getVentas() {
      this.loading = true;
      this.ventas = [];
      try {
        const path = `${this.BASE_URL}reportes/getVentasStatus/`;
        let dataPost = new FormData();
        dataPost.append("date", this.date);
        let res = await axios.post(path, dataPost, this.AuthToken);
        console.log(res.data);
        if(res.data.status == 'OK'){
          this.ventas = res.data.dataV;
          this.spanishDate = functionsDate.fechaES(this.date);
        }else{
          //this.alert('Error!','No hay ventas en esta fecha','error', 2000);
          this.spanishDate = functionsDate.fechaES(this.date);
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
      this.loading = false;
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
    showDetails(venta){
      this.$refs.dialogDetails.showDialog(venta);
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
};
</script>