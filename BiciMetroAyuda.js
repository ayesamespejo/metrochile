import React, { useState } from 'react'
import { Image, StyleSheet, View, Text, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Estilos from './Estilos'
const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    marginTop: WIDTH * 0.08,
    flex: 1,
    width: WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  filaIzq: {
    flexDirection: 'row',
  },
  circulo: {
    width: 130,
    height: 135,
  },
  box1: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: WIDTH * 0.08,
    right: -130,
    width: '60%',
  },
  box2: {
    display: 'flex',
    flexDirection: 'row',
    width: '60%',
  },
  box3: {
    display: 'flex',
    flexDirection: 'column',
    bottom: 130,
    right: -130,
    width: '60%',
  },
  ball: {
    width: 130,
    height: 135,
    top: 30,
    left: -20,
  },
  ball3: {
    width: 130,
    height: 135,
    top: -8,
    left: -20,
  },
})

const BiciMetroAyuda = (props) => {
  const data = props.route.params.data
  console.log(JSON.stringify(data))

  props.navigation.setOptions({ title: 'BiciMetro' })

  /**
   *  Mapa de data para los textos del funcionamiento.
   *  El indice 10 representa el primer mensaje de "debe pagar 300"
   *  El indice 11 representa el segundo mensaje de "debe pagar 1000"
   *  El indice 7 es el primer mensaje del "Se considera" que habla de las guarderias
   *  El indice 8 es el segundo mensaje del "Se considera" que habla de la asistencia
   *  El indice 9 es el primer mensaje del "Se considera" que habla de que metro se reserva el derecho
   */
  const textosDesdeElApi = data.estacion[0]

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.container]}>
        <View style={styles.filaIzq}>
          <View style={{ flex: 9 }}></View>
          <View style={[Estilos.textoGeneral, { flex: 20, justifyContent: 'center' }]}>
            <Text style={[Estilos.textoTitulo, { marginTop: -15 }]}>¿Cómo Funciona?</Text>
          </View>
        </View>
        <View style={styles.filaIzq}>
          <View style={{ flex: 9 }}>
            <Image
              source={require('./assets/imagenes/intermodalidad/ball_1.png')}
              style={[styles.circulo, { marginLeft: -30 }]}
            />
          </View>
          <View style={[{ flex: 20, justifyContent: 'center' }]}>
            <Text style={Estilos.textoGeneral}>{textosDesdeElApi[10]}</Text>
          </View>
        </View>
        <View style={styles.filaIzq}>
          <View style={[Estilos.textoGeneral, { flex: 20, justifyContent: 'center' }]}>
            <Text style={[Estilos.textoGeneral, { marginLeft: 30 }]}>{textosDesdeElApi[11]}</Text>
          </View>
          <View style={{ flex: 9 }}>
            <Image
              source={require('./assets/imagenes/intermodalidad/ball_2.png')}
              style={[styles.circulo, { marginLeft: 20 }]}
            />
          </View>
        </View>
        <View style={styles.filaIzq}>
          <View style={{ flex: 9 }}>
            <Image
              source={require('./assets/imagenes/intermodalidad/ball_3.png')}
              style={[styles.circulo, { marginLeft: -30 }]}
            />
          </View>
          <View style={[{ flex: 20, justifyContent: 'center' }]}>
            <Text style={[Estilos.textoSubtitulo]}>Considera que:</Text>
            <Text style={[Estilos.textoGeneral, { marginTop: WIDTH * 0.05 }]}>* {textosDesdeElApi[7]}</Text>
          </View>
        </View>
        <Text
          style={[
            Estilos.textoGeneral,
            {
              marginTop: WIDTH * 0.05,
              textAlign: 'justify',
            },
          ]}
        >
          * {textosDesdeElApi[8]}
        </Text>
        <Text
          style={[
            Estilos.textoGeneral,
            {
              marginTop: WIDTH * 0.05,
              textAlign: 'justify',
            },
          ]}
        >
          * {textosDesdeElApi[9]}
        </Text>
      </View>
    </ScrollView>
  )
}

export default BiciMetroAyuda
