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
        <v-col  sm="3" md="1">
          <v-text-field
            label="Comensal"
            v-model="comensal"
            @keypress="restrigirChars($event)"
          ></v-text-field>
        </v-col>
        <v-col  sm="5" md="3">
          <v-radio-group
            row
            label="Tiempo"
            v-model="tiempoP"
          >
            <template v-for="n in 3">
              <v-radio
                :key="n"
                :label="`${n}`"
                :value="n"
              ></v-radio>
            </template>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="4" md="2">
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
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="error"
                        icon
                        x-large
                        @click="printOrdenCocina()"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir pedido</span>
                  </v-tooltip>
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="success"
                        icon
                        x-large
                        :loading="btnSave"
                        :disabled="btnCocina"
                        @click="savePedido(pedidoCocina, 'Cocina')"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                    <span>Guardar Pedido</span>
                  </v-tooltip>
                </h3>
              </v-col>
            </v-row>
            <v-row class="blue-grey lighten-3 mr-1">
              <v-col cols="2">
                Comenzal
              </v-col>
              <v-col cols="6">
                Producto
              </v-col>
              <v-col cols="2">
                Tiempo
              </v-col>
              <v-col cols="2">

              </v-col>
            </v-row>
            <template v-for="(pedido, index) in pedidoCocina">
              <v-row :key="index">
                <v-col md="2">
                  {{pedido.comensal}}
                </v-col>
                <v-col md="6">
                  {{pedido.nombreProducto}}
                </v-col>
                <v-col md="2">
                  {{pedido.tiempoP}}
                </v-col>
                <v-col md="2">
                  <v-btn icon @click="deleteProdCocina(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-divider></v-divider>
            <v-row class="mt-3">
              <v-col cols="12">
                Comentario
                <v-radio-group
                  v-model="comentRadioC"
                  row
                >
                  <v-radio
                    label="Si"
                    value="si"
                  ></v-radio>
                  <v-radio
                    label="No"
                    value="no"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" v-if="comentRadioC == 'si'">
                <v-textarea
                  label="Comentario"
                  auto-grow
                  outlined
                  rows="1"
                  row-height="25"
                  color="indigo"
                  v-model="comentCocina"
                ></v-textarea>
              </v-col>
            </v-row>
          </template>
        </v-col>
        <!-- Pedido Bar -->
        <v-col cols="12" md="6" v-if="pedidoBar.length > 0">
          <template>
            <v-row>
              <v-col cols="12" class="text-center text-decoration-underline" >
                <h3 class="blue--text">
                  Bar
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="error"
                        icon
                        x-large
                        @click="printOrdenBar()"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir Pedido</span>
                  </v-tooltip>
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="success"
                        icon
                        x-large
                        :loading="btnSave"
                        :disabled="btnBar"
                        @click="savePedido(pedidoBar, 'Bar')"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                    <span>Guardar Pedido</span>
                  </v-tooltip>
                </h3>
              </v-col>
            </v-row>
            <v-row class="blue-grey lighten-3 mr-1">
              <v-col cols="2">
                Comenzal
              </v-col>
              <v-col cols="6">
                Producto
              </v-col>
              <v-col cols="2">
                Tiempo
              </v-col>
              <v-col cols="2">
                
              </v-col>
            </v-row>
            <template v-for="(pedido, index) in pedidoBar">
              <v-row :key="index">
                <v-col md="2">
                  {{pedido.comensal}}
                </v-col>
                <v-col md="6">
                  {{pedido.nombreProducto}}
                </v-col>
                <v-col md="2">
                  {{pedido.tiempoP}}
                </v-col>
                <v-col md="2">
                  <v-btn icon @click="deleteProdBar(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-divider></v-divider>
            <v-row class="mt-3">
              <v-col cols="12">
                Comentario
                <v-radio-group
                  v-model="comentRadioB"
                  row
                >
                  <v-radio
                    label="Si"
                    value="si"
                  ></v-radio>
                  <v-radio
                    label="No"
                    value="no"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" v-if="comentRadioB == 'si'">
                <v-textarea
                  label="Comentario"
                  auto-grow
                  outlined
                  rows="1"
                  row-height="25"
                  color="indigo"
                  v-model="comentBar"
                ></v-textarea>
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
    tiempoP: 1,

    nameCate: '',
    dataProd: {},
    pedidoCocina: [],
    pedidoBar: [],
    comentCocina: '',
    comentRadioC: 'no',
    comentBar: '',
    comentRadioB: 'no',

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
      this.dataProd.tiempoP = this.tiempoP;
      this.dataProd.comensalHtml = `<div class="text-center">${this.comensal}</div>`;
      this.dataProd.tiempoPHtml = `<div class="text-center">${this.tiempoP}</div>`;
      if(this.dataProd.nombreDestino == "Cocina"){
        this.pedidoCocina.push(this.dataProd);
        this.pedidoCocina.sort((a, b) => a.tiempoP - b.tiempoP);
      }else if(this.dataProd.nombreDestino == "Bar"){
        this.pedidoBar.push(this.dataProd);
        this.pedidoBar.sort((a, b) => a.tiempoP - b.tiempoP);
      }
      
      this.resetForm();
    },
    deleteProdCocina(index){
      this.pedidoCocina.splice(index, 1);
    },
    deleteProdBar(index){
      this.pedidoBar.splice(index, 1);
    },
    printOrdenBar(){
      this.btnBar = false;
      print(
        {
          header: '<h3 class="text-center">Pedido - Mesa: '+this.mesas+' <br>******Bar******</h3> <div id="inferior">*'+this.comentBar+'</div>',
          printable: this.pedidoBar,
          properties: [
            { field: 'comensalHtml', displayName: 'Comenzal' },
            { field: 'nombreProducto', displayName: `<div class ="productohtml">Producto</div>`}
          ],
          type: 'json',
          gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;',
	        gridStyle: 'border: 2px solid #3971A5; height:5px;',
          style: '.text-center { text-align: center; } #inferior {position:absolute; left:0px; right:0px; bottom:0px; height:50px; z-index:0;} .productohtml {width:210px;}',
          scanStyles: false
        }
      )
    },
    printOrdenCocina(){
      this.btnCocina = false;
      print(
        {
          header: '<h3 class="text-center">Pedido - Mesa: '+this.mesas+' <br>******Cocina******</h3> <div id="inferior">*'+this.comentCocina+'</div>',
          printable: this.pedidoCocina,
          properties: [
            { field: 'comensalHtml', displayName: 'Comenzal' },
            { field: 'nombreProducto', displayName: `<div class ="productohtml">Producto</div>`},
            { field: 'tiempoPHtml', displayName: 'Tiempo'}
          ],
          type: 'json',
          gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;',
	        gridStyle: 'border: 2px solid #3971A5; height:5px;',
          style: '.text-center { text-align: center; } #inferior {position:absolute; left:0px; right:0px; bottom:0px; height:50px; z-index:0;} .productohtml {width:200px;}',
          scanStyles: false
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
          this.alert('Guardado!',' ','success', 1500);
          if(destino == 'Cocina'){
            this.pedidoCocina = [];
            this.btnCocina = true;
            this.comentCocina = '';
            this.comentRadioC = 'no';
          }else if(destino == 'Bar'){
            this.pedidoBar = [];
            this.btnBar = true;
            this.comentBar = '';
            this.comentRadioB = 'no';
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
      this.tiempoP = "1";
      this.dataProd = {};
    },
    resetPedido(){
      this.pedidoCocina = [];
      this.pedidoBar = [];
      this.comentCocina = '';
      this.comentRadioC = 'no';
      this.comentBar = '';
      this.comentRadioB = 'no';
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