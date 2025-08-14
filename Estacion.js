import React from 'react'
import { useState, useEffect } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import Estilos from './Estilos'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BotonSimple from './components/BotonSimple'
import Globals from './Globals'
// Iconos de Estrella
import EstrellaSinRelleno from './assets/svg/estrella/EstrellaSinRelleno.svg'
import EstrellaFull from './assets/svg/estrella/EstrellaFull.svg'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
// Constante para determinar el Alto y Ancho de la Pantalla.
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
// Creamos los estilos que se utilizaran.
const styles = StyleSheet.create({
  container: {
    bottom: SCREEN_WIDTH * 0.05,
    padding: SCREEN_WIDTH * 0.05,
  },
})

const Estacion = (props) => {
  // Obtenemos el codigo de estacion
  const codigoEstacion = props.route.params.data.codigo
  const [loading, setLoading] = useState(true)
  const [nombreEstacion, setNombreEstacion] = useState('')
  const [linea, setLinea] = useState('')
  const [registroMetroArte, setRegistroMetroArte] = useState({})
  const [hasMetroArte, setHasMetroArte] = useState(false)
  const [directToObra, setDirectToObra] = useState(false)
  const [registro, setRegistro] = useState('')
  const [estaciionFavorita, setEstaciionFavorita] = useState(false)
  const [estacionesFavoritas, setEstacionesFavoritas] = useState([])
  

  const urlConversion = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/conversor/conversor?estacion=${codigoEstacion}`
  const urlInformacionEstacion = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/informacion/${codigoEstacion}`
  const urlMetroArte = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/metroarte?estacion=${codigoEstacion}`
  const [horario, setHorario] = useState([])
  const [equipamento, setEquipamento] = useState([])

  const [state, setState] = useState({
    favorito: false,
    codigoEstacion,
    linea: '',
  })

    // Indica si un equipamiento no tiene subsecciones (se hace de esta forma por la imposibilidad de hacerlo desde la API)
    const sinSubSeccion = [
      {opcion: 'Accesos', tipo: 'ACC', componente: 'Ascensor'},
    ]

  // Obtenemos la informacion de la estacion.
  const getInformacionEstacion = () => {
    fetch(urlInformacionEstacion)
      .then((res) => res.json())
      .then((res) => {
        setNombreEstacion(res.nombre)
        setLinea(res.linea)
        let horarioOrganizado = res.horario.sort((a, b) => a.position > b.position)
        // Asignamos la estructura del Equipamiento
        let equipamentoPaso = Object.entries(res.Equipamiento).map((item, index) => {
          item.push(false) // Aca estamos agregando la visibilidad como el elemento de la posicion [2]
          // Se veirfica si el equipamiento no tiene SubSección, enn tal caso se muestra primero
          if (sinSubSeccion.filter(sinSub => sinSub.opcion == item[0]).length == 0 )
          {
            item.push(index) // Se agrega un ordenador
          } else {
            item.push(index-100)
          }
          return item
        })
        // Organizamos el Contenido de la Ruta Expresa
        let rutaExpresaColorConfig = configTipoRutaExpresa(
          res.rutaExpresa == undefined ? undefined : res.rutaExpresa.tipo,
        )
        let hasRutaExpresa = !!rutaExpresaColorConfig
        setLoading(false)
        setHorario(horarioOrganizado)
        setEquipamento(equipamentoPaso.sort((a,b) => a[3] -b[3]))
        setState({
          ...state,
          estacion: res.nombre,
          linea: res.linea,
          hasRutaExpresa,
          rutaExpresaColorConfig,
          rutaExpresa: res.rutaExpresa, // Puede ser undefined
        })
      })
      .catch((error) => console.error(error))
  }

  const getRegistro = () => {
    fetch(urlConversion)
      .then((res) => res.json())
      .then((res) => {
        setRegistro(res.registro)
      })
  }

  // Obtenemos la informacion de MetroArte
  const getMetroArte = () => {
    fetch(urlMetroArte)
      .then((response) => response.json())
      .then((json) => {
        // Revisamos si la estacion tiene metro arte.
        const hasMetroArtePaso = json.registros != undefined
        setHasMetroArte(hasMetroArtePaso)
        // let registroMetroArte = undefined
        setDirectToObra(undefined)
        if (hasMetroArtePaso) {
          // En caso de ser un solo registro entonces solo manda la info individual de la Obra.
          const registroMetroArtePaso = json.registros.length == 1 ? json.registros[0] : json.registros
          setDirectToObra(json.registros.length == 1)
          setRegistroMetroArte(registroMetroArtePaso)
        }
      })
      .catch((error) => {
        console.warn(error)
        console.log('Estación sin Metro Arte')
      })
  }

  // Elemento de la lista de los horarios.
  const ListHorarioItems = ({ item, index, keyValue }) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: SCREEN_WIDTH * 0.03,
            justifyContent: 'space-between',
            marginTop: SCREEN_WIDTH * 0.05,
          }}
        >
          <Text style={Estilos.textoGeneral}>{item.key}</Text>
          <Text style={[Estilos.textoSubtitulo]}>{item.value}</Text>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            marginHorizontal: SCREEN_WIDTH * 0.03,
            borderBottomColor: '#CCC',
            marginTop: SCREEN_WIDTH * 0.05,
          }}
        />
      </View>
    )
  }

  // Elemento para la seleccion de equipamentos y su redireccion.
  const ItemSubSeccion = ({ subSeccion, visibilidad, keyValue }) => {
    // Si la visibilidad esta en falso retornamos un JSX vacio.
    if (!visibilidad) return <></>
    return (
      <View key={`${keyValue}_kindex${Math.round(Math.random() * 10000000)}_`}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: SCREEN_WIDTH * 0.03,
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            style={{ felx: 1, justifyContent: 'space-between', flexDirection: 'row', width: SCREEN_WIDTH * 0.85 }}
            onPress={() => navegacionPorSubseccion(subSeccion)}
          >
            <Text style={[Estilos.textoGeneral, { marginLeft: SCREEN_WIDTH * 0.05 }]}> {subSeccion} </Text>
            {tieneFlecha(subSeccion) && (
              <ChevronDown
                width={20}
                height={20}
                fill={Globals.COLOR.GRIS_3}
                style={{ transform: [{ rotate: '-90deg' }] }}
              />
            )}
          </Pressable>
        </View>
      </View>
    )
  }

  /**
   * Configurar la ruta expresa a traves del tipo provisto.
   * Se deben dejar de utilizar acentos.
   * @returns object | boolean (false)
   */
  const configTipoRutaExpresa = (tipo) => {
    if (tipo == undefined) {
      return false
    }
    let tipoFormateado = tipo.toLowerCase()
    switch (tipoFormateado) {
      case 'común':
        return { title: 'Común', color: '#000' }
      case 'roja':
        return { title: 'Roja', color: Globals.COLOR.ROJO_METRO }
      case 'verde':
        return { title: 'Verde', color: Globals.COLOR.L5 }
    }
    return false
  }

  /**
   * Funcion para obtener el componente de Flecha
   * @param {*} subSeccion
   * @returns JSX
   */
  const tieneFlecha = (subSeccion) => {
    let subSeccionesConFlecha = [
      'MetroArte',
      'Tren',
      'Bus',
      'BiciMetro',
      'U Invertida',
      'Línea Cero',
      'Linea Cero',
      'Ascensores',
      'Oficina de Atención a Clientes',
      'BiblioMetro',
      'Rampas de Acceso',
      'Acceso Nivel Calle',
      'Bicicleta - BiciMetro',
      'Bicicleta - U Invertida',
      'Bicicleta - Línea Cero',
      'Escaleras mecánicas',
      'Locales Comerciales',
    ]
    return subSeccionesConFlecha.includes(subSeccion)
  }

  /**
   * Funcion para realizar la navegacion
   * @param {*} subSeccion
   */
  const navegacionPorSubseccion = (subSeccion) => {
    let redirectToUbicacion
    let mapaDeUbicaciones = {
      Ascensores: 'Ascensor',
      'Rampas de Acceso': 'Ascensor',
      'Acceso Nivel Calle': 'Ascensor',
      Bus: 'BusRed',
      BiciMetro: 'BiciMetro',
      'Bicicleta - BiciMetro': 'BiciMetro',
      'U Invertida': 'Uinvertida',
      'Bicicleta - U Invertida': 'Uinvertida',
      'Línea Cero': 'LineaCero',
      'Bicicleta línea Cero': 'LineaCero',
      'Linea Cero': 'LineaCero',
      'Bicicleta - Línea Cero': 'LineaCero',
      Tren: 'TrenRed',
      BiblioMetro: 'BiblioMetro',
      'Oficina de Atención a Clientes': 'OficinaDeAtencionClientes',
      'Escaleras mecánicas': 'Ascensor',
      'Locales Comerciales': 'LocalesComerciales'
    }
    let tipo = ''
    switch (subSeccion) {
      case 'Ascensores':
        tipo = 'ASC'
        break
      case 'Rampas de Acceso':
        tipo = 'RDA'
        break
      case 'Acceso Nivel Calle':
        tipo = 'ANC'
        break
      case 'Escaleras mecánicas':
        tipo = 'ESC'
        break
    }
    let dataCompartida = {
      data: '', //Ascensor y Bibliometro usan esta data que viene de Equipamiento, la Api actual no lo maneja.
      codigo: props.route.params.data.codigo == 'ÑU' ? 'NU' : props.route.params.data.codigo,
      estacion: props.route.params.data.title ?? nombreEstacion,
      linea: props.route.params.data.linea,
      tipo,
    }
    // Aca asignamos hacia donde nos moveremos.
    redirectToUbicacion = mapaDeUbicaciones[subSeccion]
    // En caso de ser MetroArte realizamos una comparacion mas.
    if (subSeccion == 'MetroArte') {
      redirectToUbicacion = directToObra ? 'Obra' : 'Metroarte'
      dataCompartida.newDataMetro = registroMetroArte
    }
    if (redirectToUbicacion == undefined) return console.warn('Esta acción no tiene vista disponible.')
    // Y ahora nos redirigimos a la nueva ubicacion.
    return props.navigation.push(redirectToUbicacion, dataCompartida)
  }

  const toggleFavorita = () => {
    // Se verifica si existe la estacion en la lista de favoritos
    let estacionesFavoritasPaso = estacionesFavoritas
    if (estaciionFavorita) {
      // se quita la estación de favoritos
      estacionesFavoritasPaso = estacionesFavoritas.filter((item) => item.codigoEstacion != codigoEstacion)
      AsyncStorage.removeItem('@Fav_').then(() => {
        AsyncStorage.setItem('@Fav_', JSON.stringify(estacionesFavoritasPaso)).then(() => {
          setEstaciionFavorita(false)
        })
      })
    } else {
      // Se agrega la estación a favoritos si no exste
      if (!estacionesFavoritasPaso.find((item) => item.codigoEstacion == codigoEstacion))
        estacionesFavoritasPaso.push({
          codigoEstacion,
          isFavorite: true,
          linea,
          estacion,
        })
      AsyncStorage.removeItem('@Fav_').then(() => {
        AsyncStorage.setItem('@Fav_', JSON.stringify(estacionesFavoritasPaso)).then(() => {
          setEstaciionFavorita(true)
        })
      })
    }
  }

  useEffect(() => {
    // Cambiar el nombre del Header.
    props.navigation.setOptions({ title: 'Información Estaciones' })
    getInformacionEstacion()
    getMetroArte()
    getRegistro()
    try {
      AsyncStorage.getItem('@Fav_').then((estacionesFavoritasPaso) => {
        const estacionesFavoritasJSON = JSON.parse(estacionesFavoritasPaso)
        setEstaciionFavorita(Boolean(estacionesFavoritasJSON.find((item) => item.codigoEstacion == codigoEstacion)))
        setEstacionesFavoritas(JSON.parse(estacionesFavoritasPaso))
      })
    } catch {
      console.err('No se pudo obtener las estacines favoritas')
    }
  }, [])

  // Descomponemos el contenido necesario del State para el Render.
  const { estacion, hasRutaExpresa, rutaExpresaColorConfig, rutaExpresa } = state
  // Generamos un Loading para poder precargar la informacion, antes de mostrarla.
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SCREEN_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }
  // Necesitamos la linea formateada para poder usar el componente de TituloCirculoEstacion
  const auxLinea = linea.substring(1).toUpperCase()
  return (
    <ScrollView>
      {/*  Contenedor Padre */}
      <View style={[styles.container]}>
        {/*  Seccion Titulo de la Estación  */}
        <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', marginTop: SCREEN_WIDTH * 0.08 }}>
          <View style={{ justifyContent: 'center' }}>
            {nombreEstacion && <TituloCirculoEstacion texto={nombreEstacion} linea={auxLinea} />}
          </View>
          <View style={{ justifyContent: 'center', marginLeft: SCREEN_WIDTH * 0.05 }}>
            <Pressable
              onPress={() => {
                toggleFavorita()
              }}
            >
              {estaciionFavorita && <EstrellaFull width={32} height={32} fill={Globals.COLOR.L2} />}
              {!estaciionFavorita && <EstrellaSinRelleno width={32} height={32} fill={Globals.COLOR.GRIS_3} />}
            </Pressable>
          </View>
        </View>
        {/*  Seccion para el Horario de la Estacion  */}
        <View style={{ marginTop: SCREEN_WIDTH * 0.05 }}>
          <Text style={[Estilos.textoTitulo]}>Horario</Text>
          <View style={{ marginTop: -SCREEN_WIDTH * 0.02 }}>
            {horario.map((item, index) => (
              <ListHorarioItems
                item={item}
                index={index}
                key={`k_horario_${index}`}
              />
            ))}
          </View>
        </View>
        {/*  Seccion para la Ruta Expresa  */}
        {hasRutaExpresa && (
          <>
            <Text style={[Estilos.textoTitulo, { marginTop: SCREEN_WIDTH * 0.08 }]}>Ruta Expresa</Text>
            <View style={{ marginTop: SCREEN_WIDTH * 0.0 }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    //paddingVertical: 15,
                    paddingHorizontal: 0,
                    marginHorizontal: SCREEN_WIDTH * 0.03,
                    marginTop: SCREEN_WIDTH * 0.03,
                    justifyContent: 'space-between',
                    // width: Dimensions.get('window').width - 20,
                  }}
                >
                  <Text style={[Estilos.textoGeneral]}>Tipo Estación</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[Estilos.textoSubtitulo, { color: rutaExpresaColorConfig.color }]}>
                      {rutaExpresaColorConfig.title}
                    </Text>
                  </View>
                </View>
                {/* <View style={{ borderBottomWidth: 1, marginHorizontal: SCREEN_WIDTH * 0.03, borderBottomColor: '#CCC' }} /> */}
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: SCREEN_WIDTH * 0.03,
                  borderBottomColor: '#CCC',
                  marginTop: SCREEN_WIDTH * 0.03,
                  // marginBottom: SCREEN_WIDTH * 0.05,
                }}
              />
              <ListHorarioItems
                item={{ key: 'Horario Mañana*', value: rutaExpresa.horarioMañana }}
                keyValue={`k_ruta_expresa_morning_value_${Math.round(Math.random() * 1000)}`}
              />
              <ListHorarioItems
                item={{ key: 'Horario Tarde*', value: rutaExpresa.horarioTarde }}
                keyValue={`k_ruta_expresa_afternoon_value_${Math.round(Math.random() * 1000)}`}
              />
              <Text
                style={[
                  Estilos.textoNota,
                  { textAlign: 'right', marginRight: SCREEN_WIDTH * 0.03, marginTop: SCREEN_WIDTH * 0.03 },
                ]}
              >
                * Sólo días hábiles
              </Text>
            </View>
          </>
        )}
        {/*  Seccion para el Equipamiento */}
        <View>
          {/* <Text onPress={() => props.navigation.push('LocalesComerciales', 
          {
            data: '', //Ascensor y Bibliometro usan esta data que viene de Equipamiento, la Api actual no lo maneja.
            codigo: props.route.params.data.codigo == 'ÑU' ? 'NU' : props.route.params.data.codigo,
            estacion: props.route.params.data.title ?? nombreEstacion,
            linea: props.route.params.data.linea,
            //tipo,
          }
          )}>Prueba Locales Comerciales</Text> */}
          <Text style={[Estilos.textoTitulo, { marginTop: SCREEN_WIDTH * 0.08 }]}>Equipamiento</Text>
          {equipamento.map((item) => {
            // La categoria hace referencia a Cultura, Comercio, Accesibilidad, entre otros.
            let categoria = item[0]
            // Las subsecciones son las que tienen la accion de redireccionar.
            // MetroArte, Bus, Tren, entre otros
            let listaSubSecciones = item[1]
            // Visibilidad de la Categoria
            let visibilidad = item[2]
            return (
              // <></>
              <View key={`k__${codigoEstacion}_${categoria}`}>
                <View>
                  <Pressable
                    onPress={(e) => {
                      if (sinSubSeccion.filter(item => item.opcion == categoria).length == 0) {
                        item[2] = !visibilidad
                        equipamento[equipamento.indexOf(item)] = item
                        setState({ ...state, equipamento })
                      } else {
                        props.navigation.push(sinSubSeccion.filter(item => item.opcion == categoria)[0].componente, 
                        {
                          codigo: props.route.params.data.codigo == 'ÑU' ? 'NU' : props.route.params.data.codigo,
                          estacion: props.route.params.data.title ?? nombreEstacion,
                          linea: props.route.params.data.linea,
                          tipo: sinSubSeccion.filter(item => item.opcion == categoria)[0].tipo,
                        })
                      }
                    }}
                    style={{
                      marginHorizontal: 0,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      marginTop: SCREEN_WIDTH * 0.05,
                      paddingHorizontal: SCREEN_WIDTH * 0.05,
                      paddingTop: SCREEN_WIDTH * 0.05,
                      paddingBottom: visibilidad ? SCREEN_WIDTH * 0.03 : SCREEN_WIDTH * 0.05,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 20,
                      borderBottomLeftRadius: visibilidad ? 0 : 20,
                      borderBottomRightRadius: visibilidad ? 0 : 20,
                    }}
                  >
                    <Text style={[Estilos.textoSubtitulo]}>{categoria}</Text>
                    {sinSubSeccion.filter(item => item.opcion == categoria).length == 0 && (
                      <ChevronDown
                        width={20}
                        height={20}
                        fill={Globals.COLOR.GRIS_3}
                        style={{ transform: [{ rotate: visibilidad ? '180deg' : '0deg' }] }}
                      />
                    )}
                    {sinSubSeccion.filter(item => item.opcion == categoria).length != 0 && (
                      <ChevronDown
                        width={20}
                        height={20}
                        fill={Globals.COLOR.GRIS_3}
                        style={{ transform: [{ rotate: '-90deg' }] }}
                      />
                    )}
                  </Pressable>
                  {visibilidad && (
                    <View style={{ width: SCREEN_WIDTH * 0.9, backgroundColor: '#FFFFFF', alignItems: 'center' }}>
                      <View style={{ width: SCREEN_WIDTH * 0.8, height: 1, backgroundColor: Globals.COLOR.GRIS_3 }} />
                    </View>
                  )}
                  {sinSubSeccion.filter(item => item.opcion == categoria).length == 0 && (
                    <View
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        paddingBottom: visibilidad ? SCREEN_WIDTH * 0.05 : 0,
                      }}
                    >
                      {/* {visibilidad && <View style={{ borderBottomWidth: 1, marginHorizontal: 10, borderBottomColor: '#CCC' }}></View>} */}
                      {listaSubSecciones.map((subSeccion) => (
                        <ItemSubSeccion
                          key={`k_sub_seccion_${categoria}_${subSeccion}`}
                          subSeccion={subSeccion}
                          visibilidad={visibilidad}
                          categoria={categoria}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )
          })}
        </View>
        {/*  Seccion para la Asistencia  */}
        <View style={[{ marginTop: SCREEN_WIDTH * 0.08 }]}>
          <View>
            <Text style={[Estilos.textoTitulo]}>¿Necesitas asistencia?</Text>
            <Text
              style={[Estilos.textoGeneral, { marginHorizontal: SCREEN_WIDTH * 0.03, marginTop: SCREEN_WIDTH * 0.05 }]}
            >
              Si necesitas ayuda para ingresar o salir de la estación
            </Text>
          </View>
          <View style={{ alignItems: 'center', marginVertical: SCREEN_WIDTH * 0.05 }}>
            <BotonSimple
              texto="800 540 800"
              colorTexto="#FFFFFF"
              onPress={() => {
                return Linking.openURL(`tel:${'800540800'}`)
              }}
              color={Globals.COLOR.TURQUESA_QR}
              width={SCREEN_WIDTH * 0.8}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
export default Estacion
