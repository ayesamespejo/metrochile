/**
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {AppRegistry, Platform, PermissionsAndroid, Alert } from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import TrackPlayer from 'react-native-track-player'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotification from 'react-native-push-notification'
import Globals from './Globals'
import { PlaybackService } from './js/services/PlaybackService'



let getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)

    return value != null ? value : null
  } catch (e) {
    console.log(e)
  }
}

let saveData = async (obj) => {
  try {
    await AsyncStorage.setItem(obj.key, obj.value)
  } catch (e) {
    console.log(e)
  }
}

let enviarToken = (token) => {
  console.log(token)

  var c = '11121111111'
  // let url = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/configuracion/${token}/${c}/${
  //   Platform.OS === 'ios' ? 'ios' : 'android'
  // }`;
  let url = `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/notificaciones/${token}/${c}/${
    Platform.OS === 'ios' ? 'ios' : 'android'
  }`
  console.log(url)

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log('push config send', json)
    })
    .catch((error) => {
      console.error(error)
    })

  saveData({ key: Globals.KEY_TOKEN, value: token })
}

const checkApplicationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
    } catch (error) {}
  }
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
    // console.log('======================== REGISTRANDO ======================')
    if (Platform.OS === 'android') {
      checkApplicationPermission()
    }
    console.log('TOKEN:', token.token)
    // Alert.alert('Se enviará token por instalación TOKEN: ',token.token)
    // Se almacena el token para ser utilizado en la configuración
    // console.log('Almacenando token para config: ', token.token)
    AsyncStorage.setItem(Globals.KEY_TOKEN, token.token)

    let config = 'init=1' //este config no me acuerdo que hacía :(

    getData(Globals.KEY_TOKEN).then((t) => {
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

    // pantallaAlerta = true;
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

    //  pantallaAlerta = true;

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


AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService)
