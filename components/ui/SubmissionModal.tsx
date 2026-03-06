import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import MetroBouncyLoader from './MetroBouncyLoader';

type SubmissionModalState = 'loading' | 'success';

type SubmissionModalProps = {
  isVisible: boolean;
  state: SubmissionModalState;
  trackingNumber?: string;
  onReset: () => void;
  onGoHome: () => void;
};

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isVisible,
  state,
  trackingNumber,
  onReset,
  onGoHome,
}) => {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      backdropOpacity.setValue(0);
      cardScale.setValue(0.85);
      cardOpacity.setValue(0);
      loadingOpacity.setValue(1);
      successOpacity.setValue(0);
      successScale.setValue(0.9);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (state === 'success' && isVisible) {
      loadingOpacity.setValue(0);

      successOpacity.setValue(0);
      successScale.setValue(0.9);

      Animated.parallel([
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(successScale, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (state === 'loading' && isVisible) {
      successOpacity.setValue(0);

      loadingOpacity.setValue(0);

      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [state, isVisible]);

  const modalMaxWidth = 420;
  const horizontalMargin = 20;
  const cardWidth = Math.min(modalMaxWidth, screenWidth - horizontalMargin * 2);

  const maxCardHeight = screenHeight * 0.75;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent>
      <Animated.View style={[styles.backdrop, {opacity: backdropOpacity}]}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              width: cardWidth,
              maxHeight: maxCardHeight,
              opacity: cardOpacity,
              transform: [{scale: cardScale}],
            },
          ]}>
          <View style={styles.metroAccent} />

          <ScrollView
            contentContainerStyle={styles.cardContent}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {state === 'loading' && (
              <Animated.View
                style={[styles.stateContainer, {opacity: loadingOpacity}]}>
                <View style={styles.loaderContainer}>
                  <MetroBouncyLoader size={45} speed={1.75} color="#17B2A8" />
                </View>

                <Text style={styles.loadingTitle}>Enviando…</Text>

                <View style={styles.messageContainer}>
                  <Text style={styles.loadingMessage}>
                    Estamos enviando tu reclamo y recopilando la información
                    necesaria.{'\n'}Puede tardar unos segundos. Por favor
                    espera.
                  </Text>
                </View>
              </Animated.View>
            )}

            {state === 'success' && (
              <Animated.View
                style={[
                  styles.stateContainer,
                  {
                    opacity: successOpacity,
                    transform: [{scale: successScale}],
                  },
                ]}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>

                <Text style={styles.successTitle}>
                  Tu solicitud fue enviada correctamente
                </Text>

                {/*trackingNumber ? (
                  <Text style={styles.trackingText}>
                    N.º de seguimiento:{' '}
                    <Text style={styles.trackingNumber}>{trackingNumber}</Text>
                  </Text>
                ) : null*/}

                <Text style={styles.successMessage}>
                  Nuestro equipo revisará la información y te contactará si es
                  necesario.
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={0.8}
                    onPress={onReset}>
                    <Text style={styles.primaryButtonText}>
                      Ingresar nueva consulta
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    activeOpacity={0.8}
                    onPress={onGoHome}>
                    <Text style={styles.secondaryButtonText}>
                      Volver al menú principal
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  metroAccent: {
    height: 4,
    backgroundColor: '#C8102E',
  },
  cardContent: {
    paddingVertical: 36,
    paddingHorizontal: 28,
    minHeight: 300,
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderContainer: {
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  messageContainer: {
    maxWidth: 320,
    alignItems: 'center',
  },
  loadingMessage: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 22,
  },

  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#17B2A8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  trackingText: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackingNumber: {
    fontWeight: '700',
    color: '#000000',
  },
  successMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  buttonContainer: {
    width: '100%',
    flexShrink: 0,
  },
  primaryButton: {
    backgroundColor: '#C8102E',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#C8102E',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#C8102E',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SubmissionModal;
