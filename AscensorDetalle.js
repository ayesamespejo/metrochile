import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Linking,
} from 'react-native'
import Estilos from './Estilos'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import BotonSimple from './components/BotonSimple'
import Globals from './Globals'
import IconoOk from './assets/svg/estados/Bueno.svg'
import IconoError from './assets/svg/estados/Error.svg'
/**
 * Dimensiones de la pantalla
 */
const SLIDER_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const estadoicono = [<IconoOk height={40} width={40} fill={Globals.COLOR.L5} style={{marginBottom: SCREEN_WIDTH * 0.03}}/>, <IconoError  height={40} width={40} fill={Globals.COLOR.ROJO_METRO} style={{marginBottom: SCREEN_WIDTH * 0.03}}/>]

const AscensorDetalle = (props) => {
  /**
   * Obtenemos el codigo de estacion necesario para la intermodalidad.
   */
  if (props.route.params.tipo == 'ACC') {
    props.navigation.setOptions({ title: 'Accesos' })
  }
  let codigoEstacion = props.route.params.codigo
  if (codigoEstacion == 'ÑUÑ') {
    codigoEstacion = 'NUN'
  }
  const [state, setState] = useState({
    loading: true,
    estacion: props.route.params.estacion,
    linea: props.route.params.linea,
    data: props.route.params.data,
    tipo: props.route.params.tipo,
    // urlAscensores: `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/ascensores/${codigoEstacion}`,
    urlAscensores: `https://l2lpxcjjw5.execute-api.us-east-1.amazonaws.com/UAT/ascensores/${codigoEstacion}`,
    //urlEscalerasMecanicas: `https://m748uxez45.execute-api.us-east-1.amazonaws.com/escaleras-mecanicas/${codigoEstacion}
    urlEscalerasMecanicas: `https://arzdhgolsb.execute-api.us-east-1.amazonaws.com/UAT/escaleras/${codigoEstacion}`,
    urlAccesos: `https://2dangey618.execute-api.us-east-1.amazonaws.com/UAT/accesos/${codigoEstacion}`,
  })

  const [titulo, setTitulo] = useState('')

  const styles = StyleSheet.create({
    contenedorTarjetas: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    tarjeta: {
      width: SCREEN_WIDTH * 0.9,
      marginTop: SCREEN_WIDTH * 0.05,
      marginHorizontal: SCREEN_WIDTH * 0.05,
      paddingRight: SCREEN_WIDTH * 0.04,
      paddingVertical: SCREEN_WIDTH * 0.05,
      backgroundColor: Globals.COLOR.GRIS_1,
      borderRadius: 20,
    },
    fila: {
      flex: 1,
      flexDirection: 'row',
    },
    contenedorEstado: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    contenedorTexto: {
      paddingLeft: SCREEN_WIDTH * 0.03,
      width: SCREEN_WIDTH * 0.53,
      borderLeftColor: '#CCCCCC',
      borderLeftWidth: 1,
      textAlign: 'justify',
    },
    textoDescripcion: {
      textAlign: 'justify',
    },
    textoActualizacion: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: SCREEN_WIDTH * 0.03,
    },
    iconoEstado: {
      width: 40,
      height: 40,
      marginBottom: SCREEN_WIDTH * 0.03,
    },
  })

  const getAscensores = () => {
    const { urlAscensores, urlEscalerasMecanicas, urlAccesos } = state
    let url = ''
    switch (state.tipo) {
      case 'ESC':
        url = urlEscalerasMecanicas
        break
      case 'ASC':
        url = urlAscensores
        break
      case 'ANC':
        url = urlAscensores
        break
      case 'ACC':
        url = urlAccesos
        break
      case 'RDA':
        url = urlAscensores
        break
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let auxAscensores = []
        if (state.tipo == 'ESC') {
          auxAscensores = res.sort((a, b) => parseInt(a.Orden_Escalera) - parseInt(b.Orden_Escalera))
        }
        else if (state.tipo == 'ACC') {
          auxAscensores = res.Items.sort((a, b) => a.Orden_Acceso.localeCompare(b.Orden_Acceso))
        } else {
          auxAscensores = res.Items.filter((item) => item.Tipo_Accesibilidad == state.tipo).sort(
            (a, b) => parseInt(a.Orden_Ascensor) - parseInt(b.Orden_Ascensor),
          )
        }
        setState({
          ...state,
          loading: false,
          // comentarioAscensor: res.Item != undefined ? res.Items.Ubicacion : undefined,
          auxAscensores: auxAscensores,
        })
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    /**
     * Cambiar el nombre del Header.
     */
    props.navigation.setOptions({ title: 'Accesibilidad' })
    switch (state.tipo) {
      case 'ASC':
        setTitulo('Ascensores')
        break
      case 'ANC':
        setTitulo('Acceso a nivel de calle')
        break
      case 'RDA':
        setTitulo('Rampas de acceso')
        break
      case 'ESC':
        setTitulo('Escaleras mecánicas')
        break
      case 'ACC':
        setTitulo('Accesos')
        break
    }
    getAscensores()
  }, [])

  let { estacion, linea, loading, comentarioAscensor, auxAscensores } = state
  linea = linea.substring(1).toUpperCase()
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
    <View style={{ height: SLIDER_HEIGHT * 0.85 }}>
      <ScrollView>
        <View style={{ marginTop: SCREEN_WIDTH * 0.08, alignSelf: 'center' }}>
          <TituloCirculoEstacion texto={estacion} linea={linea} />
        </View>

        <Text style={[Estilos.textoTitulo, { marginLeft: SCREEN_WIDTH * 0.05, marginTop: SCREEN_WIDTH * 0.05 }]}>
          {titulo}
        </Text>
        <Text style={[Estilos.textoNota, { marginLeft: SCREEN_WIDTH * 0.08, marginTop: SCREEN_WIDTH * 0.05 }]}>
          Última actualización: hace 5 minutos.
        </Text>
         { console.log('Ascensores:', auxAscensores)}

        {/* ✅ Validación si no hay datos */}
        {auxAscensores.length === 0 ? (
          <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.05, marginTop: SCREEN_WIDTH * 0.05 }}>
            <Text style={[Estilos.textoGeneral]}>
              No hay información disponible para esta estación en esta categoría.
            </Text>
          </View>
        ) : (

          
          auxAscensores.map((e, index) => (
            
            <View key={`ascensor-${index}`} style={styles.tarjeta}>
             
              <View style={styles.fila}>
                <View style={styles.contenedorEstado}>
                  {estadoicono[e.Estado === 'Disponible' ? 0 : 1]}
                  <Text style={[Estilos.textoSubtitulo]}>{e.Estado}</Text>
                </View>
                <View style={styles.contenedorTexto}>
                  {e.Tipo_Ascensor && <Text style={[Estilos.textoSubtitulo]}>{e.Tipo_Ascensor}</Text>}
                  {e.Orden_Acceso && <Text style={[Estilos.textoSubtitulo]}>Acceso {e.Orden_Acceso}</Text>}
                  <Text style={[Estilos.textoGeneral, styles.textoDescripcion]}>{e.Ubicacion}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={{ marginTop: SCREEN_WIDTH * 0.08, paddingHorizontal: SCREEN_WIDTH * 0.05 }}>
          <Text style={[Estilos.textoTitulo]}>¿Necesitas asistencia?</Text>
          <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.05 }]}>
            Si necesitas ayuda para ingresar o salir de la estación
          </Text>
          <View style={{ alignItems: 'center', marginVertical: SCREEN_WIDTH * 0.05 }}>
            <BotonSimple
              texto="800 540 800"
              colorTexto="#FFFFFF"
              onPress={() => Linking.openURL('tel:800540800')}
              color={Globals.COLOR[props.route.params.linea.toUpperCase()]}
              width={SCREEN_WIDTH * 0.8}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AscensorDetalle
