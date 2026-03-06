import axios from 'axios';
import { AppcrmItemApi } from '../models/appcrm-item.model';


const BASE_URL =
  'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/appcrm_items';

interface AppcrmResponse {
  Items: AppcrmItemApi[];
}

/**
 * Obtener items de AppCRM según el tipo solicitado
 *
 * @param {string} tipo - Tipo de item a consultar (clasificacion, tipo, subtipo, etc.)
 * @returns {Promise<AppcrmItemApi[]>} Lista de items retornados por la API
 *
 * @throws {Error} Error cuando falla la comunicación con la API
 *
 * @example
 * ```ts
 * const items = await getItemsByTipo('clasificacion');
 * ```
 */
export const getItemsByTipo = async (
  tipo: string
): Promise<AppcrmItemApi[]> => {
  try {
    const response = await axios.get<AppcrmResponse>(BASE_URL, {
      params: { tipo },
    });

    return response.data.Items;

  } catch (error) {
    /**
     * Manejar errores de la API
     * @param {Error} error - Error de axios
     */
    throw error;
  }
};
