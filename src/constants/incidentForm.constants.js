export const TOTAL_STEPS = 3;

export const REQUIRED_FIELDS = [
  'clasificacion',
  'tipo',
  'subtipo',
  'nombre',
  'apellido',
  'rut',
  'email',
  'telefono',
];

export const STEP_TITLES = {
  1: 'Tipo de requerimiento',
  2: 'Tipo de requerimiento',
  3: 'Datos de contacto y envío',
  4: 'Datos de Metodo de Pago',
};

export const STEP_DESCRIPTIONS = {
  1: 'Selecciona el tipo de requerimiento que deseas ingresar. Esta información nos ayudará a derivar tu caso correctamente',
  2: 'Indícanos cuándo y dónde ocurrió el hecho, y entrega todos los detalles que consideres relevantes para su revisión.',
  3: 'Déjanos tus datos de contacto para poder responder o solicitar información adicional si es necesario.',
};

export const COLORS = {
  primary: '#C8102E',
  secondary: '#FFFFFF',
  headerBg: '#000000',
  headerText: '#FFFFFF',
  stepActive: '#17B2A8',
  stepCompleted: '#17B2A8',
  stepInactive: '#E0E0E0',
  border: '#C8102E',
  inputBorder: '#6B737A',
  cardBorder: '#000000',
  text: '#333333',
  textLight: '#666666',
  background: '#F5F5F5',
};

export const SPACING = {
  small: 8,
  medium: 16,
  large: 20,
  xlarge: 30,
};
