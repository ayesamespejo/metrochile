import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, SafeAreaView, ActivityIndicator, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Estilos from './Estilos'
import Globals from './Globals'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import BotonSimple from './components/BotonSimple'
import UbicacionAgendaCultural from './assets/svg/cultura_comunidad/UbicacionAgendaCultural.svg'
import IconoHorariosRutaExpresa from './assets/svg/cultura_comunidad/IconoHorariosRutaExpresa.svg'

import TarjetaBipAdulto from './assets/svg/tarjetas/TarjetaBipAdulto.svg'
import TarjetaTam from './assets/svg/tarjetas/TarjetaTam.svg'

//let COLOR = Globals.COLOR

const SCREEN_WIDTH = Dimensions.get('window').width
const SLIDER_HEIGHT = Dimensions.get('window').height

const contentOffice = [
  {
    linea: 1,
    iconColor: Globals.COLOR.L1,
  },

  {
    linea: 2,
    iconColor: Globals.COLOR.L2,
  },

  {
    linea: 3,
    iconColor: Globals.COLOR.L3,
  },

  {
    linea: 4,
    iconColor: Globals.COLOR.L4,
  },
  {
    linea: 5,
    iconColor: Globals.COLOR.L5,
  },

  {
    linea: 6,
    iconColor: Globals.COLOR.L6,
  },
]

