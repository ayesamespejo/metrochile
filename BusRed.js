import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, Dimensions, Pressable, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
//import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import Estilos from './Estilos'
import Globals from './Globals'

import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
import BusCirculo from './assets/svg/intermodalidad/BusCirculo.svg'
import BusAeroCirculo from './assets/svg/intermodalidad/BusAeroCirculo.svg'
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
    // padding: SCREEN_WIDTH * 0.05,
  },
  lineaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

// Seccion de los paraderos
const ParaderoSection = ({ item }) => {
  const soloUnParadero = item.soloUnParadero
  return item.visible ? (
    <View>
      <View
        style={{
          width: SCREEN_WIDTH * 0.8,
          height: 1,
          backgroundColor: Globals.COLOR.GRIS_3,
        }}
      />
      {item.paraderos.map((item, index) => (
        // <Text>{JSON.stringify(item)}</Text>
        <ParaderoList
          key={index + Math.round(Math.random() * 1000).toString()}
          item={item}
          soloUnParadero={soloUnParadero}
        />
      ))}
    </View>
  ) : (
    <></>
  )
}

// Lista para los paraderos individuales
const ParaderoList = ({ item, soloUnParadero }) => {
  return soloUnParadero ? (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: SCREEN_WIDTH * 0.05,
      }}
    >
      <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
        {item[7] == 'Aeropuerto' ? <BusAeroCirculo width={24} height={24} /> : <BusCirculo width={24} height={24} /> }
      </View>
      <View style={{ marginLeft: SCREEN_WIDTH * 0.03, marginTop: SCREEN_WIDTH * 0.03, flex:1 }}>
        <View>
          <Text style={[Estilos.textoSubtitulo]}>{item[6]}</Text>
        </View>
        <View >
          <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03, }]}>
            <Text style={Estilos.textoSubtitulo}>Destino: </Text>
            {item[1]}
          </Text>
        </View>
      </View>
    </View>
  ) : (
    // Paradero con tres columnas
    <View
      style={{
        flexDirection: 'row',
        marginBottom: SCREEN_WIDTH * 0.05,
      }}
    >
      <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
        <BusCirculo width={24} height={24} />
      </View>
      <View style={{ marginLeft: SCREEN_WIDTH * 0.03, marginTop: SCREEN_WIDTH * 0.03 }}>
        <View>
          <Text style={Estilos.textoSubtitulo}>{item[5]} </Text>
        </View>
        <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
          <Text style={Estilos.textoGeneral}>
            <Text style={Estilos.textoSubtitulo}>Paradero: </Text>
            {item[6]}
          </Text>
        </View>
        <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
          <Text style={Estilos.textoGeneral}>
            <Text style={Estilos.textoSubtitulo}>Destino: </Text>
            {item[1]}
          </Text>
        </View>
      </View>
    </View>
  )
}

const BusRed = (props) => {
  // Obtenemos el codigo de estacion necesario para la intermodalidad.
  let codigoEstacion = props.route.params.codigo

  const [state, setState] = useState({
    loading: true,
    listaTipoBus: [],
    estacion: props.route.params.estacion,
    linea: props.route.params.linea,
    urlIntermodalidad: `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/intermodalidad?estacion=${codigoEstacion}&intermodal=Bus&tipo=`,
  })

  useEffect(() => {
      // Cambiar el nombre del Header.
  props.navigation.setOptions({ title: 'Intermodalidad' })
    const _unsubscribe = props.navigation.addListener('focus', () => {
      checkIntermodalidad()
    })
  }, [])

  const checkIntermodalidad = () => {
    const { urlIntermodalidad } = state
    fetch(urlIntermodalidad)
      .then((response) => response.json())
      .then((json) => {
        const respuestaJson = json.estacion
        var arregloAuxiliar = new Object()
        // Se usa la posicion 7 o indice 7 , ya que alli se encuentra el tipo de Bus.
        respuestaJson?.forEach((item) => {
          arregloAuxiliar[item[7]] = !arregloAuxiliar[item[7]]
            ? { visible: 0, soloUnParadero: 1, operador: 0, paraderos: [] }
            : arregloAuxiliar[item[7]]
          arregloAuxiliar[item[7]].paraderos.push(item)
        })
        // Ahora debemos chequear el Bus Red.
        if (Boolean(arregloAuxiliar['Bus Red'])) {
          /**
           * Primero obtenemos los paraderos completos unicos del Bus Red.
           * Sacamo el valor 5 de todos los elementos, ya que el valor 5 , es el que tiene el elemento del paradero, una vez asi, lo que hacemos es filtrar a todos los elementos, para que solo me traiga los unicos.
           */
          const listaParaderos = arregloAuxiliar['Bus Red'].paraderos
            .map((o) => o[5])
            .filter((v, i, a) => a.indexOf(v) === i)
          if (listaParaderos.length == 1) {
            const nombreParadero = listaParaderos.pop()
            arregloAuxiliar = Object.assign(
              { [`Bus Red - ${nombreParadero}`]: arregloAuxiliar['Bus Red'] },
              arregloAuxiliar,
            )
            delete arregloAuxiliar['Bus Red']
          } else {
            arregloAuxiliar['Bus Red'].soloUnParadero = 0
          }
        }
        /**
         * Los buses de InterUrbano y Aeropuerto tienen columnas distintas.
         * Remplazando Recorrido por Operador
         */
        if (Boolean(arregloAuxiliar['Bus Interurbano'])) arregloAuxiliar['Bus Interurbano'].operador = 1
        if (Boolean(arregloAuxiliar['Aeropuerto'])) arregloAuxiliar['Aeropuerto'].operador = 1
        /**
         * Proceso para organizar utilizando el valor del Recorrido, que se encuentra en la posicion 6 del arreglo de paraderos.
         */
        Object.keys(arregloAuxiliar).map((key) =>
          arregloAuxiliar[key].paraderos.sort((a, b) => a[6].localeCompare(b[6])),
        )
        setState({ ...state, listaTipoBus: arregloAuxiliar, loading: false })
      })
      .catch((error) => console.error(error))
      .finally(() => {})
  }
  const { listaTipoBus, estacion, linea, loading } = state
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>


      <View style={{ marginTop: SCREEN_WIDTH * 0.08, alignSelf: 'center' }}>
        <TituloCirculoEstacion texto={estacion} linea={numeroLinea} />
      </View>
      <View>
        {Object.keys(listaTipoBus).map((key) => (
          <View key={`k_buses_${key}`} style={styles.tarjeta}>
            {/* Este es el boton */}
            <Pressable
              onPress={(e) => {
                if (!listaTipoBus[key].visible) Object.keys(listaTipoBus).map((key) => (listaTipoBus[key].visible = 0))
                listaTipoBus[key].visible = !listaTipoBus[key].visible
                setState({ ...state, ...listaTipoBus })
              }}
              style={[styles.lineaTitulo]}
            >
              <View style={[styles.lineaTitulo, , { width: SCREEN_WIDTH * 0.9, padding: SCREEN_WIDTH * 0.05 }]}>
                {/* Aqui colocamos el titulo de la intermodalidad */}
                <Text style={[Estilos.textoSubtitulo]}> {key} </Text>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{
                    transform: [{ rotate: listaTipoBus[key].visible ? '180deg' : '0deg' }],
                    marginLeft: SCREEN_WIDTH * 0.03,
                  }}
                />
              </View>
            </Pressable>
            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>
              <ParaderoSection item={listaTipoBus[key]} linea={linea} />
            </View>
          </View>
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BusRed
