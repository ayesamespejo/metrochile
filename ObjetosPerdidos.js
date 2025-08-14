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
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import BotonNuevo from './components/BotonNuevo'
import Estilos from './Estilos'
import ComboBoxNuevo from './components/ComboBoxNuevo'
import ComboBoxLinea from './components/ComboBoxLinea'
import { TextInput } from 'react-native-gesture-handler'
import { Switch } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Globals from './Globals'
import TextInputBorrar from './components/TextInputBorrar'
import ComboBoxFechaHora from './components/ComboBoxFechaHora'
import BotonArchivo from './components/BotonArchivo'
import BotonSimple from './components/BotonSimple'
import SwitchOpcion from './components/SwitchOpcion'
import Rut from './utils/ValidaRut'
const numero_bip_img = require('./assets/numero_bip.png')
const voucher_0 = require('./assets/voucher/voucher_0.png')
const voucher_1 = require('./assets/voucher/voucher_1.png')
const voucher_2 = require('./assets/voucher/voucher_2.png')
const voucher_3 = require('./assets/voucher/voucher_3.png')
const voucher_4 = require('./assets/voucher/voucher_4.png')
import Carousel, { Pagination } from 'react-native-snap-carousel'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

function currencyFormat(num) {
  return parseFloat(num)
    .toFixed(0)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '1.')
}

const tiposRequerimiento = ['Reclamos', 'Sugerencias', 'Consultas', 'Felicitaciones', 'Objetos perdidos']
const tiposRequerimientoCodigo = [
  { codigo: 8, texto: 'Reclamos' },
  { codigo: 9, texto: 'Sugerencias' },
  { codigo: 10, texto: 'Consultas' },
  { codigo: 11, texto: 'Felicitaciones' },
  { codigo: 11, texto: 'Objetos perdidos' },
]

const tiposReclamo = [
  'Máquina de carga bip! - Transacción en Boleterías - Tarifas y Medios de Pago',
  'MetroQR',
  'Atención al Cliente - Personal de Estaciones',
  'Tráfico de Trenes - Conducción - Frecuencia - Tiempos de espera - Congestión',
  'Falta de información al Usuario - Señalética',
  'Seguridad - Delitos - Accidentes',
  'Carencias o Defectos de Aseo',
  'Obras en Construcción - Ruidos - Entorno',
]
const tiposReclamoCodigo = [
  { codigo: 4, texto: 'Máquina de carga bip! - Transacción en Boleterías - Tarifas y Medios de Pago' },
  { codigo: 8, texto: 'MetroQR' },
  { codigo: 1, texto: 'Atención al Cliente - Personal de Estaciones' },
  { codigo: 6, texto: 'Tráfico de Trenes - Conducción - Frecuencia - Tiempos de espera - Congestión' },
  { codigo: 3, texto: 'Falta de información al Usuario - Señalética' },
  { codigo: 5, texto: 'Seguridad - Delitos - Accidentes' },
  { codigo: 2, texto: 'Carencias o Defectos de Aseo' },
  { codigo: 7, texto: 'Obras en Construcción - Ruidos - Entorno' },
]

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
]

const tiposObjetos = [
  'Bolso - mochila - cartera',
  'Lentes de sol u ópticos',
  'Teléfono celular',
  'Otro (describir en detalle del requerimiento)',
]

const getParam = async (label) => {
  try {
    const value = await AsyncStorage.getItem(label)
    return value != null ? value : null
  } catch (e) {
    //console.log(e);
  }
}

