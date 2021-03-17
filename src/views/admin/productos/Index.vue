<template>
  <Categorias />
</template>
<script>
import Categorias from '@/views/admin/productos/Categorias.vue';
export default {
  components: { 
    Categorias
  },
  name: "IndexProductos",
  data: () => ({
    tab: null,
  }),
  methods: {},
};
</script>