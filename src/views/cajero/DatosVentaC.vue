<template>
  <v-row class="mx-5">
    <v-col md="6">
      <v-row>
        <v-col cols="12">
          <h2>
            Total a Pagar: ${{ precioTotal.toFixed(2) }}
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="success"
                  @click="printTicket"
                  x-large
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <span>Imprimir Ticket</span>
            </v-tooltip>
          </h2>
        </v-col>
        <v-col cols="12">
              <!-- <v-btn
                icon
                color="#E0E0E0"
                x-large
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-ticket-confirmation</v-icon>
              </v-btn> -->
          <v-btn @click="statusPago = !statusPago" color="#FF3D00">
            Generar Pago
            <v-icon>mdi-ticket-confirmation</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="statusPago">
          <v-row>
            <v-col cols="4">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="success"
                    @click="pago.efectivo.status = !pago.efectivo.status"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon x-large>
                      mdi-cash-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>Efectivo</span>
              </v-tooltip>
            </v-col>
            <v-col cols="4">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="blue"
                    @click="pago.tarjetaCD.status = !pago.tarjetaCD.status"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon x-large>
                      mdi-credit-card-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>Tarjeta</span>
              </v-tooltip>
            </v-col>
            <v-col cols="4">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="amber"
                    @click="statusPropina = !statusPropina"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon x-large>
                      mdi-cash-usd
                    </v-icon>
                  </v-btn>
                </template>
                <span>Propina</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <!-- formulario efectivo -->
          <v-row v-if="pago.efectivo.status">
            <v-col cols="12">
              <h2>Efectivo</h2>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Monto"
                v-model="pago.efectivo.monto"
                prefix="$"
                @keypress="restrigirChars($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-radio-group
                v-model="pago.efectivo.statusFac"
                row
                label="Factura"
              >
                <v-radio
                  label="Si"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="false"
                  @click="pago.efectivo.factura = ''"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="4" v-if="pago.efectivo.statusFac">
              <v-text-field
                label="Factura"
                v-model="pago.efectivo.factura"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <!-- Formulario TarjetaDC -->
          <v-row v-if="pago.tarjetaCD.status" justify="end">
            <v-col cols="12">
              <h2>Tarjeta C/D</h2>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Monto"
                v-model="pago.tarjetaCD.monto"
                prefix="$"
                @keypress="restrigirChars($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Bouche"
                v-model="pago.tarjetaCD.bouche"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-radio-group
                v-model="pago.tarjetaCD.statusFac"
                row
                label="Factura"
              >
                <v-radio
                  label="Si"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="false"
                  @click="pago.tarjetaCD.factura = ''"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="4" v-if="pago.tarjetaCD.statusFac">
              <v-text-field
                label="Factura"
                v-model="pago.tarjetaCD.factura"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <!-- Formulario Propina -->
          <v-row v-if="statusPropina">
            <v-col cols="12">
              <h2>Propina</h2>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Propina Efectivo"
                v-model="pago.efectivo.propina"
                prefix="$"
                @keypress="restrigirChars($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Propina Tarjeta"
                v-model="pago.tarjetaCD.propina"
                prefix="$"
                @keypress="restrigirChars($event)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row v-if="pago.efectivo.status || pago.tarjetaCD.status" justify="end">
            <v-col cols="12" class="my-3 text-right">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="success"
                    @click="validPago"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon color="success" x-large>
                      mdi-printer-check
                    </v-icon>
                  </v-btn>
                </template>
                <span>Pagar</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-card md="6" class="ml-5">
      <v-card-title>
        Venta
        <v-spacer></v-spacer>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="ventaDatos"
        :items-per-page="10"
        class="elevation-1"
        :loading="loading"
      >
        <template v-slot:[`item.nombreProducto`]="{ item }">
          {{ item.nombreProducto == 'TOTAL' ? '' : item.nombreProducto }}
        </template>
        <template v-slot:[`item.empleado`]="{ item }">
          {{ `${ item.empleado.nombreEmpleado} ${item.empleado.apellidosEmpleado}` }}
        </template>
        <template v-slot:[`item.precio`]="{ item }">
          {{ `$ ${parseInt(item.precio).toFixed(2)}` }}
        </template>
      </v-data-table>

    </v-card>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
