<template>
  <v-container>
    <NewUser :permisos="permisos" @refresh="getUsuarios" />
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="dataUsers"
          :items-per-page="10"
          class="elevation-1"
          :loading="loadingU"
        >
          <template v-slot:[`item.email`]="{ item }">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  v-bind="attrs"
                  v-on="on"
                  @click="openEdit(item.id_usuario,item.email,1)"
                >
                  {{ item.email }}
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.permiso`]="{ item }">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  v-bind="attrs"
                  v-on="on"
                  @click="openEdit(item.id_usuario,item.id_permiso,2)"
                >
                  {{ item.permiso }}
                </v-btn>
                </template>
              <span>Editar</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.pass`]="{ item }">
            <div class="v-input theme--light v-text-field v-text-field--is-booted">
              <div class="v-input__control">
                <div class="v-input__slot">
                  <div class="v-text-field__slot">
                    <input type="text" @change="validChangePass($event.target.value,item.id_usuario)">
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:[`item.estatus`]="{ item }">
            <v-switch
              :input-value="item.estatus == 1 ? true : false"
              :label="item.estatus == 1 ? 'Activo' : 'Inactivo'"
              @change="changeStatus(item.id_usuario, item.estatus)"
            ></v-switch>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!--Modal Editar-->
    <v-dialog v-model="dialogEdit" persistent max-width="500px">
      <v-card v-if="dialogEdit">
        <v-card-title>
        <span>
          Editar {{tipoEdit == 1 ? 'Correo' : 'Tipo'}}
        </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" v-if="tipoEdit == 1">
                  <v-text-field
                    v-model="emailEdit"
                    :rules="emailRules"
                    label="Correo"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="tipoEdit == 2">
                  <v-autocomplete
                    :items="permisos"
                    v-model="permisoE"
                    :rules="permisoRules"
                    item-value="id_permiso"
                    label="Elige un permiso"
                    item-text="nombre"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
              Cancelar
          </v-btn>
          <v-btn
            :loading="buttonSaveEdit"
            color="blue darken-1"
            text
            @click="validEdit()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";
import NewUser from './NewUser';
export default {
  name: "IndexUsuarios",
  components: {
    NewUser
  },
  data: () => ({
    dataUsers:[],
    headers: [
      { text: "Correo", value: "email" },
      { text: "Tipo", value: "permiso" },
      { text: "Cambiar Contraseña", value: "pass" },
      { text: "Estatus", value: "estatus" },
    ],
    loadingU: false,
    permisos: [],
    loadingP: false,
    dialogEdit: false,
    tipoEdit: null,
    valid: true,
    id_usuarioE: null,
    emailEdit: '',
    emailRules: [
      (v) => !!v || "Correo requerido",
      (v) => /.+@.+\..+/.test(v) || "Correo invalido",
    ],
    permisoE: null,
    permisoRules: [(v) => !!v || "Selecciona un permiso"],
    buttonSaveEdit: false
  }),
  created(){
    this.getPermisos();
    this.getUsuarios();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    async getPermisos(){
      this.loadingP = true;
      this.permisos = [];
      try {
        const path = `${this.BASE_URL}usuarios/getPermisos/`;
        let res = await axios.get(path, this.AuthToken);
        //console.log(res.data);
        if(res.data.status == 'OK'){
          this.permisos = res.data.res;
        }else{
          
        }
        this.loadingP = false;
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
      this.loadingP = false;
    },
    async getUsuarios(){
      this.loadingU = true;
      this.dataUsers = [];
      try {
        const path = `${this.BASE_URL}usuarios/getUsuarios/`;
        let res = await axios.get(path, this.AuthToken);
        //console.log(res.data);
        if(res.data.status == 'OK'){
          this.dataUsers = res.data.res;
        }else{
          
        }
        this.loadingU = false;
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
      this.loadingU = false;
    },
    openEdit(id_usuario, data, tipo){
      tipo == 1 ? this.emailEdit = data : this.permisoE = data;
      this.id_usuarioE = id_usuario;
      this.tipoEdit = tipo;
      this.dialogEdit = true;
    },
    closeDialog(){
      this.$refs.form.reset();
      this.dialogEdit = false;
      this.tipoEdit = null;
      this.id_usuarioE = null;
    },
    validChangePass(pass, id_usuario){
      if(pass.length >= 9){
        this.changePass(pass, id_usuario);
      }else{
        this.alert('Error!','La contraseña debe tener al menos 9 dígitos','warning', 3000);
      }
    },
    async changePass(pass, id_usuario){
      const path = `${this.BASE_URL}usuarios/changePass/`;
      let data = new FormData();
      data.append("id_usuario", id_usuario);
      data.append("pass", pass);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        if(res.data.res == true){
          this.getUsuarios();
          this.alert('Contraseña actualizada!',' ','success', 2000);
        }else{
          this.alert('Ocurrió un error!','Inténtalo de nuevo','error', 2000);
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
    },
    validEdit(){
      if (this.$refs.form.validate() === true) {
        this.editUser();
      }
    },
    async editUser(){
      this.buttonSaveEdit = true;
      const path = `${this.BASE_URL}usuarios/editUser/`;
      let data = new FormData();
      data.append("id_usuario", this.id_usuarioE);
      data.append("data", this.tipoEdit == 1 ? this.emailEdit : this.permisoE);
      data.append("tipo", this.tipoEdit);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        let dat = res.data;
        //console.log(res.data)
        switch (dat.status) {
          case 'existing':
            this.alert('¡El correo electrónico ya esta registrado!',' ','warning', 2000);
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.closeDialog();
            this.getUsuarios();
            break;

          case 'error':
            this.alert('¡Error!','Intentelo de nuevo o comuníquese con soporte','error', 2000);
            break;
        
          default:
            break;
        }
        this.buttonSaveEdit = false;
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.buttonSaveEdit = false;
      }
    },
    async changeStatus(id_usuario, estatus){
      const path = `${this.BASE_URL}usuarios/changeStatus/`;
      let data = new FormData();
      data.append("id_usuario", id_usuario);
      data.append("estatus", estatus == 1 ? 0 : 1);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        //console.log(res.data);
        if(res.data.res == true){
          this.alert('Usuario actualizado!',' ','success', 2000);
        }else{
          this.alert('Ocurrió un error!','Inténtalo de nuevo','error', 2000);
        }
        this.getUsuarios();
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
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
  }
}
</script>