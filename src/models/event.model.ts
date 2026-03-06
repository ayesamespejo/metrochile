// src/types/incident.types.ts

/**
 * Interfaz para la petición de creación/actualización de casos
 *
 */

export interface Evento {
  estado: string;
}

export interface EventRequest  {
  tipo?: string;
  subtipo?: string;
  clasificacion?: string;
  rut?: string;
  linea?: string;
  estacion?: string;
  nCarroTren?: string;
  fechaHoraIncidente?: string;
  medioDePago?: string;
  nDeTarjeta?: string;
  datosTicket?: string;
  monto?: number;
  nMaquinaVendedor?: string;
  equipoGestionador?: string;
  direccion?: string;
  comuna?: string;
  evento?: Evento;
}


/**
 * Interfaz para la respuesta de la API de Casos
 */
export interface EventResponse {
  statusOk: boolean;
  IdEvent?: string;
  errorMessage: string;
  data?: any;
}