import print from 'print-js';
export default {
  name: "DatosVentaC",
  components: {
  },
  props: [
    "idVenta"
  ],
  data: () => ({
    headers: [
      { text: "Comenzal", value: "comenzal" },
      { text: "Producto", value: "nombreProducto" },
      { text: "Empleado", value: "empleado" },
      { text: "Precio", value: "precio", align: 'end' }
    ],
    ventaDatos: [],
    loading: false,
    precioTotal: 0,
    //pago
    statusPago: false,
    pago: {
      efectivo: {
        monto: '',
        propina: '',
        factura: '',
        statusFac: false,
        status: false
      },
      tarjetaCD: {
        monto: '',
        propina: '',
        bouche: '',
        factura: '',
        statusFac: false,
        status: false
      }
    },
    pagoDefaul: {
      efectivo: {
        monto: '',
        propina: '',
        factura: '',
        statusFac: false,
        status: false
      },
      tarjetaCD: {
        monto: '',
        propina: '',
        bouche: '',
        factura: '',
        statusFac: false,
        status: false
      }
    },
    statusPropina: false
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    async getDatosVenta(idVenta) {
      this.loading = true;
      this.ventaDatos = [];
      this.precioTotal = 0;
      const path = `${this.BASE_URL}ventas/getDatosVenta/${idVenta}`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (data.status == 'OK') {
          this.ventaDatos = data.res;
          this.loading = false;
          this.genTotal();
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.loading = false;
      }
    },
    async genTotal(){
      var countTotal = 0;
      await this.ventaDatos.forEach((produc, i) => {
        countTotal += parseInt(produc.precio);
        this.ventaDatos[i].precioHtml = `<div id="precioID">$ ${parseInt(produc.precio).toFixed(2)}</div>`;
      });
      this.precioTotal = countTotal;
      this.ventaDatos.push(
        {
          'comenzal': 'TOTAL',
          'nombreProducto': 'TOTAL',
          'empleado': {'nombreEmpleado': '', 'apellidosEmpleado': ''},
          'precio': this.precioTotal,
          'precioHtml': `<div id="precioID">$ ${this.precioTotal.toFixed(2)}</div>`
        }
      )
    },
    printTicket(){
      print(
        {
          header: '<h3 class="text-center">Los Candiles</h3>',
          printable: this.ventaDatos,
          properties: [
            { field: 'nombreProducto', displayName: 'Producto'},
            { field: 'precioHtml', displayName: 'Precio'}
          ],
          type: 'json',
          gridHeaderStyle: 'border-bottom: 2px solid #3971A5;',
          gridStyle: 'border: 2px solid #fff;',
          style: '.text-center { text-align: center; } #precioID { text-align: right; }'
        }
      )
    },
    validPago(){
      //validación efectivo
      if(this.pago.efectivo.status === false){
        var statusEfectivo = true;
      }else {
        if(this.pago.efectivo.statusFac === true){
          var statusEfectivo = (this.pago.efectivo.monto != '' && parseInt(this.pago.efectivo.monto) > 0 && this.pago.efectivo.factura != '') ? true : false;
        }else{
           var statusEfectivo = (this.pago.efectivo.monto != '' && parseInt(this.pago.efectivo.monto) > 0) ? true : false;
        }
      }
      //validación tarjetas
      if(this.pago.tarjetaCD.status === false){
        var statusTarjetaCD = true;
      }else {
        if(this.pago.tarjetaCD.statusFac === true){
          var statusTarjetaCD = (this.pago.tarjetaCD.monto != '' && parseInt(this.pago.tarjetaCD.monto) > 0 && this.pago.tarjetaCD.bouche != '' && this.pago.tarjetaCD.factura != '') ? true : false;
        }else{
           var statusTarjetaCD = (this.pago.tarjetaCD.monto != '' && parseInt(this.pago.tarjetaCD.monto) > 0 && this.pago.tarjetaCD.bouche != '') ? true : false;
        }
      }

      if(statusEfectivo && statusTarjetaCD){
        this.alert('Bien!','Good','success', 1000);
      }else{
        this.alert('Error!','Debe llenar todos los campos','error', 2000);
      }
      //alert('statusEfectivo: '+statusEfectivo)
      //alert('statusTarjetaCD: '+statusTarjetaCD)

    },
    restrigirChars(event) {//admite solo numeros
      if (
        event.charCode === 0 ||
        /\d/.test(String.fromCharCode(event.charCode))
      ) {
        return true;
      } else {
        event.preventDefault();
      }
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
  created(){
  }
};
</script>