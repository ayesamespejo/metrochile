import React, { useState, useEffect, Fragment } from 'react'
import {
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native'
import Estilos from './Estilos'
import Globals from './Globals'
import AddPlus from './assets/svg/comun/AddPlus.svg'

const ResultadoRecarga = (props) => {
  /// static bips = [];

  var codigobipInicial = props.route.params.data
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH = Dimensions.get('window').width

  const styles = StyleSheet.create({
    tarjetaTitulo: {
      marginHorizontal: SCREEN_WIDTH * 0.05,
      marginTop: SCREEN_WIDTH * 0.08,
      backgroundColor: Globals.COLOR.GRIS_1,
      borderRadius: 20,
      padding: SCREEN_WIDTH * 0.05,
    },
    tarjeta: {
      margin: SCREEN_WIDTH * 0.05,
      backgroundColor: Globals.COLOR.GRIS_1,
      borderRadius: 20,
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      paddingBottom: SCREEN_WIDTH * 0.05,
    },
  })

  const [state, setState] = useState({
    contador: '',
    mas: true,
    // numeroBip2: '',
    registro: [],
    loading: false,
    numeroBip: '',
    bips: [],
    vermas: false,
    pagina: 1,
    resActual: { contador: 0, pagina: 0, inicio: 0 },
    // urlVoucher: `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/voucher/paginacion?page=1&numero=${codigobipInicial}`,
    urlVoucher: `https://s7ibm5ar0f.execute-api.us-east-1.amazonaws.com/UAT/voucherglue/paginacion?page=1&numero=${codigobipInicial}`,
  })

  const getRegistro = (url) => {
    setState({ ...state, loading: true })
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.resultados)
        setState({
          ...state,
          page: res.pagina,
          contador: res.contador,
          data2: res,
          data: res,
          registro: res.resultados,
          loading: false,
          resActual: res,
        })
      })
  }

  useEffect(() => {
    props.navigation.setOptions({ title: 'Comprobantes de carga' })
    getRegistro(state.urlVoucher)
  }, [])

  useEffect(() => {
    const codigobip = props.route.params.data
    // const nuevaUrl = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/voucher/paginacion?page=${state.pagina}&numero=${codigobip}`
    const nuevaUrl = `https://s7ibm5ar0f.execute-api.us-east-1.amazonaws.com/UAT/voucherglue/paginacion?page=${state.pagina}&numero=${codigobip}`
    setState({ ...state, urlVoucher: nuevaUrl })
    getRegistro(nuevaUrl)
  }, [state.pagina])

  const handlePressSuma = () => {
    const nuevaPagina = state.pagina + 1
    setState({ ...state, pagina: nuevaPagina })
  }

  const handlePressResta = () => {
    setState({ ...state, mas: true })
    const nuevaPagina = state.pagina - 1
    setState({ ...state, pagina: nuevaPagina })
  }

  const verificacion = (item) => {
    var valor = item
    if (valor % 10 === 0 || valor == state.contador) {
      return (
        <View style={{ alignItems: 'center', marginVertical: SCREEN_WIDTH * 0.03 }}>
          <View
            style={{
              backgroundColor: Globals.COLOR.GRIS_3,
              width: SCREEN_WIDTH * 0.8,
              height: 1,
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={{ alignItems: 'center', marginVertical: SCREEN_WIDTH * 0.03 }}>
          <View
            style={{
              backgroundColor: Globals.COLOR.GRIS_3,
              width: SCREEN_WIDTH * 0.8,
              height: 1,
            }}
          />
        </View>
      )
    }
  }

  const error = () => {
    if (state.contador === 0 || state.contador == undefined || state.contador == null) {
      return (
        <>
          <Text
            style={[
              Estilos.tipografiaLight,
              Estilos.subtitulos,
              { color: '#43464E', flex: 1, textAlign: 'center', zIndex: 2 },
            ]}
          >
            Sin registros para esta tarjeta
          </Text>
        </>
      )
    }
  }

  const displayResultado = (codigobip, pagina) => {
    var codigobip = props.route.params.data

    return (
      <>
        {state.resActual.pagina == 1 && (
          <View style={styles.tarjetaTitulo}>
            <Text>
              <Text style={[Estilos.textoGeneral]}>Tarjeta bip! # </Text>
              <Text
                style={[Estilos.textoDestacado, { textAlign: 'left', marginLeft: SCREEN_WIDTH * 0.05, color: Globals.COLOR.AZUL_BIP }]}
              >
                {codigobip}
              </Text>
            </Text>
          </View>
        )}
        <View style={[styles.tarjeta, ]}>
          {state.resActual.pagina == 1 && (
            <Text style={[Estilos.textoTitulo, { marginTop: SCREEN_WIDTH * 0.08 }]}>
              Últimas cargas
            </Text>
          )}
          {state.resActual.pagina == 1 && (
            <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>
              Máquinas de carga bip! y boleterías
            </Text>
          )}
          <View
            style={{
              marginTop: SCREEN_WIDTH * 0.08,
              //marginBottom: -5,
            }}
          >
            <Pressable style={{ zIndex: 2 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginHorizontal: SCREEN_WIDTH * 0.05,
                  zIndex: 2,
                }}
              >
                {error(codigobip)}
              </View>

              {state.registro.map((item, i) => (
                <Fragment key={i}>
                  <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View style={{ flex: 8 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          //paddingLeft: SCREEN_WIDTH * 0.08,
                        }}
                      >
                        <Text style={[Estilos.textoNota]}>{item[3]}</Text>
                        <Text style={[Estilos.textoNota]}>{item[4]}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: SCREEN_WIDTH * 0.03,
                        }}
                      >
                        <Text
                          style={[
                            Estilos.textoGeneral,
                          ]}
                        >
                          {item[2]}
                        </Text>
                        <Text style={[Estilos.textoSubtitulo,]}>$ {item[6]}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                      <AddPlus
                        width={20}
                        height={20}
                        onPress={() =>
                          props.navigation.push('VoucherDigital', {
                            data: item[0],
                            data2: item[10],
                          })
                        }
                      />
                    </View>
                  </View>
                  {verificacion(item[18])}
                </Fragment>
              ))}
            </Pressable>

            {state.loading == false && (
              <View
                style={{
                  // backgroundColor: Globals.COLOR.GRIS_1,
                  width: '100%',
                  height: 8,
                  marginTop: -14,
                  marginBottom: 10,
                  borderRadius: 16,
                  zIndex: 1,
                }}
              />
            )}
          </View>

          {state.resActual.contador > 10 && (
            <View
              style={
                {
                  // backgroundColor: Globals.COLOR.GRIS_1,
                  // margin: '5%',
                  // backgroundColor: 'red'
                }
              }
            >
              <View
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: SCREEN_WIDTH * 0.05 }}
              >
                <Pressable
                  style={{
                    flex: 1,
                  }}
                  onPress={state.resActual.pagina > 1 ? handlePressResta : () => {}}
                >
                  {state.resActual.pagina > 1 && <Text style={Estilos.textoPaginacion}>{'<<'} atrás</Text>}
                </Pressable>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  {state.resActual.pagina > 1 && (
                    <Text style={[Estilos.textoPaginacion, { textAlign: 'right' }]}>{state.resActual.pagina}</Text>
                  )}
                </View>
                <Pressable
                  style={{
                    flex: 1,
                  }}
                  onPress={state.resActual.contador >= state.resActual.fin ? handlePressSuma : () => {}}
                >
                  {state.resActual.contador >= state.resActual.fin && (
                    <Text style={[Estilos.textoPaginacion, { textAlign: 'right' }]}>ver más {'>>'}</Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </>
    )
  }

  return (
    <SafeAreaView>
      <ScrollView style={{ margin: 2 }}>
        {state.loading && (
          <View style={{ marginTop: SCREEN_HEIGHT / 2.5 }}>
            <ActivityIndicator size="large" color="#43464E" />
          </View>
        )}
        {state.loading == false && displayResultado()}
        <View style={{ height: 10 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default ResultadoRecarga
