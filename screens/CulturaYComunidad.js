import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, Pressable, Image, View, Dimensions } from 'react-native'
import Estilos from '../Estilos'
import Globals from '../Globals'
import MetroInformaCirculo from '../assets/svg/cultura_comunidad/MetroInformaCirculo.svg'
import AgendaCulturalCirculo from '../assets/svg/cultura_comunidad/AgendaCulturalCirculo.svg'
import NuevosProyectosCirculo from '../assets/svg/cultura_comunidad/NuevosProyectosCirculo.svg'
import ChevronUp from '../assets/svg/flechas/ChevronUp.svg'

const SCREEN_WIDTH = Dimensions.get('window').width

const CulturaYComunidad = (props) => {
  useEffect(() => {
    /**
     * Cambiar el nombre del Header.
     */
    props.navigation.setOptions({ title: 'Cultura y comunidad' })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.boxExtention}
        onPress={() => {
          props.navigation.push('Agenda')
        }}
      >
        <View style={styles.contenedorSvg}>
          <AgendaCulturalCirculo width={32} height={32} fill={Globals.COLOR.ROJO_METRO} />
        </View>
        <View>
          <Text style={[Estilos.textoSubtitulo, ]}>Agenda Cultural</Text>
          <Text style={[Estilos.textoGeneral, {marginTop: SCREEN_WIDTH * 0.03,}]}>Cartelera de eventos culturales</Text>
        </View>
        <ChevronUp width={20} height={20} fill={Globals.COLOR.GRIS_3} style={styles.arrowStyle}/>
      </Pressable>
      <Pressable
        style={styles.boxExtention}
        onPress={() => {
          props.navigation.push('MetroInforma_')
        }}
      >
        <View style={styles.contenedorSvg}>
          <MetroInformaCirculo width={32} height={32} fill={Globals.COLOR.ROJO_METRO} />
        </View>
        <View >
        <Text style={[Estilos.textoSubtitulo, ]}>MetroInforma</Text>
        <Text style={[Estilos.textoGeneral, {marginTop: SCREEN_WIDTH * 0.03}]}>Cartelera de actividades</Text>
        </View>
        <ChevronUp width={20} height={20} fill={Globals.COLOR.GRIS_3} style={styles.arrowStyle}/>
      </Pressable>
      <Pressable
        style={styles.boxExtention}
        onPress={() => {
          props.navigation.push('Nuevos Proyectos')
        }}
      >
        <View style={styles.contenedorSvg}>
          <NuevosProyectosCirculo width={32} height={32} fill={Globals.COLOR.ROJO_METRO} />
        </View>
        <View>
        <Text style={[Estilos.textoSubtitulo]}>Nuevos Proyectos</Text>
        <Text style={[Estilos.textoGeneral, {marginTop: SCREEN_WIDTH * 0.03}]}>Líneas nuevas y extensiones</Text>
        </View>
        <ChevronUp width={20} height={20} fill={Globals.COLOR.GRIS_3} style={styles.arrowStyle}/>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  arrowStyle: {
    transform: [{ rotate: '90deg' }], 
    right: SCREEN_WIDTH* 0.03, 
    position: 'absolute'
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: SCREEN_WIDTH * 0.03,
  },
  boxExtention: {
    alignContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.9,
    padding: SCREEN_WIDTH * 0.05,
    // height: '10%',
    marginTop: SCREEN_WIDTH * 0.05,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
  },
  imagen: {
    left: '-35%',
    height: 65,
    width: 65,
  },
  contenedorSvg: {
    paddingRight: SCREEN_WIDTH * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CulturaYComunidad
