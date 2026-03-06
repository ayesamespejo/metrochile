import axios, {AxiosError, AxiosResponse} from 'axios';
import ENV_CONFIG from '../config/environment';
import {validateContactData} from '../validators/validateContactData';
import {ApiResult, ContactoRequest} from '../models/contacto.model';
import {handleError} from '../config/axios/errorHandler';
import {getAccessToken, setAccessToken} from './auth.service';

const token = getAccessToken();

/**
 * Crear un contacto
 */
export const createContact = async (contactData: {
  nombre: string;
  apellido: string;
  rut?: string;
  pasaporte?: string;
  tipoDocumento?: string;
  email: string;
  telefono?: string;
  observacion?: string;
}): Promise<ApiResult> => {
  try {
    console.log('=== INICIO DE PETICIÓN CONTACTO ===');

    // Validar datos
    validateContactData(contactData);

    // Mapear al modelo requerido por la API
    const payload: ContactoRequest = {
      nombre: contactData.nombre,
      apellido: contactData.apellido,
      rut: contactData.rut ?? '',
      pasaporte: contactData.pasaporte ?? '',
      tipoDocumento: contactData.tipoDocumento,
      email: contactData.email,
      telefono: contactData.telefono,
      observacion: contactData.observacion ?? '',
    };

    const fullUrl = `${ENV_CONFIG.apiBaseUrl}${ENV_CONFIG.endpoints.contact}?code=${ENV_CONFIG.functionCode.contact}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Si OAuth está habilitado, agregar el token de acceso
    if (ENV_CONFIG.oauth.enabled && token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('Token OAuth agregado');
    }

    const response: AxiosResponse = await axios.post(fullUrl, payload, {
      headers,
      timeout: ENV_CONFIG.timeout,
    });

    console.log('Respuesta recibida contacto:', response.status);
    console.log('Data de respuesta contacto:', response.data);

    return {
      statusOk: response.data?.StatusOk ?? true,
      errorMessage: response.data?.ErrorMessage || '',
      data: response.data,
    };
  } catch (error) {
    const formattedError = handleError(error as Error | AxiosError);
    throw formattedError;
  }
};

/**
 * Export default
 */
const contactService = {
  createContact,
  setAccessToken,
};

export default contactService;
