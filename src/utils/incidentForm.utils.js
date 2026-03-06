export const groupFieldsByStep = fields =>
  fields.reduce((acc, field) => {
    if (!acc[field.step]) acc[field.step] = [];
    acc[field.step].push(field);
    return acc;
  }, {});

export const buildRequiredFieldsByStep = fields =>
  fields.reduce((acc, field) => {
    if (field.required) {
      if (!acc[field.step]) acc[field.step] = [];
      acc[field.step].push(field.name);
    }
    return acc;
  }, {});

export const validateStepFields = (step, formData, requiredFieldsByStep) => {
  const requiredFields = [...(requiredFieldsByStep[step] || [])];

  console.log('formData ', formData);

  // Add consentimiento validation for step 3
  if (step === 3) {
    requiredFields.push('consentimiento');
  }

  let isValid = true;
  const errors = {};

  requiredFields.forEach(field => {
    if (field === 'consentimiento') {
      if (!formData[field]) {
        errors[field] = 'Debes aceptar el consentimiento';
        isValid = false;
      }
    }
    else if (field === 'clasificacion') {
      if (!formData[field]) {
        errors[field] = 'Debes seleccionar una clasificación';
        isValid = false;
      }
    } else if (field === 'tipo') {
      if (!formData[field]) {
        errors[field] = 'Debes seleccionar una tipo';
        isValid = false;
      }
    } else if (field === 'subtipo') {
      if (!formData[field]) {
        errors[field] = 'Debes seleccionar un subtipo';
        isValid = false;
      }
    } else if (!formData[field] || formData[field] === '') {
      errors[field] = 'Campo requerido';
      isValid = false;
    }
  });
console.log('errors ', errors);
  return {isValid, errors, requiredFields};
};

export const getInitialFormData = () => ({
  nombre: '',
  apellido: '',
  tipoDocumento: '01',
  rut: '',
  email: '',
  telefono: '',
  descripcion: '',
  estado: '',
  origen: '01',
  tipo: '',
  subtipo: '',
  clasificacion: '',
  estacion: '',
  equipoGestionador: '',
  linea: '',
  medioDePago: '',
  nCarroTren: '',
  direccion: '',
  fechaHoraIncidente: '',
  comuna: '',
  nDeTarjeta: '',
  datosTicket: '',
  monto: '',
  nMaquinaVendedor: '',
  fechaIncidente: '',
  horaIncidente: '',
  consentimiento: false,
});
