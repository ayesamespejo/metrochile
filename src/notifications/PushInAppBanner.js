import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Notificaciones from '../../assets/svg/header/Notificaciones.svg';
import Globals from '../../Globals';
import Estilos from '../../Estilos';

const AUTO_HIDE_MS = 5500;
const ANIM_MS = 280;

export default function PushInAppBanner({
  visible,
  title,
  body,
  onPress,
  onDismiss,
}) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-180);
  const opacity = useSharedValue(0);
  const hideTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const animateOut = callback => {
    clearHideTimer();
    translateY.value = withTiming(
      -180,
      { duration: ANIM_MS, easing: Easing.in(Easing.cubic) },
      finished => {
        if (finished && callback) {
          runOnJS(callback)();
        }
      },
    );
    opacity.value = withTiming(0, { duration: ANIM_MS });
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearHideTimer();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      clearHideTimer();
      translateY.value = -180;
      opacity.value = 0;
      return;
    }

    translateY.value = withTiming(0, {
      duration: ANIM_MS,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, { duration: ANIM_MS });

    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        animateOut(onDismiss);
      }
    }, AUTO_HIDE_MS);

    return clearHideTimer;
  }, [visible, title, body]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    animateOut(onDismiss);
  };

  const handlePress = () => {
    animateOut(() => {
      onDismiss?.();
      onPress?.();
    });
  };

  const topPad = Math.max(insets.top, Platform.OS === 'android' ? 12 : 8);

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        style={[
          styles.bannerWrap,
          { paddingTop: topPad },
          animatedStyle,
        ]}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.banner,
            pressed && styles.bannerPressed,
          ]}>
          <View style={styles.iconWrap}>
            <Notificaciones
              width={22}
              height={22}
              fill={Globals.COLOR.ROJO_METRO}
            />
          </View>

          <View style={styles.content}>
            <Text
              style={[styles.title, Estilos.tipografiaMedium]}
              numberOfLines={1}>
              {title || 'Nueva notificación'}
            </Text>
            <Text
              style={[styles.body, Estilos.tipografiaLight]}
              numberOfLines={2}>
              {body || 'Toca para ver el detalle'}
            </Text>
          </View>

          <Pressable
            onPress={handleDismiss}
            hitSlop={12}
            style={styles.closeBtn}
            accessibilityLabel="Cerrar aviso">
            <Text style={styles.closeX}>×</Text>
          </Pressable>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  bannerWrap: {
    paddingHorizontal: 12,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: Globals.COLOR.GRIS_3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
    paddingRight: 4,
  },
  title: {
    color: '#000000',
    fontSize: 15,
    marginBottom: 2,
  },
  body: {
    color: Globals.COLOR.GRIS_4,
    fontSize: 13,
    lineHeight: 18,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    fontSize: 28,
    lineHeight: 30,
    color: Globals.COLOR.GRIS_4,
    fontWeight: '300',
    marginTop: -2,
  },
});
