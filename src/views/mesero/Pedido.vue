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
          <v-toolbar-title>Pedido</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
  <!--nueva sub categoria-->

          

          </v-toolbar-items>
        </v-toolbar>
        <v-row>
      
    </v-row>
      </v-card>
    </v-dialog>
  
  </v-row>
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
import Pedido from './Pedido';
export default {
  name: "Pedido",
  components: {
    Pedido
  },
  data: () => ({
    catego: [],
    dialog: true,
  }),
  computed: {},
  methods: {

  },

  created(){
    this.catego = catego;
  }
};
</script>