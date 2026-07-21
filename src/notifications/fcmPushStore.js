import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, Platform } from 'react-native';

export const FCM_PUSH_STORAGE_KEY = '@fcm_push_notifications';
export const FCM_PUSH_SAVED_EVENT = 'fcm_push_saved';

const MAX_STORED_PUSHES = 100;

function formatChileDate(date) {
  try {
    return date.toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return date.toISOString();
  }
}

function getLineasFromText(txt) {
  const resultado = [];
  let s = String(txt || '');

  if (s.toUpperCase().indexOf('L4A') !== -1) {
    resultado.push('L4A');
    s = s.replace(/L4A/gi, '');
  }
  if (s.toLowerCase().indexOf('#metroapp') !== -1) {
    resultado.push('TR');
  }

  const matches = s.match(/(L[0-6])/gi);
  if (matches) {
    matches.forEach(i => {
      const upper = i.toUpperCase();
      if (resultado.indexOf(upper) === -1) {
        resultado.push(upper);
      }
    });
  }

  if (resultado.length === 0) {
    resultado.push('TR');
  }

  return resultado.sort();
}

/**
 * Normaliza un remoteMessage FCM al formato de ítem de Alerta.
 */
export function normalizeFcmToAlertaItem(remoteMessage) {
  const data = remoteMessage?.data ?? {};
  const notification = remoteMessage?.notification ?? {};

  const title = data.title ?? notification.title ?? '';
  const subtitle = data.subtitle ?? '';
  const body = data.body ?? notification.body ?? '';
  const sender = data.sender ?? '';
  const messageId =
    remoteMessage?.messageId ??
    data.campana_id ??
    `fcm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const receivedAt = new Date();
  const dateLabel = data.date ? String(data.date) : formatChileDate(receivedAt);

  const textParts = [];
  if (title) {
    textParts.push(title);
  }
  if (subtitle) {
    textParts.push(subtitle);
  }
  if (body) {
    textParts.push(body);
  }
  if (textParts.length === 0 && sender) {
    textParts.push(String(sender));
  }

  const text = textParts.join('<br>') || 'Notificación recibida';
  const lineas = getLineasFromText(`${title} ${subtitle} ${body} ${sender}`);

  return {
    id: String(messageId),
    source: 'fcm',
    date: dateLabel,
    text,
    title: title || null,
    subtitle: subtitle || null,
    body: body || null,
    sender: sender || null,
    linea: lineas.join(','),
    lineas,
    dateOrganizativaAndroid: receivedAt,
    dateOrganizativaIOS: receivedAt,
    receivedAt: receivedAt.toISOString(),
  };
}

export async function getStoredFcmPushes() {
  try {
    const raw = await AsyncStorage.getItem(FCM_PUSH_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('[FCM] Error leyendo pushes guardados:', error);
    return [];
  }
}

/**
 * Guarda un push FCM de forma idempotente por messageId.
 * @returns {Promise<object|null>} ítem guardado o null si ya existía / inválido
 */
export async function saveFcmPush(remoteMessage) {
  if (!remoteMessage) {
    return null;
  }

  const item = normalizeFcmToAlertaItem(remoteMessage);
  const existing = await getStoredFcmPushes();

  if (existing.some(e => e.id === item.id)) {
    return null;
  }

  const next = [item, ...existing].slice(0, MAX_STORED_PUSHES);
  await AsyncStorage.setItem(FCM_PUSH_STORAGE_KEY, JSON.stringify(next));
  DeviceEventEmitter.emit(FCM_PUSH_SAVED_EVENT, item);
  return item;
}

export function sortAlertaItems(items) {
  if (Platform.OS === 'ios') {
    return [...items].sort(
      (a, b) =>
        new Date(b.dateOrganizativaIOS).getTime() -
        new Date(a.dateOrganizativaIOS).getTime(),
    );
  }

  return [...items].sort(
    (a, b) =>
      new Date(b.dateOrganizativaAndroid).getTime() -
      new Date(a.dateOrganizativaAndroid).getTime(),
  );
}

/**
 * Combina alertas de API Metro con pushes FCM locales.
 */
export function mergeAlertasWithFcmPushes(apiAlertas, fcmPushes) {
  const api = (apiAlertas || []).map(item => ({
    ...item,
    source: item.source || 'api',
    id:
      item.id ||
      `api_${item.date}_${String(item.text || '').slice(0, 40)}_${
        item.linea || ''
      }`,
  }));

  const fcm = (fcmPushes || []).map(item => ({
    ...item,
    source: 'fcm',
  }));

  return sortAlertaItems([...fcm, ...api]);
}
