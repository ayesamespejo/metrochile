import React, { useState, useEffect } from 'react'
import { Dimensions, Platform, View, Text, StyleSheet } from 'react-native'
import { Switch } from 'react-native-gesture-handler'
import { ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Estilos from './Estilos'

import Metro from './assets/svg/cultura_comunidad/EstacionAgendaCultural.svg'
import Linea1 from './assets/svg/lineas/Linea1.svg'
import Linea2 from './assets/svg/lineas/Linea2.svg'
import Linea3 from './assets/svg/lineas/Linea3.svg'
import Linea4 from './assets/svg/lineas/Linea4.svg'
import Linea4a from './assets/svg/lineas/Linea4A.svg'
import Linea5 from './assets/svg/lineas/Linea5.svg'
import Linea6 from './assets/svg/lineas/Linea6.svg'

import Globals from './Globals'
import BotonSimple from './components/BotonSimple'
const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  contenedorGeneral: {
    width: SCREEN_WIDTH * 0.9,
    marginTop: SCREEN_WIDTH * 0.08,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
    padding: SCREEN_WIDTH * 0.05,
  },
  filaLinea: {
    marginTop: SCREEN_WIDTH * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoLinea: [Estilos.textoGeneral, { marginLeft: SCREEN_WIDTH * 0.03 }],
  contenedorBoton: {
    marginTop: SCREEN_WIDTH * 0.08,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const urlConfiguracion = 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/configuracion'

const Configuracion = (props) => {
  const [token, setToken] = useState('')
  const [todaRed, setTodaRed] = useState(false)
  const [linea1, setLinea1] = useState(false)
  const [linea2, setLinea2] = useState(false)
  const [linea3, setLinea3] = useState(false)
  const [linea4, setLinea4] = useState(false)
  const [linea4a, setLinea4a] = useState(false)
  const [linea5, setLinea5] = useState(false)
  const [linea6, setLinea6] = useState(false)
const [config, setConfig] = useState({});
const [enviando, setEnviando] = useState(false);


  useEffect(() => {
    getToken()
    getConfig()
  }, [])

  useEffect(() => {
    if (todaRed) {
      setLinea1(todaRed)
      setLinea2(todaRed)
      setLinea3(todaRed)
      setLinea4(todaRed)
      setLinea4a(todaRed)
      setLinea5(todaRed)
      setLinea6(todaRed)
    }
  }, [todaRed])

  useEffect(() => {
    // Este componente no realiza acciones debido a que la API definitiva no se ha entregado
    setTodaRed(linea1 && linea2 && linea3 && linea4 && linea4a && linea5 && linea6)
  }, [linea1, linea2, linea3, linea4, linea4a, linea5, linea6])

  let getToken = async () => {
    try {
      const value = await AsyncStorage.getItem(Globals.KEY_TOKEN)
      setToken(value)
    } catch (e) {}
  }

  const enviarConfiguracion = () => {
    setEnviando(true)
    const configuracionJSON = {
      token,
      sistemaOperativo: Platform.OS == 'ios' ? 'ios' : 'andorid',
      todaRed: todaRed,
      l1: linea1,
      l2: linea2,
      l3: linea3,
      l4: linea4,
      l4a: linea4a,
      l5: linea5,
      l6: linea6,
    }
    AsyncStorage.setItem(Globals.KEY_CONFIG_NOTIFICACIONES,JSON.stringify(configuracionJSON)).then(() => {
      console.log(JSON.stringify(configuracionJSON))
    })
    fetch(Globals.KEY_URL_CONFIGURACION, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configuracionJSON),
    }).then((response) => {
      console.log(JSON.stringify(response))
      setEnviando(false)
      props.navigation.goBack(null)
    })
  }

  let getConfig = () => {
    AsyncStorage.getItem(Globals.KEY_CONFIG_NOTIFICACIONES).then((value) => {
      configJSON = JSON.parse(value)
      setConfig(configJSON)
      console.log('config: ',value)
      setTodaRed(configJSON.todaRed)
      setLinea1(configJSON.l1)
      setLinea2(configJSON.l2)
      setLinea3(configJSON.l3)
      setLinea4(configJSON.l4)
      setLinea4a(configJSON.l4a)
      setLinea5(configJSON.l5)
      setLinea6(configJSON.l6)
    })
  }

  return (
    <ScrollView>
      <View style={styles.contenedorGeneral}>
        <Text style={Estilos.textoSubtitulo}>Notificaciones por Línea</Text>
        <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>
          Selecciona las Líneas para recibir notificaciones sobre ellas
        </Text>
        <View style={{ padding: SCREEN_WIDTH * 0.03 }}>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Metro width={32} height={32} />
              <Text style={styles.textoLinea}>Toda la Red</Text>
            </View>
            <Switch
              style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => {
                setTodaRed(!todaRed)
              }}
              value={todaRed}
            />
          </View>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Linea1 width={32} height={32} />
              <Text style={styles.textoLinea}>Línea 1</Text>
            </View>
            <Switch
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => setLinea1(!linea1)}
              value={linea1}
            />
          </View>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Linea2 width={32} height={32} />
              <Text style={styles.textoLinea}>Línea 2</Text>
            </View>
            <Switch
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => setLinea2(!linea2)}
              value={linea2}
            />
          </View>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Linea3 width={32} height={32} />
              <Text style={styles.textoLinea}>Línea 3</Text>
            </View>
            <Switch
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => setLinea3(!linea3)}
              value={linea3}
            />
          </View>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Linea4 width={32} height={32} />
              <Text style={styles.textoLinea}>Línea 4</Text>
            </View>
            <Switch
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => setLinea4(!linea4)}
              value={linea4}
            />
          </View>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Linea4a width={32} height={32} />
              <Text style={styles.textoLinea}>Línea 4A</Text>
            </View>
            <Switch
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => setLinea4a(!linea4a)}
              value={linea4a}
            />
          </View>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Linea5 width={32} height={32} />
              <Text style={styles.textoLinea}>Línea 5</Text>
            </View>
            <Switch
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => setLinea5(!linea5)}
              value={linea5}
            />
          </View>
          <View style={styles.filaLinea}>
            <View style={styles.linea}>
              <Linea6 width={32} height={32} />
              <Text style={styles.textoLinea}>Línea 6</Text>
            </View>
            <Switch
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              trackColor={{ false: Globals.COLOR.GRIS_3, true: Globals.COLOR.TURQUESA_QR }}
              thumbColor={todaRed ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={Globals.COLOR.GRIS_3}
              onValueChange={() => setLinea6(!linea6)}
              value={linea6}
            />
          </View>
        </View>
        {(todaRed != config.todaRed || 
          linea1 != config.l1 || 
          linea2 != config.l2 || 
          linea3 != config.l3 || 
          linea4 != config.l4 || 
          linea4a != config.l4a || 
          linea5 != config.l5 || 
          linea6 != config.l6 ) 
          && <View style={styles.contenedorBoton}>
          <BotonSimple
            texto="Guardar"
            colorTexto="#FFFFFF"
            onPress={() => {
              enviarConfiguracion()
              
            }}
            color={Globals.COLOR.TURQUESA_QR}
            width={SCREEN_WIDTH * 0.54}
            actuando={enviando}
          />
        </View>}
      </View>
    </ScrollView>
  )
}

export default Configuracion
