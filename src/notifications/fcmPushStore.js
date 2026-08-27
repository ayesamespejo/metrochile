import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, Platform } from 'react-native';

export const FCM_PUSH_STORAGE_KEY = '@fcm_push_notifications';
export const FCM_PUSH_SAVED_EVENT = 'fcm_push_saved';

const MAX_STORED_PUSHES = 100;
const CHILE_DATE_LABEL_RE =
  /^(\d{2})-(\d{2})-(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;

function pad2(value) {
  return String(value).padStart(2, '0');
}

function repairChileYear(year) {
  const numeric = Number(year);
  if (!Number.isFinite(numeric)) {
    return year;
  }
  if (numeric >= 0 && numeric < 100) {
    return String(2000 + numeric);
  }
  if (year.startsWith('00') && year.length === 4) {
    return `20${year.slice(2)}`;
  }
  return year;
}

/**
 * Si ya viene en DD-MM-YYYY HH:mm, no volver a parsear (evita el año 0018).
 */
function asChileDateLabel(value) {
  const raw = String(value || '').trim();
  const match = raw.match(CHILE_DATE_LABEL_RE);
  if (!match) {
    return null;
  }

  const [, day, month, year, hour = '00', minute = '00'] = match;
  return `${day}-${month}-${repairChileYear(year)} ${hour}:${minute}`;
}

function comparablePushText(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/[.…]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * True si `preview` es el mismo texto (o un recorte) de `full`.
 */
export function isRedundantPreview(preview, full) {
  const a = comparablePushText(preview);
  const b = comparablePushText(full);
  if (!a) {
    return true;
  }
  if (!b) {
    return false;
  }
  if (a === b) {
    return true;
  }
  if (b.startsWith(a) || a.startsWith(b)) {
    return true;
  }
  if (a.length >= 24 && b.includes(a)) {
    return true;
  }
  if (b.length >= 24 && a.includes(b)) {
    return true;
  }
  return false;
}

/**
 * El PD de evaluación lo manda Transapp/Metro en el body; la app no lo genera.
 */
function stripEvaluanosPostscript(value) {
  const raw = String(value ?? '');
  if (!raw) {
    return raw;
  }

  const marker = raw.search(
    /P\.?\s*D\.?\s*:?\s*No olvides evaluarnos|No olvides evaluarnos/i,
  );
  if (marker === -1) {
    return raw.trim();
  }

  let cut = marker;
  const leadingJunk = raw
    .slice(0, marker)
    .match(/(?:<br\s*\/?>|<\/p>|<p[^>]*>|\s)+$/i);
  if (leadingJunk) {
    cut = marker - leadingJunk[0].length;
  }

  return raw
    .slice(0, cut)
    .replace(/(?:<br\s*\/?>|\s)+$/gi, '')
    .trim();
}

function sanitizeFcmField(value) {
  if (!value) {
    return null;
  }
  const cleaned = stripEvaluanosPostscript(String(value));
  return cleaned || null;
}

export function resolveFcmDisplayFields({ title, subtitle, body } = {}) {
  const nextTitle = sanitizeFcmField(title);
  const nextBody = sanitizeFcmField(body);
  let nextSubtitle = sanitizeFcmField(subtitle);

  if (
    nextSubtitle &&
    ((nextTitle && isRedundantPreview(nextSubtitle, nextTitle)) ||
      (nextBody && isRedundantPreview(nextSubtitle, nextBody)))
  ) {
    nextSubtitle = null;
  }

  return {
    title: nextTitle,
    subtitle: nextSubtitle,
    body: nextBody,
  };
}

/**
 * Formato chileno 24h: DD-MM-YYYY HH:mm (America/Santiago).
 */
export function formatChileDate(dateInput) {
  const alreadyFormatted = asChileDateLabel(dateInput);
  if (alreadyFormatted) {
    return alreadyFormatted;
  }

  try {
    const date =
      dateInput instanceof Date ? dateInput : parseFlexibleDate(dateInput);

    if (!date || Number.isNaN(date.getTime())) {
      return String(dateInput || '');
    }

    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Santiago',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const get = type => parts.find(part => part.type === type)?.value || '';
    return `${get('day')}-${get('month')}-${get('year')} ${get('hour')}:${get(
      'minute',
    )}`;
  } catch {
    if (dateInput instanceof Date) {
      return `${pad2(dateInput.getDate())}-${pad2(
        dateInput.getMonth() + 1,
      )}-${dateInput.getFullYear()} ${pad2(dateInput.getHours())}:${pad2(
        dateInput.getMinutes(),
      )}`;
    }
    return String(dateInput || '');
  }
}

function parseFlexibleDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  const chileLabel = raw.match(CHILE_DATE_LABEL_RE);
  if (chileLabel) {
    const [, day, month, year, hour = '00', minute = '00', second = '00'] =
      chileLabel;
    return new Date(
      `${repairChileYear(year)}-${month}-${day}T${hour}:${minute}:${second}`,
    );
  }

  const normalized = raw
    .replace(/\s+/g, ' ')
    .replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s*([+-]\d{4})/, '$1T$2$3')
    .replace(/([+-]\d{2})(\d{2})$/, '$1:$2');

  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const match = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\s*([+-]\d{4}|Z))?$/,
  );
  if (match) {
    const [, y, m, d, hh, mm, ss = '00', tz = '+0000'] = match;
    if (tz === 'Z') {
      return new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}Z`);
    }
    const sign = tz.startsWith('-') ? '-' : '+';
    const tzNorm = `${sign}${tz.slice(1, 3)}:${tz.slice(3, 5)}`;
    return new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}${tzNorm}`);
  }

  return null;
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

  const matches = s.match(/(L[1-9]|L4A)/gi);
  if (matches) {
    matches.forEach(i => {
      const upper = i.toUpperCase();
      if (resultado.indexOf(upper) === -1) {
        resultado.push(upper);
      }
    });
  }

  return resultado.sort();
}

/**
 * Normaliza un remoteMessage FCM al formato de ítem de Alerta.
 */
export function normalizeFcmToAlertaItem(remoteMessage) {
  const data = remoteMessage?.data ?? {};
  const notification = remoteMessage?.notification ?? {};

  const display = resolveFcmDisplayFields({
    title: data.title ?? notification.title ?? '',
    subtitle: data.subtitle ?? '',
    body: data.body ?? notification.body ?? '',
  });
  const title = display.title || '';
  const subtitle = display.subtitle || '';
  const body = display.body || '';
  const sender = data.sender ?? '';
  const messageId =
    remoteMessage?.messageId ??
    data.campana_id ??
    `fcm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const receivedAt = new Date();
  const dateLabel = data.date
    ? formatChileDate(data.date)
    : formatChileDate(receivedAt);

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