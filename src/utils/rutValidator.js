// src/utils/rutValidator.js

/**
 * Utilidades para validación y formateo de RUT chileno
 */

/**
 * Limpia el RUT eliminando puntos, guiones y espacios
 * @param {string} rut - RUT a limpiar
 * @returns {string} RUT sin formato
 */
export const cleanRut = rut => {
  return rut.replace(/[.\-\s]/g, '');
};
/**
 * @param {string} input - Input del usuario
 * @returns {string} Input sanitizado
 */
export const sanitizeRutTyping = input => {
  if (!input) {
    return '';
  }

  const cleaned = input.toUpperCase().replace(/[^0-9K]/g, '');
  const digits = cleaned.replace(/K/g, '');
  const hasK = cleaned.includes('K');

  if (hasK) {
    const bodyLength = digits.length;

    if (bodyLength < 7) {
      return digits;
    }

    if (bodyLength === 7 || bodyLength === 8) {
      return digits + 'K';
    }

    return digits.slice(0, 8) + 'K';
  }

  if (digits.length > 9) {
    return digits.slice(0, 9);
  }

  return digits;
};
/**
 * Formatea el RUT con puntos y guión
 * @param {string} rut - RUT sin formato
 * @returns {string} RUT formateado (ej: 12.345.678-9)
 */
export const formatRut = rut => {
  const cleanedRut = cleanRut(rut);

  if (cleanedRut.length < 2) {
    return cleanedRut;
  }

  const dv = cleanedRut.slice(-1);
  const numero = cleanedRut.slice(0, -1);

  // Agregar puntos cada 3 dígitos
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${numeroFormateado}-${dv}`;
};

/**
 * Formatea el RUT para envío a la API (sin puntos, con guión)
 * @param {string} rut - RUT a formatear
 * @returns {string} RUT en formato API (ej: 12345678-9)
 */
export const formatRutForApi = rut => {
  const cleanedRut = cleanRut(rut);

  if (cleanedRut.length < 2) {
    return cleanedRut;
  }

  const dv = cleanedRut.slice(-1);
  const numero = cleanedRut.slice(0, -1);

  return `${numero}-${dv}`;
};

/**
 * Calcula el dígito verificador de un RUT
 * @param {string} rut - RUT sin dígito verificador
 * @returns {string} Dígito verificador
 */
export const calculateDv = rut => {
  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut[i]) * multiplicador;
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }

  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) {
    return '0';
  }
  if (dv === 10) {
    return 'K';
  }
  return dv.toString();
};

/**
 * Valida si un RUT es válido
 * @param {string} rut - RUT completo con dígito verificador
 * @returns {boolean} True si es válido, false si no
 */
export const validateRut = rut => {
  const cleanedRut = cleanRut(rut);

  if (cleanedRut.length < 8 || cleanedRut.length > 9) {
    return false;
  }

  const dv = cleanedRut.slice(-1).toUpperCase();
  const numero = cleanedRut.slice(0, -1);

  if (!/^\d{7,8}$/.test(numero)) {
    return false;
  }

  if (!/^[0-9K]$/.test(dv)) {
    return false;
  }

  // Calcular y comparar dígito verificador
  const dvCalculado = calculateDv(numero);

  return dv === dvCalculado;
};

/**
 * Obtiene mensaje de error personalizado para RUT inválido
 * @param {string} rut - RUT a validar
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const getRutErrorMessage = rut => {
  if (!rut || rut.trim() === '') {
    return 'El RUT es obligatorio';
  }

  const cleanedRut = cleanRut(rut);

  if (cleanedRut.length < 8) {
    return 'El RUT es demasiado corto (mínimo 7 dígitos + DV)';
  }

  if (cleanedRut.length > 9) {
    return 'El RUT es demasiado largo (máximo 8 dígitos + DV)';
  }

  const dv = cleanedRut.slice(-1).toUpperCase();
  const numero = cleanedRut.slice(0, -1);

  if (!/^\d{7,8}$/.test(numero)) {
    return 'El cuerpo del RUT debe contener solo números (7-8 dígitos)';
  }

  if (!/^[0-9K]$/.test(dv)) {
    return 'El dígito verificador debe ser un número (0-9) o la letra K';
  }

  if (!validateRut(rut)) {
    return 'El dígito verificador del RUT no es válido';
  }

  return null;
};

/**
 * @param {string} rut - RUT a normalizar
 * @returns {string} RUT en formato cuerpo-DV
 */
export const normalizeRutForSubmit = rut => {
  return formatRutForApi(rut);
};

/**
 * @param {string} rut - RUT a validar
 * @returns {Object} {ok: boolean, error?: string, normalized?: string}
 */
export const isValidRut = rut => {
  const errorMessage = getRutErrorMessage(rut);

  if (errorMessage) {
    return {
      ok: false,
      error: errorMessage,
    };
  }

  return {
    ok: true,
    normalized: normalizeRutForSubmit(rut),
  };
};
