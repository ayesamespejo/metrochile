/**
 * Validar datos del contacto antes de enviar
 * @param {Object} contactData - Datos del contacto a validar
 * @throws {Error} Si falta algún campo requerido
 */
export const validateContactData = contactData => {
  const tipoDoc = String(contactData.tipoDocumento ?? '');
  const isRut = tipoDoc === '01' || tipoDoc === '1';
  const isPasaporte = tipoDoc === '02' || tipoDoc === '2';

  const requiredFields = ['nombre', 'apellido', 'email', 'telefono'];

  // Campo de documento condicional
  if (isRut) {
    requiredFields.push('rut');
  } else if (isPasaporte) {
    requiredFields.push('pasaporte');
  } else {
    if (contactData.pasaporte && String(contactData.pasaporte).trim() !== '') {
      requiredFields.push('pasaporte');
    } else {
      requiredFields.push('rut');
    }
  }

  const missingFields = [];

  requiredFields.forEach(field => {
    if (!contactData[field] || String(contactData[field]).trim() === '') {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactData.email)) {
    throw new Error('Formato de email inválido');
  }

  // Validar formato de RUT chileno SOLO cuando el tipo de documento es RUT
  if (isRut || (!isPasaporte && !contactData.pasaporte)) {
    const rutRegex = /^\d{7,8}-[\dkK]$/;
    if (!rutRegex.test(contactData.rut)) {
      throw new Error('Formato de RUT inválido. Debe ser: 12345678-9');
    }
  }
};
