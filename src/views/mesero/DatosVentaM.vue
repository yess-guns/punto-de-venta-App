<template>
  <v-row justify="center">
    <v-card>
      <v-card-title cla>
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
      </v-data-table>

    </v-card>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "DatosVentaM",
  components: {
  },
  props: [
    "idVenta"
  ],
  data: () => ({
    headers: [
      { text: "Comenzal", value: "comenzal" },
      { text: "Producto", value: "nombreProducto" },
      { text: "Empleado", value: "empleado" }
    ],
    ventaDatos: [],
    loading: false
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    async getDatosVenta(idVenta) {
      this.loading = true;
      this.ventaDatos = [];
      const path = `${this.BASE_URL}ventas/getDatosVenta/${idVenta}`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (data.status == 'OK') {
          this.ventaDatos = data.res;
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