<template>
  <div>
   <Navbar :user="userData.tipo.tipoNombre" />
   <Mesas />
  </div>
</template>

<script>
import {mapState} from 'vuex';
import Navbar from '../Navbar';
import Mesas from '../../views/mesero/Mesas.vue';
export default {
  name: "Mesero",
  components: {
    Navbar,
    Mesas,
    Navbar
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    ...mapState(["userData"])
  },
  methods: {
  },
};
</script>