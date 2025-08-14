import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  View,
  Text,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native'
import BotonSimple from './components/BotonSimple'
import Estilos from './Estilos'
import DialogInput from 'react-native-dialog-input'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Globals from './Globals'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
import AddPlus from './assets/svg/comun/AddPlus.svg'

const ResultadoConsultaBip = (props) => {
  props.navigation.setOptions({ title: 'Consulta de saldo' })
  var codigobip = props.route.params.tarjeta

  const [confirmacion, setConfirmacion] = useState(false)
  const [registro, setRegistro] = useState([])
  const [movimientos, setMovimientos] = useState(false)
  const [bips, setBips] = useState([])
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  // const urlVoucher =
  //   `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/voucher/cantidad?numero=${codigobip}&cantidad=5`
  const urlVoucher = `https://s7ibm5ar0f.execute-api.us-east-1.amazonaws.com/UAT/voucherglue/cantidad?numero=${codigobip}&cantidad=5`

  const SCREEN_WIDTH = Dimensions.get('window').width

  const styles = StyleSheet.create({
    containerPrinsipal: {
      flex: 1,
    },
    titulo: {
      marginLeft: 5,
      marginRight: 5,
    },
    button: {
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      marginTop: '5%',
      width: '95%',
      height: 75,
      borderRadius: 16,
      elevation: 3,
      backgroundColor: Globals.COLOR.GRIS_1,
    },
    text: {
      fontSize: 22,
      lineHeight: 40,
      letterSpacing: 0.3,
      color: '#43464E',
    },
    numeroTarjeta: {
      width: SCREEN_WIDTH * 0.55,
      padding: SCREEN_WIDTH * 0.02,
      backgroundColor: '#FFFFFF',
      transform: [{ rotate: '90deg' }],
      marginLeft: SCREEN_WIDTH * 0.6,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
    },
    textoNumeroTarjeta: {
      textAlign: 'center',
    },
  })

  const getRegistro = () => {
    fetch(urlVoucher)
      .then((res) => res.json())
      .then((res) => {
        setRegistro(res.registro)
      })
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@bip_config_', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@bip_config_')
      const listaTarjetas = jsonValue != null ? JSON.parse(jsonValue) : null
      // Se determina si la tarjeta consultada ya está en la lista de favoritas
      // const existe = listaTarjetas.find(
      //   tarjeta => tarjeta.numeroBip === codigobip,
      // );
      const existe = false
      if (existe) {
        setConfirmacion(true)
      } else {
        setConfirmacion(false)
      }
      // console.log('Tarjeta ', existe);
      return listaTarjetas
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getRegistro()
    // console.log('params', props.route.params);
    const _unsubscribe = props.navigation.addListener('focus', () => {
      // console.log('focus bips: ', bips);
      getData().then((e) => {
        if (e) {
          var btnVisiblePaso = true
          e.forEach((a) => {
            // console.log('datos', a.numeroBip, props.route.params);
            if (a.numeroBip == props.route.params.numeroBip) {
              btnVisiblePaso = false
            }
          })
          for (var i in e) {
            e[i].loaded = false
          }
          setBips(e)
        }
      })
    })
    return () => {
      _unsubscribe()
    }
  }, [])

  const displayBotonFavoritos = () => {
    //Boton de tarjeta favorita en la muestra de resultados
    if (!bips.find((item) => item.numeroBip === props.route.params.tarjeta)) {
      return (
        <View style={{ alignItems: 'center', marginTop: SCREEN_WIDTH * 0.05 }}>
          <BotonSimple
            texto="Agregar a Mis tarjetas bip!"
            colorTexto="#FFFFFF"
            // actuando={consultando}
            onPress={() => setIsDialogVisible(true)}
            color={Globals.COLOR.AZUL_BIP}
            width={SCREEN_WIDTH * 0.8}
          />
        </View>
      )
    }
  }

  const borrarFavoritos = () => {
    // se quita la estación de favoritos
    const tarjetasFavoritasPaso = bips.filter((item) => item.numeroBip !== props.route.params.tarjeta)
    AsyncStorage.removeItem('@bip_config_').then(() => {
      AsyncStorage.setItem('@bip_config_', JSON.stringify(tarjetasFavoritasPaso)).then(() => {
        setBips(tarjetasFavoritasPaso)
      })
    })
  }

  // const displayTarjetaGuardada = () => {
  //   //Boton de tarjeta favorita en la muestra de resultados
  //   if (confirmacion == true) {
  //     return (
  //       <Pressable
  //         style={[
  //           styles.button,
  //           {
  //             flex: 1,
  //             flexDirection: 'row',
  //             alignContent: 'center',
  //             alignItems: 'center',
  //           },
  //         ]}
  //       >
  //         <View style={{ flex: 0.2, marginLeft: '17%' }}>
  //           <Image
  //             source={require('./assets/TarjetaFavorita.png')}
  //             style={{ width: '50%', alignSelf: 'center', resizeMode: 'contain' }}
  //           />
  //         </View>
  //         <View style={{ flex: 0.8, width: 60 }}>
  //           <Text style={[Estilos.tipografiaLight, Estilos.subtitulos]}>Tarjeta Guardada</Text>
  //         </View>
  //       </Pressable>
  //     )
  //   }
  // }

  //Aqui se le asigna el nombre a la tarjeta que se agregara a favoritos
  const sendInput = (txt) => {
    //Aqui se le asigna el nombre a la tarjeta que se agregara a favoritos
    var _bips = bips
    var error = false
    // console.log('guardar:', numeroBip);

    _bips.forEach((a) => {
      if (a.numeroBip == props.route.params.tarjeta) {
        error = true
      }
    })

    if (error) {
      Alert.alert(
        'Saldo y Carga bip!',
        'Esta tarjeta ya está guardada',
        [
          {
            text: 'Aceptar',
            onPress: () => setIsDialogVisible(false),
          },
        ],
        { cancelable: false },
      )
    } else {
      _bips.unshift({
        title: txt,
        value: props.route.params.saldo,
        numeroBip: props.route.params.tarjeta,
        productoCliente: props.route.params.productoCliente,
      })
      storeData(_bips).then((e) => {
        // console.log('se agrega nueva bip');
        setBips(_bips)
        setIsDialogVisible(false)
      })
    }
  }

  const sendArreglo = () => {
    return (
      <>
        <View style={{ marginTop: SCREEN_WIDTH * 0.08 }}>
          <FlatList
            data={registro}
            renderItem={({ item, index }) => (
              <View>
                {index > 0 && (
                  <View
                    style={{
                      backgroundColor: Globals.COLOR.GRIS_3,
                      width: 'auto',
                      height: 1,
                      marginVertical: SCREEN_WIDTH * 0.03,
                      //marginBottom: '1%',
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 8 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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
                      <Text style={[Estilos.textoNota]}>{item[2]}</Text>
                      <Text style={[Estilos.textoSubtitulo]}>$ {item[6]}</Text>
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
              </View>
            )}
          />
        </View>
      </>
    )
  }

  // Muestra la Bip Azul con los datos obtenidos en Consulta Saldo
  const displayResultado = () => {
    // Muestra la Bip Azul con los datos obtenidos en Consulta Saldo
    // console.log(props.route.params);
    // { tarjeta:this.state.numeroBip, saldo: Number( resultadoBip.saldo), fecha: resultadoBip.fecha.split(' ')[0] }
    return (
      <>
        <View style={[styles.containerPrinsipal]}>
          <View
            style={{
              marginTop: SCREEN_WIDTH * 0.08,
              width: SCREEN_WIDTH * 0.9,
              padding: SCREEN_WIDTH * 0.03,
              backgroundColor: 'green',
              marginHorizontal: SCREEN_WIDTH * 0.05,
              borderRadius: 20,
              backgroundColor: Globals.COLOR.GRIS_1,
            }}
          >
            <View
              style={{
                //marginLeft: SCREEN_WIDTH * 0.08,
                width: SCREEN_WIDTH * 0.84,
                height: SCREEN_WIDTH * 0.768 * 0.6477,
                borderTopStartRadius: 10,
                borderBottomStartRadius: 10,
                overflow: 'hidden',
              }}
            >
              <Image
                style={{
                  width: SCREEN_WIDTH * 0.767,
                  height: SCREEN_WIDTH * 0.767 * 0.6477,
                }}
                source={{
                  uri: `https://d37nosr7rj2kog.cloudfront.net/tarjetaBip${props.route.params.numeroImagen}.jpg`,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  width: SCREEN_WIDTH * 0.769 * 0.6477,
                  padding: SCREEN_WIDTH * 0.01,
                  backgroundColor: '#FFFFFF',
                  transform: [{ rotate: '90deg' }],
                  marginTop: SCREEN_WIDTH * 0.212,
                  marginLeft: SCREEN_WIDTH * 0.555,
                  borderTopStartRadius: 10,
                  borderTopEndRadius: 10,
                }}
              >
                <Text style={[styles.textoNumeroTarjeta, Estilos.tipografiaBold, { fontSize: 18 }]}>{`Nro. ${
                  props.route.params.numeroBip
                    ? props.route.params.numeroBip
                    : props.route.params.obj['n&ordm;_tarjeta_bip!']
                }`}</Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  marginLeft: SCREEN_WIDTH * 0.0,
                  marginTop: SCREEN_WIDTH * 0.26,
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  width: SCREEN_WIDTH * 0.36,
                  height: SCREEN_WIDTH * 0.12,
                  borderTopEndRadius: 25,
                  borderBottomEndRadius: 25,
                }}
              >
                <Text
                  style={[
                    styles.titulo,
                    {
                      fontSize: 36,
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      fontWeight: 'bold',
                      color: 'white',
                    },
                    Estilos.tipografiaBold,
                    { color: '#000000', textAlign: 'center', fontSize: 30 },
                  ]}
                >
                  {props.route.params.obj.saldo_tarjeta ? props.route.params.obj.saldo_tarjeta : '--'}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              borderRadius: 20,
              marginTop: SCREEN_WIDTH * 0.05,
              width: SCREEN_WIDTH * 0.9,
              marginHorizontal: SCREEN_WIDTH * 0.05,
              padding: SCREEN_WIDTH * 0.05,
              backgroundColor: Globals.COLOR.GRIS_1,
            }}
          >
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              ]}
            >
              <View>
                <Text style={[Estilos.textoSubtitulo]}>Últimas cargas tarjeta bip!</Text>
                <Text style={[Estilos.textoNota, { marginTop: SCREEN_WIDTH * 0.03 }]}>
                  Máquinas de carga bip! y boleterías
                </Text>
              </View>
              <Pressable
                style={{ alignSelf: 'center', alignItems: 'center' }}
                onPress={() => setMovimientos(!movimientos)}
              >
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: movimientos ? '180deg' : '0deg' }] }}
                />
              </Pressable>
            </View>
            {movimientos && !registro && (
              <Text
                style={[
                  Estilos.textoNota,
                  {
                    textAlign: 'center',
                    marginTop: SCREEN_WIDTH * 0.08,
                  },
                ]}
              >
                Sin registros para esta tarjeta
              </Text>
            )}
            <View>{movimientos && registro && sendArreglo()}</View>
          </View>
        </View>
      </>
    )
  }

  //Renderiza los resultados obtenidos en los metodos que se mencionan

  //Renderiza los resultados obtenidos en los metodos que se mencionan
  return (
    <SafeAreaView>
      <ScrollView style={{ margin: 2 }}>
        <View>{displayResultado()}</View>

        <View>
          {/* {displayPrimarioTarjeta()} */}
          {!props.route.params.noMostrarTarjetaGuardada &&
            bips.find((item) => item.numeroBip === props.route.params.tarjeta) && (
              <View style={{ alignItems: 'center', marginTop: SCREEN_WIDTH * 0.05 }}>
                <BotonSimple
                  texto="Borrar de mis tarjetas"
                  colorTexto="#FFFFFF"
                  // actuando={consultando}
                  onPress={() => borrarFavoritos()}
                  color={Globals.COLOR.L2}
                  width={SCREEN_WIDTH * 0.8}
                />
              </View>
            )}
          {!props.route.params.noMostrarTarjetaGuardada && displayBotonFavoritos()}
          {/* {!props.route.params.noMostrarTarjetaGuardada && displayTarjetaGuardada()} */}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <DialogInput
        modalStyle={{ marginTop: -100 }}
        isDialogVisible={isDialogVisible}
        title={'Guardar Tarjeta'}
        message={`Ingresa un nombre para tu tarjeta,${'\n'}máximo 10 caracteres`}
        cancelText={'Cancelar'}
        submitText={'Guardar'}
        hintInput={''}
        submitInput={(inputText) => {
          console.log(inputText)
          if (!inputText || inputText.length > 10) {
            return
          }
          sendInput(inputText)
        }}
        closeDialog={() => {
          setIsDialogVisible(false)
        }}
      />
    </SafeAreaView>
  )
}

export default ResultadoConsultaBip
