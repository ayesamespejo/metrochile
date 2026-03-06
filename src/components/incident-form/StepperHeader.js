import React, {useEffect, useRef} from 'react';
import {View, Text, Animated} from 'react-native';
import {styles} from '../../styles/incidentForm.styles';
import {
  TOTAL_STEPS,
  STEP_TITLES,
  STEP_DESCRIPTIONS,
} from '../../constants/incidentForm.constants';

const PulsingIndicator = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.pulseOuter,
        {
          transform: [{scale: pulseAnim}],
        },
      ]}
    />
  );
};

export const StepperHeader = ({currentStep}) => (
  <View style={styles.stepperContainer}>
    <View style={styles.stepperTopRow}>
      <View style={styles.stepperTextContainer}>
        <Text style={styles.stepText}>
          Paso {currentStep} de {TOTAL_STEPS}
        </Text>
      </View>

      <View style={styles.indicatorsContainer}>
        {[1, 2, 3].map(step => (
          <View key={step} style={styles.indicatorWrapper}>
            {step === currentStep && <PulsingIndicator />}
            <View
              style={[
                styles.indicator,
                step < currentStep && styles.indicatorCompleted,
                step === currentStep && styles.indicatorActive,
                step > currentStep && styles.indicatorInactive,
              ]}>
              {step < currentStep && <Text style={styles.checkIcon}>✓</Text>}
              {step > currentStep && (
                <View style={styles.indicatorInnerCircle} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>

    <Text style={styles.stepTitle}>{STEP_TITLES[currentStep]}</Text>

    <View style={styles.divider} />

    {STEP_DESCRIPTIONS[currentStep] && (
      <Text style={styles.stepDescription}>
        {STEP_DESCRIPTIONS[currentStep]}
      </Text>
    )}
  </View>
);
