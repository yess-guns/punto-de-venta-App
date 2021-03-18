<template>
  <div>
    <!-- Modal nuevo Producto -->
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        fullscreen
        hide-overlay
        transition="dialog-top-transition"
      >
        <v-card>
          <v-toolbar
            dark
            color="#7986CB"
          >
            <v-btn
              icon
              dark
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Nuevo producto || {{ nombreCategoria }}</v-toolbar-title>
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
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.nombreP"
                    label="Nombre"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.precio"
                    label="Precio"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
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
                  <v-btn color="#FF9100" @click="dialogInsumo = true">
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
    <!--Modal Tabla Insumo-->
    <v-dialog v-model="dialogInsumo" max-width="750px">
      <v-card>
        <v-card-title>
        <h2>
          Insumos
          <v-btn
            icon
            color="green"
            @click="getInsumos"
          >
            <v-icon>mdi-cached</v-icon>
          </v-btn>
        </h2>
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
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "AddProducto",
  components: {
  },
  data: () => ({
    nombreCategoria: '',
    destinos: [
      {'id_destino' : 1, 'nombreDestino': 'Cocina'},
      {'id_destino' : 2, 'nombreDestino': 'Bar'}
    ],

    //dialog
    dialog: false,
    //Form
    form:{
      nombreP: '',
      categoria: null,
      tipo: null,
      precio: '',
      destino: null,
      insumos: []
    },
    formDefault:{
      nombreP: '',
      categoria: null,
      tipo: null,
      precio: '',
      destino: null,
      insumos: []
    },
    buttonSave: false,
    //Insumos
    headersIn: [
      { text: "ID", value: "id_insumo" },
      { text: "Nombre", value: "nombreInsumo" },
      { text: "Unidad", value: "nombreUnidad" },
      { text: "Medida", value: "nombreMedida" },
      { text: "Categoria", value: "nombreCategoriaIn" },
      { text: "Acción", value: "action" }
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
      { text: "Nombre", value: "nombreInsumo" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Unidad", value: "nombreUnidad" },
      { text: "Eliminar", value: "action" },
    ],
    insumosSelect: []
  }),
  created(){
    this.getInsumos();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken", "categoriasPro"]),
  },
  methods: {
    showModal(id_categoria, nombreCategoria){
      this.form = JSON.parse(JSON.stringify(this.formDefault));
      this.nombreCategoria = nombreCategoria;
      this.form.categoria = id_categoria;
      this.dialog = true;
    },
    valid(){
      if(this.form.nombreP != '' && this.form.categoria != null && this.form.tipo != null && parseInt(this.form.precio) > 0 && this.form.destino != null){
        if(this.form.tipo == 2){
          this.form.insumos = this.insumosSelect;
          //this.newproducto(); //sin insumos
          this.insumosSelect.length > 0 ? this.newproducto() : this.alert('No se han elegido insumos',' ','warning', 3000); // con insumos
        }else{//producto tipo unidad
          this.newproducto();
        }
        
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
            this.resetFormIn();
            this.$emit('refresh');
            this.dialog = false;
            this.insumosSelect = [];
            break;

          case 0:
            this.alert('Precausión!','Se guardo con éxito pero ocurrio un error al guardar sus insumos','warning', 3000);
            this.resetForm();
            this.resetFormIn();
            this.$emit('refresh');
            this.dialog = false;
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