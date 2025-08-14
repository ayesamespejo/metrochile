import React, { useState, useEffect} from 'react'
import { Image, Dimensions, StyleSheet, View, Text, Pressable, Linking } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import DeviceInfo from 'react-native-device-info'
import Estilos from './Estilos'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Globals from './Globals'

// Privacy settings configured below are only provided
// to allow a quick start with capturing monitoring data.
// This has to be requested from the user
// (e.g. in a privacy settings screen) and the user decision
// has to be applied similar to this example.

// Iconos SVGs
import CirculoContactanos from './assets/svg/menu/CirculoContactanos.svg'
import CirculoCulturaComunidad from './assets/svg/menu/CirculoCulturaComunidad.svg'
import CirculoHome from './assets/svg/menu/CirculoHome.svg'
import CirculoInformacioEstaciones from './assets/svg/menu/CirculoInformacioEstaciones.svg'
import CirculoMiViaje from './assets/svg/menu/CirculoMiViaje.svg'
import CirculoMisFavoritos from './assets/svg/menu/CirculoMisFavoritos.svg'
import CirculoNotificaciones from './assets/svg/menu/CirculoNotificaciones.svg'
import EstrellaFull from './assets/svg/estrella/EstrellaFull.svg'
import NuevoRectangulo from './assets/svg/avisos/NuevoRectangulo.svg'

const pronto_icon = require('./assets/icons/menu/pronto.png')

const icono = (nombre) => {
  switch (nombre) {
    case 'CirculoContactanos':
      return <CirculoContactanos width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
    case 'CirculoCulturaComunidad':
      return <CirculoCulturaComunidad width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
    case 'CirculoHome':
      return <CirculoHome width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
    case 'CirculoInformacioEstaciones':
      return <CirculoInformacioEstaciones width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
    case 'CirculoMiViaje':
      return <CirculoMiViaje width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
    case 'CirculoMisFavoritos':
      return <CirculoMisFavoritos width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
    case 'CirculoNotificaciones':
      return <CirculoNotificaciones width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
  }
}

const saveData = async (obj) => {
  try {
    await AsyncStorage.setItem(obj.key, obj.value)
  } catch (e) {
    console.log(e)
  }
}

// Imagenes
// const icono_nuevo = require('./assets/icons/menu/etiquetaNuevo.png')

import ChevronDown from './assets/svg/flechas/ChevronDown.svg'

// Altura
const MENU_WIDTH = Dimensions.get('window').width * 0.7
const MENU_ITEM_WIDTH = Math.round(MENU_WIDTH * 0.9)
const MENU_ITEM_HEIGHT = Math.round(MENU_ITEM_WIDTH * 0.9)

const ANCHO = Dimensions.get('window').width

//Variable para determinar cual es la posicion actual de la navegacion.
let actualViewInNavigation = 'Estado de la Red_'

let versionActual = ''
try {
  versionActual = DeviceInfo.getVersion()
} catch {
  versionActual = 'No fue posible obtenerla'
}

