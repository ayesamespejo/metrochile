import React, { useState } from 'react'
import { Pressable, StyleSheet, Dimensions, View, Text } from 'react-native'
import Estilos from './Estilos'

const WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  background: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#DDD',
    marginTop: WIDTH * 0.08,
    borderRadius: 5,
  },
  tab: {
    textAlign: 'center',
    alignContent: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 5,
    paddingHorizontal: 6,
    width: 120,
  },
  selected: {
    backgroundColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  unselected: {
    backgroundColor: '#DDD',
  },
})

const Tab = ({ index, selected, value, onselected }) => (
  <Pressable
    onPress={() => {
      onselected(index)
    }}
    style={[styles.tab, selected ? styles.selected : styles.unselected]}
  >
    <Text style={[{ textAlign: 'center' }, Estilos.bajada]}>{value}</Text>
  </Pressable>
)

const SegmentedControl = (props) => {

    const [state, setState] = useState(
        {
            selectedIndex: 0,
          }
    );

    const { selectedIndex } = state
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View style={styles.background}>
          <Tab
            index={0}
            value="Ahora"
            selected={selectedIndex == 0}
            onselected={(index) => {
              setState({ ...state, selectedIndex: index })
              props.onSelected(index)
            }}
          />
          <Tab
            index={1}
            value="Más Tarde"
            selected={selectedIndex == 1}
            onselected={(index) => {
              setState({ ...state, selectedIndex: index })
              props.onSelected(index)
            }}
          />
        </View>
      </View>
    )
}

export default SegmentedControl
