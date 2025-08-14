import React from 'react'
import { View, } from 'react-native'

import Linea1 from '../../assets/svg/lineas/Linea1.svg'
import Linea2 from '../../assets/svg/lineas/Linea2.svg'
import Linea3 from '../../assets/svg/lineas/Linea3.svg'
import Linea4 from '../../assets/svg/lineas/Linea4.svg'
import Linea4A from '../../assets/svg/lineas/Linea4A.svg'
import Linea5 from '../../assets/svg/lineas/Linea5.svg'
import Linea6 from '../../assets/svg/lineas/Linea6.svg'
import Linea7 from '../../assets/svg/lineas/Linea7.svg'
import Linea8 from '../../assets/svg/lineas/Linea8.svg'
import Linea9 from '../../assets/svg/lineas/Linea9.svg'

const CirculoLinea = ({ linea, tamanoIcono = 32 }) => {

  return (
    <View >
      {linea.toUpperCase() == '1' && <Linea1 width={tamanoIcono} height={tamanoIcono} />}
      {linea.toUpperCase() == '2' && <Linea2 width={tamanoIcono} height={tamanoIcono}  />}
      {linea.toUpperCase() == '3' && <Linea3 width={tamanoIcono} height={tamanoIcono}  />}
      {linea.toUpperCase() == '4' && <Linea4 width={tamanoIcono} height={tamanoIcono}  />}
      {linea.toUpperCase() == '4A' && <Linea4A width={tamanoIcono} height={tamanoIcono} />}
      {linea.toUpperCase() == '5' && <Linea5 width={tamanoIcono} height={tamanoIcono} />}
      {linea.toUpperCase() == '6' && <Linea6 width={tamanoIcono} height={tamanoIcono} />}
      {linea.toUpperCase() == '7' && <Linea7 width={tamanoIcono} height={tamanoIcono} />}
      {linea.toUpperCase() == '8' && <Linea8 width={tamanoIcono} height={tamanoIcono} />}
      {linea.toUpperCase() == '9' && <Linea9 width={tamanoIcono} height={tamanoIcono} />}
    </View>
  )
}
export default CirculoLinea
