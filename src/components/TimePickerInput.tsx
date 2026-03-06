import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {SvgXml} from 'react-native-svg';

interface Props {
  name: string;
  label: string;
  required?: boolean;
  value?: string;
  error?: string | null;
  touched?: boolean;
  disabled?: boolean;
  onChange?: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
}

const timeIconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.14 19 5 15.86 5 12C5 8.14 8.14 5 12 5C15.86 5 19 8.14 19 12C19 15.86 15.86 19 12 19Z" fill="#5E6368"/>
<path d="M8.10826 11.9789L8.89976 10.7047L11.6605 12.4197L15.1083 9.42706L16.1083 10.7048L11.6605 14.4271L8.10826 11.9789Z" fill="#5E6368"/>
</svg>`;

const TimePickerInput: React.FC<Props> = ({
  name,
  label,
  required = true,
  value = '',
  error,
  touched,
  disabled = false,
  onChange,
  onBlur,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Función para obtener la hora actual local
  const getCurrentLocalTime = (): Date => {
    const now = new Date();
    return now;
  };

  const [selectedTime, setSelectedTime] = useState<Date>(
    value ? parseTime(value) : getCurrentLocalTime(),
  );

  const hasError = touched && !!error;

  function parseTime(timeStr: string): Date {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  }

  function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const handlePress = () => {
    if (!disabled) {
      // Si no hay valor, actualizar con la hora actual al abrir el picker
      if (!value) {
        setSelectedTime(getCurrentLocalTime());
      }
      setShowPicker(true);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Text style={styles.floatingLabel}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>

        <TouchableOpacity
          style={[styles.input, hasError && styles.inputError]}
          onPress={handlePress}
          disabled={disabled}>
          <Text style={[styles.inputText, !value && styles.placeholder]}>
            {value || 'HH:MM'}
          </Text>

          <View style={styles.iconContainer}>
            <SvgXml xml={timeIconSvg} width={20} height={20} />
          </View>
        </TouchableOpacity>
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}

      <DatePicker
        modal
        open={showPicker}
        date={selectedTime}
        mode="time"
        is24hourSource="locale"
        locale="es"
        title="Selecciona una hora"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={time => {
          setShowPicker(false);
          setSelectedTime(time);
          const formatted = formatTime(time);
          onChange?.(name, formatted);
          onBlur?.(name);
        }}
        onCancel={() => {
          setShowPicker(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
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
  iconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TimePickerInput;
