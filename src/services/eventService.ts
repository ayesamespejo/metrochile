// src/services/incidentService.ts

import axios, {AxiosError} from 'axios';
import ENV_CONFIG from '../config/environment';
import {EventRequest, EventResponse} from '../models/event.model';
import {handleError} from '../config/axios/errorHandler';
import {getAccessToken, setAccessToken} from './auth.service';

/**
 * Servicio para la gestión de Casos/Incidentes en Dynamics 365
 *
 * API: POST - Azure Function
 * Descripción: API encargada de la actualización de Casos en Dynamics 365
 * Autorización: OAuth 2.0
 */

const token = getAccessToken();

/**
 * Convertir datos del formulario al formato de la API
 */
export const convertirIncidentFormDataARequest = (
  formData: EventRequest,
  rutFormateado: string,
): EventRequest => {
  return {
    rut: rutFormateado,
    tipo: formData.tipo,
    subtipo: formData.subtipo,
    clasificacion: formData.clasificacion,
    linea: formData.linea,
    estacion: formData.estacion,
    nCarroTren: formData.nCarroTren,
    fechaHoraIncidente: formData.fechaHoraIncidente,
    medioDePago: formData.medioDePago,
    nDeTarjeta: formData.nDeTarjeta,
    datosTicket: formData.datosTicket,
    monto: Number(formData.monto),
    nMaquinaVendedor: formData.nMaquinaVendedor,
    equipoGestionador: formData.equipoGestionador,
    direccion: formData.direccion,
    comuna: formData.comuna,
    evento: formData.evento,
  };
};

/**
 * Crear o actualizar un caso/incidente en Dynamics 365
 *
 * Tipo: POST
 * Autorización: OAuth 2.0
 */
export const createEvent = async (
  incidentData: EventRequest,
): Promise<EventResponse> => {
  try {
    console.log('Payload event a enviar:', incidentData);

    // Construir URL completa con el código de función
    // NOTA: Ajustar endpoint según la API real
    const endpoint = ENV_CONFIG.endpoints.event;
    const fullUrl = `${ENV_CONFIG.apiBaseUrl}${endpoint}?code=${ENV_CONFIG.functionCode.event}`;
    console.log('URL completa:', fullUrl);

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Si OAuth está habilitado, agregar el token de acceso
    if (ENV_CONFIG.oauth.enabled && token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('Token OAuth agregado');
    }

    console.log('Headers:', headers);

    // Realizar petición POST a la Azure Function
    console.log('Enviando petición...');
    const response = await axios<EventResponse>({
      method: 'POST',
      url: fullUrl,
      data: incidentData,
      headers: headers,
      timeout: ENV_CONFIG.timeout,
    });

    console.log('Respuesta recibida EVENTO:', response.status);
    console.log('Data de respuesta EVENTO:', response.data);

    // Procesar respuesta
    const result: EventResponse = {
      statusOk: response.data?.statusOk ?? true,
      data: response.data,
      errorMessage: response.data?.errorMessage || '',
    };

    console.log('=== FIN DE PETICIÓN EXITOSA - EVENT ===');
    return result;
  } catch (error) {
    console.log('=== ERROR EN PETICIÓN - EVENT ===');
    console.error('Error al crear/actualizar evento:', error);
    const formattedError = handleError(error as Error | AxiosError);
    throw formattedError;
  }
};

/**
 * Objeto con todas las funciones exportadas
 */
const eventService = {
  createEvent,
  convertirIncidentFormDataARequest,
  setAccessToken,
};

export default eventService;