const AppMenu = (props) => {
  /* Este sera el contenido del Menu */
  const contentMenuIncial = [
    {
      id: 'menuOpcion1',
      title: 'Información de estaciones',
      visible: false,
      actionAvailable: 0,
      imgUrl: 'CirculoInformacioEstaciones',
      routeName: 'Información Estaciones_',
      subSections: [
        {
          title: 'Buscar por servicio',
        },
        {
          title: 'Buscar por estacion',
        },
      ],
    },
    {
      id: 'menuOpcion2',
      title: 'Mi viaje',
      visible: false,
      actionAvailable: 1,
      imgUrl: 'CirculoMiViaje',
      routeName: '',
      hasNewOption: false,
      subSections: [
        {
          id: 'menuOpcion2.1',
          title: 'Planificador de viajes',
          routeName: 'Planificador de Viajes_',
          isNewOption: false,
        },

        {
          id: 'menuOpcion2.2',
          title: 'Ruta expresa',
          routeName: 'Ruta Expresa_',
          isNewOption: false,
        },

        {
          id: 'menuOpcion2.3',
          title: 'Plano de la red',
          routeName: 'Plano de Red_',
          isNewOption: false,
        },
        {
          id: 'menuOpcion2.4',

          title: 'Consulta y carga bip!',
          routeName: 'Consulta bip!_',
          isNewOption: false,
        },
        {
          id: 'menuOpcion2.5',
          title: 'Tarifas',
          routeName: 'Tarifas_',
          isNewOption: false,
        },
        {
          id: 'menuOpcion2.6',
          title: 'Intermodalidad',
          routeName: 'Intermodalidad_',
          isNewOption: false,
        }
      ],
    },
    {
      id: 'menuOpcion3',
      title: 'Cultura y comunidad',
      visible: false,
      actionAvailable: 1,
      imgUrl: 'CirculoCulturaComunidad',
      routeName: '',
      hasNewOption: false,
      subSections: [
        {
          id: 'menuOpcion2.1',
          title: 'Agenda cultural',
          routeName: 'Agenda Cultural_',
          isNewOption: false,
        },
        // MetroInforma comentado hasta su fecha de lanzamiento
        {
          id: 'menuOpcion2,4',
          title: 'MetroInforma',
          routeName: 'MetroInforma_',
          isNewOption: false,
        },
        {
          id: 'menuOpcion2,2',
          title: 'Nuevos proyectos',
          routeName: 'Nuevos Proyectos_',
          isNewOption: false,
        },
        // {
        //   id: 'menuOpcion2,3',
        //   title: 'Prueba audio digital',
        //   routeName: 'Audio Digital_',
        //   isNewOption: false,
        // },
        // {
        //   id: 'menuOpcion2,5',
        //   title: 'Prueba emergencias',
        //   routeName: 'Emergencias_',
        //   isNewOption: false,
        // },
        //  {
        //      id: 'menuOpcion2,3',
        //      title: 'Tienda Metro',
        //      routeName: 'Tienda Metro',
        //      isNewOption: false
        //  }

        // Se comenta MetroPodcast ya que no se subirán audios
        //  {
        //      id: 'menuOpcion2,3',
        //      title: 'MetroPodcast',
        //      routeName: 'Audio Digital_',
        //      isNewOption: false
        //  },
      ],
    },
    {
      id: 'menuOpcion4',
      title: 'Mis favoritos',
      visible: false,
      actionAvailable: 0,
      imgUrl: 'CirculoMisFavoritos',
      routeName: 'Mis Favoritos_',
    },
    {
      id: 'menuOpcion5',
      title: 'Contáctanos',
      visible: false,
      actionAvailable: 1,
      imgUrl: 'CirculoContactanos',
      routeName: '',
      subSections: [
        {
          id: 'menuOpcion5.1',
          title: 'Emergencias - 1411',
          isLinking: 1411,
          isNewOption: false,
        },
        {
          id: 'menuOpcion5.2',
          title: 'Acoso - 1488',
          isLinking: 1488,
          isNewOption: false,
        },
        {
          id: 'menuOpcion5.3',
          title: 'Consultas - 600 600 9292',
          isLinking: 6006009292,
          isNewOption: false,
        },
        {
          id: 'menuOpcion5.4',
          title: 'Asistencia - 800 540 800',
          isLinking: 800540800,
          isNewOption: false,
        },
        {
          id: 'menuOpcion5.5',
          title: 'Sugerencias y reclamos',
          routeName: 'Sugerencias y Reclamos_',
          isNewOption: false,
        },
        {
          id: 'menuOpcion5.6',
          title: 'Oficina de atención a clientes',
          routeName: 'OAC_',
          isNewOption: false,
        },
      ],
    },
    // {
    //     id: 'menuOpcion7',
    //     title: 'Compra Online',
    //     visible: false,
    //     hasNewOption:false,
    //     actionAvailable: 0,
    //     imgUrl: require('./assets/icons/menu/menu_compra_online.png'),
    //     routeName: 'Tienda Metro'
    // },
    {
      id: 'menuOpcion6',
      title: '1488',
      visible: false,
      actionAvailable: 0,
      isLinking: 1488,
      imgUrl: '',
      routeName: '',
    },
  ]
  /**
   * Nos aseguramos que la capacidad de navegar entre los archivos tambien la tenga el padre.
   */
  props.navigationParent(props.navigation)

  const [contentMenu, setContentMenu] = useState([...contentMenuIncial])
  const [navigation, setNavigation] = useState(props.navigation)
  const [tiendaURL, setTiendaURL] = useState('')
  const [tiendaTextoBoton, setTiendaTextoBoton] = useState('')
  const [tiendaNuevoVisible, setTiendaNuevoVisible] = useState(false)

  useEffect(() => {
    updateData()
  }, [])

  const navigationThroughMenu = (title) => {
    if (title == 'Tienda Metro') {
      saveData({ key: 'tiendaURL', value: tiendaURL }).then(() => {
        saveData({ key: 'tiendaTitle', value: tiendaTextoBoton })
      })
    }
    navigation.navigate(title, { screen: title.replace('_', '') })
    actualViewInNavigation = title
  }

  const updateData = () => {
    let url = 'https://com-agenciacatedral.s3-us-west-1.amazonaws.com/metro/tienda_metro_config.json'
    fetch(`${url}`)
      .then((response) => response.json())
      .then((json) => {
        var menu = state.contentMenu.slice()
        if (json.icon == 'pronto') {
          menu[5].prontoIcon = pronto_icon
        }
        if (json.icon == 'no') {
          menu[5].hasNewOption = false
        }
        // setTiendaBotonVisible(Boolean(json.visible))
        // setTiendaTextoBoton(json.texto)
        // setTiendaIMGBoton(json.icon)
        setTiendaURL(json.url)
        setTiendaNuevoVisible(Boolean(json.nuevo))
        setTiendaMetroColor(json.color)
      })
  }

  const pressMain = (item, index) => {
    if (item.prontoIcon) return
    if (item.isLinking) return Linking.openURL(`tel:${item.isLinking}`)
    if (!item.routeName) {
      const contentMenuPaso = contentMenu.slice()
      contentMenuPaso[index].visible = !contentMenuPaso[index].visible
      setContentMenu([...contentMenuPaso])
    } else {
      navigationThroughMenu(item.routeName)
    }
  }

  const tiendaMetro = (item, index) => {
    AsyncStorage.removeItem('@llamandoTiendaMetro').then(() => {
      AsyncStorage.setItem('@llamandoTiendaMetro', 'si').then(() => {
        pressMain(item, index)
      })
    })
  }
  return (
    //Menu
    <DrawerContentScrollView scrollEnabled={true}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://d37nosr7rj2kog.cloudfront.net/Logo+Metro.png' }}
          style={{ resizeMode: 'contain', height: 80, width: 180 }}
        />
      </View>
      {/** Separacion de Logo con la Seccion del menu */}
      {/** Seccion de Estado de la Red y Notificaciones */}
      <View style={{ display: 'flex', width: ANCHO * 0.75 }}>
        <View style={{ flexDirection: 'row', marginLeft: ANCHO * 0.05, justifyContent: 'space-between' }}>
          <Pressable accessibilityHint="Toca 2 veces para activar" onPress={() => navigationThroughMenu('Home')}>
            <View style={[styles.tarjetaBoton, { width: ANCHO * 0.34 }]}>
              <CirculoHome width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
              <Text
                style={[
                  Estilos.textoGeneral,
                  { marginTop: ANCHO * 0.03 },
                  actualViewInNavigation == 'Home' ? { fontWeight: 'bold' } : {},
                ]}
              >
                Inicio
              </Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityHint="Toca 2 veces para activar"
            onPress={() => navigationThroughMenu('Notificaciones_')}
          >
            <View style={[styles.tarjetaBoton, { width: ANCHO * 0.34 }]}>
              <CirculoNotificaciones width={24} height={24} fill={Globals.COLOR.ROJO_METRO} />
              <Text
                style={[
                  Estilos.textoGeneral,
                  { marginTop: ANCHO * 0.03 },
                  actualViewInNavigation == 'Notificaciones_' ? { fontWeight: 'bold' } : {},
                ]}
              >
                Notificaciones
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/** Seccion del menu para las demas opciones que no tienen la forma de Estado de la Red y Notificaciones */}
      <View
        style={{
          flexDirection: 'column',
          marginLeft: 'auto',
          marginRight: 'auto',
          // marginTop: ANCHO * 0.05,
          alignContent: 'center',
          // width: '100%',
          // backgroundColor: 'blue'
        }}
      >
        {contentMenu.map((item, index) => {
          return (
            <View
              style={item.isLinking ? styles.cardContainerLinking : styles.cardContainerInformacionEstacion}
              key={`ms__${item.id}__${index}`}
            >
              {item.routeName === 'Tienda Metro' ? (
                <Pressable
                  accessibilityHint="Toca 2 veces para activar"
                  style={[styles.PressableHeader]}
                  onPress={() => tiendaMetro(item, index)}
                >
                  {icono(item.imgUrl)}
                  <Text
                    style={[
                      Estilos.subtitulos,
                      actualViewInNavigation == item.routeName ? {} : [Estilos.tipografiaLight, { color: '#43464E' }],
                      item.isLinking
                        ? [Estilos.tipografiaBold, { color: 'white', marginLeft: 'auto', marginRight: 'auto' }]
                        : { marginLeft: '2%', top: 2 },
                    ]}
                  >
                    {item.title}
                  </Text>
                  {Boolean(item.visible) == false && item.hasNewOption && (
                    <Image
                      source={item.prontoIcon ? item.prontoIcon : icono_nuevo}
                      style={
                        item.prontoIcon
                          ? { width: 45, height: 45, marginLeft: 30, position: 'absolute', right: 5, top: -7 }
                          : { width: 55, height: 25, marginLeft: 30 }
                      }
                    />
                  )}
                  {Boolean(item.actionAvailable) == false ? (
                    <></>
                  ) : (
                    <>
                      <View
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 8,
                          transform: [{ rotate: item.visible ? '180deg' : '0deg' }],
                        }}
                      >
                        <ChevronDown width={16} height={16} fill={Globals.COLOR.GRIS_3} />
                      </View>
                    </>
                  )}
                </Pressable>
              ) : (
                <Pressable
                  accessibilityHint="Toca 2 veces para activar"
                  style={[
                    item.isLinking ? styles.Pressablelinking : styles.PressableHeader,
                    { justifyContent: 'space-between' },
                  ]}
                  onPress={() => pressMain(item, index)}
                >
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
                    {!item.isLinking && icono(item.imgUrl)}
                    <View style={{ flex: 1, alignItems: item.isLinking ? 'center' : '', alignSelf: 'center' }}>
                      <Text
                        style={[
                          Estilos.textoGeneral,
                          actualViewInNavigation == item.routeName ? { fontWeight: 'bold' } : {},
                          item.isLinking ? [Estilos.textoTitulo, { color: 'white' }] : { marginLeft: ANCHO * 0.03 },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </View>
                  {Boolean(item.visible) == false && item.hasNewOption && (
                        <EstrellaFull width={24} height={24} fill={Globals.COLOR.L2}/>
                    // <Image
                    //   source={item.prontoIcon ? item.prontoIcon : icono_estrella}
                    //   style={
                    //     item.prontoIcon
                    //       ? { width: 45, height: 45, marginLeft: 30, position: 'absolute', right: 5 }
                    //       : { width: 25, height: 25, marginLeft: ANCHO * 0.03 }
                    //   }
                    // />
                  )}
                  {Boolean(item.actionAvailable) == false ? (
                    <></>
                  ) : (
                    <View
                      style={{
                        transform: [{ rotate: item.visible ? '180deg' : '0deg' }],
                      }}
                    >
                      <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} />
                    </View>
                  )}
                </Pressable>
              )}
              {/* Esta es la linea de abajo. */}
              {!item.visible ? (
                <></>
              ) : (
                <View
                  style={{
                    borderBottomWidth: 1,
                    marginHorizontal: ANCHO * 0.05,
                    borderBottomColor: Globals.COLOR.GRIS_3,
                  }}
                />
              )}
              {!item.subSections || !item.visible ? (
                <></>
              ) : (
                item.subSections.map((itemSubSection, indexSubSection) => (
                  <View
                    style={{ marginLeft: ANCHO * 0.08, marginTop: ANCHO * 0.03 }}
                    key={`mss__${itemSubSection.id}__${indexSubSection}`}
                  >
                    <Pressable
                      accessibilityHint="Toca 2 veces para activar"
                      style={[
                        styles.PressableDetalle,
                        { paddingBottom: indexSubSection == item.subSections.length - 1 ? ANCHO * 0.05 : 0 },
                      ]}
                      onPress={() => {
                        if (itemSubSection.isLinking) return Linking.openURL(`tel:${itemSubSection.isLinking}`)
                        if (itemSubSection.routeName) {
                          if (itemSubSection.routeName == 'Planificador de Viajes_') {
                            // Si se está llamando al planificador se deben limiar unas variables
                            AsyncStorage.removeItem('origen').then(() =>
                              AsyncStorage.removeItem('destino').then(() => {
                                return navigationThroughMenu(itemSubSection.routeName)
                              }),
                            )
                          } else {
                            return navigationThroughMenu(itemSubSection.routeName)
                          }
                        }
                      }}
                    >
                      <Text
                        style={[
                          Estilos.textoGeneral,
                          actualViewInNavigation == itemSubSection.routeName ? { fontWeight: 'bold' } : {},
                        ]}
                      >
                        {itemSubSection.title}
                      </Text>
                      {itemSubSection.isNewOption && (
                        <View
                          style={{ position: 'absolute', right: ANCHO * 0.08, width: 55, height: 25 }}
                        >
                          <NuevoRectangulo width={55} height={25} fill={Globals.COLOR.L2}/>
                          </View>
                      )}
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          )
        })}
      </View>
      <Text style={[Estilos.textoNota, { marginTop: ANCHO * 0.08, textAlign: 'center' }]}>
        Versión: {versionActual}
      </Text>
    </DrawerContentScrollView>
  )
}

export default AppMenu

// Estilos
const styles = StyleSheet.create({
  tarjetaBoton: {
    padding: ANCHO * 0.03,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
    alignItems: 'center',
  },
  cardContainerEstadoDeRedNotificaciones: {
    borderRadius: 20,
    width: MENU_WIDTH * 0.5,
    height: MENU_ITEM_HEIGHT * 0.3,
    maxHeight: MENU_ITEM_HEIGHT * 0.3,
    backgroundColor: 'white',
  },
  cardContainerInformacionEstacion: {
    marginTop: ANCHO * 0.05,
    width: MENU_WIDTH * 1.03,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
  },
  cardContainerLinking: {
    marginTop: ANCHO * 0.08,
    width: MENU_WIDTH * 0.6,
    height: 45,
    borderRadius: 25,
    backgroundColor: Globals.COLOR.ROJO_METRO,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tinyLogo: {
    resizeMode: 'contain',
    width: 180,
  },
  PressableHeader: {
    flexDirection: 'row',
    padding: ANCHO * 0.05,
  },
  Pressablelinking: {
    flexDirection: 'row',
    top: 15,
  },
  PressableDetalle: {
    flexDirection: 'row',
  },
})
