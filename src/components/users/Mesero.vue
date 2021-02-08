<template>
  <v-card>
    <v-tabs
      v-model="tab"
      background-color="blue lighten-1"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-mesas"> Mesas </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item value="tab-mesas">
        <v-card flat>
          <v-card-text> <Mesas />  </v-card-text>
        </v-card>
      </v-tab-item>
      
    </v-tabs-items>
  </v-card>   
</template>

<script>
import Mesas from '../../views/mesero/Mesas.vue';
export default {
  name: "Mesero",
  components: {
    Mesas
  },
  data: () => ({
    tab: null,
  }),
  computed: {},
  methods: {
  },
};
</script>