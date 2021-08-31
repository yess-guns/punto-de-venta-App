<template>
  <v-container class="grey lighten-5">
    <v-btn
      dark
      color="success"
      fab
      class="mb-5"
      @click="openDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <!--Modal Moldes a evaluar-->
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="500px"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-toolbar-title>Nuevo Empleado</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <!-- Moldes-->
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Nombre(s)"
                    v-model="form.nombre"
                    :rules="requeridoRules"
                    persistent-hint
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                  label="Apellidos"
                    v-model="form.ape"
                    :rules="requeridoRules"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Clave"
                    v-model="form.clave"
                    :rules="claveRules"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    :items="tiposEmp"
                    v-model="form.tipo"
                    :rules="tipoRules"
                    item-value="id_tipoEmpleado"
                    label="Elige un tipo"
                    item-text="nombre"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" rounded class="white--text" @click="closeDialog">
              Cancelar
            </v-btn>
            <v-btn color="success" rounded class="white--text" @click="validate" :loading="btnSend">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "NevoEmpleado",
  props:[
    "tiposEmp"
  ],
  data: () => ({
    dialog: false,
    valid: true,
    form: {
      nombre: null,
      ape: null,
      clave: null,
      tipo: null
    },
    requeridoRules: [
      (v) => !!v || "Campo requerido"
    ],
    claveRules: [
      (v) => !!v || "Clave requerida",
      (v) => (v && v.length == 4)|| "Ingrese 4 dígitos"
    ],
    tipoRules: [(v) => !!v || "Selecciona un tipo"],
    btnSend: false

  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    validate(){
      if (this.$refs.form.validate() === true) {
        this.send();
      }
    },
    async send() {
      this.btnSend = true;
      try {
        const path = `${this.BASE_URL}empleados/nuevoEmpleado/`;
        let dataPost = new FormData();
        dataPost.append("form", JSON.stringify(this.form));
        let res = await axios.post(path, dataPost, this.AuthToken);
        let data = res.data;
        //console.log(data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡La clave de acceso ya esta registrada!',' ','warning', 2000);
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.closeDialog();
            this.$emit('refresh');
            break;

          case 'error':
            this.alert('¡Error!','Intentelo de nuevo o comuníquese con soporte','error', 2000);
            break;

          default:
            break;
        }
        this.btnSend = false;
      } catch (error) {
        this.btnSend = false;
        this.alert('Revise su conexión o comuníquese a soporte!',' ','error', 3000);
      }
    },
    //Abrir el dialogo que contiene los moldes y resetear la informacion
    openDialog(){
      this.dialog = true;
    },

    closeDialog(){
      this.$refs.form.reset();
      this.dialog = false;
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