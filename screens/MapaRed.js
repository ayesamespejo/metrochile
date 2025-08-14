import { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, Modal, Pressable } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

import TituloCirculoEstacion from '../js/components/TituloCirculoEstacion';
import CerrarCirculo from '../assets/svg/comun/CerrarCirculo.svg';

import Estilos from '../Estilos';
import { estaciones } from './mapa';
import Globals from '../Globals';

// const buscaEstacion = (x, y) => {
//   let distancia = 0
//   estaciones.map((estacion) => {
//     distancia = Math.round(Math.sqrt(Math.pow(estacion.x - x, 2) + Math.pow(estacion.y - y, 2)))
//     if (distancia <= 30) {
//       conseole.log(estacion.codEstacion)
//     }
//   })
// }

export default function MapaRedImagen(props) {
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const ANCHO_IMAGEN = 5315
  const ALTO_IMAGEN = 6791

  // const escalaInicial =  ANCHO_IMAGEN * 0.000188 - 0.0055
  // const bordeSuperior =  ANCHO_IMAGEN * 1.19 + 2660
  // const translateInicial = -2460

  const escalaInicial = (width / ANCHO_IMAGEN) * 0.95
  const bordeSuperior = ALTO_IMAGEN / 2 - width / 1.5
  const translateInicial = -(ANCHO_IMAGEN / 2 - width / 2)

  const translateX = useSharedValue(translateInicial)
  const escalaImg = useSharedValue(escalaInicial)
  const escalaImgOrigen = useSharedValue(escalaInicial)
  const translateY = useSharedValue(-bordeSuperior)
  const origenX = useSharedValue(0)
  const origenY = useSharedValue(0)
  const codEstacion = useSharedValue('')
  const estacionesSeleccionadas = useSharedValue([])
  const primero = useSharedValue(1)
  const [listaSeleccionEstacion, setListaSeleccionEstacion] = useState([])

  const [cargando, setCargando] = useState(true)
  // const [uriMapa, setUriMapa] = useState("https://d37nosr7rj2kog.cloudfront.net/PlanodeRed.jpg");
  const uriMapa = 'https://d37nosr7rj2kog.cloudfront.net/PlanodeRed.jpg'

  const [modalVisible, setModalVisible] = useState(false)

  const dragGesture = Gesture.Pan()
    .onStart((event, context) => {
      origenX.value = translateX.value
      origenY.value = translateY.value
      // popupAlpha.value = withTiming(0);
    })
    .onUpdate((event, context) => {
      translateX.value = event.translationX + origenX.value
      translateY.value = event.translationY + origenY.value
    })
    .onEnd(() => {
      // console.log('TranslateX: ', translateX.value)
      // console.log('TranslateY: ', translateY.value)
    })

  const pinchazoPantalla = Gesture.Pinch()
    .onStart((event) => {
      // console.log('Ancho: ', ANCHO_IMAGEN)
    })
    .onUpdate((event) => {
      escalaImg.value = event.scale * escalaImgOrigen.value
    })
    .onEnd(() => {
      // console.log('Escala: ', escalaImg.value)
      escalaImgOrigen.value = escalaImg.value
    })

  const ToquePantalla = Gesture.Tap()
    .onStart((event) => {
      let distancia = 0
      let estacionesSeleccionadasPaso = []
      estaciones.map((estacion) => {
        distancia = Math.round(Math.sqrt(Math.pow(estacion.posX - event.x, 2) + Math.pow(estacion.posY - event.y, 2)))
        if (distancia <= 30) {
          // console.log(estacion.codEstacion)
          codEstacion.value = estacion.codEstacion
          estacionesSeleccionadasPaso.push({
            codEstacion: estacion.codEstacion,
            codLinea: estacion.codLinea,
            nombre: estacion.nombre,
          })
        } else if (distancia <= 500) {
          if (estacion.Rec1X1) {
            // console.log('Validando', estacion.codEstacion )
            // console.log (estacion.Rec1X1, '<=', event.x, '<= ', estacion.Rec1X2)
            // console.log (estacion.Rec1Y1, '<=', event.y ,'<= ', estacion.Rec1Y2)
            if (
              estacion.Rec1X1 <= event.x &&
              estacion.Rec1X2 >= event.x &&
              estacion.Rec1Y1 <= event.y &&
              estacion.Rec1Y2 >= event.y
            ) {
              // console.log('encontrado', estacion.codEstacion )
              estacionesSeleccionadasPaso.push({
                codEstacion: estacion.codEstacion,
                codLinea: estacion.codLinea,
                nombre: estacion.nombre,
              })
            } else if (estacion.Rec2X1) {
              if (
                estacion.Rec2X1 <= event.x &&
                estacion.Rec2X2 >= event.x &&
                estacion.Rec2Y1 <= event.y &&
                estacion.Rec2Y2 >= event.y
              ) {
                estacionesSeleccionadasPaso.push({
                  codEstacion: estacion.codEstacion,
                  codLinea: estacion.codLinea,
                  nombre: estacion.nombre,
                })
              }
            }
          }
        }
      })
      estacionesSeleccionadas.value = estacionesSeleccionadasPaso
    })
    .onEnd((event) => {
      // console.log(
      //   `{
      //   "codEstacion": "",
      //   "codLinea": "L6",
      //   "comun": false,
      //   "posX": ${event.x},
      //   "posY": ${event.y}
      // },`
      // )
      if (primero.value == 1) {
        primero.value = 2
        console.log(
          `---------------------
          "Rec1X1": ${event.x},
          "Rec1Y1": ${event.y},`,
        )
      } else if (primero.value == 2) {
        primero.value = 3
        console.log(
          `    "Rec1X2": ${event.x},
          "Rec1Y2": ${event.y},`,
        )
      } else if (primero.value == 3) {
        primero.value = 4
        console.log(
          `    "Rec2X1": ${event.x},
          "Rec2Y1": ${event.y},`,
        )
      } else if (primero.value == 4) {
        primero.value = 1
        console.log(
          `    "Rec2X2": ${event.x},
          "Rec2Y2": ${event.y},`,
        )
      }
    })

  useEffect(() => {
    const _navegar = setInterval(() => {
      const estacionesSeleccionadasPaso = [...estacionesSeleccionadas.value]
      estacionesSeleccionadas.value = []
      if (estacionesSeleccionadasPaso.length > 0) {
        if (estacionesSeleccionadasPaso.length > 1) {
          //console.log('Seleccionando estación comúm...')
          //console.log(JSON.stringify(estacionesSeleccionadasPaso))
          setListaSeleccionEstacion(estacionesSeleccionadasPaso)
          setModalVisible(true)
        } else {
          const codEstacionPaso = estacionesSeleccionadasPaso[0].codEstacion
          const codLineaPaso = estacionesSeleccionadasPaso[0].codLinea
          props.navigation.push('Estacion', {
            data: { codigo: codEstacionPaso, linea: codLineaPaso },
          })
        }
      }
    }, 500)
    return () => {
      clearInterval(_navegar)
    }
  }, [])

  const composed = Gesture.Race(pinchazoPantalla, dragGesture, ToquePantalla)

  // const centroImagen = {
  //   x: (width * 10) / 2,
  //   y: (height * 10) / 2,
  // }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapa: {
      width: width,
      height: height,
      backgroundColor: '#F1F1F1',
      overflow: 'hidden',
    },
    img: {
      // resizeMode: 'cover',
      width: ANCHO_IMAGEN,
      height: ALTO_IMAGEN,
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: escalaImg.value }],
    },

    centeredView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: width * 0.05,
    },
    button: {
      borderRadius: 20,
      padding: 10,
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      // textAlign: 'center',
    },
  })

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: escalaImg.value }],
  }))

  return (
    <View style={[styles.mapa]}>
      {/* {cargando && (
        <View style={{ marginTop: height / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      )} */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        backgroundColor={'red'}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[Estilos.textoTitulo, { textAlign: 'center', width: width * 0.7 }]}>
                {listaSeleccionEstacion[0]?.nombre}
              </Text>
              <Pressable
                style={{}}
                onPress={() => {
                  setModalVisible(false)
                }}
              >
                <CerrarCirculo width={20} height={20} fill={Globals.COLOR.GRIS_3} />
              </Pressable>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'center', width: width * 0.7 }}
              >
                {listaSeleccionEstacion.map((estacion) => (
                  <Pressable
                    style={{ marginTop: width * 0.05, marginHorizontal: width * 0.05}}
                    onPress={() => {
                      setModalVisible(false)
                      const codEstacionPaso = estacion.codEstacion
                      const codLineaPaso = estacion.codLinea
                      props.navigation.push('Estacion', {
                        data: { codigo: codEstacionPaso, linea: codLineaPaso },
                      })
                    }}
                  >
                    <TituloCirculoEstacion linea={estacion.codLinea.replace('L', '')} />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <GestureHandlerRootView>
        <GestureDetector gesture={composed}>
          <Animated.Image
            style={[styles.img, estiloAnimado]}
            loadingIndicatorSource={<ActivityIndicator size="large" color={Globals.COLOR.GRIS_4} />}
            source={{ uri: uriMapa }}
            onLoadEnd={() => setCargando(false)}
          />
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  )
}
