import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, Pressable, Image, Dimensions, View } from 'react-native'
import Estilos from './Estilos'
import Globals from './Globals'

const SCREEN_WIDTH = Dimensions.get('window').width
/**
 * Imagenes
 */
import Linea6 from './assets/svg/lineas/Linea6.svg'
import Linea7 from './assets/svg/lineas/Linea7.svg'
import Linea8 from './assets/svg/lineas/Linea8.svg'
import Linea9 from './assets/svg/lineas/Linea9.svg'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
/**
 * Este sera el Contenido para ubicar los Nuevos Proyectos,
 * Seria mucho mejor una api con esta informacion.
 */
const contentProjects = [
  {
    projectIndex: 6,
    title: 'Extensión - Línea 6',
    subTitle: 'Lo Errázurriz',
    linea: 6,
  },

  {
    projectIndex: 7,
    title: 'Línea 7',
    subTitle: 'Renca hasta Vitacura',
    linea: 7,
  },

  {
    projectIndex: 8,
    title: 'Línea 8',
    subTitle: 'Providencia hasta Puente Alto',
    linea: 8,
  },

  {
    projectIndex: 9,
    title: 'Línea 9',
    subTitle: 'Recoleta hasta Puente Alto',
    linea: 9,
  },
]

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: SCREEN_WIDTH * 0.03,
  },
  boxExtention: {
    flexDirection: 'row',
    marginTop: SCREEN_WIDTH * 0.05,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
    padding: SCREEN_WIDTH * 0.05,
    alignItems: 'center'
  },
})

const NuevosProyectos = (props) => {
  useEffect(() => {
    props.navigation.setOptions({ title: 'Nuevos proyectos' })
  })

  return (
    <SafeAreaView style={styles.container}>
      {contentProjects.map((item) => (
        <Pressable
          key={`k_projects_${item.linea}`}
          style={styles.boxExtention}
          onPress={() => {
            props.navigation.push('NuevosProyectosDetalle', {
              projectIndex: item.projectIndex,
            })
          }}
        >
          {item.linea == 6 && <Linea6 width={32} height={32} />}
          {item.linea == 7 && <Linea7 width={32} height={32} />}
          {item.linea == 8 && <Linea8 width={32} height={32} />}
          {item.linea == 9 && <Linea9 width={32} height={32} />}
          <View style={{marginLeft: SCREEN_WIDTH * 0.03, width: SCREEN_WIDTH * 0.65}}>
            <Text style={[Estilos.textoSubtitulo]}>{item.title}</Text>
            <Text style={[Estilos.textoGeneral,{marginTop: SCREEN_WIDTH * 0.03}]}>{item.subTitle}</Text>
          </View>
          <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} style={{transform: [{ rotate: '-90deg'}]}}/>
        </Pressable>
      ))}
    </SafeAreaView>
  )
}

export default NuevosProyectos
