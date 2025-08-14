import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Switch,
  Keyboard,
  Platform,
} from 'react-native';
import BotonNuevo from './components/BotonNuevo';
import ComboBoxLinea from './components/ComboBoxLinea';
import Estilos from './Estilos';
import ComboBoxNuevo from './components/ComboBoxNuevo';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from './Globals';
import TextInputBorrar from './components/TextInputBorrar';
import ComboBoxFechaHora from './components/ComboBoxFechaHora';
import BotonArchivo from './components/BotonArchivo';
import BotonSimple from './components/BotonSimple';
import SwitchOpcion from './components/SwitchOpcion';
import SelectorEstacion from './js/components/SelectorEstacion';
import Carousel, { Pagination } from 'react-native-new-snap-carousel';

const numero_bip_img = require('./assets/imagenes/tarjetas/numero_bip.png');
const voucher_0 = require('./assets/imagenes/voucher/voucher_0.png');
const voucher_1 = require('./assets/imagenes/voucher/voucher_1.png');
const voucher_2 = require('./assets/imagenes/voucher/voucher_2.png');
const voucher_3 = require('./assets/imagenes/voucher/voucher_3.png');
const voucher_4 = require('./assets/imagenes/voucher/voucher_4.png');

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

function currencyFormat(num) {
  return parseFloat(num)
    .toFixed(0)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '1.');
}

const tiposRequerimiento = ['Reclamos', 'Sugerencias', 'Consultas', 'Felicitaciones', 'Objetos perdidos'];
const tiposRequerimientoCodigo = [
  { codigo: 8, texto: 'Reclamos' },
  { codigo: 9, texto: 'Sugerencias' },
  { codigo: 10, texto: 'Consultas' },
  { codigo: 11, texto: 'Felicitaciones' },
  { codigo: 12, texto: 'Objetos perdidos' },
];

const tiposReclamo = [
  'Máquina de carga bip! - Transacción en Boleterías - Tarifas y Medios de Pago',
  'MetroQR',
  'Atención al Cliente - Personal de Estaciones',
  'Tráfico de Trenes - Conducción - Frecuencia - Tiempos de espera - Congestión',
  'Falta de información al Usuario - Señalética',
  'Seguridad - Delitos - Accidentes',
  'Carencias o Defectos de Aseo',
  'Obras en Construcción - Ruidos - Entorno',
];
const tiposReclamoCodigo = [
  { codigo: 4, texto: 'Máquina de carga bip! - Transacción en Boleterías - Tarifas y Medios de Pago' },
  { codigo: 8, texto: 'MetroQR' },
  { codigo: 1, texto: 'Atención al Cliente - Personal de Estaciones' },
  { codigo: 6, texto: 'Tráfico de Trenes - Conducción - Frecuencia - Tiempos de espera - Congestión' },
  { codigo: 3, texto: 'Falta de información al Usuario - Señalética' },
  { codigo: 5, texto: 'Seguridad - Delitos - Accidentes' },
  { codigo: 2, texto: 'Carencias o Defectos de Aseo' },
  { codigo: 7, texto: 'Obras en Construcción - Ruidos - Entorno' },
];

const tiposDocumento = [
  'Billetera con documentos',
  'Carpeta con documentos o exámenes',
  'Cédula de identidad',
  'Licencia de conducir',
  'Pase Escolar (TNE)',
  'Tarjeta Adulto Mayor (TAM o TbAM)',
  'Tarjeta bip! personalizada',
  'Tarjeta bancaria',
  'Otro (describir en detalle del requerimiento)',
];

const tiposObjetos = [
  'Bolso - mochila - cartera',
  'Lentes de sol u ópticos',
  'Teléfono celular',
  'Otro (describir en detalle del requerimiento)',
];

const getParam = async (label) => {
  try {
    const value = await AsyncStorage.getItem(label);
    return value != null ? value : null;
  } catch (e) {
    console.log(e);
  }
};

