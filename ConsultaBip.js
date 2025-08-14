import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, Dimensions, Pressable, Image, View, StyleSheet, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Estilos from './Estilos'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CeldaFavoritosBip from './CeldaFavoritosBip'
import TextInputBorrar from './components/TextInputBorrar'
import Globals from './Globals'
import BotonSimple from './components/BotonSimple'

import CargarbipCirculo from './assets/svg/consulta_carga/CargarbipCirculo.svg'
import ComprobanteCirculo from './assets/svg/consulta_carga/ComprobanteCirculo.svg'
import TarifasHome from './assets/svg/home/Tarifas-Home.svg'
import FavoritosCirculo from './assets/svg/consulta_carga/FavoritosCirculo.svg'
import CerrarCirculo from './assets/svg/comun/CerrarCirculo.svg'

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    marginTop: SCREEN_WIDTH * 0.03,
  },
  button: {
    marginTop: SCREEN_WIDTH * 0.05,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.9,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
    padding: SCREEN_WIDTH * 0.05,
    paddingBottom: SCREEN_WIDTH * 0.05,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
  },
  notaBoton: [Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }],
  buttonFavorito: {
    width: SCREEN_WIDTH * 0.9,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingBottom: SCREEN_WIDTH * 0.05,
  },
  buttonshowTheThing1: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.05,
    paddingBottom: SCREEN_WIDTH * 0.05,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
  },
})

