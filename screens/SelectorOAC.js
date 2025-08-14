import { StyleSheet, Text, View, Dimensions, Pressable, ScrollView , ActivityIndicator, SafeAreaView} from 'react-native'
import React, { useEffect, useState } from 'react'
import Globals from '../Globals'
import Estilos from '../Estilos'

import Linea1 from '../assets/svg/lineas/Linea1.svg'
import Linea2 from '../assets/svg/lineas/Linea2.svg'
import Linea3 from '../assets/svg/lineas/Linea3.svg'
import Linea4 from '../assets/svg/lineas/Linea4.svg'
import Linea4A from '../assets/svg/lineas/Linea4A.svg'
import Linea5 from '../assets/svg/lineas/Linea5.svg'
import Linea6 from '../assets/svg/lineas/Linea6.svg'

import ChevronDown from '../assets/svg/flechas/ChevronDown.svg'

const WIDTH = Dimensions.get('window').width
const SLIDER_HEIGHT = Dimensions.get('window').height

const CirculoLinea = (linea) => {
  switch (linea.toUpperCase()) {
    case 'L1':
      return <Linea1 width={32} height={32} />
    case 'L2':
      return <Linea2 width={32} height={32} />
    case 'L3':
      return <Linea3 width={32} height={32} />
    case 'L4':
      return <Linea4 width={32} height={32} />
    case 'L4A':
      return <Linea4A width={32} height={32} />
    case 'L5':
      return <Linea5 width={32} height={32} />
    case 'L6':
      return <Linea6 width={32} height={32} />
  }
}

const SelectorOAC = (props) => {

  const [estacionesOAC, setEstacionesOAC] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const urlOAC = 'https://p7boyp8vs9.execute-api.us-east-1.amazonaws.com/UAT/oac'
  
  const getOAC = () => {
    fetch(urlOAC)
      .then((res) => res.json())
      .then((res) => {
        setEstacionesOAC(res.Items.sort((a, b) => a['Línea'] - b['Línea']))
        setLoading(false)
    })
  }

  useEffect(() => {
    getOAC()
    props.navigation.setOptions({ title: 'Oficina de atención a clientes' })

  }, [])

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SLIDER_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <ScrollView style={{marginBottom: WIDTH * 0.05}}>
      <View style={styles.contenedorGeneral}>
        {estacionesOAC.map((estacion) => (
          <Pressable
            key={estacion.Cod_estacion}
            onPress={() => {
              props.navigation.push('OficinaDeAtencionClientes', {
                codigo: estacion.Cod_estacion,
                data: '',
                estacion: estacion.Estacion,
                linea: `L${estacion.Línea}`,
                tipo: '',
              })
            }}
          >
            <View style={styles.fila}>
              <View style={styles.textoFila}>
                {CirculoLinea(`L${estacion.Línea}`)}
                <Text style={[Estilos.textoSubtitulo, { marginLeft: WIDTH * 0.03 }]}>{estacion.Estacion}</Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <ChevronDown
                  width={20}
                  height={20}
                  fill={Globals.COLOR.GRIS_3}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

export default SelectorOAC

const styles = StyleSheet.create({
  contenedorGeneral: {
    padding: WIDTH * 0.05,
    paddingTop: WIDTH * 0.03,
  },
  fila: {
    marginTop: WIDTH * 0.05,
    flexDirection: 'row',
    padding: WIDTH * 0.05,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  textoFila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
