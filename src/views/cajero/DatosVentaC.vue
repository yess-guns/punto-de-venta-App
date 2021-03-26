<template>
  <v-row class="mx-3">
    <v-col md="4">
      <h2>
        Total a Pagar: ${{ precioTotal.toFixed(2) }}
      <v-btn icon color="success" @click="printTicket">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      </h2>
    </v-col>
    <v-card>
      <v-card-title>
        Venta
        <v-spacer></v-spacer>
      </v-card-title>
      
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
        <template v-slot:[`item.precio`]="{ item }">
          {{ `$ ${parseInt(item.precio).toFixed(2)}` }}
        </template>
      </v-data-table>

    </v-card>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
import print from 'print-js';
export default {
  name: "DatosVentaC",
  components: {
  },
  props: [
    "idVenta"
  ],
  data: () => ({
    headers: [
      { text: "Comenzal", value: "comenzal" },
      { text: "Producto", value: "nombreProducto" },
      { text: "Empleado", value: "empleado" },
      { text: "Precio", value: "precio", align: 'end' }
    ],
    ventaDatos: [],
    loading: false,
    precioTotal: 0
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    async getDatosVenta(idVenta) {
      this.loading = true;
      this.ventaDatos = [];
      this.precioTotal = 0;
      const path = `${this.BASE_URL}ventas/getDatosVenta/${idVenta}`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (data.status == 'OK') {
          this.ventaDatos = data.res;
          this.loading = false;
          this.genTotal();
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.loading = false;
      }
    },
    async genTotal(){
      var countTotal = 0;
      await this.ventaDatos.forEach((produc, i) => {
        countTotal += parseInt(produc.precio);
        this.ventaDatos[i].precioHtml = `<div id="precioID">$ ${parseInt(produc.precio).toFixed(2)}</div>`;
      });
      this.precioTotal = countTotal;
      this.ventaDatos.push(
        {
          'comenzal': 'TOTAL',
          'nombreProducto': 'TOTAL',
          'empleado': {'nombreEmpleado': '', 'apellidosEmpleado': ''},
          'precio': this.precioTotal,
          'precioHtml': `<div id="precioID">$ ${this.precioTotal.toFixed(2)}</div>`
        }
      )
    },
    printTicket(){
      print(
        {
          header: '<h3 class="text-center">Los Candiles</h3>',
          printable: this.ventaDatos,
          properties: [
            { field: 'nombreProducto', displayName: 'Producto'},
            { field: 'precioHtml', displayName: 'Precio'}
          ],
          type: 'json',
          gridHeaderStyle: 'border-bottom: 2px solid #3971A5;',
          gridStyle: 'border: 2px solid #fff;',
          style: '.text-center { text-align: center; } #precioID { text-align: right; }'
        }
      )
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