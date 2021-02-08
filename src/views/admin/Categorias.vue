<template>
  <div>
    <h3>
      Categorías
      <v-dialog v-model="dialog" max-width="500px">
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
            <span class="headline">Nueva categoría</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="nombreCate"
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
      <br><br>
    </h3>

    <!--Categorias-->
    <v-row>
      <v-col cols="6" sm="3" md="2" v-for="(cat, index) in catego" :key="index">
        <v-card class="mx-auto" color="#80D8FF" dark @click="openDialogSubC(cat.subCate,cat.nombreCategoria)">
          <v-card-title>
          </v-card-title>
          <v-card-text class="headline black--text">
            {{cat.nombreCategoria}} 
           
          </v-card-text>

          <v-card-actions>
            
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <SubCategorias ref="openDialogSubCRef" />
  
  </div>
</template>

<script>
var catego = [
  {
    "nombreCategoria": "Platillos",
    "subCate": [
      {
        "nombreSubCategoria": "Huevos",
        "productos":[
          {"nombreProducto": "Huevos a la mexicana"},
          {"nombreProducto": "Huevos estrellados"}
          
        ]
      },
      {
        "nombreSubCategoria": "Postres",
        "productos":[]
      }
    ]
  },
  {
    "nombreCategoria": "Bebidas alcoholica",
    "subCate": [
      {
        "nombreSubCategoria": "Refrescos",
        "productos":[]
      },
      {
        "nombreSubCategoria": "Jugos",
        "productos":[]
      }
    ]
  }
];
import SubCategorias from './SubCategorias';
export default {
  name: "Categorias",
  components: {
    SubCategorias
  },
  data: () => ({
    catego: [],
    dialog: false,
    nombreCate: "",
    buttonSave : false
  }),
  computed: {},
  methods: {
    validar() {
      if (this.nombreCate != "") {
        this.newCate();
      } else {
        swal({
          title: "Error",
          text: "Ingresa un nombre de categoría",
          icon: "error",
          timer: 1500,
          button: false,
        });
      }
    },
    newCate() {
      this.buttonSave = true;
      this.catego.push({'nombreCategoria':this.nombreCate, 'subCate':[]})
      this.close();
    },
    close(){
      this.nombreCate = '';
      this.dialog = false;
      this.buttonSave = false;
    },

    openDialogSubC (subCate,nombreCategoria){
     this.$refs.openDialogSubCRef.openDialogSubCate(subCate,nombreCategoria);
    
    }
  },

  created(){
    this.catego = catego;
  }
};
</script>