<template>

  <v-card>
    <v-container>
      <v-card-title>
        Mesas - Ventas 
        <NewVenta @refresh="getMesasVenta" @venta="showVenta"  />
        <v-spacer></v-spacer>
      </v-card-title>
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

      <v-row>
        <v-col
          v-for="(mesa, i) in mesas"
          cols="6"
          sm="3"
          md="3"
          :key="i"
          @click="mesa.id_venta == 0 ? '' : validClave(mesa.id_venta)"
        >
          <v-card
            class="mx-auto"
            :color="colorMesa(mesa.id_venta)"
            dark
            
          >
            <v-card-title class="white--text">
              <div class="text-h5">
                  {{ `Mesa: ${mesa.numero}` }}
              </div>
            </v-card-title>
            <v-card-text class="headline font-weight-bold">
              {{ mesa.id_venta == 0 ? 'Disponible' : 'Ocupada' }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Venta ref="ventaM" />
  </v-card> 
</template>

<script>

import NewVenta from './NewVenta';
import Venta from './Venta';
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "Mesas",
  components: {
    NewVenta,
    Venta
  },
  data: () => ({
    mesas: [],
    loading: false
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    async getMesasVenta() {
      this.loading = true;
      this.mesas = [];
      const path = `${this.BASE_URL}mesas/getMesasVenta/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.mesas = data.res;
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
    async validClave(id_venta){
      var clave = 0;
      await swal({
        title: "¡Acceso!",
        text: "Ingresa tu Clave:",
        content: "input",
        button: {
          text: "OK",
          closeModal: false,
        },
      }).
      then(value => {
        clave = value ? value : 0;
      });
      if(clave != 0){
        try {
          const path = `${this.BASE_URL}empleados/validEmpleado/`;
          let data = new FormData();
          data.append("clave", clave);
          data.append("tipoEmpleado", 'Mesero');
          let res = await axios.post(path, data, this.AuthToken);
          console.log(res.data);
          let valid = res.data;
          if (valid.status == 'OK') {//clave valida
            swal.close();
            this.showVenta(valid.res, id_venta);
            //this.actionMesa(valid.res, mesa);
          } else {
            swal({title: "Clave invalida", text: ' ', icon: 'error', button: false});
            //swal.stopLoading();
            setTimeout(() => {
              this.validClave(id_venta);
            }, 1500)
          }
        } catch (error) {
          console.log(error)
          this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
          swal.stopLoading();
        }
      }else{
        swal.close();
      }
    },
    actionMesa(empleado, mesa){
      if(mesa.statusMesa == 0){
        console.log('nueva venta')
      }else{
        console.log(mesa.id_venta)
      }
    },
    colorMesa(id_venta){
      return id_venta == 0 ? '#90A4AE' : 'success';
    },
    showVenta(mesero, id_venta){
      this.$refs.ventaM.showDialog(mesero, id_venta);
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
    this.getMesasVenta();
  }
};
</script>