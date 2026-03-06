import { useState } from 'react';
import { fieldValidators } from '../utils/formValidators';

export const useFormValidation = (requiredFields = []) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value, formData) => {
    const validator = fieldValidators[field];
    const error = validator ? validator(value, formData) : null;

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleBlur = (field, value, formData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value, formData);
  };


  const validateForm = (formData) => {
    let isValid = true;

    requiredFields.forEach(field => {
      setTouched(prev => ({ ...prev, [field]: true }));

      if (!validateField(field, formData[field], formData)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validateField,
    handleBlur,
    validateForm,
    resetValidation,
  };
};
