import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
  SafeAreaView,
  Linking,
  Dimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import Estilos from './Estilos'

import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import BotonSimple from './components/BotonSimple'
import Globals from './Globals'

import IconoHorariosRutaExpresa from './assets/svg/cultura_comunidad/IconoHorariosRutaExpresa.svg'
import LibroBiblioMetro from './assets/svg/cultura_comunidad/LibroBiblioMetro.svg'
import UbicacionAgendaCultural from './assets/svg/cultura_comunidad/UbicacionAgendaCultural.svg'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SLIDER_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SLIDER_WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardContainer: {
    marginTop: SLIDER_WIDTH * 0.05,
    borderRadius: 20,
    padding: SLIDER_WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
  },
})

const BiblioMetro = (props) => {
  // Cambiar el nombre del Header.
  useLayoutEffect(() => {
  props.navigation.setOptions({ title: 'Información Estaciones' })
}, [props.navigation])
  // Extraemos los Valores.
  const { estacion, linea: lineaParam } = props.route.params
  // Obtenemos el codigo de estacion necesario para bibliometro.
  const codigoEstacion = props.route.params.codigo
  const url = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/cultura?estacion=${codigoEstacion}&cultura=Bibliometro`
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const getBiblioMetro = async () => {
    const res = await fetch(url)
    const datos = await res.json()
    const datosEditados = datos.cultura.map((element) => ({
      Estado: element[2],
      Ubicación: element[9],
      Horario: element[3],
      Servicios: element[7],
      Teléfono: element[8],
      url: element[6],
    }))[0]
    setData(datosEditados)
    setLoading(false)
  }

  useEffect(() => {
    getBiblioMetro()
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SCREEN_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  const linea = lineaParam.substring(1).toUpperCase()

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginTop: SLIDER_WIDTH * 0.08, alignSelf: 'center'}}>
            <TituloCirculoEstacion texto={estacion} linea={linea} />
          </View>
          <Text style={[Estilos.textoTitulo, { marginLeft: SLIDER_WIDTH * 0.0, marginTop: SLIDER_WIDTH * 0.05 }]}>
            BiblioMetro
          </Text>
          <View>
            <View style={[styles.cardContainer]}>
              <View style={[{ flexDirection: 'row', paddingRight: SLIDER_WIDTH * 0.05 }]}>
                <View style={{ justifyContent: 'center' }}>
                  <IconoHorariosRutaExpresa
                    width={24}
                    height={24}
                    fill={Globals.COLOR[props.route.params.linea.toUpperCase()]}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: SLIDER_WIDTH * 0.03,
                    paddingRight: SLIDER_WIDTH * 0.05,
                  }}
                >
                  <Text style={[Estilos.textoGeneral, , { flexWrap: 'wrap' }]}>{data.Horario}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: SLIDER_WIDTH * 0.05 }}>
                <View style={{ justifyContent: 'center' }}>
                  <LibroBiblioMetro
                    width={24}
                    height={24}
                    fill={Globals.COLOR[props.route.params.linea.toUpperCase()]}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: SLIDER_WIDTH * 0.03,
                    paddingRight: SLIDER_WIDTH * 0.05,
                  }}
                >
                  <Text style={[Estilos.textoSubtitulo, , { flexWrap: 'wrap' }]}>{data.Servicios}</Text>
                </View>
              </View>
              <View style={[{ flexDirection: 'row', marginTop: SLIDER_WIDTH * 0.05 }]}>
                <View style={{ justifyContent: 'center' }}>
                  <UbicacionAgendaCultural
                    width={24}
                    height={24}
                    fill={Globals.COLOR[props.route.params.linea.toUpperCase()]}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: SLIDER_WIDTH * 0.03,
                    paddingRight: SLIDER_WIDTH * 0.05,
                  }}
                >
                  <Text style={[Estilos.textoGeneral, { flexWrap: 'wrap' }]}>{data.Ubicación}</Text>
                </View>
              </View>
              {Object.entries(data).map((item, index) => {
                if (item[0] == 'url') {
                  return (
                    <View
                      key={`kk_biblioMetro_${index}`}
                      style={{ marginTop: SLIDER_WIDTH * 0.05, alignItems: 'center' }}
                    >
                      <BotonSimple
                        texto="Ver catálogo"
                        colorTexto="#FFFFFF"
                        onPress={() => {
                          let url = item[1]
                          let supported = Linking.canOpenURL(url)
                          if (supported) {
                            Linking.openURL(url)
                          }
                        }}
                        color={Globals.COLOR[props.route.params.linea.toUpperCase()]}
                        width={SLIDER_WIDTH * 0.54}
                      />
                    </View>
                  )
                }
              })}
            </View>
          </View>
          { data.Teléfono != '' && <View>
            <Text style={[Estilos.textoTitulo, { marginTop: SLIDER_WIDTH * 0.08 }]}>¿Dudas o preguntas?</Text>
            <View style={{ marginTop: SLIDER_WIDTH * 0.05, alignItems: 'center' }}>
              <BotonSimple
                texto={data.Teléfono}
                colorTexto="#FFFFFF"
                onPress={() => {
                  return Linking.openURL(`tel:${data.Teléfono}`)
                }}
                color={Globals.COLOR[props.route.params.linea.toUpperCase()]}
                width={SLIDER_WIDTH * 0.8}
              />
            </View>
          </View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BiblioMetro
