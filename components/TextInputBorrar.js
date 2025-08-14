import { StyleSheet, Image, TextInput, View, TouchableOpacity, Pressable } from 'react-native'
import React, { useRef } from 'react'
import Estilos from '../Estilos'
import Globals from '../Globals'
import CerrarCirculo from '../assets/svg/comun/CerrarCirculo.svg'

const TextInputBorrar = (props) => {
  const textInputRef = useRef(null)

  const {
    keyboardType,
    placeholderTextColor = Globals.COLOR.GRIS_4,
    maxLength,
    autoCorrect,
    placeholder,
    value,
    setValue,
    disabled = false,
    borderColor = Globals.COLOR.GRIS_3,
    borderWidth = 2,
    width = 280,
    style = {},
    fontSize = 16,
    marginTop = 0,
    onChangeText,
    editable=true,
    selectTextOnFocus=true
  } = props

  const styles = StyleSheet.create({
    contenedorGeneral: {
      marginTop: marginTop,
    },
    contenedorTextInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: !disabled ? '#FFFF' : Globals.COLOR.GRIS_2,
      borderRadius: 23,
      borderWidth: borderWidth,
      borderColor: borderColor,
      width: width ? width : '100%',
      height: 45,
      fontSize: 16,
    },
    textInput: {
      height: 40,
      width: '90%',
      paddingLeft: 10,
      fontSize: fontSize,
    },
    closeButton: {
      height: 16,
      width: 16,
    },
    closeButtonParent: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 5,
    },
  })

  return (
    <View style={styles.contenedorGeneral}>
      <Pressable onPress={() => textInputRef.current.focus()}>
        <View style={styles.contenedorTextInput}>
          <TextInput
            ref={textInputRef}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            placeholder={placeholder}
            maxLength={maxLength}
            autoCorrect={autoCorrect}
            value={value}
            onChangeText={(text) => onChangeText(text)}
            style={[Estilos.tipografiaLight, styles.textInput]}
            editable={editable} 
            selectTextOnFocus={selectTextOnFocus} 
          />
          <TouchableOpacity style={styles.closeButtonParent} onPress={() => onChangeText('')}>
            {value && !disabled && <CerrarCirculo width={20} height={20} fill={Globals.COLOR.GRIS_3} />}
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  )
}

export default TextInputBorrar
