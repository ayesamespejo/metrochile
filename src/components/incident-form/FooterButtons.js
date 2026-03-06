import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {styles} from '../../styles/incidentForm.styles';
import {TOTAL_STEPS} from '../../constants/incidentForm.constants';

export const FooterButtons = ({
  currentStep,
  isSubmitting,
  onBack,
  onContinue,
  onSubmit,
}) => (
  <View style={styles.footerButtons}>
    {currentStep > 1 && (
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onBack}
        disabled={isSubmitting}>
        <Text style={styles.secondaryButtonText}>Volver</Text>
      </TouchableOpacity>
    )}

    {currentStep < TOTAL_STEPS ? (
      <TouchableOpacity
        style={[
          styles.primaryButton,
          currentStep === 1 && styles.primaryButtonFull,
          isSubmitting && styles.buttonDisabled,
        ]}
        onPress={onContinue}
        disabled={isSubmitting}>
        <Text style={styles.primaryButtonText}>Continuar</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Enviar</Text>
        )}
      </TouchableOpacity>
    )}
  </View>
);
