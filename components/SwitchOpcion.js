import { View, Text, Pressable, StyleSheet, } from 'react-native'
import React, {useState, useEffect} from 'react'
import Estilos from '../Estilos'
import Globals from '../Globals'

const SwitchOpcion = ({opciones, onSelect, ancho}) => {

  const [opcionSeleccionada, setOpcionSeleccionada] = useState(opciones[0]);

  const styles = StyleSheet.create({
    contenedor: {
      flexDirection: 'row',
      width: ancho ?? 100,
      height: 40,
      padding: 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 25,
    },
    contenedorOpcion: {
      height: 25, 
      borderRadius: 20, 
      paddingHorizontal: 10, 
      alignItems: 'center', 
      justifyContent: 'center'
    },
  })

  useEffect(() => {
    onSelect(opciones[0])
  }, [])
  
  return (
    <View
    style={styles.contenedor}
  >
    <Pressable style={[styles.contenedorOpcion, {backgroundColor: opcionSeleccionada == opciones[0] ? Globals.COLOR.TURQUESA_QR : Globals.COLOR.GRIS_1}]} 
    onPress={() => {
      setOpcionSeleccionada(opciones[0])
      onSelect(opciones[0])
      }}>
      <Text style={[opcionSeleccionada == opciones[0] ? Estilos.textoSubtitulo : Estilos.textoGeneral, {color: opcionSeleccionada == opciones[0] ? '#FFFFFF' : '#000000',}]}>{opciones[0]}</Text>
    </Pressable>
    <Pressable style={[styles.contenedorOpcion, {marginLeft: 10, backgroundColor: opcionSeleccionada == opciones[1] ? Globals.COLOR.TURQUESA_QR : Globals.COLOR.GRIS_1}]} 
    onPress={() =>{
    setOpcionSeleccionada(opciones[1])
    onSelect(opciones[1])
    }}>
      <Text style={[opcionSeleccionada == opciones[1] ? Estilos.textoSubtitulo : Estilos.textoGeneral,{color: opcionSeleccionada == opciones[1] ? '#FFFFFF' : '#000000',}]}>{opciones[1]}</Text>
    </Pressable>
  </View>
  )
}


export default SwitchOpcion
