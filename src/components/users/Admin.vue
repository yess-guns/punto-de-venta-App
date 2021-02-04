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

      <v-tab href="#tab-Productos"> Productos </v-tab>
      
      <v-tab href="#tab-otro"> Otro </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item value="tab-Productos">
        <v-card flat>
          <v-card-text> <Productos></Productos> </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-otro">
        <v-card flat>
          <v-card-text>
            Lol
          </v-card-text>
        </v-card>
      </v-tab-item>
      
    </v-tabs-items>
  </v-card>   
</template>

<script>
import Productos from '@/views/admin/Productos.vue';
export default {
  name: "Admin",
  components: {
    Productos
  },
  data: () => ({
    tab: null,
  }),
  computed: {},
  methods: {
  },
};
</script>