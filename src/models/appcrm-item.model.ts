export interface AppcrmItemApi {
  id: number;
  tipo: string;
  clasificacion: string;
  id_clasificacion?: number;
  idClasificacion?: number;
  subtipo?: string;
  id_tipo?: number;
  estacion?: string;
  id_linea?: number;
  linea?: string;
  equipo_gestionador?: string;
  medio_de_pago?: string;
}

export interface AppcrmItem {
  id: number;
  description: string;
  idTipo?: number;
  tipo?: string;
  clasificacion?: string;
  idClasificacion?: number;
  linea?: string;
  idLinea?: number;
}

export type AppcrmTipo =
  | 'clasificacion'
  | 'tipo'
  | 'subtipo'
  | 'estacion'
  | 'equipo_gestionador'
  | 'linea'
  | 'medio_pago'
  | 'tipo_documento';
