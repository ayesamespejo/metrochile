import React from 'react'
import { Linking, Pressable, Text, Dimensions, ActivityIndicator } from 'react-native'
import Estilos from '../Estilos'

import ChevronDown from '../assets/svg/flechas/ChevronDown.svg'
import Globals from '../Globals'

const BotonNuevo = (props) => {
  
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
          style={[Estilos.botonText, Estilos.tipografiaLight, 
                { width: Dimensions.get('window').width - 120},
                { fontSize: 16, color: props.title ? props.fontColor : Globals.COLOR.GRIS_4, verticalAlign: 'middle'},

          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.title? props.title : props.placeholder}
        </Text>
        {props.isLoading ? (
          <ActivityIndicator style={{ marginLeft: 5 }} size="small" color="#FFF"></ActivityIndicator>
        ) : (
          //displayIcon()
          <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} style={{ marginLeft: 5, transform: [{ rotate: '-90deg' }] }}/>
        )}
      </Pressable>
    )
}
export default BotonNuevo
