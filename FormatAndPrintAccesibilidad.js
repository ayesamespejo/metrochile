import React, { useState } from 'react'
import { Dimensions, View, Text, Pressable, ActivityIndicator, Modal, StyleSheet } from 'react-native'
import Estilos from './Estilos'
import Globals from './Globals'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'

import CerrarCirculo from './assets/svg/comun/CerrarCirculo.svg'
import CheckCirculo from './assets/svg/estados/Bueno.svg'
import Accesibilidad from './assets/svg/comun/Accesibilidad.svg'
import { ScrollView } from 'react-native-gesture-handler'

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: SCREEN_WIDTH * 0.05,
  },
})

const FormatAndPrintAccebilidad = ({ codEstacion, nombreEstacion, linea }) => {
  const [state, setState] = useState({
    visible: false,
  })
  const [listaAccesibilidad, setListaAccesibilidad] = useState([])
  const [cargando, setCargando] = useState(false)
  return (
    <View>
      <Pressable
        onPress={(e) => {
          // console.log('Mostrando accesibilidad...')
          if (!state.visible) {
            setCargando(true)
            fetch(`https://l2lpxcjjw5.execute-api.us-east-1.amazonaws.com/UAT/ascensores/${codEstacion}`)
              .then((res) => res.json())
              .then((res) => {
                //let auxAscensores = res.Item.ascensores.map(item => item[0]);
                // console.log(JSON.stringify(res.Items))
                setListaAccesibilidad(res.Items.sort((a, b) => a.Orden_Ascensor > b.Orden_Ascensor))
                setState({ ...state, visible: !state.visible })
                setCargando(false)
              })
          } else {
            setListaAccesibilidad([])
            setState({ ...state, visible: !state.visible })
          }
        }}
      >
        {cargando && (
          <View
            style={{ backgroundColor: '#3F51B5', width: 32, height: 32, borderRadius: 17, justifyContent: 'center' }}
          >
            <ActivityIndicator size="medium" color="#FFFFFF" />
          </View>
        )}
        {!cargando && <Accesibilidad width={32} height={32} fill={'#3F51B5'} />}
      </Pressable>

      <Modal
        animationType="none"
        transparent={true}
        visible={state.visible}
        // onRequestClose={() => {
        //   Alert.alert('Modal has been closed.')
        // }}
        backgroundColor={'red'}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <View style={{ alignItems: 'flex-end'}}>
                <Pressable
                  style={{}}
                  onPress={() => {
                    setState({ ...state, visible: false })
                  }}
                >
                  <CerrarCirculo width={20} height={20} fill={Globals.COLOR.GRIS_3} />
                </Pressable>
              </View>
              <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
                <View style={{ flex: 1, alignContent: 'center' }}>
                  {linea && <TituloCirculoEstacion texto={nombreEstacion} linea={linea.substring(1)} />}
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  marginHorizontal: SCREEN_WIDTH * 0.05,
                  marginTop: SCREEN_WIDTH * 0.03,
                }}
              >
                <View>
                  {listaAccesibilidad.map((acceso) => (
                    <View key={acceso.Id_Ascensor} style={{ flexDirection: 'row', marginTop: SCREEN_WIDTH * 0.03 }}>
                      {acceso.Estado != 'Disponible' && (
                        <CerrarCirculo width={20} height={20} fill={Globals.COLOR.ROJO_METRO} />
                      )}
                      {acceso.Estado == 'Disponible' && <CheckCirculo width={20} height={20} fill={Globals.COLOR.L5} />}
                      <View style={{ marginLeft: SCREEN_WIDTH * 0.03, flex: 1 }}>
                        {acceso.Tipo_Ascensor && <Text style={[Estilos.textoSubtitulo]}>{acceso.Tipo_Ascensor}</Text>}
                        <Text style={[Estilos.textoGeneral, { textAlign: 'justify' }]}>{acceso.Ubicacion}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default FormatAndPrintAccebilidad
