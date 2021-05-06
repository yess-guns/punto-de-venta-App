<template>
  <div>
    <v-card>
      <v-card-title>
        Total Ventas: {{ ventas.length}} <v-spacer></v-spacer> 
        Fecha: {{ spanishDate }} <v-spacer></v-spacer>
        <!-- Buscador por día -->
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
        <!-- Buscador por mes -->
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
        <v-spacer></v-spacer>
        <v-btn
          color="red"
          :loading="btnPDF"
          @click="pdf"
          v-if="ventas.length > 0"
        >
          Exportar <v-icon>mdi-pdf-box</v-icon>
        </v-btn>
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
import jsPDF from "jspdf";
import 'jspdf-autotable';
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
    calendar: false,
    btnPDF: false
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
    async pdf(){
      const doc = new jsPDF();
      this.btnPDF = true;
      // var lotes = [];
      // var sumaT = this.sumas;
      var dataVentas = [];
      await this.ventas.forEach((venta, index) =>{
        var pagoEf = venta.pago.pagoEf != null ? venta.pago.pagoEf.monto : '0.00';
        var pagoTj = venta.pago.pagoTj != null ? venta.pago.pagoTj.monto : '0.00';
        dataVentas[index] = [
          venta.fecha,
          { content: venta.pago.folio, styles: {halign: 'center'} },
          { content: venta.pago.total, styles: {halign: 'right'} },
          { content: pagoEf, styles: {halign: 'right'} },
          { content: pagoTj, styles: {halign: 'right'} },
          { content: venta.comensales, styles: {halign: 'center'} }
        ];
      });
      
      
      doc.setFontSize(16);
      doc.text(15, 10, 'Reporte Ventas: '+this.spanishDate);
      doc.autoTable({

        head: [
          [
            'Fecha',
            { content: 'Folio', styles: {halign: 'center'} },
            { content: 'Total', styles: {halign: 'right'} },
            { content: 'Efectivo', styles: {halign: 'right'} },
            { content: 'Tarjeta', styles: {halign: 'right'} },
            { content: 'Comenzales', styles: {halign: 'center'} }
          ]
        ],
        body: dataVentas
        ,
        foot: [
          [
            'Total' ,
            '',
            { content: `$ ${this.totales.total}`, styles: {halign: 'right'} },
            { content: `$ ${this.totales.efectivo}`, styles: {halign: 'right'} },
            { content: `$ ${this.totales.tarjeta}`, styles: {halign: 'right'} },
            { content: this.totales.comensales, styles: {halign: 'center'} },
          ]
        ]
      });
      //doc.addPage(); Nueva página
      doc.save(`Reporte de lotes - ${this.spanishDate}.pdf`);
      this.btnPDF = false;
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