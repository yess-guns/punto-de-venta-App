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
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="red"
                v-bind="attrs"
                v-on="on"
                @click="validCancel(item)"
              >
                <v-icon>mdi-cancel</v-icon>
              </v-btn>
            </template>
            <span>Cancelar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <!-- Cancelar Producto-->
    <v-dialog v-model="dialogCancel" max-width="420px" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" class="text-center">
              <span>¿Cancelar?</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              Comenzal: {{ prodToCancel.comenzal}}  -- Producto: {{ prodToCancel.nombreProducto}}
            </v-col>
            <v-col cols="12" class="text-center mt-5">
              <v-btn
                color="error"
                @click="dialogCancel = false, prodToCancel = {}"
                class="mr-2"
                rounded
              >
                No
              </v-btn>
              <v-btn
                :disabled="btnCancel"
                color="success"
                rounded
                @click="cancelProducto"
              >
                Si
              </v-btn>
            </v-col>
          </v-row> 
        </v-card-text>
      </v-card>
    </v-dialog>
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
      { text: "Empleado", value: "empleado" },
      { text: "", value: "action" }
    ],
    ventaDatos: [],
    loading: false,
    dialogCancel: false,
    prodToCancel: {},
    btnCancel: false
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
    validCancel(producto){
      this.prodToCancel = {};
      this.dialogCancel = true;
      this.prodToCancel = producto;
    },
    async cancelProducto(){
      this.btnCancel = true;
      try {
        const path = `${this.BASE_URL}ventas/cancelarProducto/`;
        let dataPost = new FormData();
        dataPost.append("id_ventaDatos", this.prodToCancel.id_ventaDatos);
        let res = await axios.post(path, dataPost, this.AuthToken);
        //console.log(res.data);
        if (res.data == 'OK') {
          this.dialogCancel = false;
          this.btnCancel = false;
          this.prodToCancel = {};
          this.alert('Cancelado!',' ','success', 1500);
          this.getDatosVenta(this.idVenta);
        } else {
          this.alert('Error!','Inténtalo de nuevo o comuníquese a soporte','error', 2000);
          this.btnCancel = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuníquese a soporte','error', 2000);
        this.btnCancel = false;
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