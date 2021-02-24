<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
      <v-card class="blue py-5 text-center white--text">
        <h2>Login</h2>
      </v-card>
      <v-card class="px-4">
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  label="Correo"
                  :rules="emailRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  :rules="passRules"
                  type="password"
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                <v-btn
                  :disabled="!valid"
                  @click="validate"
                  x-large
                  block
                  color="success"
                >
                  Ingresar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  
</template>

<script>
import swal from "sweetalert";
import axios from "axios";
import { mapMutations, mapState } from "vuex";


export default {
  name: "Login",
  data: () => ({
  dialog: true,
  valid: true,
  validCerrar: true,
  email: "",
  emailRules: [
    (v) => !!v || "Correo requerido",
    (v) => /.+@.+\..+/.test(v) || "El correo debe ser valido",
  ],
  password: "",
  passRules: [
    (v) => !!v || "Contraseña requerida",
    (v) => (v && v.length > 8) || "Contraseña corta",
  ],
  ip: "",
  pais: "",
  region: "",
  }),
  created(){
    this.getIP();
  },
  computed: {
  ...mapState(["auth","BASE_URL"]),
  }, 
  methods: {
    ...mapMutations(["validarSesion"]),
    validate(){
    if (this.$refs.form.validate()) {
        this.login();
        }
    },
    async login(){
        this.valid = false;
        const path = `${this.BASE_URL}login/validated/`;
        let datos = new FormData();
        datos.append("email", this.email);
        datos.append("password", this.password);
        datos.append("ip", this.ip);
        datos.append("pais", this.pais);
        datos.append("region", this.region);
        try {
            let res = await axios.post(path, datos);
            this.valid = true;
            console.log(res.data);
            var data = res.data;
            if (data.res == 'OK') {
              if (data.token != "") {
              localStorage.setItem("Usuario-pdv", JSON.stringify(data.user));
              swal({
                  title: "Sesión iniciada",
                  text: "   ",
                  icon: "success",
                  timer: 1800,
                  button: false,
              });
              this.validarSesion();
              //console.log(data);
              } else if (data.token == "") {
                swal({
                    title: "Usuario o contraseña incorrectos",
                    text: "   ",
                    icon: "error",
                    timer: 1500,
                    button: false,
                });
              }
            }else{
              swal({
            title: "¡Error!",
            text: "Error en el servidor, comuniquese a soporte",
            icon: "error",
            timer: 3000,
            button: false,
            });
            this.valid = true;
            }
        } catch (error) {
            swal({
            title: "¡Error!",
            text: "Revise su conexión o comuniquese a soporte",
            icon: "error",
            timer: 3000,
            button: false,
            });
            this.valid = true;
        }
    },
    getIP() {
      axios
      .get("https://ipapi.co/json/")
      .then((res) => {
      this.ip = res.data.ip;
      this.pais = res.data.city;
      this.region = res.data.region;
      })
      .catch((error) => {
      this.respuesta = error;
      });
    },
  },
};

</script>