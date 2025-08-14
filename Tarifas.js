import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Estilos from './Estilos'
import Globals from './Globals'

import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
import TarjetaBipAdulto from './assets/svg/tarjetas/TarjetaBipAdulto.svg'
import TarjetaTam from './assets/svg/tarjetas/TarjetaTam.svg'
import TarjetaTne from './assets/svg/tarjetas/TarjetaTne.svg'
import TarjetaBip from './assets/svg/tarjetas/TarjetaBip.svg'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: WIDTH * 0.05,
    paddingTop: WIDTH * 0.08,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  combo: {
    marginTop: WIDTH * 0.03,
    backgroundColor: Globals.COLOR.GRIS_1,
    padding: WIDTH * 0.05,
    borderRadius: 20,
  },
  textoCombo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separador: { marginTop: WIDTH * 0.05, height: 1, backgroundColor: Globals.COLOR.GRIS_3 },
  contenedorHorario: {
    marginTop: WIDTH * 0.05,
    padding: WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
  },
  separadorTarifa: {
    borderBottomWidth: 1,
    marginHorizontal: 0,
    borderBottomColor: Globals.COLOR.GRIS_3,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: WIDTH * 0.03,
    marginBottom: WIDTH * 0.03,
  },
  contenedorMasInformacion: {
    marginTop: WIDTH * 0.03,
  },
  tarjeta: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
    padding: WIDTH * 0.05,
    marginBottom: WIDTH * 0.05,
    width: WIDTH * 0.9,
    marginHorizontal: WIDTH * 0.05,
  },
  contenedorTextoConEnlace: {
    flexDirection: 'row',
    marginTop: WIDTH * 0.03,
    alignItems: 'flex-end',
  },
  enlace: [
    Estilos.textoGeneral,
    {
      color: Globals.COLOR.ENLACE,
      textDecorationLine: 'underline',
    },
  ],
  tarjetaBip: {
    width: 55,
    height: 35,
    borderRadius: 4,
    marginEnd: 10,
  },
})

const Item = ({ title, value, tarifaActual }) => (
  <View style={styles.item}>
    <Text style={[Estilos.textoGeneral]}>{title}</Text>
    <Text style={[Estilos.textoTitulo, { color: Globals.COLOR[tarifaActual.toLowerCase()] }]}>{value}</Text>
  </View>
)

