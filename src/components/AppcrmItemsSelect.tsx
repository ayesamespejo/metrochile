import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import {useAppcrmItems} from '../hooks/useAppcrmItems';
import Svg, {Path} from 'react-native-svg';
import { AppcrmItem } from '../models/appcrm-item.model';

interface Props {
  name: string;
  label: string;
  tipo: string;

  required?: boolean;
  value?: string | null;
  formData?: any;
  error?: string | null;
  touched?: boolean;
  disabled?: boolean;

  onChange?: (name: string, value: string | null) => void;
  onBlur?: (name: string) => void;
}

const convertirString = (n: number) => n.toString().padStart(2, '0');
const convertirestacion = (n: number) => n.toString().padStart(3, '0');

const ChevronDown = ({size = 20, color = '#555'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AppcrmItemsAutocomplete: React.FC<Props> = ({
  name,
  label,
  tipo,
  required = true,
  value = null,
  formData,
  error,
  touched,
  disabled = false,
  onChange,
  onBlur,
}) => {
  const {items, loading, error: loadError} = useAppcrmItems(tipo);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const hasError = touched && !!error;

  const itemsSelect = useMemo(() => {
    if (tipo === 'clasificacion') {
      return items.filter(
        (item: AppcrmItem) => item.id !== 3,
      );
    }
    if (tipo === 'tipo') {
      return items.filter(
        (item: AppcrmItem) => item.idClasificacion === Number(formData?.clasificacion),
      );
    }
    if (tipo === 'subtipo') {
      return items.filter(
        (item: AppcrmItem) => item.idTipo === Number(formData?.tipo),
      );
    }
    if (tipo === 'estacion') {
      if (!formData?.linea) {
        return items;
      }
      return items.filter(
        (item: AppcrmItem) => item.idLinea === Number(formData?.linea),
      );
    }
    return items;
  }, [tipo, items, formData?.clasificacion, formData?.tipo, formData?.linea]);

  useEffect(() => {
    if (open) {
      return;
    }

    if (!value || !itemsSelect.length) {
      setQuery('');
      return;
    }

    const numericValue = parseInt(value, 10);
    const selectedItem = itemsSelect.find(item => {
      const idNumber = typeof item.id === 'string' ? Number(item.id) : item.id;

      const formattedId =
        tipo === 'estacion' ? idNumber : convertirString(idNumber);

      return formattedId === value || idNumber === numericValue;
    });

    if (selectedItem) {
      setQuery(selectedItem.description);
    } else {
      setQuery('');
    }
  }, [value, itemsSelect, tipo, open]);

  const filteredItems = useMemo(() => {
    if (!query) {
      return itemsSelect;
    }
    const normalizeText = (text: string) => {
      return text
        .normalize('NFD') // separa letras y tildes
        .replace(/[\u0300-\u036f]/g, '') // elimina tildes
        .toLowerCase(); // ignora mayúsculas
    };
    const normalizedQuery = normalizeText(query);

    return itemsSelect.filter(item =>
      normalizeText(item.description).includes(normalizedQuery),
    );
  }, [itemsSelect, query]);

  const handleSelect = (item: AppcrmItem) => {
    const formatted =
      tipo === 'estacion'
        ? convertirestacion(item.id)
        : convertirString(item.id);

    setQuery(item.description);
    setOpen(false);
    onChange?.(name, formatted);
  };

  const handleOpen = () => {
    setQuery('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  if (loadError) {
    return <Text>{loadError}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Input */}
      <View style={[styles.inputWrapper, hasError && styles.inputError]}>
        <Text style={styles.floatingLabel}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>

        <View style={styles.row}>
          <TextInput
            value={query}
            editable={!disabled}
            style={styles.input}
            placeholder="Seleccione..."
            onFocus={handleOpen}
            onChangeText={text => setQuery(text)}
            onBlur={() => onBlur?.(name)}
          />

          {/* Botón desplegar */}
          <TouchableOpacity
            disabled={disabled}
            onPress={handleOpen}
            style={styles.toggle}>
            <Text style={styles.toggleIcon}>
              <ChevronDown size={18} color="#555" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable style={styles.modal} onPress={() => {}}>
            <View style={styles.searchWrapper}>
              <TextInput
                value={query}
                autoFocus
                placeholder="Buscar..."
                style={styles.searchInput}
                onChangeText={setQuery}
              />

              {query.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setQuery('')}>
                  <Text style={styles.clearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={[...filteredItems].sort(
                (a, b) => a.description.localeCompare(b.description),
              )}
              keyExtractor={item => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.textItem}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AppcrmItemsAutocomplete;

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },

  clearButton: {
    padding: 4,
  },

  clearText: {
    fontSize: 16,
    color: '#888',
  },

  container: {
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
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#6B737A',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    paddingTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  toggle: {
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  toggleIcon: {
    fontSize: 16,
    color: '#555',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    maxHeight: '90%',
    padding: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  textItem: {
    fontSize: 16,
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
