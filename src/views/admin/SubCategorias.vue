<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
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
          <v-toolbar-title>{{nombreCategoria}} -- Sub Categorías</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
  <!--nueva sub categoria-->

            <v-dialog v-model="dialog2" max-width="500px">
        <template v-slot:activator="{ on, attrs }">
           <v-btn
            dark
            color="indigo"
            fab
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Nueva SubCategoría</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="nombreSubCateForm"
                    label="Nombre"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close()">
              Cancelar
            </v-btn>
            <v-btn
              :disabled="buttonSave"
              color="blue darken-1"
              text
              @click="validar"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        

          </v-toolbar-items>
        </v-toolbar>
        <v-row>
      <v-col cols="6" sm="3" md="2" v-for="(subcat, index) in subCate" :key="index">
        <v-card class="mx-auto" color="#80D8FF" dark @click="openDialogProd(subcat.productos,subcat.nombreSubCategoria)">
          <v-card-title>
          </v-card-title>
          <v-card-text class="headline black--text">
            {{subcat.nombreSubCategoria}} 
           
          </v-card-text>

          <v-card-actions>
            
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
      </v-card>
    </v-dialog>
    <Productos ref="openDialogProdRef" />
  </v-row>
  
</template>



<script>
import Productos from './Productos';
export default {
  name: "SubCategorias",
  components: {
    Productos
  },
  data: () => ({
    subCate: [],
    dialog: false,
    dialog2: false,
    nombreCategoria: "",
    nombreSubCateForm: "",
    buttonSave : false
  }),
  computed: {},
  methods: {
    openDialogSubCate(subCate,nombreCategoria) {
      this.subCate = subCate;
      this.nombreCategoria = nombreCategoria;
      
      this.dialog = true;
    },
    validar() {
      if (this.nombreSubCate != "") {
        this.newSubCate();
      } else {
        swal({
          title: "Error",
          text: "Ingresa un nombre de la Sub Categoría",
          icon: "error",
          timer: 1500,
          button: false,
        });
      }
    },
    newSubCate() {
      this.buttonSave = true;
      this.subCate.push({'nombreSubCategoria':this.nombreSubCateForm, 'productos':[]})
      this.close();
    },
    close(){
      this.nombreSubCateForm = '';
      this.dialog2 = false;
      this.buttonSave = false;
    },
    openDialogProd (productos, nombreSubCategoria){
      this.$refs.openDialogProdRef.openDialogProductos(productos,nombreSubCategoria);
    }
  },
  created(){

  }
};
</script>