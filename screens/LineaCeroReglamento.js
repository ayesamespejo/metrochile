import { useState } from 'react'
import { StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated'

export default function LineaCeroReglamento() {
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const ANCHO_IMAGEN = 638
  const ALTO_IMAGEN = 927

  const escalaInicial = (width / ANCHO_IMAGEN) * 0.95
  const bordeSuperior = ALTO_IMAGEN / 2 - width / 1.3
  const translateInicial = -(ANCHO_IMAGEN / 2 - width / 2)

  const translateX = useSharedValue(translateInicial)

  const escalaImg = useSharedValue(escalaInicial)
  const escalaImgOrigen = useSharedValue(escalaInicial)

  const translateY = useSharedValue(-bordeSuperior)
  const origenX = useSharedValue(0)
  const origenY = useSharedValue(0)

  const [cargando, setCargando] = useState(true)

  const dragGesture = Gesture.Pan()
    .onStart((event, context) => {
      origenX.value = translateX.value
      origenY.value = translateY.value
      // popupAlpha.value = withTiming(0);
    })
    .onUpdate((event, context) => {
      translateX.value = event.translationX + origenX.value
      translateY.value = event.translationY + origenY.value
    })
    .onEnd(() => {
      // console.log('TranslateX: ', translateX.value)
      // console.log('TranslateY: ', translateY.value)
    })

  const pinchazoPantalla = Gesture.Pinch()
    .onStart((event) => {
      // console.log('Ancho: ', ANCHO_IMAGEN)
    })
    .onUpdate((event) => {
      escalaImg.value = event.scale * escalaImgOrigen.value
    })
    .onEnd(() => {
      // console.log('Escala: ', escalaImg.value)
      escalaImgOrigen.value = escalaImg.value
    })

  const composed = Gesture.Race(pinchazoPantalla, dragGesture)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapa: {
      width: width,
      height: height,
      backgroundColor: '#F1F1F1',
      overflow: 'hidden',
    },
    img: {
      // resizeMode: 'cover',
      width: ANCHO_IMAGEN,
      height: ALTO_IMAGEN,
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: escalaImg.value }],
    },
  })

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: escalaImg.value }],
  }))

  return (
    <View style={[styles.mapa]}>
      {cargando && (
        <View style={{ marginTop: height / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      )}
      <GestureHandlerRootView>
        <GestureDetector gesture={composed}>
          <Animated.Image
            style={[styles.img, estiloAnimado]}
            source={{
              uri: 'https://d37nosr7rj2kog.cloudfront.net/reglamento_linea0.jpg',
            }}
            onLoadEnd={() => setCargando(false)}
          />
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  )
}
