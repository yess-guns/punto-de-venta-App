<template>
  <v-card>
    <v-card-title>
      Productos
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
      :items="productos"
      :items-per-page="5"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:[`item.nombreProducto`]="{ item }">
        <div @click="openDialogEdit(item)">
          {{ `${ item.nombreProducto}` }}
        </div>
      </template>
    </v-data-table>
    <!--Modal Nueva insumo-->
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-top-transition"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Nuevo producto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <template>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    color="success"
                    dark
                    @click="valid"
                  >
                    Guardar
                  </v-btn>
                </div>
              </template>
              
            </v-toolbar-items>
          </v-toolbar>
          <!-- Form-->
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    v-model="form.nombreP"
                    label="Nombre"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-autocomplete
                    :items="categoriasPro"
                    v-model="form.categoria"
                    item-value="id_categoriaPro"
                    label="Elige una categoria"
                    item-text="nombrecategoriaPro"
                    :loading="loadingSelect"
                    color="indigo"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    v-model="form.precio"
                    label="Precio"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-select
                    v-model="form.destino"
                    :items="destinos"
                    item-value="id_destino"
                    item-text="nombreDestino"
                    label="Destino"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-radio-group
                    v-model="form.tipo"
                    row
                  >
                    <v-radio
                      label="Receta"
                      value="2"
                    ></v-radio>
                    <v-radio
                      label="Pieza"
                      value="1"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row v-if="form.tipo == 2">
                <h2>Receta</h2>
                <v-col cols="12" sm="12" md="4" >
                  <v-text-field
                    v-model="formInsumo.nombre"
                    label="Nombre"
                    disabled
                  ></v-text-field>
                  <v-btn @click="dialogInsumo = true">
                    Elegir
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="12" md="4" >
                  <v-text-field
                    v-model="formInsumo.cantidad"
                    label="Cantidad"
                  ></v-text-field>{{ formInsumo.medida == '' ? 'unidad' : formInsumo.medida}}
                </v-col>
                <v-col cols="12" sm="12" md="3" >
                  <v-btn color="error" @click="resetFormIn">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" @click="addInsumo(formInsumo)" :disabled="parseInt(formInsumo.cantidad) > 0  ? false : true">
                    Agregar
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-data-table
                    :headers="headersInSel"
                    :items="insumosSelect"
                    :items-per-page="10"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <h2>Insumos</h2>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                      <div>
                         <v-icon @click="deleteInsumo(item)">
                          mdi-delete
                        </v-icon>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Modal Editar Producto-->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Editar Producto</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombrePEdit"
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
    <!--Modal Tabla Insumo-->
    <v-dialog v-model="dialogInsumo" max-width="750px">
      <v-card>
        <v-card-title>
        <span>Insumos</span>
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="headersIn"
            :items="insumos"
            :items-per-page="5"
            class="elevation-1"
            :loading="loadingIn"
            :search="search"
          >
            <template v-slot:top>
              <v-col md="4">
                <v-text-field
                  v-model="search"
                  label="Búsqueda"
                ></v-text-field>
              </v-col>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <div @click="insumoElegido(item)">
                <v-btn color="success">Agregar</v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "Productos",
  components: {
  },
  data: () => ({
    headers: [
      { text: "ID", value: "id_producto" },
      { text: "Nombre", value: "nombreProducto" },
      { text: "Categoria", value: "nombrecategoriaPro" },
      { text: "precio", value: "precio" },
      { text: "destino", value: "nombreDestino" },
      // { text: "Stock", value: "stock" },
    ],
    productos: [],
    destinos: [
      {'id_destino' : 1, 'nombreDestino': 'Cocina'},
      {'id_destino' : 2, 'nombreDestino': 'Bar'}
    ],
    //dialog
    loading: false,
    dialog: false,
    //Form
    form:{
      nombreP: '',
      categoria: null,
      tipo: null,
      precio: '',
      destino: null
    },
    formDefault:{
      nombreP: '',
      categoria: null,
      tipo: null,
      precio: '',
      destino: null
    },
    loadingSelect: false,
    buttonSave: false,
    //dialog edit
    dialogEdit: false,
    nombrePEdit: '',
    buttonSaveEdit: false,
    id_producto: 0,
    //Insumos
    headersIn: [
      { text: "ID", value: "id_insumo" },
      { text: "Nombre", value: "nombreInsumo" },
      { text: "Unidad", value: "nombreUnidad" },
      { text: "Medida", value: "nombreMedida" },
      { text: "Categoria", value: "nombreCategoriaIn" },
      { text: "Acción", value: "action" },
      // { text: "Stock Min x unidad", value: "stockMinUnidad" },
      // { text: "Stock Min x Medida", value: "stockMinMedida" },
      // { text: "Stock Inventario", value: "stockInventario" }
    ],
    insumos: [],
    search: "",
    //dialog
    insumo: {},
    loadingIn: false,
    dialogInsumo: false,
    formInsumo: {
      id_insumo: "",
      nombre: "",
      cantidad: "",
      medida: ""
    },
    formInsumoDef: {
      id_insumo: "",
      nombre: "",
      cantidad: "",
      medida: ""
    },
    headersInSel: [
      { text: "ID", value: "id_insumo" },
      { text: "Nombre", value: "nombreInsumo" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Unidad", value: "nombreUnidad" },
      { text: "Eliminar", value: "action" },
    ],
    insumosSelect: []
  }),
  created(){
    this.getProductos();
    this.getInsumos();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken", "categoriasPro"]),
  },
  methods: {
    async getProductos() {
      this.loading = true;
      this.productos = [];
      const path = `${this.BASE_URL}productos/getProductos/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.productos = data.res;
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
      if(this.form.nombreP != '' && this.form.categoria != null && this.form.tipo != null && parseInt(this.form.precio) > 0 && this.form.destino != null){
        this.newproducto();
      }else{
        this.alert('Formulario incompleto o error de información',' ','warning', 3000);
      }
    },
    async newproducto() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}productos/newproducto/`;
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
            this.getProductos();
            this.resetFormIn();
            this.insumosSelect = [];
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
      this.id_producto = item.id_producto;
      this.nombrePEdit = item.nombreProducto;
      this.dialogEdit = true;

    },
    validEdit(){
      if(this.nombrePEdit != ''){
        this.editProducto();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async editProducto() {
      this.buttonSaveEdit = true;
      const path = `${this.BASE_URL}productos/editProducto/`;
      let data = new FormData();
      data.append("id_producto", this.id_producto);
      data.append("nombrePEdit", this.nombrePEdit);
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
            this.nombrePEdit = '';
            this.dialogEdit = false;
            this.getProductos();
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
    async getInsumos() {
      this.loadingIn = true;
      this.insumos = [];
      const path = `${this.BASE_URL}insumos/getInsumos/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.insumos = data.res;
          this.loadingIn = false;
        } else {
          this.loadingIn = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.loadingIn = false;
      }
    },
    insumoElegido(item){
      this.formInsumo.id_insumo = item.id_insumo;
      this.formInsumo.nombre = item.nombreInsumo;
      this.formInsumo.medida = item.nombreMedida;
      this.dialogInsumo = false;
    },
    resetFormIn(){
      this.formInsumo = JSON.parse(JSON.stringify(this.formInsumoDef));
    },
    addInsumo(form){
      var index = this.insumosSelect.findIndex(insumo => insumo.id_insumo == form.id_insumo);
      if(index == -1){
        this.insumosSelect.push(
          {'id_insumo': form.id_insumo, 'nombreInsumo': form.nombre, 'cantidad': form.cantidad, 'nombreUnidad': form.medida}
        );
        this.resetFormIn();
      }else{
        this.alert('El insumo ya se encuentra agregado',' ','warning', 2000);
      }
    },
    deleteInsumo(item){
      var index = this.insumosSelect.findIndex(insumo => insumo.id_insumo == item.id_insumo);
      console.log(index)
      this.insumosSelect.splice(index, 1);
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