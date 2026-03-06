import {useEffect, useState} from 'react';
import {
  AppcrmItem,
  AppcrmItemApi,
  AppcrmTipo,
} from '../models/appcrm-item.model';
import {getItemsByTipo} from '../services/appcrmItems';

/**
 * Mapea los datos obtenidos desde la API según el tipo solicitado
 *
 * @param {AppcrmTipo} tipo - Tipo de item a procesar
 * @param {AppcrmItemApi[]} data - Respuesta cruda desde la API
 * @returns {AppcrmItem[]} Lista de items normalizados para la UI
 */
const mapItemsByTipo = (
  tipo: AppcrmTipo,
  data: AppcrmItemApi[],
): AppcrmItem[] => {
  switch (tipo) {
    case 'clasificacion':
      return data.map(item => ({
        id: item.id,
        description: item.clasificacion,
      }));

    case 'tipo':
      return data.map(item => ({
        id: item.id,
        description: item.tipo,
        clasificacion: item.clasificacion,
        idClasificacion: item.idClasificacion,
      }));

    case 'subtipo':
      return data.map(item => ({
        id: item.id,
        description: item.subtipo ?? '',
        tipo: item.tipo,
        idTipo: item.id_tipo,
      }));

    case 'estacion':
      return data.map(item => ({
        id: item.id,
        description: item.estacion ?? '',
        linea: item.linea,
        idLinea: item.id_linea,
      }));

    case 'equipo_gestionador':
      return data.map(item => ({
        id: item.id,
        description: item.equipo_gestionador ?? '',
      }));

    case 'linea':
      return data.map(item => ({
        id: item.id,
        description: item.clasificacion ?? '',
      }));

    case 'medio_pago':
      return data.map(item => ({
        id: item.id,
        description: item.medio_de_pago ?? '',
      }));

    case 'tipo_documento':
      return [
        {id: 1, description: 'RUT'},
        {id: 2, description: 'Pasaporte'},
      ];

    default:
      return [];
  }
};

/**
 * Hook personalizado para obtener y manejar items de AppCRM
 *
 * @param {AppcrmTipo} tipo - Tipo de item a consultar
 * @returns {{
 *   items: AppcrmItem[],
 *   loading: boolean,
 *   error: string | null
 * }}
 */
export const useAppcrmItems = (tipo?: string) => {
  const [items, setItems] = useState<AppcrmItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tipo) {
      return;
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getItemsByTipo(tipo);
        setItems(mapItemsByTipo(tipo as AppcrmTipo, data));
      } catch (e) {
        /**
         * Manejar errores de la API
         * @param {Error} error - Error capturado en la llamada
         */
        setError('Error al obtener los items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [tipo]);

  return {items, loading, error};
};
