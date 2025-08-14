// SurveyPopup.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const emojiOptions = [
  { name: 'emoticon-angry', color: 'red' },
  { name: 'emoticon-sad', color: 'orange' },
  { name: 'emoticon-neutral', color: 'yellow' },
  { name: 'emoticon-happy', color: '#8BC34A' },
  { name: 'emoticon-excited', color: 'green' },
];

const SurveyPopup = ({ visible, onClose }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [statusSending, setStatusSending] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const submitSurvey = async () => {
    if (selectedEmoji === null) {
      Alert.alert('Por favor selecciona una nota para la encuesta');
      return;
    }

    setStatusSending(true); // <-- Activa el estado de envío

    const fecha = new Date().toISOString();
    const id_usuario = await DeviceInfo.getUniqueId();
    const encuesta_nota = (selectedEmoji + 1).toString();
    const encuesta_comentario = recommendation;
    const dispositivo = DeviceInfo.getModel();
    const dispositivo_sistema_operativo = `${Platform.OS} ${Platform.Version}`;

    const payload = {
      fecha,
      id_usuario,
      encuesta_nota,
      encuesta_comentario,
      dispositivo,
      dispositivo_sistema_operativo,
    };

    try {
      const response = await fetch(
        'https://fn0o8j8z7a.execute-api.us-east-1.amazonaws.com/metroapp/survey/webhook',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key':
              'aA9_bB8cC7dD6eE5fF4gG3hH2iI1jJ0kKlLmMnNoO1pPqQ2rRsStT3uU4vV5wW6xX7yY8zZ_9/',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Alert.alert('¡Gracias por tu feedback!');
        if (!__DEV__) await AsyncStorage.setItem('surveySubmitted1', 'true');
        onClose();
      } else {
        const errorText = await response.text();
        Alert.alert('Error al enviar la encuesta', errorText);
      }
    } catch (error) {
      Alert.alert('Error de conexión', error.message);
    } finally {
      setStatusSending(false); // <-- Restablece el estado
    }
  };

  const closeSurvey = async () => {
    if (!__DEV__) await AsyncStorage.setItem('surveyDismissed1', 'true');
    onClose();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <Modal transparent visible={visible} animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            style={[styles.container, { transform: [{ translateY }] }]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={closeSurvey}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.question}>¿Cómo evalúas la app de Metro?</Text>
            <View style={styles.emojiContainer}>
              {emojiOptions.map((opt, index) => (
                <TouchableOpacity
                  key={opt.name}
                  onPress={() => setSelectedEmoji(index)}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === index && styles.selectedEmoji,
                  ]}
                >
                  <Icon
                    name={opt.name}
                    size={32}
                    color={opt.color}
                    style={styles.iconShadow}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.commentLabel}>
              Déjanos tus comentarios o ¿Qué Recomendarías para nuestra app?
            </Text>
            <TextInput
              style={styles.textInput}
              value={recommendation}
              onChangeText={setRecommendation}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                statusSending && { opacity: 0.6 },
              ]}
              onPress={submitSurvey}
              disabled={statusSending}
            >
              <Text style={styles.submitText}>
                {statusSending ? 'Enviando ...' : 'Enviar'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emojiButton: {
    padding: 5,
  },
  selectedEmoji: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SurveyPopup;
