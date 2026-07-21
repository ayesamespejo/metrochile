/**
 * Obtiene el nombre de la ruta hoja en navegación anidada (Drawer → Stack → pantalla).
 * @param {import('@react-navigation/native').NavigationState | undefined} state
 * @returns {string | undefined}
 */
export function getActiveRouteName(state) {
  if (!state) {
    return undefined;
  }

  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
}
