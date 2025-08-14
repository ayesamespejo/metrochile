import { StyleSheet, Text, View, Dimensions, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

import TituloCirculoEstacion from '../js/components/TituloCirculoEstacion'
import Estilos from '../Estilos'
import Globals from '../Globals'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const LocalesComerciales = (props) => {
  const [listaLocales, setListaLocales] = useState([])
  const [cargando, setCargando] = useState(false);
  

  useEffect(() => {
    props.navigation.setOptions({ title: 'Comercio' })
    setCargando(true)
    fetch(`https://sy8dlifpr2.execute-api.us-east-1.amazonaws.com/UAT/locales/${props.route.params.codigo}`)
      .then((lista) => lista.json())
      .then((lista) => {
        setListaLocales(lista.sort((a, b) => a.Nombre_Fantasia.localeCompare(b.Nombre_Fantasia)))
        setCargando(false)
      })
  }, [])

  if (cargando) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ marginTop: WIDTH * 0.08, alignItems: 'center' }}>
          <TituloCirculoEstacion texto={props.route.params.estacion} linea={props.route.params.linea.toUpperCase().replace('L','')} />
        </View>
        <Text style={[Estilos.textoTitulo, { marginTop: WIDTH * 0.05, marginLeft: WIDTH * 0.05,  }]}>Locales comerciales</Text>
        <View
          style={{
            marginTop: WIDTH * 0.05,
            padding: WIDTH * 0.05,
            backgroundColor: Globals.COLOR.GRIS_1,
            width: WIDTH * 0.9,
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 20,
          }}
        >
          {listaLocales.map((local, index) => {
            return (
              <View key={local.Id_Local}>
                <Text style={[Estilos.textoGeneral, {marginTop: index == 0 ? 0 : WIDTH * 0.03}]}>{local.Nombre_Fantasia}</Text>
                { index < listaLocales.length -1 && <View style={{ marginTop: WIDTH * 0.03, height: 1, backgroundColor: Globals.COLOR.GRIS_3 }} />}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LocalesComerciales

const styles = StyleSheet.create({})