const ConsultaBip = (props) => {
  const [isResultado, setIsResultado] = useState(false)
  const [numeroBip, setNumeroBip] = useState('')
  const [numeroBip2, setNumeroBip2] = useState('')
  const [bips, setBips] = useState([])
  const [productoCliente, setProductoCliente] = useState(9)
  const [errorTarjeta, setErrorTarjeta] = useState(false)
  const [consultandoSaldo, setConsultandoSaldo] = useState(false)
  const [consultandoComprobantes, setConsultandoComprobantes] = useState(false)
  const [consultandoFavoritos, setConsultandoFavoritos] = useState(false)

  const [loadingTarjetaIndice, setloadingTarjetaIndice] = useState(-1)
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [mostrarConsulta, setMostrarConsulta] = useState(false)
  const [mostrarComprobante, setMostrarComprobante] = useState(false)

  useEffect(() => {
    props.navigation.setOptions({ title: 'Consulta y carga bip!' })
    const _unsubscribe = props.navigation.addListener('focus', () => {
      setConsultandoComprobantes(false)
      setConsultandoSaldo(false)
      setConsultandoFavoritos(false)
      setNumeroBip('')
      setNumeroBip2('')
      getData().then((e) => {
        if (e) {
          for (var i in e) {
            e[i].loaded = false
          }
          setBips(e)
        }
      })
      getEstrellaFavorita().then((e) => {})
    })
    return () => {
      _unsubscribe()
    }
  }, [])

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@bip_config_', jsonValue)
    } catch (e) {
      console.log('Error getEstrellaFavorita:', e)
    }
  }

  //Actualiza los datos despues de un loading true
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@bip_config_')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.log('Error getData: ', e)
    }
  }

  const getEstrellaFavorita = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@Fav_')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.log('falle en el busqueda')
      console.log('Error getEstrellaFavorita:', e)
    }
  }

  function currencyFormat(num) {
    const numero = Number(num)
    return '$ ' + numero.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  const getDatos = (bipNumber, productoCliente, funcPar, mostrarError = false) => {
    // Se obtienen los arámetros de consulta bip
    AsyncStorage.getItem('@consultaSaldoBip').then((datosTexto) => {
      const datos = JSON.parse(datosTexto)
      fetch(datos.url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': datos.xApiKey,
        },
        body: JSON.stringify({
          numero: bipNumber,
          comercio: datos.comercio,
          producto_cliente: productoCliente,
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.estado) {
            const resultado = {
              tarjeta: numeroBip,
              saldo: currencyFormat(responseData.saldo_disponible),
              productoCliente: productoCliente,
              fecha: '12/12/2012',
              obj: {
                'n&ordm;_tarjeta_bip!': bipNumber,
                estado_de_contrato: 'Contrato Activo',
                saldo_tarjeta: currencyFormat(responseData.saldo_disponible),
                fecha_saldo: '12/12/2012',
              },
            }
            funcPar(resultado)
          } else {
            setNumeroBip('')
            setConsultando(false)
            setErrorTarjeta(true)
            // Alert.alert('Error al obtener el saldo consultado')
          }
        })
        .catch((error) => {
          if (mostrarError) setConsultandoSaldo(false)
          Alert.alert(`Tu consulta no se pudo${'\n'}llevar a cabo`, 'Por favor, intenta nuevamente.', [
            { text: 'Aceptar' },
          ])
        })
    })
  }

  const onChangeTarjeta = (texto) => {
    setErrorTarjeta(false)
    const textoLimpio =
      productoCliente === 8 ? texto.toUpperCase().replace(/[^0-9K]/g, '') : texto.toUpperCase().replace(/[^0-9]/g, '')
    setNumeroBip(textoLimpio)
  }

  return ( 
   <SafeAreaView style={[styles.contenedor]}>
      <ScrollView>
        {/* Boton Consulta Saldo */}
        <Pressable
          style={[
            styles.button,
            mostrarConsulta
              ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: SCREEN_WIDTH * 0.03 }
              : {},
          ]}
          onPress={() => {
            const mostrar = !mostrarConsulta
            setMostrarAyuda(false)
            setMostrarConsulta(mostrar)
            setMostrarComprobante(false)
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <TarifasHome width={32} height={32} fill={Globals.COLOR.AZUL_BIP} />
          </View>
          <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
            <Text style={[Estilos.textoSubtitulo]}>Consulta de saldo</Text>
            <Text style={[styles.notaBoton]}>Consulta el saldo tarjeta bip! y bip!QR</Text>
          </View>
        </Pressable>
        {mostrarConsulta && (
          <View>
            <View style={styles.buttonshowTheThing1}>
              <View
                style={{
                  backgroundColor: Globals.COLOR.GRIS_3,
                  width: SCREEN_WIDTH * 0.8,
                  height: 1,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 8,
                  height: 45,
                  // padding: 4,
                  backgroundColor: Globals.COLOR.GRIS_2,
                  marginTop: SCREEN_WIDTH * 0.03,
                  borderRadius: 20,
                  alignItems: 'center',
                  alignContent: 'center',
                }}
              >
                <Pressable
                  onPress={() => {
                    setNumeroBip('')
                    setConsultandoSaldo(false)
                    setErrorTarjeta(false)
                    setProductoCliente(9)
                    setMostrarAyuda(false)
                  }}
                  style={{
                    backgroundColor: productoCliente === 9 ? Globals.COLOR.AZUL_BIP : Globals.COLOR.GRIS_2,
                    width: 100,
                    height: 26,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        padding: 3,
                        color: productoCliente === 9 ? '#FFFFFF' : '#000000',
                      },
                      productoCliente === 9 ? Estilos.textoSubtitulo : Estilos.textoGeneral,
                    ]}
                  >
                    Tarjeta bip!
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setNumeroBip('')
                    setConsultandoSaldo(false)
                    setErrorTarjeta(false)
                    setProductoCliente(8)
                    setMostrarAyuda(false)
                  }}
                  style={{
                    backgroundColor: productoCliente === 9 ? Globals.COLOR.GRIS_2 : Globals.COLOR.AZUL_BIP,
                    width: 100,
                    height: 26,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={[
                      {
                        fontSize: 16,
                        textAlign: 'center',
                        padding: 3,
                        color: productoCliente === 9 ? '#000000' : '#FFFFFF',
                      },
                      productoCliente === 8 ? Estilos.textoSubtitulo : Estilos.textoGeneral,
                    ]}
                  >
                    Rut bip!QR
                  </Text>
                </Pressable>
              </View>
              <TextInputBorrar
                keyboardType={productoCliente === 9 ? 'number-pad' : 'default'}
                // placeholderTextColor="#666"
                backgroundColor="#FFFFFF"
                borderColor={errorTarjeta ? Globals.COLOR.ROJO_METRO : Globals.COLOR.GRIS_3}
                borderWidth={errorTarjeta ? 3 : 2}
                maxLength={50}
                autoCorrect={false}
                placeholder={productoCliente === 9 ? 'Ingresa el nro. de tu tarjeta bip!' : 'Ingresa tu Rut bip!QR'}
                value={numeroBip}
                onChangeText={(texto) => onChangeTarjeta(texto)}
                width={SCREEN_WIDTH * 0.81}
                fontSize={16}
                marginTop={SCREEN_WIDTH * 0.03}
              />
              {errorTarjeta && (
                <Text
                  style={[Estilos.textoSubtitulo, { marginTop: SCREEN_WIDTH * 0.03, color: Globals.COLOR.ROJO_METRO }]}
                >
                  {productoCliente === 9 ? 'Ingresa un nro. de tarjeta bip! válido' : 'Ingresa un Rut bip!QR válido'}
                </Text>
              )}
              {productoCliente === 9 && !mostrarAyuda && (
                <Text
                  style={[Estilos.textoNota, { marginTop: SCREEN_WIDTH * 0.03, color: Globals.COLOR.GRIS_4 }]}
                  onPress={() => setMostrarAyuda(!mostrarAyuda)}
                >
                  ¿Dónde está el número de mi tarjeta bip!?
                </Text>
              )}
              {mostrarAyuda && (
                <Pressable
                  style={{ width: SCREEN_WIDTH * 0.8 }}
                  onPress={() => {
                    setMostrarAyuda(false)
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: SCREEN_WIDTH * 0.03,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Text style={[Estilos.textoNota, { color: Globals.COLOR.GRIS_4 }]}>cerrar </Text>
                    <CerrarCirculo width={20} height={20} fill={Globals.COLOR.GRIS_3} />
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={require('./assets/imagenes/tarjetas/numero_bip.png')}
                      style={{
                        width: 280,
                        height: 200,
                        resizeMode: 'contain',
                        backgroundColor: Globals.COLOR.GRIS_1,
                      }}
                    />
                  </View>
                </Pressable>
              )}
              <View style={{ marginTop: SCREEN_WIDTH * 0.05 }}>
                <BotonSimple
                  texto="Consultar"
                  colorTexto="#FFFFFF"
                  actuando={consultandoSaldo}
                  onPress={() => {
                    if (numeroBip.length > 5 && !consultandoSaldo) {
                      setConsultandoSaldo(true)
                      getDatos(
                        numeroBip,
                        productoCliente,
                        (result) => {
                          if (result) {
                            const numeroImagen = Math.trunc(Math.random() * 4) + 1
                            props.navigation.push(
                              'ResultadoConsultaBip',
                              { ...result, numeroImagen: numeroImagen },
                              {
                                bips1: bips,
                              },
                            )
                            setConsultandoSaldo(false)
                            return
                          }
                          Alert.alert(
                            'Saldo bip!',
                            'Error al obtener el saldo de tu tarjeta bip!',
                            [
                              {
                                text: 'Aceptar',
                                onPress: () => {
                                  setConsultandoSaldo(false)
                                },
                              },
                            ],
                            { cancelable: false },
                          )
                        },
                        true,
                      )
                    }
                    if (isResultado) {
                      setConsultandoSaldo(false)
                      setIsResultado(false)
                    }
                  }}
                  color={Globals.COLOR.AZUL_BIP}
                  width={SCREEN_WIDTH * 0.54}
                />
              </View>
            </View>
          </View>
        )}
        {/*Boton Recargas Bip*/}
        <Pressable
          style={[styles.button]}
          // Se nuestra como funcionalidad nueva
          onPress={() => props.navigation.push('CargaBipJJ')}
        >
          <View style={{ alignItems: 'center' }}>
            <CargarbipCirculo width={32} height={32} fill={Globals.COLOR.AZUL_BIP} />
          </View>
          <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
            <Text style={[Estilos.textoSubtitulo]}>Carga online tarjeta bip! y bip!QR</Text>
            <Text style={styles.notaBoton}>Carga online tu Tarjeta bip!</Text>
          </View>
        </Pressable>
        {/* <Pressable
          style={[
            styles.button,
            {
              backgroundColor: Globals.COLOR.GRIS_1,
              flex: 1,
              flexDirection: 'row',
              marginTop: SCREEN_WIDTH * 0.05,
              //marginLeft: -15,
            },
          ]}
          // Se nuestra como funcionalidad nueva
          onPress={() => props.navigation.push('CargaBipJJ', { url: 'https://www.falabella.com/falabella-cl' })}
        >
          <View style={{ flex: 2, alignItems: 'center' }}>
            <CargarbipCirculo width={32} height={32} fill={Globals.COLOR.ROJO_METRO} />
          </View>
          <View style={{ flex: 8, width: 60 }}>
            <Text style={[Estilos.tipografiaBold, Estilos.bajada]}>Prueba URL externa (Falabella)</Text>
            <Text style={[Estilos.tipografiaLight, Estilos.subtitulos, { color: '#43464E' }]}>
              Carga online tu Tarjeta bip!
            </Text>
          </View>
        </Pressable> */}
        <Pressable
          style={[
            styles.button,
            mostrarComprobante
              ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: SCREEN_WIDTH * 0.03 }
              : {},
          ]}
          onPress={() => {
            const mostrar = !mostrarComprobante
            setMostrarComprobante(mostrar)
            setMostrarConsulta(false)
            setMostrarAyuda(false)
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <ComprobanteCirculo width={32} height={32} fill={Globals.COLOR.AZUL_BIP} />
          </View>
          <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
            <Text style={[Estilos.textoSubtitulo]}>Comprobantes de carga</Text>
            <Text style={styles.notaBoton}>Cargas bip! en máquinas y boleterías</Text>
          </View>
        </Pressable>
        {mostrarComprobante && (
          <View style={styles.buttonshowTheThing1}>
            <View
              style={{
                backgroundColor: 'lightgray',
                width: SCREEN_WIDTH * 0.8,
                height: 1,
              }}
            />
            <TextInputBorrar
              keyboardType="number-pad"
              borderColor={errorTarjeta ? Globals.COLOR.ROJO_METRO : Globals.COLOR.GRIS_3}
              borderWidth={errorTarjeta ? 3 : 2}
              backgroundColor="#FFFFFF"
              maxLength={15}
              autoCorrect={false}
              placeholder="Ingresa el nro. de tu tarjeta bip!"
              value={numeroBip2}
              onChangeText={(texto) => setNumeroBip2(texto)}
              width={SCREEN_WIDTH * 0.81}
              fontSize={16}
              marginTop={SCREEN_WIDTH * 0.03}
            />
            {!mostrarAyuda && (
              <Text
                style={[Estilos.textoNota, { marginTop: SCREEN_WIDTH * 0.03, color: Globals.COLOR.GRIS_4 }]}
                onPress={() => setMostrarAyuda(!mostrarAyuda)}
              >
                ¿Dónde está el número de mi tarjeta bip!?
              </Text>
            )}
            {mostrarAyuda && (
              <Pressable
                style={{ width: SCREEN_WIDTH * 0.8 }}
                onPress={() => {
                  setMostrarAyuda(false)
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: SCREEN_WIDTH * 0.03,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Text style={[Estilos.textoNota, { color: Globals.COLOR.GRIS_4 }]}>cerrar </Text>
                  <CerrarCirculo width={20} height={20} fill={Globals.COLOR.GRIS_3} />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={require('./assets/imagenes/tarjetas/numero_bip.png')}
                    style={{
                      width: 280,
                      height: 200,
                      resizeMode: 'contain',
                      backgroundColor: Globals.COLOR.GRIS_1,
                    }}
                  />
                </View>
              </Pressable>
            )}
            <View style={{ marginTop: SCREEN_WIDTH * 0.05 }}>
              <BotonSimple
                texto="Consultar"
                colorTexto="#FFFFFF"
                actuando={consultandoComprobantes}
                onPress={() => {
                  if (numeroBip2 && parseInt(numeroBip2) > 0) {
                    setConsultandoComprobantes(true)
                    props.navigation.push('ResultadoRecarga', {
                      data: numeroBip2,
                    })
                  }
                }}
                color={Globals.COLOR.AZUL_BIP}
                width={SCREEN_WIDTH * 0.54}
              />
            </View>
          </View>
        )}
        {/* Boton Mis Tarjetas bip! lightgray */}
        {bips.length == 0 && (
          <View style={[styles.button]}>
            <View style={{ alignItems: 'center' }}>
              <FavoritosCirculo width={32} height={32} fill={Globals.COLOR.AZUL_BIP} />
            </View>
            <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
              <Text style={[Estilos.textoSubtitulo]}>Mis tarjetas bip!</Text>
              <Text style={styles.notaBoton}>No tienes tarjetas guardadas</Text>
            </View>
          </View>
        )}
        {bips.length != 0 && (
          <View
            style={[
              styles.button,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: Globals.COLOR.GRIS_1,
                flex: 1,
                flexDirection: 'row',
              },
            ]}
          >
            <>
              <View style={{ alignItems: 'center' }}>
                <FavoritosCirculo width={32} height={32} fill={Globals.COLOR.AZUL_BIP} />
              </View>
              <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
                <Text style={[Estilos.textoSubtitulo]}>Mis tarjetas bip!</Text>
                <Text style={styles.notaBoton}>Consulta el saldo en tus tarjetas</Text>
              </View>
            </>
          </View>
        )}
        <View style={[styles.buttonFavorito, { paddingBottom: bips.length == 0 ? 0 : SCREEN_WIDTH * 0.05 }]}>
          <View>
            {bips.length > 0 && <View
              style={{
                backgroundColor: Globals.COLOR.GRIS_3,
                height: 1,
                marginBottom: SCREEN_WIDTH * 0.03,
              }}
            />}
            {bips.map((item, indice) => {
              return (
                <View 
                key={`CeldaFavoritosBip-${item.title}`}
                style={{marginBottom: indice == bips.length -1 ? 0 : SCREEN_WIDTH * 0.03}}>
                  <CeldaFavoritosBip                    
                    icon={true}
                    isloading={indice === loadingTarjetaIndice}
                    ontitle={(title, index) => {
                      if (!consultandoFavoritos) {
                        setConsultandoFavoritos(true)
                        if (!item.productoCliente) {
                          Alert.alert(
                            'No se pudo consultar esta tarjeta',
                            'por favor, elimínala y agrégala como favorita nuevamente.',
                            [
                              {
                                text: 'Aceptar',
                                onPress: () => {
                                  setConsultandoFavoritos(false)
                                },
                              },
                            ],
                          )
                        } else {
                          setloadingTarjetaIndice(indice)
                          var index = -1
                          for (var i = 0; i < bips.length; i++) {
                            if (bips[i].title == title.split(' - ')[0]) {
                              var n = bips[i]
                              n.numero = n.numeroBip
                              getDatos(
                                n.numeroBip,
                                n.productoCliente,
                                (result) => {
                                  if (result) {
                                    setloadingTarjetaIndice(-1)
                                    const numeroImagen = Math.trunc(Math.random() * 4) + 1
                                    props.navigation.push(
                                      'ResultadoConsultaBip',
                                      {
                                        ...result,
                                        tarjeta: n.numeroBip,
                                        numeroImagen: numeroImagen,
                                        noMostrarTarjetaGuardada: false,
                                      },
                                      {
                                        bips1: bips,
                                      },
                                    )
                                    setConsultandoFavoritos(false)
                                    return
                                  }
                                },
                                true,
                              )
                            }
                          }
                        }
                      }
                    }}
                    title={`${item.title} - ${item.numeroBip} `}
                    ondelete={(title, index) => {
                      var bips_ = []
                      for (var i = 0; i < bips.length; i++) {
                        if (bips[i].numeroBip.trim() != title.split(' - ')[title.split(' - ').length - 1].trim()) {
                          bips_.push(bips[i])
                        }
                      }
                      storeData(bips_).then((e) => {
                        setBips(bips_)
                      })
                    }}
                  />
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ConsultaBip
