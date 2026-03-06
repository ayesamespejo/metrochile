// src/types/incident.types.ts

/**
 * Interfaz para la petición de creación/actualización de casos
 *
 */

export interface IncidentRequest  {
  nroCaso?: string;
  estado?: string;
  rut?: string;
  tipo?: string;
  subtipo?: string;
  clasificacion?: string;
  descripcion?: string;
  origen?: string;
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
}


/**
 * Interfaz para la respuesta de la API de Casos
 */
export interface IncidentResponse {
  statusOk: boolean;
  idIncident?: string;
  errorMessage: string;
  data?: any;
  nroCaso: string
}
