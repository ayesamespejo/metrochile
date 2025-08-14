/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useState, } from 'react'
import {
  AppState,
  Platform,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  Linking,
  Alert,
  View,
  Dimensions,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { DrawerActions } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DeviceInfo from 'react-native-device-info'
// import UserInactiveCheck from 'react-native-user-inactivity-check'

import EstadoDeLaRed from './screens/EstadoDeLaRed'
// import Emergencias from './Emergencias'
import Alerta from './Alerta'
import Agenda from './Agenda'
import AgendaDetalle from './AgendaDetalle'
import AudioDigital from './AudioDigital'
import NuevosProyectos from './NuevosProyectos'
import NuevosProyectosDetalle from './NuevosProyectosDetalle'
import NuevosProyectosPlano from './NuevosProyectosPlano'
// import NuevosProyectosEstaciones from './NuevosProyectosEstaciones'
import NuevosProyectosImagenes from './NuevosProyectosImagenes'
import Home from './screens/Home'
import CulturaYComunidad from './screens/CulturaYComunidad'
import RutaExpresa from './RutaExpresa'
import RutaExpresaAyuda from './RutaExpresaAyuda'
import Tarifas from './Tarifas'
import MapaRed from './screens/MapaRed'
// import SaldoBip from './SaldoBip'
import ConsultaBip from './ConsultaBip'
import Configuracion from './Configuracion'
import Planificador from './Planificador'
import InformacionEstaciones from './InformacionEstaciones'
import Estacion from './Estacion'
import BusRed from './BusRed'
import TrenRed from './TrenRed'
import BiciMetro from './BiciMetro'
import BiciMetroReglamento from './BiciMetroReglamento'
import BiciMetroAyuda from './BiciMetroAyuda'
import Uinvertida from './Uinvertida'
import LineaCero from './LineaCero'
import LineaCero_ComoFunciona from './LineaCero_ComoFunciona'
import LineaCeroReglamento from './screens/LineaCeroReglamento'
import OficinaDeAtencionClientes from './OficinaDeAtencionClientes'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PlanificadorResult from './PlanificadorResult'
// import ResultadoBip from './ResultadoBip'
import ResultadoConsultaBip from './ResultadoConsultaBip'
// import ResultadoConsulta from './ResultadoConsulta'
import ResultadoRecarga from './ResultadoRecarga'
import ResultadoRecargaDetalle from './ResultadoRecargaDetalle'
import VoucherDigital from './VoucherDigital'
import MetroArteDetalleObra from './MetroArteDetalleObra'
import MetroArte from './MetroArte'
import AscensorDetalle from './AscensorDetalle'
import Favoritos from './Favoritos'
import Consultas from './Consultas'
import 'react-native-gesture-handler'
import BiblioMetro from './BiblioMetro'
import Estilos from './Estilos'
import AppMenu from './AppMenu'
import MetroInforma from './MetroInforma'
import MetroInformaDetalle from './MetroInformaDetalle'
import TiendaMetro from './TiendaMetro'
import CargaBip from './CargaBip'
import PlanificadorWeb from './screens/PlanificadorWeb'
import Planificadores from './screens/Planificadores'
import SelectorOAC from './screens/SelectorOAC'
import LocalesComerciales from './screens/LocalesComerciales'
// Imagenes
import Menu from './assets/svg/header/Menu.svg'
import Notificaciones from './assets/svg/header/Notificaciones.svg'
import ConfigNotificaciones from './assets/svg/notificaciones/configNotificaciones.svg'
import Globals, { KEY_CONFIG_NOTIFICACIONES } from './Globals'
import IntermodalidadScreen from './screens/IntermodalidadScreen'
import SurveyPopup from './components/SurveyPopup';
const PushNotification = require('react-native-push-notification');

const SCREEN_WIDTH = Dimensions.get('window').width;

let pantallaAlerta = false;

let token_key = '@token_4';

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)

    console.log("getData",value);

    return value != null ? value : null
  } catch (e) {
    console.log(e)
  }
}

const saveData = async (obj) => {
  try {
    await AsyncStorage.setItem(obj.key, obj.value)
  } catch (e) {
    console.log(e)
  }
}

