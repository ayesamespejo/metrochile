import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/incidentForm.styles';

export const ConsentCheckbox = ({
  value,
  onChange,
  disabled,
  error,
  touched,
}) => (
  <View style={styles.consentContainer}>
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onChange(!value)}
      disabled={disabled}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.consentText}>
        Autorizo el tratamiento de mis datos personales entregados a través de
        este formulario, con el fin de gestionar y dar respuesta a mi
        requerimiento, de acuerdo con la normativa vigente sobre protección de
        datos personales.
      </Text>
    </TouchableOpacity>
    {touched && error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);
