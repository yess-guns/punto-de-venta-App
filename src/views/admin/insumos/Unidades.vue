<template>
  <v-card>
    <v-card-title>
      Unidades
      <v-btn
        class="mx-3"
        fab
        dark
        color="green"
        @click="dialog = !dialog"
      >
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-title>
    
    <v-data-table
      :headers="headers"
      :items="unidades"
      :items-per-page="5"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:[`item.nombreUnidad`]="{ item }">
        <div @click="openDialogEdit(item)">
          {{ `${ item.nombreUnidad}` }}
        </div>
      </template>
    </v-data-table>
    <!--Modal Nueva unidad-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Nueva Unidad</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreU"
                  label="Nombre"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = !dialog">
              Cancelar
          </v-btn>
          <v-btn
            :disabled="buttonSave"
            color="blue darken-1"
            text
            @click="valid()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Modal Editar unidad-->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Editar Unidad</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreUEdit"
                  label="Nombre"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogEdit = !dialogEdit">
              Cancelar
          </v-btn>
          <v-btn
            :disabled="buttonSaveEdit"
            color="blue darken-1"
            text
            @click="validEdit()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "Unidades",
  components: {
  },
  data: () => ({
    headers: [
      { text: "ID", value: "id_unidad" },
      { text: "Nombre", value: "nombreUnidad" },
      //{ text: "Estatus", value: "statusUnidad" },
    ],
    unidades: [],
    loading: false,
    dialog: false,
    nombreU: '',
    buttonSave: false,
    //dialog edit
    dialogEdit: false,
    nombreUEdit: '',
    buttonSaveEdit: false,
    id_unidad: 0
  }),
  created(){
    this.getUnidades();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    async getUnidades() {
      this.loading = true;
      this.unidades = [];
      const path = `${this.BASE_URL}insumos/getUnidades/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.unidades = data.res;
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
    valid(){
      if(this.nombreU != ''){
        this.newUnidad();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async newUnidad() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}insumos/newUnidad/`;
      let data = new FormData();
      data.append("nombreU", this.nombreU);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡Ya existe!',' ','warning', 2000);
            this.nombreU = '';
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.nombreU = '';
            this.getUnidades();
            break;

          case 'error':
            this.alert('¡Error!','Intentelo de nuevo o comuníquese con soporte','error', 2000);
            break;
        
          default:
            break;
        }
        
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
      this.buttonSave = false;
    },
    openDialogEdit(item){
      this.id_unidad = item.id_unidad;
      this.nombreUEdit = item.nombreUnidad;
      this.dialogEdit = true;

    },
    validEdit(){
      if(this.nombreUEdit != ''){
        this.editUnidad();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async editUnidad() {
      this.buttonSaveEdit = true;
      const path = `${this.BASE_URL}insumos/editUnidad/`;
      let data = new FormData();
      data.append("id_unidad", this.id_unidad);
      data.append("nombreUEdit", this.nombreUEdit);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡Ya existe!',' ','warning', 2000);
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.nombreUEdit = '';
            this.dialogEdit = false;
            this.getUnidades();
            break;

          case 'error':
            this.alert('¡Error!','Intentelo de nuevo o comuníquese con soporte','error', 2000);
            break;
        
          default:
            break;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
      this.buttonSaveEdit = false;
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