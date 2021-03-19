<template>

  <v-card>
    <v-container>
      <v-card-title>
        Pedir
        <v-spacer></v-spacer>
      </v-card-title>

      <v-row>
        <!-- formulario -->
        <v-col cols="12" sm="6" md="6">
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-autocomplete
                v-model="cateSelec"
                :items="cateProduc"
                item-value="id_categoriaPro"
                item-text="nombrecategoriaPro"
                deletable-chips
                label="Categorias"
                :loading="loading"
                color="indigo"
                @change="selectCategoria"
              >                   
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-autocomplete
                v-model="producSelect"
                :items="productos"
                item-value="id_producto"
                item-text="nombreProducto"
                deletable-chips
                label="Productos"
                :loading="loading"
                color="indigo"
                :disabled="producSelect == null ? true : false"
                @change="selectProducto"
              >                   
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Comensal"
                v-model="comensal"
                @keypress="restrigirChars($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-btn
                color="primary"
                @click="addProducto"
              >
                Agregar
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <!-- Elegido -->
        <v-col cols="12" sm="6" md="6">
          <template v-for="(comanda, index) in comandas">
            <v-row :key="index">
              <v-col>
                {{comanda}}
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-card> 
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "Pedir",
  components: {
  },
  data: () => ({
    cateProduc: [],
    productos: [],
    loading: false,
    //formulario
    cateSelec: '',
    producSelect: null,
    comensal: '',

    nameCate: '',
    dataProd: {},
    comandas: []
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    async getCateProductos() {
      this.loading = true;
      this.cateProduc = [];
      const path = `${this.BASE_URL}productos/getCateProductos/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.cateProduc = data.cateProd;
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
    selectCategoria(){
      var index = this.cateProduc.findIndex(cate => cate.id_categoriaPro == this.cateSelec);
      this.productos = this.cateProduc[index].productos;
      this.producSelect = '';
      this.nameCate = this.cateProduc[index].nombrecategoriaPro;
    },
    selectProducto(){
      var index = this.productos.findIndex(produc => produc.id_producto == this.producSelect);
      this.dataProd = this.productos[index];
    },
    addProducto(){
      //var product = this.dataProd;
      this.dataProd.comenzal = this.comensal;
      this.comandas.push(this.dataProd)
    },
    restrigirChars(event) {//admite solo numeros
      if (
        event.charCode === 0 ||
        /\d/.test(String.fromCharCode(event.charCode))
      ) {
        return true;
      } else {
        event.preventDefault();
      }
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

  created(){
    this.getCateProductos();
  }
};
</script>