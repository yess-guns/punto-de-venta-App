<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        persistent
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
              @click="dialog = !dialog"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title @click="dialogEdit = !dialogEdit">
              {{ nombreCategoria }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            Productos
            <v-btn
              class="mx-3"
              fab
              dark
              color="green"
              @click="modalAddProd"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-container>
            <v-data-table
              :headers="headers"
              :items="productos"
              :items-per-page="10"
              class="elevation-1"
              :loading="loading"
            >
              <template v-slot:[`item.nombreProducto`]="{ item }">
                <div @click="openDialogEdit(item)">
                  {{ `${ item.nombreProducto}` }}
                </div>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <v-btn
                  color="primary"
                  @click="details(item)"
                >
                  Editar
                </v-btn>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Modal Editar categoria-->
    <v-dialog v-model="dialogEdit" persistent max-width="500px">
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
            @click="validEditCate()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AddProducto ref="newProduct" @refresh="getProductos" />
    <ProductosEdit ref="detailsModal" @refresh="getProductos" />
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import ProductosEdit from './ProductosEdit';
import AddProducto from './AddProducto';
export default {
  name: "Productos",
  components: {
    AddProducto,
    ProductosEdit
  },
  data: () => ({
    id_categoria: 0,
    nombreCategoria: '',
    headers: [
      //{ text: "ID", value: "id_producto" },
      { text: "Nombre", value: "nombreProducto" },
      { text: "Categoria", value: "nombrecategoriaPro" },
      { text: "precio", value: "precio" },
      { text: "destino", value: "nombreDestino" },
      { text: "Acción", value: "action" }
      // { text: "Stock", value: "stock" },
    ],
    productos: [],
    //dialog
    loading: false,
    dialog: false,
    //Editar Categoria
    dialogEdit: false,
    nombreCEdit: '',
    buttonSaveEdit: false
  }),
  created(){
    //this.getProductos();
    this.getInsumos();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken", "categoriasPro"]),
  },
  methods: {
    showProductos(categoria){
      //alert(categoria)
      this.id_categoria = categoria.id_categoriaPro;
      this.nombreCategoria = categoria.nombrecategoriaPro;
      this.nombreCEdit = categoria.nombrecategoriaPro;
      this.dialog = true;
      this.getProductos();
    },
    async getProductos() {
      this.loading = true;
      this.productos = [];
      const path = `${this.BASE_URL}productos/getProductos/${this.id_categoria}`;
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
    modalAddProd(){
      this.$refs.newProduct.showModal(this.id_categoria, this.nombreCategoria);
    },    
    validEditCate(){
      if(this.nombreCEdit != ''){
        this.editCategoria();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async editCategoria() {
      this.buttonSaveEdit = true;
      const path = `${this.BASE_URL}productos/editCategoria/`;
      let data = new FormData();
      data.append("id_categoriaPro", this.id_categoria);
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
            this.dialog = false;
            this.$emit('refresh');
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
      this.search = '';
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
    details(formProducto){
      this.$refs.detailsModal.showModal(formProducto);
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