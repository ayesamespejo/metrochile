import {useState} from 'react';
import {Alert} from 'react-native';

import contactService from '../services/contactService';
import incidentService from '../services/incidentService';
import eventService from '../services/eventService';

import {formatRutForApi} from '../utils/rutValidator';
import {formattedDate, formattedTotal} from '../utils/functions';

type UseCreateFormProps = {
  validateForm: (data: any) => boolean;
  resetForm: () => void;
};

export const useCreateForm = ({
  validateForm,
  resetForm,
}: UseCreateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  const submitContact = async (formData: any) => {
    if (!validateForm(formData)) {
      Alert.alert(
        'Formulario Incompleto',
        'Por favor, corrija los errores antes de continuar.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      /** -----------------------
       *  Preparación de datos
       *  ----------------------*/

      const {
        nombre,
        apellido,
        rut,
        tipoDocumento,
        email,
        telefono,
        observacion,
        fechaIncidente,
        horaIncidente,
        consentimiento,
        monto,
        subtipo,
        ...incidentRest
      } = formData;

      // Normalizar tipoDocumento a string para comparación segura
      const tipoDoc = String(tipoDocumento);
      const isRut = tipoDoc === '01' || tipoDoc === '1';
      const isPasaporte = tipoDoc === '02' || tipoDoc === '2';

      const rutFormateado = formatRutForApi(rut);

      // Si es RUT: enviar rut formateado; si es Pasaporte: el campo 'rut' del form contiene el pasaporte
      const documentRUT = isRut ? rutFormateado : '';
      const documentPAS = isPasaporte ? rut : '';

      const montoFormateado = formattedTotal(monto);

      const dataContact = {
        nombre,
        apellido,
        tipoDocumento: tipoDoc,
        rut: documentRUT,
        pasaporte: documentPAS,
        email,
        telefono,
        observacion,
      };

      const fechaHoraIncidente = fechaIncidente
        ? formattedDate(fechaIncidente, horaIncidente)
        : '';

      const dataIncident = {
        ...incidentRest,
        tipoDocumento: tipoDoc,
        rut: documentRUT,
        pasaporte: documentPAS,
        monto: montoFormateado,
        fechaHoraIncidente,
        subtipo: subtipo === 'NoAplica' ? '' : subtipo,
      };

      const dataEvent = {
        ...dataIncident,
        evento: {
          estado: '1',
        },
      };
      /** -----------------------
       *  Envío a servicios
       *  ----------------------*/

      const responseContact = await contactService.createContact(dataContact);

      const responseIncident = await incidentService.crearActualizarIncidente(
        dataIncident,
      );

      const responseEvent = await eventService.createEvent(dataEvent);

      /** -----------------------
       *  Validación respuestas
       *  ----------------------*/

      if (
        responseContact.statusOk &&
        responseIncident.statusOk &&
        responseEvent.statusOk
      ) {
        setTrackingNumber(responseIncident.data.idIncident ?? null);
        setIsSuccess(true);
        return;
      }

      Alert.alert(
        'Error',
        responseIncident.errorMessage || 'No se pudo procesar el incidente.',
      );
    } catch (error: any) {
      console.error('Error al enviar formulario:', error);

      Alert.alert(
        'Error de Conexión',
        error?.errorMessage ||
          'No se pudo conectar con el servidor. Intente nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmissionState = () => {
    setIsSuccess(false);
    setTrackingNumber(null);
  };

  return {
    submitContact,
    isSubmitting,
    isSuccess,
    trackingNumber,
    resetSubmissionState,
  };
};
