<template>
  <v-card>
    <v-card-title>
      Insumos
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
      :items="insumos"
      :items-per-page="5"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:[`item.nombreInsumo`]="{ item }">
        <div @click="openDialogEdit(item)">
          {{ `${ item.nombreInsumo}` }}
        </div>
      </template>
    </v-data-table>
    <!--Modal Nueva insumo-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Nuevo Insumo</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreI"
                  label="Nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  :items="unidades"
                  v-model="unidad"
                  item-value="id_unidad"
                  label="Elige una unidad"
                  item-text="nombreUnidad"
                  :loading="loadingU"
                  color="indigo"
                >
                </v-autocomplete>
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
    <!--Modal Editar Insumo-->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Editar Insumo</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreIEdit"
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
  name: "Insumos",
  components: {
  },
  data: () => ({
    headers: [
      { text: "ID", value: "id_insumo" },
      { text: "Nombre", value: "nombreInsumo" },
      //{ text: "Estatus", value: "statusInsumo" },
    ],
    insumos: [],
    //dialog
    loading: false,
    dialog: false,
    nombreI: '',
    unidad: null,
    unidades: [],
    loadingU: false,
    buttonSave: false,
    //dialog edit
    dialogEdit: false,
    nombreIEdit: '',
    buttonSaveEdit: false,
    id_insumo: 0
  }),
  created(){
    this.getInsumos();
    this.getUnidades();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    async getUnidades() {
      this.loadingU = true;
      this.unidades = [];
      const path = `${this.BASE_URL}insumos/getUnidades/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.unidades = data.res;
          this.loadingU = false;
        } else {
          this.loadingU = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.loadingU = false;
      }
    },
    async getInsumos() {
      this.loading = true;
      this.insumos = [];
      const path = `${this.BASE_URL}insumos/getInsumos/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.insumos = data.res;
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
      if(this.nombreI != ''){
        this.newInsumo();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async newInsumo() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}insumos/newInsumo/`;
      let data = new FormData();
      data.append("nombreI", this.nombreI);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡Ya existe!',' ','warning', 2000);
            this.nombreI = '';
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.nombreI = '';
            this.getInsumos();
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
      this.id_insumo = item.id_insumo;
      this.nombreIEdit = item.nombreInsumo;
      this.dialogEdit = true;

    },
    validEdit(){
      if(this.nombreIEdit != ''){
        this.editInsumo();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async editInsumo() {
      this.buttonSaveEdit = true;
      const path = `${this.BASE_URL}insumos/editInsumo/`;
      let data = new FormData();
      data.append("id_insumo", this.id_insumo);
      data.append("nombreIEdit", this.nombreIEdit);
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
            this.nombreIEdit = '';
            this.dialogEdit = false;
            this.getInsumos();
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