const Tarifas = (props) => {
  /**
   * Se setea el Estado del Componente.
   */
  const [mostrarCombo, setMostrarCombo] = useState(false)
  const [tarifaActual, setTarifaActual] = useState('Punta')
  const [dataTarifaActual, setDataTarifaActual] = useState(null)
  const [dataHorarioValle, setDataHorarioValle] = useState(null)
  const [dataHorarioPunta, setDataHorarioPunta] = useState(null)
  const [dataHorarioBajo, setDataHorarioBajo] = useState(null)
  const [loading, setLoading] = useState(true)
  const urlBajo = 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/tarifario/HorarioBajo'
  const urlPunta = 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/tarifario/HorarioPunta'
  const urlValle = 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/tarifario/HorarioValle'

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    setLoading(true)
    Promise.all([fetch(urlBajo), fetch(urlPunta), fetch(urlValle)])
    
      .then(([responseHorarioBajo, responseHorarioPunta, responseHorarioValle]) =>
        Promise.all([responseHorarioBajo.json(), responseHorarioPunta.json(), responseHorarioValle.json()]),
      )
      .then(([dataHorarioBajo, dataHorarioPunta, dataHorarioValle]) => {

        console.log('pruebaaaa');
        //Reubicacion del elemento de Tarifa en cada Data de Horario
        dataHorarioValle.Item.tarifa = dataHorarioValle.Item.tarifa.map((item) => Object.entries(item)[0])
        dataHorarioBajo.Item.tarifa = dataHorarioBajo.Item.tarifa.map((item) => Object.entries(item)[0])
        dataHorarioPunta.Item.tarifa = dataHorarioPunta.Item.tarifa.map((item) => Object.entries(item)[0])
        //Reubicacion del elemento de Tarjeta Bip  en cada Data de Horario
        dataHorarioValle.Item['tarjeta bip'] = dataHorarioValle.Item['tarjeta bip'].map(
          (item) => Object.entries(item)[0],
        )
        dataHorarioBajo.Item['tarjeta bip'] = dataHorarioBajo.Item['tarjeta bip'].map((item) => Object.entries(item)[0])
        dataHorarioPunta.Item['tarjeta bip'] = dataHorarioPunta.Item['tarjeta bip'].map(
          (item) => Object.entries(item)[0],
        )
        setDataHorarioBajo(dataHorarioBajo)
        setDataHorarioValle(dataHorarioValle)
        setDataHorarioPunta(dataHorarioPunta)
        setDataTarifaActual(dataHorarioPunta)
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView>
        <ScrollView>
          {/* Seccion del Selector de Horario*/}
          <View style={[styles.container]}>
            <Text style={Estilos.textoSubtitulo}>Horario</Text>
            <View style={styles.combo}>
              <Pressable style={styles.textoCombo} onPress={() => setMostrarCombo(!mostrarCombo)}>
                <Text
                  style={[Estilos.textoSubtitulo, { color: Globals.COLOR[tarifaActual.toLowerCase()] }]}
                >{`Horario ${tarifaActual}`}</Text>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: mostrarCombo ? '180deg' : '0deg' }] }}
                />
              </Pressable>
              {mostrarCombo && (
                <View>
                  <View style={styles.separador} />
                  <Pressable
                    style={{ marginTop: WIDTH * 0.05 }}
                    onPress={() => {
                      setMostrarCombo(!mostrarCombo)
                      setDataTarifaActual(dataHorarioPunta)
                      setTarifaActual('Punta')
                    }}
                  >
                    <Text style={[Estilos.textoSubtitulo, { color: Globals.COLOR.punta }]}>Horario Punta</Text>
                  </Pressable>
                  <Pressable
                    style={{ marginTop: WIDTH * 0.05 }}
                    onPress={() => {
                      setMostrarCombo(!mostrarCombo)
                      setDataTarifaActual(dataHorarioValle)
                      setTarifaActual('Valle')
                    }}
                  >
                    <Text style={[Estilos.textoSubtitulo, { color: Globals.COLOR.valle }]}>Horario Valle</Text>
                  </Pressable>
                  <Pressable
                    style={{ marginTop: WIDTH * 0.05 }}
                    onPress={() => {
                      setMostrarCombo(!mostrarCombo)
                      setDataTarifaActual(dataHorarioBajo)
                      setTarifaActual('Bajo')
                    }}
                  >
                    <Text style={[Estilos.textoSubtitulo, { color: Globals.COLOR.bajo }]}>Horario Bajo</Text>
                  </Pressable>
                </View>
              )}
            </View>
            {dataTarifaActual && !mostrarCombo && (
              <View style={styles.contenedorHorario}>
                {dataTarifaActual.Item.horario_tarifa.map((item, index) => (
                  <Text
                    key={`k_item_horario_tarifa_${item}`}
                    style={[Estilos.textoGeneral, { marginTop: index == 0 ? 0 : WIDTH * 0.03 }]}
                  >
                    {item}
                  </Text>
                ))}
              </View>
            )}
          </View>
          {/* Seccion de la Informacion dinamica de las Tarifas*/}
          {dataTarifaActual && (
            <View style={[styles.container, { paddingTop: WIDTH * 0.08 }]}>
              <Text style={[Estilos.textoTitulo]}>Tarifas</Text>
              {dataTarifaActual.Item.tarifa.map((item) => (
                <View key={`k_item_tarifa_${item}`} style={{ marginHorizontal: WIDTH * 0.03 }}>
                  <Item title={item[0]} value={item[1]} tarifaActual={tarifaActual} />
                  <View style={styles.separadorTarifa} />
                </View>
              ))}
              <Text style={[Estilos.textoNota, { marginTop: WIDTH * 0.03, marginLeft: WIDTH * 0.03 }]}>
                {dataTarifaActual.Item.comentario}
              </Text>
            </View>
          )}
          {/* Seccion de la Informacion dinamica de las Tajetas Bip!*/}
          {dataTarifaActual && (
            <View style={[styles.container, { paddingTop: WIDTH * 0.08 }]}>
              <Text style={[Estilos.textoTitulo]}>Tarjeta bip!</Text>
              {dataTarifaActual.Item['tarjeta bip'].map((item) => (
                <View key={`k_item_tarjeta_bip_${item}`} style={{ marginHorizontal: WIDTH * 0.03 }}>
                  <Item title={item[0]} value={item[1]} tarifaActual={tarifaActual} />
                  <View style={styles.separadorTarifa} />
                </View>
              ))}
            </View>
          )}
          {/* Seccion de las Tarjetas */}
          <View style={[styles.contenedorMasInformacion]}>
            <Text style={[Estilos.textoTitulo, { marginTop: WIDTH * 0.08, marginBottom: WIDTH * 0.05, marginLeft: WIDTH * 0.05 }]}>Más información</Text>
            <View style={[styles.tarjeta]}>
              <TarjetaTam width={65} height={40} />
              <View style={{ marginLeft: WIDTH * 0.03 }}>
                <Text style={[Estilos.textoSubtitulo]}>Tarjeta Adulto Mayor</Text>
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
              <TarjetaBipAdulto width={65} height={40} />
              <View style={{ marginLeft: WIDTH * 0.03 }}>
                <Text style={[Estilos.textoSubtitulo]}>Tarjeta bip! Adulto Mayor</Text>
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
            <View style={[styles.tarjeta]}>
              <TarjetaTne width={65} height={40} />
              <View style={{ marginLeft: WIDTH * 0.03 }}>
                <Text style={[Estilos.textoSubtitulo]}>Tarjeta Nacional Estudiantil</Text>
                <View style={[styles.contenedorTextoConEnlace]}>
                  <Text style={[Estilos.textoGeneral]}>Para más info presiona </Text>
                  <Text
                    style={[styles.enlace]}
                    onPress={() => {
                      Linking.openURL('https://www.junaeb.cl/tarjeta-tne/')
                    }}
                  >
                    aquí
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.tarjeta]}>
              <TarjetaBip width={65} height={40} />
              <View style={{ marginLeft: WIDTH * 0.03 }}>
                <Text style={[Estilos.textoSubtitulo]}>Tarjeta bip!</Text>
                <View style={[styles.contenedorTextoConEnlace]}>
                  <Text style={[Estilos.textoGeneral]}>Para más info presiona </Text>
                  <Text
                    style={[styles.enlace]}
                    onPress={() => {
                      Linking.openURL('https://www.tarjetabip.cl')
                    }}
                  >
                    aquí
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Tarifas
