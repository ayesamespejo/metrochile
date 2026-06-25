import {Platform, PermissionsAndroid} from 'react-native';
import messaging, {
  onTokenRefresh,
  requestPermission,
  registerDeviceForRemoteMessages,
  getToken,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from '../../Globals';

const TOPICS_BY_PLATFORM = {
  android: {
    all: 'all-android',
    beta: 'beta-android',
  },
  ios: {
    all: 'all-ios',
    beta: 'beta-ios',
  },
};

let tokenRefreshRegistered = false;

function getTopicsForPlatform() {
  return TOPICS_BY_PLATFORM[Platform.OS] ?? TOPICS_BY_PLATFORM.android;
}

async function requestAndroidNotificationPermission() {
  if (Platform.Version < 33) {
    return true;
  }

  const alreadyGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

async function requestIosNotificationPermission() {
  const authStatus = await requestPermission(messaging());
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

/**
 * Solicita permisos de notificación según plataforma.
 * @returns {Promise<boolean>}
 */
export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    return requestAndroidNotificationPermission();
  }

  if (Platform.OS === 'ios') {
    return requestIosNotificationPermission();
  }

  return true;
}

async function subscribeToTopic(topic) {
  await messaging().subscribeToTopic(topic);
}

async function unsubscribeFromTopic(topic) {
  await messaging().unsubscribeFromTopic(topic);
}

async function applyBetaTopicSubscription(isBetaUser) {
  const {beta} = getTopicsForPlatform();

  if (isBetaUser) {
    await subscribeToTopic(beta);
  } else {
    await unsubscribeFromTopic(beta);
  }
}

function registerTokenRefreshListener() {
  if (tokenRefreshRegistered) {
    return;
  }
  tokenRefreshRegistered = true;
  onTokenRefresh(messaging(), async token => {
    await AsyncStorage.setItem(Globals.KEY_TOKEN, token);
  });
}

/**
 * Inicializa FCM: permisos, token, tópico global y segmentación beta.
 * @param {{ isBetaUser?: boolean }} options
 * @returns {Promise<string|null>}
 */
export async function setupFcm({isBetaUser = false} = {}) {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return null;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn('[FCM] Permisos de notificación no concedidos');
  }

  if (Platform.OS === 'ios') {
    await registerDeviceForRemoteMessages(messaging());
  }

  const token = await getToken(messaging());
  await AsyncStorage.setItem(Globals.KEY_TOKEN, token);

  const {all} = getTopicsForPlatform();
  await subscribeToTopic(all);
  await applyBetaTopicSubscription(isBetaUser);

  registerTokenRefreshListener();

  return token;
}
