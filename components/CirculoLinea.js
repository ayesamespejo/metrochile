import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Linea1 from '../assets/svg/lineas/Linea1.svg'
import Linea2 from '../assets/svg/lineas/Linea2.svg'
import Linea3 from '../assets/svg/lineas/Linea3.svg'
import Linea4 from '../assets/svg/lineas/Linea4.svg'
import Linea4A from '../assets/svg/lineas/Linea4A.svg'
import Linea5 from '../assets/svg/lineas/Linea5.svg'
import Linea6 from '../assets/svg/lineas/Linea6.svg'

const CirculoLinea = ({linea, width = 24}) => {
  return (
    <View>
        {linea.toUpperCase() == 'L1' && <Linea1 width={width} height={width}/>}
        {linea.toUpperCase() == 'L2' && <Linea2 width={width} height={width}/>}
        {linea.toUpperCase() == 'L3' && <Linea3 width={width} height={width}/>}
        {linea.toUpperCase() == 'L4' && <Linea4 width={width} height={width}/>}
        {linea.toUpperCase() == 'L4A' && <Linea4A width={width} height={width}/>}
        {linea.toUpperCase() == 'L5' && <Linea5 width={width} height={width}/>}
        {linea.toUpperCase() == 'L6' && <Linea6 width={width} height={width}/>}
    </View>
  )
}

export default CirculoLinea
