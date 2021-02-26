<template>
  <v-row>
    <v-col md="9">
      <Productos />
    </v-col>
    <v-col md="3">
      <Categorias />
    </v-col>
  </v-row>
</template>
<script>
import Categorias from '@/views/admin/productos/Categorias.vue';
import Productos from '@/views/admin/productos/Productos.vue';
export default {
  components: { 
    Categorias,
    Productos
  },
  name: "IndexProductos",
  data: () => ({
    tab: null,
  }),
  methods: {},
};
</script>