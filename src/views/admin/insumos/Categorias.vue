<template>
  <v-card>
    <v-card-title>
      Categorias
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
      :items="categorias"
      :items-per-page="5"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:[`item.nombreCategoriaIn`]="{ item }">
        <div @click="openDialogEdit(item)">
          {{ `${ item.nombreCategoriaIn}` }}
        </div>
      </template>
    </v-data-table>
    <!--Modal Nueva categoria-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Nueva Categoria</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreC"
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
    <!--Modal Editar categoria-->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Editar Categoria</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreCEdit"
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
  name: "Categorias",
  components: {
  },
  data: () => ({
    headers: [
      { text: "ID", value: "id_categoriaIn" },
      { text: "Nombre", value: "nombreCategoriaIn" },
      //{ text: "Estatus", value: "statusCategoria" },
    ],
    categorias: [],
    loading: false,
    dialog: false,
    nombreC: '',
    buttonSave: false,
    //dialog edit
    dialogEdit: false,
    nombreCEdit: '',
    buttonSaveEdit: false,
    id_categoriaIn: 0
  }),
  created(){
    this.getCategorias();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    async getCategorias() {
      this.loading = true;
      this.categorias = [];
      const path = `${this.BASE_URL}insumos/getCategorias/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.categorias = data.res;
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
      if(this.nombreC != ''){
        this.newCategoria();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async newCategoria() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}insumos/newCategoria/`;
      let data = new FormData();
      data.append("nombreC", this.nombreC);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡Ya existe!',' ','warning', 2000);
            this.nombreC = '';
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.nombreC = '';
            this.getCategorias();
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
      this.id_categoriaIn = item.id_categoriaIn;
      this.nombreCEdit = item.nombreCategoriaIn;
      this.dialogEdit = true;

    },
    validEdit(){
      if(this.nombreCEdit != ''){
        this.editCategoria();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async editCategoria() {
      this.buttonSaveEdit = true;
      const path = `${this.BASE_URL}insumos/editCategoria/`;
      let data = new FormData();
      data.append("id_categoriaIn", this.id_categoriaIn);
      data.append("nombreCEdit", this.nombreCEdit);
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
            this.nombreCEdit = '';
            this.dialogEdit = false;
            this.getCategorias();
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