import { getRutErrorMessage } from './rutValidator';

import { validatePasaporte } from '../utils/functions';

export const fieldValidators = {
  clasificacion: value => {
    if (!value || value.trim() === '') {
      return 'Seleccione una clasificación';
    }
    return null;
  },

  tipo: value => {
    if (!value || value.trim() === '') {
      return 'Seleccione un tipo';
    }
    return null;
  },

  subtipo: value => {
    if (!value || value.trim() === '') {
      return 'Seleccione un subtipo';
    }
    return null;
  },

  nombre: value => {
    if (!value || value.trim() === '') {
      return 'El nombre es obligatorio';
    }
    if (value.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    return null;
  },

  apellido: value => {
    if (!value || value.trim() === '') {
      return 'El apellido es obligatorio';
    }
    if (value.length < 2) {
      return 'El apellido debe tener al menos 2 caracteres';
    }
    return null;
  },

  // rut: value => {
  //   return getRutErrorMessage(value);
  // },

  rut: (value, formData) => {
    const tipoDoc = Number(formData?.tipoDocumento);

    // Pasaporte = id 2
    if (tipoDoc === 2) {
      const result = validatePasaporte(value);
      return result.ok ? null : result.error;
    }

    // RUT por defecto
    return getRutErrorMessage(value);
  },
  
  email: value => {
    if (!value || value.trim() === '') {
      return 'El email es obligatorio';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Formato de email inválido';
    }
    return null;
  },

  telefono: value => {
    if (!value || value.trim() === '') {
      return 'El teléfono es obligatorio';
    }
    if (!/^(\+?56)?[0-9]{8,9}$/.test(value.replace(/\s/g, ''))) {
      return 'Formato de teléfono inválido';
    }
    return null;
  },
};
