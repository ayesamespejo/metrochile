import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';

interface Props {
  /** requeridos */
  name: string;
  label: string;

  /** opcionales */
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  required?: boolean;
  maxLength?: number;

  /** opcionales de formulario */
  value?: string;
  error?: string | null;
  touched?: boolean;
  disabled?: boolean;

  onChange?: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
}

const FormInput: React.FC<Props> = ({
  name,
  label,
  placeholder = '',
  keyboardType = 'default',
  multiline = false,
  required,
  maxLength,
  value = '',
  error,
  touched,
  disabled = false,
  onChange,
  onBlur,
}) => {
  const hasError = touched && !!error;
  const currentLength = value?.length || 0;

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Text style={styles.floatingLabel}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <TextInput
          style={[
            styles.input,
            multiline && styles.textArea,
            hasError && styles.inputError,
          ]}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
           maxLength={maxLength}
          value={value}
          editable={!disabled}
          onChangeText={text => onChange?.(name, text)}
          onBlur={() => onBlur?.(name)}
        />
      </View>

      {maxLength && (
        <Text style={styles.charCounter}>
          Caracteres disponibles:{currentLength}/{maxLength}
        </Text>
      )}

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  environment: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    backgroundColor: '#FFE5D9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    zIndex: 1,
  },
  required: {
    color: '#FF4444',
  },
  input: {
    borderWidth: 2,
    borderColor: '#6B737A',
    borderRadius: 8,
    padding: 12,
    paddingTop: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 5,
  },
  charCounter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  resetButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormInput;
