import React, { useState, useEffect } from 'react';
import CeldaFavoritosBip from './CeldaFavoritosBip';
import { ScrollView, View, Text, Dimensions, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import Estilos from './Estilos'
import AsyncStorage from '@react-native-async-storage/async-storage'

import EstacionAgendaCultural from './assets/svg/cultura_comunidad/EstacionAgendaCultural.svg'
import PlanificadorCirculo from './assets/svg/planificador/PlanificadorCirculo.svg'
import FavoritosCirculo from './assets/svg/consulta_carga/FavoritosCirculo.svg'
// import BipIcon from './assets/svg/avisos/bip_icon.svg'
import Globals from './Globals'

// const bip_icon = require('./assets/bip_icon.png')

const SCREEN_WIDTH = Dimensions.get('window').width

const TIME_URL = `${Globals.MAIN_URL}/api/time.php`
const TARIFAS_URL = `${Globals.MAIN_URL}/api/tarifario.php`

const getParam = async (label) => {
  try {
    const value = await AsyncStorage.getItem(label)
    return value != null ? JSON.parse(value) : null
  } catch (e) {}
}

const storeParam = async (label, value) => {
  try {
    await AsyncStorage.setItem(label, JSON.stringify(value))
  } catch (e) {
  } finally {
    return true
  }
}

const Favoritos = (props) => {
  // static bips = [];
  index = 0
  const [estaciones, setEstaciones] = useState([])
  const [rutas, setRutas] = useState([])
  const [bips, setBips] = useState([])
  const [loadingTarjetaIndice, setloadingTarjetaIndice] = useState(-1)
  const [consultando, setConsultando] = useState(false)
  const [horarios, setHorarios] = useState([])

  const [state, setState] = useState({
    data: [],
    mostrarEstacion: false,
    mostrarBip: false,
    loading: false,
    isResultado: false,
    numeroBip: '',
    fecha: '',
    saldo: 0,
    // estaciones: [],
    // bips: [],
    isDialogVisible: false,
    isEditingVisible: false,
    bipIndex: 0,
    verNumeroBip: false,
    // rutas: [],
    horarios: [],
  })

  const getHorarios = () => {
    fetch(TARIFAS_URL)
      .then((response) => response.json())
      .then((json) => {
        setHorarios(json.horarios)
      })
      .catch((error) => console.error(error))
      .finally(() => {})
  }

  const getCodigoDiaActual = () => {
    let dia = ''
    const hoy = new Date()
    switch (hoy.getDay()) {
      case 6:
        dia = 'ds'
        break
      case 7:
        dia = 'df'
        break
      default:
        dia = 'dl'
        break
    }
    return dia
  }

  const obtieneTarifaActual = () => { return new Promise((resolve, reject) => {
    // Se obtiene la hora actual
    fetch(TIME_URL)
      .then((response) => response.text())
      .then((text) => {
        const horaServidorActual = text.split(' ')[1].replace('"', '') + ':00'
        // const horaServidorActual = '23:01:00'
        // setHoraActual(horaServidorActual)
        const codDiaActualPaso = getCodigoDiaActual()
        let horario = []
        switch (codDiaActualPaso) {
          case 'ds':
            horario = horarios.filter(
              (item) =>
                item.horario == 'VALLE-SAB' && item.inicio <= horaServidorActual && horaServidorActual <= item.fin,
            )
            break
          case 'df':
            horario = horarios.filter(
              (item) =>
                item.horario == 'VALLE-DOM' && item.inicio <= horaServidorActual && horaServidorActual <= item.fin,
            )
            break
          default:
            horario = horarios.filter(
              (item) =>
                item.horario !== 'VALLE-SAB' &&
                item.horario !== 'VALLE-DOM' &&
                item.inicio <= horaServidorActual &&
                horaServidorActual <= item.fin,
            )
            break
        }
        if (horario.length == 0) resolve('')
        else resolve(horario[0].horario)
      })
  })
}

  useEffect(() => {
    getHorarios()
    // Se crea un escuchador debido a que Navigate no monta los componentes al moverse entre pantallas.
    const _unsubscribe = props.navigation.addListener('focus', () => {
      setConsultando(false)
      setloadingTarjetaIndice(-1)
      index = 0
      setState({ ...state, numeroBip: '' })
      getParam('rutas3').then((e) => {
         console.log('Rutas obtenidas:', e) 
        setRutas(e)
      })
      getData()
      getEstacionFavorita().then((estaciones) => {
        setEstaciones(estaciones)
      })
    })
    return () => {
      _unsubscribe()
    }
  }, [])

  const setHorarioActual = (func) => {
    var today = new Date()
    let dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    var dia = 'dl'
    var hora = 'VALLE'
    switch (today.getDay()) {
      case 6:
        dia = 'ds'
        break
      case 7:
        dia = 'df'
        break
      default:
        dia = 'dl'
        break
    }
    var horarioActual
    state.horarios.forEach((e) => {
      var inicio = new Date()
      inicio.setHours(e.inicio.split(':')[0])
      inicio.setMinutes(e.inicio.split(':')[1])
      var final = new Date()
      final.setHours(e.final.split(':')[0])
      final.setMinutes(e.final.split(':')[1])
      if (today > inicio && today < final) {
        if (dia == e.dia) {
          Planificador.valHorario = { inicio: inicio, fin: final }
          horarioActual = e
          hora = e.param
          // console.log('horario es', e.param, e);
        }
      }
    })
    setState({ ...state, dia: dia, hora: hora, diaLabel: dias[today.getDay()] }, func)
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@bip_config_', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getData = () => {
    try {
      AsyncStorage.getItem('@bip_config_').then((jsonValue) => {
        const tarjetas = jsonValue != null ? JSON.parse(jsonValue) : null
        setBips(tarjetas)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getEstacionFavorita = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@Fav_')
      if (jsonValue !== null) {
        const favorites = JSON.parse(jsonValue)
        // console.log('Esto quiero eliminar: ', favorites);
        const filteredFavorites = favorites.filter((favorite) => favorite.isFavorite !== false)
        await AsyncStorage.setItem('@Fav_', JSON.stringify(filteredFavorites))
        // console.log('Favoritos Filtrados: ', filteredFavorites);
        return filteredFavorites
      }
      return null
    } catch (e) {
      console.log(e)
    }
  }

  const updateBips = (items) => {
    // console.log(items);
    if (items.length == 0) {
      return
    }

    getDatos(items[this.index].numeroBip, (result) => {
      setState({ ...state, loading: false })
      if (result) {
        items[index].value = result.saldo
        items[index].loaded = true
        for (var p in result) {
          items[index][p] = result[p]
        }
        // console.log('items', items);
        if (index < items.length - 1) {
          index++
          //this.setState( { bips: items}, ()=>{ this.updateBips(items);} );
          updateBips(items)
        } else {
          storeData(items).then((e) => {
            setBips(items)
          })
        }
      }
    })
  }

  const getRuta = (origen, destino, dia, hora, estacionInicio, estacionFin, rutas) => {
    setState({ ...state, refreshing: true })
    obtieneTarifaActual().then((tarifa) => {
      if (!tarifa) {
        Alert.alert(
          'Atención',
          'Horario fuera de servicio.\nIngresa tu ruta en el Planificador opción "Más Tarde"',
          [{ text: 'Aceptar', onPress: () => {} }],
          { cancelable: false },
        )
        return
      }
      if (dia == '') {
        setHorarioActual(() => {})
      }
      // Se obtiene el tipo de día actual
      const today = new Date()
      let diaLabel = ''
      switch (today.getDay()) {
        case 6:
          diaLabel = 'Sábado'
          break
        case 7:
          diaLabel = 'Domingo y Festivos'
          break
        default:
          diaLabel = 'Lunes'
          break
      }
      // const diaLabel = diaSemanaTexto(dia);
      let codigoOrigen = origen.replace('Ñ', 'N')
      let codigoDestino = destino.replace('Ñ', 'N')
      let url = `https://www.metro.cl/api/planificadorv2.php?estacionInicio=${codigoOrigen}&estacionFin=${codigoDestino}&dia=${dia}&hora=${hora}`
      //let url = `https://newmt.agenciacatedral.com/api/planificadorv2.php?estacionInicio=${this.state.origen}&estacionFin=${this.state.destino}&dia=${this.state.dia}&hora=${this.state.hora}`
      // console.log(url);
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          if (json.estado == 0) {
            return
          }
          setState({ ...state, refreshing: false })
          AsyncStorage.removeItem('origen').then((e) => {
            AsyncStorage.removeItem('destino').then((e) => {
              props.navigation.push('Resultado', {
                data: json.rutas,
                // dd: diaSemana,
                o: origen,
                d: destino,
                origen: estacionInicio,
                destino: estacionFin,
                dia: diaLabel,
                horario: hora,
                rutas,
              })
            })
          })
        })
        .catch((error) => console.error(error))
        .finally(() => {
          // this.setState({ isLoading: false });
        })
    })
  }

  const mostrarAvisoNoBips = () => {
    if (bips == null || bips.length == 0) {
      return (
        <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>No tienes tarjetas guardadas</Text>
      )
    } else {
      return (
        <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>
          Consulta el saldo de tus tarjetas
        </Text>
      )
    }
  }

  const mostrarAvisoNoEstaciones = () => {
    if (estaciones == null || estaciones == '' || estaciones == [] || estaciones == undefined || estaciones == '0') {
      return (
        <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>No tienes estaciones guardadas</Text>
      )
    } else {
      return <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>Consulta la información</Text>
    }
  }

  const mostrarAvisoNoRutas = () => {
    console.log('validar rutas  obtenidas:', rutas);
    if (rutas == null || rutas.length == 0) {
      return <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>No tienes rutas guardadas</Text>
    } else {
      return <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>Planifica tu viaje</Text>
    }
  }

  function currencyFormat(num) {
    const numero = Number(num)
    return '$ ' + numero.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  const getDatos = (bipNumber, productoCliente, funcPar, mostrarError = true) => {
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
              tarjeta: bipNumber,
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
            // setLoading(false);
            // Alert.alert('Error al obtener el saldo consultado')
          }
        })
        .catch((error) => {
          // setLoading(false);
          if (mostrarError)
            Alert.alert(`Tu consulta no se pudo${'\n'}llevar a cabo`, 'Por favor, intenta nuevamente.', [
              {
                text: 'Aceptar',
                onPress: () => {
                  setConsultando(false)
                },
              },
            ])
        })
    })
  }

  const muestraEstacion = (title, codigo, linea) => {
    if (codigo) {
      props.navigation.push('Estacion', {
        data: { codigo: codigo, linea: linea },
      })
    } else {
      const title2 = title
      Alert.alert(
        'Mis Estaciones Favoritas',
        'Para que funcionen bien tus estaciones favoritas es necesario eliminarlas y agregarlas nuevamente.',
        [{ text: 'Aceptar', onPress: () => borrarEstacion(title2) }],
      )
    }
  }

  const borrarEstacion = (title) => {
    const mis_estaciones = estaciones.filter((estacion) => estacion.estacion !== title)
    AsyncStorage.removeItem('@Fav_').then(() => {
      AsyncStorage.setItem('@Fav_', JSON.stringify(mis_estaciones)).then(() => {
        setEstaciones(mis_estaciones)
      })
    })
  }

  return (
    <View style={{ marginVertical: SCREEN_WIDTH * 0.08 }}>
      <ScrollView
        style={{
          width: SCREEN_WIDTH,
          paddingHorizontal: SCREEN_WIDTH * 0.05,
        }}
      >
        <View
          style={{
            backgroundColor: Globals.COLOR.GRIS_1,
            borderRadius: 20,
            paddingTop: SCREEN_WIDTH * 0.05,
            paddingHorizontal: SCREEN_WIDTH * 0.05,
            paddingBottom: rutas == null || rutas.length == 0 ? SCREEN_WIDTH * 0.03 : SCREEN_WIDTH * 0.03,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PlanificadorCirculo width={32} height={32} />
            <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
              <Text style={[Estilos.textoSubtitulo]}>Mis rutas</Text>
              {mostrarAvisoNoRutas()}
            </View>
          </View>
          <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
            {rutas?.length > 0 && (
              <View style={{ marginTop: SCREEN_WIDTH * 0.03, height: 1, backgroundColor: Globals.COLOR.GRIS_3 }} />
            )}
            {rutas?.map((e, i) => {   
              return (             
                  <View key={`ruta-${i}`} style={{ paddingLeft: SCREEN_WIDTH * 0.03 }}>
                    <CeldaFavoritosBip
                      // icon={ruta_img}
                      key={`c${i}`}
                      indice={i}
                      ontitle={(title, index) => {
                        var origen = rutas[index].o
                        var destino = rutas[index].d
                        var diaParam = rutas[index].diaParam
                        var hora = rutas[index].horario
                        var estacionInicio = rutas[index].origen
                        var estacionFin = rutas[index].destino
                        setState({
                          ...state,
                          estacionInicio: rutas[index].origen,
                          estacionFin: rutas[index].destino,
                          origen: rutas[index].o,
                          destino: rutas[index].d,
                          dia: diaParam,
                          rutas,
                        })
                        getRuta(origen, destino, diaParam, hora, estacionInicio, estacionFin, rutas)
                      }}
                      title={`${e.origen} - ${e.destino}`}
                      ondelete={(title, index) => {
                        const mis_rutas = rutas.filter((ruta, indice) => indice !== index)
                        storeParam('rutas3', mis_rutas).then((e) => {
                          setRutas(mis_rutas)
                        })
                      }}
                    />
                  </View>
              )
            })}
          </View>
        </View>
        <View
          style={{
            marginTop: SCREEN_WIDTH * 0.05,
            backgroundColor: Globals.COLOR.GRIS_1,
            borderRadius: 20,
            paddingTop: SCREEN_WIDTH * 0.05,
            paddingHorizontal: SCREEN_WIDTH * 0.05,
            paddingBottom: bips == null || bips.length == 0 ? SCREEN_WIDTH * 0.03 : SCREEN_WIDTH * 0.03,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FavoritosCirculo width={32} height={32} />
            <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
              <Text style={[Estilos.textoSubtitulo]}>Mis tarjetas</Text>
              {mostrarAvisoNoBips()}
            </View>
          </View>
          {state.loading && <ActivityIndicator style={{ height: 20, marginTop: 10 }} size="large" color="#43464E" />}
          <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
            {bips?.length > 0 && (
              <View style={{ marginVertical: SCREEN_WIDTH * 0.02, height: 1, backgroundColor: Globals.COLOR.GRIS_3 }} />
            )}
            {bips?.map((item, indice) => {
              return (
                  <View
                    key={`bip-${item.numeroBip || indice}`}
                    style={{
                      paddingLeft: SCREEN_WIDTH * 0.03,
                      marginBottom: indice == bips.length - 1 ? SCREEN_WIDTH * 0.0 : 0,
                      height: 43,
                    }}
                  >
                    <CeldaFavoritosBip
                      key={`CeldaFavoritosBip-${item.title}`}
                      icon={true}
                      isloading={indice === loadingTarjetaIndice}
                      ontitle={(title, index) => {
                        if (!consultando) {
                          setConsultando(true)
                          setloadingTarjetaIndice(indice)
                          setState({ ...state, loading: false })
                          var index = -1
                          if (!item.productoCliente) {
                            setloadingTarjetaIndice(-1)
                            Alert.alert(
                              'No se pudo consultar esta tarjeta',
                              'por favor, elimínala y agrégala como favorita nuevamente.',
                              [
                                {
                                  text: 'Aceptar',
                                  onPress: () => {
                                    setConsultando(false)
                                  },
                                },
                              ],
                            )
                          } else {
                            if (state.loading) {
                              setConsultando(false)
                              return
                            }
                            for (var i = 0; i < bips.length; i++) {
                              if (bips[i].title == title.split(' - ')[0]) {
                                var n = bips[i]
                                n.numero = n.numeroBip
                                getDatos(n.numero, n.productoCliente, (result) => {
                                  setState({ ...state, loading: false })
                                  if (result) {
                                    var obj = result
                                    obj.tarjeta = n
                                    const numeroImagen = Math.trunc(Math.random() * 4) + 1
                                    const parametros = {
                                      ...result,
                                      numeroImagen: numeroImagen,
                                      noMostrarTarjetaGuardada: true,
                                      tarjeta: n.numero,
                                    }
                                    props.navigation.push(
                                      'ResultadoConsultaBip',
                                      {
                                        ...result,
                                        numeroImagen: numeroImagen,
                                        noMostrarTarjetaGuardada: true,
                                        tarjeta: n.numero,
                                      },
                                      {
                                        bips1: [],
                                      },
                                    )
                                    setConsultando(false)
                                    return
                                  }
                                  Alert.alert(
                                    'Saldo bip!',
                                    'Error al obtener el saldo de tu tarjeta bip!',
                                    [
                                      {
                                        text: 'Aceptar',
                                        onPress: () => {
                                          setConsultando(false)
                                          setState({ ...state, isDialogVisible: false })
                                        },
                                      },
                                    ],
                                    { cancelable: false },
                                  )
                                })
                                index = i
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
        {/** Mis Estaciones */}
        <View
          style={{
            marginTop: SCREEN_WIDTH * 0.05,
            backgroundColor: Globals.COLOR.GRIS_1,
            borderRadius: 20,
            paddingTop: SCREEN_WIDTH * 0.05,
            paddingHorizontal: SCREEN_WIDTH * 0.05,
            paddingBottom: estaciones == null || estaciones.length == 0 ? SCREEN_WIDTH * 0.02 : SCREEN_WIDTH * 0.02,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EstacionAgendaCultural width={32} height={32} />
            <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
              <Text style={[Estilos.textoSubtitulo]}>Mis estaciones</Text>
              {mostrarAvisoNoEstaciones()}
            </View>
          </View>
          <View style={{ marginTop: SCREEN_WIDTH * 0.05 }}>
            {estaciones?.length > 0 && (
              <View style={{ marginVertical: SCREEN_WIDTH * 0.0, height: 1, backgroundColor: Globals.COLOR.GRIS_3 }} />
            )}
            {estaciones?.map(({ estacion, codigoEstacion, linea }, indice) => {
              return (
                  <View key={`estacion-${codigoEstacion || indice}`} style={{ paddingLeft: SCREEN_WIDTH * 0.03 }}>
                    <CeldaFavoritosBip
                      // icon={estrellaOn}
                      iconSize={20}
                      key={estacion}
                      indice={indice}
                      title={estacion}
                      codigo={codigoEstacion}
                      linea={linea}
                      ontitle={() => muestraEstacion(estacion, codigoEstacion, linea)}
                      ondelete={(title) => borrarEstacion(title)}
                    />
                  </View>
                 )
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Favoritos
