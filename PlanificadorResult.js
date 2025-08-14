import React, { useState, useEffect } from 'react'
import { Dimensions, Alert, View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native'
import Estilos from './Estilos'
import DialogInput from 'react-native-dialog-input'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormatAndPrintAccebilidad from './FormatAndPrintAccesibilidad'
import BotonSimple from './components/BotonSimple'
import Globals from './Globals'
import Linea1 from './assets/svg/lineas/Linea1.svg'
import Linea2 from './assets/svg/lineas/Linea2.svg'
import Linea3 from './assets/svg/lineas/Linea3.svg'
import Linea4 from './assets/svg/lineas/Linea4.svg'
import Linea4A from './assets/svg/lineas/Linea4A.svg'
import Linea5 from './assets/svg/lineas/Linea5.svg'
import Linea6 from './assets/svg/lineas/Linea6.svg'
import PlanificadorCirculo from './assets/svg/planificador/PlanificadorCirculo.svg'
import CalendarioAgendaCultural from './assets/svg/cultura_comunidad/CalendarioAgendaCultural.svg'
import IconoHorariosRutaExpresa from './assets/svg/cultura_comunidad/IconoHorariosRutaExpresa.svg'
import Linea7NuevosProyectos from './assets/svg/estado_red/Linea7NuevosProyectos.svg'
import Estacion from './assets/svg/planificador/Estacion.svg'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
import CombinacionPlanificador from './assets/svg/planificador/CombinacionPlanificador.svg'
import ExclamasionTriangulo from './assets/svg/comun/ExclamasionTriangulo.svg'
const SCREEN_WIDTH = Dimensions.get('window').width

const altoTramo = 170
const margenIzq = 13
const anchoIconoLinea = 20
const anchoLinea = 20
const altoTexto = 30
const anchoTexto = SCREEN_WIDTH * 0.7

/**
 * Constante para los Estilos.
 */
const styles = StyleSheet.create({
  contenedorGeneral: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  tarjeta: {
    borderRadius: 20,
    padding: SCREEN_WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
  },
  linea: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.8,
  },
  textoLinea: [Estilos.textoGeneral, { marginLeft: SCREEN_WIDTH * 0.05, flex: 1 }],
})

const Circulo = ({ linea }) => (
  <View style={{ marginLeft: 0 }}>
    {linea.toUpperCase() == 'L1' && <Linea1 width={24} height={24} />}
    {linea.toUpperCase() == 'L2' && <Linea2 width={24} height={24} />}
    {linea.toUpperCase() == 'L3' && <Linea3 width={24} height={24} />}
    {linea.toUpperCase() == 'L4' && <Linea4 width={24} height={24} />}
    {linea.toUpperCase() == 'L4A' && <Linea4A width={24} height={24} />}
    {linea.toUpperCase() == 'L5' && <Linea5 width={24} height={24} />}
    {linea.toUpperCase() == 'L6' && <Linea6 width={24} height={24} />}
  </View>
)

const esCombinacion = (nombre) => {
  const expRegular = /^L[1-6]/
  if (expRegular.test(nombre.split(' ')[nombre.split(' ').length - 1])) return true
  else false
}

