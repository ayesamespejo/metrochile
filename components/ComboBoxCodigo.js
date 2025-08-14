import { ScrollView, StyleSheet, Text, View, Pressable, Dimensions } from 'react-native'
import React, { useState, useEffect, forwardRef  } from 'react'
import Estilos from '../Estilos'
import ChevronDown from '../assets/svg/flechas/ChevronDown.svg'
import ChevronUp from '../assets/svg/flechas/ChevronUp.svg'
import Globals from '../Globals'

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  contenedorGeneral: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  selectOption: {
    marginTop: WIDTH * 0.03,
    marginHorizontal: WIDTH * 0.05,
  },
  linea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTH * 0.05,
    paddingVertical: WIDTH * 0.03,
  },
  contenedorSeparador: {
    alignItems: 'center',
  },
  separador: {
    width: '90%',
    height: 1,
    backgroundColor: Globals.COLOR.GRIS_3,
  },
})

const SelectOption = ({ item, onChange, campoLabel, setSelectedLabel }) => (
  <Pressable
    style={styles.selectOption}
    onPress={() => {
      setSelectedLabel(item[campoLabel])
      onChange(item)
    }}
  >
    <Text style={[Estilos.textoGeneral]}>{item[campoLabel]}</Text>
  </Pressable>
)

const ComboBoxCodigo = ({ campoLabel, data, onChangeValue, placeholder, value}) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('');

  return (
    <View style={styles.contenedorGeneral}>
      <Pressable
        onPress={() => {
          if (menuVisible) {
            setMenuVisible(false)
          } else {
            setMenuVisible(true)
          }
        }}
        style={[styles.linea]}
      >
          <Text
            style={[!value ? Estilos.textoGeneral : Estilos.textoSubtitulo, { verticalAlign: 'middle' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {value ? selectedLabel : placeholder}
          </Text>
        {!menuVisible && <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3} />}
        {menuVisible && <ChevronUp width={20} height={20} fill={Globals.COLOR.GRIS_3} />}
      </Pressable>

      {menuVisible && data.length > 0 && (
        <ScrollView style={styles.contenedorOpciones}>
          <View style={styles.contenedorSeparador}>
            <View style={styles.separador} />
          </View>
          {data.map((item, index) => {
            return (
              <SelectOption
                key={index}
                item={item}
                campoLabel={campoLabel}
                onChange={(item) => {
                  onChangeValue(item)
                  setMenuVisible(false)
                }}
                setSelectedLabel={setSelectedLabel}
              />
            )
          })}
          <View height={WIDTH * 0.05} />
        </ScrollView>
      )}
    </View>
  )
}

export default ComboBoxCodigo
