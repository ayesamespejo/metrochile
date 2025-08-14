import React, { useState, useEffect } from 'react'
import Estilos from './Estilos'
import Globals from './Globals'
import {
  Text,
  SafeAreaView,
  Dimensions,
  Pressable,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
import TrenCirculo from './assets/svg/intermodalidad/TrenCirculo.svg'
import { ScrollView } from 'react-native-gesture-handler'

const SLIDER_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  tarjeta: {
    width: SCREEN_WIDTH * 0.9,
    marginTop: SCREEN_WIDTH * 0.05,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

/**
 * Seccion de los paraderos
 */
const ParaderoSection = ({ item, linea }) => {
  return item.visible ? (
    <View style={{marginBottom: SCREEN_WIDTH * 0.05}}>
      {/* **
       *Esta es la raya
       ** */}
      <View
        style={{
          height: 1,
          marginHorizontal: SCREEN_WIDTH * 0.05,
          backgroundColor: Globals.COLOR.GRIS_3,
        }}
      />
      {item.paraderos.map ((item , index)=> (
        <ParaderoList item={item} key={index + Math.round(Math.random() * 1000).toString()}/>
      ))}
    </View>
  ) : (
    <></>
  )
}

/**
 * Lista para los paraderos
 */
const ParaderoList = ({ item }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: SCREEN_WIDTH * 0.05,
    }}
  >
    <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
      <TrenCirculo width={24} height={24} />
    </View>
    <View style={{ marginLeft: SCREEN_WIDTH * 0.03, marginTop: SCREEN_WIDTH * 0.03, flex: 1 }}>
      <View >
        <Text style={[Estilos.textoSubtitulo]}>{item[6]} </Text>
      </View>
      <View>
        <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>{item[1]}</Text>
      </View>
    </View>
  </View>
)

const TrenRed = (props) => {
  /**
   * Obtenemos el codigo de estacion necesario para la intermodalidad.
   */
  let codigoEstacion = props.route.params.codigo

  const [state, setState] = useState({
    loading: true,
    listaTipoTren: [],
    estacion: props.route.params.estacion,
    linea: props.route.params.linea,
    urlIntermodalidad: `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/intermodalidad?estacion=${codigoEstacion}&intermodal=Tren&tipo=`,
  })

  const checkIntermodalidad = () => {
    const { urlIntermodalidad } = state

    fetch(urlIntermodalidad)
      .then((response) => response.json())
      .then((json) => {
        const respuestaJson = json.estacion
        var arregloAuxiliar = new Object()

        /**
         * Se usa la posicion 7 o indice 7 , ya que alli se encuentra el tipo de tren.
         */
        respuestaJson.forEach((item) => {
          arregloAuxiliar[item[7]] = !arregloAuxiliar[item[7]]
            ? { visible: 0, operador: 1, paraderos: [] }
            : arregloAuxiliar[item[7]]
          arregloAuxiliar[item[7]].paraderos.push(item)
        })
        setState({ ...state, listaTipoTren: arregloAuxiliar, loading: false })
      })
      .catch((error) => console.error(error))
      .finally(() => {})
  }

  useEffect(() => {
    /**
     * Cambiar el nombre del Header.
     */
    props.navigation.setOptions({ title: 'Intermodalidad' })
    const _unsubscribe = props.navigation.addListener('focus', () => {
      checkIntermodalidad()
    })
  })

  const { listaTipoTren, estacion, linea, loading } = state
  let numeroLinea = linea.substring(1).toUpperCase()

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SLIDER_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  const muestraDetalle = (listaTipoTren, key) => {
    const listaTipoTrenPaso = { ...listaTipoTren }
    if (!listaTipoTrenPaso[key].visible)
      Object.keys(listaTipoTrenPaso).map((keyPaso) => (listaTipoTrenPaso[keyPaso].visible = 0))
    listaTipoTrenPaso[key].visible = !listaTipoTrenPaso[key].visible
    setState({ ...state, listaTipoTren: listaTipoTrenPaso })
  }

  return (
    <SafeAreaView >
      <ScrollView>
      <View style={{ marginTop: SCREEN_WIDTH * 0.08, alignSelf: 'center' }}>
        <TituloCirculoEstacion texto={estacion} linea={numeroLinea} />
      </View>
      <View style={[styles.tarjeta]}>
        {Object.keys(listaTipoTren).map((key) => (
          <View key={`k_trenes_${key}`}>
            {/* **
             *Este es el boton
             ** */}
            <Pressable
              onPress={(e) => muestraDetalle(listaTipoTren, key)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: SCREEN_WIDTH * 0.05,
              }}
            >
              {/**
               * Aqui colocamos el titulo de la intermodalidad
               */}
              <Text style={Estilos.textoSubtitulo}> {key} </Text>
              <ChevronDown
                width={20}
                height={20}
                fill={Globals.COLOR.GRIS_3}
                style={{
                  transform: [{ rotate: listaTipoTren[key].visible ? '180deg' : '0deg' }],
                  marginLeft: SCREEN_WIDTH * 0.03,
                }}
              />
            </Pressable>
            <ParaderoSection item={listaTipoTren[key]} linea={linea} />
          </View>
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TrenRed
