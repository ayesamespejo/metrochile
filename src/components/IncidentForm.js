import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, ScrollView, useWindowDimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FormInput from './FormInput';
import AppcrmItemsSelect from './AppcrmItemsSelect';
import DatePickerInput from './DatePickerInput';
import TimePickerInput from './TimePickerInput';
import { useCreateForm } from '../hooks/useCreateForm';
import { useFormValidation } from '../hooks/useFormValidation';
import { INCIDENT_FORM_FIELDS } from '../data/fieldsFormIncedent';
import { formatRut, sanitizeRutTyping, cleanRut } from '../utils/rutValidator';

import { StepperHeader } from './incident-form/StepperHeader';
import { SectionCard } from './incident-form/SectionCard';
import { FooterButtons } from './incident-form/FooterButtons';
import { ConsentCheckbox } from './incident-form/ConsentCheckbox';

import { styles } from '../styles/incidentForm.styles';
import { REQUIRED_FIELDS } from '../constants/incidentForm.constants';
import {
  groupFieldsByStep,
  buildRequiredFieldsByStep,
  validateStepFields,
  getInitialFormData,
} from '../utils/incidentForm.utils';
import SelectorEstacionItem from './SelectorEstacionItem';
import { RULES } from '../utils/rules';
import { Alert } from 'react-native';
import { formatMiles } from '../utils/functions';
import { RULES_SUBTIPO } from '../utils/rules_subtipo';
import SubmissionModal from '../../components/ui/SubmissionModal';

