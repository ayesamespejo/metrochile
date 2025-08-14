import React, {Component} from 'react';
import {
  AppState,
  Platform,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  Linking,
  Text,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import EstadoDeLaRed from './EstadoDeLaRed';
import Emergencias from './Emergencias';

import Agenda from './Agenda';
import AgendaDetalle from './AgendaDetalle';
import AudioDigital from './AudioDigital';
import NuevosProyectos from './NuevosProyectos';
import NuevosProyectosDetalle from './NuevosProyectosDetalle';
import NuevosProyectosPlano from './NuevosProyectosPlano';
import NuevosProyectosEstaciones from './NuevosProyectosEstaciones';
import NuevosProyectosImagenes from './NuevosProyectosImagenes';
import Home from './screens/Home';
import RutaExpresa from './RutaExpresa';
import RutaExpresaAyuda from './RutaExpresaAyuda';
import Tarifas from './Tarifas';
import MapaRed from './MapaRed';
import SaldoBip from './SaldoBip';
import ConsultaBip from './ConsultaBip';
import Configuracion from './Configuracion';
import Planificador from './Planificador';
import PlanificadorSelectorEstaciones from './PlanificadorSelectorEstaciones';
import Estacion from './Estacion';
import BusRed from './BusRed';
import TrenRed from './TrenRed';
import BiciMetro from './BiciMetro';
import BiciMetroReglamento from './BiciMetroReglamento';
import BiciMetroAyuda from './BiciMetroAyuda';
import Uinvertida from './Uinvertida';
import LineaCero from './LineaCero';
import LineaCero_ComoFunciona from './LineaCero_ComoFunciona';
import LineaCero_Reglamento from './LineaCero_Reglamento.js';
import OficinaDeAtencionClientes from './OficinaDeAtencionClientes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PlanificadorResult from './PlanificadorResult';
import Alerta from './Alerta';
import ResultadoBip from './ResultadoBip';
import ResultadoConsultaBip from './ResultadoConsultaBip';
import ResultadoConsulta from './ResultadoConsulta';
import ResultadoRecarga from './ResultadoRecarga';
import ResultadoRecargaDetalle from './ResultadoRecargaDetalle';
import VoucherDigital from './VoucherDigital';
import MetroArteDetalleObra from './MetroArteDetalleObra';
import MetroArte from './MetroArte';
import AscensorDetalle from './AscensorDetalle';
import Favoritos from './Favoritos';
import Consultas from './Consultas';
import 'react-native-gesture-handler';
import BiblioMetro from './BiblioMetro';
import Estilos from './Estilos';
import AppMenu from './AppMenu';
import MetroInforma from './MetroInforma';
import MetroInformaDetalle from './MetroInformaDetalle';
import TiendaMetro from './TiendaMetro';
import CargaBip from './CargaBip';
import {NavigationContiner} from '@react-navigation/native';

// Imagenes
const config_img = require('./assets/1x/conf.png');
const menu_img = require('./assets/1x/burger.png');
const alerta2_img = require('./assets/1x/alerta.png');
var PushNotification = require('react-native-push-notification');

let pantallaAlerta = false;

let token_key = '@token_2';

// let getToken = async () => {

//   try {

//     const value = await AsyncStorage.getItem('@token_1');

//     return value != null ? value : null;

//   } catch (e) {

//     console.log(e);

//   }
// }

let getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value != null ? value : null;
  } catch (e) {
    console.log(e);
  }
};

let saveData = async obj => {
  try {
    await AsyncStorage.setItem(obj.key, obj.value);
  } catch (e) {
    console.log(e);
  }
};

// let storeData = async (value) => {

//   try {
//     await AsyncStorage.setItem('@token_1', value)
//   } catch (e) {
//     console.log(e);

//   }
// }