const enviarToken = (token) => {
   console.log(token);

  var c = '11121111111'
  let url = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/configuracion/${token}/${c}/${
    Platform.OS === 'ios' ? 'ios' : 'android'
  }`

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log('push config send', json)
    })
    .catch((error) => {
      console.error(error)
    })

  saveData({ key: token_key, value: token })
}

/*Notificaciones Push, dejé los comentarios originales del ejemplo */

// Must be outside of any component LifeCycle (such as `componentDidMount`).

PushNotification.createChannel(
  {
    channelId: 'cl.metro.mobile.alerta_metro', // (required)
    channelName: 'Alerta Metro', // (required)
    channelDescription: 'Notificaciones y Alertas Metro de Santiago', // (optional) default: undefined.
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 2, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
)

PushNotificationIOS.addEventListener('notification', (notification) => {
  console.log(notification)
})

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)

  onRegister: function (token) {
    console.log('TOKEN:', token)

    let config = 'init=1' //este config no me acuerdo que hacía :(

    getData(token_key).then((t) => {
      if (t) {
        console.log('hay token')

        return
      }

      console.log('no hay token', token)

      enviarToken(token.token)
    })
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification)

    pantallaAlerta = true
    // process the notification
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NewData)
  },
  // Android only: GCM or FCM Sender ID
  senderID: '58840417364',
  requestPermissions: Platform.OS === 'ios',

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action)
    console.log('NOTIFICATION:', notification)

    pantallaAlerta = true

    // process the action
  },
  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err)
  },
  // IOS ONLY (optional): default: all - Permissions to register.
  // permissions: {
  //   alert: true,
  //   badge: true,
  //   sound: true,
  // },
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  //requestPermissions: Platform.OS === 'ios',
})

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

let mleft = -10;
let mright = -10;

/**
 * Header con Tuerquita.
 */
const getOptions2 = () => {
  return (headerOptions = {
    headerStyle: {
      backgroundColor: '#eee',
      height: 100,
    },
    headerTintColor: '#000',
    headerBackTitleVisible: false,
    headerTitleStyle: [
      {
        fontSize: 20,
        fontWeight: 'normal',
      },
      Estilos.tipografiaBold,
    ],
    headerLeft: () => (
      <Pressable
        style={{ width: 50, marginLeft: mleft }}
        onPress={() => {
          App.navigation.dispatch(DrawerActions.toggleDrawer())
        }}
      >
        <Menu with={24} height={24} />
      </Pressable>
    ),

    headerRight: () => (
      <Pressable
        style={{ width: 50 }}
        onPress={() => {
          //console.log( nav.navigate('Notificaciones', { screen: 'Configuración' }) );
          // App.navigation.push('Configuración');
        }}
      >
        <ConfigNotificaciones width={24} height={24} />
      </Pressable>
    ),
  })
}

/**
 * Header con Flechita
 * Header de Hijos.
 */
const getOptions3 = () => {
  return (headerOptions = {
    headerStyle: {
      backgroundColor: '#eee',
      height: 150,
    },
    headerTintColor: '#000',
    headerBackTitleVisible: false,
    headerTitleStyle: [
      {
        fontSize: 20,
        fontWeight: 'normal',
      },
      Estilos.tipografiaBold,
    ],
  })
}

/**
 * Header con variable de titulo.
 */
const getOptions5 = (title = null) => {
  return (headerOptions = {
    headerStyle: {
      backgroundColor: '#eee',
      height: 150,
    },
    headerTintColor: '#000',
    headerBackTitleVisible: false,
    headerTitleStyle: [
      {
        fontSize: 20,
        fontWeight: 'normal',
      },
      Estilos.tipografiaBold,
    ],
    headerTitle: title,
  })
}

/**
 * Header principal, tiene el Menu Drawer.
 * Se usa en las paginas unicas o las que salen del Menu.
 */
const getOptions = () => {
  return {
    headerStyle: {
      backgroundColor: '#eee',
      height: 150,
    },
    headerTintColor: '#000',
    headerBackTitleVisible: false,
    headerTitleStyle: [
      {
        fontSize: 20,
        fontWeight: 'normal',
      },
      Estilos.tipografiaBold,
    ],
    headerLeft: () => (
      <Pressable
        style={{ width: 50, marginLeft: mleft }}
        onPress={() => {
          App.navigation.dispatch(DrawerActions.toggleDrawer())
        }}
      >
        <Menu with={24} height={24} />
      </Pressable>
    ),

    headerRight: () => (
      <Pressable
        style={{ width: 50, marginRight: mright }}
        onPress={() => {
          App.navigation.navigate('Notificaciones_')
        }}
      >
        <Notificaciones with={24} height={24} />
        {/* <Image style={styles.menu} source={alerta2_img} /> */}
      </Pressable>
    ),
  }
}

/**
 * Header principal, tiene el Menu Drawer.
 * Se usa en las paginas unicas o las que salen del Menu.
 */
const getOptionsHome = () => {
  return {
    headerStyle: {
      backgroundColor: '#eee',
      height: 150,
    },
    headerTintColor: '#000',
    headerBackTitleVisible: false,
    headerTitleStyle: [
      {
        fontSize: 20,
        fontWeight: 'normal',
      },
      Estilos.tipografiaBold,
    ],
    headerLeft: () => (
      <Pressable
        style={{ width: 50, marginLeft: mleft }}
        onPress={() => {
          App.navigation.dispatch(DrawerActions.toggleDrawer())
        }}
      >
        <Menu with={24} height={24} />
      </Pressable>
    ),
    headerTitle: () => (
      <View style={{ width: SCREEN_WIDTH * 0.65, alignItems: 'center',}}>
        <Image
          source={{ uri: 'https://d37nosr7rj2kog.cloudfront.net/Logo+Metro.png' }}
          style={{ resizeMode: 'contain', height: 55, width: 55, top: Platform.OS == 'ios' ? -5 : 0 }}
        />
      </View>
    ),
    headerRight: () => (
      <Pressable
        style={{ width: 50, marginRight: mright }}
        onPress={() => {
          App.navigation.navigate('Notificaciones_')
        }}
      >
        <Notificaciones with={24} height={24} />
      </Pressable>
    ),
  }
}

/**
 * Header con la campanita pero sin el menu
 * Este lo usan en las paginas Hijo
 */
const getOptions4 = () => {
  return (headerOptions = {
    headerStyle: {
      backgroundColor: '#eee',
      height: 150,
    },
    headerTintColor: '#000',
    headerBackTitleVisible: false,
    headerTitleStyle: [
      {
        fontSize: 20,
        fontWeight: 'normal',
      },
      Estilos.tipografiaBold,
    ],
    headerRight: () => (
      <Pressable
        style={{ width: 50, marginRight: mright }}
        onPress={() => {
          App.navigation.navigate('Notificaciones_')
        }}
      >
        <Notificaciones with={24} height={24} />
        {/* <Image style={styles.menu} source={alerta2_img} /> */}
      </Pressable>
    ),
  })
}

const InfoView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Información Estaciones" component={InformacionEstaciones} options={getOptions()} />
      <Stack.Screen name="Estacion" component={Estacion} options={getOptions4()} />
      <Stack.Screen name="Obra" component={MetroArteDetalleObra} options={getOptions4()} />
      <Stack.Screen name="Metroarte" component={MetroArte} options={getOptions4()} />
      <Stack.Screen name="Ascensor" component={AscensorDetalle} options={getOptions4()} />
      <Stack.Screen name="BiblioMetro" component={BiblioMetro} options={getOptions4()} />
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />      
      <Stack.Screen name="TrenRed" component={TrenRed} options={getOptions4()} />
      <Stack.Screen name="BiciMetro" component={BiciMetro} options={getOptions4()} />
      <Stack.Screen name="BiciMetroReglamento" component={BiciMetroReglamento} options={getOptions4()} />
      <Stack.Screen name="BiciMetroAyuda" component={BiciMetroAyuda} options={getOptions4()} />
      <Stack.Screen name="Uinvertida" component={Uinvertida} options={getOptions4()} />
      <Stack.Screen name="LineaCero" component={LineaCero} options={getOptions4()} />
      <Stack.Screen name="LineaCero_ComoFunciona" component={LineaCero_ComoFunciona} options={getOptions4()} />      
      <Stack.Screen name="LineaCeroReglamento" component={LineaCeroReglamento} options={getOptions4()} />
      <Stack.Screen name="OficinaDeAtencionClientes" component={OficinaDeAtencionClientes} options={getOptions4()} />
      <Stack.Screen name="Plano de Red Menu" component={MapaRed} options={getOptions()} />
      <Stack.Screen name="LocalesComerciales" component={LocalesComerciales} options={getOptions4()} />
    </Stack.Navigator>
  )
}

const AgendaView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Agenda" component={Agenda} options={getOptions()} />
      <Stack.Screen name="AgendaDetalle" component={AgendaDetalle} options={getOptions3()} />
    </Stack.Navigator>
  )
}

const MetroInformaView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MetroInforma" component={MetroInforma} options={getOptions()} />
      <Stack.Screen name="MetroInformaDetalle" component={MetroInformaDetalle} options={getOptions3()} />
    </Stack.Navigator>
  )
}

const NuevosProyectosView2 = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NuevosProyectos" component={NuevosProyectos} options={getOptions3()} />
    </Stack.Navigator>
  )
}

const NuevosProyectosView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NuevosProyectos" component={NuevosProyectos} options={getOptions()} />
      <Stack.Screen name="NuevosProyectosDetalle" component={NuevosProyectosDetalle} options={getOptions3()} />
      <Stack.Screen name="NuevosProyectosPlano" component={NuevosProyectosPlano} options={getOptions3()} />      
      {/* <Stack.Screen name="NuevosProyectosEstaciones" component={NuevosProyectosEstaciones} options={getOptions3()} /> */}
      <Stack.Screen name="NuevosProyectosImagenes" component={NuevosProyectosImagenes} options={getOptions3()} />
    </Stack.Navigator>
  )
}

const HomeView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={getOptionsHome()} />
      {/* Estado de la Red */}
      <Stack.Screen name="Estado de la Red" component={EstadoDeLaRed} options={getOptions4()} />
      <Stack.Screen name="Estacion" component={Estacion} options={getOptions4()} />
      <Stack.Screen name="Obra" component={MetroArteDetalleObra} options={getOptions4()} />
      <Stack.Screen name="Metroarte" component={MetroArte} options={getOptions4()} />
      <Stack.Screen name="Ascensor" component={AscensorDetalle} options={getOptions4()} />
      <Stack.Screen name="BiblioMetro" component={BiblioMetro} options={getOptions4()} />
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />
      <Stack.Screen name="TrenRed" component={TrenRed} options={getOptions4()} />
      <Stack.Screen name="BiciMetro" component={BiciMetro} options={getOptions4()} />
      <Stack.Screen name="BiciMetroReglamento" component={BiciMetroReglamento} options={getOptions4()} />
      <Stack.Screen name="BiciMetroAyuda" component={BiciMetroAyuda} options={getOptions4()} />
      <Stack.Screen name="Uinvertida" component={Uinvertida} options={getOptions4()} />
      <Stack.Screen name="LineaCero" component={LineaCero} options={getOptions4()} />
      <Stack.Screen name="LineaCero_ComoFunciona" component={LineaCero_ComoFunciona} options={getOptions4()} />
      <Stack.Screen name="LineaCeroReglamento" component={LineaCeroReglamento} options={getOptions4()} />
      <Stack.Screen name="OficinaDeAtencionClientes" component={OficinaDeAtencionClientes} options={getOptions4()} />
      <Stack.Screen name="PlanificadorWeb" component={PlanificadorWeb} options={getOptions4()} />
      <Stack.Screen name="Planificadores" component={Planificadores} options={getOptions4()} />
      <Stack.Screen name="LocalesComerciales" component={LocalesComerciales} options={getOptions4()} />
      {/* Ruta Expresa */}
      <Stack.Screen name="Ruta Expresa" component={RutaExpresa} options={getOptions3()} />
      <Stack.Screen name="Ayuda Ruta Expresa" component={RutaExpresaAyuda} options={getOptions3()} />
      {/* Planificador de Viajes */}
      <Stack.Screen name="Planificador de Viajes" component={Planificador} options={getOptions3()} />
      <Stack.Screen name="Selecciona tu Estación" component={InformacionEstaciones} options={getOptions3()} />
      <Stack.Screen name="Resultado" component={PlanificadorResult} options={getOptions5('Planificador de Viajes')} />
      {/* Plano de Red */}
      <Stack.Screen name="Plano de Red" component={MapaRed} options={getOptions3()} />
      {/* <Stack.Screen name="Plano de Red Menu" component={MapaRed} options={getOptions()} /> */}
      {/* Consulta y Carga bip! */}
      <Stack.Screen name="Consulta bip!_" component={ConsultaBip} options={getOptions4()} />
      {/* <Stack.Screen name="ResultadoConsulta" component={ResultadoConsulta} options={getOptions5('Consulta de saldo')} /> */}
      <Stack.Screen
        name="ResultadoConsultaBip"
        component={ResultadoConsultaBip}
        options={getOptions5('Consulta de saldo')}
      />
      <Stack.Screen
        name="ResultadoRecarga"
        component={ResultadoRecarga}
        options={getOptions5('Comprobantes de carga')}
      />
      <Stack.Screen
        name="ResultadoRecargaDetalle"
        component={ResultadoRecargaDetalle}
        options={getOptions5('Comprobantes de carga')}
      />
      <Stack.Screen name="VoucherDigital" component={VoucherDigital} options={getOptions5('Comprobante de Carga')} />
      <Stack.Screen name="CargaBip" component={CargaBipView} options={getOptions5('Carga bip!')} />
      <Stack.Screen name="CargaBipJJ" component={CargaBip} options={getOptions5('Carga bip!')} />
      <Stack.Screen name="Tarifas" component={Tarifas} options={getOptions4()} />
      <Stack.Screen name="Cultura y Comunidad" component={CulturaYComunidadView} options={getOptions4()} />
      <Drawer.Screen name="Agenda" component={Agenda} options={getOptions4()} />
      <Drawer.Screen name="AgendaDetalle" component={AgendaDetalle} options={getOptions4()} />
      <Drawer.Screen name="MetroInforma_" component={MetroInforma} options={getOptions4()} />
      <Stack.Screen name="MetroInformaDetalle" component={MetroInformaDetalle} options={getOptions4()} />
      <Drawer.Screen name="Nuevos Proyectos" component={NuevosProyectos} options={getOptions4()} />
      <Drawer.Screen name="NuevosProyectosDetalle" component={NuevosProyectosDetalle} options={getOptions4()} />
      <Drawer.Screen name="NuevosProyectosPlano" component={NuevosProyectosPlano} options={getOptions4()} />
      {/* <Stack.Screen name="NuevosProyectosEstaciones" component={NuevosProyectosEstaciones} options={getOptions4()} /> */}
      <Stack.Screen name="NuevosProyectosImagenes" component={NuevosProyectosImagenes} options={getOptions4()} />
      <Stack.Screen name="Carga bip!" component={CargaBipView} options={getOptions()} />
      <Stack.Screen name="Intermodalidad_" component={IntermodalidadScreen} options={getOptions3() } />
    </Stack.Navigator>
  )
}

const AudioDigitalView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AudioDigital" component={AudioDigital} options={getOptions()} />
    </Stack.Navigator>
  )
}

const RutaExpresaView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Ruta Expresa" component={RutaExpresa} options={getOptions()} />
      <Stack.Screen name="Ayuda Ruta Expresa" component={RutaExpresaAyuda} options={getOptions3()} />
    </Stack.Navigator>
  )
}

const PlanificadorView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Planificador de Viajes" component={Planificador} options={getOptions()} />
      <Stack.Screen name="Selecciona tu Estación" component={InformacionEstaciones} options={getOptions3()} />
      <Stack.Screen name="Resultado" component={PlanificadorResult} options={getOptions5('Planificador de Viajes')} />
    </Stack.Navigator>
  )
}

const FavoritosView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mis Favoritos" component={Favoritos} options={getOptions()} />
      <Stack.Screen name="Estacion" component={Estacion} options={getOptions4()} />
      <Stack.Screen name="Obra" component={MetroArteDetalleObra} options={getOptions4()} />
      <Stack.Screen name="Metroarte" component={MetroArte} options={getOptions4()} />
      <Stack.Screen name="Ascensor" component={AscensorDetalle} options={getOptions4()} />
      <Stack.Screen name="BiblioMetro" component={BiblioMetro} options={getOptions4()} />
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />
      <Stack.Screen name="TrenRed" component={TrenRed} options={getOptions4()} />
      <Stack.Screen name="BiciMetro" component={BiciMetro} options={getOptions4()} />
      <Stack.Screen name="BiciMetroReglamento" component={BiciMetroReglamento} options={getOptions4()} />
      <Stack.Screen name="BiciMetroAyuda" component={BiciMetroAyuda} options={getOptions4()} />
      <Stack.Screen name="Uinvertida" component={Uinvertida} options={getOptions4()} />
      <Stack.Screen name="LineaCero" component={LineaCero} options={getOptions4()} />
      <Stack.Screen name="LineaCero_ComoFunciona" component={LineaCero_ComoFunciona} options={getOptions4()} />
      <Stack.Screen name="LineaCeroReglamento" component={LineaCeroReglamento} options={getOptions4()} />
      <Stack.Screen name="OficinaDeAtencionClientes" component={OficinaDeAtencionClientes} options={getOptions4()} />
      <Stack.Screen name="Resultado" component={PlanificadorResult} options={getOptions5('Planificador de Viajes')} />
      <Stack.Screen name="LocalesComerciales" component={LocalesComerciales} options={getOptions4()} />
      <Stack.Screen
        name="ResultadoConsultaBip"
        component={ResultadoConsultaBip}
        options={getOptions5('Consulta de saldo')}
      />
      {/* <Stack.Screen name="ResultadoConsulta" component={ResultadoConsulta} options={getOptions5('Consulta de saldo')} /> */}
      <Stack.Screen
        name="ResultadoRecarga"
        component={ResultadoRecarga}
        options={getOptions5('Comprobantes de carga')}
      />
      <Stack.Screen
        name="ResultadoRecargaDetalle"
        component={ResultadoRecargaDetalle}
        options={getOptions5('Comprobantes de carga')}
      />
      <Stack.Screen
        name="VoucherDigital"
        component={VoucherDigital}
        options={getOptions5('Comprobante de Carga digital')}
      />
    </Stack.Navigator>
  )
}

const NotificacionesView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notificaciones" component={Alerta} options={getOptions2()} />
      <Stack.Screen name="Configuración" component={Configuracion} options={getOptions3()} />
    </Stack.Navigator>
  )
}

const EstadoDeLaRedView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Estado de la Red" component={EstadoDeLaRed} options={getOptions()} />
      <Stack.Screen name="Estacion" component={Estacion} options={getOptions4()} />
      <Stack.Screen name="Obra" component={MetroArteDetalleObra} options={getOptions4()} />
      <Stack.Screen name="Metroarte" component={MetroArte} options={getOptions4()} />
      <Stack.Screen name="Ascensor" component={AscensorDetalle} options={getOptions4()} />
      <Stack.Screen name="BiblioMetro" component={BiblioMetro} options={getOptions4()} />
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />
      <Stack.Screen name="TrenRed" component={TrenRed} options={getOptions4()} />
      <Stack.Screen name="BiciMetro" component={BiciMetro} options={getOptions4()} />
      <Stack.Screen name="BiciMetroReglamento" component={BiciMetroReglamento} options={getOptions4()} />
      <Stack.Screen name="BiciMetroAyuda" component={BiciMetroAyuda} options={getOptions4()} />
      <Stack.Screen name="Uinvertida" component={Uinvertida} options={getOptions4()} />
      <Stack.Screen name="LineaCero" component={LineaCero} options={getOptions4()} />
      <Stack.Screen name="LineaCero_ComoFunciona" component={LineaCero_ComoFunciona} options={getOptions4()} />
      <Stack.Screen name="LineaCeroReglamento" component={LineaCeroReglamento} options={getOptions4()} />
      <Stack.Screen name="OficinaDeAtencionClientes" component={OficinaDeAtencionClientes} options={getOptions4()} />
      <Stack.Screen name="LocalesComerciales" component={LocalesComerciales} options={getOptions4()} />
    </Stack.Navigator>
  )
}

const TarifasView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tarifas" component={Tarifas} options={getOptions()} />
    </Stack.Navigator>
  )
}

const ConsultasView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Sugerencias y Reclamos" component={Consultas} options={getOptions()} />
      <Stack.Screen name="Selecciona tu Estación" component={InformacionEstaciones} options={getOptions3()} />
    </Stack.Navigator>
  )
}

const SaldoBipView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Consulta bip!_" component={ConsultaBip} options={getOptions4()} />
      {/* <Stack.Screen name="ResultadoConsulta" component={ResultadoConsulta} options={getOptions5('Consulta de saldo')} /> */}
      <Stack.Screen
        name="ResultadoConsultaBip"
        component={ResultadoConsultaBip}
        options={getOptions5('Consulta de saldo')}
      />
      <Stack.Screen
        name="ResultadoRecarga"
        component={ResultadoRecarga}
        options={getOptions5('Comprobantes de carga')}
      />
      <Stack.Screen
        name="ResultadoRecargaDetalle"
        component={ResultadoRecargaDetalle}
        options={getOptions5('Comprobantes de carga')}
      />
      <Stack.Screen name="VoucherDigital" component={VoucherDigital} options={getOptions5('Comprobante de Carga')} />
      <Stack.Screen name="CargaBip" component={CargaBipView} options={getOptions5('Carga bip!')} />
      <Stack.Screen name="CargaBipJJ" component={CargaBip} options={getOptions5('Carga bip!')} />
      {/* <Stack.Screen name="Saldo bip!" component={SaldoBip} options={getOptions()} /> */}
      {/* <Stack.Screen name="Resultado" component={ResultadoBip} options={getOptions5('Saldo bip!')} /> */}
      <Stack.Screen name="Consulta bip!" component={ConsultaBip} options={getOptions()} />
    </Stack.Navigator>
  )
}

const config = {
  animation: 'springkjhkjh',
  config: {
    duration: 100,
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
}

const MapaView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Plano de Red"
        component={MapaRed}
        options={{
          ...getOptions(),
          transitionSpec: {
            // open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen name="Estacion" component={Estacion} options={getOptions4()} />
      <Stack.Screen name="Obra" component={MetroArteDetalleObra} options={getOptions4()} />
      <Stack.Screen name="Metroarte" component={MetroArte} options={getOptions4()} />
      <Stack.Screen name="Ascensor" component={AscensorDetalle} options={getOptions4()} />
      <Stack.Screen name="BiblioMetro" component={BiblioMetro} options={getOptions4()} />
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />
      <Stack.Screen name="TrenRed" component={TrenRed} options={getOptions4()} />
      <Stack.Screen name="BiciMetro" component={BiciMetro} options={getOptions4()} />
      <Stack.Screen name="BiciMetroReglamento" component={BiciMetroReglamento} options={getOptions4()} />
      <Stack.Screen name="BiciMetroAyuda" component={BiciMetroAyuda} options={getOptions4()} />
      <Stack.Screen name="Uinvertida" component={Uinvertida} options={getOptions4()} />
      <Stack.Screen name="LineaCero" component={LineaCero} options={getOptions4()} />
      <Stack.Screen name="LineaCero_ComoFunciona" component={LineaCero_ComoFunciona} options={getOptions4()} />
      <Stack.Screen name="LineaCeroReglamento" component={LineaCeroReglamento} options={getOptions4()} />
      <Stack.Screen name="OficinaDeAtencionClientes" component={OficinaDeAtencionClientes} options={getOptions4()} />
      <Stack.Screen name="LocalesComerciales" component={LocalesComerciales} options={getOptions4()} />
    </Stack.Navigator>
  )
}

const openTienda = async (urlTienda) => {
  // se verifica si realmete se llamó a tienda metro
  AsyncStorage.getItem('@llamandoTiendaMetro').then((valor) => {
    if (valor === 'si') {
      AsyncStorage.removeItem('@llamandoTiendaMetro').then(() => {
        AsyncStorage.setItem('@llamandoTiendaMetro', 'no').then(() => {})
      })
      // Se vuelve a obtener la URL de la tienda
      const url = 'https://com-agenciacatedral.s3-us-west-1.amazonaws.com/metro/tienda_metro_config.json'
      fetch(`${url}`).then((datos) => {
        datos.json().then((datosJson) => {
          Linking.openURL(datosJson.url)
        })
      })
    }
  })
}

const TiendaMetroView = () => {
  if (Platform.OS === 'ios') {
    // Se obtiene la URL de la tienda Online
    getData('tiendaURL').then((value) => {
      openTienda(value)
      //console.log(value);
    })
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home_" component={HomeView} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Tienda Metro" component={TiendaMetro} options={getOptions()} />
      </Stack.Navigator>
    )
  }
}

const CulturaYComunidadView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="cultura y comunidad home" component={CulturaYComunidad} options={{ headerShown: false }} />
      <Stack.Screen name="NuevosProyectos" component={NuevosProyectosView2} options={getOptions4()} />
      <Stack.Screen name="NuevosProyectosDetalle" component={NuevosProyectosDetalle} options={getOptions4()} />
      <Stack.Screen name="NuevosProyectosPlano" component={NuevosProyectosPlano} options={getOptions4()} />      
      <Stack.Screen name="NuevosProyectosImagenes" component={NuevosProyectosImagenes} options={getOptions4()} />
    </Stack.Navigator>
  )
}

const CargaBipView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="carga Bip" component={CargaBip} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const OACView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SelectorOAC" component={SelectorOAC} options={getOptions()} />
      <Stack.Screen name="OficinaDeAtencionClientes" component={OficinaDeAtencionClientes} options={getOptions4()} />
    </Stack.Navigator>
  )
}

const abriTiendaApp = () => {
  let link = ''
  if (Platform.OS === 'ios') {
    link = 'itms-apps://apps.apple.com/cl/app/metro-de-santiago-oficial/id719638629'
  } else {
    link = 'https://play.google.com/store/apps/details?id=cl.metro.mobile'
  }
  Linking.canOpenURL(link).then(
    (supported) => {
      supported && Linking.openURL(link)
    },
    (err) => console.log(err),
  )
}

const registraProximoAviso = (horasProximoAviso) => {
  // Se calcula y registra la proxima fecha recordatorio de nueva versión
  const fechaActual = new Date()
  // const fechaProximoAviso = new Date(fechaActual.getTime() + 5*24*60*60*1000).toISOString()
  const fechaProximoAviso = new Date(fechaActual.getTime() + horasProximoAviso * 60 * 60 * 1000).toISOString()
  AsyncStorage.setItem('@proximoAvisoNuevaVersion', fechaProximoAviso)
}

export const renderMenuDrawerContent = (
  props,
) => {
  return <AppMenu {...props}  navigationParent={setNavigation} />;
};

function App() {
  const [showSurvey, setShowSurvey] = useState(false);



  const handleAppStateChange = (nextAppState) => {
    if (nextAppState == 'background') {
      //guardamos el timestamp actual
      saveData({ key: 'date', value: new Date().getTime().toString() })
    }

    if (nextAppState == 'active') {
      // console.log('pantalla alerta', pantallaAlerta);

      //PushNotification.setApplicationIconBadgeNumber(0)

      if (pantallaAlerta) {
        App.navigation.navigate('Notificaciones', {
          screen: 'Notificaciones',
        })
        pantallaAlerta = false
      } else {
        //obtenemos el timesamp actual para comparar
        getData('date').then((value) => {
          var newDate = new Date().getTime()

          var oldDate = new Date(Number(value)).getTime()

          var dif = (newDate - oldDate) / 1000

          //si han pasado más de 3000  segundos...
          if (dif > 3000) {
            //navegamos al estado de la red...
            // App.navigation.navigate('Estado de la Red_', {
            //   screen: 'Estado de la Red',
            // });
            App.navigation.navigate('Home_', {
              screen: 'Bienvenido',
            })
          }
        })
      }
    }
  }

  const setNavigation = (childNavigation) => {
    App.navigation = childNavigation
  }

  useEffect(() => {
    console.log('============================== USEEFFECT APP ========================')
    // const _intervalo = setInterval(() => {
    //   const ahora = new Date()
    //   const despues = new Date(ahora.getTime() + 60 * 1000)
    //   console.log('Timeout JJG... ', ahora.toISOString(), despues.toISOString())
    //   App.navigation.goBack(null)
    //   App.navigation.goBack(null)
    //   App.navigation.goBack(null)
    //   App.navigation.goBack(null)
    //   App.navigation.goBack(null)
    // }, 30000)
  
      const checkSurveyStatus = async () => {
        if (__DEV__) {
          // En modo debug, limpiamos las marcas para poder probar la encuesta varias veces.
          await AsyncStorage.removeItem('surveySubmitted1');
          await AsyncStorage.removeItem('surveyDismissed1');
          setShowSurvey(true);
        } else {
          // En modo producción, se consulta el estado en AsyncStorage para mostrar o no la encuesta.
          const surveySubmitted = await AsyncStorage.getItem('surveySubmitted1');
          const surveyDismissed = await AsyncStorage.getItem('surveyDismissed1');
          if (!surveySubmitted && !surveyDismissed) {
            setShowSurvey(true);
          }
        }
      };
  
      setTimeout(()=> {
        
        
        checkSurveyStatus();


      },  3000);

    

    const fechaActual = new Date()
    const fechaActualTexto = fechaActual.toISOString()
    let versionActual = '0.0.0'
    try {
      versionActual = DeviceInfo.getVersion()
    } catch {
      versionActual = '0.0.0'
    }
    // Se obtiene la version instalada
    AsyncStorage.getItem(Globals.KEY_VERSION_INSTALADA).then((versionInstalada) => {
      console.log('Version instalada: ', versionInstalada)
      if (!versionInstalada || versionActual != versionInstalada) {
        console.log('Versión actual: ', versionActual, 'Versión instalada: ', versionInstalada)
        // Se registra la nueva version como versión actual
        AsyncStorage.setItem(Globals.KEY_VERSION_INSTALADA, versionActual).then(() => {
          console.log('Se registra nueva versiórrrrrrn: ', versionActual)
        })
        // Se obtiene token para informar al back
        AsyncStorage.getItem(Globals.KEY_TOKEN).then((token) => {
          console.log('Token registrado: ', token)
          if (!token) {
            console.log('No existe token registrado para enviar')
            token = ''
          } else {
            // Se informa el token obtenido
            // Se obtiene la configuración regustraada
            AsyncStorage.getItem(Globals.KEY_CONFIG_NOTIFICACIONES).then((config) => {
              if (!config) {
                // No existe configuracion registradada, se asume por defecto
                configJSON = {
                  todaRed: true,
                  l1: true,
                  l2: true,
                  l3: true,
                  l4: true,
                  l4a: true,
                  l5: true,
                  l6: true,
                }
                config = JSON.stringify(configJSON)
                // Se registra la configuración por defecto
                AsyncStorage.setItem(KEY_CONFIG_NOTIFICACIONES, config)
              }
              // Se informa la configuración de notificaciones al back Correcta
              // Alert.alert('Se enviará TOKEN por cambio de versión: ', token)
              fetch(Globals.KEY_URL_CONFIGURACION, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: config,
              }).then((response) => {
                console.log('Respuesta API configuracion: ', JSON.stringify(response))
              })
            })
          }
        })
      }
    })

    // versionActual = '0.0.0'
    const versionActualSerie = versionActual.split('.')
    const versionActualNumero =
      parseInt(versionActualSerie[0]) * 10000 + parseInt(versionActualSerie[1]) * 100 + parseInt(versionActualSerie[2])
    const nombreApp = DeviceInfo.getApplicationName()
    // Se obtienen los parámetros de la App desde la URL de configuración
    fetch('https://d37nosr7rj2kog.cloudfront.net/ConfigApp.json')
      .then((response) => response.text())
      .then((data) => {
        // data.version = '4.7.8'
        const dataApp = JSON.parse(data)
        // const dataApp = {
        //   version: '4.7.4',
        //   urlCargaBip: 'https://movired.cl/metro/app',
        //   consultaSaldoBip: {
        //     url: 'https://developer.mbip.cl/bip-services',
        //     xApiKey: 'ocaTUclivq5HuEC8QHRSY8AQRQKsSgWL2IuWj90U',
        //     comercio: '$2a$12$OlhBBk.fNgHfGCpFeouMOeZwCmByCtpXyNVYqJ0TapPbQ6l4yUOIe',
        //   }
        // }
        let versionUltima = '0.0.0'
        if (dataApp.version) versionUltima = dataApp.version
        const versionUltimaSerie = versionUltima.split('.')
        const versionUltimaNumero =
          parseInt(versionUltimaSerie[0]) * 10000 +
          parseInt(versionUltimaSerie[1]) * 100 +
          parseInt(versionUltimaSerie[2])
        AsyncStorage.setItem('@urlCargaBip', dataApp.urlCargaBip)
        AsyncStorage.setItem(
          '@consultaSaldoBip',
          JSON.stringify({
            url: 'https://developer.mbip.cl/bip-services',
            xApiKey: 'ocaTUclivq5HuEC8QHRSY8AQRQKsSgWL2IuWj90U',
            comercio: '$2a$12$OlhBBk.fNgHfGCpFeouMOeZwCmByCtpXyNVYqJ0TapPbQ6l4yUOIe',
          }),
        )
        // Se obtine las horas para proximo aviso de la configuración 1 hora por defecto
        let horasProximoAviso = 1
        if (dataApp.horasProximoAviso) {
          horasProximoAviso = dataApp.horasProximoAviso
        }
        // Se obtiene la fecha de proximo aviso
        AsyncStorage.getItem('@proximoAvisoNuevaVersion').then((proximaFechaAviso) => {
          if (!proximaFechaAviso) proximaFechaAviso = ''
          if (fechaActualTexto > proximaFechaAviso) {
            if (versionActualNumero < versionUltimaNumero) {
              Alert.alert(
                versionActual === '0.0.0'
                  ? 'No pudimos obtener la versión de tu App Metro'
                  : `Hay una nueva actualización disponible.${'\n'}¡Descárgala ahora!`,
                versionActual === '0.0.0' ? 'Te recomendamos verificar periódicamente si existe una nueva versión' : '',
                [
                  {
                    text: versionActual === '0.0.0' ? 'Verificar' : 'Actualizar',
                    onPress: () => abriTiendaApp(),
                  },
                  {
                    text: 'Cancelar',
                    onPress: () => registraProximoAviso(horasProximoAviso),
                  },
                ],
              )
            }
          }
        })
      })

   // PushNotification.cancelAllLocalNotifications()
    AppState.addEventListener('change', handleAppStateChange)
  }, [])
  
  return (
    <NavigationContainer>
      <Drawer.Navigator  
        initialRouteName="Inicio"
        drawerContent={(props) => <AppMenu {...props} navigationParent={setNavigation} />}
        screenOptions={{
          drawerActiveTintColor: '#FFFFFF',
          drawerLabelStyle: { color: '#FFFFFF', margin: 0, padding: 0 },
          drawerStyle: styles.drawerContentContainer,
        }}
        // esto determina como se va a ver el drawer
        >
        <Drawer.Screen name="Home_" component={HomeView} options={{ headerShown: false }} />
        <Drawer.Screen name="Estado de la Red_" component={EstadoDeLaRedView} options={{ headerShown: false }} />
        <Drawer.Screen name="Planificador de Viajes_" component={PlanificadorView} options={{ headerShown: false }} />
        <Drawer.Screen name="Información Estaciones_" component={InfoView} options={{ headerShown: false }} />
        {/* <Drawer.Screen name="Emergencias_" component={EmergenciasView} options={{ headerShown: false }} /> */}
        <Drawer.Screen name="Notificaciones_" component={NotificacionesView} options={{ headerShown: false }} />
        <Drawer.Screen name="Tarifas_" component={TarifasView} options={{ headerShown: false }} />
        <Drawer.Screen name="Plano de Red_" component={MapaView} options={{ headerShown: false }} />
        <Drawer.Screen name="Saldo bip!_" component={SaldoBipView} options={{ headerShown: false }} />
        <Drawer.Screen name="Consulta bip!_" component={SaldoBipView} options={{ headerShown: false }} />

        <Drawer.Screen name="Configuración_" component={Configuracion} options={{ headerShown: false }} />
        <Drawer.Screen name="Resultado_" component={PlanificadorResult} options={{ headerShown: false }} />
        <Drawer.Screen name="Mis Favoritos_" component={FavoritosView} options={{ headerShown: false }} />
        <Drawer.Screen name="Sugerencias y Reclamos_" component={ConsultasView} options={{ headerShown: false }} />
        <Drawer.Screen name="Ruta Expresa_" component={RutaExpresaView} options={{ headerShown: false }} />
        <Drawer.Screen name="Agenda Cultural_" component={AgendaView} options={{ headerShown: false }} />
        <Drawer.Screen name="Nuevos Proyectos_" component={NuevosProyectosView} options={{ headerShown: false }} />
        <Drawer.Screen name="Audio Digital_" component={AudioDigitalView} options={{ headerShown: false }} />
        <Drawer.Screen name="MetroInforma_" component={MetroInformaView} options={{ headerShown: false }} />
        <Drawer.Screen name="Tienda Metro" component={TiendaMetroView} options={{ headerShown: false }} />
        <Drawer.Screen name="OAC_" component={OACView} options={{ headerShown: false }} />       
      </Drawer.Navigator>
       <StatusBar barStyle="dark-content"> </StatusBar>
       <SurveyPopup visible={showSurvey} onClose={() => setShowSurvey(false)} />
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  drawerContentContainer: {
    width: '80%',
    backgroundColor: '#eee',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  menu: {
    margin: 10,
    width: 25,
    height: 30,
    marginBottom: 10,
    resizeMode: 'contain',
  },
})