import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native'
import Estilos from './Estilos'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import Globals from './Globals'

/**
 * Importacion de Imagenes.
 */
import UInvertidaCirclefrom from './assets/svg/intermodalidad/UInvertida-circle.svg'
import IconoHorariosRutaExpresa from './assets/svg/intermodalidad/IconoHorariosRutaExpresa.svg'
import UbicacionAgendaCultural from './assets/svg/cultura_comunidad/UbicacionAgendaCultural.svg'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
const imageUrl = { uri: 'https://d37nosr7rj2kog.cloudfront.net/U-Invertid.jpg' }

/**
 * Dimensiones de la pantalla
 */
const SLIDER_HEIGHT = Dimensions.get('window').height
const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9)
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 0.9)

const styles = StyleSheet.create({
  contenedroGeneral: {
    marginHorizontal: SLIDER_WIDTH * 0.05,
  },
  tituloEstacion: {
    marginTop: SLIDER_WIDTH * 0.08,
    marginBottom: SLIDER_WIDTH * 0.05,
    alignSelf: 'center',
  },
  logoLineaCero: {
    alignSelf: 'center',
    width: 81,
    height: 50,
  },
  tarjeta: {
    marginTop: SLIDER_WIDTH * 0.05,
    padding: SLIDER_WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
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
  imagen: {
    marginTop: SLIDER_WIDTH * 0.05,
    borderRadius: 20,
    width: SLIDER_WIDTH * 0.9,
    height: ITEM_HEIGHT * 0.535,
    resizeMode: 'stretch',
  },
  textoHorario: [Estilos.textoGeneral, { textAlign: 'justify' }],
})

const Uinvertida = (props) => {
  /**
   * Obtenemos el codigo de estacion necesario para la intermodalidad.
   */
  const codigoEstacion = props.route.params.codigo

  const [mostrarUbicacion, setMostrarUbicacion] = useState(false)
  const [mostrarHorario, setMostrarHorario] = useState(false)
  const [ubicacion, setUbicacion] = useState('')
  const [horario1, setHorario1] = useState('')
  const [horario2, setHorario2] = useState('')
  const [horario3, setHorario3] = useState('')
  const [loading, setLoading] = useState(true)
  const [texto, setTexto] = useState('')

  const urlIntermodalidad = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/intermodalidad?estacion=${codigoEstacion}&intermodal=U_Invertida&tipo=`
  const estacion = props.route.params.estacion
  const linea = props.route.params.linea.substring(1).toUpperCase()

  const getRegistroUInvertida = () => {
    console.log(urlIntermodalidad)
    fetch(urlIntermodalidad)
      .then((res) => res.json())
      .then((res) => {
        setUbicacion(res.estacion[0][8])
        setHorario1(res.estacion[0][3])
        setHorario2(res.estacion[0][4])
        setHorario3(res.estacion[0][5])
        setTexto(res.estacion[0][1])
        setLoading(false)
      })
  }

  useEffect(() => {
    props.navigation.setOptions({ title: 'U invertida' })
    getRegistroUInvertida()
  }, [])

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
    <ScrollView>
      <View style={styles.contenedroGeneral}>
        <View style={{ marginTop: SLIDER_WIDTH * 0.08, alignSelf: 'center' }}>
          <TituloCirculoEstacion texto={estacion} linea={linea} />
        </View>
        <View style={[styles.boxImg]}>
          <Image style={[styles.imagen]} source={imageUrl} />
        </View>
        <View
          style={styles.tarjeta}
        >
          <UInvertidaCirclefrom
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            width={50}
            height={50}
            fill={Globals.COLOR.ROJO_METRO}
          />
          <Text
            style={[
              Estilos.textoGeneral,
              {
                marginTop: SLIDER_WIDTH * 0.05,
                textAlign: 'justify',
              },
            ]}
          >
            {texto}
          </Text>
        </View>
        <View style={[styles.tarjetaFila, { marginTop: SLIDER_WIDTH * 0.05 }]}>
          <Pressable onPress={() => setMostrarUbicacion(!mostrarUbicacion)}>
            <View style={styles.fila}>
              <View style={{ flexDirection: 'row' }}>
                <UbicacionAgendaCultural width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
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
              <Text style={styles.textoLinea}>{ubicacion}</Text>
            </View>
          )}
        </View>
        <View style={styles.tarjetaFila}>
          <Pressable onPress={() => setMostrarHorario(!mostrarHorario)}>
            <View style={styles.fila}>
              <View style={{ flexDirection: 'row' }}>
                <IconoHorariosRutaExpresa width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
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
              <Text style={[styles.textoHorario, { marginTop: SLIDER_WIDTH * 0.03 }]}>{horario1}</Text>
              <Text style={styles.textoHorario}>{horario2}</Text>
              <Text style={styles.textoHorario}>{horario3}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default Uinvertida
