import { StyleSheet, Platform, Dimensions } from 'react-native';
import Globals from './Globals'

const WIDTH = Dimensions.get('window').width


export default StyleSheet.create({
  
  text: { color: 'black', fontSize: 16 },

  text: { color: 'black', fontSize: 16 },

  //titulos
  titulo: {
    fontSize: 20,
    marginBottom: 10,
  },

  // subtitulos planificador, resultado en negrita
  bajada: {
    // fontWeight: 'bold',
    fontSize: 16,
    //lineHeight: 22,
  },

  //Subtitulos Light
  subtitulos: {
    fontSize: 16,
    lineHeight: 22,
  },

  //Este es el resultado que sale del lado izquiero de planificador de viajes
  resultadoIzquierdoPlanificador: {
    fontSize: 16,
  },

  //texto buscador planificador de viajes
  texto: {
    fontSize: 16,
  },

  //ruta alternativa - planificadorResult
  rutaAlternativa: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },

  //boton planificar, guardar ruta, consultar saldo Bip
  botonText: {
    fontSize: 20,
    color: 'white',
  },
  botonTextNegro: {
    fontSize: 16,
    color: '#000000',
  },

  //Mensaje Accesibilidad, planificador de viajes
  textoAccesibilidad: {
    fontSize: 14,
    marginBottom: 15,
  },

  containerComboClaro: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    //borderRadius:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  //Contenedor del Boton planificar (Planificador de viajes)
  containerPlanificadorViaje: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  //Contenedor Selector de planificador (Origen y Destino)
  selectorPlanificador: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  //Texto de los selectores Origen y Destino
  textoSelectorPlanificador: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'white',
    paddingTop: 2,
    color: '#FFF',
  },

  //tipografia light textos
  tipografiaLight: {
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Light',
        // fontWeight:'600'
      },
      ios: {
        fontFamily: 'HelveticaNeue-Light',
      },
      default: {
        // other platforms, ios, web for example
      },
    }),
  },

  //tipografia Medium subtitulos
  tipografiaMedium: {
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Medium',
      },
      ios: {
        fontFamily: 'HelveticaNeue-Medium',
      },
      default: {
        // other platforms, ios, web for example
      },
    }),
  },

  //tipografia bold para titulos
  tipografiaBold: {
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Bold',
      },
      ios: {
        fontFamily: 'Helvetica-Bold',
      },
      default: {
        // other platforms, ios, web for example
      },
    }),
  },

  //Numero sin tipografia de estado de la red
  botonTextSinTipografia: {
    fontSize: 20,
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Medium',
      },
      ios: {
        fontFamily: 'HelveticaNeue-Medium',
      },
      default: {
        // other platforms, ios, web for example
      },
    }),
    color: 'white',
  },

  //Colores para Borders
  boder: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
  },

  //Boton acordeon Ruta Alternativa
  acordeonRutaAlternativa: {
    marginRight: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#888a8c',
    borderRadius: 20,
  },

  ///Texto Lineas Disponibles (Estado de la red)
  botonTextLight: {
    fontSize: 20,
    color: 'white',
  },

  //box rutas guardadas
  box: {
    borderRadius: 5,
    backgroundColor: '#DDD',
    padding: 20,
    margin: 5,
  },

  //mensaje de error
  mensajeError: {
    borderRadius: 10,
    backgroundColor: '#DDD',
    padding: 10,
    marginTop: 10,
    height: 40,
  },

  //texto rutas guardadas
  boxText: {
    fontSize: 14,
  },

  boxWarning: {
    borderRadius: 20,
    // backgroundColor: '#EBAC09',
    backgroundColor: '#f2a900',
    padding: 10,
    margin: 10,
  },

  //texto del warning
  textWarning: {
    fontSize: 12,
    padding: 5,
    margin: 0,
    width: '90%',
  },

  //Numero circulo de las líneas planificador y informacion de estaciones
  linea: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    top: -39, //-39
    position: 'relative',
  },

  //Numero circulo centrados para las intermodalidades.
  lineaIntermodalidad: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: '28%',
    color: 'white',
    top: -38, //-39
    position: 'relative',
  },
  linea4AIntermodalidad: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: '26%',
    top: -39,
  },
  menuTexto: {
    fontFamily: 'GothamBold',
  },

  SafeArea: {
    fontSize: 26,
    backgroundColor: '#EBAC09',
  },

  //Buscador Saldo Bip
  buscador: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    marginTop: 30,
    padding: 10,
    height: 40,
    fontSize: 16,
  },

  //Estructura Tarjeta Bip
  contenedorTarjetaBip: {
    backgroundColor: 'rgb(21, 114, 177)',
    borderRadius: 10,
    marginTop: 10,
    padding: 0,
    marginBottom: 20,
  },

  //Texto Contrato tarjeta Bip
  textoNumeroContrato: {
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },

  //Saldo y Vencimiento Tarjeta Bip
  textoSaldoFecha: {
    fontWeight: 'bold',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },

  //Numero Saldo
  saldoNumero: {
    fontSize: 36,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'white',
  },

  //Texto de vencimiento y cuotas
  vencimientoCuotas: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
    width: 200,
  },

  //Mensaje de informacion
  mensajeInfoBip: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },

  //texto tarjetas guardadas y rutas guardadas
  tarjetaYRutasGuardada: {
    textDecorationLine: 'none',
  },

  //Preguntas Ayuda Ruta Expresa
  questionRutaExpresaAyuda: {
    fontSize: 16,
    padding: 10,
    paddingLeft: 2,
  },

  selectOptionIntermodal: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
  },

  //Respuestas Ayuda Ruta Expresa
  answerRutaExpresaAyuda: {
    fontSize: 16,
    marginLeft: 40,
    marginBottom: 30,
    lineHeight: 20,
    textAlign: 'justify',
  },

  //Text input reclamos y sugerencias
  textInputReclamosSug: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    padding: 10,
    height: 40,
    fontSize: 16,
  },

  // Textos estándar de la App
  textoTitulo: {
    // Títulos principales
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Bold',
      },
      ios: {
        fontFamily: 'Helvetica-Bold',
      },
    }),
    fontSize: 20,
  },

  textoSubtitulo: {
    // Subtítulos
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Bold',
      },
      ios: {
        fontFamily: 'Helvetica-Bold',
      },
    }),
    fontSize: 16,
  },

  textoGeneral: {
    // Todo tipo de texto
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Light',
        // fontWeight:'600'
      },
      ios: {
        fontFamily: 'HelveticaNeue-Light',
      },
    }),
    fontSize: 16,
    lineHeight: 20,
    
  },
  textoServicio: {
    // texto de servicio
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Light',
        fontStyle: 'italic',
      },
      ios: {
        fontFamily: 'HelveticaNeue-Light',
        fontStyle: 'italic'
      },
    }),
    fontSize: 16,
    lineHeight: 20,
  },
  textoNota: {
    // Texto informativo al pie de un elemento
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Light',
        // fontWeight:'600'
      },
      ios: {
        fontFamily: 'HelveticaNeue-Light',
      },
    }),
    fontSize: 14,
  },

  textoSwitchActivo: {
    // Texto switch activo
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Bold',
      },
      ios: {
        fontFamily: 'Helvetica-Bold',
      },
    }),
    fontSize: 16,
  },

  textoSwitchInactivo: {
    // // Texto switch inactivo
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Light',
        // fontWeight:'600'
      },
      ios: {
        fontFamily: 'HelveticaNeue-Light',
      },
    }),
    fontSize: 16,
  },

  textoDestacado: {
    // Textos de los precios tarifas
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Bold',
      },
      ios: {
        fontFamily: 'Helvetica-Bold',
      },
    }),
    fontSize: 20,
  },

  textoBoton: {
    // Textos dentro de botones
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Bold',
      },
      ios: {
        fontFamily: 'Helvetica-Bold',
      },
    }),
    fontSize: 20,
  },
  textoBotonLlamadaTelefono: {
    // Textos dentro de botones
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Bold',
      },
      ios: {
        fontFamily: 'Helvetica-Bold',
      },
    }),
    fontSize: 24,
  },
  textoEtiqueta: {
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Medium',
      },
      ios: {
        fontFamily: 'HelveticaNeue-Medium',
      },
      default: {
        // other platforms, ios, web for example
      },
    }),
    fontSize: 16,
  },
  textoPaginacion: {
    ...Platform.select({
      android: {
        fontFamily: 'HelveticaNeueCyr-Medium',
      },
      ios: {
        fontFamily: 'HelveticaNeue-Medium',
      },
      default: {
        // other platforms, ios, web for example
      },
    }),
    fontSize: 12,
  },


  //titulos
  titulo: {
    fontSize: 20,
    marginBottom: 10,
  },

  // subtitulos planificador, resultado en negrita
  bajada: {
    fontSize: 16,
  },

  //Subtitulos Light
  subtitulos: {
    fontSize: 16,
    lineHeight: 22,
  },

  // Estilo para las celdas con márgenes
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginHorizontal: 10,  // Margen horizontal agregado a las celdas
  },

  cell: {
    flex: 1,
    fontSize: 16,
    marginVertical: 5, // Márgenes verticales para las celdas
    marginHorizontal: 10, // Márgenes horizontales para las celdas
  },

  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  tableContainer: {
    marginLeft:5,
    marginTop:20,
    marginRight:5
  },
  subCell: {
    flex: 1,
    fontSize: 14,
    color: '#000',  // Asegura que el texto sea visible
    marginVertical: 5,  // Márgenes verticales para los subceldas
    marginHorizontal: 10, // Márgenes horizontales para los subceldas
  },

