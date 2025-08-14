import React from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import Estilos from '../../Estilos'

import Linea1 from '../../assets/svg/lineas/Linea1.svg'
import Linea2 from '../../assets/svg/lineas/Linea2.svg'
import Linea3 from '../../assets/svg/lineas/Linea3.svg'
import Linea4 from '../../assets/svg/lineas/Linea4.svg'
import Linea4A from '../../assets/svg/lineas/Linea4A.svg'
import Linea5 from '../../assets/svg/lineas/Linea5.svg'
import Linea6 from '../../assets/svg/lineas/Linea6.svg'
import Linea7 from '../../assets/svg/lineas/Linea7.svg'
import Linea8 from '../../assets/svg/lineas/Linea8.svg'
import Linea9 from '../../assets/svg/lineas/Linea9.svg'

const SCREEN_WIDTH = Dimensions.get('window').width
/**
 * Dimensiones de la pantalla
 */
// const SCREEN_HEIGHT = Dimensions.get('window').height

/**
 * Funcion que dependiendo de la linea se busca cual es la imagen que utilizara.
 * @param {String} linea
 * @returns String
 */

/**
 * Creacion del Componenente:
 * TituloCirculoEstacion.
 */
const TituloCirculoEstacion = ({ texto, linea, tamanoIcono = 32, estiloTexto = '', separacionIcono = SCREEN_WIDTH * 0.03}) => {
  /**
   * Dentro de los parametros de entrada tenemos
   * texto = El nombre del Titulo que se colocara.
   * linea = El numero de la Linea que tiene la estacion. (En caso de ser la 4A , que sea 4A todo escrito)
   * @param {Object} props
   */

  /**
   * Estilos del Componente.
   */
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      maxWidth: SCREEN_WIDTH * 0.8,
      // height: SCREEN_HEIGHT * 0.1,
      // backgroundColor: 'green',
    },
    imgIconEstacion: {
      marginTop: 'auto',
      marginBottom: 'auto',
      right: texto ? separacionIcono : 0,
    },
    titulo: [estiloTexto == 'subtitulo' ? Estilos.textoSubtitulo : Estilos.textoTitulo, { marginBottom: 'auto', marginTop: 'auto' }],
  })

  return (
    <View style={styles.container}>
      {linea == '1' && <Linea1 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '2' && <Linea2 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '3' && <Linea3 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '4' && <Linea4 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '4A' && <Linea4A width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '5' && <Linea5 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '6' && <Linea6 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '7' && <Linea7 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '8' && <Linea8 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {linea == '9' && <Linea9 width={tamanoIcono} height={tamanoIcono} style={styles.imgIconEstacion} />}
      {texto && <Text style={styles.titulo}>{texto}</Text>}
    </View>
  )
}
export default TituloCirculoEstacion
