<template>

  <v-card>
    <v-container>
      <v-card-title>
        Pedido
        <v-spacer></v-spacer>
      </v-card-title>

      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
          hola
        </v-col>
      </v-row>
    </v-container>
  </v-card> 
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
export default {
  name: "Pedido",
  components: {
  },
  data: () => ({
    cateProduc: [],
    loading: false
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
          this.cateProduc = data.res;
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