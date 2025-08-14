import { ScrollView, StyleSheet, Text, View, Pressable, } from 'react-native'
import React, { useState, useEffect } from 'react'
import Estilos from '../Estilos'
import ChevronDown from '../assets/svg/flechas/ChevronDown.svg'
import ChevronUp from '../assets/svg/flechas/ChevronUp.svg'
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType'
// import MagnifyingGlass from '../assets/svg/magnifying-glass.svg'
import Globals from '../Globals'

const styles = StyleSheet.create({
  contenedorGeneral: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
  },
  selectOption: {
    //backgroundColor: '#ccc',
    padding: 10,
    margin: 4,
    marginHorizontal: 10,
    borderBottomColor: '#666',
    borderRadius: 7,
  },
  contenedorTexto: { 
    height: 45, 
},
  texto: { 
    fontSize: 16, 
    color: '#000000',
    width: '90%',
},
  contenedorOpciones: { 
    marginTop: 7, 
},
contenedorSeparador: { 
    alignItems: 'center', 
},
separador: { 
    width: '95%', 
    height: 1, 
    backgroundColor: Globals.COLOR.GRIS_3 
},
  textoOpcion: { 
    fontSize: 16, 
    },
})

const SelectOption = ({ item, onselect }) => (
  <Pressable
    style={styles.selectOption}
    onPress={() => {
      onselect(item)
    }}
  >
    <Text style={[Estilos.tipografiaLight, styles.textoOpcion]}>{typeof item == 'string' ? item : item.title}</Text>
  </Pressable>
)

const ComboBoxNuevo = (props) => {
  const [state, setState] = useState({
    menuVisible: false,
    name: '',
  })

  useEffect(() => {
    setState({ ...state, name: props.title })
  }, [])

  return (
    <View style={styles.contenedorGeneral}>
      <Pressable
        onPress={() => {
          if (state.menuVisible) {
            setState({ ...state, menuVisible: false })
          } else {
            setState({ ...state, menuVisible: true })
          }
        }}
        style={[Estilos.containerComboClaro, styles.contenedorTexto]}
      >
        <Text
          style={[Estilos.tipografiaLight, styles.texto, state.name && state.name != 'Selecciona tipo de reclamo' ? {} : {color: Globals.COLOR.GRIS_4}, {verticalAlign: 'middle'}]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {state.name ? state.name : props.placeholder}
        </Text>
        {!state.menuVisible && <ChevronDown width={20} height={20} fill={Globals.COLOR.GRIS_3}/>}
        {state.menuVisible && <ChevronUp width={20} height={20} fill={Globals.COLOR.GRIS_3}/>}
      </Pressable>

      {state.menuVisible &&
        <ScrollView style={styles.contenedorOpciones}>
          <View style={styles.contenedorSeparador}>
            <View style={styles.separador} />
          </View>
          {props.data.map((item, index) => {
            return (
              <SelectOption
                key={index}
                item={item}
                onselect={(item) => {
                  props.onselect(item)
                  setState({ ...state, menuVisible: false, name: typeof item == 'string' ? item : item.title })
                }}
              ></SelectOption>
            )
          })}
        </ScrollView>}
    </View>
  )
}

export default ComboBoxNuevo
