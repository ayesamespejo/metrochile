import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import SelectorEstacion from '../../js/components/SelectorEstacion';
import BotonNuevo from '../../components/BotonNuevo';

interface Props {
  /** requeridos */
  name: string;
  label: string;
  tipo: string;

  /** opcionales */
  required?: boolean;

  /** opcionales de formulario */
  value?: number | null;
  error?: string | null;
  touched?: boolean;
  disabled?: boolean;

  onChange?: (name: string, value: number | null) => void;
  onBlur?: (name: string) => void;
}

const convertirString = (numero: any) => numero.toString().padStart(2, '0');
const convertirestacion = (numero: any) => numero.toString().padStart(3, '0');

const SelectorEstacionItem: React.FC<Props> = ({
  name,
  label,
  tipo,
  required = true,
  value = null,
  error,
  touched,
  disabled = false,
  onChange,
  onBlur,
}) => {
  //const {items, loading, error: loadError} = useAppcrmItems(tipo);
  const hasError = touched && !!error;
  const [selectEstacion, setSelectEstacion] = useState({
    show: false,
    codigo: '',
    title: '',
  });
  const WIDTH = Dimensions.get('window').width;

  const key2 = new Date().getTime() + 3;

  useEffect(() => {
    if (value) {
      setSelectEstacion(prev => ({
        ...prev,
        codigo: value.toString(),
      }));
    } else {
      setSelectEstacion(prev => ({
        ...prev,
        codigo: '',
        title: '',
      }));
    }
  }, [value]);

  const estacionSeleccionada = (estacion: any) => {
    setSelectEstacion({
      show: false,
      codigo: estacion.codigo,
      title: estacion.title,
    });
    console.log(estacion);
    onChange?.(name, estacion.codigo);
  };

  /*if (loading) {
    return <ActivityIndicator />;
  }

  if (loadError) {
    return <Text>{loadError}</Text>;
  }*/

  return (
    <>
      <View style={styles.inputContainer}>
        <View style={[styles.pickerContainer, hasError && styles.inputError]}>
          <Text style={styles.floatingLabel}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
          <BotonNuevo
            key={key2}
            color="#FFFFFF"
            fontColor="#000000"
            iconColor="#000000"
            type="combo"
            title={selectEstacion.title}
            placeholder="Selecciona tu estación"
            onpress={() =>
              setSelectEstacion({show: true, codigo: '', title: ''})
            }
          />
        </View>

        {hasError && <Text style={styles.errorText}>{error}</Text>}
      </View>
      {selectEstacion.show && (
        <View style={{paddingHorizontal: WIDTH * 0.05}}>
          <SelectorEstacion
            onSelect={estacionSeleccionada}
            todasEstaciones={true}
          />
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
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
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#6B737A',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    position: 'relative',
    paddingTop: 4,
  },
  picker: {
    height: 50,
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
});

export default SelectorEstacionItem;