class Consultas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aceptar: false,
      verNumeroBip: false,
      verNumeroVendedor: false,
      mostrarSelectEstacion: true,
      caracteres_actual: 0,
      caracteres_disponibles: 1000,
      idRegistro: '',
      images: [voucher_0, voucher_1, voucher_2, voucher_3, voucher_4],
      key0: new Date().getTime() + 1,
      key1: new Date().getTime() + 2,
      key2: new Date().getTime() + 3,
      keyReset0: `key${Math.random() * 1000}`,
      keyReset1: `key${Math.random() * 1000}`,
      listaEstaciones: [],
      rutVisible: false,
      tipoRequerimiento: '',
      tipoReclamo: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      numeroBip: '',
      maquina: '',
      monto: '',
      detalle: '',
      estacion: '',
      parteFecha: '',
      parteHora: '',
      linea: '',
      codEstacion: '',
      terminosSelected: '',
      mostrarMaquina: false,
      enviando: false,
      fechaLimpia: true,
      tipoObjeto: 'Objeto',
      tipoDocumento: '',
      numeroRut: '',
      lugarExtravio: 'Tren',
      lineaExtravio: '',
      mostrarSelectorEstacion: false,
      keyboardVisible: false,
      metroQR: false,
      indiceCarousel: 0,
      imagen: {},
      hasSelected: false,
    };
  }

  componentDidMount() {

    console.log("didMount")

    this.props.navigation.setOptions({ title: 'Sugerencias y reclamos' });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      getParam('consultas').then((e) => {


        let jsonData = JSON.parse(e);
        if (e) {
          this.setState({
            estacion: jsonData['title'],
            linea: jsonData['linea'],
            codEstacion: jsonData['codigo'],
          });
          AsyncStorage.removeItem('consultas');
          console.log(jsonData['linea'])
        }
      });
      this.resetearCampos();
    });
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
    this._unsubscribe();
  }

  keyboardDidShow = () => {
    this.setState({ keyboardVisible: true });
  };

  keyboardDidHide = () => {
    this.setState({ keyboardVisible: false });
  };

  resetearCampos = () => {
    this.setState({
      tipoRequerimiento: '',
      key0: Math.round(Math.random() * 1000),
      key1: Math.round(Math.random() * 1000),
      key2: Math.round(Math.random() * 1000),
      caracteres_actual: 0,
      keyReset0: `key${Math.random() * 1000}`,
      keyReset1: `key${Math.random() * 1000}`,
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      estacion: '',
      numeroBip: '',
      maquina: '',
      monto: '',
      detalle: '',
      terminosSelected: false,
      mostrarMaquina: false,
      metroQR: false,
      codEstacion: '',
      fechaLimpia: true,
      imagen: {},
      lugarExtravio: 'Tren',
      lineaExtravio: '',
      numeroRut: '',
      hasSelected: false,
    });
  };

  onChangeNumeroBipQr = (texto) => {
    const textoLimpio = texto.toUpperCase().replace(/[^0-9K]/g, '');
    this.setState({ numeroBip: textoLimpio });
  };

  enviarFormulario = () => {
    const {
      tipoRequerimiento,
      tipoReclamo,
      nombre,
      apellido,
      email,
      telefono,
      numeroBip,
      maquina,
      monto,
      detalle,
      lugarExtravio,
      lineaExtravio,
      linea,
      estacion,
      codEstacion,
      parteFecha,
      parteHora,
      tipoObjeto,
      tipoDocumento,
      numeroRut,
      imagen,
    } = this.state;

   


    const tipoRequeriumientoCodigo = tiposRequerimientoCodigo.find((item) => item.texto == tipoRequerimiento).codigo;
    let tipoReclamoCodigo = null;
    if (tipoRequeriumientoCodigo == 8) {
      tipoReclamoCodigo = tiposReclamoCodigo.find((item) => item.texto == tipoReclamo).codigo;
    }
    this.setState({ enviando: true });

    let uri = `${Globals.MAIN_URL}/api/formulario_consultas.php`;
    if (tipoRequerimiento == 'Objetos perdidos') {
      uri = 'https://www.metro.cl/api/formulario_objetos.php';
    }

    console.log(tipoRequerimiento, uri);

    const body = new FormData();
    
    const appendIfValue = (key, value) => {
      
      //fix provisorio problema linea
      if ( value == "L") {
        value = this.state.linea.toUpperCase();
      }

      if (value) {
        body.append(key, value);
      }
    };

    appendIfValue('nombre', nombre);
    appendIfValue('apellido', apellido);
    appendIfValue('email', email ? email : 'noemail@metro.cl');
    appendIfValue('telefono', telefono);
    appendIfValue('numeroBip', numeroBip);
    appendIfValue('maquina', maquina);
    appendIfValue('monto', monto);
    appendIfValue('detalle', detalle);
    appendIfValue('tipoRequerimiento', tipoRequeriumientoCodigo);
    appendIfValue('tipoReclamo', tipoReclamoCodigo ? tipoReclamoCodigo : "");
    appendIfValue('linea', lugarExtravio == 'Estación' ? linea.toUpperCase() : 'L' + lineaExtravio.toUpperCase());
    appendIfValue('estacion', estacion);
    appendIfValue('codEstacion', codEstacion);
    appendIfValue('fecha', parteFecha);
    appendIfValue('hora', parteHora);
    if (tipoRequerimiento === 'Objetos perdidos') {
      appendIfValue('tipo', tipoObjeto == 'Objeto' ? 1 : 2);
      appendIfValue('objeto', tipoDocumento);
      appendIfValue('lugar', lugarExtravio == 'Estación' ? 1 : 2);
      appendIfValue('rut', numeroRut);
    }
    if (imagen.uri) {
      const adjunto = {
        name: imagen.fileName ? imagen.fileName : imagen.name,
        type: imagen.type,
        uri: Platform.OS === 'ios' ? imagen.uri.replace('file://', '') : imagen.uri,
      };
      body.append('adjunto', adjunto);
    }
    console.log(this.formDataToCurl(uri, body));
    
    console.log(body._parts);




    fetch(uri, {
      method: 'post',
      body: body,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
    })
      .then((response) => response.text())
      .then((text) => {
        const respuesta = JSON.parse(text);

        console.log(text);

        
        if (respuesta.estado == 0) {
          Alert.alert('Error', respuesta.mensaje, [{ text: 'Aceptar' }], { cancelable: false });
          return;
        }
        let registro = JSON.parse(text.split("'").join('"'));
        this.setState({ idRegistro: registro.idRegistro });
        //this.resetearCampos();
        this.showAlert();
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(
          'Error',
          `Ha habido un error al enviar su información, favor intente nuevamente`,
          [{ text: 'Aceptar' }],
          { cancelable: false },
        );
      })
      .finally(() => {
        this.setState({ enviando: false });
      });
  };

  
  formDataToCurl = (url, formData) => {
    let curl = `curl -X POST ${url}`;
    for (let pair of formData._parts) {
      const [key, value] = pair;
      if (value.uri) {
        curl += ` -F "${key}=@${value.uri};type=${value.type}"`;
      } else {
        curl += ` -F "${key}=${value}"`;
      }
    }
    return curl;
  };


  seleccionarEstacion = () => {
    this.setState({ mostrarSelectorEstacion: true });
  };

  estacionSeleccionada = (estacionSeleccionada) => {

    console.log(estacionSeleccionada);

    this.setState({
      estacion: estacionSeleccionada.title,
      linea: estacionSeleccionada.linea,
      codEstacion: estacionSeleccionada.codigo,
      mostrarSelectorEstacion: false,
    });
  };

  showAlert = () =>
    Alert.alert('Muchas Gracias', `El requerimiento ha sido enviado`, [{ text: 'Aceptar' }], { cancelable: false });

  onEnviar = () => {
    const {
      nombre,
      tipoRequerimiento,
      apellido,
      detalle,
      codEstacion,
      tipoReclamo,
      telefono,
      email,
      mostrarMaquina,
      numeroBip,
      metroQR,
      maquina,
      monto,
      lugarExtravio,
      lineaExtravio,
      estacion,
      tipoObjeto,
      tipoDocumento,
      numeroRut,
      terminosSelected,
    } = this.state;

    if (
      nombre == '' ||
      tipoRequerimiento == '' ||
      apellido == '' ||
      detalle == '' ||
      (codEstacion == '' && tipoRequerimiento != 'Objetos perdidos')
    ) {
      Alert.alert('Error', 'Debes ingresar todos los datos requeridos', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (tipoRequerimiento == '') {
      Alert.alert('Error', 'Selecciona el tipo de requerimiento', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (tipoRequerimiento == 'Reclamos' && !tipoReclamo) {
      Alert.alert('Error', 'Selecciona el tipo de reclamo', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (nombre == '' || apellido == '' || detalle == '') {
      Alert.alert('Error', 'Debes ingresar todos los datos requeridos"', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (telefono == '' && email == '') {
      Alert.alert(
        'Error',
        'Debes ingresar un correo electrónico o un teléfono de contacto.',
        [{ text: 'Aceptar', onPress: () => {} }],
        { cancelable: false },
      );
      return;
    }
    if (email != '' && (email.indexOf('@') == -1 || email.indexOf('.') == -1)) {
      Alert.alert('Error', 'Ingresa un correo válido', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (mostrarMaquina && !numeroBip) {
      Alert.alert('Error', 'El número de tarjeta bip! es obligatorio', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (metroQR && !numeroBip) {
      Alert.alert('Error', 'El Rut bip!QR es obligatorio', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (mostrarMaquina && !maquina) {
      Alert.alert(
        'Error',
        'la Máquina Autoservicio o Vendedor es obligatorio',
        [{ text: 'Aceptar', onPress: () => {} }],
        {
          cancelable: false,
        },
      );
      return;
    }
    if ((mostrarMaquina || metroQR) && !monto) {
      Alert.alert('Error', 'El monto solicitado es obligatorio', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      });
      return;
    }
    if (tipoRequerimiento == 'Objetos perdidos') {
      if (lugarExtravio == 'Tren') {
        if (!lineaExtravio) {
          Alert.alert('Error', 'Debe seleccionar la línea', [{ text: 'Aceptar', onPress: () => {} }], {
            cancelable: false,
          });
          return;
        }
      } else {
        if (!estacion) {
          Alert.alert('Error', 'Debe seleccionar la estación', [{ text: 'Aceptar', onPress: () => {} }], {
            cancelable: false,
          });
          return;
        }
      }
      if (tipoObjeto == 'Objeto') {
        if (!tipoDocumento) {
          Alert.alert('Error', 'Debe seleccionar el tipo de objeto', [{ text: 'Aceptar', onPress: () => {} }], {
            cancelable: false,
          });
          return;
        }
      } else {
        if (!tipoDocumento) {
          Alert.alert('Error', 'Debe seleccionar el tipo de documento', [{ text: 'Aceptar', onPress: () => {} }], {
            cancelable: false,
          });
          return;
        }
      }
      if (!numeroRut && tipoObjeto == 'Documento') {
        Alert.alert('Error', 'Debe ingresar el número de Rut', [{ text: 'Aceptar', onPress: () => {} }], {
          cancelable: false,
        });
        return;
      }
    }
    if (!terminosSelected) {
      Alert.alert(
        'Error',
        'Debes aceptar el tratamiento de datos personales',
        [{ text: 'Aceptar', onPress: () => {} }],
        { cancelable: false },
      );
      return;
    }
    this.enviarFormulario();
  };

  render() {
    const {
      verNumeroBip,
      verNumeroVendedor,
      mostrarSelectEstacion,
      caracteres_actual,
      caracteres_disponibles,
      images,
      key0,
      key1,
      key2,
      keyReset0,
      keyReset1,
      rutVisible,
      tipoRequerimiento,
      tipoReclamo,
      nombre,
      apellido,
      email,
      telefono,
      numeroBip,
      maquina,
      monto,
      detalle,
      estacion,
      parteFecha,
      parteHora,
      linea,
      codEstacion,
      terminosSelected,
      mostrarMaquina,
      enviando,
      fechaLimpia,
      tipoObjeto,
      tipoDocumento,
      numeroRut,
      lugarExtravio,
      lineaExtravio,
      mostrarSelectorEstacion,
      keyboardVisible,
      metroQR,
      indiceCarousel,
      imagen,
      hasSelected,
    } = this.state;

    const styles = StyleSheet.create({
      contenedorGeneral: {
        paddingTop: WIDTH * 0.03,
        height: mostrarMaquina ? HEIGHT * 2.35 : HEIGHT * 1.85,
      },
      container: {
        paddingHorizontal: WIDTH * 0.05,
      },
      etiquetaInput: {
        marginBottom: WIDTH * 0.03,
        marginTop: WIDTH * 0.05,
        textAlign: 'left',
        marginLeft: WIDTH * 0.03,
      },
      etiquetaInput2: {
        marginBottom: WIDTH * 0.03,
        marginTop: WIDTH * 0.05,
        textAlign: 'left',
        marginLeft: WIDTH * 0.03,
      },
      textoNota: {
        marginTop: 5,
        fontSize: 14,
        textAlign: 'right',
      },
      inputDetalleRequerimiento: {
        height: 100,
        borderWidth: 2,
        borderColor: Globals.COLOR.GRIS_3,
        borderRadius: 15,
        backgroundColor: '#FFF',
        verticalAlign: 'top',
      },
      contenedorTratamientoDatos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      textoTarjetaBip: {
        color: '#3F51B5',
        marginTop: 5,
        width: WIDTH * 0.9,
        textAlign: 'right',
      },
      textoBoton: {
        color: '#FFFFFF',
        textAlign: 'center',
      },
    });

    if (enviando) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ marginTop: HEIGHT / 2.5 }}>
            <ActivityIndicator size="large" color={Globals.COLOR.GRIS_4} />
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {true && (
          <ScrollView>
            {/* TIPO DE REQUERIMIENTO */}
            <View style={[styles.container]}>
              <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Tipo de requerimiento</Text>
              <ComboBoxNuevo
               // key={key0}
                title=""
                data={tiposRequerimiento}
                valorSeleccionado={tipoRequerimiento}
                placeholder="Selecciona tipo de requerimiento"
                onselect={(title) => {
                  if (!hasSelected) {
                    this.setState({
                      tipoRequerimiento: title,
                      mostrarMaquina: false,
                      metroQR: false,
                      tipo: title == 'Reclamos' ? 'reclamos' : 'sugerencias',
                      hasSelected: true,
                    });
                  }
                }}
              />
              {/* TIPO DE RECLAMO */}
              {tipoRequerimiento == 'Reclamos' && (
                <View>
                  <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Tipo de reclamo</Text>
                  <ComboBoxNuevo
                    key={key1}
                    title="Selecciona tipo de reclamo"
                    data={tiposReclamo}
                    valorSeleccionado={tipoReclamo}
                    onselect={(title) => {
                      if (title == 'Máquina de carga bip! - Transacción en Boleterías - Tarifas y Medios de Pago') {
                        this.setState({
                          tipoReclamo: title,
                          mostrarMaquina: true,
                          metroQR: false,
                          mostrarSelectEstacion: true,
                        });
                      } else if (title == 'MetroQR') {
                        this.setState({
                          tipoReclamo: title,
                          mostrarMaquina: false,
                          metroQR: true,
                        });
                      } else {
                        this.setState({
                          tipoReclamo: title,
                          mostrarMaquina: false,
                          metroQR: false,
                          mostrarSelectEstacion: true,
                        });
                      }
                    }}
                  />
                </View>
              )}
              {/* Objetos perdidos */}
              {tipoRequerimiento == 'Objetos perdidos' && (
                <View key={keyReset0}>
                  <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Selecciona lugar de extravío</Text>
                  <View style={{ alignItems: 'center' }}>
                    <SwitchOpcion
                      opciones={['Tren', 'Estación']}
                      onSelect={(opcion) => {
                        this.setState({
                          lugarExtravio: opcion,
                          estacion: '',
                        });
                      }}
                      ancho={160}
                    />
                  </View>
                  {lugarExtravio == 'Tren' && (
                    <View key={keyReset1}>
                      <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Línea</Text>
                      <ComboBoxLinea
                        valorSeleccionado={lineaExtravio}
                        placeholder="Selecciona línea"
                        onselect={(title) => {
                          this.setState({
                            lineaExtravio: title,
                          });
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
              {/* METRO QR */}
              {metroQR && (
                <View>
                  <View>
                    <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Rut bip!QR</Text>
                    <TextInputBorrar
                      width={WIDTH * 0.9}
                      autoCorrect={false}
                      placeholder="Ingresa tu Rut bip!QR"
                      value={numeroBip}
                      style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                      marginTop={0}
                      onChangeText={this.onChangeNumeroBipQr}
                    />
                  </View>
                  <View>
                    <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Monto solicitado</Text>
                    <TextInputBorrar
                      keyboardType="number-pad"
                      width={WIDTH * 0.9}
                      autoCorrect={false}
                      placeholder="Ingresa monto solicitado"
                      value={monto}
                      style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                      marginTop={0}
                      onChangeText={(text) => this.setState({ monto: text })}
                    />
                  </View>
                </View>
              )}
              {/* MOSTRAR MAQUINA */}
              {mostrarMaquina && (
                <View>
                  <View>
                    <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Tarjeta bip!</Text>
                    <TextInputBorrar
                      keyboardType="number-pad"
                      width={WIDTH * 0.9}
                      autoCorrect={false}
                      placeholder="Ingresa el número de tu tarjeta bip!"
                      value={numeroBip}
                      style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                      marginTop={0}
                      onChangeText={(text) => this.setState({ numeroBip: text })}
                    />
                    <Pressable
                      style={{
                        alignItems: verNumeroBip ? 'center' : 'flex-start',
                        marginBottom: 0,
                      }}
                      onPress={() => {
                        this.setState({ verNumeroBip: !verNumeroBip });
                      }}
                    >
                      <Text style={[Estilos.tipografiaMedium, styles.textoTarjetaBip]}>
                        {verNumeroBip ? 'cerrar ✖️' : '¿Donde está el número de mi tarjeta bip?'}
                      </Text>
                      {verNumeroBip && (
                        <Image
                          style={{
                            width: 300,
                            height: 200,
                            resizeMode: 'contain',
                            marginTop: 10,
                          }}
                          source={numero_bip_img}
                        />
                      )}
                    </Pressable>
                  </View>
                  <View>
                    <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>N° máquina de carga bip! o vendedor</Text>
                    <TextInputBorrar
                      width={WIDTH * 0.9}
                      autoCorrect={false}
                      placeholder="Ingresa n° máq. de carga bip! o vendedor"
                      value={maquina}
                      style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                      marginTop={0}
                      onChangeText={(text) => this.setState({ maquina: text })}
                    />
                    <Pressable
                      style={{
                        alignItems: verNumeroBip ? 'center' : 'flex-start',
                        marginBottom: 0,
                      }}
                      onPress={() => {
                        this.setState({
                          verNumeroVendedor: !verNumeroVendedor,
                        });
                      }}
                    >
                      <Text
                        style={[
                          Estilos.tipografiaMedium,
                          {
                            color: '#3F51B5',
                            marginTop: 5,
                            width: WIDTH * 0.9,
                            textAlign: 'right',
                          },
                        ]}
                      >
                        {verNumeroVendedor ? 'cerrar ✖️' : '¿Dónde encuentro este número?'}
                      </Text>
                    </Pressable>
                    {verNumeroVendedor && (
                      <View style={{ marginTop: WIDTH * 0.05 }}>
                        <Carousel
                          ref={(c) => { this._carousel = c; }}
                          data={images}
                          renderItem={(item) => (
                            <View style={{ width: WIDTH * 0.9, alignItems: 'center' }}>
                              <Image
                                source={images[item.index]}
                                style={{ width: WIDTH, height: WIDTH * 1.5, resizeMode: 'contain' }}
                              />
                            </View>
                          )}
                          sliderWidth={WIDTH}
                          itemWidth={WIDTH}
                          onSnapToItem={(index) => this.setState({ indiceCarousel: index })}
                        />
                        <Pagination
                          dotsLength={images.length}
                          activeDotIndex={indiceCarousel}
                          carouselRef={this._carousel}
                          dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'rgba(0, 0, 0, 0.92)',
                          }}
                          inactiveDotOpacity={0.4}
                          inactiveDotScale={0.6}
                          tappableDots={true}
                        />
                      </View>
                    )}
                  </View>
                  <View>
                    <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Monto solicitado</Text>
                    <TextInputBorrar
                      keyboardType="number-pad"
                      width={WIDTH * 0.9}
                      autoCorrect={false}
                      placeholder="Ingresa monto solicitado"
                      value={monto}
                      style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                      marginTop={0}
                      onChangeText={(text) => this.setState({ monto: text })}
                    />
                  </View>
                </View>
              )}
              {/* TIPO DE SELECCIONA ESTACIÓN */}
              {((mostrarSelectEstacion && tipoRequerimiento != 'Objetos perdidos') ||
                (tipoRequerimiento == 'Objetos perdidos' && lugarExtravio == 'Estación')) && (
                <View>
                  <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Estación</Text>
                  <BotonNuevo
                    key={key2}
                    color="#FFFFFF"
                    fontColor="#000000"
                    iconColor="#000000"
                    type="combo"
                    title={estacion}
                    placeholder="Selecciona tu estación"
                    onpress={this.seleccionarEstacion}
                  />
                </View>
              )}
              {tipoRequerimiento == 'Objetos perdidos' && (
                <View>
                  <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>¿Qué extraviaste?</Text>
                  <View style={{ alignItems: 'center' }}>
                    <SwitchOpcion
                      opciones={['Objeto', 'Documento']}
                      onSelect={(opcion) => {
                        this.setState({
                          numeroRut: "",
                          tipoObjeto: opcion,
                          tipoDocumento: '',
                          key0: `${Math.random() * 1000}_`,
                          rutVisible: opcion == 'Documento',
                          opcionesObjetosPerdidos: opcion == 'Objeto' ? tiposObjetos : tiposDocumento,
                        });
                      }}
                      ancho={199}
                    />
                  </View>
                  <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Selecciona una opción</Text>
                  {tipoObjeto == 'Objeto' && (
                    <ComboBoxNuevo
                      key={key0}
                      title={tipoDocumento}
                      data={tiposObjetos}
                      valorSeleccionado={tipoDocumento}
                      placeholder="Selecciona tipo de objeto"
                      onselect={(title) => {
                        this.setState({ tipoDocumento: title });
                      }}
                    />
                  )}
                  {tipoObjeto == 'Documento' && (
                    <ComboBoxNuevo
                      key={key0}
                      title={tipoDocumento}
                      data={tiposDocumento}
                      valorSeleccionado={tipoDocumento}
                      placeholder="Selecciona tipo de documento"
                      onselect={(title) => {
                        this.setState({ tipoDocumento: title });
                      }}
                    />
                  )}
                  {rutVisible && (
                    <View>
                      <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Número de Rut</Text>
                      <TextInputBorrar
                        width={WIDTH * 0.9}
                        autoCorrect={false}
                        placeholder="Ingresa tu Rut sin puntos y con guión"
                        textContentType="rut"
                        value={numeroRut}
                        style={[Estilos.tipografiaLight]}
                        marginTop={0}
                        onChangeText={(text) => this.setState({ numeroRut: text.toUpperCase().replace(/[^0-9K\-]/g, '') })}
                      />
                    </View>
                  )}
                </View>
              )}
              <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Fecha y hora</Text>
              <ComboBoxFechaHora
                fechaHoraInicial={new Date()}
                fechaLimpia={fechaLimpia}
                placeHolder={'Selecciona fecha y hora del evento'}
                onChange={(texto) => {
                  this.setState({
                    parteFecha: texto.split(' ')[0],
                    parteHora: texto.split(' ')[1],
                    fecha: texto,
                    fechaLimpia: false,
                  });
                }}
              />
            </View>
            {/* DETALLE REQUERIMIENTO */}
            <View style={[styles.container]}>
              <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Detalle requerimiento</Text>
              <TextInput
                placeholder="Indica todos los detalles que consideres necesarios, incluyendo numero de carro, vestimenta del personal, etc."
                placeholderTextColor={Globals.COLOR.GRIS_4}
                maxLength={1000}
                autoCorrect={false}
                multiline
                numberOfLines={5}
                style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight, styles.inputDetalleRequerimiento]}
                onChangeText={(text) => this.setState({ detalle: text, caracteres_actual: text.length })}
              >
                {detalle}
              </TextInput>
              <Text style={[Estilos.tipografiaLight, styles.textoNota]}>
                Caracteres disponibles:{' '}
                {`${currencyFormat(caracteres_disponibles - caracteres_actual)} de ${currencyFormat(
                  caracteres_disponibles,
                )}`}
              </Text>
            </View>
            {tipoRequerimiento == 'Objetos perdidos' && (
              <View style={[styles.container, { marginTop: WIDTH * 0.05 }]}>
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Tener en consideración</Text>
                <Text style={[Estilos.textoGeneral]}>
                  Los objetos y documentos encontrados en la Red se mantienen bajo resguardo en bodega de Metro por un
                  periodo de 30 días.
                </Text>
              </View>
            )}
            {tipoRequerimiento != 'Objetos perdidos' && (
              <View style={[styles.container, { marginTop: WIDTH * 0.05 }]}>
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Subir archivo</Text>
                <BotonArchivo
                  onTomarImagen={(archivo) => this.setState({ imagen: archivo })}
                  maxKb={Platform.OS === 'ios' ? 2000 : 5000}
                />
                <Text style={[Estilos.tipografiaLight, styles.textoNota]}>Archivo máx: 5Mb</Text>
              </View>
            )}
            {/* FORMULARIO */}
            <View style={[styles.container]}>
              <Text style={[Estilos.textoEtiqueta, styles.etiquetaInput2]}>Nombre</Text>
              <TextInputBorrar
                width={WIDTH * 0.9}
                autoCorrect={false}
                placeholder="Ingresa tu nombre"
                textContentType="name"
                value={nombre}
                style={[Estilos.tipografiaLight]}
                marginTop={0}
                onChangeText={(text) => this.setState({ nombre: text })}
              />
            </View>
            <View style={[styles.container]}>
              <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Apellido</Text>
              <TextInputBorrar
                width={WIDTH * 0.9}
                autoCorrect={false}
                placeholder="Ingresa tu apellido"
                textContentType="familyName"
                value={apellido}
                style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                marginTop={0}
                onChangeText={(text) => this.setState({ apellido: text })}
              />
            </View>
            <View style={[styles.container]}>
              <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Correo electrónico*</Text>
              <TextInputBorrar
                keyboardType="email-address"
                width={WIDTH * 0.9}
                autoCorrect={false}
                placeholder="Ingresa tu correo electrónico"
                textContentType="emailAddress"
                value={email}
                style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                marginTop={0}
                onChangeText={(text) => this.setState({ email: text })}
              />
            </View>
            <View style={[styles.container]}>
              <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Teléfono*</Text>
              <TextInputBorrar
                autoCompleteType="tel"
                keyboardType="phone-pad"
                width={WIDTH * 0.9}
                autoCorrect={false}
                placeholder="Ingresa tu número de teléfono"
                textContentType="telephoneNumber"
                value={telefono}
                style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                marginTop={0}
                onChangeText={(text) => this.setState({ telefono: text })}
              />
              <Text style={[Estilos.tipografiaLight, styles.textoNota]}>* llenar al menos uno</Text>
            </View>
            <View style={[styles.container]}>
              <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Tratamiento de datos personales</Text>
              <View style={styles.contenedorTratamientoDatos}>
                <Switch
                  value={terminosSelected}
                  trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
                  thumbColor={terminosSelected ? '#FFFFFF' : '#FFFFFF'}
                  onChange={() => this.setState({ terminosSelected: !terminosSelected })}
                />
                <Text style={[Estilos.tipografiaLight, { width: Dimensions.get('window').width - 100 }]}>
                  Autorizo expresamente a Metro S.A. para que la información entregada sea incorporada a su base de datos
                  para futuros contactos respecto del requerimiento ingresado, para gestión interna y fines estadísticos.
                </Text>
              </View>
            </View>
            <View style={[styles.container, { alignItems: 'center', marginTop: WIDTH * 0.05 }]}>
              <BotonSimple
                texto="Enviar"
                colorTexto="#FFFFFF"
                color={Globals.COLOR.TURQUESA_QR}
                width={WIDTH * 0.8}
                onPress={() => {
                  if (!enviando) this.onEnviar();
                }}
              />
            </View>
            <View style={{ height: keyboardVisible ? 400 : 50 }}></View>
          </ScrollView>
        )}
        {mostrarSelectorEstacion && (
          <View style={{ paddingHorizontal: WIDTH * 0.05 }}>
            <SelectorEstacion
              onSelect={this.estacionSeleccionada}
              todasEstaciones={true}
              onCerrar={() => this.setState({ mostrarSelectorEstacion: false })}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default Consultas;
