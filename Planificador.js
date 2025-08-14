import React, { useEffect, useState } from 'react'
import { Dimensions, Alert, ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import Estilos from './Estilos'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CeldaFavoritosBip from './CeldaFavoritosBip'
import ComboBoxCodigo from './components/ComboBoxCodigo'
import BotonSimple from './components/BotonSimple'
import Globals from './Globals'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
import PlanificadorCirculo from './assets/svg/planificador/PlanificadorCirculo.svg'
import ExclamasionTriangulo from './assets/svg/comun/ExclamasionTriangulo.svg'
import SelectorEstacion from './js/components/SelectorEstacion'

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  contenedorGeneral: {
    paddingHorizontal: WIDTH * 0.05,
  },
  botonEstacion: {
    width: WIDTH * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: WIDTH * 0.05,
    paddingVertical: WIDTH * 0.03,
    borderRadius: 20,
    marginTop: WIDTH * 0.03,
  },
})

const getParam = async (label) => {
  try {
    const value = await AsyncStorage.getItem(label)
    return value != null ? JSON.parse(value) : null
  } catch (e) {
    //console.log(e);
  }
}

const storeParam = async (label, value) => {
  try {
    await AsyncStorage.setItem(label, JSON.stringify(value))
  } catch (e) {
    //console.log(e);
  } finally {
    return true
  }
}

