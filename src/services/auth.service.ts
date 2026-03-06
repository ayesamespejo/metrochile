let accessToken: string | null = null;

/**
 * Establecer token de acceso OAuth 2.0
 */
export const setAccessToken = (token: string): void => {
  accessToken = token;
};

/**
 * Obtener token de acceso OAuth 2.0
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};