// Estilo para el tabBar (fondo)
tabBar: {
  backgroundColor: '#f0f0f0',  // Fondo claro para que los botones se destaquen
  paddingVertical: 10,
},

// Estilo de los botones de los tabs
tabButton: {
  backgroundColor: '#00698F',  // Color de fondo de los tabs
  borderRadius: 20,  // Borde redondeado
  paddingHorizontal: 20,
  paddingVertical: 8,
  marginHorizontal: 5,  // Espacio entre los botones
},

// Estilo del tab activo (botón seleccionado)
tabButtonActive: {
  backgroundColor: '#004f6f',  // Color más oscuro cuando el tab está activo
},

// Estilo del texto dentro del botón
tabButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
},

pickerButton: {
  backgroundColor: '#00698F',
  padding: 15,
  marginLeft:10,
  marginRight:10,
  borderRadius: 10,
  marginVertical: 20,
  alignItems: 'center',
},
pickerButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},

// Estilo para el modal que contiene el Picker
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Fondo oscuro semitransparente
},
pickerContainer: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  marginHorizontal: 20,
},

// Estilo para el botón de cerrar el Modal
closeButton: {
  backgroundColor: '#00698F',
  padding: 10,
  marginTop: 20,
  borderRadius: 10,
  alignItems: 'center',
},
closeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},

subTableContainer: {
  marginTop:10,
  paddingLeft: 10,
  paddingTop: 10,
},
subRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 5,
},
subCellTitle: {
  flex: 1,
  fontSize: 14,
  fontWeight:'bold',
  color: '#000',
},
subCell: {
  flex: 1,
  fontSize: 14,
  color: '#555',
},
botonEstacion: {
  width: WIDTH * 0.9,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: Globals.COLOR.TURQUESA_QR,
  paddingHorizontal: WIDTH * 0.05,
  paddingVertical: WIDTH * 0.03,
  borderRadius: 20,
  marginTop: WIDTH * 0.03,
},
 
});
