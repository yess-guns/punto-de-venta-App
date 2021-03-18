<template>
  <!--Modal Edit-->
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
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Detalles de producto</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <template>
              <div class="text-center mt-3">
                <v-btn
                  rounded
                  color="success"
                  dark
                  @click="valid"
                  :disabled="buttonSave"
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
                  @change="buttonSave = false"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-autocomplete
                  :items="categoriasPro"
                  v-model="form.categoria"
                  item-value="id_categoriaPro"
                  label="Elige una categoria"
                  item-text="nombrecategoriaPro"
                  color="indigo"
                  @change="buttonSave = false"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="form.precio"
                  label="Precio"
                  @change="buttonSave = false"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="form.destino"
                  :items="destinos"
                  item-value="id_destino"
                  item-text="nombreDestino"
                  label="Destino"
                  @change="buttonSave = false"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="form.tipo == 2">
              <v-col cols="12" sm="12">
                <v-data-table
                  :headers="headersInSel"
                  :items="insumosProducto"
                  :items-per-page="10"
                  class="elevation-1"
                  :loading="loading"
                >
                  <template v-slot:top>
                    <h2>
                      Insumos
                      <v-btn
                        icon
                        color="green"
                        @click="showModalAddIn"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </h2>
                  </template>
                  <template v-slot:[`item.cantidad`]="{ item }">
                    <div @click="openDialogEditCant(item)">
                      {{ `${ item.cantidad}` }}
                    </div>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-radio-group
                      v-model="item.statusProductoinsumo"
                      row
                      @change="updateStatus(item)"
                    >
                      <v-radio
                        label="Habilitado"
                        value="1"
                      ></v-radio>
                      <v-radio
                        label="Inhabilitado"
                        value="0"
                      ></v-radio>
                    </v-radio-group>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--Modal Editar Cantidad Insumo-->
    <v-dialog v-model="dialogEditC" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Editar Cantidad</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="cantidadInsumo"
                  label="Cantidad"
                ></v-text-field>
                {{unidadInsumo}}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogEditC = !dialogEditC">
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
    <AddInsumosProd ref="addInsumos" @refresh="getInsumos" />
  </v-row>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import AddInsumosProd from './AddInsumosProd';
export default {
  name: 'ProductosEdit',
  components:{
    AddInsumosProd
  },
  data: () => ({
    dialog: false,
    form:{
      id: 0,
      nombreP: '',
      categoria: null,
      tipo: null,
      precio: '',
      destino: null
    },
    formDefault:{
      id: 0,
      nombreP: '',
      categoria: null,
      tipo: null,
      precio: '',
      destino: null
    },
    buttonSave: true,
    headersInSel: [
      //{ text: "ID", value: "id_insumo" },
      { text: "Nombre", value: "nombreInsumo" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Unidad", value: "nombreMedida" },
      { text: "Status", value: "action" },
    ],
    insumosProducto:[],
    loading: false,
    destinos: [
      {'id_destino' : "1", 'nombreDestino': 'Cocina'},
      {'id_destino' : "2", 'nombreDestino': 'Bar'}
    ],
    //Editar cantidad
    dialogEditC: false,
    id_productoInsumo: 0,
    cantidadInsumo : 0,
    unidadInsumo: '',
    buttonSaveEdit : false
  }),
  created(){

  },
  computed: {
    ...mapState(["BASE_URL","AuthToken", "categoriasPro"]),
  },
  methods:{
    showModal(dataProd){
      this.resetForm();
      this.form.id = dataProd.id_producto;
      this.form.nombreP = dataProd.nombreProducto;
      this.form.categoria = dataProd.id_categoriaPro;
      this.form.precio = dataProd.precio;
      this.form.destino = dataProd.id_destino;
      this.form.tipo = dataProd.id_tipoPoducto;
      this.dialog = true;
      this.buttonSave = true;
      this.getInsumos();
      //console.log(dataProd)
    },
    resetForm(){
      this.form = JSON.parse(JSON.stringify(this.formDefault));
    },
    valid(){
      if(this.form.nombreP != '' && this.form.categoria != null && this.form.tipo != null && parseInt(this.form.precio) > 0 && this.form.destino != null){
        this.editProducto();
        
      }else{
        this.alert('Formulario incompleto o error de información',' ','warning', 3000);
      }
    },
    async editProducto() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}productos/editProducto/`;
      let data = new FormData();
      data.append("form", JSON.stringify(this.form));
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡El nombre de producto ya existe!',' ','warning', 2000);
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.$emit('refresh')
            this.dialog = false;
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
    async getInsumos() {
      this.loading = true;
      this.insumosProducto = [];
      const path = `${this.BASE_URL}insumos/getInsumosProduc/${this.form.id}`;
      try {
        let res = await axios.get(path, this.AuthToken);
        //console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.insumosProducto = data.res;
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
    async updateStatus(insumo){
      const path = `${this.BASE_URL}insumos/updateStatusInP/`;
      let data = new FormData();
      data.append("id_productoIn", insumo.id_productoInsumo);
      data.append("status", insumo.statusProductoinsumo);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        //console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'OK':
            this.alert('Actualizado!',' ','success', 2000);
            this.getInsumos();
            break;

          case 'error':
            this.alert('¡Error!','Intentelo de nuevo o comuníquese con soporte','error', 2000);
            this.getInsumos();
            break;
        
          default:
            break;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
    },
    openDialogEditCant(insumo){
      this.id_productoInsumo = insumo.id_productoInsumo;
      this.cantidadInsumo = insumo.cantidad;
      this.unidadInsumo = insumo.nombreMedida;
      this.dialogEditC = true;
    },
    validEdit(){
      if(this.cantidadInsumo != '' && parseInt(this.cantidadInsumo) > 0){
        this.editCantidad();
      }else{
        this.alert('Ingrese una cantidad valida!',' ','warning', 3000);
      }
    },
    async editCantidad(){
      const path = `${this.BASE_URL}insumos/updateCantidadInP/`;
      let data = new FormData();
      data.append("id_productoIn", this.id_productoInsumo);
      data.append("cantidad", this.cantidadInsumo);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        //console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'OK':
            this.alert('Actualizado!',' ','success', 2000);
            this.getInsumos();
            this.dialogEditC = false;
            break;

          case 'error':
            this.alert('¡Error!','Intentelo de nuevo o comuníquese con soporte','error', 2000);
            this.getInsumos();
            break;
        
          default:
            break;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
      }
    },
    showModalAddIn(){
      this.$refs.addInsumos.showModal(this.form.id, this.form.nombreP)
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