const Consultas = (props) => {
  // const titulos = ['Selecciona Línea', 'Selecciona Estacion']
  const [state, setState] = useState({
    data: [],
    tipo: null,
    lineas: [],
    estaciones: [],
    listaEstacionesCodigo: [],
    aceptar: false,
    verNumeroBip: false,
    verNumeroVendedor: false,
    mostrarSelectEstacion: true,
    linea: '',
    nombreEstacion: '',
    caracteres_actual: 0,
    caracteres_disponibles: 1000,
    idRegistro: '',
    images: [voucher_0, voucher_1, voucher_2, voucher_3, voucher_4],
    key0: new Date().getTime() + 1,
    key1: new Date().getTime() + 2,
    key2: new Date().getTime() + 3,
    listaEstaciones: [],
  })

  const [tipoRequerimiento, setTipoRequerimiento] = useState('')
  const [tipoReclamo, setTipoReclamo] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [numeroBip, setNumeroBip] = useState('')
  const [maquina, setMaquina] = useState('')
  const [monto, setMonto] = useState('')
  const [detalle, setDetalle] = useState('')
  const [estacion, setEstacion] = useState('')
  const [fecha, setFecha] = useState('')
  const [parteFecha, setParteFecha] = useState('')
  const [parteHora, setParteHora] = useState('')
  const [linea, setLinea] = useState('')
  const [codEstacion, setCodEstacion] = useState('')
  const [terminosSelected, setTerminosSelected] = useState('')
  const [mostrarMaquina, setMostrarMaquina] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [fechaLimpia, setFechaLimpia] = useState(true)
  const [tipoObjeto, setTipoObjeto] = useState('Objeto')
  const [tipoDocumento, setTipoDocumento] = useState('')
  const [numeroRut, setNumeroRut] = useState('')
  const [lugarExtravio, setLugarExtravio] = useState('Tren')
  const [lineaExtravio, setLineaExtravio] = useState('')

  const [opcionesObjetosPerdidos, setOpcionesObjetosPerdidos] = useState(tiposDocumento)

  const [imagen, setImagen] = useState({})

  const refCarousel = useRef()
  const [indiceCarousel, setIndiceCarousel] = useState(0)

  const [metroQR, setMetroQR] = useState(false)

  const styles = StyleSheet.create({
    contenedorGeneral: {
      paddingTop: WIDTH * 0.05,
      height: mostrarMaquina ? HEIGHT * 2.35 : HEIGHT * 1.85,
    },
    container: {
      paddingHorizontal: WIDTH * 0.05,
    },
    etiquetaInput: {
      marginBottom: WIDTH * 0.03,
      marginTop: WIDTH * 0.05,
      textAlign: 'left',
      marginLeft: WIDTH * 0,
    },
    etiquetaInput2: {
      marginBottom: WIDTH * 0.03,
      marginTop: WIDTH * 0.05,
      textAlign: 'left',
      marginLeft: WIDTH * 0,
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
  })

  useEffect(() => {
    props.navigation.setOptions({ title: 'Sugerencias y reclamos' })
    const _unsubscribe = props.navigation.addListener('focus', () => {
      getParam('consultas').then((e) => {
        let jsonData = JSON.parse(e)
        if (e) {
          setEstacion(jsonData['title'])
          setLinea(jsonData['linea'])
          setCodEstacion(jsonData['codigo'])
          AsyncStorage.removeItem('consultas')
        }
      })
    })
    return () => {
      _unsubscribe()
    }
  }, [])

  const resetearCampos = () => {
    setState({
      ...state,
      tipo: '',
      tipoRequerimiento: '',
      key0: Math.round(Math.random() * 1000),
      key1: Math.round(Math.random() * 1000),
      key2: Math.round(Math.random() * 1000),
      caracteres_actual: 0,
    })
    setTipoRequerimiento('')
    setTipoReclamo('')
    setNombre('')
    setApellido('')
    setEmail('')
    setTelefono('')
    setEstacion('')
    setNumeroBip('')
    setMaquina('')
    setMonto('')
    setEstacion('')
    setDetalle('')
    setFecha('')
    setTerminosSelected(false)
    setMostrarMaquina(false)
    setMetroQR(false)
    setCodEstacion('')
    setFechaLimpia(true)
    setImagen({})
  }

  const onChangeNumeroBipQr = (texto) => {
    const textoLimpio = texto.toUpperCase().replace(/[^0-9K]/g, '')
    setNumeroBip(textoLimpio)
  }

  const enviarFormulario = () => {
    const tipoRequeriumientoCodigo = tiposRequerimientoCodigo.find((item) => item.texto == tipoRequerimiento).codigo
    let tipoReclamoCodigo = null
    if (tipoRequeriumientoCodigo == 8) {
      tipoReclamoCodigo = tiposReclamoCodigo.find((item) => item.texto == tipoReclamo).codigo
    }
    setEnviando(true)
    let uri = 'https://metroqa.agenciacatedral.com/api/formulario_consultas.php'
    // let uri = `${Globals.MAIN_URL}/api/formulario_consultas.php`
    const body = new FormData()
    body.append('nombre', nombre)
    body.append('apellido', apellido)
    if (email) {
      body.append('email', email)
    } else {
      body.append('email', 'noemail@metro.cl')
    }
    body.append('telefono', telefono)
    body.append('numeroBip', numeroBip)
    body.append('maquina', maquina)
    body.append('monto', monto)
    body.append('detalle', detalle)
    body.append('tipoRequerimiento', tipoRequeriumientoCodigo)
    if (tipoReclamoCodigo) {
      body.append('tipoReclamo', tipoReclamoCodigo)
    } else {
      body.append('tipoReclamo', '')
    }
    body.append('linea', linea)
    body.append('estacion', estacion)
    body.append('codEstacion', codEstacion)
    body.append('fecha', parteFecha)
    body.append('hora', parteHora)
    if (imagen.uri) {
      const adjunto = {
        name: imagen.fileName ? imagen.fileName : imagen.name,
        type: imagen.type,
        uri: Platform.OS === 'ios' ? imagen.uri.replace('file://', '') : imagen.uri,
      }
      body.append('adjunto', adjunto)
    }
    console.log(JSON.stringify(body))
    fetch(uri, {
      method: 'post',
      body: body,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
    })
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        //recuerdo que esto se validó asi por que devolvia un par de texto sin formato, hoy devuelve un json.
        respuesta = JSON.parse(text)
        if (respuesta.estado == 0) {
          console.log(respuesta)
          Alert.alert('Error', respuesta.mensaje, [{ text: 'Aceptar' }], { cancelable: false })
          return
        }
        //Esto se validó asi por que en algún momento el servicio devolvía un JSON inválido por el uso de comillas simples.
        let registro = JSON.parse(text.split("'").join('"'))
        // console.log(registro)
        setState({ ...state, idRegistro: registro.idRegistro })
        resetearCampos()
        showAlert()
      })
      .catch((error) => {
        console.error(error)
        Alert.alert(
          'Error',
          `Ha habido un error al enviar su información, favor intente nuevamente`,
          [{ text: 'Aceptar' }],
          { cancelable: false },
        )
      })
      .finally(() => {
        setEnviando(false)
      })
  }

  const showAlert = () =>
    Alert.alert('Muchas Gracias', `El requerimiento ha sido enviado`, [{ text: 'Aceptar' }], { cancelable: false })

  const onEnviar = () => {
    if (nombre == '' || tipoRequerimiento == '' || apellido == '' || detalle == '' || codEstacion == '') {
      Alert.alert('Error', 'Debes ingresar todos los datos requeridos', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (tipoRequerimiento == '') {
      Alert.alert('Error', 'Selecciona el tipo de requerimiento', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (tipoRequerimiento == 'Reclamos' && !tipoReclamo) {
      Alert.alert('Error', 'Selecciona el tipo de reclamo', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (nombre == '' || apellido == '' || detalle == '') {
      Alert.alert('Error', 'Debes ingresar todos los datos requeridos', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (telefono == '' && email == '') {
      Alert.alert(
        'Error',
        'Debes ingresar un correo electrónico o un teléfono de contacto.',
        [{ text: 'Aceptar', onPress: () => {} }],
        { cancelable: false },
      )
      return
    }
    if (email != '' && (email.indexOf('@') == -1 || email.indexOf('.') == -1)) {
      Alert.alert('Error', 'Ingresa un correo válido', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (mostrarMaquina && !numeroBip) {
      Alert.alert('Error', 'El número de tarjeta bip! es obligatorio', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (metroQR && !numeroBip) {
      Alert.alert('Error', 'El Rut bip!QR es obligatorio', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (mostrarMaquina && !maquina) {
      Alert.alert(
        'Error',
        'la Máquina Autoservicio o Vendedor es obligatorio',
        [{ text: 'Aceptar', onPress: () => {} }],
        {
          cancelable: false,
        },
      )
      return
    }
    if ((mostrarMaquina || metroQR) && !monto) {
      Alert.alert('Error', 'El monto solicitado es obligatorio', [{ text: 'Aceptar', onPress: () => {} }], {
        cancelable: false,
      })
      return
    }
    if (!terminosSelected) {
      Alert.alert(
        'Error',
        'Debes aceptar el tratamiento de datos personales',
        [{ text: 'Aceptar', onPress: () => {} }],
        { cancelable: false },
      )
      return
    }
    enviarFormulario()
  }
  if (enviando) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color={Globals.COLOR.GRIS_4} />
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          {/* TIPO DE REQUERIMIENTO */}
          <View style={[styles.container]}>
            <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Tipo de requerimiento</Text>
            <ComboBoxNuevo
              key={state.key0}
              title=""
              data={tiposRequerimiento}
              valorSeleccionado={tipoRequerimiento}
              placeholder="Selecciona tipo de requerimiento"
              onselect={(title) => {
                // console.log(title)
                setTipoRequerimiento(title)
                setMostrarMaquina(false)
                setMetroQR(false)
                setState({
                  ...state,
                  tipo: title == 'Reclamos' ? 'reclamos' : 'sugerencias',
                })
              }}
            />
            {/* TIPO DE RECLAMO */}
            {state.tipo == 'reclamos' && (
              <View>
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Tipo de reclamo</Text>
                <ComboBoxNuevo
                  key={state.key1}
                  title="Selecciona tipo de reclamo"
                  data={tiposReclamo}
                  valorSeleccionado={tipoReclamo}
                  onselect={(title) => {
                    if (title == 'Máquina de carga bip! - Transacción en Boleterías - Tarifas y Medios de Pago') {
                      setTipoReclamo(title)
                      setMostrarMaquina(true)
                      setMetroQR(false)
                      setState({
                        ...state,
                        mostrarSelectEstacion: true,
                      })
                    } else if (title == 'MetroQR') {
                      setTipoReclamo(title)
                      setMostrarMaquina(false)
                      setMetroQR(true)
                      // setState({
                      //   ...state,
                      //   mostrarSelectEstacion: true,
                      // })
                    } else {
                      setTipoReclamo(title)
                      setMostrarMaquina(false)
                      setState({
                        ...state,
                        mostrarSelectEstacion: true,
                      })
                    }
                  }}
                />
              </View>
            )}
            {/* Objetos perdidos */}
            {tipoRequerimiento == 'Objetos perdidos' && (
              <>
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Selecciona lugar de extravío</Text>
                <View style={{ alignItems: 'center' }}>
                  <SwitchOpcion
                    opciones={['Tren', 'Estación']}
                    onSelect={(opcion) => {
                      setLugarExtravio(opcion)
                      setEstacion('')
                    }}
                    ancho={160}
                  />
                </View>
                {lugarExtravio == 'Tren' && (
                  <>
                    <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Línea</Text>
                    <ComboBoxLinea
                      valorSeleccionado={lineaExtravio}
                      placeholder="Selecciona línea"
                      onselect={(title) => {
                        // console.log(title)
                        setTipoRequerimiento(title)
                        setLineaExtravio(title)
                        setState({
                          ...state,
                          tipo: title == 'Reclamos' ? 'reclamos' : 'sugerencias',
                        })
                      }}
                    />
                  </>
                )}
              </>
            )}
            {/* METRO QR */}
            {metroQR && (
              <View>
                <View>
                  <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Rut bip!QR</Text>
                  <TextInputBorrar
                    // keyboardType="number-pad"
                    width={WIDTH * 0.9}
                    // placeholderTextColor="#666"
                    autoCorrect={false}
                    placeholder="Ingresa tu Rut bip!QR"
                    value={numeroBip}
                    style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                    marginTop={0}
                    onChangeText={(text) => {
                      onChangeNumeroBipQr(text)
                    }}
                  />
                </View>
                <View>
                  <Text style={[Estilos.bajada, Estilos.tipografiaMedium, styles.etiquetaInput2]}>
                    Monto solicitado
                  </Text>
                  <TextInputBorrar
                    keyboardType="number-pad"
                    width={WIDTH * 0.9}
                    // placeholderTextColor="#666"
                    autoCorrect={false}
                    placeholder="Ingresa monto solicitado"
                    value={monto}
                    style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                    marginTop={0}
                    onChangeText={(text) => {
                      setMonto(text)
                    }}
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
                    // placeholderTextColor="#666"
                    autoCorrect={false}
                    placeholder="Ingresa el número de tu tarjeta bip!"
                    value={numeroBip}
                    style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                    marginTop={0}
                    onChangeText={(text) => {
                      setNumeroBip(text)
                    }}
                  />
                  <Pressable
                    style={{
                      alignItems: state.verNumeroBip ? 'center' : 'flex-start',
                      marginBottom: 0,
                    }}
                    onPress={() => {
                      setState({ ...state, verNumeroBip: !state.verNumeroBip })
                    }}
                  >
                    <Text style={[Estilos.tipografiaMedium, styles.textoTarjetaBip]}>
                      {state.verNumeroBip ? 'cerrar ✖️' : '¿Donde está el número de mi tarjeta bip?'}
                    </Text>
                    {state.verNumeroBip && (
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
                  <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>
                    N° máquina de carga bip! o vendedor
                  </Text>
                  <TextInputBorrar
                    // keyboardType="number-pad"
                    width={WIDTH * 0.9}
                    // placeholderTextColor="#666"
                    autoCorrect={false}
                    placeholder="Ingresa n° máq. de carga bip! o vendedor"
                    value={maquina}
                    style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                    marginTop={0}
                    onChangeText={(text) => {
                      setMaquina(text)
                    }}
                  />
                  <Pressable
                    style={{
                      alignItems: state.verNumeroBip ? 'center' : 'flex-start',
                      marginBottom: 0,
                    }}
                    onPress={() => {
                      setState({
                        ...state,
                        verNumeroVendedor: !state.verNumeroVendedor,
                      })
                      // console.log(state.numberoVendedor)
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
                      {state.verNumeroVendedor ? 'cerrar ✖️' : '¿Dónde encuentro este número?'}
                    </Text>
                  </Pressable>
                  {state.verNumeroVendedor && (
                    <View style={{ marginTop: WIDTH * 0.05 }}>
                      <Carousel
                        ref={refCarousel}
                        data={state.images}
                        renderItem={(item) => (
                          <View style={{ width: WIDTH * 0.9, alignItems: 'center' }}>
                            <Image
                              source={state.images[item.index]}
                              style={{ width: WIDTH, height: WIDTH * 1.5, resizeMode: 'contain' }}
                            />
                          </View>
                        )}
                        sliderWidth={WIDTH}
                        itemWidth={WIDTH}
                        onSnapToItem={(index) => setIndiceCarousel(index)}
                      />
                      <Pagination
                        dotsLength={state.images.length}
                        activeDotIndex={indiceCarousel}
                        carouselRef={refCarousel}
                        dotStyle={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          //marginHorizontal: 0,
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
                    // placeholderTextColor="#666"
                    autoCorrect={false}
                    placeholder="Ingresa monto solicitado"
                    value={monto}
                    style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight]}
                    marginTop={0}
                    onChangeText={(text) => {
                      setMonto(text)
                    }}
                  />
                </View>
              </View>
            )}
            {/* TIPO DE SELECCIONA ESTACIÓN */}
            {((state.mostrarSelectEstacion && tipoRequerimiento != 'Objetos perdidos') ||
              (tipoRequerimiento == 'Objetos perdidos' && lugarExtravio == 'Estación')) && (
              <View>
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Estación</Text>
                <BotonNuevo
                  key={state.key2}
                  color="#FFFFFF"
                  fontColor="#000000"
                  iconColor="#000000"
                  type="combo"
                  title={estacion}
                  placeholder="Selecciona tu estación"
                  onpress={() => {
                    props.navigation.push('Selecciona tu Estación', {
                      title: 'Sugerencias y Reclamos',
                      type: 'consultas',
                    })
                  }}
                />
              </View>
            )}
            {tipoRequerimiento == 'Objetos perdidos' && (
              <>
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>¿Qué extraviaste?</Text>
                <View style={{ alignItems: 'center' }}>
                  <SwitchOpcion
                    opciones={['Objeto', 'Documento']}
                    onSelect={(opcion) => {
                      setTipoObjeto(opcion)
                      if ((opcion = 'Objeto')) {
                        setOpcionesObjetosPerdidos(tiposObjetos)
                      } else {
                        setOpcionesObjetosPerdidos(tiposDocumento)
                      }
                    }}
                    ancho={199}
                  />
                </View>
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Selecciona una opción</Text>
                {tipoObjeto == 'Objeto' && (
                  <ComboBoxNuevo
                    key={state.key0}
                    title=""
                    data={tiposObjetos}
                    valorSeleccionado={tipoDocumento}
                    placeholder="Selecciona tipo de objeto"
                    onselect={(title) => {
                      setTipoDocumento(title)
                    }}
                  />
                )}
                {tipoObjeto == 'Documento' && (
                  <ComboBoxNuevo
                    key={state.key0}
                    title=""
                    data={tiposDocumento}
                    valorSeleccionado={tipoDocumento}
                    placeholder="Selecciona tipo de documento"
                    onselect={(title) => {
                      setTipoDocumento(title)
                    }}
                  />
                )}
                <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Número de Rut</Text>
                <TextInputBorrar
                  width={WIDTH * 0.9}
                  autoCorrect={false}
                  placeholder="Ingresa tu Rut"
                  textContentType="rut"
                  value={numeroRut}
                  style={[Estilos.tipografiaLight]}
                  marginTop={0}
                  onChangeText={(text) => {
                    setNumeroRut(text.toUpperCase().replace(/[^0-9K\-]/g, ''))
                  }}
                />
              </>
            )}
            <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput]}>Fecha y hora</Text>
            <ComboBoxFechaHora
              fechaHoraInicial={new Date()}
              fechaLimpia={fechaLimpia}
              placeHolder={'Selecciona fecha y hora del evento'}
              onChange={(texto) => {
                // console.log('Fecha: ', texto)
                setParteFecha(texto.split(' ')[0])
                setParteHora(texto.split(' ')[1])
                setFecha(texto)
                setFechaLimpia(false)
              }}
            />
            {/* <Pressable onPress={() => {setFechaLimpia(true)}}><Text>Limpiar</Text></Pressable> */}
          </View>
          {/* DETALLE REQUERIMIENTO */}
          <View style={[styles.container]}>
            <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Detalle requerimiento</Text>
            <TextInput
              // keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
              placeholder="Indica todos los detalles que consideres necesarios, incluyendo numero de carro, vestimenta del personal, etc."
              placeholderTextColor={Globals.COLOR.GRIS_4}
              maxLength={1000}
              autoCorrect={false}
              multiline
              numberOfLines={5}
              style={[Estilos.textInputReclamosSug, Estilos.tipografiaLight, styles.inputDetalleRequerimiento]}
              onChangeText={(text) => {
                setDetalle(text)
                setState({ ...state, caracteres_actual: text.length })
              }}
            >
              {detalle}
            </TextInput>
            <Text style={[Estilos.tipografiaLight, styles.textoNota]}>
              Caracteres disponibles:{' '}
              {`${currencyFormat(state.caracteres_disponibles - state.caracteres_actual)} de ${currencyFormat(
                state.caracteres_disponibles,
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
          <View style={[styles.container, { marginTop: WIDTH * 0.05 }]}>
            <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Subir archivo</Text>
            <BotonArchivo
              onTomarImagen={(archivo) => {
                // console.log(JSON.stringify(archivo))
                setImagen(archivo)
              }}
              maxKb={Platform.OS === 'ios' ? 2000 : 5000}
            />
            <Text style={[Estilos.tipografiaLight, styles.textoNota]}>Archivo máx: 5Mb</Text>
          </View>
          {/* FORMULARIO */}
          <View style={[styles.container]}>
            <Text style={[Estilos.textoSubtitulo, styles.etiquetaInput2]}>Nombre</Text>
            <TextInputBorrar
              width={WIDTH * 0.9}
              autoCorrect={false}
              placeholder="Ingresa tu nombre"
              textContentType="name"
              value={nombre}
              style={[Estilos.tipografiaLight]}
              marginTop={0}
              onChangeText={(text) => {
                setNombre(text)
              }}
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
              onChangeText={(text) => {
                setApellido(text)
              }}
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
              onChangeText={(text) => {
                setEmail(text)
              }}
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
              onChangeText={(text) => {
                setTelefono(text)
                setState({ ...state, telefono: text })
              }}
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
                onChange={() => {
                  setTerminosSelected(!terminosSelected)
                }}
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
                if (!enviando) onEnviar()
              }}
            />
          </View>
          {/* objetos encontrados */}
          <View style={{ height: 50 }}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Consultas
