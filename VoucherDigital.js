import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, Dimensions, Image, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Estilos from './Estilos'
import Globals from './Globals'

const SLIDER_HEIGHT = Dimensions.get('window').height
const SLIDER_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  principal: {
    flex: 1,
    backgroundColor: 'white',
  },
  tarjeta: {
    borderRadius: 20,
    borderColor: Globals.COLOR.GRIS_3,
    width: SLIDER_WIDTH * 0.9,
    borderWidth: 2,
    alignItems: 'center',
    padding: SLIDER_WIDTH * 0.05,
  },
  contenedor: {
    width: SLIDER_WIDTH * 0.9,
    padding: SLIDER_WIDTH * 0.03,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  linea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SLIDER_WIDTH * 0.03,
  },
})

const VoucherDigital = (props) => {
  var itemid = props.route.params.data
  const [state, setState] = useState({
    loading: false,
    registro: [],
    titulos: [],
    // urlVoucher: `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/voucher/comprobante?id=${itemid}`,
    urlVoucher: `https://s7ibm5ar0f.execute-api.us-east-1.amazonaws.com/UAT/voucherglue/comprobante?id=${itemid}`
  })

  useEffect(() => {
    props.navigation.setOptions({ title: 'Comprobante de carga' })
    getRegistro()
  }, [])

  const getRegistro = () => {
    // console.log(state.urlVoucher)
    setState({ ...state, loading: true })
    fetch(state.urlVoucher)
      .then((res) => res.json())
      .then((res) => {
        setState({
          ...state,
          registro: res.registro,
          loading: false,
        })
      })
  }

  const { loading } = state
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
    <SafeAreaView style={[styles.principal, { flex: 1 }]}>
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://d37nosr7rj2kog.cloudfront.net/Logo+Metro.png' }}
            style={{ resizeMode: 'contain', height: 80, width: 180 }}
          />
        </View>
        <Text
          style={[
            Estilos.textoSubtitulo,
            {
              textAlign: 'center',
            },
          ]}
        >
          Metro de Santiago
        </Text>
        <View style={{ marginTop: SLIDER_WIDTH * 0.03, alignItems: 'center' }}>
          <FlatList
            data={state.registro}
            renderItem={({ item }) => (
                <View
                  style={styles.tarjeta}
                >
                  <Text style={[Estilos.textoTitulo]}>Monto cargado: ${item[6]}</Text>
                  <Text
                    style={[
                      Estilos.textoGeneral,
                      {
                        marginTop: SLIDER_WIDTH * 0.05,
                      },
                    ]}
                  >
                    Fecha: {item[3]} - Hora: {item[4]}
                  </Text>
                </View>
            )}
          />
        </View>
        <FlatList
          data={state.registro}
          renderItem={({ item }) => (
            <View
              style={styles.contenedor}
            >
              {item != '' && (
                <View
                  style={[styles.linea,
                    {marginTop: 0},
                  ]}
                >
                  <Text style={[Estilos.textoGeneral]}>Nro. tarjeta bip:</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[9]}</Text>
                </View>
              )}
              {item != '' && item[16] != '0' && item[16] != '' && (
                <View
                  style={styles.linea}
                >
                  <Text style={[Estilos.textoGeneral]}>Valor de tarjeta:</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[16]}</Text>
                </View>
              )}
              {item != '' && item[15] != '0' && item[15] != '' && (
                <View
                  style={[styles.linea]}
                >
                  <Text style={[Estilos.textoGeneral]}>Total a pagar:[{item[15]}]</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[15]}</Text>
                </View>
              )}
              {item != '' && item[9] != '0' && (
                <View
                style={[styles.linea]}
                >
                  <Text style={[Estilos.textoGeneral]}>Monto entregado:</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[7]}</Text>
                </View>
              )}
              {item != '' && item[11] != '0' && (
                <View
                style={[styles.linea]}
                >
                  <Text style={[Estilos.textoGeneral]}>Saldo anterior:</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[11]}</Text>
                </View>
              )}
              {item != '' && item[17] != '0' && (
                <View
                style={[styles.linea]}
                >
                  <Text style={[Estilos.textoGeneral]}>Vuelto:</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[17]}</Text>
                </View>
              )}
              <View
                  style={[styles.linea]}
              >
                <Text style={[Estilos.textoGeneral]}>Saldo tarjeta bip!:</Text>
                <Text style={[Estilos.textoSubtitulo]}>{item[12]}</Text>
              </View>
              <View
                  style={[styles.linea, {
                    marginTop: SLIDER_WIDTH * 0.08,
                  }]}
              >
                <Text style={[Estilos.textoGeneral]}>Tipo de operación:</Text>
                <Text style={[Estilos.textoSubtitulo]}>{item[10]}</Text>
              </View>
              {item != '' && item[1] != '0' && (
                <View
                style={[styles.linea]}
                >
                  <Text style={[Estilos.textoGeneral]}>Nro. vendedor:</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[1]}</Text>
                </View>
              )}
              <View
                  style={[styles.linea]}
              >
                <Text style={[Estilos.textoGeneral]}>Estación:</Text>
                <Text style={[Estilos.textoSubtitulo]}>{item[2]}</Text>
              </View>
              <View
                  style={[styles.linea]}
              >
                <Text style={[Estilos.textoGeneral]}>Nro. {item[14]}</Text>
                <Text style={[Estilos.textoSubtitulo]}>{item[8]}</Text>
              </View>
              {item != '' && (
                <View
                style={[styles.linea]}
                >
                  <Text style={[Estilos.textoGeneral]}>Servicio de venta:</Text>
                  <Text style={[Estilos.textoSubtitulo]}>{item[13]}</Text>
                </View>
              )}
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default VoucherDigital
