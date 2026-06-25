let pendingOpenNotifications = false;

function getAppNavigation() {
  const App = require('../../App').default;
  return App?.navigation;
}

export function markPendingNotificationNavigation() {
  pendingOpenNotifications = true;
}

/**
 * Navega al Drawer "Notificaciones_" usando App.navigation.
 * @returns {boolean} true si la navegación se ejecutó.
 */
export function navigateToNotifications() {
  const navigation = getAppNavigation();

  if (!navigation?.navigate) {
    markPendingNotificationNavigation();
    console.warn(
      '[FCM] App.navigation no disponible; navegación a Notificaciones_ pendiente',
    );
    return false;
  }

  navigation.navigate('Notificaciones_');
  pendingOpenNotifications = false;
  return true;
}

/**
 * Despacha navegaciones pendientes (p. ej. cold start antes de montar el Drawer).
 */
export function flushPendingNotificationNavigation() {
  if (pendingOpenNotifications) {
    navigateToNotifications();
  }
}