const IncidentForm = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData());
  const [incidentFields, setIncidentFields] = useState(INCIDENT_FORM_FIELDS);

  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  const { errors, touched, handleBlur, validateForm, resetValidation } =
    useFormValidation(REQUIRED_FIELDS);

  const fieldsByStep = useMemo(
    () => groupFieldsByStep(incidentFields),
    [incidentFields],
  );

  const requiredFieldsByStep = useMemo(
    () => buildRequiredFieldsByStep(incidentFields),
    [incidentFields],
  );

  const handleChange = (field, value) => {
    setFormData(prev => {
      // LIMPIA SI CAMBIA EL TIPO DE DOCUMENTO
      if (field === 'tipoDocumento') {
        return {
          ...prev,
          tipoDocumento: value,
          rut: '',
        };
      }

      // PASAPORTE
      if (field === 'rut' && Number(prev.tipoDocumento) === 2) {
        const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return {
          ...prev,
          [field]: clean,
        };
      }

      // RUT
      if (field === 'rut') {
        const currentValue = prev[field] || '';
        const currentCleaned = cleanRut(currentValue).toUpperCase();

        if (currentCleaned.match(/^\d{7,8}K$/)) {
          const newCleaned = value.toUpperCase().replace(/[^0-9K]/g, '');
          const currentDigits = currentCleaned.replace(/K/g, '');
          const newDigits = newCleaned.replace(/K/g, '');

          if (newDigits.length > currentDigits.length) {
            return prev;
          }
        }

        const sanitized = sanitizeRutTyping(value);
        const formatted = formatRut(sanitized);

        return {
          ...prev,
          [field]: formatted,
        };
      }

      // DEFAULT
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSelectChange = (name, value) => {
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    handleChange(name, value);

    const key = `${updatedFormData.clasificacion}-${updatedFormData.tipo}-${updatedFormData.subtipo}`;
    const key2 = `${updatedFormData.clasificacion}-${updatedFormData.tipo}`;
    const rule = RULES[key] || RULES[key2];
    const ruleSubtipo = RULES_SUBTIPO[key2];

    if (!rule && !ruleSubtipo) {
      return;
    }

    // reglas dinámicas
    setIncidentFields(prevFields => {
      if (!rule && !ruleSubtipo) {
        return prevFields;
      }

      const next = INCIDENT_FORM_FIELDS.map(field => {
        if (rule?.hidden.includes(field.name)) {
          return { ...field, show: false, required: false };
        }

        if (rule?.required.includes(field.name)) {
          return { ...field, show: true, required: true };
        }

        if (ruleSubtipo?.campo?.includes(field.name)) {
          return { ...field, show: true, required: true };
        }

        if (rule?.optional.includes(field.name)) {
          return { ...field, show: true, required: false };
        }

        return field;
      });

      return next;
    });

    setFormData(prev => {
      const next = { ...prev };
      next.equipoGestionador = rule?.equipoGestionador;
      // Limpiar campos ocultos
      if (rule?.hidden && Array.isArray(rule.hidden)) {
        rule.hidden.forEach(fieldName => {
          next[fieldName] = ''; // dejar celda en blanco
        });
      }
      return next;
    });
    resetValidation();
  };

  /*
  useEffect(() => {
    resetValidation();
  }, [incidentFields, resetValidation]);*/

  /*const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };*/

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    resetValidation();
    //setCurrentStep(1);
  }, [resetValidation]);

  const validateStep = step => {
    //console.log('requiredFieldsByStep ', requiredFieldsByStep);
    const { isValid, requiredFields } = validateStepFields(
      step,
      formData,
      requiredFieldsByStep,
    );

    // Update touched state for fields in this step
    requiredFields.forEach(field => {
      handleBlur(field, formData[field]);
    });

    return isValid;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const {
    submitContact,
    isSubmitting: isSubmittingF,
    isSuccess,
    trackingNumber,
    resetSubmissionState,
  } = useCreateForm({
    validateForm: () => validateForm(formData),
    resetForm,
  });

  const modalVisible = isSubmittingF || isSuccess;
  const modalState = isSuccess ? 'success' : 'loading';

  const handleModalReset = useCallback(() => {
    resetSubmissionState();
    resetForm();
    setIncidentFields(INCIDENT_FORM_FIELDS);
    setCurrentStep(1);
  }, [resetSubmissionState, resetForm]);

  const handleModalGoHome = useCallback(() => {
    resetSubmissionState();
    resetForm();
    setCurrentStep(1);
    navigation.navigate('Home_');
  }, [resetSubmissionState, resetForm, navigation]);

  const getMissingRequiredFields = () => {
    return incidentFields
      .filter(field => field.show && field.required)
      .filter(field => {
        const value = formData[field.name];
        return value === null || value === undefined || value === '';
      });
  };

  const handleSubmit = () => {
    const missingFields = getMissingRequiredFields();
    formData.subtipo = !formData.subtipo ? 'NoAplica' : formData.subtipo;

    // Caso: campos obligatorios sin llenar
    if (missingFields.length > 0) {
      if (missingFields.length === 1) {
        // Mensaje específico
        Alert.alert(
          'Campo obligatorio',
          `Debe completar el campo: ${missingFields[0].label}`,
        );
      } else {
        // Mensaje general
        Alert.alert(
          'Campos incompletos',
          'Debe completar todos los campos obligatorios antes de enviar el formulario.',
        );
      }
      return;
    }

    // Validación normal
    if (!validateForm(formData)) {
      return;
    }

    if (!formData.consentimiento) {
      Alert.alert(
        'Consentimiento requerido',
        'Debe aceptar el consentimiento para continuar.',
      );
      return;
    }

    const dataToSend = { ...formData };

    // eliminar campos opcionales vacíos
    incidentFields.forEach(field => {
      const value = dataToSend[field.name];

      const isEmpty = value === null || value === undefined || value === '';

      if (field.show && !field.required && isEmpty) {
        delete dataToSend[field.name];
      }
    });

    submitContact(dataToSend);
    // submitContact(formData);
  };

  const getMaxLength = (field) => {
    if (field.name !== 'rut') return field.maxLength;

    return Number(formData.tipoDocumento) === 2 ? 15 : 12;
  };
  const currentStepFields = (fieldsByStep[currentStep] || [])
    .filter(field => field.show === true)
    .sort((a, b) => a.order - b.order);

  //console.log('fieldsByStep 23', fieldsByStep[currentStep]);

  const renderFields = fields =>
    fields.map(field => {
      switch (field.type) {
        case 'input':
          return (
            <FormInput
              key={field.name}
              name={field.name}
              label={
                field.name === 'rut'
                  ? Number(formData.tipoDocumento) === 2
                    ? 'Pasaporte'
                    : 'RUT'
                  : field.label
              }
              // label={field.label}
              //placeholder={field.placeholder}
              placeholder={
                field.name === 'rut'
                  ? Number(formData.tipoDocumento) === 2
                    ? 'Ej: A1234567'
                    : '12.345.678-9'
                  : field.placeholder
              }
              keyboardType={field.keyboardType}
              multiline={field.multiline}
              maxLength={getMaxLength(field)}
              required={field.required}
              // value={formData[field.name]}
              value={
                field.name === 'monto'
                  ? formatMiles(formData[field.name])
                  : formData[field.name]
              }
              touched={touched[field.name]}
              error={errors[field.name]}
              disabled={isSubmittingF}
              // onChange={handleChange}
              onChange={(name, value) => {
                if (name === 'monto') {
                  const numericValue = value.replace(/\D/g, '');
                  handleChange(name, numericValue);
                } else {
                  handleChange(name, value);
                }
              }}
              onBlur={name => handleBlur(name, formData[name], formData)}
            />
          );

        case 'select':
          return (
            <AppcrmItemsSelect
              key={field.name}
              name={field.name}
              tipo={field.tipo}
              label={field.label}
              required={field.required}
              touched={touched[field.name]}
              value={formData[field.name]}
              formData={formData}
              disabled={isSubmittingF}
              error={errors[field.name]}
              onChange={handleSelectChange}
            />
          );

        case 'date':
          return (
            <DatePickerInput
              key={field.name}
              name={field.name}
              label={field.label}
              required={field.required}
              value={formData[field.name]}
              touched={touched[field.name]}
              error={errors[field.name]}
              disabled={isSubmittingF}
              onChange={handleChange}
              onBlur={name => handleBlur(name, formData[name])}
            />
          );

        case 'time':
          return (
            <TimePickerInput
              key={field.name}
              name={field.name}
              label={field.label}
              required={field.required}
              value={formData[field.name]}
              touched={touched[field.name]}
              error={errors[field.name]}
              disabled={isSubmittingF}
              onChange={handleChange}
              onBlur={name => handleBlur(name, formData[name])}
            />
          );

        case 'estacion':
          return (
            <SelectorEstacionItem
              key={field.name}
              name={field.name}
              tipo={field.tipo}
              label={field.label}
              required={field.required}
              value={formData[field.name]}
              disabled={isSubmittingF}
              error={touched[field.name] && errors[field.name]}
              onChange={handleSelectChange}
            />
          );

        default:
          return null;
      }
    });

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <SectionCard title="Tipo de requerimiento">
          {renderFields(currentStepFields)}
        </SectionCard>
      );
    }

    if (currentStep === 2) {
      const eventFields = currentStepFields.slice(0, 6);
      const additionalFields = currentStepFields.slice(6);
      return (
        <>
          <SectionCard title="Información del evento">
            {renderFields(eventFields)}
          </SectionCard>

          <SectionCard title="Información adicional">
            {renderFields(additionalFields)}
          </SectionCard>
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <SectionCard title="Datos de contacto">
            {renderFields(currentStepFields)}
          </SectionCard>

          <SectionCard title="Consentimiento de tratamiento de datos">
            <ConsentCheckbox
              value={formData.consentimiento}
              onChange={value => handleChange('consentimiento', value)}
              disabled={isSubmittingF}
              error={errors.consentimiento}
              touched={touched.consentimiento}
            />
          </SectionCard>
        </>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StepperHeader currentStep={currentStep} />
        <View
          style={[
            styles.contentContainer,
            isLandscape && styles.contentLandscape,
          ]}>
          {renderStepContent()}
        </View>

        <FooterButtons
          currentStep={currentStep}
          isSubmitting={isSubmittingF}
          onBack={handleBack}
          onContinue={handleContinue}
          onSubmit={handleSubmit}
        />
      </ScrollView>

      <SubmissionModal
        isVisible={modalVisible}
        state={modalState}
        trackingNumber={trackingNumber}
        onReset={handleModalReset}
        onGoHome={handleModalGoHome}
      />
    </View>
  );
};

export default IncidentForm;
