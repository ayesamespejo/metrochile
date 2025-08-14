import React from 'react'
import { Linking, Pressable, Text, Image, Dimensions, ActivityIndicator } from 'react-native'
import Estilos from './Estilos'

// const phone_img = require('./assets/1x/phone_white.png')
// const arrow_img = require('./assets/down_arrow.png')

const Boton = (props) => {
  const displayIcon = () => {
    // var w = 18
    // var h = 18
    // var icon = arrow_img
    // if (props.phoneNumber) {
    //   w = 25
    //   h = 25
    //   icon = phone_img
    // }
    // if (props.icon) {
    //   w = 25
    //   h = 25
    //   icon = props.icon
    // }
    // return icon != 'none' ? (
    //   <Image
    //     source={icon}
    //     style={{ marginTop: icon == arrow_img ? 2 : 0, width: w, height: h, resizeMode: 'contain' }}
    //   ></Image>
    // ) : (
    //   <></>
    // )
  }

  return (
    <Pressable
      onPress={() => {
        if (props.phoneNumber) {
          Linking.openURL(`tel:${props.phoneNumber}`)
        } else {
          props.onpress()
        }
      }}
      style={[
        props.type == 'combo' ? Estilos.selectorPlanificador : Estilos.containerPlanificadorViaje,
        { height: 45, backgroundColor: props.color },
      ]}
    >
      <Text
        style={[
          props.type == 'combo'
            ? [Estilos.textoSelectorPlanificador, Estilos.tipografiaMedium]
            : [Estilos.botonText, Estilos.tipografiaBold, { width: Dimensions.get('window').width - 120 }],
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {props.title}
      </Text>

      {props.isLoading ? (
        <ActivityIndicator style={{ marginLeft: 5 }} size="small" color="#FFF"></ActivityIndicator>
      ) : (
        displayIcon()
      )}
    </Pressable>
  )
}
export default Boton
