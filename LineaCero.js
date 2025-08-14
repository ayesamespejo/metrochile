import React, { useState, useEffect } from 'react'
import {
  Text,
  SafeAreaView,
  Dimensions,
  Pressable,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import CardFlip from 'react-native-flip-card'
import Estilos from './Estilos'
import Globals from './Globals'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import IconoHorariosRutaExpresa from './assets/svg/intermodalidad/IconoHorariosRutaExpresa.svg'
import IconoPreguntasRutaExpresa from './assets/svg/intermodalidad/IconoPreguntasRutaExpresa.svg'
import ReglamentoCirculo from './assets/svg/intermodalidad/ReglamentoCirculo.svg'
import UbicacionAgendaCultural from './assets/svg/cultura_comunidad/UbicacionAgendaCultural.svg'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
const SLIDER_HEIGHT = Dimensions.get('window').height
const SLIDER_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  contenedroGeneral: {
    marginHorizontal: SLIDER_WIDTH * 0.05,
  },
  tituloEstacion: {
    marginTop: SLIDER_WIDTH * 0.08,
    marginBottom: SLIDER_WIDTH * 0.05,
    alignSelf: 'center',
  },
  imagen: {
    width: SLIDER_WIDTH * 0.9,
    height: SLIDER_WIDTH * 0.42,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  logoLineaCero: {
    alignSelf: 'center',
    width: 81,
    height: 50,
  },
  tarjeta: {
    backgroundColor: Globals.COLOR.GRIS_1,
    width: SLIDER_WIDTH * 0.9,
    padding: SLIDER_WIDTH * 0.05,
  },
  tarjetaFila: {
    marginTop: SLIDER_WIDTH * 0.05,
    padding: SLIDER_WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textoLinea: [Estilos.textoGeneral, { marginTop: SLIDER_WIDTH * 0.03, textAlign: 'justify' }],
  tituloLinea: [Estilos.textoSubtitulo, { marginLeft: SLIDER_WIDTH * 0.03, alignSelf: 'center' }],
})

const LineaCero = (props) => {


  /**
   * Obtenemos el codigo de estacion necesario para la intermodalidad.
   */
  const codigoEstacion = props.route.params.codigo

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const estacion = props.route.params.estacion
  const linea = props.route.params.linea
  const [mostrarUbicacion, setMostrarUbicacion] = useState(false)
  const [mostrarHorario, setMostrarHorario] = useState(false)
  const [texto1, setTexto1] = useState('')
  const [texto2, setTexto2] = useState('')
  const [texto4, setTexto4] = useState('')
  const [texto14, setTexto14] = useState('')

  const urlIntermodalidad = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/intermodalidad?estacion=${codigoEstacion}&intermodal=Linea_Cero&tipo=`

  useEffect(() => {
      /**
   * Cambiar el nombre del Header.
   */
  props.navigation.setOptions({ title: 'Línea Cero' })
    getRegistro()
  }, [])

  const getRegistro = () => {
    setLoading(true)
    fetch(urlIntermodalidad)
      .then((res) => res.json())
      .then((res) => {
        setData(res)
        setLoading(false)
        setTexto1(res.estacion[0][1])
        setTexto2(res.estacion[0][2])
        setTexto4(res.estacion[0][4])
        setTexto14(res.estacion[0][14])
      })
  }

  const linea2 = linea.substring(1).toUpperCase()

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SLIDER_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.contenedroGeneral}>
          <View style={styles.tituloEstacion}>
            <TituloCirculoEstacion texto={estacion} linea={linea2} />
          </View>
          <Image
            source={{
              uri: 'https://d37nosr7rj2kog.cloudfront.net/LineaCero.jpg',
            }}
            style={styles.imagen}
          />
          <CardFlip
            flipHorizontal={true}
            flipVertical={false}
            style={[styles.cardContainer, { marginTop: SLIDER_WIDTH * 0.05 }]}
          >
            <View style={[styles.tarjeta, { borderRadius: 25, height: 220 }]}>
              <Image source={require('./assets/imagenes/intermodalidad/Linea_Cero_logo.png')} style={styles.logoLineaCero} />
              <Text
                style={[
                  Estilos.textoGeneral,
                  {
                    marginTop: SLIDER_WIDTH * 0.05,
                    textAlign: 'justify',
                  },
                ]}
              >
                {texto1}
              </Text>
              <Text style={[Estilos.textoPaginacion, { textAlign: 'right', marginTop: SLIDER_WIDTH * 0.03 }]}>
                ver más {'>>'}{' '}
              </Text>
            </View>
            <View style={[styles.tarjeta, { borderRadius: 25, height: 220 }]}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text
                  style={[
                    Estilos.textoGeneral,
                    {
                      // marginTop: SLIDER_WIDTH * 0.05,
                      textAlign: 'justify',
                    },
                  ]}
                >
                  {texto2}
                </Text>
              </View>
            </View>
          </CardFlip>
          <View style={[styles.tarjetaFila, { marginTop: SLIDER_WIDTH * 0.07 }]}>
            <Pressable onPress={() => setMostrarUbicacion(!mostrarUbicacion)}>
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <UbicacionAgendaCultural width={24} height={24} fill={Globals.COLOR.ROJO_LINEA_CERO} />
                  <Text style={styles.tituloLinea}>Ubicación</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: mostrarUbicacion ? '180deg' : '0deg' }] }}
                />
              </View>
            </Pressable>
            {mostrarUbicacion && (
              <View>
                <View
                  width={SLIDER_WIDTH * 0.8}
                  height={1}
                  style={{ marginTop: SLIDER_WIDTH * 0.03, backgroundColor: Globals.COLOR.GRIS_3 }}
                />
                <Text style={styles.textoLinea}>{texto14}</Text>
              </View>
            )}
          </View>
          <View style={styles.tarjetaFila}>
            <Pressable onPress={() => setMostrarHorario(!mostrarHorario)}>
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <IconoHorariosRutaExpresa width={24} height={24} fill={Globals.COLOR.ROJO_LINEA_CERO} />
                  <Text style={styles.tituloLinea}>Horario</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: mostrarHorario ? '180deg' : '0deg' }] }}
                />
              </View>
            </Pressable>
            {mostrarHorario && (
              <View>
                <View
                  width={SLIDER_WIDTH * 0.8}
                  height={1}
                  style={{ marginTop: SLIDER_WIDTH * 0.03, backgroundColor: Globals.COLOR.GRIS_3 }}
                />
                <Text style={[Estilos.textoGeneral, { marginTop: SLIDER_WIDTH * 0.03, textAlign: 'justify' }]}>
                  {texto4}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.tarjetaFila}>
            <Pressable
              onPress={() =>
                props.navigation.navigate('LineaCero_ComoFunciona', {
                  codigo: props.route.params.codigo,
                })
              }
            >
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <IconoPreguntasRutaExpresa width={24} height={24} fill={Globals.COLOR.ROJO_LINEA_CERO} />
                  <Text style={styles.tituloLinea}>¿Cómo funciona?</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
              </View>
            </Pressable>
          </View>
          <View style={styles.tarjetaFila}>
            <Pressable
              onPress={() =>
                props.navigation.push('LineaCeroReglamento', {
                  data: data,
                })
              }
            >
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <ReglamentoCirculo width={24} height={24} fill={Globals.COLOR.ROJO_LINEA_CERO} />
                  <Text style={styles.tituloLinea}>Reglamento</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
              </View>
            </Pressable>
          </View>
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LineaCero
