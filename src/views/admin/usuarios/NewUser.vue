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
            <v-toolbar-title>Nuevo Usuario</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <!-- Moldes-->
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Correo"
                    v-model="form.email"
                    :rules="emailRules"
                    persistent-hint
                    outlined
                    background-color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    :items="permisos"
                    v-model="form.permiso"
                    :rules="permisoRules"
                    item-value="id_permiso"
                    label="Elige un permiso"
                    item-text="nombre"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Contraseña"
                    v-model="form.pass"
                    :rules="passRules"
                    persistent-hint
                    outlined
                    type="password"
                  ></v-text-field>
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
  name: "NewUser",
  props:[
    "permisos"
  ],
  data: () => ({
    dialog: false,
    valid: true,
    form: {
      email: null,
      permiso: null,
      pass: null,
    },
    emailRules: [
      (v) => !!v || "Correo requerido",
      (v) => /.+@.+\..+/.test(v) || "Correo invalido",
    ],
    permisoRules: [(v) => !!v || "Selecciona un permiso"],
    passRules: [
      (v) => !!v || "Contraseña requerida",
      (v) => (v && v.length >= 9)|| "Ingrese al menos 9 dígitos"
    ],
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
        const path = `${this.BASE_URL}usuarios/newUser/`;
        let dataPost = new FormData();
        dataPost.append("form", JSON.stringify(this.form));
        let res = await axios.post(path, dataPost, this.AuthToken);
        let data = res.data;
        console.log(data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡El correo electrónico ya esta registrado!',' ','warning', 2000);
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