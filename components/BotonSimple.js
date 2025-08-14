import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import Estilos from '../Estilos'

const BotonSimple = ({ onPress, texto, color, colorTexto, width, actuando=false }) => {
  const styles = StyleSheet.create({
    contenedorBoton: {
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 23,
      backgroundColor: color,
      width: width,
    },
  })

  return (
    <Pressable onPress={() => {
        if (!actuando) onPress()
    }}>
      <View style={[styles.contenedorBoton, { backgroundColor: color }]}>
        {!actuando && <Text style={[Estilos.textoBoton, { color: colorTexto }]}>{texto}</Text>}
        {actuando && <ActivityIndicator size="small" color={colorTexto}/>}
      </View>
    </Pressable>
  )
}

export default BotonSimple
