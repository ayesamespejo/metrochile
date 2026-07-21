/**
 * Extrae y registra en consola el payload definido por el manual de integración FCM.
 * @param {import('@react-native-firebase/messaging').FirebaseMessagingTypes.RemoteMessage | null | undefined} remoteMessage
 * @param {string} context Etiqueta del handler (BACKGROUND, FOREGROUND, etc.)
 * @returns {{ sender: string|null, title: string|null, subtitle: string|null, date: string|null, body: string|null }}
 */
import { saveFcmPush } from './fcmPushStore';

export function logFcmManualPayload(remoteMessage, context) {
  const data = remoteMessage?.data ?? {};
  const notification = remoteMessage?.notification;

  const manualPayload = {
    sender: data.sender ?? null,
    title: data.title ?? notification?.title ?? null,
    subtitle: data.subtitle ?? null,
    date: data.date ?? null,
    body: data.body ?? notification?.body ?? null,
  };

  console.log(`[FCM][${context}] Payload manual:`, manualPayload);
  console.log(`[FCM][${context}] remoteMessage:`, {
    messageId: remoteMessage?.messageId ?? null,
    from: remoteMessage?.from ?? null,
    data,
    notification: notification ?? null,
  });

  return manualPayload;
}


/**
 * Log + persistencia local del push para la pantalla Notificaciones.
 */
export async function handleIncomingFcmMessage(remoteMessage, context) {
  logFcmManualPayload(remoteMessage, context);
  try {
    return await saveFcmPush(remoteMessage);
  } catch (error) {
    console.warn(`[FCM][${context}] Error guardando push:`, error);
    return null;
  }
}