const OficinaDeAtencionClientes = (props) => {
  const codigoEstacion = props.route.params.codigo
  const estacion = props.route.params.estacion
  const linea = props.route.params.linea
  const urlOac = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/oac/${codigoEstacion}`
  const [horario, setHorario] = useState('')
  const [servicio, setServicio] = useState('')
  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(true)
  const [iconColor, setIconColor] = useState('')

  const styles = StyleSheet.create({
    container: {
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: SCREEN_WIDTH * 0.05,
      // height: '65%',
      backgroundColor: Globals.COLOR.GRIS_1,
      borderRadius: 20,
      paddingBottom: SCREEN_WIDTH * 0.05,
    },
    textHorarioLocation: {
      fontSize: 16,
      marginLeft: 20,
      lineHeight: 22,
    },
    tarjeta: {
      flexDirection: 'row',
      // alignContent: 'center',
      alignItems: 'center',
      backgroundColor: Globals.COLOR.GRIS_1,
      borderRadius: 20,
      padding: SCREEN_WIDTH * 0.05,
      marginTop: SCREEN_WIDTH * 0.05,
      width: SCREEN_WIDTH * 0.9,
      marginHorizontal: SCREEN_WIDTH * 0.05,
    },
    contenedorTextoConEnlace: {
      flexDirection: 'row',
      marginTop: SCREEN_WIDTH * 0.03,
      marginLeft: SCREEN_WIDTH * 0.03,
      alignItems: 'flex-end',
    },
    enlace: {
      fontSize: 16,
      color: Globals.COLOR.ENLACE,
      textDecorationLine: 'underline',
    },
  })

  useEffect(() => {
    props.navigation.setOptions({ title: 'Servicios generales' })
    getRegistroOAC()
  }, [])

  const getRegistroOAC = () => {
    console.log(urlOac)
    fetch(urlOac)
      .then((res) => res.json())
      .then((res) => {
        console.log(JSON.stringify(res))
        setIconColor(contentOffice.find((element) => element.linea == res.Item['Línea']).iconColor)
        setDireccion(res.Item['Dirección'])
        setHorario(res.Item.Horario)
        setServicio(res.Item.Servicio)
        setLoading(false)
      })
      .catch((error) => console.error(error))
  }

  const lineaPaso = linea.substring(1).toUpperCase()

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
    <SafeAreaView>
      <ScrollView>
        <View style={{ marginVertical: SCREEN_WIDTH * 0.08, alignSelf: 'center' }}>
          <TituloCirculoEstacion texto={estacion} linea={lineaPaso} />
        </View>
        <Text style={[Estilos.textoTitulo, { marginLeft: SCREEN_WIDTH * 0.05 }]}>Oficina de atención a clientes</Text>
        <View style={[styles.container]}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 20,
              marginTop: 20,
              marginRight: 55,
            }}
          >
            <IconoHorariosRutaExpresa width={24} height={24} fill={iconColor} />
            <Text style={[Estilos.textoGeneral, styles.textHorarioLocation]}>{horario}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginLeft: 20,
              marginTop: 14,
              marginRight: 55,
            }}
          >
            <UbicacionAgendaCultural width={24} height={24} fill={iconColor} />
            <Text style={[Estilos.textoGeneral, styles.textHorarioLocation]}>{direccion}</Text>
          </View>

          <Text
            style={[
              Estilos.textoTitulo,
              { marginLeft: SCREEN_WIDTH * 0.08, marginTop: SCREEN_WIDTH * 0.05, marginBottom: SCREEN_WIDTH * 0.05 },
            ]}
          >
            Servicios:
          </Text>
          {servicio &&
            servicio.map((itemServicio, index) => (
              <View
                key={`servi__${index}`}
                style={{
                  marginLeft: SCREEN_WIDTH * 0.15,
                  marginRight: 20,
                  flexDirection: 'row',
                  marginBottom: 12,
                }}
              >
                <Text style={[Estilos.tipografiaBold, { right: 10, top: 3, fontSize: 20 }]}>•</Text>
                <Text style={[Estilos.textoGeneral, { marginRight: 10 }]}>{itemServicio}</Text>
              </View>
            ))}
        </View>
        <Text style={[Estilos.textoTitulo, { marginLeft: SCREEN_WIDTH * 0.05, marginTop: SCREEN_WIDTH * 0.08 }]}>Más información</Text>
        <View style={[styles.tarjeta, {marginTop: SCREEN_WIDTH * 0.03 }]}>
          <TarjetaTam width={55} height={35} />
          <View>
            <Text style={[Estilos.textoSubtitulo, { marginLeft: SCREEN_WIDTH * 0.03 }]}>Tarjeta Adulto Mayor</Text>
            <View style={[styles.contenedorTextoConEnlace]}>
              <Text style={[Estilos.textoGeneral]}>Para más info presiona </Text>
              <Text
                style={[styles.enlace]}
                onPress={() => {
                  Linking.openURL('https://www.metro.cl/atencion-cliente/tarjeta-adulto-mayor')
                }}
              >
                aquí
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.tarjeta]}>
          <TarjetaBipAdulto width={55} height={35} />
          <View>
            <Text style={[Estilos.textoSubtitulo, { marginLeft: SCREEN_WIDTH * 0.03 }]}>Tarjeta bip! Adulto Mayor</Text>
            <View style={[styles.contenedorTextoConEnlace]}>
              <Text style={[Estilos.textoGeneral]}>Para más info presiona </Text>
              <Text
                style={[styles.enlace]}
                onPress={() => {
                  Linking.openURL('https://www.tarjetabip.cl/bip-adulto-mayor.php')
                }}
              >
                aquí
              </Text>
            </View>
          </View>
        </View>
        <View style={{ top: SCREEN_WIDTH * 0.08 }}>
          <View>
            <Text style={[Estilos.textoTitulo, { marginLeft: SCREEN_WIDTH * 0.05 }]}>¿Dudas o preguntas?</Text>
          </View>
          <View style={{ alignItems: 'center', marginVertical: SCREEN_WIDTH * 0.05 }}>
            <BotonSimple
              texto="600 600 9292"
              colorTexto="#FFFFFF"
              onPress={() => {
                return Linking.openURL(`tel:${'6006009292'}`)
              }}
              color={iconColor}
              width={SCREEN_WIDTH * 0.8}
            />
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default OficinaDeAtencionClientes
