/**
 * Validar datos del contacto antes de enviar
 * @param {Object} validateIncidentData - Datos del incidente a validar
 * @throws {Error} Si falta algún campo requerido
 */
export const validateIncidentData = (incidentData) => {
  const requiredFields = ['clasificacion', 'tipo', 'subtipo'];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!incidentData[field] || String(incidentData[field]).trim() === '') {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }

};