const Planificador = (props) => {
  const TARIFAS_URL = `${Globals.MAIN_URL}/api/tarifario.php`
  //Importante: a razón que los usuarios configuran mal el huso horario del equipo usamos este método a pedido de metro.
  const TIME_URL = `${Globals.MAIN_URL}/api/time.php`
  const ESTADO_RED_URL = `${Globals.MAIN_URL}/api/estadoRedDetalle.php`

  const dias_arr = [
    { title: 'Lunes a Viernes', value: 'dl' },
    { title: 'Sábado', value: 'ds' },
    { title: 'Domingo y Festivos', value: 'df' },
  ]

  const [ahora, setAhora] = useState(true)
  const [refreshing, setRefreshing] = useState(true)
  const [estaciones, setEstaciones] = useState([])
  const [estacionInicio, setEstacionInicio] = useState('Selecciona estación de Origen')
  const [estacionFin, setEstacionFin] = useState('Selecciona estación de Destino')
  const [horarios, setHorarios] = useState([])
  const [rutas, setRutas] = useState([])
  const [showWarning, setShowWarning] = useState(false)
  const [horariosFiltrado, setHorariosFiltrado] = useState([])
  const [diaValue, setDiaValue] = useState('')
  const [horarioValue, setHorarioValue] = useState('')
  const [actuando, setActuando] = useState(false)
  const [tarifas, setTarifas] = useState([])
  const [horaActual, setHoraActual] = useState('00:00:00')
  const [tarifaActual, setTarifaActual] = useState('')
  const [codDiaActual, setCodDiaActual] = useState('')
  const [seleccionandoEstacionOrigen, setSeleccionandoEstacionOrigen] = useState(false)
  const [seleccionandoEstacionDestino, setSeleccionandoEstacionDestino] = useState(false)
  const [llamando, setLlamando] = useState(null)
  const [muestraSelectorEstacionOrigen, setMuestraSelectorEstacionOrigen] = useState(false)
  const [muestraSelectorEstacionDestino, setMuestraSelectorEstacionDestino] = useState(false)
  const [codOrigen, setCodOrigen] = useState('')
  const [codDestino, setCodDestino] = useState('')

  const setHorarioActual = (func) => {
    var today = new Date()
    var dia = 'dl'
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
    horarios.forEach((e) => {
      var inicio = new Date()
      inicio.setHours(e.inicio.split(':')[0])
      inicio.setMinutes(e.inicio.split(':')[1])
      var final = new Date()
      final.setHours(e.final.split(':')[0])
      final.setMinutes(e.final.split(':')[1])
    })
    func()
  }

  // ---------------------------------------------------------------------------------------------
  const getTarifas = new Promise((resolve, reject) => {
    let horariosBuscar = []
    fetch(TARIFAS_URL)
      .then((response) => response.json())
      .then((json) => {
        json.horarios.map((horario) => {
          let diaPaso = 'dl'
          if (horario.horario == 'VALLE-DOM') {
            diaPaso = 'df'
          } else if (horario.horario == 'VALLE-SAB') {
            diaPaso = 'ds'
          }
          horariosBuscar.push({
            inicio: horario.inicio,
            fin: horario.fin,
            horario: horario.horario.split('-')[0],
            dia: diaPaso,
          })
        })
        resolve(horariosBuscar)
      })
  })
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

  const getHorarios = () => {
    setRefreshing(true)
    var horaInicio_ = false
    fetch(TARIFAS_URL)
      .then((response) => response.json())
      .then((json) => {
        var data = []
        var titles = {}
        setTarifas(json.tarifario)
        json.horarios.forEach((element) => {
          var str = element.inicio.substring(0, 5) + ' - ' + element.fin.substring(0, 5)

          if (titles[element.horario.toUpperCase()]) {
            titles[element.horario.toUpperCase()] += ' / ' + str
          } else {
            titles[element.horario.toUpperCase()] = str
          }
        })
        for (var e in json.horarios) {
          var horario = json.horarios[e]
          var obj = {}
          obj.param = horario.horario
          obj.title = `${horario.horario} ${titles[horario.horario]}`
          switch (obj.param) {
            case 'VALLE-SAB':
              obj.dia = 'ds'
              break
            case 'VALLE-DOM':
              obj.dia = 'df'
              break
            default:
              obj.dia = 'dl'
              break
          }
          if (obj.param == 'VALLE-SAB' || obj.param == 'VALLE-DOM') {
            obj.param = 'VALLE'
          }
          obj.inicio = horario.inicio
          obj.final = horario.fin
          var inicio = new Date()
          inicio.setHours(obj.inicio.split(':')[0])
          inicio.setMinutes(obj.inicio.split(':')[1])
          var final_ = new Date()
          final_.setHours(obj.final.split(':')[0])
          final_.setMinutes(obj.final.split(':')[1])
          if (horaInicio_ == false) {
            horaInicio_ = obj.inicio.split(':')[0]
          }
          horaFinal_ = obj.final.split(':')[0]
          obj._date = inicio
          data.push(obj)
        }
        setHorarios(data)
        setHorarioActual(() => {
          getEstadoEstaciones()
        })
      })
      .catch((error) => console.error(error))
      .finally(() => {})
  }

  const mostrarWarning = (json) => {
    for (var i in json) {
      if (json[i].estado != '1') {
        return true
      }
    }
    return false
  }

  const cerrarSelectorEstacion = (estado) => {
    setSeleccionandoEstacionOrigen(false)
    setSeleccionandoEstacionDestino(false)
    setMuestraSelectorEstacionOrigen(estado)
    setMuestraSelectorEstacionDestino(estado)
  }
  const getEstadoEstaciones = () => {
    setRefreshing(true)
    fetch(ESTADO_RED_URL)
      .then((response) => response.json())
      .then((json) => {
        var data = []
        for (var i in json) {
          var item = new Object()
          item.title = i
          item.styleName = i
          item.linea = i.toUpperCase()
          item.status = json[i].mensaje_app
          item.data = json[i].estaciones.map((e) => {
            var obj = new Object()
            obj.title = e.nombre
            obj.status = e.descripcion_app
            obj.linea = i
            obj.visible = false
            obj.estado = e.estado
            obj.cod = e.codigo
            return obj
          })
          data.push(item)
        }
        setShowWarning(mostrarWarning(json))
        setEstaciones(data)
        setRefreshing(false)
      })
      .catch((error) => console.error(error))
      .finally(() => {})
  }

  const esCombinacion = (nombre) => {
    const expRegular = /^L[1-6]/
    if (expRegular.test(nombre.split(' ')[nombre.split(' ').length - 1])) return true
    else false
  }

  const seleccionaEstacionOrigen = (estacion) => {
    setEstacionInicio(estacion.title)
    setCodOrigen(estacion.codigo)
    setSeleccionandoEstacionOrigen(false)
    setMuestraSelectorEstacionOrigen(false)
  }

  const seleccionaEstacionDestino = (estacion) => {
    setEstacionFin(estacion.title)
    setCodDestino(estacion.codigo)
    setSeleccionandoEstacionDestino(false)
    setMuestraSelectorEstacionDestino(false)
  }

  useEffect(() => {
    getHorarios()
    AsyncStorage.removeItem('origen')
    AsyncStorage.removeItem('destino')
    getParam('rutas3').then((e) => {
      setRutas(e ? e : [])
    })
    const _unsubscribe = props.navigation.addListener('focus', () => {
      setCodOrigen('')
      setCodDestino('')
      setSeleccionandoEstacionOrigen(false)
      setSeleccionandoEstacionDestino(false)
      getTarifas.then((tarifasPaso) => {
        setTarifas(tarifasPaso)
        fetch(TIME_URL)
          .then((response) => response.text())
          .then((text) => {
            const horaServidorActual = text.split(' ')[1].replace('"', '') + ':00'
            setHoraActual(horaServidorActual)
            const codDiaActualPaso = getCodigoDiaActual()
            setCodDiaActual(codDiaActualPaso)
            let tarifaActualPaso = tarifasPaso.filter(
              (tarifa) =>
                tarifa.dia == codDiaActualPaso &&
                tarifa.inicio <= horaServidorActual &&
                horaServidorActual <= tarifa.fin,
            )[0].horario
            setTarifaActual(tarifaActualPaso)
          })
      })
      setActuando(false)
      setDiaValue('')
      setHorarioValue('')
      if (horarios.length > 0) {
        setHorarioActual(() => {})
      }
      setEstacionFin('Selecciona estación de Destino')
      setEstacionInicio('Selecciona estación de Origen')
      setRefreshing(false)
      getParam('rutas3').then((e) => {
        setRutas(e ? e : [])
      })
    })
    return () => {
      _unsubscribe()
    }
  }, [])

  const getRuta = (codOrigen, codDestino, codDia, codHorario, estacionOrigen, estacionDestino) => {
    let codigoOrigen = codOrigen.replace('Ñ', 'N')
    let codigoDestino = codDestino.replace('Ñ', 'N')
    let url = `https://www.metro.cl/api/planificadorv2.php?estacionInicio=${codigoOrigen}&estacionFin=${codigoDestino}&dia=${codDia}&hora=${codHorario}`
    setRefreshing(true)
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.estado == 0) {
          setLlamando(null)
          return
        }
        setRefreshing(false)
        AsyncStorage.removeItem('origen').then((e) => {
          AsyncStorage.removeItem('destino').then((e) => {
            setLlamando(null)
            props.navigation.push('Resultado', {
              data: json.rutas,
              dd: codDia,
              o: codOrigen,
              d: codDestino,
              origen: estacionOrigen == '' ? estacionInicio : estacionOrigen,
              destino: estacionDestino == '' ? estacionFin : estacionDestino,
              dia: dias_arr.find((dia) => dia.value == codDia).title,
              horario: codHorario,
              tarifas: tarifas,
              rutas: rutas,
              mostrarWarning: showWarning,
            })
          })
        })
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLlamando(null)
      })
  }

  return (
    <View style={[styles.contenedorGeneral, { height: Dimensions.get('window').height - 130 }]}>

      {!muestraSelectorEstacionOrigen && !muestraSelectorEstacionDestino && (
        <ScrollView>
                {showWarning && !muestraSelectorEstacionOrigen && !muestraSelectorEstacionDestino && (
        <View
          style={[
            {
              marginTop: WIDTH * 0.08,
              flexDirection: 'row',
              backgroundColor: Globals.COLOR.L2,
              padding: WIDTH * 0.05,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 20,
            },
          ]}
        >
          <ExclamasionTriangulo width={32} height={32} fill="#FFFFFF" />
          <View style={{ paddingEnd: WIDTH * 0.05 }}>
            <Text
              style={[
                Estilos.textoGeneral,
                { marginLeft: WIDTH * 0.03, marginRight: WIDTH * 0.05, textAlign: 'justify' },
              ]}
            >
              En este momento hay estaciones cerradas y/o retraso en alguna línea. Revisa tus Notificaciones para más
              información.
            </Text>
          </View>
        </View>
      )}
          <View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 8,
                height: 45,
                backgroundColor: '#FFFFFF',
                marginTop: WIDTH * 0.08,
                borderRadius: 20,
                alignItems: 'center',
                width: 224,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <Pressable
                onPress={() => {
                  setAhora(true)
                  setDiaValue('')
                  setHorarioValue('')
                }}
                style={{
                  backgroundColor: ahora ? Globals.COLOR.TURQUESA_QR : Globals.COLOR.GRIS_2,
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
                      color: ahora ? '#FFFFFF' : '#000000',
                    },
                    ahora ? Estilos.textoSubtitulo : Estilos.textoGeneral,
                  ]}
                >
                  Ahora
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAhora(false)
                  setDiaValue('')
                  setHorarioValue('')
                }}
                style={{
                  backgroundColor: ahora ? Globals.COLOR.GRIS_2 : Globals.COLOR.TURQUESA_QR,
                  width: 100,
                  height: 26,
                  borderRadius: 20,
                  marginLeft: 10,
                }}
              >
                <Text
                  style={[
                    {
                      fontSize: 16,
                      textAlign: 'center',
                      padding: 3,
                      color: ahora ? '#000000' : '#FFFFFF',
                    },
                    !ahora ? Estilos.textoSubtitulo : Estilos.textoGeneral,
                  ]}
                >
                  Más tarde
                </Text>
              </Pressable>
            </View>

            <View style={{ marginTop: WIDTH * 0.05 }}>
              <Text style={Estilos.textoSubtitulo}>Origen</Text>
            </View>
            <Pressable
              style={styles.botonEstacion}
              onPress={() => {
                if (!seleccionandoEstacionOrigen) {
                  setSeleccionandoEstacionOrigen(true)
                  setMuestraSelectorEstacionOrigen(true)
                }
              }}
            >
              <Text
                style={[
                  estacionInicio == 'Selecciona estación de Origen' ? Estilos.textoGeneral : Estilos.textoSubtitulo,
                ]}
              >
                {estacionInicio}
              </Text>
              {seleccionandoEstacionOrigen && <ActivityIndicator size="small" color={Globals.COLOR.GRIS_3} />}
              {!seleccionandoEstacionOrigen && (
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
              )}
            </Pressable>
            <View style={{ marginTop: WIDTH * 0.05 }}>
              <Text style={Estilos.textoSubtitulo}>Destino</Text>
            </View>
            <Pressable
              style={styles.botonEstacion}
              onPress={() => {
                if (!seleccionandoEstacionDestino) {
                  setSeleccionandoEstacionDestino(true)
                  setMuestraSelectorEstacionDestino(true)
                }
              }}
            >
              <Text
                style={estacionFin == 'Selecciona estación de Destino' ? Estilos.textoGeneral : Estilos.textoSubtitulo}
              >
                {estacionFin}
              </Text>
              {seleccionandoEstacionDestino && <ActivityIndicator size="small" color={Globals.COLOR.GRIS_3} />}
              {!seleccionandoEstacionDestino && (
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
              )}
            </Pressable>
            {!ahora && (
              <View style={{ marginTop: WIDTH * 0.05 }}>
                <Text style={Estilos.textoSubtitulo}>Día</Text>
                <View style={{ marginTop: WIDTH * 0.03 }}>
                  <ComboBoxCodigo
                    placeholder="Selecciona el día"
                    value={diaValue}
                    data={dias_arr}
                    campoLabel="title"
                    onChangeValue={(dia) => {
                      setDiaValue(dia.value)
                      setHorarioValue('')
                      setHorariosFiltrado(
                        horarios.filter((horario) => horario.dia == dia.value && horario.inicio < '12:00:00'),
                      ) // Menor que 12:00:00 es para evitar duplicidad por tarifas con dos bloques
                    }}
                  />
                </View>
              </View>
            )}
            {!ahora && diaValue && (
              <View style={{ marginTop: WIDTH * 0.05 }}>
                <Text style={Estilos.textoSubtitulo}>Horario</Text>
                <View style={{ marginTop: WIDTH * 0.03 }}>
                  <ComboBoxCodigo
                    placeholder="Selecciona el horario"
                    value={horarioValue}
                    data={horariosFiltrado}
                    campoLabel="title"
                    onChangeValue={(horario) => {
                      setHorarioValue(horario.param)
                    }}
                  />
                </View>
              </View>
            )}
            <View style={{ marginTop: WIDTH * 0.05, marginLeft: 'auto', marginRight: 'auto' }}>
              <BotonSimple
                texto="Planificar"
                colorTexto="#FFFFFF"
                width={WIDTH * 0.8}
                accessibilityHint="Toca 2 veces para activar"
                color={Globals.COLOR.TURQUESA_QR}
                actuando={actuando}
                onPress={() => {
                  if (ahora) {
                    setEstacionFin('Selecciona estación de Destino')
                    setEstacionInicio('Selecciona estación de Origen')
                    if (!tarifaActual) {
                      Alert.alert(
                        'Atención',
                        'Horario fuera de servicio.\nUtiliza opción "Más Tarde" para planificar tu viaje',
                        [{ text: 'Aceptar', onPress: () => {} }],
                        { cancelable: false },
                      )
                      return
                    }
                  }
                  if (refreshing) {
                    return
                  }
                  if (!codOrigen) {
                    Alert.alert(
                      'Error',
                      'Debe seleccionar una estación de origen',
                      [{ text: 'Aceptar', onPress: () => {} }],
                      { cancelable: false },
                    )
                    return
                  }
                  if (!codDestino) {
                    Alert.alert(
                      'Error',
                      'Debe seleccionar una estación de destino',
                      [{ text: 'Aceptar', onPress: () => {} }],
                      { cancelable: false },
                    )
                    return
                  }
                  if (esCombinacion(estacionInicio) && esCombinacion(estacionFin)) {
                    if (
                      estacionInicio.split(' ').slice(0, -1).join(' ') == estacionFin.split(' ').slice(0, -1).join(' ')
                    ) {
                      Alert.alert(
                        'Error',
                        'La estación de origen y destino deben ser distintas',
                        [{ text: 'Aceptar', onPress: () => {} }],
                        { cancelable: false },
                      )
                      return
                    }
                    if (
                      estacionInicio.split(' ').slice(0, -1).join(' ') == estacionFin.split(' ').slice(0, -1).join(' ')
                    ) {
                      Alert.alert(
                        'Error',
                        'La estación de origen y destino deben ser distintas',
                        [{ text: 'Aceptar', onPress: () => {} }],
                        { cancelable: false },
                      )
                      return
                    }
                  } else {
                    if (codOrigen == codDestino) {
                      Alert.alert(
                        'Error',
                        'La estación de origen y destino deben ser distintas',
                        [{ text: 'Aceptar', onPress: () => {} }],
                        { cancelable: false },
                      )
                      return
                    }
                  }
                  if (!ahora && !diaValue) {
                    Alert.alert('Error', 'Selecciona un día', [{ text: 'Aceptar', onPress: () => {} }], {
                      cancelable: false,
                    })
                    return
                  }
                  if (!ahora && !horarioValue) {
                    Alert.alert('Error', 'Selecciona un horario', [{ text: 'Aceptar', onPress: () => {} }], {
                      cancelable: false,
                    })
                    return
                  }
                  setActuando(true)
                  setTimeout(() => setAhora(true), 1000)
                  if (diaValue == '') {
                  }
                  getRuta(
                    codOrigen,
                    codDestino,
                    diaValue ? diaValue : codDiaActual,
                    horarioValue ? horarioValue : tarifaActual,
                    '',
                    '',
                  )
                }}
              />
            </View>
            { ahora && <View
              style={{
                marginTop: WIDTH * 0.08,
                backgroundColor: Globals.COLOR.GRIS_1,
                borderRadius: 20,
                paddingTop: WIDTH * 0.05,
                paddingHorizontal: WIDTH * 0.05,
                paddingBottom: rutas == null || rutas.length == 0 ? WIDTH * 0 : WIDTH * 0.05,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PlanificadorCirculo width={32} height={32} />
                <View style={{ marginLeft: WIDTH * 0.03 }}>
                  <Text style={[Estilos.textoSubtitulo]}>Mis rutas</Text>
                  {rutas?.length == 0 && (
                    <Text style={[Estilos.textoGeneral, { marginTop: WIDTH * 0.03 }]}>No tienes rutas guardadas</Text>
                  )}
                </View>
              </View>
              <View style={{ marginTop: WIDTH * 0.05 }}>
                {rutas?.length > 0 && (
                  <View style={{ marginBottom: WIDTH * 0.02, height: 1, backgroundColor: Globals.COLOR.GRIS_3 }} />
                )}
                {rutas?.map((e, i) => {
                  return (
                    <View key={`c${i}`} style={{ paddingLeft: WIDTH * 0.03 }}>
                      <CeldaFavoritosBip
                        indice={i}
                        isloading={llamando == i}
                        ontitle={(title, index) => {
                          setLlamando(i)
                          setEstacionInicio(rutas[index].origen)
                          setEstacionFin(rutas[index].destino)
                          setHorarioActual(() => {
                            if (!tarifaActual) {
                              setLlamando(null)
                              setEstacionFin('Selecciona estación de Destino')
                              setEstacionInicio('Selecciona estación de Origen')
                              Alert.alert(
                                'Atención',
                                'Horario fuera de servicio.\nUtiliza opción "Más Tarde" para planificar tu viaje',
                                [{ text: 'Aceptar', onPress: () => {} }],
                                { cancelable: false },
                              )
                              return
                            } else {
                              getRuta(
                                rutas[index].o,
                                rutas[index].d,
                                codDiaActual,
                                tarifaActual,
                                rutas[index].origen,
                                rutas[index].destino,
                              )
                            }
                          })
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
            </View>}
          </View>
        </ScrollView>
      )}
      {muestraSelectorEstacionOrigen && (
        <SelectorEstacion
          onSelect={seleccionaEstacionOrigen}
          todasEstaciones={!ahora}
          onCerrar={cerrarSelectorEstacion}
        />
      )}
      {muestraSelectorEstacionDestino && (
        <SelectorEstacion
          onSelect={seleccionaEstacionDestino}
          todasEstaciones={!ahora}
          onCerrar={cerrarSelectorEstacion}
        />
      )}
    </View>
  )
}

export default Planificador
