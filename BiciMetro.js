import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import Estilos from './Estilos'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import { ScrollView } from 'react-native-gesture-handler'
import Globals from './Globals'

import IconoHorariosRutaExpresa from './assets/svg/intermodalidad/IconoHorariosRutaExpresa.svg'
import IconoPreguntasRutaExpresa from './assets/svg/intermodalidad/IconoPreguntasRutaExpresa.svg'
import ReglamentoCirculo from './assets/svg/intermodalidad/ReglamentoCirculo.svg'
import UbicacionAgendaCultural from './assets/svg/cultura_comunidad/UbicacionAgendaCultural.svg'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'

/**
 * Importacion de Imagenes.
 */
const imageUrl = { uri: 'https://d37nosr7rj2kog.cloudfront.net/BiciMetro.jpg' }

/**
 * Dimensiones de la pantalla
 */
const SLIDER_HEIGHT = Dimensions.get('window').height
const SLIDER_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  contenedroGeneral: {
    marginHorizontal: SLIDER_WIDTH * 0.05,
  },
  tituloEstacion: {
    marginTop: SLIDER_WIDTH * 0.08,
    marginBottom: SLIDER_WIDTH * 0.05,
    alignSelf: 'center',
  },
  imagen: {
    width: SLIDER_WIDTH * 0.9,
    height: SLIDER_WIDTH * 0.6,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  logoBiciMetro: {
    alignSelf: 'center',
    width: 100,
    height: 50,
  },
  tarjeta: {
    marginTop: SLIDER_WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
    width: SLIDER_WIDTH * 0.9,
    padding: SLIDER_WIDTH * 0.05,
    borderRadius: 20,
  },
  tarjetaFila: {
    marginTop: SLIDER_WIDTH * 0.05,
    padding: SLIDER_WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textoLinea: [Estilos.textoGeneral, { marginTop: SLIDER_WIDTH * 0.03, textAlign: 'justify' }],
  tituloLinea: [Estilos.textoSubtitulo, { marginLeft: SLIDER_WIDTH * 0.03, alignSelf: 'center' }],
})

const BiciMetro = (props) => {
  /**
   * Obtenemos el codigo de estacion necesario para la intermodalidad.
   */
  let codigoEstacion = props.route.params.codigo

  const [mostrarUbicacion, setMostrarUbicacion] = useState(false)
  const [mostrarHorario, setMostrarHorario] = useState(false)

  const [textoUbicacion, setTextoUbicacion] = useState('');
  const [textoHorario, setTextoHorario] = useState('');
  const urlIntermodalidad = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/intermodalidad?estacion=${codigoEstacion}&intermodal=Bicimetro&tipo=`
  
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState('');
  const [data, setData] = useState({});
  const linea = props.route.params.linea.substring(1).toUpperCase()
  const estacion = props.route.params.estacion

  const getRegistro = () => {
    fetch(urlIntermodalidad)
      .then((res) => res.json())
      .then((res) => {
        setTextoUbicacion(res.estacion[0][12])
        setTextoHorario(res.estacion[0][3])
        setTexto(res.estacion[0][1])
        setData(res)
        setLoading(false)
      })
      .catch((error) => console.error(error))
  }

 useLayoutEffect(() => {
    props.navigation.setOptions({ title: 'BiciMetro' });
  }, [props.navigation]);

  useEffect(() => {
    getRegistro();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SLIDER_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }
  /**
   * Cambiamos el estilo del horario, dependiendo si tiene 2 mensajes el horario o solo presenta 1.
   */
  // const estiloHorario = horarioMensaje.length == 0 ? styles.horarioCuandoSoloEsUnTexto : styles.horarioCuandoSon2Textos
  return (
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.contenedroGeneral}>
          <View style={styles.tituloEstacion}>
            <TituloCirculoEstacion texto={estacion} linea={linea} />
          </View>
          <Image
            source={imageUrl}
            style={styles.imagen}
          />
            <View style={[styles.tarjeta]}>
              <Image source={require('./assets/imagenes/intermodalidad/logo_bicimetro.png')} style={styles.logoBiciMetro} />
              <Text
                style={[
                  Estilos.textoGeneral,
                  {
                    marginTop: SLIDER_WIDTH * 0.05,
                    textAlign: 'justify',
                  },
                ]}
              >
                {texto}
              </Text>
            </View>
          <View style={[styles.tarjetaFila]}>
            <Pressable onPress={() => setMostrarUbicacion(!mostrarUbicacion)}>
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <UbicacionAgendaCultural width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
                  <Text style={styles.tituloLinea}>Ubicación</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: mostrarUbicacion ? '180deg' : '0deg' }] }}
                />
              </View>
            </Pressable>
            {mostrarUbicacion && (
              <View>
                <View
                  width={SLIDER_WIDTH * 0.8}
                  height={1}
                  style={{ marginTop: SLIDER_WIDTH * 0.03, backgroundColor: Globals.COLOR.GRIS_3 }}
                />
                <Text style={styles.textoLinea}>{textoUbicacion}</Text>
              </View>
            )}
          </View>
          <View style={styles.tarjetaFila}>
            <Pressable onPress={() => setMostrarHorario(!mostrarHorario)}>
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <IconoHorariosRutaExpresa width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
                  <Text style={styles.tituloLinea}>Horario</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: mostrarHorario ? '180deg' : '0deg' }] }}
                />
              </View>
            </Pressable>
            {mostrarHorario && (
              <View>
                <View
                  width={SLIDER_WIDTH * 0.8}
                  height={1}
                  style={{ marginTop: SLIDER_WIDTH * 0.03, backgroundColor: Globals.COLOR.GRIS_3 }}
                />
                <Text style={[Estilos.textoGeneral, { marginTop: SLIDER_WIDTH * 0.03, textAlign: 'justify' }]}>
                  {textoHorario}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.tarjetaFila}>
            <Pressable
              onPress={() =>
                props.navigation.push('BiciMetroAyuda', { data: data })
              }
            >
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <IconoPreguntasRutaExpresa width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
                  <Text style={styles.tituloLinea}>¿Cómo funciona?</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
              </View>
            </Pressable>
          </View>
          <View style={styles.tarjetaFila}>
            <Pressable
              onPress={() =>
                props.navigation.push('BiciMetroReglamento', { data: data })
              }
            >
              <View style={styles.fila}>
                <View style={{ flexDirection: 'row' }}>
                  <ReglamentoCirculo width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
                  <Text style={styles.tituloLinea}>Reglamento</Text>
                </View>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
              </View>
            </Pressable>
          </View>
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
  )
}

export default BiciMetro
