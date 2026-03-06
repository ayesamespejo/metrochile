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

const calendarIconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.3636 3.81818H18.4545V2H16.6364V3.81818H7.54545V2H5.72727V3.81818H4.81818C3.81818 3.81818 3 4.63636 3 5.63636V20.1818C3 21.1818 3.81818 22 4.81818 22H19.3636C20.3636 22 21.1818 21.1818 21.1818 20.1818V5.63636C21.1818 4.63636 20.3636 3.81818 19.3636 3.81818ZM19.3636 20.1818H4.81818V10.1818H19.3636V20.1818ZM19.3636 8.36364H4.81818V5.63636H19.3636V8.36364Z" fill="#5E6368"/>
</svg>`;

const DatePickerInput: React.FC<Props> = ({
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
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? parseDate(value) : new Date(),
  );

  const hasError = touched && !!error;

  function parseDate(dateStr: string): Date {
    if (!dateStr) {return new Date();}

    const [year, month, day] = dateStr.split('-');
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  const handlePress = () => {
    if (!disabled) {
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
            {value || 'DD-MM-YYYY'}
          </Text>

          <View style={styles.iconContainer}>
            <SvgXml xml={calendarIconSvg} width={20} height={20} />
          </View>
        </TouchableOpacity>
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}

      <DatePicker
        modal
        open={showPicker}
        date={selectedDate}
        mode="date"
        maximumDate={new Date()}
        locale="es"
        title="Selecciona una fecha"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={date => {
          setShowPicker(false);
          setSelectedDate(date);

          const formatted = formatDate(date);
          onChange?.(name, formatted);
          onBlur?.(name);
        }}
        onCancel={() => setShowPicker(false)}
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

export default DatePickerInput;
