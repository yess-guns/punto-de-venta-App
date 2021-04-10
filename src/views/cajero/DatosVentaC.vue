<template>
  <v-row class="mx-5">
    <v-col md="6">
      <v-row v-if="folioPago == ''">
        <v-col cols="12">
          <h2>
            Total a Pagar: ${{ precioTotal.toFixed(2) }}
            <v-tooltip right v-if="precioTotal > 0">
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
        <v-col cols="12" v-if="precioTotal > 0">
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
                    @click="btnPagoEfectivo"
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
                    @click="btnPagoTarjeta"
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
                    @click="btnPropina"
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
          <v-row v-if="pago.tarjetaCD.status" justify="start">
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
              <v-radio-group
                v-model="pago.tarjetaCD.tipoT"
                row
              >
                <template v-for="(tipo, i) in tiposTarjeta">
                  <v-radio
                    :label="tipo.nombreTipoT"
                    :value="tipo.id_tipoTarjeta"
                    :key="i"
                  ></v-radio>
                </template>
              </v-radio-group>
            </v-col>
            <v-col cols="4">
              <v-radio-group
                v-model="pago.tarjetaCD.tipoA"
                row
              >
                <template v-for="(tipoA, i) in tiposAcepT">
                  <v-radio
                    :label="tipoA.nombreTacpetacion"
                    :value="tipoA.id_tipoTAceptacion"
                    :key="i"
                  ></v-radio>
                </template>
              </v-radio-group>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="# Tarjeta"
                v-model="pago.tarjetaCD.numTarjeta"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="CVC"
                v-model="pago.tarjetaCD.cvc"
              ></v-text-field>
            </v-col>
            <v-col cols="">
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
            <v-col cols="3" class="my-3 text-right">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="success"
                    @click="validPago"
                    :loading="btnPay"
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
            <v-col cols="3" class="my-3 text-right">
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
                      mdi-content-save
                    </v-icon>
                  </v-btn>
                </template>
                <span>Guardar</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <h2>Pago realizado por un monto de: $ </h2>
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
        <!-- <template v-slot:[`item.nombreProducto`]="{ item }">
          {{ item.nombreProducto == 'TOTAL' ? '' : item.nombreProducto }}
        </template> -->
        <template v-slot:[`item.precioUni`]="{ item }">
          {{ item.precioUni == '' ? '' : `$ ${parseInt(item.precioUni).toFixed(2)}` }}
        </template>
        <template v-slot:[`item.importe`]="{ item }">
          {{ `$ ${parseInt(item.importe).toFixed(2)}` }}
        </template>
      </v-data-table>

    </v-card>

    <!-- Ticket-final -->
    <div v-show="false">
      <div id="ticketFinal">
          <div class="text-center2">
            <div>LOS CANDILES</div>
            <div>TURISTICA DEL PALMAR S.A. DE C.V.</div>
            <div>R.F.C.: TPA921103JSA</div>
          </div>
          <div>EXPEDIDO EN:</div>
          <div class="text-center2">TLAXCALA - APIZACO MÉXICO </div>
          <div>FOLIO NO.: 385</div>
          <div>Fecha........:06/03/26  Hora.....:17:42</div>
          <div>Mesa........: 6  RST Personas....:3</div>
          <table class="tableProd">
            <thead>
              <tr class="izquierdo">
                <th>Cant</th>
                <th>Producto</th>
                <th>P. U.</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in ventaDatosPrint" :key="i">
                <td>{{ item.cantidad }}</td>
                <td style="font-size: 5px;">
                  {{ item.nombreProducto.length > 15 ? item.nombreProducto.slice(0, 15) : item.nombreProducto }}
                </td>
                <td class="derecha">
                  {{ `${parseInt(item.precioUni).toFixed(2)}` }}
                </td>
                <td class="derecha">
                  {{ `${parseInt(item.importe).toFixed(2)}` }}
                </td>
              </tr>
            </tbody>
          </table>
          <div>Total Productos: {{ ventaDatosPrint.length }}</div>
          <div>Sub total Alimentos: $ {{ precioTotal.toFixed(2) }}</div>
          <h2>Total: $ {{ precioTotal.toFixed(2) }}</h2>
      </div>
    </div>
    <v-col cols="8" sm="6" md="3">
      
    </v-col>
    
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
import print from 'print-js';
import funcionesG from '../../helpers/NumeroALetras';
export default {
  name: "DatosVentaC",
  components: {
  },
  props: [
    "idVenta",
    "mesas"
  ],
  data: () => ({
    tiposTarjeta: [],
    tiposAcepT: [],
    headers: [
      { text: "Cant", value: "cantidad" },
      { text: "Producto", value: "nombreProducto" },
      { text: "P. U.", value: "precioUni", align: 'end' },
      { text: "Importe", value: "importe", align: 'end' }
    ],
    ventaDatos: [],
    ventaDatosPrint: [],
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
        tipoT: '',
        tipoA: '',
        numTarjeta: '',
        cvc: '',
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
        tipoT: '',
        tipoA: '',
        numTarjeta: '',
        cvc: '',
        propina: '',
        bouche: '',
        factura: '',
        statusFac: false,
        status: false
      }
    },
    statusPropina: false,
    btnPay: false,
    folioPago: ''
  }),
  computed: {
    ...mapState(["BASE_URL","AuthToken"])
  },
  methods: {
    async getTiposTarjeta() {
      try {
        const path = `${this.BASE_URL}tarjetas/getTiposTarjeta/`;
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (data.status == 'OK') {
          this.tiposTarjeta = data.res.tiposT;
          this.tiposAcepT = data.res.tiposA;
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuniquese a soporte','error', 2000);
        this.loading = false;
      }
    },
    async getDatosVenta(idVenta) {
      this.resetAll();
      const path = `${this.BASE_URL}ventas/getDatosVentaCajero/${idVenta}`;
      try {
        let res = await axios.get(path, this.AuthToken);
        console.log(res.data);
        let data = res.data;
        if (data.status == 'OK') {
          this.ventaDatos = data.res;
          //this.ventaDatosPrint = JSON.parse(JSON.stringify(data.res));
          this.loading = false;
          this.ventaDatos.length > 0 ? this.genTotal() : '';
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
        countTotal += parseInt(produc.importe);
        this.ventaDatos[i].cantidadUniHtml = `<div class="text-center">${produc.cantidad}</div>`;
        this.ventaDatos[i].productoHtml = `<div class="width-produ">${produc.producto}</div>`;
        this.ventaDatos[i].precioUniHtml = `<div class="derechaAling">${parseInt(produc.precioUni).toFixed(2)}</div>`;
        this.ventaDatos[i].importeHtml = `<div class="derechaAling">${parseInt(produc.importe).toFixed(2)}</div>`;
      });
      this.precioTotal = countTotal;
      
      this.ventaDatos.push(
        {
          'cantidad': 'TOTAL',
          'cantidadUniHtml': '',
          'nombreProducto': '',
          'productoHtml': '',
          'precioUni': '',
          'importe': this.precioTotal,
          'precioUniHtml': '<div class="derechaAling">TOTAL</div>',
          'importeHtml': `<div class="derechaAling">$ ${this.precioTotal.toFixed(2)}</div>`
        }
      );
      
    },
    printTicket(){
      print(
        {
          header: `
            <h3 class="text-center">Los Candiles</h3>
            <h4 class="text-center">Venta mesa(s): ${this.mesas}</h4>
          `,
          printable: this.ventaDatos,
          properties: [
            { field: 'cantidadUniHtml', displayName: 'Cant'},
            { field: 'nombreProducto', displayName: 'Producto'},
            { field: 'precioUniHtml', displayName: 'P. U.'},
            { field: 'importeHtml', displayName: 'Importe'},
          ],
          type: 'json',
          gridHeaderStyle: 'border-bottom: 2px solid #3971A5;',
          gridStyle: 'border: 2px solid #fff;',
          style: '.text-center { text-align: center; } .derechaAling { text-align: right; } body { font-size: 8pt; } .width-produ { width: 60px;}'
        }
      );
    },
    btnPagoEfectivo(){
      this.pago.efectivo.status = !this.pago.efectivo.status;
      this.pago.efectivo.monto = '';
      this.pago.efectivo.factura = '';
      this.pago.efectivo.statusFac = false;
    },
    btnPagoTarjeta(){
      this.pago.tarjetaCD.status = !this.pago.tarjetaCD.status;
      this.pago.tarjetaCD.monto = '';
      this.pago.tarjetaCD.bouche = '';
      this.pago.tarjetaCD.factura = '';
      this.pago.tarjetaCD.statusFac = false;
    },
    btnPropina(){
      this.statusPropina = !this.statusPropina;
      this.pago.efectivo.propina = '';
      this.pago.tarjetaCD.propina = '';
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
          var statusTarjetaCD = (this.pago.tarjetaCD.monto != '' && parseInt(this.pago.tarjetaCD.monto) > 0 && this.pago.tarjetaCD.bouche != '' && this.pago.tarjetaCD.factura != '' && this.pago.tarjetaCD.tipoT != '' && this.pago.tarjetaCD.tipoA != '' && this.pago.tarjetaCD.numTarjeta != '' && this.pago.tarjetaCD.cvc != '') ? true : false;
        }else{
           var statusTarjetaCD = (this.pago.tarjetaCD.monto != '' && parseInt(this.pago.tarjetaCD.monto) > 0 && this.pago.tarjetaCD.bouche != '' && this.pago.tarjetaCD.tipoT != '' && this.pago.tarjetaCD.tipoA != '' && this.pago.tarjetaCD.numTarjeta != '' && this.pago.tarjetaCD.cvc != '') ? true : false;
        }
      }

      if(statusEfectivo && statusTarjetaCD){
        this.pago.efectivo.monto = this.pago.efectivo.monto == '' ? 0 : this.pago.efectivo.monto;
        this.pago.tarjetaCD.monto = this.pago.tarjetaCD.monto == '' ? 0 : this.pago.tarjetaCD.monto;
        console.log('suma ' + parseInt(this.pago.efectivo.monto) + parseInt(this.pago.tarjetaCD.monto));
        console.log('total ' + this.precioTotal);
        if(parseInt(this.pago.efectivo.monto) + parseInt(this.pago.tarjetaCD.monto) == parseInt(this.precioTotal)){
          //this.genTicketFinal();
          this.pay();
        }else{
          this.alert('Error!','Monto a pagar incorrecto','error', 2000);
        }        
      }else{
        this.alert('Error!','Debe llenar todos los campos','error', 2000);
      }
      //alert('statusEfectivo: '+statusEfectivo)
      //alert('statusTarjetaCD: '+statusTarjetaCD)

    },
    async pay(){
      this.btnPay = true;
      try {
        const path = `${this.BASE_URL}ventas/pay/`;
        let dataPost = new FormData();
        dataPost.append("idVenta", this.idVenta);
        dataPost.append("precioTotal", this.precioTotal);
        dataPost.append("pago", JSON.stringify(this.pago));
        let res = await axios.post(path, dataPost, this.AuthToken);
        console.log(res.data);
        if (res.data.status == 'OK') {
          this.alert('Guardado!',' ','success', 1500);
          this.folioPago = res.data.res;
          this.btnPay = false;
          this.resetPago();
        } else {
          this.alert('Error!','Intentalo de nuevo comuníquese a soporte','error', 2000);
        }
        this.btnPay = false;
      } catch (error) {
        console.log(error)
        this.alert('Error!','Revise su conexión o comuníquese a soporte','error', 2000);
        this.btnPay = false;
      }
    },
    genTicketFinal(){
      print(
        {
          // header: this.headerTickEnd,
          // printable: this.ventaDatos,
          printable: 'ticketFinal',
          properties: [
            { field: 'nombreProducto', displayName: 'Producto'},
            { field: 'precioHtml', displayName: 'Precio'}
          ],
          type: 'html',
          // type: 'json',
          gridHeaderStyle: 'border-bottom: 2px solid #3971A5;',
          gridStyle: 'border: 2px solid #fff;',
          style: `

            .text-center2 { text-align: center; }
            .izquierdo { text-align: left; }
            .derecha { text-align: right; }
            .tableProd { font-size: 10pt; }
            
          `
        }
      );
    },
    resetAll(){
      this.loading = true;
      this.ventaDatos = [];
      //this.ventaDatosPrint = [];
      this.precioTotal = 0;
      this.statusPago = false;
      this.statusPropina = false;
      this.pago = JSON.parse(JSON.stringify(this.pagoDefaul));
    },
    resetPago(){
      this.statusPago = false;
      this.statusPropina = false;
      this.pago = JSON.parse(JSON.stringify(this.pagoDefaul));
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
    this.getTiposTarjeta();
  }
};
</script>