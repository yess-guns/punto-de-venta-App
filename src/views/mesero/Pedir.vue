<template>

  <v-card>
    <v-container fluid>
      <v-row class="mx-5">
        <v-col cols="12" class="text-center">
          <h2>Nuevo pedido</h2>
        </v-col>
        <v-col sm="6" md="3">
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
        <v-col  sm="6" md="3">
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
        <v-col  sm="6" md="3">
          <v-text-field
            label="Comensal"
            v-model="comensal"
            @keypress="restrigirChars($event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn
            color="primary"
            @click="addProducto"
            :disabled="!validForm"
          >
            Agregar
          </v-btn>
        </v-col>
      </v-row>
      <!--Productos elegidos-->
      <v-row class="ml-2">
        <!-- Pedido Cocina -->
        <v-col cols="12" md="6" v-if="pedidoCocina.length > 0">
          <template>
            <v-row>
              <v-col cols="12" class="text-center text-decoration-underline" >
                <h3 class="blue--text">
                  Cocina
                  <v-btn
                    color="error"
                    icon
                    @click="printOrden(pedidoCocina), btnCocina = false"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                  <v-btn
                    color="success"
                    icon
                    :loading="btnSave"
                    :disabled="btnCocina"
                    @click="savePedido(pedidoCocina, 'Cocina')"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </h3>
              </v-col>
            </v-row>
            <v-row class="blue-grey lighten-3 mr-1">
              <v-col cols="3">
                Comenzal
              </v-col>
              <v-col cols="5">
                Producto
              </v-col>
              <v-col cols="2">
                Precio
              </v-col>
              <v-col cols="2">
                
              </v-col>
            </v-row>
            <template v-for="(pedido, index) in pedidoCocina">
              <v-row :key="index">
                <v-col md="3">
                  {{pedido.comensal}}
                </v-col>
                <v-col md="5">
                  {{pedido.nombreProducto}}
                </v-col>
                <v-col md="2">
                  ${{pedido.precio}}
                </v-col>
                <v-col md="2">
                  <v-btn icon @click="deleteProdCocina(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </template>
        </v-col>
        <!-- Pedido Bar -->
        <v-col cols="12" md="6" v-if="pedidoBar.length > 0">
          <template>
            <v-row>
              <v-col cols="12" class="text-center text-decoration-underline" >
                <h3 class="blue--text">
                  Bar
                  <v-btn
                    color="error"
                    icon
                    @click="printOrden(pedidoBar), btnBar = false"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                  <v-btn
                    color="success"
                    icon
                    :loading="btnSave"
                    :disabled="btnBar"
                    @click="savePedido(pedidoBar, 'Bar')"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </h3>
              </v-col>
            </v-row>
            <v-row class="blue-grey lighten-3 mr-1">
              <v-col cols="3">
                Comenzal
              </v-col>
              <v-col cols="5">
                Producto
              </v-col>
              <v-col cols="2">
                Precio
              </v-col>
              <v-col cols="2">
                
              </v-col>
            </v-row>
            <template v-for="(pedido, index) in pedidoBar">
              <v-row :key="index">
                <v-col md="3">
                  {{pedido.comensal}}
                </v-col>
                <v-col md="5">
                  {{pedido.nombreProducto}}
                </v-col>
                <v-col md="2">
                  ${{pedido.precio}}
                </v-col>
                <v-col md="2">
                  <v-btn icon @click="deleteProdBar(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-card> 
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
import print from 'print-js';
export default {
  name: "Pedir",
  components: {
  },
  props: [
    "mesas",
    "idVenta",
    "idEmpleado"
  ],
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
    pedidoCocina: [],
    pedidoBar: [],

    btnCocina: true,
    btnBar: true,
    btnSave: false
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
    validForm(){
      if((this.producSelect != null && this.producSelect != '') && this.comensal > 0){
        return true;
      }else return false;
    }
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
        if (data.status == 'OK') {
          this.cateProduc = data.cateProd;
          this.loading = false;
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuníquese a soporte','error', 2000);
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
      this.dataProd = JSON.parse(JSON.stringify(this.productos[index]));
    },
    addProducto(){
      this.dataProd.comensal = this.comensal;
      this.dataProd.comensalHtml = `<p class="text-center">${this.comensal}</p>`;
      if(this.dataProd.nombreDestino == "Cocina"){
        this.pedidoCocina.push(this.dataProd);
      }else if(this.dataProd.nombreDestino == "Bar"){
        this.pedidoBar.push(this.dataProd);
      }
      
      this.resetForm();
    },
    deleteProdCocina(index){
      this.pedidoCocina.splice(index, 1);
    },
    deleteProdBar(index){
      this.pedidoBar.splice(index, 1);
    },
    printOrden(productos){
      print(
        {
          header: '<h3 class="custom-h3">Pedido - Mesa: '+this.mesas+' </h3>',
          printable: productos,
          properties: [
            { field: 'comensalHtml', displayName: 'Comenzal' },
            { field: 'nombreProducto', displayName: 'Producto'}
          ],
          type: 'json',
          gridHeaderStyle: 'border-bottom: 2px solid #3971A5;',
          gridStyle: 'border: 2px solid #fff;',
          style: '.text-center { text-align: center; }'
        }
      )
    },
    async savePedido(pedido, destino) {
      this.btnSave = true;
      try {
        const path = `${this.BASE_URL}ventas/savePedido/`;
        let dataPost = new FormData();
        dataPost.append("idVenta", this.idVenta);
        dataPost.append("idEmpleado", this.idEmpleado);
        dataPost.append("pedido", JSON.stringify(pedido));
        let res = await axios.post(path, dataPost, this.AuthToken);
        console.log(res.data);
        if (res.data == 'OK') {
          if(destino == 'Cocina'){
            this.alert('Guardado!',' ','success', 1500);
            this.pedidoCocina = [];
            this.btnCocina = true;
          }else if(destino == 'Bar'){
            this.pedidoBar = [];
            this.btnBar = true;
          }
          this.cateSelec = '';
        } else {
          this.alert('Error!','Intentalo de nuevo comuníquese a soporte','error', 2000);
        }
        this.btnSave = false;
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuníquese a soporte','error', 2000);
        this.btnSave = false;
      }
    },
    resetForm(){
      this.producSelect = '';
      this.comensal = '';
      this.dataProd = {};
    },
    resetPedido(){
      this.pedidoCocina = [];
      this.pedidoBar = [];
    },
    resetAll(){
      this.resetForm();
      this.resetPedido();
      this.cateSelec = '';
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