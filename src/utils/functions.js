export const formattedDate = (fecha, hora) => {
  if (fecha) {
    const horaFinal = hora && hora.trim() !== '' ? hora : '00:00';
    const partes = fecha.split('-');
    const [dia, mes, anio] = partes;
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    return `${fechaFormateada}T${horaFinal}:00`;
  }
  return ' ';
};

export const formattedTotal = valor => {
  return Number(valor.toString().replace(/\./g, ''));
};

export const formatMiles = value => {
  if (!value) {
    return '';
  }
  const numbers = value.toString().replace(/\D/g, '');
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Valida pasaporte/DNI internacional
 * Reglas:
 * - Solo alfanumérico
 * - Sin espacios ni símbolos
 * - Longitud: 6 a 15
 * - Convertir a mayúsculas
 */
export const validatePasaporte = value => {
  if (!value || value.trim() === '') {
    return {
      ok: false,
      error: 'El número de pasaporte es obligatorio',
    };
  }

  const clean = value.toUpperCase().trim();

  // Solo alfanumérico, sin espacios ni símbolos
  const regex = /^[A-Z0-9]{6,15}$/;

  if (!regex.test(clean)) {
    if (clean.length < 6) {
      return {
        ok: false,
        error: 'El pasaporte debe tener al menos 6 caracteres',
      };
    }

    if (clean.length > 15) {
      return {
        ok: false,
        error: 'El pasaporte no puede superar los 15 caracteres',
      };
    }

    return {
      ok: false,
      error:
        'El pasaporte solo puede contener letras y números, sin espacios ni símbolos',
    };
  }

  return {
    ok: true,
    normalized: clean,
  };
};
