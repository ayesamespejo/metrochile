export type FieldType = 'input' | 'select' | 'date' | 'time' | 'estacion';
export type CategoryType = 'incident' | 'contact';

/**
 * Interfaz para los campos del formulario de incidentes
 *
 */
export interface IncidentFormField {
  type: FieldType;
  category: CategoryType;
  step: number;
  order: number;
  name: string;
  label: string;
  placeholder?: string;
  tipo?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  multiline?: boolean;
  maxLength?: number;
  required: boolean;
  show: boolean;
}
