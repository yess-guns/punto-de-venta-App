<template>
  <div>
    <v-card>
      <v-card-title>
        Categorias
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
      <v-card :loading="loading">
        <template slot="progress">
          <v-progress-linear
            color="primary"
            height="5"
            indeterminate
          ></v-progress-linear>
          <p class="text-center text--disabled" disabled>Cargando...</p>
        </template>
      </v-card>

      <v-row>
        <v-col
          v-for="(item, i) in categorias"
          cols="6"
          sm="3"
          md="2"
          :key="i" 
        >
          <v-card
            class="mx-auto"
            color="#FF6D00"
            dark
            @click="modalProd(item)"
          >
            <v-card-title class="white--text">
              <div class="text-h5">
                  {{ `${item.nombrecategoriaPro}` }}
              </div>
              
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <!--Modal Nueva categoria-->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
        <span>Nueva Categoria</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreC"
                  label="Nombre"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = !dialog">
              Cancelar
          </v-btn>
          <v-btn
            :disabled="buttonSave"
            color="blue darken-1"
            text
            @click="valid()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Productos ref="productos" @refresh="getCategorias" />
  </div>
</template>

<script>
import Productos from '@/views/admin/productos/Productos.vue';
import axios from "axios";
import { mapState, mapMutations } from "vuex";
export default {
  name: "CategoriasProductos",
  components: {
    Productos
  },
  data: () => ({
    headers: [
      { text: "ID", value: "id_categoriaPro" },
      { text: "Nombre", value: "nombrecategoriaPro" },
    ],
    categorias: [],
    loading: true,
    dialog: false,
    nombreC: '',
    buttonSave: false,
    
  }),
  created(){
    this.getCategorias();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    ...mapMutations(["saveCategorias"]),
    async getCategorias() {
      this.loading = true;
      this.categorias = [];
      const path = `${this.BASE_URL}productos/getCategorias/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.categorias = data.res;
          this.saveCategorias({'categorias': this.categorias})
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
      if(this.nombreC != ''){
        this.newCategoria();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async newCategoria() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}productos/newCategoria/`;
      let data = new FormData();
      data.append("nombreC", this.nombreC);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡Ya existe!',' ','warning', 2000);
            this.nombreC = '';
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.nombreC = '';
            this.getCategorias();
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
    modalProd(categoria){
      this.$refs.productos.showProductos(categoria);
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