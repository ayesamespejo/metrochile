import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Globals from './Globals'
import SelectorEstacion from './js/components/SelectorEstacion'

const WIDTH = Dimensions.get('window').width

const InformacionEstaciones = (props) => {
  const [token, setToken] = useState('')
  const [mostrarToken, setMostrarToken] = useState(false)
  console.log('informacion 22');

  useEffect(() => {
    AsyncStorage.getItem(Globals.KEY_TOKEN).then((token) => {
      setToken(token)
    })
  }, [])

  return (
    <View style={{paddingHorizontal: WIDTH * 0.05}}>
      {mostrarToken && <Text selectable={true}>{token}</Text>}
      {
      <SelectorEstacion
        onSelect={() => {}}
        todasEstaciones={true}
        onCerrar={() => {}}
        informacionEstacion={true}
        onSelectInformacion={(codigoEstacion) => props.navigation.push('Estacion', { data: codigoEstacion })}
        setMostrarToken={setMostrarToken}
        mostrarCerrar={false}
      />
      }
    </View>
  )
}

export default InformacionEstaciones
