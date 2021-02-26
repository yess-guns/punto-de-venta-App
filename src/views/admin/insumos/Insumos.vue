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
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
        <span>Nuevo Insumo</span>
        </v-card-title>
        {{ stockMinMedida }}
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  v-model="form.nombreI"
                  label="Nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete
                  :items="dataFormInsumo.unidades"
                  v-model="form.unidad"
                  item-value="id_unidad"
                  label="Elige una unidad"
                  item-text="nombreUnidad"
                  :loading="loadingSelect"
                  color="indigo"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete
                  :items="dataFormInsumo.medidas"
                  v-model="form.medida"
                  item-value="id_medida"
                  label="Elige una medida"
                  item-text="nombreMedida"
                  :loading="loadingSelect"
                  color="indigo"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete
                  :items="dataFormInsumo.categorias"
                  v-model="form.categoria"
                  item-value="id_categoriaIn"
                  label="Elige una categoria"
                  item-text="nombreCategoriaIn"
                  :loading="loadingSelect"
                  color="indigo"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  v-model="form.cantidadM"
                  label="Cantidad por medida"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  v-model="form.stockMinU"
                  label="Stock minimo por unidad"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  v-model="form.stockMinM"
                  label="Stock minimo por medida"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="resetForm">
              Limpiar
          </v-btn>
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
      { text: "Unidad", value: "nombreUnidad" },
      { text: "Medida", value: "nombreMedida" },
      { text: "Categoria", value: "nombreCategoriaIn" },
      { text: "Cantidad X medida", value: "catXmedida" },
      // { text: "Stock Min x unidad", value: "stockMinUnidad" },
      // { text: "Stock Min x Medida", value: "stockMinMedida" },
      // { text: "Stock Inventario", value: "stockInventario" }
    ],
    insumos: [],
    //dialog
    loading: false,
    dialog: false,
    //Form
    form:{
      nombreI: '',
      unidad: null,
      medida: null,
      categoria: null,
      cantidadM: '',
      stockMinU: '',
      stockMinM: '',
    },
    formDefault:{
      nombreI: '',
      unidad: null,
      medida: null,
      categoria: null,
      cantidadM: '',
      stockMinU: '',
      stockMinM: '',
    },
    loadingSelect: false,
    buttonSave: false,
    //dialog edit
    dialogEdit: false,
    nombreIEdit: '',
    buttonSaveEdit: false,
    id_insumo: 0
  }),
  created(){
    this.getInsumos();
    //this.getDataFormInsumo();
    //let dataForm = this.dataFormInsumo;
    //console.log(dataForm)
    // this.unidades = this.dataFormInsumo.unidades;
    // this.medidas = this.dataFormInsumo.medidas;
    // this.categorias = this.dataFormInsumo.categorias;
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken", "dataFormInsumo"]),
    stockMinMedida(){
      if(parseInt(this.form.cantidadM) > 0 && parseInt(this.form.stockMinU) > 0){
        this.form.stockMinM = parseInt(this.form.cantidadM) * parseInt(this.form.stockMinU);
      }else this.form.stockMinM = '';
    }
  },
  methods: {
    /*
    async getDataFormInsumo() {
      this.loadingSelect = true;
      this.unidades = [];
      const path = `${this.BASE_URL}insumos/getDataFormInsumo/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.unidades = data.res.unidades;
          this.medidas = data.res.medidas;
          this.categorias = data.res.categorias;
          this.loadingSelect = false;
        } else {
          this.alert('Error!','Intenta de nuevo o comuníquese a soporte','error', 2000);
          this.loadingSelect = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuníquese a soporte','error', 2000);
        this.loadingSelect = false;
      }
    },*/
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
      if(this.form.nombreI != '' && this.form.unidad != null && this.form.medida != null && this.form.categoria != null && parseInt(this.form.cantidadM) > 0 && parseInt(this.form.stockMinU) > 0){
        this.newInsumo();
      }else{
        this.alert('Formulario incompleto o error de información',' ','warning', 3000);
      }
    },
    async newInsumo() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}insumos/newInsumo/`;
      let data = new FormData();
      data.append("form", JSON.stringify(this.form));
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
            this.resetForm();
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
    resetForm(){
      this.form = JSON.parse(JSON.stringify(this.formDefault));
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