<template>
  <div>
    <v-btn
      class="mx-3 mb-4"
      fab
      dark
      color="green"
      @click="validClave"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-row justify="center">
      
      <v-dialog v-model="dialog" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="headline">
              Nueva Venta || {{ `${empleado.nombreEmpleado} ${empleado.apellidosEmpleado}` }}
            </span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-autocomplete
                    v-model="mesaSelect"
                    :items="mesas"
                    item-value="id_mesa"
                    item-text="numero"
                    deletable-chips
                    label="Mesas Disponibles"
                    :loading="loadingMesas"
                    color="indigo"
                    multiple
                  >                   
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Comensales"
                    v-model="comensales"
                    @keypress="restrigirChars($event)"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close()">
              Cancelar
            </v-btn>
            <v-btn
              :loading="buttonSave"
              color="blue darken-1"
              text
              @click="valid"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "NewVenta",
  components: {
  },
  data: () => ({
    dialog: false,
    empleado: {},
    //form
    mesas: [],
    mesaSelect: [],
    comensales: '',
    loadingMesas: false,
    buttonSave: false
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    showDialog(empleado){
      this.empleado = {};
      this.empleado = empleado;
      this.getMesasDisp();
      this.dialog = true;
    },
    async validClave(){
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
            this.showDialog(valid.res);
          } else {
            swal({title: "Clave invalida", text: ' ', icon: 'error', button: false});
            //swal.stopLoading();
            setTimeout(() => {
              this.validClave(mesa);
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
    async getMesasDisp() {
      this.loadingMesas = true;
      this.mesas = [];
      const path = `${this.BASE_URL}mesas/getMesasDisp/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.mesas = data.res;
          this.loadingMesas = false;
        } else {
          this.loadingMesas = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.loadingMesas = false;
      }
    },
    valid(){
      if(this.mesaSelect.length > 0 && parseInt(this.comensales)){
        this.newVenta();
      }else{
        this.alert('Error','Revice que el formulario este completo','warning', 2000);
      }
    },
    async newVenta(){
      var empleado = this.empleado;
      try {
        this.buttonSave = true;
        const path = `${this.BASE_URL}ventas/newVenta/`;
        let data = new FormData();
        data.append("id_empleado", this.empleado.id_empleado);
        data.append("mesaSelect", JSON.stringify(this.mesaSelect));
        data.append("comensales", this.comensales);
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        if (res.data.resp == 'OK') {//clave valida
          this.close();
          this.$emit('refresh');
          this.$emit('venta', empleado, res.data.idVenta);
          this.buttonSave = false;
        } else {
          this.alert('Error!','Intentalo de nuevo o comuniquese a soporte','error', 2000);
          this.buttonSave = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        swal.stopLoading();
        this.buttonSave = false;
      }
    },    
    close(){
      this.empleado = {};
      this.mesas = [];
      this.mesaSelect = [];
      this.comensales = '';
      this.dialog = false;
    },
    restrigirChars(event) {//admite solo numeros
      if (
        event.charCode === 0 ||
        /\d/.test(String.fromCharCode(event.charCode))
      ) {
        return true;
      } else {
        event.preventDefault();
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