const Ruta = ({ ruta, indice }) => {
  const [mostrarRuta, setMostrarRuta] = useState(indice == 0)
  return (
    <View style={{ marginTop: SCREEN_WIDTH * 0.05 }}>
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: Globals.COLOR.GRIS_1,
          padding: SCREEN_WIDTH * 0.05,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: mostrarRuta ? 0 : 20,
          borderBottomRightRadius: mostrarRuta ? 0 : 20,
          alignItems: 'center',
        }}
        onPress={() => setMostrarRuta(!mostrarRuta)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PlanificadorCirculo width={24} height={24} />
          <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
            {indice == 0 && <Text style={[Estilos.textoSubtitulo]}>Mejor ruta: {ruta.estaciones} estaciones</Text>}
            {indice > 0 && <Text style={[Estilos.textoSubtitulo]}>Ruta alternativa {indice}</Text>}
            <Text style={[Estilos.textoGeneral, { marginTop: SCREEN_WIDTH * 0.03 }]}>
              {ruta.estaciones} estaciones en {ruta.tiempo} min. aprox.
            </Text>
          </View>
        </View>
        <ChevronDown
          width={20}
          height={20}
          fill={Globals.COLOR.GRIS_3}
          style={{ transform: [{ rotate: mostrarRuta ? '180deg' : '0deg' }] }}
        />
      </Pressable>
      {mostrarRuta && (
        <View
          style={{ backgroundColor: Globals.COLOR.GRIS_1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
          <View
            style={{
              width: SCREEN_WIDTH * 0.8,
              height: 1,
              backgroundColor: Globals.COLOR.GRIS_3,
              marginLeft: SCREEN_WIDTH * 0.05,
            }}
          />
          <View style={{ padding: SCREEN_WIDTH * 0.05, paddingTop: SCREEN_WIDTH * 0.07 }}>
            {ruta.tramos.map((tramo, index) => {
              return (
                <View key={`T_${index}`}>
                  {tramo.tipo == 'cambio' && (
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: anchoIconoLinea }}>
                        <Circulo linea={tramo.inicio.linea} />
                      </View>
                      <View style={{ marginLeft: 13, width: anchoLinea, height: altoTramo }}>
                        <View
                          style={{
                            height: altoTramo / 2,
                            backgroundColor: Globals.COLOR[tramo.inicio.linea.toUpperCase()],
                            borderTopLeftRadius: index == 0 ? anchoLinea / 2 : 0,
                            borderTopRightRadius: index == 0 ? anchoLinea / 2 : 0,
                          }}
                        />
                        <View
                          style={{
                            height: altoTramo / 2,
                            backgroundColor: Globals.COLOR[tramo.fin.linea.toUpperCase()],
                            borderBottomLeftRadius: index == ruta.tramos.length - 1 ? anchoLinea / 2 : 0,
                            borderBottomRightRadius: index == ruta.tramos.length - 1 ? anchoLinea / 2 : 0,
                          }}
                        />
                        <View style={{ position: 'absolute', top: altoTramo / 2 - anchoLinea / 2 }}>
                          <CombinacionPlanificador width={anchoLinea} height={anchoLinea} />
                        </View>
                        <View style={{ position: 'absolute', top: 0 }}>
                          <Linea7NuevosProyectos width={anchoLinea} height={anchoLinea} />
                        </View>
                        {index == ruta.tramos.length - 1 && (
                          <View style={{ position: 'absolute', top: altoTramo - anchoLinea }}>
                            <Linea7NuevosProyectos width={anchoLinea} height={anchoLinea} />
                          </View>
                        )}
                      </View>
                      <View style={{ marginLeft: margenIzq }}>
                        <View style={{ marginTop: index == 0 ? 0 : 0, height: altoTexto }}>
                          <Text style={Estilos.textoSubtitulo}>{tramo.inicio.nombre}</Text>
                        </View>
                        <View>
                          <FormatAndPrintAccebilidad
                            codEstacion={tramo.inicio.sigla}
                            nombreEstacion={tramo.inicio.nombre}
                            linea={tramo.inicio.linea}
                          />
                        </View>
                        <View style={{ marginTop: 15, height: altoTexto, flexDirection: 'row' }}>
                          <Text style={Estilos.textoSubtitulo}>Combinación</Text>
                          <View style={{ marginLeft: 10, marginTop: -3 }}>
                            <Circulo linea={tramo.fin.linea} />
                          </View>
                        </View>
                        <View style={{ marginTop: -2, height: altoTexto }}>
                          <Text style={Estilos.textoGeneral}>Dirección: {tramo.direccion}</Text>
                        </View>
                        {index == ruta.tramos.length - 1 && (
                          <View style={{ marginTop: 17 }}>
                            <View style={{ height: altoTexto }}>
                              <Text style={Estilos.textoSubtitulo}>{tramo.fin.nombre}</Text>
                            </View>
                            <View>
                              <FormatAndPrintAccebilidad
                                codEstacion={tramo.fin.sigla}
                                nombreEstacion={tramo.fin.nombre}
                                linea={tramo.fin.linea}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  {tramo.tipo == 'tramo' && (
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: anchoIconoLinea, marginTop: index == 0 ? 0 : -anchoLinea / 2 }}>
                        <Circulo linea={tramo.inicio.linea} />
                      </View>
                      <View
                        style={{ marginLeft: 13, width: anchoLinea, height: index == 0 ? altoTramo : altoTramo * 0.9 }}
                      >
                        <View
                          style={{
                            height: altoTramo,
                            backgroundColor: Globals.COLOR[tramo.fin.linea.toUpperCase()],
                            borderTopLeftRadius: index == 0 ? anchoLinea / 2 : 0,
                            borderTopRightRadius: index == 0 ? anchoLinea / 2 : 0,
                            borderBottomLeftRadius: index == ruta.tramos.length - 1 ? anchoLinea / 2 : 0,
                            borderBottomRightRadius: index == ruta.tramos.length - 1 ? anchoLinea / 2 : 0,
                          }}
                        />
                        {!esCombinacion(tramo.inicio.nombre) && (
                          <View style={{ position: 'absolute', top: index == 0 ? 0 : -anchoLinea / 2 }}>
                            <Estacion width={anchoLinea} height={anchoLinea} fill="#FFFFFF" />
                          </View>
                        )}
                        {esCombinacion(tramo.inicio.nombre) && (
                          <View style={{ position: 'absolute', top: index == 0 ? 0 : -anchoLinea / 2 }}>
                            <Linea7NuevosProyectos width={anchoLinea} height={anchoLinea} />
                          </View>
                        )}

                        {index == ruta.tramos.length - 1 && !esCombinacion(tramo.fin.nombre) && (
                          <View style={{ position: 'absolute', top: altoTramo - anchoLinea }}>
                            <Estacion width={anchoLinea} height={anchoLinea} fill="#FFFFFF" />
                          </View>
                        )}
                        {index == ruta.tramos.length - 1 && esCombinacion(tramo.fin.nombre) && (
                          <View style={{ position: 'absolute', top: altoTramo - anchoLinea }}>
                            <Linea7NuevosProyectos width={anchoLinea} height={anchoLinea} />
                          </View>
                        )}
                      </View>
                      <View style={{ marginLeft: margenIzq }}>
                        <View style={{ marginTop: index == 0 ? 0 : -anchoLinea / 2 }}>
                          <View style={{ height: altoTexto }}>
                            <Text style={Estilos.textoSubtitulo}>{tramo.inicio.nombre}</Text>
                          </View>
                          <View style={{ marginTop: index == 0 ? 0 : 0, height: altoTexto }}>
                            <Text style={Estilos.textoGeneral}>Dirección: {tramo.direccion}</Text>
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <FormatAndPrintAccebilidad
                              codEstacion={tramo.inicio.sigla}
                              nombreEstacion={tramo.inicio.nombre}
                              linea={tramo.inicio.linea}
                            />
                          </View>
                        </View>
                        {index == ruta.tramos.length - 1 && (
                          <View style={{ marginTop: index == 0 ? 55 : 65 }}>
                            <View style={{ height: altoTexto }}>
                              <Text style={Estilos.textoSubtitulo}>{tramo.fin.nombre}</Text>
                            </View>
                            <FormatAndPrintAccebilidad
                              codEstacion={tramo.fin.sigla}
                              nombreEstacion={tramo.fin.nombre}
                              linea={tramo.fin.linea}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  {tramo.tipo == 'combinacion' && (
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: anchoIconoLinea }}></View>
                      <View style={{ marginLeft: 13, width: anchoLinea, height: altoTramo }}>
                        <View
                          style={{
                            height: altoTramo / 2,
                            backgroundColor: Globals.COLOR.GRIS_3,
                            borderTopLeftRadius: index == 0 ? anchoLinea / 2 : 0,
                            borderTopRightRadius: index == 0 ? anchoLinea / 2 : 0,
                          }}
                        />
                        <View
                          style={{
                            height: altoTramo / 2,
                            backgroundColor: Globals.COLOR.GRIS_3,
                            borderBottomLeftRadius: index == ruta.tramos.length - 1 ? anchoLinea / 2 : 0,
                            borderBottomRightRadius: index == ruta.tramos.length - 1 ? anchoLinea / 2 : 0,
                          }}
                        />
                        <View style={{ position: 'absolute', top: -anchoLinea / 2 }}>
                          <Linea7NuevosProyectos width={anchoLinea} height={anchoLinea} />
                        </View>
                        <View style={{ position: 'absolute', top: altoTramo / 2 - anchoLinea / 2 }}>
                          <CombinacionPlanificador width={anchoLinea} height={anchoLinea} />
                        </View>
                      </View>
                      <View style={{ marginLeft: margenIzq, marginTop: -anchoLinea / 2, width: anchoTexto }}>
                        <View style={{ height: altoTexto }}>
                          <Text style={Estilos.textoSubtitulo}>{ruta.tramos[index - 1].fin.nombre}</Text>
                        </View>
                        <View style={{ marginTop: 7 }}>
                          <FormatAndPrintAccebilidad
                            codEstacion={ruta.tramos[index - 1].fin.sigla}
                            nombreEstacion={ruta.tramos[index - 1].fin.nombre}
                            linea={ruta.tramos[index - 1].fin.linea}
                          />
                        </View>
                        <View
                          style={{ height: altoTexto, position: 'absolute', top: altoTramo / 2, flexDirection: 'row' }}
                        >
                          <Text style={Estilos.textoSubtitulo}>Combinación</Text>
                          <View style={{ marginLeft: 10, marginTop: -3 }}>
                            <Circulo linea={tramo.linea} />
                          </View>
                        </View>
                        <View style={{ height: altoTexto, position: 'absolute', top: 113 }}>
                          <Text style={Estilos.textoGeneral}>Dirección: {tramo.direccion}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      )}
    </View>
  )
}

/**
 * Constantes Logicas
 */
const diasSemanales = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']
const finDeSemanaOFestivos = ['Sábado', 'Domingo', 'Domingo y Festivos']

const PlanificadorResult = (props) => {
  const [mostrarTarifas, setMostrarTarifas] = useState(false)
  const [tarifas, setTarifas] = useState([])
  const [comentario, setComentario] = useState('')
  const [rutaGuardada, setRutaGuardada] = useState(false)
  const [state, setState] = useState({
    data: props.route.params.data,
    dia: props.route.params.dia,
    isDialogVisible: false,
    visibles: [],
    accesibilidad: [],
  })

  storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('rutas3', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  getData = async (k) => {
    try {
      const jsonValue = await AsyncStorage.getItem(k)

      return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
      console.log(e)
    }
  }

  const guardarRuta = (origen, destino, dia, horario) => {
    getData('rutas3').then((e) => {
      let rutas = e == null ? [] : e
      rutas.push({
        o: props.route.params.o,
        d: props.route.params.d,
        origen: origen,
        destino: destino,
        dia: dia,
        diaParam: props.route.params.dd,
        horario: horario,
      })
      storeData(rutas).then((e) => {
        setRutaGuardada(true)
        Alert.alert('Ruta guardada', '', [{ text: 'Aceptar', onPress: () => {} }], { cancelable: false })
      })
    })
  }

  const borrarRuta = (o, d) => {
    AsyncStorage.setItem(
      'rutas3',
      JSON.stringify(
        props.route.params.rutas.filter((ruta) => ruta.o != props.route.params.o || ruta.d != props.route.params.d),
      ),
    ).then(() => {
      setRutaGuardada(false)
      Alert.alert('Ruta borrada', '', [{ text: 'Aceptar', onPress: () => {} }], { cancelable: false })
    })
  }

  const getTarifas = (horario) => {
    let urlTarifas = ''
    if (horario == 'BAJO')
      urlTarifas = 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/tarifario/HorarioBajo'
    else if (horario == 'PUNTA')
      urlTarifas = 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/tarifario/HorarioPunta'
    else if (horario == 'VALLE')
      urlTarifas = 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/tarifario/HorarioValle'

    fetch(urlTarifas)
      .then((response) => response.json())
      .then((data) => {
        setTarifas(data.Item.tarifa)
        setComentario(data.Item.comentario)
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    setRutaGuardada(
      props.route.params.rutas.find((ruta) => ruta.o == props.route.params.o && ruta.d == props.route.params.d) !=
        undefined,
    )
    getTarifas(props.route.params.horario)
    const _unsubscribe = props.navigation.addListener('focus', () => {
      setState({
        ...state,
        visibles: [],
        accesibilidad: [],
        data: props.route.params.data,
      })
    })
    return () => {
      _unsubscribe()
    }
  }, [])
  /**
   * Funcion que retorna un texto dependiendo si es dia semanal o fin de semana / festivo.
   * @returns String
   */
  const getDiasString = () => {
    const { dia } = props.route.params
    if (dia.length > 2) return dia
    if (diasSemanales.indexOf(dia) != -1) return 'Lunes a Viernes'

    if (finDeSemanaOFestivos.indexOf(dia) != -1) return finDeSemanaOFestivos[finDeSemanaOFestivos.indexOf(dia)]
  }
  let { data, isDialogVisible, visibles } = state
  let diaFormateado = getDiasString()
  return (
    <ScrollView style={styles.contenedorGeneral}>
      <DialogInput
        modalStyle={{ marginTop: -100 }}
        isDialogVisible={isDialogVisible}
        title={'Guardar Ruta'}
        message={'Ingresa un nombre para tu ruta'}
        hintInput={''}
        submitInput={(inputText) => {
          guardarRuta(inputText)
        }}
        closeDialog={() => {
          setState({ ...state, isDialogVisible: false })
        }}
      ></DialogInput>
      {props.route.params.mostrarWarning && (
        <View
          style={[
            {
              marginTop: SCREEN_WIDTH * 0.08,
              flexDirection: 'row',
              backgroundColor: Globals.COLOR.L2,
              padding: SCREEN_WIDTH * 0.05,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 20,
            },
          ]}
        >
          <ExclamasionTriangulo width={32} height={32} fill="#FFFFFF" />
          <View style={{ paddingEnd: SCREEN_WIDTH * 0.05 }}>
            <Text style={[Estilos.textoGeneral, { marginLeft: SCREEN_WIDTH * 0.03, marginRight: SCREEN_WIDTH * 0.05, textAlign: 'justify' }]}>
              En este momento hay estaciones cerradas y/o retraso en alguna línea. Revisa tus Notificaciones para más
              información.
            </Text>
          </View>
        </View>
      )}
      <View style={[styles.tarjeta, { marginTop: SCREEN_WIDTH * 0.08 }]}>
        <View style={[styles.linea]}>
          <PlanificadorCirculo width={24} height={24} />
          <Text style={styles.textoLinea}>
            Desde <Text style={Estilos.textoSubtitulo}>{props.route.params.origen}</Text> hasta{' '}
            <Text style={Estilos.textoSubtitulo}>{props.route.params.destino}</Text>
          </Text>
        </View>
        <View style={[styles.linea, { marginTop: SCREEN_WIDTH * 0.05 }]}>
          <CalendarioAgendaCultural width={24} height={24} />
          <Text style={styles.textoLinea}>
            <Text style={Estilos.textoGeneral}>
              {diaFormateado} - Horario {props.route.params.horario}
            </Text>
          </Text>
        </View>
        <View style={[styles.linea, { marginTop: SCREEN_WIDTH * 0.05 }]}>
          <IconoHorariosRutaExpresa width={24} height={24} />
          <Text style={styles.textoLinea}>
            <Text style={Estilos.textoGeneral}>{`${data[0].estaciones} estaciones, ${data[0].tiempo} min.`}</Text>
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'center', marginTop: SCREEN_WIDTH * 0.05 }}>
        {!rutaGuardada && (
          <BotonSimple
            texto="Guardar ruta"
            colorTexto="#FFFFFF"
            width={SCREEN_WIDTH * 0.8}
            color={Globals.COLOR.TURQUESA_QR}
            onPress={() => {
              guardarRuta(
                props.route.params.origen,
                props.route.params.destino,
                diaFormateado,
                props.route.params.horario,
              )
            }}
          />
        )}
        {rutaGuardada && (
          <BotonSimple
            texto="Borrar ruta"
            colorTexto="#FFFFFF"
            width={SCREEN_WIDTH * 0.8}
            color={Globals.COLOR.AZUL_PLANIFICADOR}
            onPress={() => {
              borrarRuta(props.route.params.o, props.route.params.d)
            }}
          />
        )}
      </View>
      <View style={[styles.tarjeta, { marginTop: SCREEN_WIDTH * 0.05 }]}>
        <Pressable
          style={[styles.linea, { justifyContent: 'space-between' }]}
          onPress={() => {
            setMostrarTarifas(!mostrarTarifas)
          }}
        >
          <Text style={Estilos.textoSubtitulo}>Tarifas</Text>
          <ChevronDown
            width={20}
            height={20}
            fill={Globals.COLOR.GRIS_3}
            style={{ transform: [{ rotate: mostrarTarifas ? '180deg' : '0deg' }] }}
          />
        </Pressable>
        {mostrarTarifas && (
          <View>
            <View
              style={{
                width: SCREEN_WIDTH * 0.8,
                height: 1,
                backgroundColor: Globals.COLOR.GRIS_3,
                marginTop: SCREEN_WIDTH * 0.05,
                marginBottom: SCREEN_WIDTH * 0.02,
              }}
            />
            <View style={[styles.linea, { marginTop: SCREEN_WIDTH * 0.03 }]}>
              <Text style={Estilos.textoSubtitulo}>Horario {props.route.params.horario}</Text>
            </View>
            <View style={[styles.linea, { justifyContent: 'space-between', marginTop: SCREEN_WIDTH * 0.03 }]}>
              <Text style={Estilos.textoGeneral}>Metro</Text>
              <Text style={Estilos.textoSubtitulo}>{tarifas[0]['Metro']}</Text>
            </View>
            <View style={[styles.linea, { justifyContent: 'space-between', marginTop: SCREEN_WIDTH * 0.03 }]}>
              <Text style={Estilos.textoGeneral}>Bus Red + Metro*</Text>
              <Text style={Estilos.textoSubtitulo}>{tarifas[1]['Bus Red + Metro *']}</Text>
            </View>
            <View style={[styles.linea, { justifyContent: 'space-between', marginTop: SCREEN_WIDTH * 0.03 }]}>
              <Text style={Estilos.textoGeneral}>Tren Nos + Metro *</Text>
              <Text style={Estilos.textoSubtitulo}>{tarifas[2]['Tren Nos + Metro *']}</Text>
            </View>
            <View style={[styles.linea, { justifyContent: 'space-between', marginTop: SCREEN_WIDTH * 0.03 }]}>
              <Text style={Estilos.textoGeneral}>Estudiantes</Text>
              <Text style={Estilos.textoSubtitulo}>{tarifas[3]['Estudiantes']}</Text>
            </View>
            <View style={[styles.linea, { justifyContent: 'space-between', marginTop: SCREEN_WIDTH * 0.03 }]}>
              <Text style={Estilos.textoGeneral}>Tarjeta Adulto Mayor (sólo Metro)</Text>
              <Text style={Estilos.textoSubtitulo}>{tarifas[4]['Tarjeta Adulto Mayor (sólo Metro)']}</Text>
            </View>
            <View style={[styles.linea, { justifyContent: 'space-between', marginTop: SCREEN_WIDTH * 0.03 }]}>
              <Text style={Estilos.textoGeneral}>bip! Adulto Mayor</Text>
              <Text style={Estilos.textoSubtitulo}>{tarifas[5]['bip! Adulto Mayor']}</Text>
            </View>
            <Text style={[Estilos.textoNota, { marginTop: SCREEN_WIDTH * 0.05 }]}>{comentario}</Text>
          </View>
        )}
      </View>
      {data.map((rutaAlternatva, indice) => (
        <Ruta key={`R_${indice}`} ruta={rutaAlternatva} indice={indice} />
      ))}
      <View style={{ height: SCREEN_WIDTH * 0.1 }} />
    </ScrollView>
  )
}
export default PlanificadorResult
