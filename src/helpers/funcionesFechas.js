var funcionesFechas = {
  fechaHoy(){
    var date = new Date();
    var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    var month = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    var year = date.getFullYear();
    var fecha = `${year}-${month}-${day}`;
    return fecha;
  },
  fechaES(date){
    var meses = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    var diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    var dataDate = date.split('-');
    var stringDate = `${parseInt(dataDate[2])} de ${meses[parseInt(dataDate[1])]} del ${dataDate[0]}`;
    return stringDate;
  },
  fechaESmes(date){
    var meses = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    var dataDate = date.split('-');
    var stringDate = `${meses[parseInt(dataDate[1])]} del ${dataDate[0]}`;
    return stringDate;
  }
}
export default funcionesFechas;