let enviarToken = token => {
  console.log(token);

  var c = '11121111111';
  let url = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/configuracion/${token}/${c}/${
    Platform.OS === 'ios' ? 'ios' : 'android'
  }`;

  console.log(url);

  fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log('push config send', json);
    })
    .catch(error => {
      console.error(error);
    });

  saveData({key: token_key, value: token});
};

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
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotificationIOS.addEventListener('notification', notification => {
  console.log(notification);
});

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)

  onRegister: function (token) {
    console.log('TOKEN:', token);

    let config = 'init=1'; //este config no me acuerdo que hacía :(

    getData(token_key).then(t => {
      if (t) {
        console.log('hay token');

        return;
      }

      console.log('no hay token', token);

      enviarToken(token.token);
    });
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    pantallaAlerta = true;
    // process the notification
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NewData);
  },
  // Android only: GCM or FCM Sender ID
  senderID: '58840417364',
  requestPermissions: Platform.OS === 'ios',

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    pantallaAlerta = true;

    // process the action
  },
  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
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
});

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

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
});

let mleft = -15;
let mright = -20;

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
        style={{width: 50, marginLeft: mleft}}
        onPress={() => {
          App.navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Image
          style={styles.menu}
          accessible={true}
          accessibilityLabel="Menu"
          accessibilityHint="Accede al menu de opciones"
          source={menu_img}
        />
      </Pressable>
    ),

    headerRight: () => (
      <Pressable
        style={{width: 50}}
        onPress={() => {
          //console.log( nav.navigate('Notificaciones', { screen: 'Configuración' }) );
          // App.navigation.push('Configuración');
        }}>
        <Image style={styles.menu} source={config_img} />
      </Pressable>
    ),
  });
};

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
  });
};

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
  });
};

/**
 * Header principal, tiene el Menu Drawer.
 * Se usa en las paginas unicas o las que salen del Menu.
 */
const getOptions = () => {
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
    headerLeft: () => (
      <Pressable
        style={{width: 50, marginLeft: mleft}}
        onPress={() => {
          App.navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Image
          style={styles.menu}
          accessible={true}
          accessibilityLabel="Menu"
          accessibilityHint="Accede al menu de opciones"
          source={menu_img}
        />
      </Pressable>
    ),

    headerRight: () => (
      <Pressable
        style={{width: 50, marginRight: mright}}
        onPress={() => {
          App.navigation.navigate('Notificaciones_');
        }}>
        <Image style={styles.menu} source={alerta2_img} />
      </Pressable>
    ),
  });
};

/**
 * Header con la campanita pero sin el menu
 * Este lo usan en las paginas Hijo
 */
function getOptions4() {
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
        style={{width: 50, marginRight: mright}}
        onPress={() => {
          App.navigation.navigate('Notificaciones_');
        }}>
        <Image style={styles.menu} source={alerta2_img} />
      </Pressable>
    ),
  });
}

function InfoView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Información Estaciones"
        component={PlanificadorSelectorEstaciones}
        options={getOptions()}
      />
      <Stack.Screen
        name="Estacion"
        component={Estacion}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Obra"
        component={MetroArteDetalleObra}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Metroarte"
        component={MetroArte}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Ascensor"
        component={AscensorDetalle}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiblioMetro"
        component={BiblioMetro}
        options={getOptions4()}
      />
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />
      <Stack.Screen
        name="TrenRed"
        component={TrenRed}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiciMetro"
        component={BiciMetro}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiciMetroReglamento"
        component={BiciMetroReglamento}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiciMetroAyuda"
        component={BiciMetroAyuda}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Uinvertida"
        component={Uinvertida}
        options={getOptions4()}
      />
      <Stack.Screen
        name="LineaCero"
        component={LineaCero}
        options={getOptions4()}
      />
      <Stack.Screen
        name="LineaCero_ComoFunciona"
        component={LineaCero_ComoFunciona}
        options={getOptions4()}
      />
      <Stack.Screen
        name="LineaCero_Reglamento"
        component={LineaCero_Reglamento}
        options={getOptions4()}
      />
      <Stack.Screen
        name="OficinaDeAtencionClientes"
        component={OficinaDeAtencionClientes}
        options={getOptions4()}
      />
    </Stack.Navigator>
  );
}

function AgendaView() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Agenda" component={Agenda} options={getOptions()} />
      <Stack.Screen
        name="AgendaDetalle"
        component={AgendaDetalle}
        options={getOptions3()}
      />
    </Stack.Navigator>
  );
}

function MetroInformaView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MetroInforma"
        component={MetroInforma}
        options={getOptions()}
      />
      <Stack.Screen
        name="MetroInformaDetalle"
        component={MetroInformaDetalle}
        options={getOptions3()}
      />
    </Stack.Navigator>
  );
}

function NuevosProyectosView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NuevosProyectos"
        component={NuevosProyectos}
        options={getOptions()}
      />
      <Stack.Screen
        name="NuevosProyectosDetalle"
        component={NuevosProyectosDetalle}
        options={getOptions3()}
      />
      <Stack.Screen
        name="NuevosProyectosPlano"
        component={NuevosProyectosPlano}
        options={getOptions3()}
      />
      <Stack.Screen
        name="NuevosProyectosEstaciones"
        component={NuevosProyectosEstaciones}
        options={getOptions3()}
      />
      <Stack.Screen
        name="NuevosProyectosImagenes"
        component={NuevosProyectosImagenes}
        options={getOptions3()}
      />
    </Stack.Navigator>
  );
}

function HomeView() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={getOptions()} />
    </Stack.Navigator>
  );
}

function AudioDigitalView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AudioDigital"
        component={AudioDigital}
        options={getOptions()}
      />
    </Stack.Navigator>
  );
}

function RutaExpresaView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Ruta Expresa"
        component={RutaExpresa}
        options={getOptions()}
      />
      <Stack.Screen
        name="Ayuda Ruta Expresa"
        component={RutaExpresaAyuda}
        options={getOptions3()}
      />
    </Stack.Navigator>
  );
}

function PlanificadorView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Planificador de Viajes"
        component={Planificador}
        options={getOptions()}
      />
      <Stack.Screen
        name="Selecciona tu Estación"
        component={PlanificadorSelectorEstaciones}
        options={getOptions3()}
      />
      <Stack.Screen
        name="Resultado"
        component={PlanificadorResult}
        options={getOptions5('Planificador de Viajes')}
      />
    </Stack.Navigator>
  );
}

function FavoritosView() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mis Favoritos" component={Favoritos} options={getOptions()} />
      <Stack.Screen name="Estacion" component={Estacion} options={getOptions4()}  />
      <Stack.Screen name="Obra" component={MetroArteDetalleObra} options={getOptions4()}/>
      <Stack.Screen name="Metroarte" component={MetroArte} options={getOptions4()} />
      <Stack.Screen name="Ascensor" component={AscensorDetalle} options={getOptions4()}/>
      <Stack.Screen name="BiblioMetro" component={BiblioMetro} options={getOptions4()}/>
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />
      <Stack.Screen name="TrenRed" component={TrenRed} options={getOptions4()} />
      <Stack.Screen name="BiciMetro" component={BiciMetro} options={getOptions4()} />
      <Stack.Screen name="BiciMetroReglamento" component={BiciMetroReglamento} options={getOptions4()} />
      <Stack.Screen name="BiciMetroAyuda" component={BiciMetroAyuda} options={getOptions4()} />
      <Stack.Screen name="Uinvertida" component={Uinvertida} options={getOptions4()} />
      <Stack.Screen name="LineaCero" component={LineaCero} options={getOptions4()} />
      <Stack.Screen name="LineaCero_ComoFunciona" component={LineaCero_ComoFunciona} options={getOptions4()} />
      <Stack.Screen name="LineaCero_Reglamento" component={LineaCero_Reglamento} options={getOptions4()} />
      <Stack.Screen name="OficinaDeAtencionClientes" component={OficinaDeAtencionClientes} options={getOptions4()} />      
      <Stack.Screen name="Resultado" component={PlanificadorResult} options={getOptions5('Planificador de Viajes')} />
    {/*   <Stack.Screen name="ResultadoBip" component={ResultadoBip} options={getOptions5('Saldo bip!')} /> */}
      <Stack.Screen name="ResultadoConsultaBip" component={ResultadoConsultaBip} options={getOptions5('Consulta bip!')} />
      <Stack.Screen name="ResultadoConsulta" component={ResultadoConsulta} options={getOptions5('Consulta bip!')} />
      <Stack.Screen name="ResultadoRecarga" component={ResultadoRecarga} options={getOptions5('Comprobante de cargas bip!')} />
      <Stack.Screen name="ResultadoRecargaDetalle" component={ResultadoRecargaDetalle} options={getOptions5('Comprobante de cargas bip!')} />
      <Stack.Screen name="VoucherDigital" component={VoucherDigital} options={getOptions5('Comprobante de Carga digital')} /> 
    </Stack.Navigator>
  );
}

function NotificacionesView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notificaciones"
        component={Alerta}
        options={getOptions2()}
      />
      <Stack.Screen
        name="Configuración"
        component={Configuracion}
        options={getOptions3()}
      />
    </Stack.Navigator>
  );
}

function EstadoDeLaRedView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Estado de la Red"
        component={EstadoDeLaRed}
        options={getOptions()}
      />
      <Stack.Screen
        name="Estacion"
        component={Estacion}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Obra"
        component={MetroArteDetalleObra}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Metroarte"
        component={MetroArte}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Ascensor"
        component={AscensorDetalle}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiblioMetro"
        component={BiblioMetro}
        options={getOptions4()}
      />
      <Stack.Screen name="BusRed" component={BusRed} options={getOptions4()} />
      <Stack.Screen
        name="TrenRed"
        component={TrenRed}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiciMetro"
        component={BiciMetro}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiciMetroReglamento"
        component={BiciMetroReglamento}
        options={getOptions4()}
      />
      <Stack.Screen
        name="BiciMetroAyuda"
        component={BiciMetroAyuda}
        options={getOptions4()}
      />
      <Stack.Screen
        name="Uinvertida"
        component={Uinvertida}
        options={getOptions4()}
      />
      <Stack.Screen
        name="LineaCero"
        component={LineaCero}
        options={getOptions4()}
      />
      <Stack.Screen
        name="LineaCero_ComoFunciona"
        component={LineaCero_ComoFunciona}
        options={getOptions4()}
      />
      <Stack.Screen
        name="LineaCero_Reglamento"
        component={LineaCero_Reglamento}
        options={getOptions4()}
      />
      <Stack.Screen
        name="OficinaDeAtencionClientes"
        component={OficinaDeAtencionClientes}
        options={getOptions4()}
      />
    </Stack.Navigator>
  );
}

function EmergenciasView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Emergencias"
        component={Emergencias}
        options={getOptions()}
      />
    </Stack.Navigator>
  );
}

function TarifasView() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tarifas" component={Tarifas} options={getOptions()} />
    </Stack.Navigator>
  );
}

function ConsultasView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sugerencias y Sugerencias"
        component={Consultas}
        options={getOptions()}
      />
      <Stack.Screen
        name="Selecciona tu Estación"
        component={PlanificadorSelectorEstaciones}
        options={getOptions3()}
      />
    </Stack.Navigator>
  );
}

function SaldoBipView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Saldo bip!"
        component={SaldoBip}
        options={getOptions()}
      />
      <Stack.Screen
        name="Resultado"
        component={ResultadoBip}
        options={getOptions5('Saldo bip!')}
      />
      <Stack.Screen
        name="Consulta bip!"
        component={ConsultaBip}
        options={getOptions()}
      />
      <Stack.Screen
        name="ResultadoConsulta"
        component={ResultadoConsulta}
        options={getOptions5('Consulta de saldo')}
      />
      <Stack.Screen
        name="ResultadoConsultaBip"
        component={ResultadoConsultaBip}
        options={getOptions5('Consulta de saldo')}
      />
      <Stack.Screen
        name="ResultadoRecarga"
        component={ResultadoRecarga}
        options={getOptions5('Comprobante de cargas bip!')}
      />
      <Stack.Screen
        name="ResultadoRecargaDetalle"
        component={ResultadoRecargaDetalle}
        options={getOptions5('Comprobante de cargas bip!')}
      />
      <Stack.Screen
        name="VoucherDigital"
        component={VoucherDigital}
        options={getOptions5('Comprobante de Carga')}
      />
      <Stack.Screen
        name="CargaBip"
        component={CargaBipView}
        options={getOptions4()}
      />
    </Stack.Navigator>
  );
}

function MapaView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Plano de Red"
        component={MapaRed}
        options={getOptions()}
      />
    </Stack.Navigator>
  );
}

const openTienda = async urlTienda => {
  await Linking.openURL(urlTienda);
};

function TiendaMetroView() {
  if (Platform.OS === 'ios') {
    // Se obtiene la URL de la tienda Online
    getData('tiendaURL').then(value => {
      openTienda(value);
      //console.log(value);
    });
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Estado de la Red"
          component={EstadoDeLaRed}
          options={getOptions()}
        />
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Tienda Metro"
          component={TiendaMetro}
          options={getOptions()}
        />
      </Stack.Navigator>
    );
  }
}

function CargaBipView() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="carga Bip"
        component={CargaBip}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default class App extends Component {
  static device_token;

  static navigation;

  constructor(props) {
    super(props);
  }

  handleAppStateChange = nextAppState => {
    if (nextAppState == 'background') {
      //guardamos el timestamp actual
      saveData({key: 'date', value: new Date().getTime().toString()});
    }

    if (nextAppState == 'active') {
      console.log('pantalla alerta', pantallaAlerta);

      PushNotification.setApplicationIconBadgeNumber(0);

      if (pantallaAlerta) {
        App.navigation.navigate('Notificaciones', {
          screen: 'Notificaciones',
        });
        pantallaAlerta = false;
      } else {
        //obtenemos el timesamp actual para comparar
        getData('date').then(value => {
          var newDate = new Date().getTime();

          var oldDate = new Date(Number(value)).getTime();

          var dif = (newDate - oldDate) / 1000;

          //si han pasado más de 3000  segundos...
          if (dif > 3000) {
            //navegamos al estado de la red...
            App.navigation.navigate('Estado de la Red_', {
              screen: 'Estado de la Red',
            });
          }
        });
      }
    }
  };

  setNavigation(childNavigation) {
    App.navigation = childNavigation;
  }

  componentDidMount() {
    PushNotification.cancelAllLocalNotifications();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={props => (
            <AppMenu {...props} navigationParent={this.setNavigation} />
          )}
          screenOptions={{
            activeTintColor: '#FFFFFF',
            labelStyle: {color: '#FFFFFF', margin: 0, padding: 0},
            drawerStyle: styles.drawerContentContainer,
          }}
          // esto determina como se va a ver el drawer
          drawerType="permanent">
          <Drawer.Screen
            name="Estado de la Red_"
            component={EstadoDeLaRedView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Planificador de Viajes_"
            component={PlanificadorView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Información Estaciones_"
            component={InfoView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Emergencias_"
            component={EmergenciasView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Notificaciones_"
            component={NotificacionesView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Tarifas_"
            component={TarifasView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Plano de Red_"
            component={MapaView}
            options={{headerShown: false}}
          />

          <Drawer.Screen
            name="Saldo bip!_"
            component={SaldoBipView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Consulta bip!_"
            component={SaldoBipView}
            options={{headerShown: false}}
          />

          <Drawer.Screen
            name="Configuración_"
            component={Configuracion}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Resultado_"
            component={PlanificadorResult}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Mis Favoritos_"
            component={FavoritosView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Sugerencias y Reclamos_"
            component={ConsultasView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Ruta Expresa_"
            component={RutaExpresaView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Agenda Cultural_"
            component={AgendaView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Nuevos Proyectos_"
            component={NuevosProyectosView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Home_"
            component={HomeView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Audio Digital_"
            component={AudioDigitalView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="MetroInforma_"
            component={MetroInformaView}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Tienda Metro"
            component={TiendaMetroView}
            options={{headerShown: false}}
          />
        </Drawer.Navigator>

        <StatusBar barStyle="dark-content"> </StatusBar>
      </NavigationContainer>
    );
  }
}
