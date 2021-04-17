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
        <v-spacer></v-spacer>
        <v-dialog
          ref="dialog"
          v-model="modalMonth"
          :return-value.sync="dateMonth"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateMonth"
              label="Buscar mes"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateMonth"
            type="month"
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modalMonth = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(dateMonth), getVentasMonth()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
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
            <template v-slot:[`item.efectivo`]="{ item }">
              $ {{ item.pago.pagoEf == null ? "0.00" : item.pago.pagoEf.monto }}
            </template>

            <template v-slot:[`item.tarjeta`]="{ item }">
              $ {{ item.pago.pagoTj == null ? "0.00" : item.pago.pagoTj.monto }}
            </template>

          </v-data-table>
          <v-row v-if="totales != null">
            <v-col>Total $ {{ totales.total }}</v-col>
            <v-col>Total Efectivo: $ {{ totales.efectivo }}</v-col>
            <v-col>Total Tarjeta. $ {{ totales.tarjeta }}</v-col>
            <v-col>Total Comensales: {{ totales.comensales }}</v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
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
  name: "ReporteVentas",
  data: () => ({
    ventas: [],
    totales: null,
    headers: [
      { text: "Fecha", value: "fecha" },
      { text: "Folio Pago", value: "pago.folio" },
      { text: "$ Total", value: "pago.total" },
      { text: "$ Efectivo", value: "efectivo" },
      { text: "$ Tarjeta", value: "tarjeta" },
      { text: "Comensales", value: "comensales" },
    ],
    date: '',
    modalMonth: false,
    dateMonth: '',
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
      this.totales = null;
      this.dateMonth = '';
      try {
        const path = `${this.BASE_URL}reportes/reporteVentasByDay/`;
        let dataPost = new FormData();
        dataPost.append("date", this.date);
        let res = await axios.post(path, dataPost, this.AuthToken);
        console.log(res.data);
        if(res.data.status == 'OK'){
          this.ventas = res.data.dataV;
          this.totales = res.data.totales;
          this.spanishDate = functionsDate.fechaES(this.date);
        }else{
          this.spanishDate = functionsDate.fechaES(this.date);
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
      this.loading = false;
    },
    async getVentasMonth() {
      this.loading = true;
      this.ventas = [];
      this.totales = null;
      this.spanishDate = '';
      this.date = '';
      try {
        const path = `${this.BASE_URL}reportes/reporteVentasByMonth/`;
        let dataPost = new FormData();
        dataPost.append("date", this.dateMonth);
        let res = await axios.post(path, dataPost, this.AuthToken);
        console.log(res.data);
        if(res.data.status == 'OK'){
          this.ventas = res.data.dataV;
          this.totales = res.data.totales;
          this.spanishDate = functionsDate.fechaESmes(this.dateMonth);
        }else{
          this.spanishDate = functionsDate.fechaESmes(this.dateMonth);
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
      this.loading = false;
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