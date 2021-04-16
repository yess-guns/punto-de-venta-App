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
          color="primary"
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
            Mesa(s): {{ mesas }}
             ||  
            {{ empleado }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            rounded
            v-if="statusPago == false"
            @click="dialogCancel = true"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="green"
            rounded
            v-else-if="statusPago == true"
            @click="dialogFin = true"
          >
            Finalizar
          </v-btn>
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
          <v-tab href="#venta" @click="actuVenta">
            Venta
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="venta">
            <v-card>
              <DatosVentaC
                :idVenta="id_venta"
                :mesas="mesas"
                :comensales="comensales"
                :id_empleado="id_empleado"
                ref="datosVenta"
                @click="changeStatusPago"
              />
            </v-card>
          </v-tab-item>
        </v-tabs-items>

      </v-card>
    </v-dialog>
    <!-- Finalizar Venta-->
    <v-dialog v-model="dialogFin" max-width="420px">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" class="text-center">
              <span>¿Finalizar Venta?</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="text-center mt-5">
              <v-btn
                color="error"
                @click="dialogFin = false"
                class="mr-2"
                rounded
              >
                No
              </v-btn>
              <v-btn
                :disabled="btnFin"
                color="success"
                rounded
                @click="finVenta"
              >
                Si
              </v-btn>
            </v-col>
          </v-row> 
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Cancelar Venta-->
    <v-dialog v-model="dialogCancel" max-width="420px">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" class="text-center">
              <span>¿Cancelar Venta?</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="text-center mt-5">
              <v-btn
                color="error"
                @click="dialogCancel = false"
                class="mr-2"
                rounded
              >
                No
              </v-btn>
              <v-btn
                :disabled="btnCancel"
                color="success"
                rounded
                @click="cancelVenta"
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
import DatosVentaC from './DatosVentaC';
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "Venta",
  components: {
    DatosVentaC
  },
  data: () => ({
    dialog: false,
    loading: false,
    id_empleado: 0,
    empleado: '',
    mesas: '',
    tab: null,
    id_venta: 0,
    comensales: 0,
    statusPago: '',
    dialogFin: false,
    btnFin: false,
    dialogCancel: false,
    btnCancel: false
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    showDialog(empleado, id_venta){
      this.id_venta = id_venta;
      this.tab = null;
      this.empleado = '';
      this.empleado = `${empleado.nombreEmpleado} ${empleado.apellidosEmpleado}`;
      this.id_empleado = empleado.id_empleado;
      this.dialog = true;
      this.dataVenta(id_venta);
      setTimeout(()=>{
        this.$refs.datosVenta.getDatosVenta(this.id_venta);
      },1);
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
          this.comensales = res.data.comensales;
          this.statusPago = res.data.statusPago;
          let signoComa = 0;
          mesas.forEach((mesa, i) =>{
            signoComa = ((i + 1) == mesas.length) ? '' : ', ';
            this.mesas += `${mesa.numero}${signoComa}`;
          });
          //console.log(this.mesas)
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
    actuVenta(){
      setTimeout(()=>{
        this.$refs.datosVenta.getDatosVenta(this.id_venta);
      },1);
    },
    closeDialog(){
      this.id_empleado = 0;
      this.empleado = {};
      this.mesas = '';
      this.dialog = false;
      this.comensales = 0,
      this.statusPago = '';
      this.$refs.datosVenta.resetAll();
    },
    changeStatusPago(){
      this.statusPago = true;
    },
    async finVenta(){
      this.btnFin = true;
      try {
        const path = `${this.BASE_URL}ventas/finVenta/`;
        let dataPost = new FormData();
        dataPost.append("idVenta", this.id_venta);
        let res = await axios.post(path, dataPost, this.AuthToken);
        console.log(res.data);
        if (res.data == 'OK') {
          this.dialogFin = false;
          this.btnFin = false;
          this.closeDialog();
          this.$emit("click");
          this.alert('Venta Finalizada','','success', 2000);
        } else {
          this.alert('Error!','Inténtalo de nuevo o comuníquese a soporte','error', 2000);
          this.btnFin = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuníquese a soporte','error', 2000);
        this.btnFin = false;
      }
    },
    async cancelVenta(){
      this.btnCancel = true;
      try {
        const path = `${this.BASE_URL}ventas/cancelarVenta/`;
        let dataPost = new FormData();
        dataPost.append("idVenta", this.id_venta);
        dataPost.append("idEmpleado", this.id_empleado);
        let res = await axios.post(path, dataPost, this.AuthToken);
        console.log(res.data);
        if (res.data == 'OK') {
          this.dialogCancel = false;
          this.btnCancel = false;
          this.closeDialog();
          this.$emit("click");
          this.alert('Venta Cancelada','','success', 2000);
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