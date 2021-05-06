<template>
  <v-card>
    <v-card-title>
      Medidas
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
      <v-text-field
          v-model="search"
          label="Buscar"
        ></v-text-field>
    </v-card-title>
    
    <v-data-table
      :headers="headers"
      :items="medidas"
      :items-per-page="5"
      class="elevation-1"
      :loading="loading"
      :search="search"
    >
      <template v-slot:[`item.nombreMedida`]="{ item }">
        <div @click="openDialogEdit(item)">
          {{ `${ item.nombreMedida}` }}
        </div>
      </template>
    </v-data-table>
    <!--Modal Nueva medida-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Nueva Medida</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreM"
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
    <!--Modal Editar medida-->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>
        <span>Editar Medida</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombreMEdit"
                  label="Nombre"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogEdit = !dialogEdit">
              Cancelar
          </v-btn>
          <v-btn
            :disabled="buttonSaveEdit"
            color="blue darken-1"
            text
            @click="validEdit()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Medidas",
  components: {
  },
  data: () => ({
    headers: [
      { text: "ID", value: "id_medida" },
      { text: "Nombre", value: "nombreMedida" },
      //{ text: "Estatus", value: "statusMedida" },
    ],
    medidas: [],
    loading: false,
    dialog: false,
    nombreM: '',
    buttonSave: false,
    //dialog edit
    dialogEdit: false,
    nombreMEdit: '',
    buttonSaveEdit: false,
    id_medida: 0,
    search: ''
  }),
  created(){
    this.getMedidas();
  },
  computed: {
    ...mapState(["BASE_URL","AuthToken"]),
  },
  methods: {
    ...mapMutations(["saveDataFormInsumo"]),
    async getMedidas() {
      this.loading = true;
      this.medidas = [];
      const path = `${this.BASE_URL}insumos/getMedidas/`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (res.data.status == 'OK') {
          this.medidas = data.res;
          this.saveDataFormInsumo(['medidas',this.medidas])
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
      if(this.nombreM != ''){
        this.newMedida();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async newMedida() {
      this.buttonSave = true;
      const path = `${this.BASE_URL}insumos/newMedida/`;
      let data = new FormData();
      data.append("nombreM", this.nombreM);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡Ya existe!',' ','warning', 2000);
            this.nombreM = '';
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.nombreM = '';
            this.getMedidas();
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
    openDialogEdit(item){
      this.id_medida = item.id_medida;
      this.nombreMEdit = item.nombreMedida;
      this.dialogEdit = true;

    },
    validEdit(){
      if(this.nombreMEdit != ''){
        this.editMedida();
      }else{
        this.alert('Ingrese un nombre!',' ','warning', 3000);
      }
    },
    async editMedida() {
      this.buttonSaveEdit = true;
      const path = `${this.BASE_URL}insumos/editMedida/`;
      let data = new FormData();
      data.append("id_medida", this.id_medida);
      data.append("nombreMEdit", this.nombreMEdit);
      try {
        let res = await axios.post(path, data, this.AuthToken);
        console.log(res.data);
        let dat = res.data;
        switch (dat.status) {
          case 'existing':
            this.alert('¡Ya existe!',' ','warning', 2000);
            break;

          case 'OK':
            this.alert('¡Guardado!',' ','success', 2000);
            this.nombreMEdit = '';
            this.dialogEdit = false;
            this.getMedidas();
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
      this.buttonSaveEdit = false;
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