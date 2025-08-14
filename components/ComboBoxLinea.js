import { ScrollView, StyleSheet, Text, View, Pressable, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Estilos from '../Estilos'
import ChevronDown from '../assets/svg/flechas/ChevronDown.svg'
import ChevronUp from '../assets/svg/flechas/ChevronUp.svg'
import Globals from '../Globals'

import Linea1 from '../assets/svg/lineas/Linea1.svg'
import Linea2 from '../assets/svg/lineas/Linea2.svg'
import Linea3 from '../assets/svg/lineas/Linea3.svg'
import Linea4 from '../assets/svg/lineas/Linea4.svg'
import Linea4A from '../assets/svg/lineas/Linea4A.svg'
import Linea5 from '../assets/svg/lineas/Linea5.svg'
import Linea6 from '../assets/svg/lineas/Linea6.svg'

const SCREEN_WIDTH = Dimensions.get('window').width

const lineas = ['1', '2', '3', '4', '4A', '5', '6']

const styles = StyleSheet.create({
  contenedorGeneral: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  selectOption: {
    marginTop: SCREEN_WIDTH * 0.03,
    marginHorizontal: SCREEN_WIDTH * 0.05,
  },
  contenedorTexto: {
    height: 45,
  },
  contenedorSeparador: {
    alignItems: 'center',
  },
  separador: {
    width: SCREEN_WIDTH * 0.8,
    height: 1,
    backgroundColor: Globals.COLOR.GRIS_3,
  },
})

const ComboBoxLinea = (props) => {
  const [linea, setLinea] = useState(props.valorSeleccionado);
  const [listaVisible, setListaVisible] = useState(false);

  const SelectOption = ({ linea, onselect, valorSeleccionado }) => (
    <Pressable
      style={styles.selectOption}
      onPress={() => {
        onselect(linea)
        setListaVisible(false)
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {linea == '1' && <Linea1 width={20} height={20} />}
        {linea == '2' && <Linea2 width={20} height={20} />}
        {linea == '3' && <Linea3 width={20} height={20} />}
        {linea == '4' && <Linea4 width={20} height={20} />}
        {linea == '4A' && <Linea4A width={20} height={20} />}
        {linea == '5' && <Linea5 width={20} height={20} />}
        {linea == '6' && <Linea6 width={20} height={20} />}
        <Text
          style={[
            valorSeleccionado == linea ? Estilos.textoSubtitulo : Estilos.textoGeneral,
            { marginLeft: SCREEN_WIDTH * 0.03 },
          ]}
        >
          Línea {linea}
        </Text>
      </View>
    </Pressable>
  )


  return (
    <View style={styles.contenedorGeneral}>
      <Pressable
        onPress={() => {
          setListaVisible(!listaVisible)
        }}
        style={[Estilos.containerComboClaro, styles.contenedorTexto]}
      >
        <View width={SCREEN_WIDTH * 0.72}>
          {true && (
            <View style={{ flexDirection: 'row' }}>
              {linea == '1' && <Linea1 width={20} height={20} />}
              {linea == '2' && <Linea2 width={20} height={20} />}
              {linea == '3' && <Linea3 width={20} height={20} />}
              {linea == '4' && <Linea4 width={20} height={20} />}
              {linea == '4A' && <Linea4A width={20} height={20} />}
              {linea == '5' && <Linea5 width={20} height={20} />}
              {linea == '6' && <Linea6 width={20} height={20} />}
              <View style={{marginLeft: linea ? SCREEN_WIDTH * 0.03: 0}}>
                <Text
                  style={[
                    Estilos.textoGeneral,
                    { verticalAlign: 'middle' },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {linea ? 'Línea ' + linea : props.placeholder}
                </Text>
              </View>
            </View>
          )}
        </View>
        {!listaVisible && <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} />}
        {listaVisible && <ChevronUp width={20} height={20} fill={Globals.COLOR.GRIS_3} />}
      </Pressable>
      {listaVisible && (
        <ScrollView>
          <View style={styles.contenedorSeparador}>
            <View style={styles.separador} />
          </View>
          <View style={{ marginBottom: SCREEN_WIDTH * 0.05 }}>
            {lineas.map((opcion, index) => {
              return (
                <SelectOption
                  key={index}
                  linea={opcion}
                  valorSeleccionado={props.valorSeleccionado}
                  onselect={(linea) => {
                    setLinea(linea)
                    props.onselect(linea)
                  }}
                />
              )
            })}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default ComboBoxLinea
