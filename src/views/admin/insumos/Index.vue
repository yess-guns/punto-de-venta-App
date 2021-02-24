<template>
  <v-row>
    <v-col md="4">
      <Unidades />
    </v-col>
    <v-col md="4">
      <Medidas />
    </v-col>
    <v-col md="4">
      <Categorias />
    </v-col>
    <v-col md="12">
      <Insumos />
    </v-col>
  </v-row>
</template>
<script>
import Insumos from '@/views/admin/insumos/Insumos.vue';
import Categorias from '@/views/admin/insumos/Categorias.vue';
import Unidades from '@/views/admin/insumos/Unidades.vue';
import Medidas from '@/views/admin/insumos/Medidas.vue';
export default {
  components: { 
    Insumos,
    Categorias,
    Unidades,
    Medidas 
  },
  name: "Encargado",
  data: () => ({
    tab: null,
  }),
  methods: {},
};
</script>