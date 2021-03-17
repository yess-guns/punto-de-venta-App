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

      <v-tab href="#tab-In-0">
        Insumos
      </v-tab>

      <v-tab href="#tab-In-1">
        Categorias
      </v-tab>

      <v-tab href="#tab-In-2">
        Unidades
      </v-tab>

      <v-tab href="#tab-In-3">
        Medidas
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(val, i) in components" :key="i" :value="'tab-In-' + i">
        <v-card flat>
          <!-- <v-card-text>{{ val.content }}</v-card-text> -->
          <component v-bind:is="val.component"></component>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import Insumos from '@/views/admin/insumos/Insumos.vue';
import Categorias from '@/views/admin/insumos/Categorias.vue';
import Unidades from '@/views/admin/insumos/Unidades.vue';
import Medidas from '@/views/admin/insumos/Medidas.vue';
export default {
  name: "Encargado",
  props: ["userID"],
  data: () => ({
    tab: null,
    components: [
      {
        component: Insumos,
      },
      {
        component: Categorias,
      },
      {
        component: Unidades,
      },
      {
        component: Medidas,
      },
    ],
  }),
  methods: {},
};
</script>