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

      <v-tab href="#tab-categorias"> Categorías </v-tab>
      
      <v-tab href="#tab-otro"> Otro </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item value="tab-categorias">
        <v-card flat>
          <v-card-text> <categorias></categorias> </v-card-text>
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
import Categorias from '../../views/admin/Categorias.vue';
export default {
  name: "Admin",
  components: {
    Categorias
  },
  data: () => ({
    tab: null,
  }),
  computed: {},
  methods: {
  },
};
</script>