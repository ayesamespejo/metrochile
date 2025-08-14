import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, Pressable, Image, Dimensions, View } from 'react-native'
import Estilos from '../Estilos'
import Globals from '../Globals'

const SCREEN_WIDTH = Dimensions.get('window').width
/**
 * Imagenes
 */
import ChevronDown from '../assets/svg/flechas/ChevronDown.svg'
import PlanificadorCirculo from '../assets/svg/planificador/PlanificadorCirculo.svg'
import PlanificadorViajesBETA from '../assets/svg/planificador/PlanificadorViajesBETA.svg'
import NuevoRedondo from '../assets/svg/avisos/NuevoRedondo.svg'
/**
 * Este sera el Contenido para ubicar los Nuevos Proyectos,
 * Seria mucho mejor una api con esta informacion.
 */

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: SCREEN_WIDTH * 0,
  },
  boxExtention: {
    flexDirection: 'row',
    marginTop: SCREEN_WIDTH * 0.08,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
    padding: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
  },
})

const Planificadores = (props) => {
  useEffect(() => {
    props.navigation.setOptions({ title: 'Planificador de viajes' })
  })

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.boxExtention}
        onPress={() => {
          props.navigation.push('Planificador de Viajes')
        }}
      >
        <PlanificadorCirculo width={32} height={32} fill={Globals.COLOR.ROJO_METRO}/>
        <View style={{ marginLeft: SCREEN_WIDTH * 0.03, width: SCREEN_WIDTH * 0.65 }}>
          <Text style={[Estilos.textoSubtitulo]}>Planificador de viajes</Text>
          <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>En la red de Metro</Text>
        </View>
        <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} style={{ transform: [{ rotate: '-90deg' }] }} />
      </Pressable>
      <Pressable
        style={styles.boxExtention}
        onPress={() => {
          props.navigation.push('PlanificadorWeb')
        }}
      >
        <PlanificadorViajesBETA width={32} height={32} fill={Globals.COLOR.ROJO_METRO}/>
        <View style={{ marginLeft: SCREEN_WIDTH * 0.03, width: SCREEN_WIDTH * 0.65 }}>
          <Text style={[Estilos.textoSubtitulo]}>Planificador de viajes</Text>
          <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>Entre dos direcciones</Text>
        </View>
        <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} style={{ transform: [{ rotate: '-90deg' }] }} />
        <NuevoRedondo width={50} height={50} fill={Globals.COLOR.L2} style={{ position: 'absolute', top: -18, right: 45,}}/>
      </Pressable>
    </SafeAreaView>
  )
}

export default Planificadores
