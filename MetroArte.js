import React, { useLayoutEffect, useState } from 'react'
import { SafeAreaView, Pressable, Image, Dimensions, StyleSheet, ScrollView, View, Text } from 'react-native'
import Estilos from './Estilos'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import Globals from './Globals'

import ChevronDown from './assets/svg/flechas/ChevronDown.svg'

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  titulo: [
    Estilos.textoTitulo,
    {
      marginTop: SCREEN_WIDTH * 0.05,
    },
  ],
  contenedorTarjetas: {
    alignItems: 'center',
  },
  textoTarjeta: [
    Estilos.textoSubtitulo,
    {
      width: SCREEN_WIDTH * 0.73,
    }
  ],
  tarjeta: {
    marginTop: SCREEN_WIDTH * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: Globals.COLOR.GRIS_1,
    padding: SCREEN_WIDTH * 0.05,
  },
})

const MetroArte = (props) => {
  /**
   * Cambiar el nombre del Header.
   */
  useLayoutEffect(() => {
    props.navigation.setOptions({ title: 'Información Estaciones' })
  }, [props.navigation])

  const [state, setState] = useState({
    ...props.route.params,
    estacion: props.route.params.estacion,
    linea: props.route.params.linea,
  })

  const renderItem = (label, item) => {
    return (
      <Pressable
        onPress={() => {
          props.navigation.push('Obra', {
            newDataMetro: item,
            codigo: props.route.params.codigo == 'ÑU' ? 'NU' : props.route.params.codigo,
            estacion: props.route.params.estacion,
            linea: props.route.params.linea,
          })
        }}
        key={`k_${Math.round(Math.random() * 1000)}`}
      >
        <View style={styles.tarjeta}>
          <Text style={styles.textoTarjeta}>{label}</Text>
          <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} style={{transform: [{ rotate: '-90deg', }], marginLeft: SCREEN_WIDTH * 0.03}}/>
        </View>
      </Pressable>
    )
  }

  let { estacion, linea, newDataMetro } = state
  linea = linea.substring(1).toUpperCase()

  return (
    <SafeAreaView sstyle={{}}>
      <ScrollView style={{ height: Dimensions.get('window').height - 100, paddingHorizontal: SCREEN_WIDTH * 0.05 }}>
        <View style={{ marginTop: SCREEN_WIDTH * 0.08, alignSelf: 'center' }}>
          <TituloCirculoEstacion texto={estacion} linea={linea} />
        </View>
        <Text style={styles.titulo}>MetroArte</Text>
        {/** El indice de 13 es el titulo */}
        <View style={styles.contenedorTarjetas}>{newDataMetro.map((item) => renderItem(item[12], item))}</View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MetroArte
