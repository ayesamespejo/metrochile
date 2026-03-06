/**
 * Interfaz para la petición de creación de contacto
 *
 */
export interface ContactoRequest {
  nombre: string;
  /** RUT formateado (12345678-9). Requerido cuando tipoDocumento es '01'/'1'. */
  rut?: string;
  /** Número de pasaporte. Requerido cuando tipoDocumento es '02'/'2'. */
  pasaporte?: string;
  /** Tipo de documento: '01'|'1' = RUT, '02'|'2' = Pasaporte */
  tipoDocumento?: string;
  email: string;
  apellido: string;
  observacion?: string;
  telefono?: string;
}

export interface ApiResult<T = any> {
  statusOk: boolean;
  errorMessage: string;
  statusCode?: number;
  details?: any;
  data?: T;
}
