import axios, { AxiosError } from 'axios';

/**
 * Interfaz para errores formateados
 */
export interface FormattedError {
  statusOk: false;
  errorMessage: string;
  statusCode: number;
  details?: any;
}

/**
 * Manejar errores de la API
 */
export const handleError = (error: Error | AxiosError): FormattedError => {
  console.log('Error completo:', JSON.stringify(error, null, 2));

  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log(
        'Error de respuesta:',
        error.response.status,
        error.response.data,
      );

      return {
        statusOk: false,
        errorMessage:
          error.response.data?.ErrorMessage ||
          error.response.data?.message ||
          `Error del servidor (${error.response.status})`,
        statusCode: error.response.status,
        details: error.response.data,
      };
    }

    if (error.request) {
      console.log('Error de red:', error.message);

      return {
        statusOk: false,
        errorMessage:
          'No se pudo conectar con el servidor. Verifique su conexión a internet.',
        statusCode: 0,
        details: error.message,
      };
    }
  }

  console.log('Error de configuración:', error.message);

  return {
    statusOk: false,
    errorMessage: `Error al configurar la petición: ${error.message}`,
    statusCode: 0,
    details: error.message,
  };
};
